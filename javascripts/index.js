const bernie = document.getElementById('bernie');
const gameDisplay = document.getElementById('game-container');

let bernieLeft = 200
let bernieBottom = 300
let gravity = 2
let gap = 375

document.addEventListener('DOMContentLoaded', () => {
  loadBernie();
  let timerId = setInterval(bernieDrops, 20); 
  document.addEventListener('keyup', jump);
  generatePipe();
})   

function loadBernie() {
  let bernieLeft = 200
  let bernieBottom = 300
  let gravity = 2
}

function bernieDrops() {
  bernieBottom -= gravity
  bernie.style.bottom = bernieBottom + 'px'
  bernie.style.left = bernieLeft + 'px'
}

function jump(e) {
    if (bernieBottom < 410 && e.keyCode === 32) {
      bernieBottom += 80
    }
    bernie.style.bottom = bernieBottom + 'px'
    console.log(bernieBottom);
  }

function generatePipe() {
    let pipeLeft = 1020;
    let pipeBottom = Math.random() * 150;
    const pipe = document.createElement('div');
    const topPipe = document.createElement('div');
    pipe.classList.add('pipe');
    topPipe.classList.add('topPipe');

    gameDisplay.appendChild(pipe);
    gameDisplay.appendChild(topPipe);

    pipe.style.left = pipeLeft + 'px';
    pipe.style.bottom = pipeBottom + 'px';
    topPipe.style.left = pipeLeft + 'px';
    topPipe.style.bottom = pipeBottom + gap + 'px';

    function movePipe() {
      pipeLeft -= 2;
      pipe.style.left = pipeLeft + 'px';
      topPipe.style.left = pipeLeft + 'px';
    }

    let timerId = setInterval(movePipe, 20);
  }

  let timerId = setInterval(generatePipe, 3000);



