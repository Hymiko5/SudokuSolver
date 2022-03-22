const chai = require('chai');
const assert = chai.assert;
const puzzle = require('../controllers/puzzle-strings');

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {
  suite('Write the following tests in tests/1_unit-tests.js:', function() {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const expect = puzzle.puzzlesAndSolutions[0][1];
      assert.equal(solver.solve(input), expect);
      done();    
    })

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      raw[9] = 'A';raw[10] = 'B';
      const input = raw.join('');
      assert.equal(solver.validate(input).error, 'Invalid characters in puzzle');
      done();
    })

    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      const input = raw.slice(5);
      assert.equal(solver.validate(input).error, 'Expected puzzle to be 81 characters long');
      done();
    })

    test('Logic handles a valid row placement', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const row = 'C';
      const col = 3;
      const index = solver.toIndex(row, col);
      const spotValue = puzzle.puzzlesAndSolutions[0][1][index];
      assert.equal(solver.checkRowPlacement(input, row, col, spotValue), true);
      done();
    })

    test('Logic handles an invalid row placement', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const row = 'C';
      const col = 3;
      const spotValue = '5';
      assert.notEqual(solver.checkRowPlacement(input, row, col, spotValue), true);
      done();
    })
    
    test('Logic handles a valid column placement', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const row = 'C3';
      const col = 3;
      const index = solver.toIndex(row, col);
      const spotValue = puzzle.puzzlesAndSolutions[0][1][index];
      assert.equal(solver.checkColPlacement(input, row, col, spotValue), true);
      done();
    })

    test('Logic handles an invalid column placement', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const row = 'C3';
      const col = 3;
      const index = solver.toIndex(row, col);
      const spotValue = '5';
      assert.notEqual(solver.checkColPlacement(input, row, col, spotValue), true);
      done();
    })

    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const row = 'C3';
      const col = 3;
      const index = solver.toIndex(row, col);
      const spotValue = puzzle.puzzlesAndSolutions[0][1][index];
      assert.equal(solver.checkRegionPlacement(input, row, col, spotValue), true);
      done();
    })

    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const row = 'C3';
      const col = 3;
      const index = solver.toIndex(row, col);
      const spotValue = '5';
      assert.notEqual(solver.checkRegionPlacement(input, row, col, spotValue), true);
      done();
    })

    test('Valid puzzle strings pass the solver', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const solution = solver.solve(input);
      assert.equal(solver.checkSolved(solution), true);
      done();
    })

    test('Invalid puzzle strings fail the solver', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      raw[0] = '1';
      raw[1] = '1'
      const input = raw.join('');
      const solution = solver.solve(input);
      assert.notEqual(solver.checkSolved(solution), true);
      done();
    })

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
      puzzle.puzzlesAndSolutions.forEach(board => {
        assert.equal(board[0].length, 81);
        assert.equal(solver.solve(board[0]), board[1]);
      })
      done();
    })
  })
});
