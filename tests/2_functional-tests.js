const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzle = require('../controllers/puzzle-strings');


chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Write the following tests in tests/2_functional-tests.js', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzle.puzzlesAndSolutions[0][0] })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution.length, 81);
          assert.equal(res.body.solution, puzzle.puzzlesAndSolutions[0][1]);
          done();
        })
    })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        })
    })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      raw[5] = 'A';
      const input = raw.join('');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        })
    })

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      const input = raw.slice(5).join('');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        })
    })

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      raw[0] = 1; raw[1] = 1;
      const input = raw.join('');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        })
    })

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const coordinate = 'A2';
      const value = puzzle.puzzlesAndSolutions[0][1][1];
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function (err, res) {
    
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        })
    })

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const coordinate = 'C1';
      const value = 3;
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 1);
          done();
        })
    })

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const coordinate = 'A2';
      const value = 1;
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 2);
          done();
        })
    })

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
      const input = puzzle.puzzlesAndSolutions[0][0];
      const coordinate = 'C3';
      const value = 5;
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 3);
          done();
        })
    })

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        })
    })

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      raw[0] = 'A';
      const coordinate = 'A2';
      const value = puzzle.puzzlesAndSolutions[0][0][1];
      const input = raw.join('');
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        })
    })

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      const raw = puzzle.puzzlesAndSolutions[0][0].split('');
      const coordinate = 'A2';
      const value = puzzle.puzzlesAndSolutions[0][0][1];
      const input = raw.slice(5);
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        })
    })

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      const coordinate = 'A99';
      const value = puzzle.puzzlesAndSolutions[0][0][1];
      const input = puzzle.puzzlesAndSolutions[0][0];
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        })
    })

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      const coordinate = 'A2';
      const value = 'B';
      const input = puzzle.puzzlesAndSolutions[0][0];
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: input, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        })
    })
  })
});

