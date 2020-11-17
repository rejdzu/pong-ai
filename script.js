const fileUploadId = "file-upload";
const loadStatusId = "load-status";

function setupUpload() {
    var canvasList = document.getElementsByClassName("p5Canvas");

    if (canvasList && canvasList.length > 0) {
        var canvas = canvasList[0];

        var divInput = document.createElement("div");
        divInput.style.marginTop = "30px";

        var fileInput = document.createElement("input");
        fileInput.setAttribute("id", fileUploadId);
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("multiple", "true");

        var uploadInput = document.createElement("input");
        uploadInput.setAttribute("type", "button");
        uploadInput.setAttribute("value", "Upload");

        uploadInput.addEventListener("click", loadModelSync);

        var loadStatus = document.createElement("p");
        loadStatus.setAttribute("id", loadStatusId);

        divInput.appendChild(fileInput);
        divInput.appendChild(uploadInput);
        divInput.appendChild(loadStatus);
    
        canvas.insertAdjacentElement("afterend", divInput);
    }
}

function setStatus(message) {
    document.getElementById(loadStatusId).innerText = message;
}

function loadModelSync() {
    loadModel2();
}

async function loadModel2() {
    const uploadElement = document.getElementById(fileUploadId);

    if (uploadElement && uploadElement.files.length > 0) {
        const model = await tf.loadLayersModel(tf.io.browserFiles([uploadElement.files[0], uploadElement.files[1]]));
        reloadModel(model);
        setStatus("Model loaded");
    } else {
        setStatus("Error loading model");
    }
}