// WebOS Basic Script

class WebOS {
  constructor() {
    this.desktop = document.getElementById('desktop');
    this.windowCount = 0;
  }

  createWindow(title, content) {
    const windowId = `window-${++this.windowCount}`;

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
          win.style.left = `${e.clientX - offsetX}px`;
          win.style.top = `${e.clientY - offsetY}px`;
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