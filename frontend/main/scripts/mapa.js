var isIframLoaded = false;

function iframLoaded() {
    isIframLoaded = true;
    document.getElementById("iframe-map").style.display = "flex";
    document.getElementById("map").style.display = "none";
}

setTimeout(function() {
    if (!isIframLoaded) {
        console.log("hola")
        document.getElementById("iframe-map").style.display = "none";
        document.getElementById("map").style.display = "block";
    }
}, 5000);
