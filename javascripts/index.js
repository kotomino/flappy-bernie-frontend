let users = [];
let games = [];
const baseUrl = "http://localhost:3000"

let bernieLeft = 200; // bernie start horizontal position
let bernieBottom = 300; // bernie start height
let gravity = 2 
let gap = 475; // space between pipes
let pipeCount = -2;
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
  games = data;
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
  <button type="button" disabled>Start Game</button>
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

  games.forEach(function(score) {
    renderScore(score);
  })
}

function renderScore(game) {
  let div = document.createElement('div');
  let p = document.createElement('p');
  let topScores = document.getElementById('top-scores');

  if(game.score) {
    p.innerText = `${game.user.name}: ${game.score}`;
  } else if (game.score <= 0) {
    p.innerText = `${game.user.name}: 0`;
  }
  

  div.appendChild(p);
  topScores.appendChild(div);
}

async function submitName(e) {
  e.preventDefault();

  let strongParams = {
    game: {
      score: undefined,
      user_attributes: nameInput().value
    }
  }

  // let strongParams = {
  //   user: {
  //     name: nameInput().value
  //   }
  // }

  // send data to the backend via a post request
  const resp = await fetch(baseUrl + '/games', {
    body: JSON.stringify(strongParams),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    method: "POST"
  })
  const data = await resp.json();

  games.push(data);
  startButton().innerHTML = startButtonEnabled();
  startButton().addEventListener('click', renderGame);
  getGames();
}

function renderGame() {
  startButton().innerHTML = startButtonDisabled();
  
  generatePipe();
  bernieDrops();
  
  document.addEventListener('keyup', jump);
}

function bernieDrops() {
  bernieBottom -= gravity
  bernie().style.bottom = bernieBottom + 'px'
  bernie().style.left = bernieLeft + 'px'

  if (bernieBottom === 0) {
    gameOver();
    clearInterval(gameTimerId); 
  }

  if (!isGameOver) setTimeout(bernieDrops, 20) //calls bernieDrops every 20 miliseconds until game over
}

function jump(e) {
  if (bernieBottom < 430 && e.keyCode === 32) {
    bernieBottom += 90
  }
  bernie().style.bottom = bernieBottom + 'px'
}

function generatePipe() {
    pipeCount += 1
    let pipeLeft = 500;
    let pipeBottom = Math.random() * 150;
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

      if (pipeLeft === -60) {
        clearInterval(movePipeTimerId);
        gameDisplay().removeChild(pipe);
        gameDisplay().removeChild(topPipe);
      }
      if ( pipeLeft > 160 && pipeLeft < 250 && (bernieBottom < pipeBottom + 145 || bernieBottom > pipeBottom + gap - 225) ) {
        gameOver();
      }
      if(isGameOver) {
        clearInterval(movePipeTimerId); // stops pipes when game over
      }
    }
    let movePipeTimerId = setInterval(movePipe, 17); // calls movePipe every 20 miliseconds
    if (!isGameOver) setTimeout(generatePipe, 2500) //generates pipe every 2 secs until game over
  }

  function gameOver() {
    isGameOver = true;
    document.removeEventListener('keyup', jump); // stop ability to jump
    console.log("Game over");
    saveGameScore();
  }

  function saveGameScore() {
    let strongParams = {
      game: {
        score: pipeCount
      }
    }

    const id = games[games.length - 1].id;
  
    fetch(baseUrl + '/games/' + id, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(strongParams)
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(game) {
      let g = games.find(function(g) {
        return g.id == game.id
      })
      let idx = games.indexOf(g);

      games[idx] = game;

      renderScores();
    })    
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStartPage();
  })   


