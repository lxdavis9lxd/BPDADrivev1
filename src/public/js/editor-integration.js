/**
 * Editor Integration
 * Handles live preview and file locking functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileContent = document.getElementById('fileContent');
    const previewContent = document.getElementById('previewContent');
    const saveFileBtn = document.getElementById('saveFileBtn');
    const forceSaveBtn = document.getElementById('forceSaveBtn');
    const lockStatus = document.getElementById('lockStatus');
    
    // Variables
    const fileId = document.querySelector('[data-file-id]')?.getAttribute('data-file-id');
    const clientId = document.querySelector('[data-client-id]')?.getAttribute('data-client-id');
    let previewDebounceTimeout;
    let saveTimeout;
    let isTyping = false;
    
    // Function to update preview in real-time
    const updatePreview = () => {
        clearTimeout(previewDebounceTimeout);
        
        // Debounce preview updates (50ms)
        previewDebounceTimeout = setTimeout(() => {
            fetch('/editor/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: fileContent.value })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    previewContent.innerHTML = data.preview;
                    
                    // Scroll preview to match editor's scroll position (proportionally)
                    const editorScrollPercentage = fileContent.scrollTop / (fileContent.scrollHeight - fileContent.clientHeight);
                    const previewScrollTarget = editorScrollPercentage * (previewContent.scrollHeight - previewContent.clientHeight);
                    previewContent.scrollTop = previewScrollTarget;
                }
            })
            .catch(error => {
                console.error('Preview error:', error);
            });
        }, 50); // Short debounce for responsive typing experience
    };
    
    // Function to save file
    const saveFile = (force = false) => {
        if (!fileId) return;
        
        isTyping = false;
        fetch(`/editor/${fileId}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                content: fileContent.value,
                forceSave: force 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show save indicator
                saveFileBtn.classList.remove('btn-primary');
                saveFileBtn.classList.add('btn-success');
                saveFileBtn.innerHTML = '<i class="bi bi-check-circle"></i> Saved';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    saveFileBtn.classList.remove('btn-success');
                    saveFileBtn.classList.add('btn-primary');
                    saveFileBtn.innerHTML = '<i class="bi bi-save"></i> Save';
                }, 2000);
            } else {
                // Handle lock errors
                if (data.lockInfo) {
                    updateLockStatus(data.lockInfo);
                }
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Save error:', error);
            alert('Failed to save file');
        });
    };
    
    // Function to update lock status
    const updateLockStatus = (lockInfo) => {
        if (!lockStatus) return;
        
        if (lockInfo) {
            const isOwner = lockInfo.user === document.querySelector('[data-username]')?.getAttribute('data-username') && 
                           lockInfo.client === clientId;
            
            lockStatus.innerHTML = `
                <div class="alert alert-${isOwner ? 'success' : 'warning'} py-1 px-2 d-inline-block">
                    <i class="bi bi-${isOwner ? 'unlock' : 'lock'}-fill"></i> 
                    ${isOwner ? 'You have locked this file for editing' : `Locked by ${lockInfo.user}`}
                </div>
            `;
            
            // Update UI based on lock status
            if (!isOwner) {
                fileContent.setAttribute('readonly', 'readonly');
                saveFileBtn.setAttribute('disabled', 'disabled');
                
                // Add force save button if not already present
                if (forceSaveBtn === null && document.getElementById('forceSaveBtn') === null) {
                    const newForceSaveBtn = document.createElement('button');
                    newForceSaveBtn.id = 'forceSaveBtn';
                    newForceSaveBtn.className = 'btn btn-warning ms-2';
                    newForceSaveBtn.title = 'Override lock and save anyway';
                    newForceSaveBtn.innerHTML = '<i class="bi bi-shield-exclamation"></i> Force Save';
                    newForceSaveBtn.addEventListener('click', () => saveFile(true));
                    saveFileBtn.parentNode.appendChild(newForceSaveBtn);
                }
            } else {
                fileContent.removeAttribute('readonly');
                saveFileBtn.removeAttribute('disabled');
            }
        } else {
            lockStatus.innerHTML = `
                <div class="alert alert-info py-1 px-2 d-inline-block">
                    <i class="bi bi-unlock"></i> File is not locked
                </div>
            `;
            fileContent.removeAttribute('readonly');
            saveFileBtn.removeAttribute('disabled');
        }
    };
    
    // Function to check lock status periodically
    const checkLockStatus = () => {
        if (!fileId) return;
        
        fetch(`/editor/${fileId}/lock`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateLockStatus(data.lockInfo);
                }
            })
            .catch(error => {
                console.error('Check lock error:', error);
            });
    };
    
    // Event listeners
    if (fileContent) {
        // Update preview when content changes (real-time)
        fileContent.addEventListener('input', () => {
            isTyping = true;
            updatePreview();
            
            // Auto-save after 2 seconds of inactivity
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (!isTyping) return;
                saveFile();
            }, 2000);
        });
        
        // Sync scroll between editor and preview
        fileContent.addEventListener('scroll', () => {
            if (!isTyping) {
                const editorScrollPercentage = fileContent.scrollTop / (fileContent.scrollHeight - fileContent.clientHeight);
                const previewScrollTarget = editorScrollPercentage * (previewContent.scrollHeight - previewContent.clientHeight);
                previewContent.scrollTop = previewScrollTarget;
            }
        });
        
        // Initial preview update
        updatePreview();
    }
    
    // Save button click handler
    if (saveFileBtn) {
        saveFileBtn.addEventListener('click', () => saveFile(false));
    }
    
    // Force save button click handler (if present)
    if (forceSaveBtn) {
        forceSaveBtn.addEventListener('click', () => saveFile(true));
    }
    
    // Check lock status every 30 seconds
    if (fileId) {
        setInterval(checkLockStatus, 30000);
    }
});
