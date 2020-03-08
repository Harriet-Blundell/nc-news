# Northcoders News API

## Contents:

- General Information
- Getting Started
- Prerequisites
- Installing
- Running the tests
- Deployment
- Built With
- RESTful API
- Acknowledgements

## General Information:

My Northcoders News project is a RESTful API that will function as my back-end.

It will serve as a social news aggregate website where users can rate content and have discussions in the style of Reddit.

For this project, I used PostgreSQL database to store the data and interacted with it by using Knex.js for query building and migrations.

The link to my Heroku API is: http://harrietblundell-be-nc-news.herokuapp.com/api

## Step 1 - Getting Started:

This section will explain how you can get a copy of this repository to run on your machine.

Firstly, you will need to fork this repository, clone it to your machine and then open it up in your chosen code editor in your terminal.

In your terminal:

```bash
git clone <link>

cd <name of folder>
```

## Step 2 - Prerequisites:

In order to get started, you will need Node.js and NPM installed on your machine.

If you are unsure about whether you have these installed, type the following command into your terminal:

```bash
node -v
npm -v
```

If both of these commands show a version number, then you have them installed, if not then go into your terminal and type:

```bash
sudo apt install nodejs
sudo apt install npm
```

Once all you have installed Node.js and NPM, type in the following command in your terminal:

- This will create a package.json file for this project

```bash
npm init -y
```

After this has been installed, type in the following command in your terminal:

```bash
npm i
```

The above command will install the following Node modules that are required for this project:

```bash
cors v2.8.5
express v4.17.1
knex v0.20.4
pg v7.14.0
chai v4.2.0
chai-sorted v0.2.0
mocha v6.2.2
nodemon v2.0.1
supertest v4.0.2
```

## Step 3 - Running the tests:

Run the following command in your terminal to test all of the endpoints:

```bash
npm test
```

## Step 4 - Built With:

- JavaScript
- PostgreSQL database - Used to create the database
- Knex - Used for migrations and query building
- Heroku

## Deployment:

I used Heroku because it allowed for easy database integration and a service that I could push my code to, build it, and host my API.

## Step 5 - RESTful API:

This section will explain all the available endpoints in this RESTful API.

```bash
GET /api/topics
POST /api/topics

GET /api/users
POST /api/users
GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles
POST /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

---

Below will show examples of what the endpoints will respond with when you make a request:

```bash
GET /api/topics - GET all the topics
```

Responds with an array of topic objects:

```bash
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}
```

---

```bash
POST /api/topics - Create a new topic
```

Request body example:

```bash
const newTopic = {
        slug: 'the French Revolution',
        description: 'Started in 1789'
      };
```

Responds with an array object of the new topic object:

```bash
{
  topic: [ { slug: 'the French Revolution', description: 'Started in 1789' } ]
}
```

---

```bash
GET /api/users - GET all the users
```

Responds with an array of user objects:

```bash
{
  users: [
    {
      username: 'butter_bridge',
      avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      name: 'jonny'
    }
]
}
```

---

```bash
POST /api/users - Create a new user
```

Request body example:

```bash
const newUser = {
        username: 'pools',
        avatar_url: 'https://www.pool_s.com',
        name: 'Sam Pool'
      };
```

Responds with an array of the new user object:

```bash
{
  user: [
    {
      username: 'pools',
      avatar_url: 'https://www.pool_s.com',
      name: 'Sam Pool'
    }
  ]
}
```

---

```bash
GET /api/users/:username - GET a user by their username
```

Responds with an array of the username object:

```bash
{
  user: {
    username: 'butter_bridge',
    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
    name: 'jonny'
  }
}
```

---

```bash
GET - /api/articles/:article_id - GET an article by an article id e.g. 1
```

Responds with an object of the article id requested:

```bash
{
  article: {
    article_id: 1,
    title: 'Living in the shadow of a great man',
    body: 'I find this existence challenging',
    votes: 100,
    topic: 'mitch',
    author: 'butter_bridge',
    created_at: '2018-11-15T12:21:54.171Z',
    comment_count: '13'
  }
}
```

---

```bash
PATCH - /api/articles/:article_id - Update an articles vote property when passed an article id e.g. 4
```

Request body exmaple:

```bash
const newVote = {
        inc_votes: 1
      };
```

Responds with an object with the article's vote property updated:

```bash
{
  article: {
    article_id: 4,
    title: 'Student SUES Mitch!',
    body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
    votes: 1,
    topic: 'mitch',
    author: 'rogersop',
    created_at: '2006-11-18T12:21:54.171Z'
  }
}
```

---

```bash
DELETE - /api/articles/:article_id - Deletes an article when passed an article id e.g. 1
```

Responds with no body because it should have been removed from the database.

---

```bash
POST - /api/articles/:article_id/comments - Create a new comment when passed an article id
```

Request body example:

```bash
{
    username: 'butter_bridge',
    body: 'I am trying to make a post request'
}
```

---

```bash
GET - /api/articles/:article_id/comments?sort_by=author&order=asc' - GET an article id comments and sort by a specific property in asc or desc
```

Responds with an array of the comment objects:

```bash
{
  comments: [
    {
      comment_id: 2,
      votes: 14,
      created_at: '2016-11-22T12:36:03.389Z',
      author: 'butter_bridge',
      body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
    }]
}
```

---

```bash
GET - /api/articles - GET all articles
```

Responds with an array of the article objects:

```bash
{
  articles: [
    {
      author: 'butter_bridge',
      title: 'Living in the shadow of a great man',
      article_id: 1,
      topic: 'mitch',
      created_at: '2018-11-15T12:21:54.171Z',
      votes: 100,
      comment_count: '13'
    },
    {
      author: 'icellusedkars',
      title: 'Sony Vaio; or, The Laptop',
      article_id: 2,
      topic: 'mitch',
      created_at: '2014-11-16T12:21:54.171Z',
      votes: 0,
      comment_count: '0'
    }
  ]
}
```

Note: If you request an author or topic that exists but does not exist in the comments table, you will receive an empty array.

---

```bash
PATCH - /api/comments/:comment_id - Update a particular comments vote property when a comment id
```

Request body example:

```bash
const updateComment = {
        inc_votes: 1
      };
```

Responds with a comment object of the vote property updated:

```bash
{
  comment: {
    comment_id: 3,
    author: 'icellusedkars',
    article_id: 1,
    votes: 101,
    created_at: '2015-11-23T12:36:03.389Z',
    body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.'
  }
}
```

---

```bash
DELETE - /api/comments/:comment_id - Deletes a comment when passed a comment id
```

Responds with no body because it should have been removed from the database.

---

```bash
GET - /api
```

Responds with an array object of all the available endpoints and a description about what each one does:

```bash
{
  description: {
    'GET /api': {
      description: 'serves up a json representation of all the available endpoints of the api'
    }
  }
}
```

---

## Acknowledgements:

Thank you to Northcoders for helping me build my first API
