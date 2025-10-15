// DOM Elements
const codePanel = document.getElementById('codePanel');
const previewPanel = document.getElementById('previewPanel');
const historyPanel = document.getElementById('historyPanel');
const filePanel = document.getElementById('filePanel');
const preview = document.getElementById('preview');
const runBtn = document.getElementById('runBtn');
const refreshPreview = document.getElementById('refreshPreview');
const toggleCodePanel = document.getElementById('toggleCodePanel');
const historyIcon = document.getElementById('historyIcon');
const codeIcon = document.getElementById('codeIcon');
const previewIcon = document.getElementById('previewIcon');
const fileIcon = document.getElementById('fileIcon');
const closeHistory = document.getElementById('closeHistory');
const closeFilePanel = document.getElementById('closeFilePanel');
const historyContent = document.getElementById('historyContent');
const saveFileBtn = document.getElementById('saveFileBtn');
const exportFileBtn = document.getElementById('exportFileBtn');
const importFileBtn = document.getElementById('importFileBtn');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const fileListContent = document.getElementById('fileListContent');
const toast = document.getElementById('toast');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearBtn');

// Undo/Redo functionality
const undoStacks = {
    html: [],
    css: [],
    js: []
};
const redoStacks = {
    html: [],
    css: [],
    js: []
};
const currentLanguages = ['html', 'css', 'js'];

// Initialize undo/redo stacks
currentLanguages.forEach(lang => {
    const textarea = document.getElementById(`${lang}Code`);
    undoStacks[lang].push(textarea.value);
});

// Tab switching
const tabs = document.querySelectorAll('.tab');
const codeContainers = document.querySelectorAll('.code-container');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        codeContainers.forEach(container => {
            container.classList.remove('active');
            if (container.id === `${tabId}-container`) {
                container.classList.add('active');
            }
        });
        
        updateUndoRedoButtons();
    });
});

// Run code functionality
function runCode() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;
    
    saveToHistory(htmlCode, cssCode, jsCode);
    
    // Use iframe's existing document instead of creating a new iframe
    const iframeDoc = preview.contentDocument || preview.contentWindow.document;
    
    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${cssCode}</style>
        </head>
        <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
        </body>
        </html>
    `);
    iframeDoc.close();
    
    showToast('Preview updated successfully!');
}

runBtn.addEventListener('click', runCode);
refreshPreview.addEventListener('click', runCode);

// Auto-run when code changes
const codeAreas = document.querySelectorAll('.code-area');
let runTimeout;

codeAreas.forEach(area => {
    area.addEventListener('input', () => {
        clearTimeout(runTimeout);
        runTimeout = setTimeout(runCode, 1000);
        
        // Save state for undo/redo
        const lang = area.id.replace('Code', '');
        saveState(lang);
    });
});

// Save state for undo/redo
function saveState(lang) {
    const textarea = document.getElementById(`${lang}Code`);
    undoStacks[lang].push(textarea.value);
    redoStacks[lang] = []; // Clear redo stack when new changes are made
    updateUndoRedoButtons();
}

// Undo functionality
undoBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab.active');
    const lang = activeTab.getAttribute('data-tab');
    
    if (undoStacks[lang].length > 1) {
        const currentState = undoStacks[lang].pop();
        redoStacks[lang].push(currentState);
        
        const textarea = document.getElementById(`${lang}Code`);
        textarea.value = undoStacks[lang][undoStacks[lang].length - 1];
        
        runCode();
        updateUndoRedoButtons();
        showToast(`Undo ${lang.toUpperCase()} changes`);
    }
});

// Redo functionality
redoBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab.active');
    const lang = activeTab.getAttribute('data-tab');
    
    if (redoStacks[lang].length > 0) {
        const state = redoStacks[lang].pop();
        undoStacks[lang].push(state);
        
        const textarea = document.getElementById(`${lang}Code`);
        textarea.value = state;
        
        runCode();
        updateUndoRedoButtons();
        showToast(`Redo ${lang.toUpperCase()} changes`);
    }
});

// Update undo/redo button states
function updateUndoRedoButtons() {
    const activeTab = document.querySelector('.tab.active');
    const lang = activeTab.getAttribute('data-tab');
    
    undoBtn.disabled = undoStacks[lang].length <= 1;
    redoBtn.disabled = redoStacks[lang].length === 0;
}

// Clear code functionality
clearBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab.active');
    const lang = activeTab.getAttribute('data-tab');
    const textarea = document.getElementById(`${lang}Code`);
    
    // Save current state before clearing
    saveState(lang);
    
    // Clear the textarea
    textarea.value = '';
    
    runCode();
    showToast(`Cleared ${lang.toUpperCase()} code`);
});

// Toggle code panel
toggleCodePanel.addEventListener('click', () => {
    codePanel.classList.toggle('collapsed');
});

// Sidebar navigation
codeIcon.addEventListener('click', () => {
    codePanel.classList.remove('collapsed');
    historyPanel.classList.remove('open');
    filePanel.classList.remove('open');
});

previewIcon.addEventListener('click', () => {
    codePanel.classList.add('collapsed');
    historyPanel.classList.remove('open');
    filePanel.classList.remove('open');
});

historyIcon.addEventListener('click', () => {
    historyPanel.classList.add('open');
    filePanel.classList.remove('open');
    loadHistory();
});

fileIcon.addEventListener('click', () => {
    filePanel.classList.add('open');
    historyPanel.classList.remove('open');
    loadFileList();
});

closeHistory.addEventListener('click', () => {
    historyPanel.classList.remove('open');
});

closeFilePanel.addEventListener('click', () => {
    filePanel.classList.remove('open');
});

// History functionality
function saveToHistory(html, css, js) {
    const timestamp = new Date().toLocaleString();
    const historyItem = {
        timestamp,
        html,
        css,
        js
    };
    
    let history = JSON.parse(localStorage.getItem('codeHistory') || '[]');
    history.unshift(historyItem);
    
    if (history.length > 15) {
        history = history.slice(0, 15);
    }
    
    localStorage.setItem('codeHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('codeHistory') || '[]');
    historyContent.innerHTML = '';
    
    if (history.length === 0) {
        historyContent.innerHTML = '<div class="empty-history">No history yet. Run your code to save versions.</div>';
        return;
    }
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-timestamp">
                <span>${item.timestamp}</span>
                <span>#${index + 1}</span>
            </div>
            <div class="history-code">${item.html.substring(0, 80)}...</div>
        `;
        
        historyItem.addEventListener('click', () => {
            document.querySelectorAll('.history-item').forEach(el => {
                el.classList.remove('active');
            });
            
            historyItem.classList.add('active');
            
            // Save current state before loading history
            currentLanguages.forEach(lang => {
                saveState(lang);
            });
            
            document.getElementById('htmlCode').value = item.html;
            document.getElementById('cssCode').value = item.css;
            document.getElementById('jsCode').value = item.js;
            
            // Update undo stacks
            currentLanguages.forEach(lang => {
                undoStacks[lang].push(document.getElementById(`${lang}Code`).value);
            });
            
            historyPanel.classList.remove('open');
            runCode();
            updateUndoRedoButtons();
        });
        
        historyContent.appendChild(historyItem);
    });
}

// File management functionality
saveFileBtn.addEventListener('click', () => {
    const name = fileName.value.trim() || 'untitled';
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;
    
    const fileData = {
        name,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        timestamp: new Date().toISOString()
    };
    
    let files = JSON.parse(localStorage.getItem('savedFiles') || '[]');
    files.unshift(fileData);
    
    // Keep only last 20 files
    if (files.length > 20) {
        files = files.slice(0, 20);
    }
    
    localStorage.setItem('savedFiles', JSON.stringify(files));
    showToast(`File "${name}" saved successfully!`);
    loadFileList();
    fileName.value = '';
});

exportFileBtn.addEventListener('click', () => {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;
    
    const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Page</title>
    <style>${cssCode}</style>
</head>
<body>
    ${htmlCode}
    <script>${jsCode}<\/script>
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.value.trim() || 'exported-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('File exported successfully!');
});

importFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            
            // Simple parsing to separate HTML, CSS, and JS
            const htmlMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            const cssMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            const jsMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            
            if (htmlMatch) {
                document.getElementById('htmlCode').value = htmlMatch[1];
            }
            
            if (cssMatch) {
                document.getElementById('cssCode').value = cssMatch[1];
            }
            
            if (jsMatch) {
                document.getElementById('jsCode').value = jsMatch[1];
            }
            
            fileName.value = file.name.replace('.html', '');
            
            // Save states for undo/redo
            currentLanguages.forEach(lang => {
                saveState(lang);
            });
            
            runCode();
            showToast('File imported successfully!');
        };
        reader.readAsText(file);
    }
});

function loadFileList() {
    const files = JSON.parse(localStorage.getItem('savedFiles') || '[]');
    fileListContent.innerHTML = '';
    
    if (files.length === 0) {
        fileListContent.innerHTML = '<div class="empty-history">No saved files yet.</div>';
        return;
    }
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-date">${new Date(file.timestamp).toLocaleString()}</div>
            </div>
            <button class="btn" data-index="${index}">Load</button>
        `;
        
        fileItem.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            const fileIndex = parseInt(e.target.getAttribute('data-index'));
            loadFile(files[fileIndex]);
        });
        
        fileListContent.appendChild(fileItem);
    });
}

function loadFile(file) {
    // Save current state before loading file
    currentLanguages.forEach(lang => {
        saveState(lang);
    });
    
    document.getElementById('htmlCode').value = file.html;
    document.getElementById('cssCode').value = file.css;
    document.getElementById('jsCode').value = file.js;
    fileName.value = file.name;
    filePanel.classList.remove('open');
    
    // Update undo stacks
    currentLanguages.forEach(lang => {
        undoStacks[lang].push(document.getElementById(`${lang}Code`).value);
    });
    
    runCode();
    updateUndoRedoButtons();
    showToast(`File "${file.name}" loaded successfully!`);
}

// Toast notification
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = 'toast';
    if (isError) toast.classList.add('error');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize
window.addEventListener('load', () => {
    // Start with blank code areas
    document.getElementById('htmlCode').value = '';
    document.getElementById('cssCode').value = '';
    document.getElementById('jsCode').value = '';
    
    // Initialize undo stacks with blank state
    currentLanguages.forEach(lang => {
        undoStacks[lang] = [''];
    });
    
    updateUndoRedoButtons();
    runCode();
    loadFileList();
});