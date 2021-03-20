"use strict";
var Shape = /** @class */ (function () {
    function Shape(x, y, radius, i, j, shouldDraw) {
        if (shouldDraw === void 0) { shouldDraw = true; }
        this.id = i + "-" + j;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.i = i;
        this.j = j;
        this.shouldDraw = shouldDraw;
    }
    Shape.prototype.toString = function () {
        return "draw is " + this.shouldDraw + ", i is " + this.i + ", j is " + this.j;
    };
    return Shape;
}());
var GameStateObject = /** @class */ (function () {
    function GameStateObject() {
        this.array = [];
        this.shapes = [];
    }
    return GameStateObject;
}());
// import {fitShapesToCanvas2} from "./drawings";
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        // rules to game_state array:
        // all the inner arrays must be in the same length
        // deleting a shape can be executed by changing its position to false and than redrawing
        //var global_game_state = [[true, true, false, false],[true, true, false, false], [true, true, true, true], [true, false, true, true]]
        this.globalGameState = {
            array: [],
            shapes: [],
        };
        this.turns = 0; // if turns % 2 === 0 than it is player 1, if not - player 2
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            //document.documentElement.classList.add('dark')
            this.color = "#dbdbdb";
        }
        else
            this.color = "black";
        window.addEventListener("resize", function () {
            _this.resizeFunc();
        });
        this.canvas.addEventListener("click", function (e) {
            _this.clickFunc(e);
        });
        window.addEventListener("load", function () { return _this.promptGameState(); });
    }
    Game.prototype.resizeFunc = function () {
        this.canvas.height = Math.round(window.innerHeight - window.innerHeight * 0.1 - 30);
        this.canvas.width = Math.round(window.innerWidth - window.innerWidth * 0.1 - 30);
        console.log("resize triggered. width: " + this.canvas.width + ", height: " + this.canvas.height + " ");
        // this.fitShapesToCanvas(this.canvas.height, this.canvas.width, this.globalGameState.array.length, this.globalGameState.array[0].length);
        this.fitShapesToCanvas2(this.canvas, this.globalGameState);
        this.drawShapes(this.globalGameState.shapes);
    };
    Game.prototype.clickFunc = function (e) {
        var CANVASpos = this.getMousePos(e);
        for (var _i = 0, _a = this.globalGameState.shapes; _i < _a.length; _i++) {
            var circle = _a[_i];
            if (this.isIntersect(CANVASpos, circle) === true) {
                if (circle.i === this.globalGameState.array.length - 1 &&
                    circle.j === 0) {
                    this.turns++;
                    this.globalGameState.array = this.updateGameState(this.globalGameState.array, circle);
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    console.log("THE GAME HAS ENDED");
                    document.getElementById("reserved").textContent = "The game has ended in " + this.turns + " turns, Player " + (this.turns % 2 == 0 ? 1 : 2) + " won! ";
                    // document.getElementById("Holder2")!.innerHTML = `<button class="bt" type="button">Would you like to play again? If so, click here!</button>`
                    // document.getElementById("Holder2")!.addEventListener("click", () => {
                    //   location.reload();
                    // });
                    document
                        .getElementById("Holder2")
                        .setAttribute("x-data", "{ open: true }");
                    break;
                }
                else {
                    this.turns++;
                    this.globalGameState.array = this.updateGameState(this.globalGameState.array, circle);
                    this.updateShapesDrawStateByArray();
                    this.drawShapes(this.globalGameState.shapes);
                }
            }
        }
    };
    Game.prototype.promptGameState = function () {
        var n = parseInt(prompt("Please enter the amount of rows you want (no more than 8)") || "8");
        var m = parseInt(prompt("Please enter the amount of columns you want (no more than 8)") || "5");
        console.log("n is " + n + " and m is " + m);
        if (isNaN(n) || n > 8)
            n = 8;
        if (isNaN(m) || m > 8)
            m = 8;
        var arr = [];
        if (n != null && m != null) {
            for (var i = 0; i < n; i++) {
                arr.push([]);
                this.globalGameState.array.push([]);
                for (var j = 0; j < m; j++) {
                    arr[i].push(true);
                    this.globalGameState.array[i].push(true);
                }
            }
            console.log("\n\n");
            this.createShapesByArray(arr);
        }
    };
    Game.prototype.updateGameStateArray = function (gameStateArray) {
        this.globalGameState.array = gameStateArray;
    };
    Game.prototype.updateGameStateShapes = function (gameStateShapes) {
        this.globalGameState.shapes = gameStateShapes;
    };
    // fitShapesToCanvas2 = require('./drawings');
    // imported up top
    // fitShapesToCanvas2 = require('./drawings');
    Game.prototype.fitShapesToCanvas2 = function (canvas, game_state) {
        // declaring constants
        var width = canvas.width, height = canvas.height;
        var rows = game_state.array.length, shapes_in_row = game_state.array[0].length;
        // declaring an array that which include all the shapes in the end
        var shapes = [];
        // empty space gap
        var gapX = Math.round((width * 0.1) / (shapes_in_row + 1)); // Math.round(r / (shapes_in_row + 1));
        var gapY = Math.round((height * 0.1) / (rows + 1)); // Math.round(r / (rows + 1));
        // calculating maximum bound radius
        var r = Math.floor(width > height
            ? (height * 0.85) /
                (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2)
            : (width * 0.85) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2));
        // calculating the gap between the space the shapes take and space the canvas has
        var dx = Math.round(width - 2 * r * shapes_in_row - (shapes_in_row + 1) * gapX);
        var dy = Math.round(height - 2 * r * rows - (rows + 1) * gapY);
        // calculating xI - the first x position we can a shape at
        // and yI - the first y position we can a shape at
        var xI = dx > 0
            ? Math.round(width - 2 * r * shapes_in_row - dx / 2 - gapX)
            : Math.round(width - 2 * r * shapes_in_row - (dx * 3) / 2 + r);
        var yI = dy > 0
            ? Math.round(height - 2 * r * rows - dy / 2 - gapY)
            : Math.round(height - 2 * r * rows - (dy * 3) / 2 + r);
        // logs
        console.log("rows is [" + rows + "], shapes_in_row: [" + shapes_in_row + "]");
        console.log("window height [" + window.innerHeight + "], window width: [" + window.innerWidth + "]\n\n      canvas height: [" + height + "], canvas width: [" + width + "]");
        console.log("gapX [" + gapX + "], gapY [" + gapY + "]");
        console.log("the radius is [" + r + "], would have been [" + (height * 0.9) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2) + "]");
        console.log("dx is [" + dx + "], dy is [" + dy + "]");
        console.log("xI is [" + xI + "], yI is " + yI);
        // creating the shapes
        for (var i = 0; i < rows; i++) {
            var curr_row = game_state.array[i];
            for (var j = 0; j < curr_row.length; j++) {
                var curr_shape = curr_row[j];
                if (curr_shape != null) {
                    var x = Math.round(xI + j * (2 * r + gapX));
                    var y = Math.round(yI + i * (2 * r + gapY));
                    var shape = new Shape(x, y, r, i, j, curr_shape);
                    shapes.push(shape);
                }
            }
        }
        this.updateGameStateShapes(shapes);
        return shapes;
    };
    // fitShapesToCanvasFromMiddle(canvas: HTMLCanvasElement, game_state: GameState) {
    //   // declaring constants
    //   const width = canvas.width, height = canvas.height;
    //   const rows = game_state.array.length, shapes_in_row = game_state.array[0].length;
    //   // declaring an array that which include all the shapes in the end
    //   let shapes = [];
    //   const middle = {
    //     x: Math.round(width / 2),
    //     y: Math.round(height / 2),
    //   }
    //   // empty space gap
    //   const perc = 10;
    //   const gapX = Math.round(width * (perc / 100) / (shapes_in_row + 1)); // Math.round(r / (shapes_in_row + 1));
    //   const gapY = Math.round(height * 0.1 / (rows + 1)); // Math.round(r / (rows + 1));
    //   // calculating maximum bound radius
    //   const r = Math.floor(width > height ? height * (1 - (perc + 5) / 100) / (rows > shapes_in_row ? (2 * rows) : (shapes_in_row * 2))
    //     : width * (1 - (perc + 5) / 100) / (rows > shapes_in_row ? (2 * rows) : (shapes_in_row * 2)));
    //   this.updateGameStateShapes(shapes);
    //   return shapes;
    // }
    Game.prototype.fitShapesToCanvas = function (height, width, rows, shapes_in_row) {
        var currGameState = this.globalGameState.array;
        var shapes = [];
        // for a game in which width is smaller than height
        if (height > width) {
            console.log("height mode\nwidth: " + width + ", height: " + height + "\n");
            // we wish to leave 10% of the canvas for empty space padding
            var xI = Math.round((width * 0.1) / (shapes_in_row + 1)), xF = Math.round(width - xI);
            //const r = width * 0.9 / (2 * shapes_in_row);
            var r = (width * 0.9) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2);
            var yI = Math.round((height * 0.1) / (rows + 1)), yF = Math.round(height - yI);
            for (var i = currGameState.length - 1; i >= 0; i--) {
                var curr_row = currGameState[i];
                for (var j = 0; j < curr_row.length; j++) {
                    var curr_shape = curr_row[j];
                    if (curr_shape != null) {
                        var x = Math.round(xI + r + j * (2 * r + xI));
                        var y = Math.round(yI + r + i * (2 * r + yI));
                        var shape = new Shape(x, y, r, i, j, curr_shape);
                        shapes.push(shape);
                    }
                }
            }
        }
        else {
            console.log("width mode\nwidth: " + width + ", height: " + height + "\n");
            // console.log(`curr game state is ${currGameState} len is ${currGameState.length}`)
            //let xI = Math.round(width * 0.1 / (shapes_in_row + 1)), xF = Math.round(width - xI);
            var r = (height * 0.9) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2);
            var xI = Math.round(this.canvas.width * 0.1 + r); // - (2* r * (shapes_in_row - 1) )
            var yI = Math.round((height * 0.1) / (rows + 1)), yF = Math.round(height - yI);
            for (var i = currGameState.length - 1; i >= 0; i--) {
                var curr_row = currGameState[i];
                // console.log(`curr row in i[${i}] is [${curr_row}]`)
                for (var j = 0; j < curr_row.length; j++) {
                    var curr_shape = curr_row[j];
                    // console.log(`curr shape in i[${i}] j[${j}] is [${curr_row[j]}]`)
                    if (curr_shape != null && curr_shape === true) {
                        var x = Math.round(xI + r + j * (2 * r + (width * 0.1) / (shapes_in_row + 1)));
                        var y = Math.round(yI + r + i * (2 * r + yI));
                        var shape = new Shape(x, y, r, i, j, true);
                        shapes.push(shape);
                    }
                }
            }
        }
        this.updateGameStateShapes(shapes);
        return shapes;
    };
    Game.prototype.createShapesByArray = function (currGameState) {
        // this could should only run once in the beginning of each game
        // it sets all values to true
        // to change the shapes from true please use the updateShapesDrawStateByArray
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.height = Math.round(window.innerHeight - window.innerHeight * 0.1 - 30);
        this.canvas.width = Math.round(window.innerWidth - window.innerWidth * 0.1 - 30);
        var shapes = [];
        var rows = currGameState.length;
        var shapes_in_row = currGameState[currGameState.length - 1].length;
        shapes = this.fitShapesToCanvas(this.canvas.height, this.canvas.width, rows, shapes_in_row);
        shapes = this.fitShapesToCanvas2(this.canvas, this.globalGameState);
        this.drawShapes(shapes);
    };
    Game.prototype.updateShapesDrawStateByArray = function () {
        for (var _i = 0, _a = this.globalGameState.shapes; _i < _a.length; _i++) {
            var circle = _a[_i];
            circle.shouldDraw = this.globalGameState.array[circle.i][circle.j];
        }
    };
    Game.prototype.drawShapesByGameState = function (currGameState) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var _i = 0, _a = currGameState.shapes; _i < _a.length; _i++) {
            var circle = _a[_i];
            if (circle.shouldDraw) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = "black";
                this.ctx.fill();
            }
        }
    };
    Game.prototype.drawShapes = function (shapes) {
        if (shapes === void 0) { shapes = this.globalGameState.shapes; }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // console.log(`shapes is ${shapes} \nin draw shapes\n`)
        for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
            var circle = shapes_1[_i];
            if (circle.shouldDraw === true) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
                // this.ctx.fillStyle = "black";
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
            // else console.log("there is a false draw")
        }
    };
    Game.prototype.updateGameState = function (currGameState, circle) {
        // all shapes above and to the right should be turned to false
        // console.log(`\ncircle is: ${circle.id} with x: ${circle.x} and y: ${circle.y}\n`);
        for (var i = 0; i <= circle.i; i++) {
            // console.log(`curr game state in row ${i} ${currGameState[i]}`)
            var curr_row = currGameState[i];
            for (var j = curr_row.length - 1; j >= circle.j; j--) {
                // console.log(`curr game state in shape ${j} ${currGameState[i][j]}`)
                curr_row[j] = false;
            }
        }
        return currGameState;
    };
    Game.prototype.isIntersect = function (point, circle) {
        var distance = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
        return distance < circle.radius;
    };
    Game.prototype.getMousePos = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            rectX: rect.x,
            eveX: e.pageX,
            rectY: rect.y,
            eveY: e.pageY,
        };
    };
    return Game;
}());
console.clear();
var game = new Game();
// export {GameState as GameState, boolState as boolState, GameStateObject, Shape as Shape};
