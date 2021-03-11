function resetMain() {
  mainDiv().innerHTML = "";
}

function resetSideBar() {
  sideDiv().innerHTML = "";
}

async function getGames() {
  // fetch to rails api, games index. Then grab scores
  // populate side div with the scores
  const resp = await fetch(baseUrl +'/games')
  const data = await resp.json();
  games = data;
  renderYourScores(data);
}

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
  <div class="social_media">
    <a href="#"><i class="fab fa-facebook-f"></i></a>
    <a href="#"><i class="fab fa-twitter"></i></a>
    <a href="#"><i class="fab fa-instagram"></i></a>
  </div>
    `;
}

function startTemplate() {
  return `
  <div class="card" style="height: 530px">
    <div class="card-body">
      <p class="card-text">
        <span class="badge rounded-pill bg-dark text-wrap">Please enjoy this game on a desktop computer using Chrome.</span>
      </p>
      <br>
      <h5 class="card-title">Login to Play:</h5>
      <p class="card-text">
        <form id="form">
          <div class="input-field">
            <input type="text" name="name" id="name">
          </div><br>
          <input type="submit" value="Login" class="btn btn-primary">
        </form>
      </p>
  </div>
</div>
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
  <div class="card" style="height: 125px">
    <div class="card-body">
      <h1 class="card-title" id="current-score"></h1>
    </div>
  </div>
  `
}

function homeTemplate() {
  return `
  <h3>Home</h3>
  `;
}

function infoTemplate() {
  return `
  <h3>Information</h3>
  `;
}

function howToPlayTemplate() {
  return `
  <h3>How To Play</h3>
  `;
}

function topScoresTemplate() {
  return `
  <h3>Top Scores</h3>
  <div id="scores">
  </div
  `;
}

function yourScoresTemplate() {
  return `
  <h3>Your High Scores</h3>
  <div id="scores">
  </div
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
    <button class="btn btn-dark" id="restart-btn" type="button">Restart Game</button>
  </div
  `;
}

function renderStartPage() {
  pipeCount = 0;
  isGameOver = false;

  resetMain();
  resetSideBar();
  mainDiv().innerHTML = gameTemplate();
  sideDiv().innerHTML = startTemplate();
  scoreDiv().innerHTML = scoreTemplate();
  navbarDiv().innerHTML = navbarTemplate();

  // have everything disabled until logged in
  startButtonDiv().innerHTML = startButtonDisabled();
  yourScoresNav().classList.add('disabled');
  homeNav().classList.add('disabled');
  howToPlayNav().classList.add('disabled');
  leaderboardNav().classList.add('disabled');
  infoNav().classList.add('disabled');

  form().addEventListener('submit', submitName);
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

function renderTopScores() {
  resetSideBar();
  sideDiv().innerHTML = topScoresTemplate();

  games.sort((a, b) => b.score - a.score);
  
  games.slice(0, 10).forEach(function(score) {
    renderScore(score);
  })
}

function renderYourScores() {
  resetSideBar();
  sideDiv().innerHTML = yourScoresTemplate();
  
  const name = games[games.length - 1].user.name;

  yourGames = games.filter(function(game) {
    return game.user.name == name;
  })

  yourGames.sort((a, b) => b.score - a.score);

  yourGames.slice(0, 10).forEach(function(score) {
    renderScore(score);
  })
}

function renderScore(game) {
  let div = document.createElement('div');
  let p = document.createElement('p');
  let topScores = document.getElementById('scores');

  if (game.score <= 0) {
      p.innerText = `${game.user.name}: 0`;
    }
  else if(game.score) {
    p.innerText = `${game.user.name}: ${game.score}`;
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
  users.push(data.user);

  // enable nav buttons because user is logged in.
  yourScoresNav().classList.remove('disabled');
  homeNav().classList.remove('disabled');
  howToPlayNav().classList.remove('disabled');
  leaderboardNav().classList.remove('disabled');
  infoNav().classList.remove('disabled');

  startButtonDiv().innerHTML = startButtonEnabled();
  const enabledBtn = document.getElementById('enabled-btn');
  enabledBtn.addEventListener('click', renderGame);

  getGames();
}

function renderGame() {
  
  startButtonDiv().innerHTML = startButtonDisabled();
  displayCurrentScore();
  setTimeout(pipeCountPlusOne, 700);
  
  generatePipe();
  bernieDrops();
  
  document.addEventListener('keyup', jump);
}

async function renderRestartGame(e) {
  e.preventDefault();
  
  pipeCount = 0;
  isGameOver = false;

  resetMain();
  mainDiv().innerHTML = gameTemplate();

  let strongParams = {
    game: {
      score: undefined,
      user_attributes: users[users.length - 1].name
    }
  }

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

  // startButtonDiv().innerHTML = startButtonDisabled();

  getGames();
  renderGame();
  
}

function displayCurrentScore() {
  let h1 = document.getElementById('current-score');
  h1.innerText = `${pipeCount}`
  
  if (!isGameOver) {
    setTimeout(displayCurrentScore, 100);
    console.log("display current score running");
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
    saveGameScore();

    // get ready for restart
    startButtonDiv().innerHTML = restartButton();
    let restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', renderRestartGame);
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

      renderYourScores();
    })    
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStartPage();
    yourScoresNav().addEventListener('click', renderYourScores);
    leaderboardNav().addEventListener('click', renderTopScores);
    howToPlayNav().addEventListener('click', renderHowToPlay);
    homeNav().addEventListener('click', renderHome);
    infoNav().addEventListener('click', renderInfo);
  })   


