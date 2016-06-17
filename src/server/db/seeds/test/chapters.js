exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('chapters').del(),
    // Inserts seed entries
    knex('chapters').insert({
      number: 1,
      name: 'Functions and Loops',
      content: 'Functions and Loops are awesome!'
    }),
    knex('chapters').insert({
      number: 2,
      name: 'Conditional logic',
      content: 'Conditional logic is awesome!'
    }),
    knex('chapters').insert({
      number: 3,
      name: 'Lists and Dictionaries',
      content: 'Lists and Dictionaries are awesome!'
    })
  );
};
