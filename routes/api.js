'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const sudokuSolver = new SudokuSolver();

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      const coRegex = /^[A-Z][0-9]$/;
      const vaRegex = /^[0-9]{1}/
      if(!puzzle||!coordinate||!value){
        return res.send({ error: 'Required field(s) missing' });
      }
      if(sudokuSolver.validate(puzzle)){
        return res.send(sudokuSolver.validate(puzzle));
      }
      if(!coRegex.test(coordinate)){
        return res.send({ "error": "Invalid coordinate" });
      }
      else if(!vaRegex.test(value)){
        return res.send({ "error": "Invalid value" })
      }
      else {
        res.send(sudokuSolver.checkedMaker(puzzle, coordinate, value));
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      let solution;
      if(!puzzle){
        return res.send({ error: 'Required field missing' });
      }  
      else if(sudokuSolver.validate(puzzle)){
        return res.send(sudokuSolver.validate(puzzle));
      }
      else {
        solution = sudokuSolver.solve(puzzle);
        if(sudokuSolver.checkSolved(solution)){
          res.json({solution: sudokuSolver.solve(puzzle)});
        }
        else res.send({ error: 'Puzzle cannot be solved' });
      }
    });
};
