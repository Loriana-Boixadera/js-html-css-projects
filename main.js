var tictactoe;

var ties = 0;
var winnedComputer = 0;
var winnedHuman = 0;

var CELL_ID = [['zeroZero', 'zeroOne', 'zeroTwo'],
            ['oneZero', 'oneOne', 'oneTwo'],
            ['twoZero', 'twoOne', 'twoTwo']];

// TicTacToe

class Tictactoe {
    constructor(tileH, turn) {
	   this.reset(tileH, turn);
    }
	
	// Methods
    setHumanTile(tile){
		this.humanTile = tile;
		this.computerTile = (tile == 'X' )? 'O' : 'X';
    }

	// ──────────────────────────
	// | [0,0] |  [0,1] |  [0,2] |
	// | [1,0] |  [1,1] |  [1,2] |
	// | [2,0] |  [2,1] |  [2,2] |
	// ──────────────────────────
	
	reset(tileH, turn){
		this.board = [
            [{busy: false, tile: "", position: [0,0]},
             {busy: false, tile: "", position: [0,1]},
             {busy: false, tile: "", position: [0,2]}],
            [{busy: false, tile: "", position: [1,0]},
             {busy: false, tile: "", position: [1,1]},
             {busy: false, tile: "", position: [1,2]}],
            [{busy: false, tile: "", position: [2,0]},
            {busy: false, tile: "", position: [2,1]},
            {busy: false, tile: "", position: [2,2]}]
        ];

		this.setHumanTile(tileH);
		this.turn = turn;
		this.played = 0;
	}

	addTile(typeTile, row, column){
		this.board[row][column].busy = true;
		this.board[row][column].tile = typeTile;
	}

	isBusy(row, column){
		return this.board[row][column].busy;
	}
	
	changeTurn(){
		this.turn == 'c' ? 'h' : 'c'
	}
	
	getDiagonals(){
		// res = [mainDiagonal, sideDiagonal]
		var res = [[],[]];

		// mainDiagonal
		res[0].push(this.board[0][0]);
		res[0].push(this.board[1][1]);
		res[0].push(this.board[2][2]);
		// sideDiagonal
		res[1].push(this.board[0][2]);
		res[1].push(this.board[1][1]);
		res[1].push(this.board[2][0]);
		return res;
	}
	
	getColumn(n){
		var res = [];
		for (var f of this.board){
			res.push(f[n]);
		}
		return res;
	}
	
	getColumns(){
	  	var res = [];
	  	for (let i = 0; i < 3; res.push(this.getColumn(i++))) {}
		return res;
	}
	
	isFinished(){
		return tictactoe.isFull() || tictactoe.are3InLine();
	}

    isFull(){
		return this.played >= 9;
	}

    are3InLine(){
		var inline_tiles = this.getColumns().concat(this.board).concat(this.getDiagonals());
		for (var linea of inline_tiles){
			if(this.are3Equals(linea)){
				return true;
			}
		}
		return false;
	}
    
	// Todo: Understand the following function
    celdasVaciasDeinline_tilesConDosOcupadas(tile){
    	var inline_tiles = this.getColumns().concat(this.board).concat(this.getDiagonals());
		
    	var res = [];
    	for (var linea of inline_tiles){
    		var tiene = this.tieneUnaSolaDesocupada(linea, tile); 
			// espero un array vacío o uno no vacío con dos elementos correspondientes
			// a una posición de celda del tablero
    		if (tiene.length !== 0){
    			res.push(tiene);
    		}
    	}
    	return res;
    }

    tieneUnaSolaDesocupada(linea, typeTile){
    	var count = 0;
    	var position = [];
    	for (var cell of linea){
    		if (cell.busy){
    			if (cell.tile === typeTile){
    				count++;
    			}
    		} else {
    			position = cell.position;
    		}
    	}
    	if (count === 2){
    		return position;
    	} else {
    		return [];
    	}
    }

	are3Equals(linea){
		var count = 0;
		var tile = "";
		for (var cell of linea){
			if (cell.busy){
				if (tile !== ""){
					if(tile === cell.tile){
						count++;
					} else {
						return false;
					}
				} else {
					tile = cell.tile;
					count++;
				}
			} else {
				return false;
			}
		}
		return count === 3;
	}
	
    getIdleCell(){
		var position = []; // un par ordenado de row, column
		for (var i = 0; i < this.board.length; i++){
			var f = this.board[i];	    
			for (var j = 0; j < f.length; j++){
				if(!this.isBusy(i,j)){
					position = [i, j];
					return position; // devuelve la primera que encuentra
				}
			}
		}
	}
};


/* Events on the .html */

/* Human played */
function humanTurn(cell, row, column){
    if(!tictactoe.isFinished()){
        if (!tictactoe.isBusy(row, column)){
            tictactoe.addTile(tictactoe.humanTile, row, column);
            tictactoe.played += 1;
            displayCell(cell, tictactoe.humanTile);
            
            if(tictactoe.isFinished()){
                updateScoreboard('h');
       	        tictactoe.reset(tictactoe.humanTile, 'h');
       	        cleanCells();
			    displayTurn(tictactoe);
                displayScoreboard();
            } else {
                tictactoe.changeTurn();
                displayTurn(tictactoe);

				// setTimeout(() => {
				// 	display
				// }, 3000);

                computerTurn(tictactoe);
		    }
        }
    }
}

/* Computer Turn */

function computerTurn(tictactoe){
	if(!tictactoe.isFinished()){
	// toda esta parte debería estar encapsulada en una
        // función, qué es lo que está haciendo la
        // computadora, elegirCelda()

	// elegir una posicion al azar de entre 
        // celdasVaciasDeinline_tilesConDosOcupadas(tictactoe.computerTile);
        // y si es vacío, si no hay ninguna
	// entonces de celdasVaciasDeinline_tilesConDosOcupadas(tictactoe.humanTile);,
        // es decir si no puede ganar entonces bloquear
        // la posibilidad de ganar del contrario
	// y si no en la primera desocupada.
		var position = tictactoe.getIdleCell();

	    var posiblesParaGanar = tictactoe.celdasVaciasDeinline_tilesConDosOcupadas(tictactoe.computerTile);
	    var posiblesParaBloquear = tictactoe.celdasVaciasDeinline_tilesConDosOcupadas(tictactoe.humanTile);

	    if (posiblesParaGanar.length >= 1){
	    	position = posiblesParaGanar[
				Math.floor(Math.random() * posiblesParaGanar.length)
			];//elijo al azar una de las celdas
		} else if (posiblesParaBloquear.length >= 1){
			position = posiblesParaBloquear[
				Math.floor(Math.random() * posiblesParaBloquear.length)
			];//elijo al azar una de las celdas
		} else {
			//antes de dejar que elija cualquiera desocupada, ver si está libre la del medio, la (1,1)
			if (!tictactoe.isBusy(1,1)) position = [1,1];
		}
		
		//una vez que eligió, pone la ficha en el tablero.
	    var row = position[0];
		var column = position[1];
		tictactoe.addTile(tictactoe.computerTile, row, column);
		tictactoe.played +=1; //esta acción tal vez tendría que hacerse dentro de agregar ficha 
	
		//una vez agregada, se muestra en la página
		var cell = document.getElementById(CELL_ID[row][column]); 
		displayCell(cell, tictactoe.computerTile);
        
		//chequea si con esa jugada se terminó el partido
		if(tictactoe.isFinished()){
            updateScoreboard('c');
			tictactoe.reset(tictactoe.humanTile, 'h');//¿habría otra manera de no tener el reset en 2 lugares?
			cleanCells();
			displayTurn(tictactoe);
            displayScoreboard();
		} else {
			tictactoe.changeTurn();
			displayTurn(tictactoe);
		}
	}
}

function updateScoreboard(quienTermino){
    if (tictactoe.are3InLine()){
        (quienTermino == 'h')? winnedHuman++ : winnedComputer++;
    } else {
        ties++;
    }    
}

function displayScoreboard(){
    var winnedH = document.getElementById('winnedH');
    var winnedC = document.getElementById('winnedC');
    var tie = document.getElementById('tie');
    
    winnedC.textContent = "Computer: " + winnedComputer;
    winnedH.textContent = "Human: " + winnedHuman;
    tie.textContent = "Tie: " + ties;
}

function cleanCells(){
	var cell;
	for (var row of CELL_ID){
		for (var id of row){
			cell = document.getElementById(id);
			cell.textContent = "";
		}		
	}
}

function displayCell(cell, tile){
	cell.textContent = tile;
}

function displayTurn(tictactoe){
	var display = document.getElementById('turn');
	display.textContent = 'Turn: ' + tictactoe.turn;
}

function chooseTile(typeTile){

    tictactoe = new Tictactoe(typeTile, 'h');
    
    var cells = document.getElementsByClassName("cell");

    //mostrar celdas
    for (var c of cells){
        c.style.display = "inline-block";
		//  "inline-block": is to display list items horizontally instead of vertically
    }
    
    //ocultar selección de ficha
    var tile = document.getElementById("tile");
    tile.style.display = "none";
    
	

    //mostrar jugadores, turno y scoreboard
    var hum = document.getElementById("hum");
    var comp = document.getElementById("comp");
    var turn = document.getElementById("turn");
    var scoreboard = document.getElementsByClassName('scoreboard')[0];
	// var restartGame = document.getElementsByClassName('estartGame')[0];
    
    hum.textContent = "Human play to " + tictactoe.humanTile;
    comp.textContent = "Computer play to " + tictactoe.computerTile; 
    turn.textContent = "Turn " + tictactoe.turn;
	
    players.style.display = "block";
    turn.style.display = "block";
    scoreboard.style.display = "block";
	// restartGame.style.display = "block";
    
    displayScoreboard();
}
