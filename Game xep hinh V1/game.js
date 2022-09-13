let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let row = 15;
let col = 20;
let sq = 35;
let COLOR = "white";
let gameOver = false;
let score = 0;
//Hàm vẽ ô vuông
function drawsquare(x, y, COLOR) {
  ctx.fillStyle = COLOR;
  ctx.fillRect(x * sq, y * sq, sq, sq);

  ctx.strokeStyle = "#ccc";
  ctx.strokeRect(x * sq, y * sq, sq, sq);
}
//Đổ màu cho các ô vuông
let board = [];
for (let r = 0; r < row; r++) {
  board[r] = [];
  for (let c = 4; c < col - 5; c++) {
    board[r][c] = COLOR;
  }
}
//Vẽ Khung hình cho game là tập hợp các ô vuông
function drawboard() {
  for (let r = 0; r < row; r++) {
    for (let c = 4; c < col - 5; c++) {
      drawsquare(c, r, board[r][c]);
    }
  }
}
drawboard();
// Khai báo lớp
class Piece {
  constructor(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 8;
    this.y = -2;
  }
  //Phương thức đổ màu cho mảnh ghép
  fill(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (this.activeTetromino[r][c]) {
          drawsquare(this.x + c, this.y + r, color);
        }
      }
    }
  }
  //Gọi hàm đổ màu cho mảnh ghép
  draw() {
    this.fill(this.color);
  }
  //Gọi hàm xóa màu mảnh ghép
  undraw() {
    this.fill(COLOR);
  }
  //Phương thức di chuyển mảnh ghép xuống
  moveDown() {
    if (!this.collision(0, 1, this.activeTetromino)) {
      this.undraw();
      this.y++;
      this.draw();
    } else {
      this.lock();
      p = randomPiece();
    }
  }
  //Phương thức di chuyển mảnh ghép sang trái
  moveLeft() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
      this.undraw();
      this.x--;
      this.draw();
    }
  }
  //Phương thức di chuyển mảnh ghép sang phải
  moveRight() {
    if (!this.collision(1, 0, this.activeTetromino)) {
      this.undraw();
      this.x++;
      this.draw();
    }
  }
  //Phương thức khóa mảnh ghép khi chạm thành dưới khung hình
  lock() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (!this.activeTetromino[r][c]) {
          continue;
        } 
        else if (this.y + r < 0) {
          alert("Game over");
          
          gameOver = true;
          break;
        } 
        else {
          board[this.y + r][this.x + c] = this.color;
        }
      }
    }

    //Xóa hàng khi lấp đầy 1 hàng và tính điểm
    for (let r = 0; r < row; r++) {
      let PieceFull = true;
      for (let c = 4; c < col - 5; c++) {
        PieceFull = PieceFull && board[r][c] != COLOR;
      }
      if (PieceFull) {
        for (let y = r; y > 0; y--) {
          for (let c = 4; c < col - 5; c++) {
            board[y][c] = board[y - 1][c];
          }
        }
        for (let c = 4; c < col - 5; c++) {
          board[0][c] = COLOR;
        }
        score += 10;
      }
    }
    drawboard();
    document.getElementById("score").innerHTML = "Điểm: " + score;
  }
  //Phương thức xác định va chạm với thành bên trái, bên phải, thành dưới và thành trên của khung hình
  collision(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        let newX = this.x + c + x;
        let newY = this.y + r + y;
        if (!piece[r][c]) {
          continue;
        } else {
          if (newX < 0 || newX >= col || newY >= row) {
            return true;
          } else if (newY < 0) {
            continue;
          }
        }
        // Trường hợp mảnh ghép tràn ra ngoài thành trên canvas thì tính là va chạm
        if (board[newY][newX] != COLOR) {
          return true;
        }
      }
    }
    return false;
  }
  //Phương thức quay mảnh ghép
  rotate() {
    let nextPattern =
      this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let moveRotate = 0;
    if (this.collision(0, 0, nextPattern)) {
      if (this.x > col / 2) {
        moveRotate = -1;
      } else {
        moveRotate = 1;
      }
    } else if (!this.collision(0, 0, nextPattern)) {
      this.undraw();
      this.x += moveRotate;
      this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
      this.activeTetromino = this.tetromino[this.tetrominoN];
      this.draw();
    }
  }
}
//Khai báo tham số đầu vào cho Lớp (là dữ liệu mảnh ghép (hình dạng và màu sắc của mảnh ghép))
const PIECE = [
  [L, "blue"],
  [T, "red"],
  [I, "green"],
  [II, "gray"],
  [Z, "yellow"],
  [V, "brown"]
];
//Hàm khởi tạo đối tượng
function randomPiece() {
  let i = Math.floor(Math.random() * PIECE.length);
  return new Piece(PIECE[i][0], PIECE[i][1]); // Khởi tạo đối tượng
}

let p = randomPiece();
console.log(p);

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37) {
    p.moveLeft();
  } else if (e.keyCode == 39) {
    p.moveRight();
  } else if (e.keyCode == 38) {
    p.rotate();
  } else if (e.keyCode == 40) {
    p.moveDown();
  }
});

function move() {
  p.moveDown();
}

function drop() {
  let interval = setInterval(move, 1000);
  if (!gameOver) {
    interval;
  } else {
    clearInterval(interval);
  }
}

drop();
