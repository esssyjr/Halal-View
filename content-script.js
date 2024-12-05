// Content script to analyze images and blur explicit ones

// URL of the TensorFlow.js model located in the extension folder
const modelUrl = "http://127.0.0.1:8080/tfjs_model/model.json";


let model;

// Load the model using TensorFlow.js
async function loadModel() {
    try {
        model = await tf.loadGraphModel(modelUrl);
        console.log("Model loaded successfully!");
        processImages();  // Process images once the model is loaded
    } catch (error) {
        console.error("Error loading the model:", error);
    }
}

// Analyze and blur explicit images
async function analyzeAndBlurImage(img) {
    const imgTensor = tf.browser.fromPixels(img).expandDims(0).toFloat().div(255);
    const prediction = await model.predict(imgTensor).data();

    if (prediction[0] > 0.4) {  // Threshold for explicit content (adjust as needed)
        img.style.filter = "blur(10px)";
    }
}

// Process all images on the page
function processImages() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
        img.onload = () => analyzeAndBlurImage(img);  // Analyze image when it's loaded
    });
}

// Observer to monitor dynamically added images (e.g., lazy-loaded images)
const observer = new MutationObserver(() => processImages());
observer.observe(document.body, { childList: true, subtree: true });

// Load the model and start processing images
loadModel();
