const API_URL = 'http://localhost:3000/api/portfolio';

document.addEventListener('DOMContentLoaded', fetchRecords);

const form = document.getElementById('crud-form');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

async function fetchRecords() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const tbody = document.getElementById('data-table');
  tbody.innerHTML = '';
  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.owner_name}</td>
        <td>${item.title}</td>
        <td>${item.category}</td>
        <td>${item.skills}</td>
        <td>
          <button onclick="editRecord(${item.id})">Edit</button>
          <button class="btn-delete" onclick="deleteRecord(${item.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('record-id').value;
  const payload = {
    owner_name: document.getElementById('owner_name').value,
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    skills: document.getElementById('skills').value,
    project_url: document.getElementById('project_url').value
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  resetForm();
  fetchRecords();
});

async function editRecord(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const item = await res.json();
  document.getElementById('record-id').value = item.id;
  document.getElementById('owner_name').value = item.owner_name;
  document.getElementById('title').value = item.title;
  document.getElementById('category').value = item.category;
  document.getElementById('skills').value = item.skills;
  document.getElementById('project_url').value = item.project_url || '';

  saveBtn.textContent = 'Update Record';
  cancelBtn.style.display = 'inline-block';
}

async function deleteRecord(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchRecords();
  }
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  document.getElementById('record-id').value = '';
  form.reset();
  saveBtn.textContent = 'Save Record';
  cancelBtn.style.display = 'none';
}