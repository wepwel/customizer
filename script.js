const canvas = new fabric.Canvas('mugCanvas');
let backgroundImage = null;
let designImage = null;
let nameText = null;

// Load background (base image behind all designs)
function loadBaseBackground(url) {
  fabric.Image.fromURL(url, function(img) {
    if (backgroundImage) {
      canvas.remove(backgroundImage);
    }

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: (canvas.width - img.width * scale) / 2,
      top: (canvas.height - img.height * scale) / 2,
      selectable: false
    });

    backgroundImage = img;
    canvas.add(img);
    canvas.sendToBack(img);
  }, { crossOrigin: 'anonymous' });
}

// Load design overlay + position text
function loadDesignOverlay(url, nameX = 150, nameY = 200) {
  fabric.Image.fromURL(url, function(img) {
    if (designImage) {
      canvas.remove(designImage);
    }

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: (canvas.width - img.width * scale) / 2,
      top: (canvas.height - img.height * scale) / 2,
      selectable: false
    });

    designImage = img;
    canvas.add(img);
    canvas.sendToBack(img); // keeps nameText on top

    if (nameText) {
      const safeNameX = Math.min(nameX, img.width);
      const safeNameY = Math.min(nameY, img.height);
      const scaledX = (canvas.width - img.width * scale) / 2 + safeNameX * scale;
      const scaledY = (canvas.height - img.height * scale) / 2 + safeNameY * scale;
      nameText.set({ left: scaledX, top: scaledY });
      canvas.renderAll();
    }
  }, { crossOrigin: 'anonymous' });
}

// Update text content and font
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

// Event listeners for input & font
document.getElementById('nameInput').addEventListener('input', function(e) {
  const text = e.target.value;
  const font = document.getElementById('fontSelector').value;
  updateNameText(text, font);
});

document.getElementById('fontSelector').addEventListener('change', function(e) {
  const font = e.target.value;
  const text = document.getElementById('nameInput').value;
  updateNameText(text, font);
});

// Handle real Wix or simulated messages
window.addEventListener('message', function(event) {
  const data = event.data;

  if (data.backgroundImage) {
    loadBaseBackground(data.backgroundImage);
  }

  if (Array.isArray(data.designs)) {
    const imageContainer = document.getElementById('image-options');
    imageContainer.innerHTML = '';

    data.designs.forEach((item, index) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = `Design ${index}`;
      img.addEventListener('click', () => {
        document.querySelectorAll('.image-options img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
        loadDesignOverlay(item.img, parseFloat(item.nameX), parseFloat(item.nameY));
      });
      imageContainer.appendChild(img);
    });

    // Auto-load the first design
    if (data.designs.length > 0) {
      const first = data.designs[0];
      loadDesignOverlay(first.img, parseFloat(first.nameX), parseFloat(first.nameY));
    }
  }
});

// ✅ Simulate postMessage for local testing (optional)
window.addEventListener('DOMContentLoaded', () => {
  const fakeMessage = {
    backgroundImage: "https://static.wixstatic.com/media/a0452a_1234567890abcdef~mv2.webp",
    designs: [
      {
        _id: "d1",
        img: "https://static.wixstatic.com/media/a0452a_a38a45364a4547bcbd18e7d97e003365~mv2.webp",
        nameX: 270,
        nameY: 150
      },
      {
        _id: "d2",
        img: "https://static.wixstatic.com/media/a0452a_91239df912d3f~mv2.webp",
        nameX: 100,
        nameY: 180
      }
    ]
  };

  setTimeout(() => {
    console.log("⚙️ Simulating postMessage from Wix...");
    window.postMessage(fakeMessage, "*");
  }, 500);
});
