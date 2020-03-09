interface CanvasSize {
  width: number;
  height: number;
}

class PerlinNoise {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasSize: CanvasSize = { width: 0, height: 0 };

  outerGridSize: number = 100;
  outerGrid: number[] = [];

  constructor(el) {
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d");
    this.canvasSize.width = parseInt(this.canvas.getAttribute("width"));
    this.canvasSize.height = parseInt(this.canvas.getAttribute("height"));

    const cellWidth = this.canvasSize.width / 10;
    const cellHeight = this.canvasSize.height / 10;

    const cellsPerRow = this.canvasSize.width / cellWidth;
    const cellsPerCol = this.canvasSize.height / cellHeight;

    for (let y = 0; y < cellsPerCol; y++) {
      for (let x = 0; x < cellsPerRow; x++) {
        this.drawRandomGradient(
          x * cellWidth,
          y * cellHeight,
          cellWidth,
          cellHeight
        );
      }
    }

    this.interpolateAll();
  }

  drawRandomGradient(xPos: number, yPos: number, w: number, h: number): void {
    let gradientAngle = Math.floor(Math.random() * 90);
    const gradientGoal = Math.round(Math.random());
    let gradientStart = [0, h];
    /*switch (Math.floor(Math.random() * 4)) {
      case 0:
        gradientStart = [0, 0];
        break;
      case 1:
        gradientStart = [w, 0];
        break;
      case 2:
        gradientStart = [w, h];
        break;
      case 3:
        gradientStart = [0, h];
        break;
    }*/

    let longestDistance = Math.sqrt(w * w + h * h);

    const c = w / Math.cos(gradientAngle);
    const a = Math.sqrt(Math.pow(c, 2) - Math.pow(w, 2));
    const B = [w, h - a];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const currentPoint = [x, y];
        const distanceA = this.getDistanceBetweenPoints(
          gradientStart,
          currentPoint
        );
        const distanceB = this.getDistanceBetweenPoints(B, currentPoint);
        const area = this.heron(distanceA, distanceB, c);
        const height = area / (0.5 * c);

        const finalDistance = Math.sqrt(
          Math.pow(distanceA, 2) - Math.pow(height, 2)
        );

        let lightness =
          100 -
          this.lerp(
            gradientGoal,
            1 - gradientGoal,
            finalDistance / longestDistance
          ) *
            100;
        this.ctx.fillStyle = `hsl(0,0%,${lightness}%)`;
        this.ctx.fillRect(xPos + x, yPos + y, 1, 1);
      }
    }
  }

  interpolateAll() {
    let previousLightness;

    for (let y = 0; y < this.canvasSize.height; y++) {
      for (let x = 0; x < this.canvasSize.width; x++) {
        const whiteness = this.ctx.getImageData(x, y, 1, 1).data[0];
        const lightness = (whiteness / 255) * 100;
        if (x === 0) previousLightness = lightness;
        const newLightness = this.lerp(previousLightness, lightness, 0.5);

        this.ctx.fillStyle = `hsl(0,0%,${newLightness}%)`;
        this.ctx.fillRect(x, y, 1, 1);
      }
    }

    for (let x = 0; x < this.canvasSize.width; x++) {
      for (let y = 0; y < this.canvasSize.height; y++) {
        const whiteness = this.ctx.getImageData(x, y, 1, 1).data[0];
        const lightness = (whiteness / 255) * 100;
        if (y === 0) previousLightness = lightness;
        const newLightness = this.lerp(previousLightness, lightness, 0.5);

        this.ctx.fillStyle = `hsl(0,0%,${newLightness}%)`;
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  /**
   * Calculates the point of an linear
   * interpolation
   * @param n0 The first number
   * @param n1 The second number
   * @param w Percentage number between 0 and 1
   * @returns {number} The calculated result
   */
  lerp(n0: number, n1: number, w: number): number {
    w = this.clamp(w, 0, 1);
    return n0 * (1 - w) + n1 * w;
  }

  /**
   * Will return the calculated
   * area of a triangle with all
   * three sides given
   * @param a Length of side a
   * @param b Length of side b
   * @param c Length of side c
   * @returns {number} The area of the triangle
   */
  heron(a: number, b: number, c: number): number {
    const p = (a + b + c) / 2;
    const area = Math.sqrt(p * (p - a) * (p - b) * (p - c));
    return area;
  }

  /**
   * Will calculate the direct disance
   * between two points
   * @param point1 First point
   * @param point2 Second point
   * @returns {number} The calculated distance
   */
  getDistanceBetweenPoints(point1: number[], point2: number[]): number {
    const deltaX = point1[0] - point2[0];
    const deltaY = point1[1] - point2[1];
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
  }

  /**
   * Will clamp a given number to a lower- and
   * upper limit
   * @param x The number to clamp
   * @param lowerlimit The lower limit of the number
   * @param upperlimit The upper limit of the number
   */
  clamp(x: number, lowerlimit: number, upperlimit: number): number {
    if (x < lowerlimit) x = lowerlimit;
    if (x > upperlimit) x = upperlimit;
    return x;
  }
}
