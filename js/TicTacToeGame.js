class TicTacToeGame {

  //constructor
  constructor(size, x = new Set([]), o = new Set([]), step = 1, winner_state_map = new Map()) {
      this.size = size;
      this.x = x;
      this.o = o;
      this.step = step;
      this.winner_state_map = winner_state_map;

  }

  //adding method
  get resizeBoard(){

    let component_id = 1;
    let boardComponents =``;

    //remove baord
    $("#game tr").remove(); 

    //looping to generate box for tic tac toe
    for(let x=1; x <= this.size; x++)
    {
        boardComponents += `<tr>`;

          for(let i=1; i <= this.size; i++)
          {
            boardComponents += `<td id="${component_id}" class="btn x-o-btn"></td>`;
            component_id++;         
          }

        boardComponents += '</tr>';

    }
    return boardComponents;
  }

  assignEvents(){

      let xoTDs = document.querySelectorAll(".x-o-btn");

      xoTDs.forEach(xoTD => (
        xoTD.addEventListener('click', () => {

          //determine X or O by step that players is making
          if (this.step == this.size * this.size)
          {
            //change info text
            alert('Its a tie. It will restart.');
            this.restartGame();
          }
          else if (this.step % 2 == 0)
          {
            //change td btn text to o
            document.getElementById(xoTD.id).innerHTML  = 'o';
            document.getElementById(xoTD.id).className += "o btn-danger" ;

            // insert/store into class attribute for o move/step (this.o)
            //what box or number that o player take
            this.o.add(parseInt(xoTD.id));

            //change info text
            document.getElementById("tictactoe-msg").innerHTML  = 'Player 1 turn';

            
            //check and determine winner
            this.getWinner(parseInt(xoTD.id));

          } else 
          { 
            //change td btn text to x
            document.getElementById(xoTD.id).innerHTML  = 'x';
            document.getElementById(xoTD.id).className += "x btn-primary" ;

            // insert/store into class attribute for x move/step (this.o)
            //what box or number that x player take
            this.x.add(parseInt(xoTD.id));

            //change info text
            document.getElementById("tictactoe-msg").innerHTML  = 'Player 2 turn';            

            //check and determine winner
            this.getWinner(parseInt(xoTD.id));
       
          }
          //increase step after player1 or player2 make a
          this.step += 1;
          

        },
        { once: true })
             
      ));
    

  }

  winnerState(){

    //first, we need to define what are the conditions (what are numbers?) make tic tac toe is winner
    //by determine what are the numbers/conditions? below is the solution

    //winner divide into 3 types: row-winner, column winner, diagonal-winner
    //in order to find out those number for 3 types winner with scalable board, we need some formula and algorithm
    //and store it into map contains of array set (row-winner, column winner, diagonal-winner)

    for(let x=1; x <= this.size; x++)
    {
      //-----row winnner---
      //generate sequence set array ex:1,2,3 for row-winner
      let row_Array= [];
     
      let row_start_with = (this.size * x - this.size);

      //generate sequence set for row ex: 1 2 3, etc
      row_Array = [...Array(this.size).keys()].map(i => i + 1 + row_start_with);

      let row_setArray = new Set(row_Array);
      this.winner_state_map.set(`row${x}`, row_setArray);


      //-----column winnner and diagonal ---

      //insert firt number first for each column ex: board size 3 is 1 , 2 and 3
      let column_setArray = new Set([x]);
      this.winner_state_map.set(`column${x}`, column_setArray);
      
      //loop to get column winner number ex: 1 4 7, 2 5 8, 3 6 9.
      //to generate this looping the board size

      //formula first loop for x and i, formula = (1 + (1 * 3)) = 4
        //formula frist loop for x second loop i, formula = (1 + (2 * 3)) = 7
      //formula seond loop for x and i, formula = (2 + (1 * 3)) = 5
        //formula seond loop for x second loop i, formula = (2 + (2 * 3)) = 8
      //formula third loop for x and i, formula = (3 + (1 * 3)) = 6
        //formula third loop for x second loop i, formula = (3 + (2 * 3)) = 9
      // so we found column winner number ex: 1 4 7, 2 5 8, 3 6 9.  
      
      for(let i=1; i < this.size; i++)
      {
        this.winner_state_map.get(`column${x}`).add(x + (i * this.size));
   
      }
    }

    //---diagonal winner---

    //first define left and right diagonal winner set
    this.winner_state_map.set(`diagonalLeft`,new Set([]));
    this.winner_state_map.set(`diagonalRight`,new Set([]));

    //loop to get left diagonal winner number ex: 1 5 9.
    //loop to get right diagonal winner number ex: 3 5 7.
    //to generate this looping the board size

    //formula left diagonal frist loop for x, formula = (1 + (0 * 3) + 0) = 1
    //formula right diagonal frist loop for x, formula = ((0 + 1) *  3) + 0) = 3
    
    //formula left diagonal second loop for x, formula = (1 + (1 * 3) + 1) = 5
    //formula right diagonal second loop for x, formula = ((1 + 1) *  3) - 1) = 5  
        
    //formula left diagonal second loop for x, formula = (1 + (2 * 3) + 2) = 9
    //formula right diagonal second loop for x, formula = ((2 + 1) *  3) - 2) = 7

    //so we found left diagonal winner number ex: 1 5 9.
    //so we found right diagonal winner number ex: 3 5 7.

    for(let x=0; x < this.size; x++)
    {
      this.winner_state_map.get(`diagonalLeft`).add(1 + (x * this.size) + x);
      this.winner_state_map.get(`diagonalRight`).add(((x+1) * this.size) - x);
    }
    

  }
  getWinner(playerMove){

    //check minimal moave is minimal board size to win
    if (this.x.size >= this.size || this.o.size >= this.x.size >= this.size)
    {

    //after found what are conditions the winner array number from tictactoe box (winner_state_map) and after insert/store move array from x and o (this.x and this.o)
    //we check the x and o move array (this.x and this.o) against with winner array number from tictactoe box (winner_state_map)
    //if any intersection (value that has in both array set), then we store it new array set
    //if array set count is equal to board size it means we found the winner

        //determine which row current move, formula is ceil(current move divide board size)
        // if current move is 5 and board size is 3 then 5/3 = 2, so it is on row number 2
        let row_number = Math.ceil(playerMove/this.size);

        //determine which column current move, formula is (current move + board size) % 3
        //if current move is 2 and board size is 3 then (2 + 3) % 3 = 2, so 2 is in column 2
        //the reason to add board size because lower value like 1, 2 (for board size 3) is lower than 3 (board size). 
        //we cant determine the column if below the divisor so we need to add board size which is 3
        //as for o value after modulus means that the column is on last column of the tic tac toe.
        let move_mod_size = (playerMove + this.size) % this.size;
        let column_number = move_mod_size == 0 ? this.size : move_mod_size;


      //----------check row winner ----------
      let x_row_winner = new Set([...this.x].filter(i => this.winner_state_map.get(`row${row_number}`).has(i)));

      let o_row_winner = new Set([...this.o].filter(i => this.winner_state_map.get(`row${row_number}`).has(i)));

      //----------check column winner ----------
      let x_column_winner = new Set([...this.x].filter(i => this.winner_state_map.get(`column${column_number}`).has(i)));
  
      let o_column_winner = new Set([...this.o].filter(i => this.winner_state_map.get(`column${column_number}`).has(i)));


      //----------check diagonal winner ----------
      let x_left_diag_winner = new Set([...this.x].filter(i => this.winner_state_map.get(`diagonalLeft`).has(i)));

      let o_left_diag_winner = new Set([...this.o].filter(i => this.winner_state_map.get(`diagonalLeft`).has(i)));

      let x_right_diag_winner = new Set([...this.x].filter(i => this.winner_state_map.get(`diagonalRight`).has(i)));

      let o_right_diag_winner = new Set([...this.o].filter(i => this.winner_state_map.get(`diagonalRight`).has(i)));

      
      //determine winner for diagonal/row/columns
      if (x_left_diag_winner.size == this.size || x_right_diag_winner.size == this.size || x_row_winner.size == this.size || x_column_winner.size == this.size)
      {
        $("#tictactoe-msg").attr("class","text-primary");
        document.getElementById("tictactoe-msg").innerHTML  = 'Player 1 Win! X WINNER!';

        //remove board
        this.removeBoard();

        //increase value for x player
        document.getElementById("x_win").innerHTML = parseInt(document.getElementById("x_win").innerHTML) + 1;
      }
      if (o_left_diag_winner.size == this.size || o_right_diag_winner.size == this.size || o_row_winner.size == this.size || o_column_winner.size == this.size)
      {  

        $("#tictactoe-msg").attr("class","text-danger");
        document.getElementById("tictactoe-msg").innerHTML = 'Player 2 Win! O WINNER!';

        //remove board
        this.removeBoard();

        //increase value for o player
        document.getElementById("o_win").innerHTML = parseInt(document.getElementById("o_win").innerHTML) + 1;
      }
    }

  }
  
  restartGame(){
    document.getElementById("start-game").click();
    document.getElementById("tictactoe-msg").innerHTML  = 'Player 1 turn';
  }
  removeBoard(){
    $("#game tr").fadeOut(2000, function()
    { 
      $("#game tr").remove(); 
    });
  }

}