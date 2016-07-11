exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('messages').del(),
    // Inserts seed entries
    knex('messages').insert({
      content: 'Awesome lesson!',
      lesson_id: 1,
      user_id: 1,
      created_at: new Date(2016, 07, 10)
    }),
    knex('messages').insert({
      content: 'Sick!',
      lesson_id: 1,
      user_id: 1
    }),
    knex('messages').insert({
      content: 'Love it!',
      lesson_id: 2,
      user_id: 1
    })
  );
};
