process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../server/db/knex');
var server = require('../../server/app');
var messageQueries = require('../../server/db/queries.messages');
var testHelpers = require('../helpers');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : messages', function() {

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
    describe('GET /admin/messages/:id/deactivate?type=parent', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/messages/:id/update', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/messages/1/update')
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
    describe('GET /admin/messages/:id/deactivate?type=parent', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
    describe('GET /admin/messages/:id/update', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/messages/1/update')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
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
    describe('GET /admin/messages/:id/deactivate?type=parent', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /admin/messages/:id/update', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/messages/1/update')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
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
    describe('GET /admin/messages/:id/deactivate?type=parent', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
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
    describe('GET /admin/messages/:id/update', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/messages/1/update')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
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
  });

  describe('if authenticated as an admin', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAdmin(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /admin/messages/:id/deactivate?type=parent', function() {
      it('should deactivate parent and child messages', function(done) {
        messageQueries.getActiveParentMessages()
        .then(function(messages) {
          chai.request(server)
          .get('/admin/messages/' + messages[0].id + '/deactivate?type=parent')
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('<h2>You are an admin.</h2>');
            done();
          });
        });
      });
    });
    describe('GET /admin/messages/:id/deactivate?type=child', function() {
      it('should deactivate child messages', function(done) {
        messageQueries.getActiveChildMessages()
        .then(function(messages) {
          chai.request(server)
          .get('/admin/messages/' + messages[0].id + '/deactivate?type=parent')
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('<h2>You are an admin.</h2>');
            done();
          });
        });
      });
    });
    describe('GET /admin/messages/:id/update', function() {
      it('should update messages', function(done) {
        messageQueries.getActiveParentMessages()
        .then(function(messages) {
          chai.request(server)
          .get('/admin/messages/' + messages[0].id + '/update')
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('<h2>You are an admin.</h2>');
            done();
          });
        });
      });
    });
  });

});
