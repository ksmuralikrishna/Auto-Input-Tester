document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching Logic ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
      });
    });
  
    // --- Load Saved Data ---
    chrome.storage.local.get(null, data => {
      for (let key in data) {
        const field = document.getElementById(key);
        if (field) field.value = data[key];
      }
    });
  
    // --- Save Settings ---
    document.getElementById('saveBtn').addEventListener('click', () => {
      const formData = {};
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        formData[input.id] = input.value;
      });
  
      chrome.storage.local.set(formData, () => {
        showStatus('Settings saved successfully!', 'success');
      });
    });
  
    // --- Clear All Settings ---
    document.getElementById('clearBtn').addEventListener('click', () => {
      chrome.storage.local.clear(() => {
        document.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
        showStatus('All settings cleared!', 'warning');
      });
    });
  
    // --- Show Status Message ---
    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = `status ${type}`;
      status.style.opacity = 1;
  
      setTimeout(() => {
        status.style.opacity = 0;
      }, 2500);
    }
  });
  