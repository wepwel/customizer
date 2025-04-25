const canvas = new fabric.Canvas('mugCanvas');
let backgroundImage = null;
let designImage = null;
let nameText = null;

// Load the main mug background (800x800)
function loadBaseBackground(url) {
    fabric.Image.fromURL(url, function(img) {
      if (backgroundImage) {
        canvas.remove(backgroundImage);
      }
  
      img.set({
        scaleX: 1,
        scaleY: 1,
        left: (canvas.width - img.width) / 2,
        top: 0, // 👈 align to top instead of vertical center
        selectable: false
      });
  
      backgroundImage = img;
      canvas.add(img);
      canvas.sendToBack(img);
    }, { crossOrigin: 'anonymous' });
  }

// Load design overlay on top of the mug background
function loadDesignOverlay(url, nameX = 150, nameY = 200) {
  fabric.Image.fromURL(url, function(img) {
    if (designImage) {
      canvas.remove(designImage);
    }

    img.set({
      scaleX: 1,
      scaleY: 1,
      left: (canvas.width - img.width) / 2,
      top: (canvas.height - img.height) / 2,
      selectable: false
    });

    designImage = img;
    canvas.add(img);
    canvas.sendToBack(img);

    if (nameText) {
      nameText.set({
        left: nameX,
        top: nameY
      });
      canvas.renderAll();
    }
  }, { crossOrigin: 'anonymous' });
}

// Update user name text
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

// Input and font change listeners
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

// Handle message from Wix (or simulation)
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
      img.alt = `Design ${index + 1}`;
      img.addEventListener('click', () => {
        document.querySelectorAll('.image-options img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
        loadDesignOverlay(item.img, parseFloat(item.nameX), parseFloat(item.nameY));
      });
      imageContainer.appendChild(img);
    });

    // Auto-load first design
    if (data.designs.length > 0) {
      const first = data.designs[0];
      loadDesignOverlay(first.img, first.nameX, first.nameY);
    }
  }
});

// Simulate postMessage from Wix for local testing
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
