const canvas = new fabric.Canvas('mugCanvas');
let backgroundImage = null;
let nameText = null;

function loadBackgroundImage(url, nameX = 150, nameY = 200) {
  console.log("🔄 Trying to load image:", url);
  fabric.Image.fromURL(url, function(img) {
    if (!img) {
      console.error("❌ Failed to load image:", url);
      return;
    }
    if (backgroundImage) {
      canvas.remove(backgroundImage);
    }

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.min(scaleX, scaleY);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: (canvas.width - scaledWidth) / 2,
      top: (canvas.height - scaledHeight) / 2,
      selectable: false
    });
    backgroundImage = img;
    canvas.add(img);
    canvas.sendToBack(img);

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
      fill: '#ff0000',
      fontFamily: font,
      selectable: true
    });
    canvas.add(nameText);
  }
  canvas.renderAll();
}

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

// Listen for messages (like from Wix)
window.addEventListener('message', function(event) {
  console.log("📬 Received message from:", event.origin);
  console.log("📨 Received data:", JSON.stringify(event.data, null, 2));

  const data = event.data;

  if (Array.isArray(data)) {
    const imageContainer = document.getElementById('image-options');
    imageContainer.innerHTML = '';

    data.forEach((item, index) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.dataset.image = item.img;
      img.alt = `Background ${index}`;
      img.addEventListener('click', () => {
        document.querySelectorAll('.image-options img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
        const nameX = parseFloat(item.nameX || "150");
        const nameY = parseFloat(item.nameY || "200");
        loadBackgroundImage(item.img, nameX, nameY);
      });
      imageContainer.appendChild(img);
    });

    if (data.length > 0) {
      const first = data[0];
      loadBackgroundImage(first.img, parseFloat(first.nameX), parseFloat(first.nameY));
    }
  }
});

// Simulate Wix postMessage for local testing
/*window.addEventListener('DOMContentLoaded', () => {
  const fakeMessage = [
    {
      _id: "pD1",
      img: "https://static.wixstatic.com/media/a0452a_f33e912885e34c1c8e578acf556c55fe~mv2.webp",
      nameX: "270",
      nameY: "150"
    }
  ];

  setTimeout(() => {
    console.log("⚙️ Simulating postMessage from Wix...");
    window.postMessage(fakeMessage, "*");
  }, 500);
});*/
