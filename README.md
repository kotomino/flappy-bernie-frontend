# Flappy Bernie JavaScript App

Flappy Bernie is a JavaScript web game that is based off of the popular game Flappy Bird.

You can find the corresponding backend project at URL(https://github.com/kotomino/flappy-bernie-backend)

### Game Rules
Press the spacebar to flap Bernie up and navigate him through the pipes. The pair of pipes have equally sized gaps placed at random heights. Bernie will descend automatically and the pipes' horizontal speed will remain constant. Each successful pass through a pair of pipes gains you one point. Colliding with a pipe or the ground ends the game. Happy flapping!

### Preview

![Screen Shot 2021-04-23 at 11 42 56 AM](https://user-images.githubusercontent.com/73256077/115896095-105bd400-a429-11eb-92e7-d28fc1431d2b.png)


## Installation
### Frontend Directory
1. Clone the project's frontend GitHub Repository in desired directory.
```
$ git clone git@github.com:kotomino/flappy-bernie-frontend.git
```
 
### Backend Directory
 1. Clone the backend GitHub Repository in the same parent directory as the frontend.
 ```
 $ git clone git@github.com:kotomino/flappy-bernie-backend.git
 ```
2. Run bundle install inside the project directory.
``` 
$ bundle install
```
3. Run db:create and db:migrate with rails.
```
$ rails db:create
$ rails db:migrate
```

## Usage
1. Run rails s in terminal inside the backend project folder.
```
$ rails s
```
2. Open the index.html file in your project folder onto your browser.
