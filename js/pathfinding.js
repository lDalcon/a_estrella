let canvas;
let ctx;
let fps = 120;

let column = 50;
let row = 50;
let stage;

let width;
let height;

const wall = '#000000';
const empty = '#777777';

let openSet = [];
let closeSet = [];

let path = [];
let finished = false;

let from;
let to;

createStage = (row, column) => {
    let obj = new Array(row);
    for (let i = 0; i < row; i++) {
        obj[i] = new Array(column);
    }
    return obj;
}

distance = (from, to) => {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

updateArray = (array, element) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1);
        }
    }
}

function Box(x, y) {
    this.x = x;
    this.y = y;
    this.type = 0;

    let random = Math.floor(Math.random() * 5);
    if (random == 1) this.type = 1;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbor = [];
    this.father = null;

    this.addNeighbor = () => {
        if (this.x > 0) this.neighbor.push(stage[this.x - 1][this.y]);
        if (this.x < row - 1) this.neighbor.push(stage[this.x + 1][this.y]);
        if (this.y > 0) this.neighbor.push(stage[this.x][this.y - 1]);
        if (this.y < column - 1) this.neighbor.push(stage[this.x][this.y + 1]);
    }

    this.draw = () => {
        let color;
        if (this.type == 0) {
            color = empty;
        } else {
            color = wall;
        }
        ctx.fillStyle = color;
        ctx.fillRect(this.x * width, this.y * height, width, height);
    }

    this.drawOpenSet = () => {
        ctx.fillStyle = '#008000';
        ctx.fillRect(this.x * width, this.y * height, width, height);
    }

    this.drawCloseSet = () => {
        ctx.fillStyle = '#800000';
        ctx.fillRect(this.x * width, this.y * height, width, height);
    }

    this.drawPath = () => {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x * width, this.y * height, width, height);
    }
}

start = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    width = parseInt(canvas.width / column);
    height = parseInt(canvas.height / row);
    stage = createStage(row, column);

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            stage[i][j] = new Box(i, j);
        }
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            stage[i][j].addNeighbor();
        }
    }

    from = stage[0][0];
    to = stage[row - 1][column - 1];
    openSet.push(from);

    setInterval(() => {
        main();
    }, 1000 / fps);
}

drawStage = () => {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            stage[i][j].draw();
        }
    }
    for (let i = 0; i < openSet.length; i++) {
        openSet[i].drawOpenSet();
    }
    for (let i = 0; i < closeSet.length; i++) {
        closeSet[i].drawCloseSet();
    }
    for (let i = 0; i < path.length; i++) {
        path[i].drawPath();
    }
}

cleanCanvas = () => {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

a_star = () => {
    if (!finished) {
        if (openSet.length > 0) {
            let indexWin = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[indexWin].f) indexWin = i;
            }
            let current = openSet[indexWin];
            if (current === to) {
                let temp = current;
                path.push(temp);
                while (temp.father) {
                    temp = temp.father;
                    path.push(temp);
                }
                console.log(path);
                finished = true;
                alert('Camino encontrado!!')
            } else {
                updateArray(openSet, current);
                closeSet.push(current);

                let neighbors = current.neighbor;

                for (let i = 0; i < neighbors.length; i++) {
                    let tempNeighbor = neighbors[i];
                    if (!closeSet.includes(tempNeighbor) && tempNeighbor.type != 1) {
                        let tempG = current.g + 1;
                        if (openSet.includes(tempNeighbor)) {
                            if (tempG < tempNeighbor.g) {
                                tempNeighbor.g = tempG;
                            }
                        } else {
                            tempNeighbor.g = tempG;
                            openSet.push(tempNeighbor);
                        }
                        tempNeighbor.h = distance(tempNeighbor, to);
                        tempNeighbor.f = tempNeighbor.g + tempNeighbor.h;
                        tempNeighbor.father = current;
                    }
                }
            }
        } else {
            alert('Camino no encontrado!!');
            finished = true;
        }
    }
}

main = () => {
    cleanCanvas();
    a_star();
    drawStage();
}