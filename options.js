// options.js - Handles saving and loading user data

// Load saved data when page opens
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

// Save settings
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveSettings();
});

// Clear all data
document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        clearSettings();
    }
});

function saveSettings() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        address1: document.getElementById('address1').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        jobTitle: document.getElementById('jobTitle').value,
        company: document.getElementById('company').value,
        education: document.getElementById('education').value,
        skills: document.getElementById('skills').value,
        linkedIn: document.getElementById('linkedIn').value,
        website: document.getElementById('website').value,
        bio: document.getElementById('bio').value
    };

    // Save to Chrome storage
    chrome.storage.local.set({ autoFillData: formData }, function() {
        showStatus('Settings saved successfully!', 'success');
    });
}

function loadSettings() {
    chrome.storage.local.get(['autoFillData'], function(result) {
        if (result.autoFillData) {
            const data = result.autoFillData;
            
            // Populate all fields
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('dob').value = data.dob || '';
            document.getElementById('gender').value = data.gender || '';
            document.getElementById('address1').value = data.address1 || '';
            document.getElementById('address2').value = data.address2 || '';
            document.getElementById('city').value = data.city || '';
            document.getElementById('state').value = data.state || '';
            document.getElementById('zipCode').value = data.zipCode || '';
            document.getElementById('country').value = data.country || '';
            document.getElementById('jobTitle').value = data.jobTitle || '';
            document.getElementById('company').value = data.company || '';
            document.getElementById('education').value = data.education || '';
            document.getElementById('skills').value = data.skills || '';
            document.getElementById('linkedIn').value = data.linkedIn || '';
            document.getElementById('website').value = data.website || '';
            document.getElementById('bio').value = data.bio || '';
        }
    });
}

function clearSettings() {
    chrome.storage.local.remove(['autoFillData'], function() {
        document.getElementById('settingsForm').reset();
        showStatus('All data cleared!', 'success');
    });
}

function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = 'status-message ' + type;
    statusEl.style.display = 'block';
    
    setTimeout(function() {
        statusEl.style.display = 'none';
    }, 3000);
}