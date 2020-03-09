var PerlinNoise = /** @class */ (function () {
    function PerlinNoise(el) {
        this.canvasSize = { width: 0, height: 0 };
        this.outerGridSize = 100;
        this.outerGrid = [];
        this.canvas = el;
        this.ctx = this.canvas.getContext("2d");
        this.canvasSize.width = parseInt(this.canvas.getAttribute("width"));
        this.canvasSize.height = parseInt(this.canvas.getAttribute("height"));
        var cellWidth = this.canvasSize.width / 10;
        var cellHeight = this.canvasSize.height / 10;
        var cellsPerRow = this.canvasSize.width / cellWidth;
        var cellsPerCol = this.canvasSize.height / cellHeight;
        for (var y = 0; y < cellsPerCol; y++) {
            for (var x = 0; x < cellsPerRow; x++) {
                this.drawRandomGradient(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }
        }
        this.interpolateAll();
    }
    PerlinNoise.prototype.drawRandomGradient = function (xPos, yPos, w, h) {
        var gradientAngle = Math.floor(Math.random() * 90);
        var gradientGoal = Math.round(Math.random());
        var gradientStart = [0, h];
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
        var longestDistance = Math.sqrt(w * w + h * h);
        var c = w / Math.cos(gradientAngle);
        var a = Math.sqrt(Math.pow(c, 2) - Math.pow(w, 2));
        var B = [w, h - a];
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var currentPoint = [x, y];
                var distanceA = this.getDistanceBetweenPoints(gradientStart, currentPoint);
                var distanceB = this.getDistanceBetweenPoints(B, currentPoint);
                var area = this.heron(distanceA, distanceB, c);
                var height = area / (0.5 * c);
                var finalDistance = Math.sqrt(Math.pow(distanceA, 2) - Math.pow(height, 2));
                var lightness = 100 -
                    this.lerp(gradientGoal, 1 - gradientGoal, finalDistance / longestDistance) *
                        100;
                this.ctx.fillStyle = "hsl(0,0%," + lightness + "%)";
                this.ctx.fillRect(xPos + x, yPos + y, 1, 1);
            }
        }
    };
    PerlinNoise.prototype.interpolateAll = function () {
        var previousLightness;
        for (var y = 0; y < this.canvasSize.height; y++) {
            for (var x = 0; x < this.canvasSize.width; x++) {
                var whiteness = this.ctx.getImageData(x, y, 1, 1).data[0];
                var lightness = (whiteness / 255) * 100;
                if (x === 0)
                    previousLightness = lightness;
                var newLightness = this.lerp(previousLightness, lightness, 0.5);
                this.ctx.fillStyle = "hsl(0,0%," + newLightness + "%)";
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
        for (var x = 0; x < this.canvasSize.width; x++) {
            for (var y = 0; y < this.canvasSize.height; y++) {
                var whiteness = this.ctx.getImageData(x, y, 1, 1).data[0];
                var lightness = (whiteness / 255) * 100;
                if (y === 0)
                    previousLightness = lightness;
                var newLightness = this.lerp(previousLightness, lightness, 0.5);
                this.ctx.fillStyle = "hsl(0,0%," + newLightness + "%)";
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    };
    /**
     * Calculates the point of an linear
     * interpolation
     * @param n0 The first number
     * @param n1 The second number
     * @param w Percentage number between 0 and 1
     * @returns {number} The calculated result
     */
    PerlinNoise.prototype.lerp = function (n0, n1, w) {
        w = this.clamp(w, 0, 1);
        return n0 * (1 - w) + n1 * w;
    };
    /**
     * Will return the calculated
     * area of a triangle with all
     * three sides given
     * @param a Length of side a
     * @param b Length of side b
     * @param c Length of side c
     * @returns {number} The area of the triangle
     */
    PerlinNoise.prototype.heron = function (a, b, c) {
        var p = (a + b + c) / 2;
        var area = Math.sqrt(p * (p - a) * (p - b) * (p - c));
        return area;
    };
    /**
     * Will calculate the direct disance
     * between two points
     * @param point1 First point
     * @param point2 Second point
     * @returns {number} The calculated distance
     */
    PerlinNoise.prototype.getDistanceBetweenPoints = function (point1, point2) {
        var deltaX = point1[0] - point2[0];
        var deltaY = point1[1] - point2[1];
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distance;
    };
    /**
     * Will clamp a given number to a lower- and
     * upper limit
     * @param x The number to clamp
     * @param lowerlimit The lower limit of the number
     * @param upperlimit The upper limit of the number
     */
    PerlinNoise.prototype.clamp = function (x, lowerlimit, upperlimit) {
        if (x < lowerlimit)
            x = lowerlimit;
        if (x > upperlimit)
            x = upperlimit;
        return x;
    };
    return PerlinNoise;
}());
