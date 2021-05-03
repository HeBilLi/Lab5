// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const imageInput = document.getElementById("image-input");
const canvas = document.getElementById("user-image");
let cvc = canvas.getContext('2d');
const form = document.getElementById("generate-meme");
const clearButton = document.querySelector("button[type='reset']");
const voiceButton = document.querySelector("button[type='button']");
const voiceSlider = document.querySelector("input[type='range']");

let synth = window.speechSynthesis;
var TopText;
var BottomText;
var UpdatedList = true;
var voiceLevel = voiceSlider.value;
var voiceSelect = document.querySelector('select');
var voices;




// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  // Clear Canvas
  cvc.clearRect(0, 0, canvas.width, canvas.height);

  //Toggle buttons
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    if (button.type == "submit") {
      button.disabled = false;
    } else if (button.type == "reset") {
      button.disabled = true;
    } else {
      button.disabled = true;
    }
  }


  //Fill canvas with black
  cvc.fillStyle = "black";
  cvc.fillRect(0, 0, canvas.width, canvas.height);

  //Draw the image
  var dimension = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  cvc.drawImage(img, dimension["startX"], dimension["startY"], dimension["width"], dimension["height"]);

});

imageInput.addEventListener('change', (event) => {
  img.src = URL.createObjectURL(event.target.files[0]);
  img.alt = event.target.files[0].name;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  //Enable anf generate language list options
  voiceSelect.disabled = false;
  voices = synth.getVoices();
  if (UpdatedList == true) {
    for (var i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if (voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
    voiceSelect.options[0].remove();
    UpdatedList = false;
  }

  //Get Texts
  TopText = document.getElementById("text-top").value.toUpperCase();
  BottomText = document.getElementById("text-bottom").value.toUpperCase();

  //Put texts in canvas
  cvc.textAlign = "center";
  cvc.fillStyle = "white";
  cvc.font = "bold 39px Arial";
  cvc.strokeStyle = "black";
  cvc.lineWidth = 1;
  cvc.fillText(TopText, (canvas.width / 2), 40);
  cvc.strokeText(TopText, (canvas.width / 2), 40);
  cvc.fillText(BottomText, (canvas.width / 2), canvas.height - 17);
  cvc.strokeText(BottomText, (canvas.width / 2), canvas.height - 17);


  //Toggle buttons
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    if (button.type == "submit") {
      button.disabled = true;
    } else if (button.type == "reset") {
      button.disabled = false;
    } else {
      button.disabled = false;
    }
  }
})

clearButton.addEventListener("click", (event) => {
  // Clear Canvas
  cvc.clearRect(0, 0, canvas.width, canvas.height);


  //Toggle buttons
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    if (button.type == "submit") {
      button.disabled = false;
    } else if (button.type == "reset") {
      button.disabled = true;
    } else {
      button.disabled = true;
    }
  }
});


voiceButton.addEventListener("click", (event) => {

  //Prepare option
  event.preventDefault();

  TopText = document.getElementById("text-top").value.toUpperCase();
  BottomText = document.getElementById("text-bottom").value.toUpperCase();

  //Read TopText
  var utterThis = new SpeechSynthesisUtterance(TopText);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  utterThis.volume = voiceLevel / 100;
  synth.speak(utterThis);

  //Read BottomText
  var utterThis = new SpeechSynthesisUtterance(BottomText);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = voiceLevel / 100;
  synth.speak(utterThis);
});


voiceSlider.addEventListener("input", (event) => {

  voiceLevel = voiceSlider.value;
  const imgIcon = document.getElementById("volume-group").getElementsByTagName("img")[0];

  if (voiceLevel == 0) {
    imgIcon.src = "icons/volume-level-0.svg";
    imgIcon.alt = "Volume Level 0";
  } else if (voiceLevel <= 33) {
    imgIcon.src = "icons/volume-level-1.svg";
    imgIcon.alt = "Volume Level 2";
  } else if (voiceLevel <= 66) {
    imgIcon.src = "icons/volume-level-2.svg";
    imgIcon.alt = "Volume Level 2";
  } else if (voiceLevel <= 100) {
    imgIcon.src = "icons/volume-level-3.svg";
    imgIcon.alt = "Volume Level 3";
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
