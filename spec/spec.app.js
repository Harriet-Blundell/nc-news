process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const chaiSorted = require('sams-chai-sorted');
const chai = require('chai');
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection.js');

describe('/api', () => {
  after(() => {
    return connection.destroy();
  });

  beforeEach(() => {
    return connection.seed.run();
  });
  describe('GET and POST: all topics - /api/topics', () => {
    it('GET: responds with status 200 and an array of topic objects which have "slug" and "description" as properties', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body.topics[0]).to.have.keys(['slug', 'description']);
          expect(response.body.topics).to.be.an('array');
        });
    });
    it('POST: 200, responds with a new topic created', () => {
      const newTopic = {
        slug: 'the French Revolution',
        description: 'Started in 1789'
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('topic');
          expect(response.body.topic).to.be.an('array');
          expect(response.body.topic[0]).to.be.an('object');

          response.body.topic.forEach(keys => {
            expect(keys).to.include.all.keys(['slug', 'description']);
          });
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when the request body does not have a correct property', () => {
      const newTopic = {
        topicIdea: 'History',
        description: 'Civil Rights Movement'
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when the request body is empty', () => {
      return request(app)
        .post('/api/topics')
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/topics')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('GET AND POST: all users - /api/users', () => {
    it('GET: 200, responds with all users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('users');
          expect(response.body.users).to.be.an('array');
          expect(response.body.users[0]).to.include.all.keys([
            'username',
            'avatar_url',
            'name'
          ]);
        });
    });
    it('POST: 201 responds with a new user', () => {
      const newUser = {
        username: 'pools',
        avatar_url: 'https://www.pool_s.com',
        name: 'Sam Pool'
      };

      return request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .then(response => {
          expect(response.body).to.have.key('user');
          expect(response.body.user[0]).to.include.all.keys([
            'username',
            'avatar_url',
            'name'
          ]);
          expect(response.body.user).to.be.an('array');
          expect(response.body.user[0]).to.be.an('object');
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when given wrong property names in the request body', () => {
      const newUser = {
        notARealColumnName: 'ReecesPieces',
        avatar_url: 'https://www.reeceyboy.com',
        name: 'Reece'
      };

      return request(app)
        .post('/api/users')
        .expect(400)
        .send(newUser)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when the request body is empty', () => {
      return request(app)
        .post('/api/users')
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/users')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('GET: users by username - /api/users/:username', () => {
    it('GET: responds with status 200 and returns an object with "username", "avatar_url", and "name" as properties and the users details when passed a username', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(response => {
          expect(response.body.user).to.be.an('object');
          expect(response.body.user).to.have.keys([
            'username',
            'avatar_url',
            'name'
          ]);
        });
    });
    it('GET ERROR: 404 responds with an error and appropriate message when passed a username that does not exist', () => {
      return request(app)
        .get('/api/users/jack_roberts')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Username not found');
        });
    });
    it('GET ERROR: 400 responds with an error and appropriate message when passed an invalid parameter as username', () => {
      return request(app)
        .get('/api/users/999')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/users/butter_bridge')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('GET, PATCH and DELETE: articles by articles_id - /api/articles/:article_id', () => {
    it('GET: 200, responds with an article object when passed an article id', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys([
            'author',
            'title',
            'article_id',
            'body',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          ]);

          expect(response.body).to.have.key('article');
          expect(response.body.article).to.be.an('object');
          expect(response.body.article.comment_count).to.equal('13');
        });
    });
    it('GET ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id', () => {
      return request(app)
        .get('/api/articles/900')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article ID not found');
        });
    });
    it('GET ERROR: 400 responds with an error and appropriate message when passed an invalid parameter', () => {
      return request(app)
        .get('/api/articles/notANumber')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('PATCH: 200, responds with the updated article when passed an article_id with an indication to how much the votes property in the database should be updated by on the request body', () => {
      const newVote = {
        inc_votes: 1
      };

      return request(app)
        .patch('/api/articles/4')
        .send(newVote)
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('article');
          expect(response.body.article).to.be.an('object');
          expect(response.body.article.votes).to.equal(1);
        });
    });
    it('PATCH: 200, responds with the array article object with the votes property unchanged when passed a request body that is empty', () => {
      return request(app)
        .patch('/api/articles/2')
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('article');
          expect(response.body).to.be.an('object');
          expect(response.body.article.votes).to.equal(0);
        });
    });
    it('PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid value e.g. string instead of a number on the request body', () => {
      const newVote = {
        inc_votes: 'banana'
      };

      return request(app)
        .patch('/api/articles/7')
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('PATCH ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id', () => {
      const newVote = {
        inc_votes: 7
      };

      return request(app)
        .patch('/api/articles/900')
        .send(newVote)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article ID not found');
        });
    });
    it('PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid parameter', () => {
      const newVote = {
        inc_votes: 11
      };

      return request(app)
        .patch('/api/articles/banana')
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('DELETE: 204 deletes an article when passed an article id and responds with no content', () => {
      return request(app)
        .delete('/api/articles/1')
        .expect(204);
    });
    it('DELETE ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent article id', () => {
      return request(app)
        .delete('/api/articles/900')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Article ID Not Found');
        });
    });
    it('DELETE ERROR: 400 responds with an error and appropriate message when passed invalid parameter', () => {
      return request(app)
        .delete('/api/articles/notAValidId')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['put', 'post'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/3')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('POST: comments by article_id - /:articles_id/comments', () => {
    it('POST: 201 posts a new comment in the comments table when passed an article id and a request body with username, and body inside', () => {
      return request(app)
        .post('/api/articles/9/comments')
        .send({
          username: 'butter_bridge',
          body: 'I am trying to make a post request'
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.all.keys([
            'author',
            'comment_id',
            'article_id',
            'votes',
            'created_at',
            'body'
          ]);
          expect(response.body.comment).to.be.an('object');
        });
    });
    it('POST ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent article id', () => {
      return request(app)
        .post('/api/articles/99/comments')
        .send({
          username: 'butter_bridge',
          body: 'I am testing my error handling skills'
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Not Found');
        });
    });
    it('POST ERROR: 404 responds with an error and appropriate message when passed a invalid parameter in as a value on the username property in the request body', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          username: 500,
          body: 'I hope this fails'
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Not Found');
        });
    });
    it('POST ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent username on the request body', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({
          username: 'not_a_real_username',
          body: 'I really hope this fails'
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Not Found');
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when passed a request body without username as a property', () => {
      return request(app)
        .post('/api/articles/5/comments')
        .send({
          name: 'butter_bridge',
          body: 'Coding is fun'
        })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('POST ERROR: responds with an error and appropriate message when passed a request body that does not include username', () => {
      return request(app)
        .post('/api/articles/7/comments')
        .send({
          body: 'Hello World'
        })
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/1/comments')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('GET: comments by article_id - /:article_id/comments', () => {
    it('GET: 200, responds with an array of comments for the given article_id that is sorted by the column specified', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=author&order=asc')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('comments');
          expect(response.body.comments).to.be.an('array');
          expect(response.body.comments[0]).to.be.an('object');
          expect(response.body.comments[0]).to.include.all.keys([
            'comment_id',
            'votes',
            'created_at',
            'author',
            'body'
          ]);
          expect(response.body.comments).to.be.sortedBy('author');
        });
    });
    it('GET: 200, responds with an array of comments for the given article_id that takes an order by query', () => {
      return request(app)
        .get('/api/articles/1/comments?order=asc')
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.an('array');
          expect(response.body).to.be.an('object');
          expect(response.body.comments).to.be.sortedBy('created_at', {
            descending: false
          });
        });
    });
    it('GET: 200, responds with an array of comments for the given article_id that takes a sort by and order by query', () => {
      return request(app)
        .get('/api/articles/9/comments?sort_by=votes&order=asc')
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.an('array');
          expect(response.body.comments[0]).to.be.an('object');
          expect(response.body.comments).to.be.sortedBy('votes', {
            descending: false
          });
        });
    });
    it('GET: 200, responds with an array of comments for the given article_id that is ordered by the sort_by default and order by default if passed no specific values', () => {
      return request(app)
        .get('/api/articles/5/comments')
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.an('array');
          expect(response.body.comments[0]).to.be.an('object');
          expect(response.body.comments).to.be.sortedBy('created_at', {
            descending: true
          });
        });
    });
    it('GET: 200, responds with an empty array when passed an article id that exists but not in the comments table', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.deep.equal([]);
        });
    });
    it('GET ERROR: 404 responds with an error and appropriate message when passed valid id, but does not exist in the comments or any other tables', () => {
      return request(app)
        .get('/api/articles/900/comments')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('article not found');
        });
    });
    it('GET ERROR: 400 responds with an error and appropriate message when passed an invalid id', () => {
      return request(app)
        .get('/api/articles/notAValidId/comments')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('GET ERROR: 400 responds with an error and appropriate message when passed invalid query keys', () => {
      return request(app)
        .get('/api/articles/1/comments?notAQuery=author&notAnOrderQuery=asc')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Not a valid query');
        });
    });
    it('GET ERROR: 400 responds with an error and appropriate message when passed a valid query but non-existent column and order by that is not asc or desc', () => {
      return request(app)
        .get('/api/articles/9/comments?sort_by=food&order=sideways')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/1/comments')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('GET and POST: all articles - /api/articles', () => {
    it('GET: 200 responds with an array of all article objects with a comment count in the object', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles[0]).to.include.all.keys([
            'author',
            'title',
            'article_id',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          ]);

          response.body.articles.forEach(countComment => {
            expect(countComment.comment_count).to.equal(
              countComment.comment_count
            );
          });

          expect(response.body).to.have.key('articles');

          expect(response.body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
        });
    });
    it('GET: 200, responds with an array of all article objects that is sorted by the topic', () => {
      return request(app)
        .get('/api/articles?sort_by=topic')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.sortedBy('topic', {
            descending: true
          });
        });
    });
    it('GET: 200, responds with an array of all article objects that is sorted by author in descending order', () => {
      return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('articles');
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.sortedBy('author', {
            descending: true
          });
        });
    });
    it('GET: 200, responds with an array of all article objects that is ordered by asc', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('articles');
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.sortedBy('created_at', {
            descending: false
          });
        });
    });
    it('GET: 200, responds with an array of all article objects that is filtered by username specified in the query', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.sortedBy('author');
        });
    });
    it('GET: 200, responds with an array of all article objects that is filter by the topics specified in the query', () => {
      return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.sortedBy('topics');
        });
    });
    it('GET: 200, responds with an empty array when passed an author that does exist, but does not have any articles', () => {
      return request(app)
        .get('/api/articles?author=lurker')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.deep.equal([]);
        });
    });
    it('GET: 200, responds with an empty array when passed a topic that does exist, but does not have any articles', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.deep.equal([]);
        });
    });
    it('GET: 200, responds with an array of all article objects that is filtered by author and topic queries', () => {
      return request(app)
        .get('/api/articles?author=rogersop&topic=cats')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('articles');
          expect(response.body.articles).to.be.an('array');
          expect(response.body.articles).to.be.sortedBy('author', 'topic', {
            descending: false
          });
        });
    });
    it('GET: 200 responds with an array of all article objects when passed a valid author and topic', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge&topic=mitch')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.an('array');
        });
    });
    it('GET 200 responds with an empty array when passed an author that exists but does not match the topic passed in', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge&topic=banana')
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.deep.equal([]);
        });
    });
    it('GET ERROR: 400 responds with an error and appropriate message when passed invalid query keys', () => {
      return request(app)
        .get('/api/articles?notAQuery=author')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Not a valid query');
        });
    });
    it('GET ERROR: 404 responds with an error and appropriate message when passed an author that does not exist', () => {
      return request(app)
        .get('/api/articles?author=noface')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('user not found');
        });
    });
    it('GET ERROR: 404 responds with an error and appropriate message when passed a topic that does not exist', () => {
      return request(app)
        .get('/api/articles?topic=brusselsprouts')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('topic not found');
        });
    });
    it('POST: 201 responds with a new article when passed in the correct properties in the request body', () => {
      const newArticle = {
        author: 'butter_bridge',
        title: 'Coding is fun',
        topic: 'paper',
        body: 'This is a test to post a new article'
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(response => {
          expect(response.body).to.have.key('article');
          expect(response.body.article).to.be.an('array');
          expect(response.body.article[0]).to.be.an('object');

          response.body.article.forEach(keys => {
            expect(keys).to.include.all.keys([
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at'
            ]);
          });
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when given wrong property names in the request body', () => {
      const newArticle = {
        author: 'butter_bridge',
        title: 'Coding is fun',
        incorrectProperty: 'paper',
        bodyProperty: 'This is a test to post a new article'
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('POST ERROR: 404 responds with an error and appropriate message when a property has a valid but non-existent topic and author', () => {
      const newArticle = {
        author: 'butter_bridge',
        title: 'Coding is fun',
        topic: 'food',
        body: 'This is a test to post a new article'
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Not Found');
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when a property is missed from the request body', () => {
      const newArticle = {
        author: 'butter_bridge',
        topic: 'mitch',
        body: 'This is an error test'
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('POST ERROR: 400 responds with an error and appropriate message when no information is placed in the request body', () => {
      return request(app)
        .post('/api/articles')
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['put', 'delete', 'patch'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('PATCH: comment by comment_id - /api/comments/:comment_id', () => {
    it('PATCH: 200, responds with the updated comment when passed a comment_id with an indication to how much the votes property in the database should be updated by on the request body', () => {
      const updateComment = {
        inc_votes: 1
      };

      return request(app)
        .patch('/api/comments/3')
        .send(updateComment)
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.be.an('object');
          expect(response.body.comment).to.include.all.keys([
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          ]);
          expect(response.body.comment.votes).to.equal(101);
        });
    });
    it('PATCH: 200, responds with the array article object with the votes property unchanged when passed a request body that is empty', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.be.an('object');
          expect(response.body.comment.votes).to.equal(16);
        });
    });
    it('PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid value e.g. string instead of a number on the request body', () => {
      const newVote = {
        inc_votes: 'banana'
      };

      return request(app)
        .patch('/api/comments/7')
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('PATCH ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id', () => {
      const newVote = {
        inc_votes: 7
      };

      return request(app)
        .patch('/api/comments/9999')
        .send(newVote)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Comment ID Not Found');
        });
    });
    it('PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid parameter', () => {
      const newVote = {
        inc_votes: 11
      };

      return request(app)
        .patch('/api/comments/banana')
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['post', 'get', 'put'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/comments/1')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('DELETE: comment by comment_id - /comments/:comment_id', () => {
    it('DELETE: 204, deletes the comment when passed a comment id and responds with no content', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
    it('DELETE ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id', () => {
      return request(app)
        .delete('/api/comments/900')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Comment ID Not Found');
        });
    });
    it('DELETE ERROR: 400 responds with an error and appropriate message when passed an invalid parameter', () => {
      return request(app)
        .delete('/api/comments/notAnId')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['post', 'get', 'put'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/comments/1')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('GET: /api', () => {
    it('GET: 200, responds with the endpoints.json', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(response => {
          expect(response.body.description).to.be.an('object');
        });
    });
    it('Status: 405 method not allowed', () => {
      const invalidMethods = ['post', 'delete', 'put', 'patch'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
