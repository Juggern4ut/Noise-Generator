window.onload = function () {
    var canvas = document.getElementById("canvas");
    window["noise"] = new PerlinNoise(canvas);
};
