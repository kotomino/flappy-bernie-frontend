// const mainDiv = () => document.getElementById("main");

const resetMain = () => mainDiv().innerHTML = "";

const resetSideBar = () => sideDiv().innerHTML = "";

const resetStartDiv = () => startButtonDiv().innerHTML = "";

function navbarTemplate() {
  return `
  <h1>Flappy Bernie</h1>
  <ul>
      <li id="home"><a href="#"><i class="fas fa-home"></i>Home</a></li>
      <li id="how-to-play"><a href="#"><i class="fas fa-question-circle"></i>How to Play</a></li>
      <li id="leaderboard"><a href="#"><i class="fas fa-medal"></i>Leaderboard</a></li>
      <li id="your-scores"><a href="#"><i class="fas fa-chart-bar"></i>Your Scores</a></li>
      <li id="info"><a href="#"><i class="fas fa-info-circle"></i>Info</a></li>
  </ul> 
    `;
}

function gameTemplate() {
  return `
  <div id="border-left"></div>
  <div id="border-top"></div>
  <div id="game-container">
    <div id="sky">
      <div id="bernie"></div>
    </div>
    <div id="ground"></div>
  </div>
  <div id="border-right"></div>
    `
}

function scoreTemplate() {
  return `
  <div class="card border border-dark mb-3" style="height: 125px">
    <div class="card-body">
      <h1 class="card-title" id="current-score"></h1>
    </div>
  </div>
  `
}

function homeTemplate() {
  return `
  <div class="card border border-dark mb-3" style="height: 500px">
    <div class="card-body">
      <h3>Welcome, ${Game.all[Game.all.length -1].user.name}!</h3>
      <p>Remember the oh-so addicating game, Flappy Bird? If you've ever wondered why the game had to be removed, you've come to the right place. We revived the game with none other than Bernard Sanders! </p>
    </div>
  </div>
  `;
}

function infoTemplate() {
  return `
  <div class="card border border-dark mb-3" style="height: 500px">
    <div class="card-body">
      <h3>Game Info</h3>
      <p>This game was created by Kotomi Noguchi during her time as a Full-time Software Engineering student at Flatiron School. You can connect with her on <a href="https://github.com/kotomino">Github</a> or <a href=https://www.linkedin.com/in/kotomi-noguchi-04bb79a0/">LinkedIn</a>!</p>
    </div>
  </div>
  `;
}

function howToPlayTemplate() {
  return `
  <div class="card border border-dark mb-3" style="height: 500px">
      <div class="card-body">
        <h3>How To Play</h3>
        <p>Press the spacebar to flap Bernie up and navigate him through the pipes. The pair of pipes have equally sized gaps placed at random heights. Bernie will descend automatically and the pipes' horizontal speed will remain constant. Each successful pass through a pair of pipes gains you one point. Colliding with a pipe or the ground ends the game. Happy flapping! </p>
    </div>
  </div>
  `;
}

function startButtonDisabled() {
  return `
  <div class="d-grid gap-2">
    <button class="btn btn-primary" type="button" id="disabled-btn" disabled>Start Game</button>
  </div>
  `;
}

function startButtonEnabled() {
  return `
  <div class="d-grid gap-2">
    <button class="btn btn-primary" id="enabled-btn" type="button">Start Game</button>
  </div>
  `;
}

function restartButton() {
  return `
  <div class="d-grid gap-2">
    <button class="btn btn-primary" id="restart-btn" type="button">Restart Game</button>
  </div
  `;
}

function renderHome() {
  resetSideBar();
  sideDiv().innerHTML = homeTemplate();
}

function renderHowToPlay() {
  resetSideBar();
  sideDiv().innerHTML = howToPlayTemplate();
}

function renderInfo() {
  resetSideBar();
  sideDiv().innerHTML = infoTemplate();
}

function enableNav() {
  yourScoresNav().classList.remove('disabled');
  homeNav().classList.remove('disabled');
  howToPlayNav().classList.remove('disabled');
  leaderboardNav().classList.remove('disabled');
  infoNav().classList.remove('disabled');

  yourScoresNav().addEventListener('click', Game.renderYourScores);
  leaderboardNav().addEventListener('click', Game.renderTopScores);
  howToPlayNav().addEventListener('click', renderHowToPlay);
  homeNav().addEventListener('click', renderHome);
  infoNav().addEventListener('click', renderInfo);
}

function disableNav() {
  startButtonDiv().innerHTML = startButtonDisabled();
  yourScoresNav().classList.add('disabled');
  homeNav().classList.add('disabled');
  howToPlayNav().classList.add('disabled');
  leaderboardNav().classList.add('disabled');
  infoNav().classList.add('disabled');
  
}

function enableStartButton() {
  resetStartDiv();
  startButtonDiv().innerHTML = startButtonEnabled();
  const enabledBtn = document.getElementById('enabled-btn');
  enabledBtn.addEventListener('click', Game.renderGame);
}

function enableRestartButton() {
  resetStartDiv();
  startButtonDiv().innerHTML = restartButton();
  let restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', renderRestartGame);
}

async function renderRestartGame(e) {
  e.preventDefault();
  
  pipeCount = 0;
  isGameOver = false;
  bernieLeft = 200; 
  bernieBottom = 300; 

  resetMain();
  mainDiv().innerHTML = gameTemplate();

  let strongParams = {
    game: {
      score: undefined,
      user_attributes: User.all[User.all.length - 1].name
    }
  }

  // send data to the backend via a post request
  const data = await Api.post('/games', strongParams);
  
  Game.getGamesRestart();
  Game.renderGame();
}

function displayCurrentScore() {
  let h1 = document.getElementById('current-score');
  h1.innerText = `${pipeCount}`
  
  if (!isGameOver) {
    setTimeout(displayCurrentScore, 100);
  }
}

function pipeCountPlusOne() {
  let scoreTimerId = setInterval(function() {
    if (isGameOver) clearInterval(scoreTimerId);
    if(!isGameOver) {
      pipeCount += 1;
      console.log(pipeCount);
    }
  }, 2500);
}

function bernieDrops() {
  bernieBottom -= gravity
  bernie().style.bottom = bernieBottom + 'px'
  bernie().style.left = bernieLeft + 'px'

  if (bernieBottom === 0) {
    gameOver();
  }

  if (!isGameOver) setTimeout(bernieDrops, 20); //calls bernieDrops every 20 miliseconds until game over
}

function jump(e) {
  if (bernieBottom < 430 && e.keyCode === 32) {
    bernieBottom += 90
  }
  bernie().style.bottom = bernieBottom + 'px'
}

function generatePipe() {
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
    // (bernieBottom < pipeBottom + 145 || bernieBottom > pipeBottom + gap - 225 )
    if ( pipeLeft > 160 && pipeLeft < 250 && (bernieBottom < pipeBottom + 145 || bernieBottom > pipeBottom + gap - 230) ) {
      gameOver();
    }
    if(isGameOver) {
      clearInterval(movePipeTimerId); // stops pipes when game over
    }
  }
  let movePipeTimerId = setInterval(movePipe, 15); // calls movePipe every 20 miliseconds
  if (!isGameOver) setTimeout(generatePipe, 2500) //generates pipe every 2.5 secs until game over
  }

  function gameOver() {
    isGameOver = true;
    document.removeEventListener('keyup', jump); // stop ability to jump
    console.log("Game over");
    Game.saveGameScore(); 

    setTimeout(enableRestartButton, 800); //restart button
  }

  document.addEventListener('DOMContentLoaded', () => {
    Game.renderStartPage();
  })   


