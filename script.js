let player_one_text = "X";
let player_two_text = "O";
let winning_options = ["123", "147", "159", "258", "369", "357", "456", "789"];
let avaliable_box = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let first_player = [];
let second_player = [];
let winner = 0;
let number_of_players = 0;

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
 });

const playGame = () => {
  hideAndShowElements("instruction", "player-selection");
  return;
};

const numOfPlayers = (e) => {
  e.target.id === "one-player"
    ? (number_of_players = 1)
    : (number_of_players = 2);
  hideAndShowElements("num-of-players", "identity");
  return;
};

const selectPlayer = (e) => {
  hideAndShowElements("player-selection", "game-board");

  if (e.target.id === "X") {
    player_one_text = "X";
    player_two_text = "O";
  } else {
    player_one_text = "O";
    player_two_text = "X";
  }
  document.getElementById("player-one-score").innerHTML = 0;
  document.getElementById("player-two-score").innerHTML = 0;
  return;
};

const playerOne = (box) => {
  let box_clicked_id = box.target.id;
  if (isEmpty(box_clicked_id)) {
    insertPlayerValueInDOM(box_clicked_id, player_one_text);
    playAudio("human-click");
    first_player.push(box_clicked_id);
    avaliable_box.splice(avaliable_box.indexOf(box_clicked_id), 1);

    if (isWinner(first_player)) {
      incrementScore("player-one-score");
      number_of_players <= 1
        ? displayResult("audio-win", "YOU WIN")
        : displayResult("audio-win", "PLAYER-ONE WIN");
    } else {
      if (isDraw()) {
        displayResult("audio-draw", "GAME DRAW");
      } else {
        nextPlayer();
      }
    }
  }
  return;
};

const nextPlayer = () => {
  if (number_of_players <= 1) {
    disableBoxes();
    let call_computer_to_play = setTimeout(function () {
      computerPlay();
      clearTimeout(call_computer_to_play);
    }, 1000);
  } else {
    switchTerm("playerTwo(event)");
  }
  return;
};

const playerTwo = (box) => {
  let box_clicked_id = box.target.id;
  if (isEmpty(box_clicked_id)) {
    insertPlayerValueInDOM(box_clicked_id, player_two_text);
    playAudio("computer-click");
    second_player.push(box_clicked_id);
    avaliable_box.splice(avaliable_box.indexOf(box_clicked_id), 1);

    if (isWinner(second_player)) {
      incrementScore("player-two-score");
      displayResult("audio-win", "PLAYER-TWO WIN");
    } else {
      if (isDraw()) {
        displayResult("audio-draw", "GAME DRAW");
      } else {
        switchTerm("playerOne(event)");
      }
    }
  }
  return;
};

const switchTerm = (player_term) => {
  document.querySelectorAll(".item").forEach((ele) => {
    ele.setAttribute("onclick", player_term);
  });
  return;
};

const isEmpty = (box_id) => {
  if (document.getElementById(box_id).innerHTML === "") {
    return true;
  }
  return false;
};

const computerPlay = () => {
  let random_num =
    avaliable_box[Math.floor(Math.random() * avaliable_box.length)];
  let smart_win = makeComputerSmart(second_player);
  if (smart_win) {
    random_num = smart_win;
  } else {
    let smart_block = makeComputerSmart(first_player);
    if (smart_block) random_num = smart_block;
  }

  if (isEmpty(random_num)) {
    insertPlayerValueInDOM(random_num, player_two_text);
    playAudio("computer-click");
    avaliable_box.splice(avaliable_box.indexOf(random_num), 1);
    second_player.push(random_num);

    if (isWinner(second_player)) {
      displayResult("audio-lose", "COMPUTER WIN");
      incrementScore("player-two-score");
    } else {
      if (isDraw()) {
        displayResult("audio-draw", "GAME DRAW");
      } else {
        enableBoxes();
      }
    }
  }
  return;
};

const insertPlayerValueInDOM = (ele_id, value) => {
  document.getElementById(ele_id).innerHTML = value;
  return;
};

const isWinner = (player_arr) => {
  for (let i = 0; i < winning_options.length; i++) {
    let single_win_val = winning_options[i].split("");
    let winner_check_count = 0;

    for (let j = 0; j < single_win_val.length; j++) {
      if (player_arr.includes(single_win_val[j])) winner_check_count += 1;
    }

    if (winner_check_count === 3) return true;
  }
  return false;
};

const makeComputerSmart = (player_arr) => {
  for (let i = 0; i < winning_options.length; i++) {
    let single_win_val = winning_options[i].split("");
    let smart_check_count = 0;
    let smart_play = 0;

    for (let j = 0; j < single_win_val.length; j++) {
      if (player_arr.includes(single_win_val[j])) smart_check_count += 1;
      else smart_play = single_win_val[j];
    }
    if (smart_check_count === 2) {
      if (document.getElementById(smart_play).innerHTML === "")
        return smart_play;
    }
  }
  return;
};

const isDraw = () => {
  if (first_player.length + second_player.length >= 9) {
    return true;
  }
  return false;
};

const disableBoxes = () => {
  document.querySelectorAll(".item").forEach((ele) => {
    ele.style = "pointer-events: none";
  });
  return;
};

const enableBoxes = () => {
  document.querySelectorAll(".item").forEach((ele) => {
    ele.style = "pointer-events: pointer";
  });
  return;
};

const replay = () => {
  enableBoxes();
  hideAndShowElements("result", "restart");
  document.querySelectorAll(".item").forEach((ele) => {
    ele.innerHTML = "";
  });
  first_player = [];
  second_player = [];
  winner = 0;
  stopAudio();
  document.getElementById("game-board").style = "opacity: 1.0";
  avaliable_box = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  switchTerm("playerOne(event)");
  return;
};

const changePlayer = () => {
  replay();
  hideAndShowElements("game-board", "player-selection");
  return;
};

const changeNumOfPlayers = () => {
  hideAndShowElements("identity", "num-of-players");
  return;
};

const hideAndShowElements = (hide, show) => {
  document.getElementById(hide).style = "display: none";
  document.getElementById(show).style = "display: block";
  return;
};

const displayResult = (audio, winner) => {
  document.getElementById("winner-text").innerHTML = winner;
  document.getElementById("game-board").style = "opacity: 0.8";
  hideAndShowElements("restart", "result");
  document.getElementById(audio).setAttribute("class", "is-playing");
  playAudio(audio);
  disableBoxes();
  return;
};

const playAudio = (audio) => {
  document.getElementById(audio).play();
  return;
};

const stopAudio = () => {
  if (document.querySelector(".is-playing")) {
    document.querySelector(".is-playing").pause();
    document.querySelector(".is-playing").currentTime = 0;
    document.querySelector(".is-playing").removeAttribute("class");
  }
  return;
};

const incrementScore = (player) => {
  let score = document.getElementById(player);
  score.innerHTML = Number(score.innerHTML) + 1;
  return;
};