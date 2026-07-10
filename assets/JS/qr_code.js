const textInput = document.getElementById('textInput');
const qrColor = document.getElementById('qrColor');
const bgColor = document.getElementById('bgColor');
const generateBtn = document.getElementById('generateBtn');
const qrContainer = document.getElementById('qrContainer');
const downloadBtn = document.getElementById('downloadBtn');

let currentCanvas = null;

function generateQR() {
  const text = textInput.value.trim();
  if (!text) {
    alert('لطفاً متن یا لینک را وارد کنید.');
    return;
  }

  qrContainer.innerHTML = ''; // پاک کردن QR قبلی

  const canvas = document.createElement('canvas');
  currentCanvas = canvas;

  const options = {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: qrColor.value,
      light: bgColor.value,
    },
    width: 256,
    scale: 4,
  };

  QRCode.toCanvas(canvas, text, options, function (error) {
    if (error) {
      alert('خطا در ساخت QR: ' + error);
      return;
    }
    qrContainer.appendChild(canvas);
    downloadBtn.disabled = false;
  });
}

function downloadQR() {
  if (!currentCanvas) return;
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = currentCanvas.toDataURL('image/png');
  link.click();
}

generateBtn.addEventListener('click', generateQR);
downloadBtn.addEventListener('click', downloadQR);