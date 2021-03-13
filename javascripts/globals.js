/**  Global Variables **/

let users = [];

let bernieLeft = 200; // bernie start horizontal position
let bernieBottom = 300; // bernie start height
let gravity = 2 
let gap = 475; // space between pipes
let pipeCount = 0;
let isGameOver = false; 

/** Node Getters **/

const mainDiv = () => document.getElementById("main");
const navbarDiv = () => document.querySelector(".navbar");
const sideDiv = () => document.getElementById("side-bar");
const scoreDiv = () => document.getElementById("score-div");
const startButtonDiv = () => document.getElementById("start-btn");

const yourScoresNav = () => document.getElementById("your-scores");
const homeNav = () => document.getElementById("home");
const howToPlayNav = () => document.getElementById("how-to-play");
const leaderboardNav = () => document.getElementById("leaderboard");
const infoNav = () => document.getElementById("info");

const form = () => document.getElementById("form");
const nameInput = () => document.getElementById("name");
const bernie = () => document.getElementById('bernie');
const gameDisplay = () => document.getElementById('game-container');
const ground = () => document.getElementById('ground');

