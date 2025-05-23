const canvas = new fabric.Canvas("mugCanvas");
let backgroundImage = null;
let textObject = null;
let selectedFont = "Open Sans";
let selectedColor = "#000000";

function loadBaseBackground(url) {
  fabric.Image.fromURL(
    url,
    function (img) {
      if (!img) return;
      if (backgroundImage) canvas.remove(backgroundImage);

      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      img.set({ left: 0, top: 0, selectable: false });

      backgroundImage = img;
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
    },
    { crossOrigin: "anonymous" }
  );
}

function showPanel(title, contentHTML) {
  const panel = document.getElementById("featurePanel");
  const titleElement = document.getElementById("panelTitle");
  const contentElement = document.getElementById("panelContent");

  titleElement.innerText = title;
  contentElement.innerHTML = contentHTML;
  panel.classList.add("active");

  if (title === "Edit text") {
    attachTextEditorEvents();
  } else if (title === "Change color") {
    attachColorGridEvents();
  } else if (title === "Change font") {
    attachFontPickerEvents();
  }
}

function closePanel() {
  document.getElementById("featurePanel").classList.remove("active");
}

function attachTextEditorEvents() {
  const applyBtn = document.getElementById("applyTextBtn");
  const input = document.getElementById("textInput");

  applyBtn?.addEventListener("click", () => {
    const newText = input.value;
    if (textObject) {
      textObject.text = newText;
    } else {
      textObject = new fabric.Text(newText, {
        left: 100,
        top: 100,
        fontSize: 36,
        fill: selectedColor,
        fontFamily: selectedFont,
      });
      canvas.add(textObject);
    }
    canvas.setActiveObject(textObject);
    canvas.renderAll();
  });

  document.getElementById("colorSetting")?.addEventListener("click", () => {
    showPanel("Change color", "");
  });

  document.getElementById("fontSetting")?.addEventListener("click", () => {
    showPanel("Change font", "");
  });
}

function attachColorGridEvents() {
  const colorGrid = document.createElement("div");
  colorGrid.className = "color-grid";

  const colors = [
    "#ffffff", "#cccccc", "#999999", "#777777", "#666666", "#444444", "#222222", "#000000",
    "#ffff00", "#ffcc00", "#ff9900", "#ff6600", "#ff0000", "#990000", "#ffcccc", "#ff99cc",
    "#cc66cc", "#9933cc", "#660099", "#cc00cc", "#9999ff", "#ccccff", "#00ccff", "#0099cc",
    "#0066cc", "#003366", "#99cccc", "#66ff66", "#00cc00", "#009900", "#006600", "#003300",
    "#ffcc99", "#cc9966", "#993300", "#996633", "#663300", "#330000"
  ];

  const panelContent = document.getElementById("panelContent");
  panelContent.innerHTML = "";

  const backButton = document.createElement("button");
  backButton.textContent = "← Back";
  backButton.style.margin = "10px 0";
  backButton.addEventListener("click", () => {
    const template = document.getElementById("text-tool-template");
    showPanel("Edit text", template.innerHTML);
    setTimeout(() => attachTextEditorEvents(), 50);
  });

  panelContent.appendChild(backButton);

  colors.forEach(color => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;

    swatch.addEventListener("click", () => {
      selectedColor = color;
      if (textObject) {
        textObject.set({ fill: color });
        canvas.renderAll();
      }
      const template = document.getElementById("text-tool-template");
      showPanel("Edit text", template.innerHTML);
      setTimeout(() => attachTextEditorEvents(), 50);
    });

    colorGrid.appendChild(swatch);
  });

  panelContent.appendChild(colorGrid);
}

function attachFontPickerEvents() {
  const fonts = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald",
    "Raleway", "PT Sans", "Merriweather", "Ubuntu", "Playfair Display"
  ];

  const list = document.createElement("div");
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "8px";

  fonts.forEach(font => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const btn = document.createElement("button");
    btn.textContent = font;
    btn.style.fontFamily = font;
    btn.style.padding = "8px";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      selectedFont = font;
      if (textObject) {
        textObject.set({ fontFamily: font });
        canvas.renderAll();
      }
      const template = document.getElementById("text-tool-template");
      showPanel("Edit text", template.innerHTML);
      setTimeout(() => attachTextEditorEvents(), 50);
    });

    list.appendChild(btn);
  });

  const panelContent = document.getElementById("panelContent");
  panelContent.innerHTML = "";

  const backButton = document.createElement("button");
  backButton.textContent = "← Back";
  backButton.style.margin = "10px 0";
  backButton.addEventListener("click", () => {
    const template = document.getElementById("text-tool-template");
    showPanel("Edit text", template.innerHTML);
    setTimeout(() => attachTextEditorEvents(), 50);
  });

  panelContent.appendChild(backButton);
  panelContent.appendChild(list);
}

const sideMenuButtons = document.querySelectorAll("#sideMenu button");
sideMenuButtons[0].addEventListener("click", () => showPanel("Change Product / Color", "<p>Coming soon</p>"));
sideMenuButtons[1].addEventListener("click", () => showPanel("Upload Image", "<p>Coming soon</p>"));
sideMenuButtons[2].addEventListener("click", () => {
  const template = document.getElementById("text-tool-template");
  showPanel("Edit text", template.innerHTML);
  setTimeout(() => attachTextEditorEvents(), 50);
});
sideMenuButtons[3].addEventListener("click", () => showPanel("Choose Design", "<p>Coming soon</p>"));

document.getElementById("closeFeaturePanel").addEventListener("click", closePanel);

window.addEventListener("DOMContentLoaded", () => {
  const fakeMessage = {
    backgroundImage: "https://static.wixstatic.com/media/a0452a_f33e912885e34c1c8e578acf556c55fe~mv2.webp",
  };
  setTimeout(() => {
    window.postMessage(fakeMessage, "*");
  }, 500);
});

window.addEventListener("message", (event) => {
  const data = event.data;
  if (data && data.backgroundImage) {
    loadBaseBackground(data.backgroundImage);
  }
});
