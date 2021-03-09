let users = [];
let scores = [];
const baseUrl = "http://localhost:3000"

let bernieLeft = 200; // bernie start horizontal position
let bernieBottom = 300; // bernie start height
let gravity = 2 
let gap = 475; // space between pipes
let isGameOver = false; 

function mainDiv() {
  return document.getElementById("main");
}

function resetMain() {
  mainDiv().innerHTML = "";
}

function sideDiv() {
  return document.getElementById("side-bar");
}

function startButton() {
  return document.getElementById("start-btn");
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

function bernie() {
  return document.getElementById('bernie');
}

function gameDisplay() {
  return document.getElementById('game-container');
}

function ground() {
  return document.getElementById('ground');
}

async function getGames() {
  // fetch to rails api, games index. Then grab scores
  // populate side div with the scores
  const resp = await fetch(baseUrl +'/games')
  const data = await resp.json();
  scores = data;
  renderScores(data);
}

function startTemplate() {
  return `
  <h3>Flappy Bernie</h3>
    <form id="form">
      <div class="input-field">
        <label for="name">Name</label>
        <input type="text" name="name" id="name">
      </div>
      <input type="submit" value="Login">
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

function scoresTemplate() {
  return `
  <h3>Top Scores</h3>
  <div id="top-scores">
  </div
  `;
}

function startButtonDisabled() {
  return `
  <button type="button" disbaled>Start Game</button>
  `;
}

function startButtonEnabled() {
  return `
  <button type="button">Start Game</button>
  `;
}

function renderStartPage() {
  resetMain();
  resetSideBar();
  mainDiv().innerHTML = gameTemplate();
  sideDiv().innerHTML = startTemplate();
  startButton().innerHTML = startButtonDisabled();
  form().addEventListener('submit', submitName);
}

function renderScores() {
  resetSideBar();
  sideDiv().innerHTML = scoresTemplate();

  scores.forEach(function(score) {
    renderScore(score);
  })
}

function renderScore(game) {
  let div = document.createElement('div');
  let p = document.createElement('p');
  let topScores = document.getElementById('top-scores');

  p.innerText = `${game.user.name}: ${game.score}`;

  div.appendChild(p);
  topScores.appendChild(div);
}

async function submitName(e) {
  e.preventDefault();

  let strongParams = {
    user: {
      name: nameInput().value
    }
  }

  // send data to the backend via a post request
  const resp = await fetch(baseUrl + '/users', {
    body: JSON.stringify(strongParams),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    method: "POST"
  })
  const data = await resp.json();

  users.push(data);
  startButton().innerHTML = startButtonEnabled();
  startButton().addEventListener('click', renderGame);
  getGames();
}

function renderGame() {
 
  // getGameElements();
  generatePipe();
  bernie().style.bottom = bernieBottom + 'px'
  bernie().style.left = bernieLeft + 'px'
  let gameTimerId = setInterval(bernieDrops, 20);  //calls bernieDrops every 20 miliseconds
  // let generatePipeTimerId = setInterval(generatePipe, 2000); // generates pipe every 2 secs

  document.addEventListener('keyup', jump);
  
  if(isGameOver) {
    clearInterval(gameTimerId); // stop dropping bernie
    clearInterval(generatePipeTimerId); // stop generating pipes
  }
}

function bernieDrops() {
  bernieBottom -= gravity
  bernie().style.bottom = bernieBottom + 'px'
  bernie().style.left = bernieLeft + 'px'

  if (bernieBottom === 0) {
    gameOver();
  }
}

function jump(e) {
  
  if (bernieBottom < 430 && e.keyCode === 32) {
    bernieBottom += 120
  }
  bernie().style.bottom = bernieBottom + 'px'
}

function generatePipe() {
    let pipeLeft = 500;
    let pipeBottom = Math.random() * 100;
    const pipe = document.createElement('div');
    const topPipe = document.createElement('div');
    if(!isGameOver) {
      pipe.classList.add('pipe');
      topPipe.classList.add('topPipe');
    }

    gameDisplay().appendChild(pipe);
    gameDisplay().appendChild(topPipe);

    pipe.style.left = pipeLeft + 'px';
    pipe.style.bottom = pipeBottom + 'px';
    topPipe.style.left = pipeLeft + 'px';
    topPipe.style.bottom = pipeBottom + gap + 'px';

    function movePipe() {
      pipeLeft -= 2;
      pipe.style.left = pipeLeft + 'px';
      topPipe.style.left = pipeLeft + 'px';

      if (pipeLeft === 0) {
        clearInterval(movePipeTimerId);
        gameDisplay().removeChild(pipe);
        gameDisplay().removeChild(topPipe);
      }
      if ( pipeLeft > 160 && pipeLeft < 250 && (bernieBottom < pipeBottom + 145 || bernieBottom > pipeBottom + gap - 225) ) {
        gameOver();
      }
      if(isGameOver) {
        clearInterval(movePipeTimerId); // stop pipes from moving
      }
    }
    let movePipeTimerId = setInterval(movePipe, 20); // calls movePipe every 20 miliseconds
    if (!isGameOver) setTimeout(generatePipe, 3000)
  }

  function gameOver() {
    isGameOver = true;
    document.removeEventListener('keyup', jump); // stop ability to jump
    console.log("Game over");
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStartPage();
    // getGames();
  })   


