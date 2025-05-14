const canvas = new fabric.Canvas('mugCanvas');
let backgroundImage = null;
let nameText = null;

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

// Listen for incoming messages with background and design data
window.addEventListener('message', function (event) {
  const data = event.data;
  if (data && data.backgroundImage && Array.isArray(data.designs)) {
    loadBaseBackground(data.backgroundImage);

    const imageContainer = document.getElementById('image-options');
    if (imageContainer) imageContainer.innerHTML = '';

    data.designs.forEach((item, index) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = `Design ${index + 1}`;
      img.addEventListener('click', () => {
        document
          .querySelectorAll('.image-options img')
          .forEach((i) => i.classList.remove('selected'));
        img.classList.add('selected');

        fabric.Image.fromURL(
          item.img,
          function (designImg) {
            designImg.set({
              left: item.nameX || 0,
              top: item.nameY || 0,
              selectable: true,
            });
            canvas.add(designImg);
            canvas.bringToFront(designImg);
          },
          { crossOrigin: 'anonymous' }
        );
      });

      if (imageContainer) imageContainer.appendChild(img);
    });
  }
});

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
}

// Hide the feature panel
function closePanel() {
  const panel = document.getElementById('featurePanel');
  panel.classList.remove('active');
}

// Attach panel open events to side menu buttons
document.querySelector('#sideMenu button:nth-child(1)').addEventListener('click', () => {
  showPanel("Change Product / Color", "<p>Color/product selector goes here.</p>");
});

document.querySelector('#sideMenu button:nth-child(2)').addEventListener('click', () => {
  showPanel("Upload Image", '<input type="file" /><button>Upload</button>');
});

document.querySelector('#sideMenu button:nth-child(3)').addEventListener('click', () => {
  showPanel("Add Text", '<input type="text" placeholder="Enter text" /><button>Add</button>');
});

document.querySelector('#sideMenu button:nth-child(4)').addEventListener('click', () => {
  showPanel("Choose Design", "<p>Choose from predefined designs.</p>");
});

document.querySelector('#sideMenu button:nth-child(5)').addEventListener('click', () => {
  showPanel("Change Printing Mode", "<p>Select print style or mockup.</p>");
});

// Setup close button event on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeFeaturePanel');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  // Optional: simulate incoming data for testing
  const fakeMessage = {
    backgroundImage: "https://static.wixstatic.com/media/a0452a_f33e912885e34c1c8e578acf556c55fe~mv2.webp",
    designs: [
      {
        _id: "d1",
        img: "https://static.wixstatic.com/media/a0452a_a38a45364a4547bcbd18e7d97e003365~mv2.webp",
        nameX: 270,
        nameY: 150
      }
    ]
  };

  setTimeout(() => {
    window.postMessage(fakeMessage, "*");
  }, 500);
});
