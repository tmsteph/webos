const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to execute shell commands
function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to execute command: ${command}`, err.message);
    process.exit(1);
  }
}

// Step 1: Initialize package.json if not already present
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.log('Initializing npm project...');
  runCommand('npm init -y');
}

// Step 2: Ensure necessary modules are available
// `fs` is built-in, so no installations are required for it.

// Define files to create
const files = [
  {
    name: 'index.html',
    content: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebOS</title>
    <link rel="stylesheet" href="styles.css">
    <script defer src="webos.js"></script>
</head>
<body>
    <div id="desktop" class="desktop">
        <button id="app1-launcher" class="app-launcher">Launch App 1</button>
        <button id="app2-launcher" class="app-launcher">Launch App 2</button>
    </div>
</body>
</html>
    `.trim()
  },
  {
    name: 'styles.css',
    content: `
body {
    margin: 0;
    font-family: Arial, sans-serif;
}

.desktop {
    width: 100vw;
    height: 100vh;
    background: #2c3e50;
    position: relative;
    overflow: hidden;
}

.app-launcher {
    margin: 10px;
    padding: 10px 20px;
    background: #16a085;
    color: white;
    border: none;
    cursor: pointer;
}

.window {
    width: 300px;
    height: 200px;
    background: white;
    border: 1px solid #7f8c8d;
    position: absolute;
    top: 100px;
    left: 100px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.title-bar {
    background: #34495e;
    color: white;
    padding: 5px;
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.content {
    padding: 10px;
}

.close-button {
    background: red;
    color: white;
    border: none;
    padding: 2px 5px;
    cursor: pointer;
}
    `.trim()
  },
  {
    name: 'webos.js',
    content: `
// WebOS Basic Script

class WebOS {
  constructor() {
    this.desktop = document.getElementById('desktop');
    this.windowCount = 0;
  }

  createWindow(title, content) {
    const windowId = \`window-\${++this.windowCount}\`;

    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    titleBar.innerText = title;

    this.makeDraggable(win, titleBar);

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerText = 'X';
    closeButton.onclick = () => this.desktop.removeChild(win);

    titleBar.appendChild(closeButton);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.innerHTML = content;

    win.appendChild(titleBar);
    win.appendChild(contentDiv);
    this.desktop.appendChild(win);
  }

  makeDraggable(win, handle) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    handle.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      document.onmousemove = (e) => {
        if (isDragging) {
          win.style.left = \`\${e.clientX - offsetX}px\`;
          win.style.top = \`\${e.clientY - offsetY}px\`;
        }
      };
    };

    document.onmouseup = () => {
      isDragging = false;
      document.onmousemove = null;
    };
  }
}

const webOS = new WebOS();

function openApp1() {
  webOS.createWindow('App 1', '<p>This is App 1!</p>');
}

function openApp2() {
  webOS.createWindow('App 2', '<p>This is App 2!</p>');
}

window.onload = () => {
  document.getElementById('app1-launcher').onclick = openApp1;
  document.getElementById('app2-launcher').onclick = openApp2;
};
    `.trim()
  }
];

// Step 3: Create the necessary files
files.forEach(file => {
  const filePath = path.join(__dirname, file.name);

  try {
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${file.name}: File already exists.`);
    } else {
      fs.writeFileSync(filePath, file.content);
      console.log(`Created ${file.name}`);
    }
  } catch (err) {
    console.error(`Failed to create ${file.name}:`, err.message);
    process.exit(1);
  }
});

console.log('WebOS setup complete! You can now open index.html in your browser.');
