process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../server/db/knex');
var server = require('../../server/app');
var testHelpers = require('../helpers');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : auth', function() {

  beforeEach(function(done) {
    passportStub.logout();
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  describe('if unauthenticated', function() {
    describe('GET /auth/log_out', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/log_out')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/log_in', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/log_in')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /auth/verify', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 21049144460970398511
        })
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/inactive', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/inactive')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/verify', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/verify')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
  });

  describe('if authenticated, active, and verified', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAndVerifyActiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /auth/log_out', function() {
      it('should log out and redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/log_out')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/log_in', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .get('/auth/log_in')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          done();
        });
      });
    });
    describe('POST /auth/log_in', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .get('/auth/log_in')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          done();
        });
      });
    });
    describe('POST /auth/verify', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 21049144460970398511
        })
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          done();
        });
      });
    });
    describe('POST /auth/verify', function() {
      it('should redirect to the inactive page if the code is incorrect', function(done) {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 999
        })
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
    describe('POST /auth/verify', function() {
      it('should redirect to the closed page if verification status is 0', function(done) {
        process.env.CAN_VERIFY = 0;
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 999
        })
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>We are closed.</h2>');
          res.text.should.not.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          process.env.CAN_VERIFY = 1;
          done();
        });
      });
    });
    describe('GET /auth/inactive', function() {
      it('should log out and redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/inactive')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /auth/verify', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/auth/verify')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/verify', function() {
      it('should redirect to the closed page if verification status is 0',
      function(done) {
        process.env.CAN_VERIFY = 0;
        chai.request(server)
        .get('/auth/verify')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>We are closed.</h2>');
          res.text.should.not.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          process.env.CAN_VERIFY = 1;
          done();
        });
      });
    });
  });

  describe('if authenticated and verified but inactive', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAndVerifyInactiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /auth/log_out', function() {
      it('should log out and redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/log_out')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/log_in', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/auth/log_in')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('POST /auth/verify', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 21049144460970398511
        })
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /auth/inactive', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/auth/inactive')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /auth/verify', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/auth/verify')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
  });

  describe('if authenticated and active but unverified', function() {
    beforeEach(function(done) {
      testHelpers.authenticateActiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /auth/log_out', function() {
      it('should log out and redirect to log in page', function(done) {
        chai.request(server)
        .get('/auth/log_out')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/log_in', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/auth/log_in')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
    describe('POST /auth/verify', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 21049144460970398511
        })
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
    describe('GET /auth/inactive', function() {
      it('should redirect to the not verified page',
      function(done) {
        chai.request(server)
        .get('/auth/inactive')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/verify', function() {
      it('should redirect to the not verified page',
      function(done) {
        chai.request(server)
        .get('/auth/verify')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          done();
        });
      });
    });
  });

});
