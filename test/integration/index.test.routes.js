process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : index', function() {

  beforeEach(function(done) {
    passportStub.logout();
    knex.migrate.latest()
    .then(function() {
      done();
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe('if unauthenticated', function() {
    describe('GET /ping', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/ping')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.equal('pong!');
          done();
        });
      });
    });
    describe('GET /', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          done();
        });
      });
    });
    describe('GET /dashboard', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/dashboard')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h1 class="page-header">Textbook</h1>');
          res.text.should.contain(
            '<p><a href="auth/github">Github</a></p>');
          res.text.should.not.equal('dashboard!');
          done();
        });
      });
    });
  });

  describe('if authenticated', function() {
    beforeEach(function(done) {
      testHelpers.authenticateUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /dashboard', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/dashboard')
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.not.contain(
              '<h1 class="page-header">Textbook</h1>');
            res.text.should.not.contain(
              '<p><a href="auth/github">Github</a></p>');
            res.text.should.equal('dashboard!');
            done();
          });
      });
    });
  });

});