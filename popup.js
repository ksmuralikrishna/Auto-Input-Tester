// popup.js - Enhanced Chrome Extension for Auto-filling Forms
// This extension provides two main features:
// 1. Test Input Feature: Allows custom test data entry
// 2. Smart Autofill Detection: Automatically detects and fills all form field types

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById("currentUrl").textContent = new URL(tab.url).hostname;

  // Count number of forms and input fields on the page
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const forms = document.forms.length;
        const inputs = document.querySelectorAll("input, textarea, select").length;
        return { forms, inputs };
      },
    },
    (results) => {
      const data = results && results[0] ? results[0].result : { forms: 0, inputs: 0 };
      document.getElementById("formCount").textContent = `${data.forms} forms, ${data.inputs} fields`;
    }
  );

  // Event handlers
  document.getElementById("autoFillBtn").addEventListener("click", () => autoFill(tab.id));
  document.getElementById("clearFormsBtn").addEventListener("click", () => clearForms(tab.id));
  
  // Add keyboard shortcut for test input (Enter key to auto-fill)
  document.getElementById("testInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      autoFill(tab.id);
    }
  });
});

// ------------------------------------------------------------
// 🔹 Auto Fill - Enhanced with Test Input Support
// ------------------------------------------------------------
function autoFill(tabId) {
  // Get the test input value from the popup
  const testInput = document.getElementById("testInput").value.trim();
  
  chrome.scripting.executeScript({
    target: { tabId },
    func: autoDetectAndFill,
    args: [testInput] // Pass the test input to the content script
  }, (results) => {
    // Get the number of filled fields from the content script
    const filledCount = results && results[0] ? results[0].result : 0;
    const message = testInput ? 
      `Auto-filled ${filledCount} fields with custom input: "${testInput}"` : 
      `Auto-filled ${filledCount} fields with smart dummy data`;
    logActivity(message);
  });
}

// ------------------------------------------------------------
// 🔹 Clear Forms
// ------------------------------------------------------------
function clearForms(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      document.querySelectorAll("input, textarea, select").forEach((el) => {
        if (el.type === "checkbox" || el.type === "radio") el.checked = false;
        else el.value = "";
      });
    },
  });

  logActivity("Cleared all form fields");
}



// ------------------------------------------------------------
// 🔹 Smart Auto Detect and Fill Function
// Enhanced to handle all input types with comprehensive dummy data
// ------------------------------------------------------------
function autoDetectAndFill(customTestInput = "") {
  // Comprehensive dummy data generator
  const dummyData = {
    // Personal Information
    firstName: "Muralikrishna",
    lastName: "K S", 
    fullName: "Muralikrishna K S",
    email: "ksmuralikrishnaaa@gmail.com",
    phone: "9946307722",
    mobile: "9946307722",
    
    // Address Information
    address: "Kokkuvayil House",
    address2: "Kodungallur",
    city: "Thrissur",
    state: "Kerala",
    zipCode: "680669",
    country: "India",
    fullAddress: "Kokkuvayil House, Kodungallur, Thrissur, Kerala, 680669, India",
    
    // Professional Information
    company: "Dentsoftware",
    jobTitle: "DotNet Developer",
    department: "Engineering",
    website: "https://www.dentsoftware.com/",
    
    // Account Information
    username: "johndoe123",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    
    // Financial Information
    creditCard: "4532-1234-5678-9012",
    cvv: "123",
    expiryDate: "12/25",
    bankAccount: "1234567890",
    routingNumber: "021000021",
    
    // Other Common Fields
    date: "2024-01-15",
    time: "14:30",
    age: "25",
    gender: "Male",
    comments: "This is a test comment for form filling.",
    description: "Sample description text for testing purposes.",
    notes: "Test notes field content.",
    
    // URLs and IDs
    url: "https://www.example.com",
    id: "TEST123456",
    reference: "REF-789012"
  };

  // Helper: Detect field type and generate appropriate value
  function detectAndGenerateValue(element, identifiers, type) {
    if (type === "email" || identifiers.includes("email") || identifiers.includes("mail") || identifiers.includes("css_loginName")) {
      return dummyData.email;
    }
    if (type === "password" || identifiers.includes("password") || identifiers.includes("pass")) {
      return dummyData.password;
    }
    if (type === "tel" || identifiers.includes("phone") || identifiers.includes("mobile") ||
        identifiers.includes("telephone") || identifiers.includes("contact")) {
      return dummyData.phone;
    }
    if (
      identifiers.includes("company") ||
      identifiers.includes("organization") ||
      identifiers.includes("org") ||
      identifiers.includes("business") ||
      identifiers.includes("employer") ||
      identifiers.includes("workplace") ||
      identifiers.includes("firm") ||
      identifiers.includes("office") ||
      identifiers.includes("corporate") ||
      identifiers.includes("institution") ||
      identifiers.includes("agency")
    ) {
      return dummyData.company;
    }
    if (identifiers.includes("fullname") || identifiers.includes("full_name") || identifiers.includes("fullName") || identifiers.includes("FullName")|| identifiers.includes("FULLNAME")) {
      return dummyData.fullName;
    }
    if (identifiers.includes("firstname") || identifiers.includes("first_name") || identifiers.includes("fname")) {
      return dummyData.firstName;
    }
    if (identifiers.includes("lastname") || identifiers.includes("last_name") || identifiers.includes("lname") || identifiers.includes("surname")) {
      return dummyData.lastName;
    }
    
    if (identifiers.includes("name") && !identifiers.includes("username")) {
      return dummyData.fullName;
    }
    if (identifiers.includes("username") || identifiers.includes("user_name") || identifiers.includes("login") || identifiers.includes("userid")) {
      return dummyData.username;
    }
    if (identifiers.includes("address") && !identifiers.includes("email")) {
      if (identifiers.includes("line2") || identifiers.includes("address2")) {
        return dummyData.address2;
      }
      return dummyData.address;
    }
    if (identifiers.includes("city")) {
      return dummyData.city;
    }
    if (identifiers.includes("state") || identifiers.includes("province")) {
      return dummyData.state;
    }
    if (identifiers.includes("zip") || identifiers.includes("postal") || identifiers.includes("postcode")) {
      return dummyData.zipCode;
    }
    if (identifiers.includes("country")) {
      return dummyData.country;
    }
    
    if (identifiers.includes("job") || identifiers.includes("title") || identifiers.includes("position")) {
      return dummyData.jobTitle;
    }
    if (identifiers.includes("department")) {
      return dummyData.department;
    }
    if (identifiers.includes("website") || identifiers.includes("url")) {
      return dummyData.website;
    }
    if (identifiers.includes("credit") || identifiers.includes("card")) {
      return dummyData.creditCard;
    }
    if (identifiers.includes("cvv") || identifiers.includes("cvc")) {
      return dummyData.cvv;
    }
    if (identifiers.includes("expiry") || identifiers.includes("exp")) {
      return dummyData.expiryDate;
    }
    if (identifiers.includes("account") && identifiers.includes("bank")) {
      return dummyData.bankAccount;
    }
    if (identifiers.includes("routing")) {
      return dummyData.routingNumber;
    }
    if (type === "date") {
      return dummyData.date;
    }
    if (type === "time") {
      return dummyData.time;
    }
    if (type === "datetime-local") {
      return "2024-01-15T14:30";
    }
    if (type === "number" || type === "range") {
      if (identifiers.includes("age")) {
        return dummyData.age;
      }
      return "42";
    }
    if (type === "url") {
      return dummyData.url;
    }
    if (element.tagName === "TEXTAREA") {
      if (identifiers.includes("comment") || identifiers.includes("message")) {
        return dummyData.comments;
      }
      if (identifiers.includes("description") || identifiers.includes("desc")) {
        return dummyData.description;
      }
      if (identifiers.includes("note")) {
        return dummyData.notes;
      }
      return dummyData.comments;
    }
    if (type === "text" || !type) {
      if (identifiers.includes("id") || identifiers.includes("reference") || identifiers.includes("ref")) {
        return dummyData.id;
      }
      return "Sample Text Data";
    }
    
    // Handle checkboxes and radio buttons - they don't need a value, just need to be processed
    if (type === "checkbox" || type === "radio") {
      return "CHECKED"; // Special marker to indicate this should be checked
    }
    
    return null;
  }

  // Helper: Fill element with a given value based on type
  function fillElement(element, value, type) {
    if (type === "checkbox") {
      element.checked = true;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    if (type === "radio") {
      // For radio buttons, check the first one in the group
      const group = document.getElementsByName(element.name);
      if (group && group.length > 0) {
        group[0].checked = true;
        group[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }
    if (element.tagName === "SELECT") {
      if (element.options.length > 1) {
        for (let i = 1; i < element.options.length; i++) {
          if (element.options[i].value && element.options[i].value.trim() !== "") {
            element.selectedIndex = i;
            break;
          }
        }
      }
      return;
    }
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Helper: Fill element using a custom test input
  function fillWithCustomInput(element, customInput, type) {
    if (type === "checkbox") {
      element.checked = true;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    if (type === "radio") {
      // For radio buttons, check the first one in the group
      const group = document.getElementsByName(element.name);
      if (group && group.length > 0) {
        group[0].checked = true;
        group[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }
    if (element.tagName === "SELECT") {
      for (let i = 0; i < element.options.length; i++) {
        const option = element.options[i];
        const query = customInput.toLowerCase();
        if (option.text.toLowerCase().includes(query) || option.value.toLowerCase().includes(query)) {
          element.selectedIndex = i;
          return;
        }
      }
      return;
    }
    element.value = customInput;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Get all form elements
  const inputs = document.querySelectorAll("input, textarea, select");
  let filledCount = 0;

  inputs.forEach((element) => {
    // Skip hidden, disabled, or readonly fields
    if (element.type === "hidden" || element.disabled || element.readOnly) {
      return;
    }

    const name = element.name?.toLowerCase() || "";
    const id = element.id?.toLowerCase() || "";
    const placeholder = element.placeholder?.toLowerCase() || "";
    const type = element.type?.toLowerCase() || "";
    const className = element.className?.toLowerCase() || "";
    const allIdentifiers = `${name} ${id} ${placeholder} ${className}`;

    try {
      if (customTestInput) {
        fillWithCustomInput(element, customTestInput, type);
        filledCount++;
        return;
      }

      const fillValue = detectAndGenerateValue(element, allIdentifiers, type);
      if (fillValue !== null) {
        fillElement(element, fillValue, type);
        filledCount++;
      }
    } catch (error) {
      console.warn("Error filling field:", element, error);
    }
  });

  // Log the results and return count
  console.log(`Auto-filled ${filledCount} form fields`);
  return filledCount;
}


// ------------------------------------------------------------
// 🔹 Log Activity
// ------------------------------------------------------------
function logActivity(message) {
  const list = document.getElementById("activityList");
  const li = document.createElement("li");
  li.textContent = `${message} (${new Date().toLocaleTimeString()})`;
  list.prepend(li);
}


// ------------------------------------------------------------
// 🔹 Get Auto Fill Data from options.js
// ------------------------------------------------------------
chrome.storage.local.get(['autoFillData'], function(result) {
  if (result.autoFillData) {
      const data = result.autoFillData;
      
      // Now use data.firstName, data.email, etc. to fill forms
      fillForm(data);
  }
});