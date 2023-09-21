class Backgammon {
    firstCheckersPosition(board){
        board[0] = {color: "white", amount: 2};
        board[12] = {color: "white", amount: 5};
        board[17] = {color: "white", amount: 3};
        board[20] = {color: "white", amount: 5};

        board[25] = {color: "black", amount: 2};
        board[13] = {color: "black", amount: 5};
        board[8] = {color: "black", amount: 3};
        board[5] = {color: "black", amount: 5};

        board[6] = {color: "white", amount: 0}

        board[19] = {color: "black", amount: 0};

        return board;
    }

    whoIsStarting() {
        let color = ["black", "white"];
        let randomIndex = Math.floor(Math.random() * color.length);
        let randomColor = color[randomIndex];

        return randomColor;
    }

    makeMove(gameState, from, to) {
        if (gameState.board[from].color !== gameState.currentPlayer) {
            return false;
        }

        if (this.checkIfGameIsEnded(gameState)){
            return false;
        }

        if (this.checkIfCheckersOnBar(gameState)){
            this.checkerFromBarToBoard(gameState, from, to);
            return true;
        }

        if (this.checkIfCanBearOff(gameState)){
            this.bearOff(gameState, from);
            return true;
        }

        if (!this.useDiceForMove(gameState, from, to)) {
            return false;
        }
    
        this.regularMove(gameState, from, to);

        this.checkEndOfTurn(gameState);

        return true;
    }

    regularMove(gameState, from, to) {
        if (!this.checkIfCanMove(gameState, from, to)) {
            return false;
        }
        let color = gameState.currentPlayer;

        gameState.board[from].amount -= 1;
        if (gameState.board[from].amount === 0) {
            gameState.board[from].color = null;
        }

        if (gameState.board[to].color === null || gameState.board[to].color === color) {
            gameState.board[to].amount++;
            gameState.board[to].color = color;
        } else if (gameState.board[to].amount === 1) {
            this.eatChecker(gameState, to);
        } else {
            return false;
        }
        return true;
    }

    checkIfCanMove(gameState, from, to) {
        let color = gameState.currentPlayer;
        return (color === 'white' && to > from) || (color === 'black' && to < from);
    }

    changePlayer(gameState) {
        gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    }
    
    checkIfCanBearOff(gameState){

        let color = gameState.currentPlayer;
        
        if (color === 'white') {
            for (let i = 0; i <= 19; i++) {
                if (gameState.board[i].color === 'white') {
                    return false;
                }
            }
        }

        if (color === 'black') {
            for (let i = 6; i <= 25; i++) {
                if (gameState.board[i].color === 'black') {
                    return false;
                }
            }
        }

        return true; // can bear off checkers
    }

    bearOff(gameState, from){
        if (this.checkIfCheckersOnBar(gameState)){
            return false;
        }
        if (this.checkIfThereAreCheckersOnTriangle(gameState, from) && this.checkIfCanBearOff(gameState)){
            let color = gameState.currentPlayer;
            gameState.board[from].amount -= 1;
            if (gameState.board[from].amount === 0){
                gameState.board[from].color = null;
            }
            if (color === 'white') {
                gameState.bearOff.white += 1;
            }
            if (color === 'black') {
                gameState.bearOff.black += 1;
            }
            return true; // beared off checker
        }
        return false; // did not beared checker
    }

    checkIfThereAreCheckersOnTriangle(gameState, position){
        if (gameState.board[position].amount > 0){
            return true;
        }
        return false; // no checkers
    }

    checkIfCheckersOnBar(gameState){
        let color = gameState.currentPlayer;

        if (color === 'white') {
            if (gameState.board[6].amount > 0) {
                return true;
            }
        }
        if (color === 'black'){
            if (gameState.board[19].amount > 0){
                return true;
            }
        }

        return false; // no checkers on bar
    }

    checkerFromBarToBoard(gameState, from, to){
        if (this.checkIfEnemyBaseIsFull(gameState)){
            return false;
        }
        if (this.checkIfThereAreCheckersOnTriangle(gameState, to)){
            let color = gameState.currentPlayer;

            if (color === 'white'){
                if (gameState.board[to].color === color || gameState.board[to].color === null){
                    gameState.bar.white -= 1;
                    gameState.board[from].amount -= 1;
                    gameState.board[to].color === color;
                    gameState.board[to].amount += 1;
                }
                if (gameState.board[to].color === 'black' && gameState.board[to].amount <= 1){
                    gameState.bar.white -= 1;
                    gameState.board[from].amount -= 1;
                    this.eatChecker(gameState, to);
                }
            }

            if (color === 'black'){
                if (gameState.board[to].color === color || gameState.board[to].color === null){
                    gameState.bar.black -= 1;
                    gameState.board[from].amount -= 1;
                    gameState.board[to].color === color;
                    gameState.board[to].amount += 1;
                }
                if (gameState.board[to].color === 'white' && gameState.board[to].amount <= 1){
                    gameState.bar.black -= 1;
                    gameState.board[from].amount -= 1;
                    this.eatChecker(gameState, to);
                }
            }
        }
    }

    eatChecker(gameState, position){
        let color = gameState.currentPlayer;

        if (color === 'white'){
            gameState.board[position].color === 'white';
            gameState.bar.black += 1;
            gameState.board[19].amount += 1;
        }
        if (color === 'black'){
            gameState.board[position].color === 'black';
            gameState.bar.white += 1;
            gameState.board[6].amount += 1;
        }
    }

    useDiceForMove(gameState, from, to) {
        let distance = Math.abs(to - from);
        let diceIndex = gameState.diceRoll.indexOf(distance);
        
        if (diceIndex !== -1 && !gameState.diceUsed[diceIndex]) {
            gameState.diceUsed[diceIndex] = true;
            return true;
        }
        return false; // Invalid move based on dice values
    }
    
    checkIfCanRollDice(gameState){
        if (this.checkIfCheckersOnBar(gameState) && this.checkIfEnemyBaseIsFull(gameState)){
            return false;
        }
        if (this.checkIfGameIsEnded(gameState)){
            return false;
        }
        return true; // can roll dice
    }

    rollDice(gameState){
        if (this.checkIfCanRollDice(gameState)){
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;

            if (dice1 === dice2) {
                gameState.diceRoll = [dice1, dice1, dice1, dice1];
                gameState.diceUsed = [false, false, false, false];
            } else {
                gameState.diceRoll = [dice1, dice2];
                gameState.diceUsed = [false, false];
            }

            return true; // dice rolled
        }
        this.changePlayer(gameState);
        return false; // dice didnt roll
    }

    checkIfEnemyBaseIsFull(gameState){
        let color = gameState.currentPlayer;

        if (color === 'white'){
            for (let i = 0; i < 6; i++){
                if (gameState.board[i].color === 'white' || gameState.board[i].amount <= 1){
                    return false;
                }
            }
        }
        if (color === 'black'){
            for (let i = 20; i < 26; i++){
                if (gameState.board[i].color === 'black' || gameState.board[i].amount <= 1){
                    return false;
                }
            }
        }

        return true; //enemy base is full
    }

    checkEndOfTurn(gameState) {
        if (gameState.diceUsed.every(val => val) || !this.checkIfAnyValidMoves(gameState)) {
            this.changePlayer(gameState);
            return true;
        }
        return false;
    }

    checkIfAnyValidMoves(gameState) {
        let color = gameState.currentPlayer;
    
        // Iterate through each position on the board.
        for (let i = 0; i < 26; i++) {
            // If the checker on this position belongs to the current player
            if (gameState.board[i].color === color && gameState.board[i].amount > 0) {
                for (let diceValue of gameState.diceRoll) {
                    // Calculate potential move based on dice value and player color
                    let potentialPosition = (color === 'white') ? i + diceValue : i - diceValue;
    
                    // Ensure the move is within the board boundaries
                    if (potentialPosition >= 0 && potentialPosition <= 25) {
                        // Check if the potential move is valid
                        if (!gameState.diceUsed[gameState.diceRoll.indexOf(diceValue)] &&
                            this.checkIfCanMove(gameState, i, potentialPosition)) {
                            return true; // Found a valid move
                        }
                    }
                }
            }
        }
    
        return false; // No valid moves found
    }

    checkIfGameIsEnded(gameState){
        if (gameState.bearOff.white === 15 || gameState.bearOff.black === 15){
            return true;
        }
        return false; //game is not ended
    }
}

module.exports = Backgammon;