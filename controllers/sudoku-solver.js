class SudokuSolver {

  validate(puzzleString) {
    // Validate type and string
    const regex = /[^\d|.]/g;
    if(!(typeof puzzleString === 'string'&&puzzleString.length === 81))return { error: 'Expected puzzle to be 81 characters long' };
    // Validate characters
    else if(regex.test(puzzleString))return { error: 'Invalid characters in puzzle' };
  }

  checkSolved(puzzleString) {
    for(let i = 0; i< puzzleString.length;i++){
      if(puzzleString[i] === '.')return false;
    }
    return true;
  }
 
  
  checkRowPlacement(puzzleString, row, column, value) {
    const temp = this.toIndex(row, column);
    for(let i = 0; i < 9 ;i++){
      // Check row
      let index =  i * 9 + column - 1;
      if(index !== temp&&puzzleString[index] !== '.'&&puzzleString[index] == value)return false;
    }
    return true;
  }


  
  

  
  checkColPlacement(puzzleString, row, column, value) {
    const temp = this.toIndex(row, column);
    for(let i = 0; i < 9; i++){
      // Check col
      let index = (row.charCodeAt(0) - 65) * 9 + i;
      if(temp !== index&&puzzleString[index] !== '.'&&puzzleString[index] == value)return false;
      
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
      const temp = this.toIndex(row, column);
      let rowRegion = String.fromCharCode(row.charCodeAt(0) - ((row.charCodeAt(0) - 65) % 3))
      let colRegion = column / 7 >= 1 ? 7 : column /4 >= 1 ? 4 : 1;
    let index;
    for(let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++)
        {
          index = ((rowRegion.charCodeAt(0) - 65 + i) * 9) + (colRegion + j - 1);
          
          if(temp !== index&&puzzleString[index] !== '.'&&puzzleString[index] == value)return false
        }
    }
    return true;
  }
  solve(puzzleString){
    const board = puzzleString.split('');
    return this.solveSudoku(board).join('');
  }
  solveSudoku(board) { 
    const emptySpot = this.nextEmptySpot(board);
    // there is no more empty spots
    if (emptySpot == -1){
        return board;
    }
    
    const col = emptySpot % 9 + 1;
    const row = String.fromCharCode((emptySpot - col + 1) /9 + 65)
    for(let c = 1; c<=9; c++){
        if (this.isValid(board, row, col, String(c))){
            board[emptySpot] = String(c);
            this.solveSudoku(board);
        }
    }
    if (this.nextEmptySpot(board) !== -1)
        board[emptySpot] = '.'
      return board;
}
  
  nextEmptySpot(board) {
    for(let i =0;i< board.length;i++){
          if(board[i] === '.')return i;
    }
    return -1;
}
    
  
    isValid(board, row, col, value)
  {
    if(!this.checkRowPlacement(board, row, col, value))
      return false;
    if(!this.checkColPlacement(board, row, col, value))
      return false;
    if(!this.checkRegionPlacement(board, row, col, value))
      return false;
    return true;
  }

  checkedMaker(puzzleString, coordinate, value){
    const row = coordinate[0];
    const col = parseInt(coordinate[1]);
    const conflict = [];
    if(!this.checkRowPlacement(puzzleString, row, col, value))
      conflict.push("row");
    if(!this.checkColPlacement(puzzleString, row, col, value))
      conflict.push("column");
    if(!this.checkRegionPlacement(puzzleString, row, col, value))
      conflict.push("region");
    if(conflict.length === 0){
      return { valid: true }
    }
    else{
      return { valid: false, conflict }
    }
  }
  toIndex(row, col) {
    const index = (row.charCodeAt(0) - 65) * 9 + col - 1;
    return index;
  }
  
}





module.exports = SudokuSolver;

