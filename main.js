// TODO: 1. hacer una funcion que modificque el estado del display
// de un elemento

var tateti;

var empates = 0;
var ganadosComputadora = 0;
var ganadosHumano = 0;

//ids de las celdas en el html
var CELL_ID = [['ceroCero', 'ceroUno', 'ceroDos'],
            ['unoCero', 'unoUno', 'unoDos'],
            ['dosCero', 'dosUno', 'dosDos']];

/* TATETI */

class Tateti {
    constructor(fichaH, turn) {
	   this.reset(fichaH, turn);
    }

	//métodos
    setFichaHumano(tile){
      this.fichaHumano = tile;
      this.fichaComputadora = (tile == 'X' )? 'O' : 'X';
    }
	
	reset(fichaH, turn){
		this.tablero = [
            [{busy: false, tile: "", posicion: [0,0]},
             {busy: false, tile: "", posicion: [0,1]},
             {busy: false, tile: "", posicion: [0,2]}],
            [{busy: false, tile: "", posicion: [1,0]},
             {busy: false, tile: "", posicion: [1,1]},
             {busy: false, tile: "", posicion: [1,2]}],
            [{busy: false, tile: "", posicion: [2,0]},
            {busy: false, tile: "", posicion: [2,1]},
            {busy: false, tile: "", posicion: [2,2]}]
        ];

		this.setFichaHumano(fichaH);
		this.turn = turn;
		this.jugados = 0;
	}

	addTile(typeTile, fila, columna){
	  this.tablero[fila][columna].busy = true;
	  this.tablero[fila][columna].tile = typeTile;
	}
	  
	areBusy(fila, columna){
	  return this.tablero[fila][columna].busy;
	}
	
	changeTurn(){
		if (this.turn == 'c'){
		this.turn = 'h';
		} else {
		this.turn = 'c';
		}
	}
	
	// muestra en consola
	// mostrarTablero(){
    //     console.log("------------------");
    //     for (var i = 0; i < this.tablero.length; i++){
    //       var f = this.tablero[i];
    //       var c1 = f[0].tile;
    //       var c2 = f[1].tile;
    //       var c3 = f[2].tile;
    //       var txt = "|  " + c1 + "  |  " + c2 + "  |  " + c3 + "  |";
    //       console.log(txt);
	//     }
    //     console.log("------------------");
    // }
	
	diagonales(){
		// res = [diagPrincipal, diagSecundaria]
		var res = [[],[]];

		// diagonalPrincipal
		res[0].push(this.tablero[0][0]);
		res[0].push(this.tablero[1][1]);
		res[0].push(this.tablero[2][2]);
		// diagonalSecundaria
		res[1].push(this.tablero[0][2]);
		res[1].push(this.tablero[1][1]);
		res[1].push(this.tablero[2][0]);
		return res;
	}
	
	getColumn(n){
		var res = [];
		for (var f of this.tablero){
		res.push(f[n]);
		}
		return res;
	}
	
	columnas(){
	  var res = [];
	  res.push(this.getColumn(0));
	  res.push(this.getColumn(1));
	  res.push(this.getColumn(2));	  
	  return res;
	}
	
	isFinished(){
	  return tateti.isFull() || tateti.hay3EnLinea();
	}

    isFull(){
		return this.jugados >= 9;
	}

    hay3EnLinea(){
		var lineas = this.columnas().concat(this.tablero).concat(this.diagonales());
		for (var linea of lineas){
			if(this.hay3Iguales(linea)){
				return true;
			}
		}
		return false;
	}
    
    celdasVaciasDeLineasConDosOcupadas(tile){
    	var lineas = this.columnas().concat(this.tablero).concat(this.diagonales());
    	var res = [];
    	for (var linea of lineas){
    		var tiene = this.tieneUnaSolaDesocupada(linea, tile); //espero un array vacío o uno no vacío con dos elementos correspondientes a una posición de celda del tablero
    		if (tiene.length !== 0){
    			res.push(tiene);
    		}
    	}
    	return res;
    }

    tieneUnaSolaDesocupada(linea, typeTile){
    	//revisar y reescribir
    	var count = 0;
    	var posicion = [];
    	for (var cell of linea){
    		if (cell.busy){
    			if (cell.tile === typeTile){
    				count++;
    			}
    		} else {
    			//guardar la celda desocupada
    			posicion = cell.posicion;
    		}
    	}
    	if (count === 2){
    		return posicion;
    	} else {
    		return [];
    	}
    }

	hay3Iguales(linea){
		//revisar y reescribir para mejor legibilidad
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
	  //busca y devuelve una celda desocupada
	  var posicion = [];//un par ordenado de fila, columna
	  for (var i = 0; i < this.tablero.length; i++){
	    var f = this.tablero[i];	    
	    for (var j = 0; j < f.length; j++){
	      if(!this.areBusy(i,j)){
			posicion = [i, j];
			return posicion; //devuelve la primera que encuentra
	      }
	    }
	  }
	}
};


/* manejar los eventos de la página */

/* Jugada humano */
function humanTurn(cell, fila, columna){
    // antes tenés que ver si no está terminado el juego
        // y si es el turno del jugador
    // no chequeo si es el turno del jugador
    // si en algún momento chequeara de quién es el turno,
        // si no fuera del jugador llamaría a la jugada de la
        // computadora.
    // pero esto pasaría si se clickea una celda,
        // no tiene mucho sentido...

    if(!tateti.isFinished()){
        if (!tateti.areBusy(fila, columna)){
            tateti.addTile(tateti.fichaHumano, fila, columna);
            tateti.jugados += 1;
            displayCell(cell, tateti.fichaHumano);
            //tateti.mostrarTablero();
            
            if(tateti.isFinished()){
                updateMarker('h');
                // console.log("terminó Humano");
       	        tateti.reset(tateti.fichaHumano, 'h'); 
                //se mantiene la misma ficha que tenía al principio.
                //podría haber una función que elija al azar a quién le toca el turno
       	        cleanCells();
			    displayTurn(tateti);
                displayMarker();
                // console.log("Humano: " + ganadosHumano + ". Computadora: " + ganadosComputadora + ". Empates: " + empates);
            } else {
                tateti.changeTurn();
                displayTurn(tateti);
                // console.log("turn: " + tateti.turn);
                jugadaComputadora(tateti);
		    }
        } 
		// else {
        //     console.log('busy');
        // }
    }
}

/* Jugada computadora */

function jugadaComputadora(tateti){
	// se podría modularizar un poco, encapsular y abstraer
        // algunas partes de esta función...
	// se supone que es el turno de la computadora, no
        // habría otra forma de llegar acá si no, del
        // modo en que está escrito
	if(!tateti.isFinished()){
	// toda esta parte debería estar encapsulada en una
        // función, qué es lo que está haciendo la
        // computadora, elegirCelda()

	// elegir una posicion al azar de entre 
        // celdasVaciasDeLineasConDosOcupadas(tateti.fichaComputadora);
        // y si es vacío, si no hay ninguna
	// entonces de celdasVaciasDeLineasConDosOcupadas(tateti.fichaHumano);,
        // es decir si no puede ganar entonces bloquear
        // la posibilidad de ganar del contrario
	// y si no en la primera desocupada.
		var posicion = tateti.getIdleCell();

	    var posiblesParaGanar = tateti.celdasVaciasDeLineasConDosOcupadas(tateti.fichaComputadora);
	    var posiblesParaBloquear = tateti.celdasVaciasDeLineasConDosOcupadas(tateti.fichaHumano);

	    if (posiblesParaGanar.length >= 1){
	    	posicion = posiblesParaGanar[Math.floor(Math.random()* posiblesParaGanar.length)];//elijo al azar una de las celdas
		} else if (posiblesParaBloquear.length >= 1){
			posicion = posiblesParaBloquear[Math.floor(Math.random()* posiblesParaBloquear.length)];//elijo al azar una de las celdas
		} else {
			//antes de dejar que elija cualquiera desocupada, ver si está libre la del medio, la (1,1)
			if (!tateti.areBusy(1,1)) posicion = [1,1];
		}
		
		//una vez que eligió, pone la ficha en el tablero.
	    var fila = posicion[0];
		var columna = posicion[1];
		tateti.addTile(tateti.fichaComputadora, fila, columna);
		tateti.jugados +=1; //esta acción tal vez tendría que hacerse dentro de agregar ficha 
	
		//una vez agregada, se muestra en la página
		var cell = document.getElementById(CELL_ID[fila][columna]); 
		displayCell(cell, tateti.fichaComputadora);

        // tateti.mostrarTablero();
        
		//chequea si con esa jugada se terminó el partido
		if(tateti.isFinished()){
            updateMarker('c');
			// console.log("terminó Computadora");
			tateti.reset(tateti.fichaHumano, 'h');//¿habría otra manera de no tener el reset en 2 lugares?
			cleanCells();
			displayTurn(tateti);
            displayMarker();
            // console.log("Humano: " + ganadosHumano + ". Computadora: " + ganadosComputadora + ". Empates: " + empates);
		} else {
			tateti.changeTurn();
			displayTurn(tateti);
			// console.log("turn: " + tateti.turn);
		}
	}
}

function updateMarker(quienTermino){
    if (tateti.hay3EnLinea()){
        (quienTermino == 'h')? ganadosHumano++ : ganadosComputadora++;
    } else {
        empates++;
    }    
}

function displayMarker(){
    var ganadosH = document.getElementById('ganadosH');
    var ganadosC = document.getElementById('ganadosC');
    var empate = document.getElementById('empate');
    
    ganadosC.textContent = "Computadora: " + ganadosComputadora;
    ganadosH.textContent = "Humano: " + ganadosHumano;
    empate.textContent = "Empate: " + empates;
}

function cleanCells(){
	var cell;
	for (var fila of CELL_ID){
		for (var id of fila){
			cell = document.getElementById(id);
			cell.textContent = "";
		}		
	}
}

function displayCell(cell, tile){
	cell.textContent = tile;
}

function displayTurn(tateti){
	var display = document.getElementById('turn');
	display.textContent = 'Turno: ' + tateti.turn;
}

function chooseTile(typeTile){

    tateti = new Tateti(typeTile, 'h');
    
    var celdas = document.getElementsByClassName("cell");

    //mostrar celdas
    for (var c of celdas){
        c.style.display = "inline-block";
		//  "inline-block": is to display list items horizontally instead of vertically
    }
    
    //ocultar selección de ficha
    var tile = document.getElementById("tile");
    tile.style.display = "none";
    
    //mostrar jugadores, turno y marcador
    var hum = document.getElementById("hum");
    var comp = document.getElementById("comp");
    var turn = document.getElementById("turn");
    var marcador = document.getElementsByClassName('marcador')[0];
    
    hum.textContent = "Human play to " + tateti.fichaHumano;
    comp.textContent = "Computer play to " + tateti.fichaComputadora; 
    turn.textContent = "Turn " + tateti.turn;
     
    jugadores.style.display = "block";
    turn.style.display = "block";
    marcador.style.display = "block";
    
    displayMarker();
}
