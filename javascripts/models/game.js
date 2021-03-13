class Game {

  /** Instance Methods **/

  save() {
    Game.all.push(this)
  }

  renderScore() {
    let div = document.createElement('div');
    let p = document.createElement('p');
    let topScores = document.getElementById('scores');
  
    if(this.score || this.score === 0) {
      p.innerText = `${this.user.name}: ${this.score}`;
    } 
    
    div.appendChild(p);
    topScores.appendChild(div);
  }

  /** Static methods **/

  static all = []

  constructor(attr) {
    this.id = attr.id;
    this.score = attr.score;
    this.user = attr.user;
  }

  static create(attr) {
    // creates and saves an object
    let game = new Game(attr);
    game.save();
    return game;
  }

  static createFromCollection(collection) {
    collection.forEach(data => Game.create(data))
  }

  /** Templates **/

  static topScoresTemplate() {
    return `
    <div class="card border border-dark mb-3" style="height: 500px">
      <div class="card-body">
        <h3>Leaderboard</h3>
        <div id="scores"></div>
      </div>
    </div>
    `;
  }

  static yourScoresTemplate() {
    return `
    <div class="card border border-dark mb-3" style="height: 500px">
      <div class="card-body">
        <h3>${Game.all[Game.all.length -1].user.name}'s Scores</h3>
        <div id="scores"></div>
      </div>
    </div>
    `;
  }

  static startTemplate() {
    return `
    <div class="card border border-dark mb-3" style="height: 500px">
      <div class="card-body">
        <p class="card-text">
          <span class="badge rounded-pill bg-dark text-wrap">Please enjoy this game on a desktop computer using Chrome.</span>
        </p><br>
        <h5 class="card-title">Login to Play:</h5>
        <p class="card-text">
          <form id="form">
            <div class="input-field">
              <input type="text" name="name" id="name" required>
            </div><br>
            <div class="input-field">
              <input type="submit" value="Login" class="btn btn-primary">
            </div
          </form>
        </p>
    </div>
  </div>
    `;
  }

  /** Renders **/

  static renderStartPage() {
    pipeCount = 0;
    isGameOver = false;
  
    resetMain();
    resetSideBar();
    mainDiv().innerHTML = gameTemplate();
    sideDiv().innerHTML = Game.startTemplate();
    scoreDiv().innerHTML = scoreTemplate();
    navbarDiv().innerHTML = navbarTemplate();
  
    disableNav();

    form().addEventListener('submit', Game.submitName);
  }

  static renderGame() {
    Game.renderYourScores();
    startButtonDiv().innerHTML = startButtonDisabled();
    displayCurrentScore();
    setTimeout(pipeCountPlusOne, 700);
    
    generatePipe();
    bernieDrops();
    
    document.addEventListener('keyup', jump);
  }

  static renderYourScores() {
    resetSideBar();
    
    sideDiv().innerHTML = Game.yourScoresTemplate();
    
    const name = Game.all[Game.all.length - 1].user.name;
   
    let yourGames = Game.all.filter(function(game) {
      return game.user.name === name;
    })
    
    yourGames.sort((a, b) => b.score - a.score);
    yourGames.slice(0, 10).forEach(game => game.renderScore());
  }

  static renderTopScores() {
    resetSideBar();
    sideDiv().innerHTML = Game.topScoresTemplate();
  
    Game.all.sort((a, b) => b.score - a.score);
    
    Game.all.slice(0, 10).forEach(game => game.renderScore());
  }

  /** Fetches **/

  static async submitName(e) {
    e.preventDefault();
  
    let strongParams = {
      game: {
        score: undefined,
        user_attributes: nameInput().value
      }
    }
    
    // send data to the backend via a post request
    const data = await Api.post('/games', strongParams);
    
    enableNav();
    enableStartButton();
    Game.getGames();
  }

  static async getGames() {
    // fetch to rails api, games index. Then grab scores
    // populate side div with the scores
    const data = await Api.get("/games");
    Game.createFromCollection(data);
    User.createFromCollection(data);

    renderHome();
  }

  static async getGamesRestart() {
    const data = await Api.get("/games");
    Game.all = [];
    Game.createFromCollection(data);
    User.createFromCollection(data);

    Game.renderYourScores();
  }

  static saveGameScore() {
    let strongParams = {
      game: {
        score: pipeCount
      }
    }

    const id = Game.all[Game.all.length - 1].id;

    Api.patch('/games/' + id, strongParams)
      .then(function(data) {
        let g = Game.all.find(g => g.id == data.id);
      
        let idx = Game.all.indexOf(g);
        
        Game.all[idx] = new Game(data);

        Game.renderYourScores();
      })    
  }

}