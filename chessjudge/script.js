// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
import { Chess } from '/chessjudge/chess.js'

const moves = new Map()

let curMove = 0
let numMoves = 0

async function getData() { 
  //sending a GET request to get a bunch of information about the user
  const URL = '/chessjudge/puzzles.json';
  
  const Params = {
      method: 'GET'
  }
  
  return await fetch(URL, Params)
      .then(res => res.json()) //returns the JSON
      .catch(err => alert(err)) //throws error
}

getData().then(
  function(value) {
    console.log(value)
    const FENs = value["puzzle1"]["FENS"]
    for (let i=0; i < FENs.length; i++){
      moves.set(i, FENs[i])
      numMoves ++
    }
  }
);

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  if (!(game.fen() === moves.get(curMove+1))){
    console.log("SAD")
    board = Chessboard('myBoard', config)
    game = new Chess('3r2k1/3r1ppp/8/8/3R4/6P1/7P/3R2K1 b - - 0 1')
  }

  else{
    curMove += 2
    if (curMove != numMoves){
      config.position = moves.get(curMove)
      console.log("YAY")
    }
    else{
      config.position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      alert("YOU WIN")
    }

    board = Chessboard('myBoard', config)
    game = new Chess(moves.get(curMove))
  }

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }
  
  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  position: '3r2k1/3r1ppp/8/8/3R4/6P1/7P/3R2K1 b - - 0 1'
}

var board = Chessboard('myBoard', config)
var game = new Chess('3r2k1/3r1ppp/8/8/3R4/6P1/7P/3R2K1 b - - 0 1')
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

updateStatus()