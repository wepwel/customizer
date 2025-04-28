// Create Fabric canvas
const canvas = new fabric.Canvas('mugCanvas');
let backgroundImage = null;
let nameText = null;

// Load background image and resize canvas to match
function loadBaseBackground(url) {
  fabric.Image.fromURL(url, function (img) {
    if (!img) {
      console.error("❌ Failed to load image:", url);
      return;
    }

    const canvasEl = document.getElementById('mugCanvas');
    const newWidth = img.width;
    const newHeight = img.height;
    console.log("newWidth", newWidth);
    console.log("newHeight", newHeight);

    // Update canvas element attributes and styles
    canvasEl.width = newWidth;
    canvasEl.height = newHeight;
    canvasEl.style.width = newWidth + 'px';
    canvasEl.style.height = newHeight + 'px';

    // Resize Fabric canvas
    canvas.setWidth(newWidth);
    canvas.setHeight(newHeight);

    // Remove previous background if any
    if (backgroundImage) {
      canvas.remove(backgroundImage);
    }

    img.set({
      left: 0,
      top: 0,
      selectable: false,
      scaleX: 1,
      scaleY: 1,
    });

    backgroundImage = img;
    canvas.add(img);
    canvas.sendToBack(img);
    canvas.renderAll();

    console.log("✅ Canvas resized to: " + newWidth + "x" + newHeight);
  }, { crossOrigin: 'anonymous' });
}

// Update or add name text on canvas
function updateNameText(text, font) {
  if (nameText) {
    nameText.set({ text, fontFamily: font });
  } else {
    nameText = new fabric.Text(text, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 30,
      fill: '#000',
      fontFamily: font,
      selectable: true
    });
    canvas.add(nameText);
  }
  canvas.renderAll();
}

// Handle text input and font change
document.getElementById('nameInput').addEventListener('input', function (e) {
  const text = e.target.value;
  const font = document.getElementById('fontSelector').value;
  updateNameText(text, font);
});

document.getElementById('fontSelector').addEventListener('change', function (e) {
  const font = e.target.value;
  const text = document.getElementById('nameInput').value;
  updateNameText(text, font);
});

// Listen for postMessage from Wix or local
window.addEventListener('message', function (event) {
  console.log("📨 Received message from:", event.origin);
  console.log("📦 Data received:", event.data);

  const data = event.data;

  if (data && data.backgroundImage && Array.isArray(data.designs)) {
    loadBaseBackground(data.backgroundImage);

    const imageContainer = document.getElementById('image-options');
    imageContainer.innerHTML = '';

    data.designs.forEach((item, index) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = `Design ${index + 1}`;
      img.addEventListener('click', () => {
        document.querySelectorAll('.image-options img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');

        // Load clicked design image onto canvas
        fabric.Image.fromURL(item.img, function (designImg) {
          designImg.set({
            left: (item.nameX || 0),
            top: (item.nameY || 0),
            scaleX: 1,
            scaleY: 1,
            selectable: true
          });
          canvas.add(designImg);
          canvas.bringToFront(designImg);
        }, { crossOrigin: 'anonymous' });
      });

      imageContainer.appendChild(img);
    });
  }
});

// Simulate postMessage from Wix for local development
/*window.addEventListener('DOMContentLoaded', () => {
  const fakeMessage = {
    backgroundImage: "https://picsum.photos/800/800", // ✅ This URL always works
    designs: [
      {
        _id: "d1",
        img: "https://picsum.photos/seed/picsum/200/200",
        nameX: 270,
        nameY: 150
      },
      {
        _id: "d2",
        img: "https://picsum.photos/seed/design2/200/200",
        nameX: 100,
        nameY: 180
      }
    ]
  };

  setTimeout(() => {
    console.log("⚙️ Simulating postMessage from Wix...");
    window.postMessage(fakeMessage, "*");
  }, 500);
});*/
