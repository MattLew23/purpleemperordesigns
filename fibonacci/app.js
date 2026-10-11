const fileInput = document.getElementById('fileInput');
const cameraInput = document.getElementById('cameraInput');
const dropZone = document.getElementById('dropZone');
const outputCanvas = document.getElementById('outputCanvas');
const exportPng = document.getElementById('exportPng');
const exportJpg = document.getElementById('exportJpg');
const resetButton = document.getElementById('resetButton');

const ctx = outputCanvas.getContext('2d');
const ratioPattern = [2, 3, 5, 3, 2];
let sourceImage = null;

function patternSegments(totalWidth) {
  const total = ratioPattern.reduce((sum, n) => sum + n, 0);
  let cursor = 0;

  return ratioPattern.map((ratio, index) => {
    const rawWidth = (ratio / total) * totalWidth;
    const width = index === ratioPattern.length - 1 ? totalWidth - cursor : Math.round(rawWidth);
    const segment = { x: cursor, width };
    cursor += width;
    return segment;
  });
}

function drawComposed() {
  if (!sourceImage) return;

  outputCanvas.width = sourceImage.naturalWidth;
  outputCanvas.height = sourceImage.naturalHeight;

  const sourceSegments = patternSegments(sourceImage.naturalWidth);
  const targetSegments = patternSegments(outputCanvas.width);

  const sourceOrder = [0, 3, 2, 1, 4];

  targetSegments.forEach((target, targetIndex) => {
    const source = sourceSegments[sourceOrder[targetIndex]];
    const rotate = targetIndex === 1 || targetIndex === 3;

    if (!rotate) {
      ctx.drawImage(
        sourceImage,
        source.x,
        0,
        source.width,
        sourceImage.naturalHeight,
        target.x,
        0,
        target.width,
        outputCanvas.height,
      );
      return;
    }

    ctx.save();
    ctx.translate(target.x + target.width / 2, outputCanvas.height / 2);
    ctx.rotate(Math.PI);
    ctx.drawImage(
      sourceImage,
      source.x,
      0,
      source.width,
      sourceImage.naturalHeight,
      -target.width / 2,
      -outputCanvas.height / 2,
      target.width,
      outputCanvas.height,
    );
    ctx.restore();
  });

  exportPng.disabled = false;
  exportJpg.disabled = false;
}

function loadImage(file) {
  if (!file || !/^image\/(jpeg|png)$/i.test(file.type)) {
    alert('Please upload a JPG or PNG image.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      sourceImage = img;
      drawComposed();
      localStorage.setItem('fib-last-source', reader.result);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function restoreFromStorage() {
  const dataUrl = localStorage.getItem('fib-last-source');
  if (!dataUrl) return;

  const img = new Image();
  img.onload = () => {
    sourceImage = img;
    drawComposed();
  };
  img.src = dataUrl;
}

function setupDragAndDrop() {
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
    const [file] = event.dataTransfer.files;
    loadImage(file);
  });
}

function download(mimeType, extension) {
  if (!sourceImage) return;
  const link = document.createElement('a');
  link.download = `fibonacci-composed.${extension}`;
  link.href = outputCanvas.toDataURL(mimeType, 0.95);
  link.click();
}

fileInput.addEventListener('change', (event) => loadImage(event.target.files[0]));
cameraInput.addEventListener('change', (event) => loadImage(event.target.files[0]));
exportPng.addEventListener('click', () => download('image/png', 'png'));
exportJpg.addEventListener('click', () => download('image/jpeg', 'jpg'));
resetButton.addEventListener('click', () => {
  sourceImage = null;
  ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  exportPng.disabled = true;
  exportJpg.disabled = true;
  localStorage.removeItem('fib-last-source');
});

setupDragAndDrop();
restoreFromStorage();
