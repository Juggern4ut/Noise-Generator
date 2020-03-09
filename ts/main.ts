window.onload = () => {
  const canvas = document.getElementById("canvas");
  window["noise"] = new PerlinNoise(canvas);
};
