// Update the delete confirmation message in the explorer view
document.getElementById('deleteModal').querySelector('.modal-body').innerHTML = `
  <p>Are you sure you want to move <span id="deleteItemName"></span> to trash?</p>
  <p>Items in trash will be automatically deleted after 30 days.</p>
  <input type="hidden" id="deleteItemId">
`;

// Update the delete button text
document.getElementById('deleteItemBtn').innerHTML = `<i class="bi bi-trash"></i> Move to Trash`;

// Update the delete button in the dropdown menu text
document.querySelectorAll('.delete-item').forEach(button => {
  const deleteText = button.querySelector('i.bi-trash').parentNode;
  deleteText.innerHTML = '<i class="bi bi-trash"></i> Move to Trash';
});
