import chess

class Puzzle:
    def __init__(self, lis):
        self.id = lis[0]
        self.FEN = lis[1]
        self.moves = lis[2].split()[1:]
        self.rating = lis[3]

        board = chess.Board(self.FEN)
        board.push_san(lis[2].split()[0])
        self.FEN = board.fen()
        

def convertUCI(curBoard, move):
    return curBoard.san(chess.Move.from_uci(move))

puzzle_list = [""]

DATABASE_FILE = "C:/Users/alanb/WindsorChess/lichess_db_puzzle.csv"

with open(DATABASE_FILE) as inFile:
    for i in range(1000):
        puzzle_list.append(Puzzle(inFile.readline().split(",")))

board = chess.Board(puzzle_list[1].FEN)

count = 0

with open("puzzles.json", "w") as outFile:
    outFile.write("{\n")
    for i in range(1, 1001):
        board = chess.Board(puzzle_list[i].FEN)
        if board.turn == chess.BLACK:
            continue
        count += 1

        outFile.write("\t" + '"puzzle' + str(count) + '" : {\n')
        outFile.write("\t\t" + '"numMoves" : ' + str(len(puzzle_list[i].moves)) + ",\n")
        outFile.write("\t\t" + '"startFEN" : "' + puzzle_list[i].FEN + '",\n')
        outFile.write("\t\t" + '"FENS" : [\n')

        outFile.write("\t\t\t" + '"' + puzzle_list[i].FEN +'",\n')
        for k in range(len(puzzle_list[i].moves)):
            move = puzzle_list[i].moves[k]
            board.push_san(move)
            outFile.write("\t\t\t" + '"' + str(board.fen()) + '"')
            if k != len(puzzle_list[i].moves) -1 :
                outFile.write(",")
            outFile.write("\n")

        outFile.write("\t\t],\n")

        board = chess.Board(puzzle_list[i].FEN)
        outFile.write("\t\t" + '"moves" : [\n')

        for k in range(len(puzzle_list[i].moves)):
            move = puzzle_list[i].moves[k]
            outFile.write('\t\t\t"' +  board.san(chess.Move.from_uci(move)) + '"')
            board.push_san(move)
            if k != len(puzzle_list[i].moves) -1 :
                outFile.write(",")
            outFile.write("\n")

        outFile.write("\t\t]\n")

        outFile.write("\t},\n")

    outFile.write("}")