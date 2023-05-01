// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
import { Chess } from '/homework/chess.js'
import puzzles from '/homework/puzzles.json' assert { type: 'json' }

let curPuzzle = "puzzle9"
let curMove = 0
let numMoves = puzzles[curPuzzle]["numMoves"]

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

  if (!(game.fen() === puzzles[curPuzzle]["FENS"][curMove+1])){
    board = Chessboard('myBoard', config)
    game.undo()
  }

  else{
    curMove += 2
    if (curMove < numMoves){
      game.move(puzzles[curPuzzle]["moves"][curMove-1])
    }
    else{
      config.position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      alert("YOU WIN")
    }

    board = Chessboard('myBoard', config)
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
  position: puzzles[curPuzzle]["startFEN"]
}

var board = Chessboard('myBoard', config)
var game = new Chess(puzzles[curPuzzle]["startFEN"])
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

updateStatus()