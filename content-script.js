// Load TensorFlow.js model
const modelUrl = chrome.runtime.getURL("tfjs_model/model.json");
let model;

async function loadModel() {
    model = await tf.loadGraphModel(modelUrl);
    console.log("Model loaded!");
}

async function analyzeAndBlurImage(img) {
    // Convert image to tensor
    const imgTensor = tf.browser.fromPixels(img).expandDims(0).toFloat().div(255);
    const prediction = await model.predict(imgTensor).data();

    if (prediction[0] > 0.8) { // Assuming the model outputs a "probability of explicit"
        img.style.filter = "blur(10px)";
    }
}

document.querySelectorAll("img").forEach((img) => {
    analyzeAndBlurImage(img);
});

loadModel();
