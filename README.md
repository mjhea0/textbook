# Textbook

[![Build Status](https://travis-ci.org/mjhea0/textbook.svg?branch=master)](https://travis-ci.org/mjhea0/textbook)
[![Coverage Status](https://coveralls.io/repos/github/mjhea0/textbook/badge.svg?branch=master)](https://coveralls.io/github/mjhea0/textbook?branch=master)

Just a simple learning management system for textbook-like sites.

[Staging Server](http://textbook-lms.herokuapp.com/).

## Development

### Getting started

1. Generate Express Boilerplate
1. Organize project structure
1. Update and install dependencies
1. Set up server side templates
1. Add flash messaging
1. Write tests
1. Set up Travis CI
1. Add code coverage
1. Add JSHint
1. Deploy to staging server
  - heroku run knex migrate:latest --env staging
  - heroku run knex seed:run --env staging

### User Stories

#### Unregistered

1. Unregistered users should be able to log in via Github
  - Set up postgres databases
  - Add Knex
  - Register app with Github
  - Add [passport](https://github.com/jaredhanson/passport-github)
  - Write tests
  - Update templates
  - Add flash messages
  - Update tests
  - Write more tests

#### Registered

1. Users should be able to view all the chapters
  - Create migration
  - Create seed
  - Add DB query
  - Update view
  - Write tests
  - Deploy
1. Users should be able to view a chapter
  - Create migration
  - Update seed
  - Add DB query
  - Add route
  - Add view
  - Write tests (CURRENT)
  - Deploy
1. User should be redirected to the previous page after sign in
