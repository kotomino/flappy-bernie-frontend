users = [];

function mainDiv() {
  return document.getElementById("main");
}

function resetMain() {
  mainDiv().innerHTML = "";
}

function sideDiv() {
  return document.getElementById("side-bar");
}

function resetSideBar() {
  sideDiv().innerHTML = "";
}

function form() {
  return document.getElementById("form");
}

function nameInput() {
  return document.getElementById("name");
}

function startTemplate() {
  return `
  <h3>Flappy Bernie</h3>
    <form id="form">
      <div class="input-field">
        <label for="name">Name</label>
        <input type="text" name="name" id="name">
      </div>
      <input type="submit" value="Start Game">
    </form>
  `;
}

function gameTemplate() {
  return `
  <div id="border-left"></div>
    <div id="game-container">
      <div id="border-top"></div>
      <div id="sky">
        <div id="bernie"></div>
      </div>
      <div id="ground"></div>
    </div>
    <div id="border-right"></div>
    `
}

function renderStartPage() {
  resetMain();
  resetSideBar();
  mainDiv().innerHTML = gameTemplate();
  sideDiv().innerHTML = startTemplate();
  form().addEventListener('submit', submitName);
  // const startBtn = document.getElementById("start-btn");
  // startBtn.addEventListener('click', submitName);
}

function submitName(e) {
  e.preventDefault();
 
  users.push({
    name: nameInput().value,
    score: 0,
  });

  resetSideBar();
  sideDiv().innerHTML = `Hi ${users[users.length - 1].name}`;

}

function renderGame(e) {
  e.preventDefault();

  resetMain();
  mainDiv().innerHTML = gameTemplate();
  getGameElements();
  bernieDrops();
  generatePipe();
  document.addEventListener('keyup', jump);
  let gameTimerId = setInterval(bernieDrops, 20);  //calls bernieDrops every 20 miliseconds
  let generatePipeTimerId = setInterval(generatePipe, 2000); // generates pipe every 2 secs
  if(isGameOver) {
    clearInterval(gameTimerId); // stop dropping bernie
    clearInterval(generatePipeTimerId); // stop generating pipes
  }

}

function getGameElements() {
  const bernie = document.getElementById('bernie'); // bernie 
  const gameDisplay = document.getElementById('game-container'); // sky background
  const ground = document.getElementById('ground'); // ground background
}



// const bernie = document.getElementById('bernie'); // bernie 
// const gameDisplay = document.getElementById('game-container'); // sky background
// const ground = document.getElementById('ground'); // ground background

let bernieLeft = 200; // bernie start horizontal position
let bernieBottom = 300; // bernie start height

let gravity = 2 
let gap = 475; // space between pipes
let isGameOver = false; 

function bernieDrops() {
  bernieBottom -= gravity
  bernie.style.bottom = bernieBottom + 'px'
  bernie.style.left = bernieLeft + 'px'

  if (bernieBottom === 0) {
    gameOver();
  }
}

function jump(e) {
    if (bernieBottom < 430 && e.keyCode === 32) {
      bernieBottom += 80
    }
    bernie.style.bottom = bernieBottom + 'px'
  }

function generatePipe() {
    const gameDisplay = document.getElementById('game-container');
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
      if(isGameOver) {
        clearInterval(movePipeTimerId); // stop pipes from moving
        clearInterval(gameTimerId); // stop dropping bernie
        clearInterval(generatePipeTimerId); // stop generating pipes
      }
    }
    let movePipeTimerId = setInterval(movePipe, 20); // calls movePipe every 20 miliseconds
  }

  function gameOver() {
    // clearInterval(gameTimerId); // stop dropping bernie
    // clearInterval(generatePipeTimerId); // stop generating pipes
    isGameOver = true;
    document.removeEventListener('keyup', jump); // stop ability to jump
    console.log("Game over");
  }


  document.addEventListener('DOMContentLoaded', () => {
    renderStartPage();
  })   


{/* <button id="start-btn">Start Game</button> */}