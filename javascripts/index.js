const bernie = document.getElementById('bernie'); // bernie 
const gameDisplay = document.getElementById('game-container'); // sky background
const ground = document.getElementById('ground'); // ground background

let bernieLeft = 200; // bernie start horizontal position
let bernieBottom = 300; // bernie start height

let gravity = 2 
let gap = 475; // space between pipes
let isGameOver = false; 

document.addEventListener('DOMContentLoaded', () => {
  bernieDrops();
  generatePipe();
})   

function bernieDrops() {
  bernieBottom -= gravity
  bernie.style.bottom = bernieBottom + 'px'
  bernie.style.left = bernieLeft + 'px'

  if (bernieBottom === 0) {
    gameOver();
  }
}

document.addEventListener('keyup', jump);

let gameTimerId = setInterval(bernieDrops, 20);  //calls bernieDrops every 20 miliseconds
let generatePipeTimerId = setInterval(generatePipe, 2000); // generates pipe every 2 secs

function jump(e) {
    if (bernieBottom < 430 && e.keyCode === 32) {
      bernieBottom += 80
    }
    bernie.style.bottom = bernieBottom + 'px'
  }

function generatePipe() {
    let pipeLeft = 500;
    let pipeBottom = Math.random() * 100;
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
      pipeLeft -= 3;
      pipe.style.left = pipeLeft + 'px';
      topPipe.style.left = pipeLeft + 'px';

      if (pipeLeft === 0) {
        clearInterval(movePipeTimerId);
        gameDisplay.removeChild(pipe);
        gameDisplay.removeChild(topPipe);
      }
      if ( pipeLeft > 160 && pipeLeft < 250 && (bernieBottom < pipeBottom + 145 || bernieBottom > pipeBottom + gap - 225) ) {
        gameOver();
      }
      if(isGameOver) clearInterval(movePipeTimerId); // stop pipes from moving
    }
    let movePipeTimerId = setInterval(movePipe, 20); // calls movePipe every 20 miliseconds
  }

  function gameOver() {
    clearInterval(gameTimerId); // stop dropping bernie
    clearInterval(generatePipeTimerId); // stop generating pipes
    isGameOver = true;
    document.removeEventListener('keyup', jump); // stop ability to jump
    console.log("Game over");
  }




