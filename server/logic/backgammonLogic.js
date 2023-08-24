class BackgammonGame {
    constructor(player1Id, player2Id) {
        this.board = Array(25).fill(null).map(() => ({ color: null, pieces: 0 }));
        this.setupBoard();
        this.bar = { white: 0, black: 0 };
        this.bearOff = { white: 0, black: 0 };
        this.players = { white: player1Id, black: player2Id };
        this.currentPlayer = Math.random() < 0.5 ? 'white' : 'black';
        this.dice = [];
        this.isDoubled = false;
        this.doublingCube = 1;
        this.movesMade = 0;
        this.isGameOver = false;
        this.gameHistory = [];
        this.jacobyRuleActive = false; // For the Jacoby rule
        this.score = { white: 0, black: 0 }; // Add score property
    }

    setupBoard() {
        const positions = [
            { color: 'white', point: 24, pieces: 2 },
            { color: 'white', point: 13, pieces: 5 },
            { color: 'white', point: 8, pieces: 3 },
            { color: 'white', point: 6, pieces: 5 },
            { color: 'black', point: 1, pieces: 2 },
            { color: 'black', point: 12, pieces: 5 },
            { color: 'black', point: 17, pieces: 3 },
            { color: 'black', point: 19, pieces: 5 }
        ];
        for (let pos of positions) {
            this.board[pos.point].color = pos.color;
            this.board[pos.point].pieces = pos.pieces;
        }
    }

    updateBoard(point, color, pieces) {
        this.board[point].color = color;
        this.board[point].pieces += pieces;
    }

    rollDice() {
        if (this.isGameOver) {
            throw new Error("You cannot roll the dice. The game is over.");
        }
        
        this.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        this.isDoubled = this.dice[0] === this.dice[1];
        this.movesMade = this.isDoubled ? 4 : 2;
    }

    double() {
        if (this.isGameOver) {
            throw new Error("Doubling isn't allowed after the game ends.");
        }
        if (this.doublingCube >= 64) {
            throw new Error("Doubling cube is already at its maximum value.");
        }
        this.doublingCube *= 2;
        // When the doubling cube is used, the Jacoby rule becomes active
        this.jacobyRuleActive = true;
        this.nextPlayer(); // Temporary switch to the other player for them to accept or decline the double
    }

    respondToDouble(accept) {
        if (this.isGameOver) {
            throw new Error("Game is over! Cannot respond to double.");
        }
        if (!accept) {
            this.isGameOver = true;
            this.winner = this.currentPlayer === 'white' ? 'black' : 'white'; // The other player wins
            return;
        }
        // If the double is accepted, the game continues
        this.nextPlayer();
    }

    hitChecker(endPoint) {
        this.bar[this.board[endPoint].color]++;
        this.board[endPoint].color = this.currentPlayer;
        this.board[endPoint].pieces = 0;
    }

    moveChecker(startPoint, endPoint) {
        // Check if the game is over
        if (this.isGameOver) {
            throw new Error("You can't move pieces after the game ends.");
        }
    
        // Check if the startPoint and endPoint are valid board positions
        if (startPoint < 1 || startPoint > 24 || endPoint < 1 || endPoint > 24) {
            throw new Error("Invalid start or end point.");
        }
    
        // Ensure the startPoint has pieces of the current player's color
        if (this.board[startPoint].pieces === 0 || this.board[startPoint].color !== this.currentPlayer) {
            throw new Error("No valid checker to move from the starting point.");
        }
    
        const direction = this.currentPlayer === 'white' ? -1 : 1;
        const diceValue = direction * (endPoint - startPoint);
        const diceIndex = this.dice.indexOf(diceValue);
    
        // Ensure the move corresponds to a dice value and the dice value hasn't been used yet
        if (diceIndex === -1 || this.diceUsed[diceIndex]) {
            throw new Error("Invalid move based on dice rolls.");
        }
    
        // Check for valid movement logic
        if (!this.isValidMove(startPoint, endPoint, diceValue)) {
            throw new Error("Invalid move.");
        }
    
        // Move logic: If there's only 1 opponent piece at the endPoint, send it to the bar
        if (this.board[endPoint].color !== this.currentPlayer && this.board[endPoint].pieces === 1) {
            this.bar[this.board[endPoint].color]++;
            this.board[endPoint].pieces = 0;
        }
    
        // Update board's state for startPoint and endPoint
        this.updateBoard(startPoint, this.board[startPoint].color, -1); // remove piece from startPoint
        this.updateBoard(endPoint, this.currentPlayer, 1); // add piece to endPoint
    
        // If all pieces are moved to the correct quadrant, move to bear off
        if (this.canBearOff(this.currentPlayer)) {
            if (this.currentPlayer === 'white' && endPoint <= 6) {
                this.bearOff.white++;
                this.board[endPoint].pieces--;
            } else if (this.currentPlayer === 'black' && endPoint >= 19) {
                this.bearOff.black++;
                this.board[endPoint].pieces--;
            }
        }
    
        // Mark the dice value as used
        this.diceUsed[diceIndex] = true;
    
        // If all dice have been used, switch to the other player
        if (this.diceUsed.every(Boolean)) {
            this.switchPlayer();
        }
    
        // Save the complete state after the move
        this.gameHistory.push({
            board: JSON.parse(JSON.stringify(this.board)),
            bar: { ...this.bar },
            bearOff: { ...this.bearOff },
            currentPlayer: this.currentPlayer,
            dice: [...this.dice],
            doublingCube: this.doublingCube
        });
    }    

    canMoveAnyPiece() {
        for (let diceValue of this.dice) {
            for (let i = 1; i <= 24; i++) {
                if (this.board[i].color === this.currentPlayer && this.isValidMove(i, i + (this.currentPlayer === 'white' ? -diceValue : diceValue), diceValue)) {
                    return true;
                }
            }
        }
        return false;
    }

    bearOffChecker(startPoint, diceValue) {
        if (!this.canBearOff()) {
            throw new Error("Cannot bear off yet!");
        }

        this.board[startPoint].pieces--;

        if (this.board[startPoint].pieces === 0) {
            this.board[startPoint].color = null;
        }

        this.bearOff[this.currentPlayer]++;
        this.movesMade--;

        if (this.movesMade === 0 || !this.canMoveAnyPiece()) {
            this.checkForGameOver();
            this.nextPlayer();
        }
    }
    
    undoLastMove() {
        if (!this.gameHistory.length) {
            throw new Error("No moves to undo.");
        }
        const lastMove = this.gameHistory.pop();
        this.board[lastMove.startPoint].pieces++;
        this.board[lastMove.endPoint].pieces--;
        this.movesMade++;
        if (this.board[lastMove.endPoint].pieces === 0) {
            this.board[lastMove.endPoint].color = null;
        }
    }

    isGammon() {
        for (let i = 1; i <= 24; i++) {
            if (this.board[i].color === (this.currentPlayer === 'white' ? 'black' : 'white') && this.board[i].pieces > 0) {
                return false;
            }
        }
        return this.bar[this.currentPlayer === 'white' ? 'black' : 'white'] === 0;
    }

    isBackgammon() {
        return this.isGammon() && (this.bar[this.currentPlayer === 'white' ? 'black' : 'white'] > 0 || 
                                   this.board[this.currentPlayer === 'white' ? 1 : 24].pieces > 0);
    }

    nextPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    getValidMoves(point) {
        if (this.isGameOver) {
            throw new Error("The game is over.");
        }
        if (point < 1 || point > 24 || !this.board[point] || this.board[point].pieces === 0 || this.board[point].color !== this.currentPlayer) {
            throw new Error(`Invalid point (${point}) selected.`);
        }
        const validMoves = [];
        for (let diceValue of this.dice) {
            const endPoint = point + (this.currentPlayer === 'white' ? -diceValue : diceValue);
            if (this.isValidMove(point, endPoint, diceValue)) {
                validMoves.push(endPoint);
            }
        }
        return validMoves;
    }

    isValidMove(startPoint, endPoint, diceValue) {
        if (startPoint < 1 || startPoint > 24 || endPoint < 1 || endPoint > 24) return false;
        if (Math.abs(endPoint - startPoint) !== diceValue) return false;

        if (this.bar[this.currentPlayer] > 0) {
            return false; // Pieces on the bar need to be moved first
        }

        if (!this.board[startPoint] || this.board[startPoint].pieces === 0 || this.board[startPoint].color !== this.currentPlayer) {
            return false;
        }

        if (this.board[endPoint].color !== this.currentPlayer && this.board[endPoint].pieces > 1) {
            return false;
        }

        if (this.canBearOff()) {
            if (this.currentPlayer === 'white' && endPoint === 0) {
                return startPoint - diceValue <= 6;
            }
            if (this.currentPlayer === 'black' && endPoint === 25) {
                return startPoint + diceValue >= 19;
            }
        }
        return true;
    }

    enterFromBar(diceValue) {
        if (this.isGameOver) {
            throw new Error("Game is over! Cannot enter pieces from the bar.");
        }

        const entryPoint = this.currentPlayer === 'white' ? 25 - diceValue : diceValue;

        if (this.bar[this.currentPlayer] === 0 || !this.canEnterFromBar(diceValue)) {
            throw new Error("Cannot enter from the bar!");
        }

        if (this.board[entryPoint].color && this.board[entryPoint].color !== this.currentPlayer) {
            this.bar[this.board[entryPoint].color]++;
            this.board[entryPoint] = { color: this.currentPlayer, pieces: 1 };
        } else {
            this.board[entryPoint].color = this.currentPlayer;
            this.board[entryPoint].pieces++;
        }
        this.bar[this.currentPlayer]--;
    }

    canEnterFromBar(diceValue) {
        const entryPoint = this.currentPlayer === 'white' ? 25 - diceValue : diceValue;
        return (this.board[entryPoint].color === this.currentPlayer || this.board[entryPoint].pieces <= 1);
    }

    canBearOff() {
        let totalInHomeBoard = 0;
        const start = this.currentPlayer === 'white' ? 19 : 1;
        const end = this.currentPlayer === 'white' ? 24 : 6;
        for (let i = start; i <= end; i++) {
            if (this.board[i].color === this.currentPlayer) {
                totalInHomeBoard += this.board[i].pieces;
            }
        }
        const furthestPoint = this.currentPlayer === 'white' ? 6 : 19;
        return this.board[furthestPoint].color !== this.currentPlayer && totalInHomeBoard === (15 - this.bearOff[this.currentPlayer]);
    }

    checkForGameOver() {
        if (this.bearOff.white === 15 || this.bearOff.black === 15) {
            this.isGameOver = true;
            if (!this.jacobyRuleActive || this.doublingCube > 1) {
                if (this.isGammon()) {
                    console.log("Gammon!");
                } else if (this.isBackgammon()) {
                    console.log("Backgammon!");
                }
            }
        }
    }

    endGame() {
        let multiplier = 1;
        if (this.isGammon()) {
            multiplier = 2;
            console.log("Gammon!");
        } else if (this.isBackgammon()) {
            multiplier = 3;
            console.log("Backgammon!");
        }
        this.score[this.currentPlayer] += this.doublingCube * multiplier;
    }
}

module.exports = BackgammonGame;