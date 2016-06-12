var express = require('express');
var router = express.Router();

var githubAuth = require('../auth/github');
var authHelpers = require('../auth/helpers');

router.get('/github',
  githubAuth.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  githubAuth.authenticate('github', { failureRedirect: '/'}),
  function(req, res, next) {
  res.redirect('/dashboard');
});

router.get('/logout', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
