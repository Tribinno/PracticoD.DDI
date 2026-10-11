const canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d");
const dino = new Image(), cactus = new Image();
dino.src = "dino.png";
cactus.src = "cactus.png";
dino.onerror = function() { console.error("No se pudo cargar dino.png"); };
cactus.onerror = function() { console.error("No se pudo cargar cactus.png"); };
let dinoY = 143, salto = 0, cactusX = canvas.width, puntos = 0, fin = false, cactusContado = false;
function dibujar() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 190, canvas.width, 30);
  if (dino.complete && dino.naturalWidth > 0) {
    ctx.drawImage(dino, 55, dinoY, 44, 47);
  }
  if (cactus.complete && cactus.naturalWidth > 0) {
    ctx.drawImage(cactus, cactusX, 150, 39, 40);
  }
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Puntos: " + puntos, 18, 28);
  if (fin) ctx.fillText("Fin del juego", 300, 110);
}
function jugar() {
  if (!fin) {
    cactusX -= 7;
    if (cactusX + 39 < 55 && !cactusContado) {
      puntos++;
      cactusContado = true;
    }
    if (cactusX < -39) {
      cactusX = canvas.width;
      cactusContado = false;
    }
    if (salto !== 0 || dinoY < 143) {
      dinoY += salto;
      salto += 0.5;
      if (dinoY >= 143) { dinoY = 143; salto = 0; }
    }
    if (55 < cactusX + 39 && 99 > cactusX &&
        dinoY < 190 && dinoY + 47 > 150) {
      fin = true;
      document.getElementById("restartBtn").style.display = "inline";
    }
  }
  dibujar();
  requestAnimationFrame(jugar);
}
document.addEventListener("keydown", function(event) {
  if (event.code === "Space" && dinoY === 143 && salto === 0 && !fin) {
    salto = -10;
    event.preventDefault();
  }
});
function reiniciar() {
  dinoY = 143; salto = 0; cactusX = canvas.width; puntos = 0; fin = false; cactusContado = false;
  document.getElementById("restartBtn").style.display = "none";
}
document.getElementById("restartBtn").onclick = reiniciar;
document.getElementById("btnReiniciarManual").onclick = reiniciar;
window.addEventListener("load", jugar);
