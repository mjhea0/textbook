var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');

router.get('/:id', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var renderObject = {
    user: req.user,
    messages: req.flash('messages')
  };
  chapterQueries.getChapters()
  .then(function(chapters) {
    renderObject.chapters = chapters;
  });
  chapterQueries.getSingleChapter(parseInt(req.params.id))
  .then(function(singleChapter) {
    if (singleChapter.length) {
      renderObject.title = 'Textbook LMS - ' + singleChapter[0].name;
      renderObject.singleChapter = singleChapter[0];
      res.render('chapter', renderObject);
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That chapter does not exist.'
      });
      res.redirect('/dashboard');
    }
  })
  .catch(function(err) {
    next(err);
  });
});

module.exports = router;
