var knex = require('./knex');

function getAllLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number');
}

function getActiveLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('active', true);
}

function getInactiveLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('active', false);
}

function getLessonOrderNumbers() {
  return knex('lessons')
  .select('lesson_order_number')
  .orderBy('lesson_order_number')
  .where('active', true);
}

function getLessonsFromChapterID(chapterID) {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('chapter_id', parseInt(chapterID))
  .where('active', true);
}

function getLessonChapterOrderNumsFromChapterID(chapterID) {
  return knex('lessons')
  .select('chapter_order_number')
  .orderBy('chapter_order_number')
  .where('chapter_id', parseInt(chapterID));
}

function getSingleLesson(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', parseInt(lessonID));
}

function getSingleLessonFromLessonID(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', parseInt(lessonID));
}

function getSingleLessonFromOrder(lessonOrderNum) {
  return knex('lessons')
    .select('*')
    .where('lesson_order_number', parseInt(lessonOrderNum));
}

function addLesson(obj) {
  return knex('lessons')
    .insert(obj)
    .returning('*');
}

function updateLesson(lessonID, obj) {
  return knex('lessons')
    .update(obj)
    .where('id', parseInt(lessonID))
    .returning('*');
}

function deactivateLesson(lessonID) {
  return knex('lessons')
    .update({
      active: false
    })
    .where('id', parseInt(lessonID))
    .returning('*');
}

function deactivateLessonsFromChapterID(chapterID) {
  return knex('lessons')
    .update({
      active: false
    })
    .where('chapter_id', parseInt(chapterID))
    .returning('*');
}

module.exports = {
  getAllLessons: getAllLessons,
  getActiveLessons: getActiveLessons,
  getInactiveLessons: getInactiveLessons,
  getLessonOrderNumbers: getLessonOrderNumbers,
  getLessonsFromChapterID: getLessonsFromChapterID,
  getLessonChapterOrderNumsFromChapterID: getLessonChapterOrderNumsFromChapterID,
  getSingleLesson: getSingleLesson,
  getSingleLessonFromLessonID: getSingleLessonFromLessonID,
  getSingleLessonFromOrder: getSingleLessonFromOrder,
  addLesson: addLesson,
  updateLesson: updateLesson,
  deactivateLesson: deactivateLesson,
  deactivateLessonsFromChapterID: deactivateLessonsFromChapterID
};
