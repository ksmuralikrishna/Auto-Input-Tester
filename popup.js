document.getElementById("fill").addEventListener("click", async () => {
  const sampleText = document.getElementById("sampleText").value || "TestValue";

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: autoFillInputs,
    args: [sampleText]
  });
});

function autoFillInputs(sampleText) {
  let inputs = document.querySelectorAll("input[type='text'], input[type='email'], input[type='password']");
  inputs.forEach((input) => {
    input.value = sampleText;
  });
  alert(`All inputs filled with: "${sampleText}"`);
}
