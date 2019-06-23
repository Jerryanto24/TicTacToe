// JavaScript Document

$(document).ready(function() {

    $('#start-game').click(function()
    {
        const board_size = parseInt($("#size-input").val());
        $("#tictactoe-msg").attr("class","");

        if (board_size >= 3)
        {
          
          const new_game = new TicTacToeGame(board_size);

          $("#game").append(new_game.resizeBoard);
          
          //assign the table td event to able generate x and o
          new_game.assignEvents();

          //find the winning result combinations: row, column, diagonal   .after board is defined
          new_game.winnerState();

          //let the player know who turn first
          document.getElementById("tictactoe-msg").innerHTML  = 'Player 1 turn';

          //after first game start rename the button to restart game
          document.getElementById("start-game").innerHTML  = 'Restart Game';
        }else
        { 
          //minimum tic tac toe board is 3. 
          //3 * 3 = 9 box
          alert('minimum board size is 3');}


    });


});