const canvas = new fabric.Canvas('mugCanvas');
let backgroundImage = null;
let textObject = null;

// Load background image onto canvas
function loadBaseBackground(url) {
  fabric.Image.fromURL(
    url,
    function (img) {
      if (!img) return;
      if (backgroundImage) canvas.remove(backgroundImage);
      img.set({ left: 0, top: 0, selectable: false });
      backgroundImage = img;
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
    },
    { crossOrigin: 'anonymous' }
  );
}

// Show the feature panel
function showPanel(title, contentHTML) {
  const panel = document.getElementById('featurePanel');
  const titleElement = document.getElementById('panelTitle');
  const contentElement = document.getElementById('panelContent');

  if (panel.classList.contains('active') && titleElement.innerText === title) {
    closePanel(); // toggle off
    return;
  }

  titleElement.innerText = title;
  contentElement.innerHTML = contentHTML;
  panel.classList.add('active');

  if (title === "Edit text") {
    attachTextEditorEvents();
  }
}

// Hide the feature panel
function closePanel() {
  document.getElementById('featurePanel').classList.remove('active');
}

// Text tool logic
function attachTextEditorEvents() {
  const applyBtn = document.getElementById('applyTextBtn');
  const input = document.getElementById('textInput');
  const rotate = document.getElementById('textRotate');
  const color = document.getElementById('textColor');

  applyBtn.addEventListener('click', () => {
    const newText = input.value;
    if (textObject) {
      textObject.text = newText;
    } else {
      textObject = new fabric.Text(newText, {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: color.value,
      });
      canvas.add(textObject);
    }
    canvas.renderAll();
  });

  rotate.addEventListener('input', () => {
    if (textObject) {
      textObject.angle = parseInt(rotate.value);
      canvas.renderAll();
    }
  });

  color.addEventListener('input', () => {
    if (textObject) {
      textObject.set({ fill: color.value });
      canvas.renderAll();
    }
  });
}

// Set up side menu button actions
document.querySelector('#sideMenu button:nth-child(1)').addEventListener('click', () => {
  showPanel("Change Product / Color", "<p>Color/product selector goes here.</p>");
});

document.querySelector('#sideMenu button:nth-child(2)').addEventListener('click', () => {
  showPanel("Upload Image", '<input type="file" /><button>Upload</button>');
});

document.querySelector('#sideMenu button:nth-child(3)').addEventListener('click', () => {
  const template = document.getElementById('text-tool-template');
  showPanel("Edit text", template.innerHTML);
});

document.querySelector('#sideMenu button:nth-child(4)').addEventListener('click', () => {
  showPanel("Choose Design", "<p>Choose from predefined designs.</p>");
});

document.querySelector('#sideMenu button:nth-child(5)').addEventListener('click', () => {
  showPanel("Change Printing Mode", "<p>Select print style or mockup.</p>");
});

// Setup close button and simulated image load
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('closeFeaturePanel').addEventListener('click', closePanel);

  // Optional: simulate data
  const fakeMessage = {
    backgroundImage: "https://static.wixstatic.com/media/a0452a_f33e912885e34c1c8e578acf556c55fe~mv2.webp",
    designs: []
  };

  setTimeout(() => {
    window.postMessage(fakeMessage, "*");
  }, 500);
});

// Handle message to load designs
window.addEventListener('message', function (event) {
  const data = event.data;
  if (data && data.backgroundImage) {
    loadBaseBackground(data.backgroundImage);
  }
});
