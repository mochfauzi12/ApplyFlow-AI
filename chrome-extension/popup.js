document.addEventListener('DOMContentLoaded', () => {
  const highlightBtn = document.getElementById('highlight-btn');
  const autofillBtn = document.getElementById('autofill-btn');
  const fieldCountSpan = document.getElementById('field-count');

  // Request the field count when popup opens
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'COUNT_FIELDS' }, (response) => {
      if (response && response.count !== undefined) {
        fieldCountSpan.textContent = response.count;
      }
    });
  });

  highlightBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'HIGHLIGHT_FIELDS' });
      highlightBtn.textContent = 'Highlighted!';
      setTimeout(() => {
        highlightBtn.textContent = 'Highlight Fields';
      }, 2000);
    });
  });

  autofillBtn.addEventListener('click', () => {
    autofillBtn.innerHTML = 'Autofilling...';
    autofillBtn.disabled = true;
    
    // Simulate API call delay, then trigger autofill
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'MOCK_AUTOFILL' }, (response) => {
          autofillBtn.innerHTML = 'Autofill Complete!';
          autofillBtn.style.backgroundColor = '#10B981'; // Success color
          
          setTimeout(() => {
            window.close(); // Close popup after success
          }, 1500);
        });
      });
    }, 1000);
  });
});
