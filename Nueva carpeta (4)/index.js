const canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d");
const dino = new Image(), cactus = new Image();
dino.src = "../patito/dino%20(1).png";
cactus.src = "../patito/cactus%20(1).png";
dino.onerror = function() { console.error("No se pudo cargar dino (1).png"); };
cactus.onerror = function() { console.error("No se pudo cargar cactus (1).png"); };
let dinoY = 143, salto = 0, cactusX = canvas.width, puntos = 0, fin = false, cactusContado = false;
let record = 0, velocidad = 7, contextoAudio;

function actualizarMarcador() {
  document.getElementById("puntaje").textContent = puntos;
  document.getElementById("record").textContent = record;
}

function reproducirSonido(frecuencia, duracion) {
  if (!contextoAudio) contextoAudio = new AudioContext();

  const oscilador = contextoAudio.createOscillator();
  const volumen = contextoAudio.createGain();
  const ahora = contextoAudio.currentTime;
  oscilador.frequency.setValueAtTime(frecuencia, ahora);
  volumen.gain.setValueAtTime(0.12, ahora);
  volumen.gain.exponentialRampToValueAtTime(0.001, ahora + duracion);
  oscilador.connect(volumen);
  volumen.connect(contextoAudio.destination);
  oscilador.start(ahora);
  oscilador.stop(ahora + duracion);
}

function dibujar() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 190, canvas.width, 30);
  if (dino.complete && dino.naturalWidth > 0) {
    ctx.save();
    if (dinoY < 143) ctx.filter = "sepia(1) saturate(5) hue-rotate(160deg)";
    ctx.drawImage(dino, 55, dinoY, 44, 47);
    ctx.restore();
  }
  if (cactus.complete && cactus.naturalWidth > 0) {
    ctx.drawImage(cactus, cactusX, 150, 39, 40);
  }
  if (fin) {
    ctx.font = "20px Arial";
    ctx.fillText("Fin del juego", 300, 110);
  }
}
function jugar() {
  if (!fin) {
    cactusX -= velocidad;
    if (cactusX + 39 < 55 && !cactusContado) {
      puntos++;
      if (puntos > record) record = puntos;
      actualizarMarcador();
      if (puntos % 100 === 0) {
        velocidad += 0.5;
        reproducirSonido(880, 0.12);
        window.setTimeout(function() { reproducirSonido(1175, 0.16); }, 100);
      }
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
    reproducirSonido(440, 0.1);
    event.preventDefault();
  }
});
function reiniciar() {
  dinoY = 143; salto = 0; cactusX = canvas.width; puntos = 0; velocidad = 7; fin = false; cactusContado = false;
  actualizarMarcador();
  document.getElementById("restartBtn").style.display = "none";
}
document.getElementById("restartBtn").onclick = reiniciar;
document.getElementById("btnReiniciarManual").onclick = reiniciar;
actualizarMarcador();
window.addEventListener("load", jugar);