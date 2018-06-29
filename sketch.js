const size = 9;
const fieldSizeX = 3;
const fieldSizeY = 3;

const numsToRemove = 60;

const fieldScale = 90;

let board;
let selectedField;
let filledNumbers = 0;

function Field(x, y) {
    this.x = x;
    this.y = y;
    this.number = null;
    this.predetermined = true;

    this.makeOptions();
}

Field.prototype.makeOptions = function() {
    this.options = new Array();

    for (let i = 1; i <= size; i++) {
        this.options.push(i);
    }
}

function setup() {
    createCanvas(fieldScale * size, fieldScale * size + 50);

    board = new Array(size);
    for (let i = 0; i < size; i++) {
        board[i] = new Array(size);
    }

    generateSudoku();
    removeNums();
}

function generateSudoku() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            board[x][y] = new Field(x, y);
        }
    }

    let i = 0;
    while (i < size * size) {
        let x = floor(i / size);
        let y = i % size;

        let field = board[x][y];

        if (field.options.length > 0) {
            let choice = floor(random() * field.options.length);
            field.number = field.options[choice];
            field.options.splice(choice, 1);

            if (isPositionValid(x, y)) {
                i++;
            }
        } else {
            field.number = null;
            field.makeOptions();
            i--;
        }
    }
}

function removeNums() {
    let i = 0;
    while (i < numsToRemove) {
        let x = floor(random() * size);
        let y = floor(random() * size);

        let field = board[x][y];
        if (field.number !== null) {
            field.number = null;
            field.predetermined = false;

            i++;
        }
    }
}

function isPositionValid(x, y) {
    //Row and column
    for (let i = 0; i < size; i++) {
        if (i !== x && board[x][y].number === board[i][y].number) {
            return false;
        }

        if (i !== y && board[x][y].number === board[x][i].number) {
            return false;
        }
    }

    //Weird 3x3 field
    let fieldX = floor(x / fieldSizeX) * fieldSizeX;
    let fieldY = floor(y / fieldSizeY) * fieldSizeY;

    for (let i = 0; i < fieldSizeX; i++) {
        for (let j = 0; j < fieldSizeY; j++) {
            let theX = fieldX + i;
            let theY = fieldY + j;

            if ((theX !== x || theY !== y) && board[x][y].number === board[theX][theY].number) {
                return false;
            }
        }
    }

    return true;
}

function mousePressed() {
    let x = floor(mouseX / fieldScale);
    let y = floor(mouseY / fieldScale);

    if (x >= 0 && y >= 0 && x < size && y < size) {
        let field = board[x][y];
        if (!field.predetermined) {
            selectedField = field;
            return;
        }
    }

    selectedField = null;
}

function mouseWheel(event) {
    if (selectedField !== null) {
        let down = event.delta > 0;

        if (selectedField.number === null) {
            selectedField.number = down ? size : 1;
            filledNumbers++;
        } else if (selectedField.number === (down ? 1 : size)) {
            selectedField.number = null;
            filledNumbers--;
        } else {
            selectedField.number += (down ? -1 : 1);
        }

        return false;
    }
}

function draw() {
    background(255);

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let field = board[x][y];

            if (field === selectedField) {
                noStroke();
                fill(200, 255, 200);
                rect(x * fieldScale, y * fieldScale, fieldScale, fieldScale);
            }

            if (field.predetermined) {
                noStroke();
                fill(230);
                rect(x * fieldScale, y * fieldScale, fieldScale, fieldScale);
            }

            noFill();
            stroke(0);
            strokeWeight(2);
            rect(x * fieldScale, y * fieldScale, fieldScale, fieldScale);

            if (x > 1 && x % fieldSizeX === 0) {
                strokeWeight(6);
                line(x * fieldScale, y * fieldScale, x * fieldScale, (y + 1) * fieldScale);
            }

            if (y > 1 && y % fieldSizeY === 0) {
                strokeWeight(6);
                line(x * fieldScale, y * fieldScale, (x + 1) * fieldScale, y * fieldScale);
            }

            if (field.number !== null) {
                fill(0);
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(50);
                text(String(field.number), x * fieldScale + fieldScale / 2, y * fieldScale + fieldScale / 2);
            }
        }
    }

    fill(0);
    noStroke();
    textAlign(LEFT);
    textSize(30);
    text('Spaces filled: ' + filledNumbers + '/' + numsToRemove, 0, fieldScale * size + 20);
}