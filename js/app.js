document.addEventListener('DOMContentLoaded', () => {
  // Initialize CodeMirror Editor
  const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'htmlmixed',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Ctrl-Enter': () => updatePreview()
    }
  });

  // Default code
  editor.setValue(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: sans-serif; 
      padding: 20px; 
      background: #f0f0f0;
    }
    h1 { color: #0e639c; }
    .box {
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>🎉 Live Preview Works!</h1>
  <div class="box">
    <p>Edit the code on the left → See changes here instantly.</p>
    <button onclick="alert('Hello from live preview!')">Click Me</button>
  </div>
  <script>
    console.log('Preview loaded at', new Date().toLocaleTimeString());
  <\/script>
</body>
</html>`);

  const previewFrame = document.getElementById('preview-frame');
  const resizer = document.getElementById('resizer');
  const container = document.querySelector('.container');
  const editorPane = document.getElementById('editor-pane');
  const previewPane = document.getElementById('preview-pane');

  // Update preview iframe
  function updatePreview() {
    const code = editor.getValue();
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  }

  // Auto-update preview with debounce
  let timeout;
  editor.on('change', () => {
    clearTimeout(timeout);
    timeout = setTimeout(updatePreview, 300);
  });

  // Button handlers
  document.getElementById('run-btn').addEventListener('click', updatePreview);
  document.getElementById('refresh-btn').addEventListener('click', updatePreview);

  // Initial load
  updatePreview();

  // Resizable panes logic
  let isResizing = false;
  let startX, startWidth;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.pageX;
    startWidth = editorPane.offsetWidth;
    resizer.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const dx = e.pageX - startX;
    const newWidth = Math.min(Math.max(startWidth + dx, 200), window.innerWidth - 200);
    editorPane.style.width = `${newWidth}px`;
    previewPane.style.width = `${window.innerWidth - newWidth - 6}px`;
    editor.refresh(); // Refresh CodeMirror layout
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    editor.refresh();
  });

  // Optional: Add language switcher later
  // editor.setOption('mode', 'javascript'); // for JS only
});
