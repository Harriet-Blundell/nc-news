process.env.NODE_ENV = "test";
const { expect } = require("chai");
const chaiSorted = require("sams-chai-sorted");
const chai = require("chai");
chai.use(chaiSorted);
const request = require("supertest");
const { app } = require("../app");
const connection = require("../db/connection.js");

describe("/api", () => {
  after(() => {
    return connection.destroy();
  });

  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/topics", () => {
    it('GET: responds with status 200 and an array of topic objects which have "slug" and "description" as properties', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body.topics[0]).to.have.keys("slug", "description");
          expect(response.body.topics).to.be.an("array");
        });
    });
  });

  describe("/users/:username", () => {
    it('GET: responds with status 200 and returns an object with "username", "avatar_url", and "name" as properties and the users details when passed a username', () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(response => {
          expect(response.body.user).to.be.an("object");
          expect(response.body.user).to.have.keys(
            "username",
            "avatar_url",
            "name"
          );
        });
    });
    it("GET ERROR: 404 responds with an error and appropriate message when passed a username that does not exist", () => {
      return request(app)
        .get("/api/users/jack_roberts")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Username not found");
        });
    });
    it("GET ERROR: 400 responds with an error and appropriate message when passed an invalid parameter as username", () => {
      return request(app)
        .get("/api/users/999")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    it("GET: 200, responds with an article object when passed an article id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );

          expect(response.body.article.comment_count).to.equal(13);
        });
    });
    it("GET ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/900")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET ERROR: 400 responds with an error and appropriate message when passed an invalid parameter", () => {
      return request(app)
        .get("/api/articles/notANumber")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH: 201, responds with the updated article when passed an article_id with an indication to how much the votes property in the database should be updated by on the request body", () => {
      const newVote = {
        inc_votes: 1
      };

      return request(app)
        .patch("/api/articles/4")
        .send(newVote)
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article.votes).to.equal(newVote.inc_votes);
        });
    });
    it("PATCH: 200, responds with the array article object with the votes property unchanged when passed a request body that is empty", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article.votes).to.equal(1);
        });
    });
    it("PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid value e.g. string instead of a number on the request body", () => {
      const newVote = {
        inc_votes: "banana"
      };

      return request(app)
        .patch("/api/articles/7")
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id", () => {
      const newVote = {
        inc_votes: 7
      };

      return request(app)
        .patch("/api/articles/900")
        .send(newVote)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("ID not found");
        });
    });
    it("PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid parameter", () => {
      const newVote = {
        inc_votes: 11
      };

      return request(app)
        .patch("/api/articles/banana")
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
  });

  describe("POST: /:articles_id/comments", () => {
    it("POST: 201 posts a new comment in the comments table when passed an article id and a request body with username, and body inside", () => {
      return request(app)
        .post("/api/articles/9/comments")
        .send({
          username: "butter_bridge",
          body: "I am trying to make a post request"
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.all.keys(
            "author",
            "comment_id",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment).to.be.an("object");
        });
    });
    it("POST ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent article id", () => {
      return request(app)
        .post("/api/articles/99/comments")
        .send({
          username: "butter_bridge",
          body: "I am testing my error handling skills"
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not Found");
        });
    });
    it("POST ERROR: 404 responds with an error and appropriate message when passed a invalid parameter in as a value on the username property in the request body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          username: 500,
          body: "I hope this fails"
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not Found");
        });
    });
    it("POST ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent username on the request body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "not_a_real_username",
          body: "I really hope this fails"
        })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not Found");
        });
    });
    it("POST ERROR: 400 responds with an error and appropriate message when passed a request body without username as a property", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          name: "butter_bridge",
          body: "Coding is fun"
        })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
    it("POST ERROR: responds with an error and appropriate message when passed a request body that does not include username", () => {
      return request(app)
        .post("/api/articles/7/comments")
        .send({
          body: "Hello World"
        })
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
  });

  describe.only("GET: /:article_id/comments", () => {
    it("GET: 200, responds with an array of comments for the given article_id that is sorted by the column specified", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author&order_by=asc")
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.be.an("object");

          expect(response.body.comments[0]).to.include.all.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
          expect(response.body.comments).to.be.sortedBy("author");
        });
    });
    it("GET: 200, responds with an array of comments for the given article_id that takes an order by query", () => {
      return request(app)
        .get("/api/articles/1/comments?order_by=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET: 200, responds with an array of comments for the given article_id that takes a sort by and order by query", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=votes&order_by=asc")
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.be.an("object");
          expect(response.body.comments).to.be.sortedBy("votes", {
            descending: false
          });
        });
    });
    it("GET: 200, responds with an array of comments for the given article_id that is ordered by the sort_by default and order by default if passed no specific values", () => {
      return request(app)
        .get("/api/articles/5/comments?sort_by&order_by")
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.be.an("object");
          expect(response.body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET ERROR: 400 responds with an error and appropriate message when passed invalid query keys", () => {
      return request(app)
        .get("/api/articles/1/comments?notAQuery=author&notAnOrderQuery=asc")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Not a valid query");
        });
    });
    it("GET ERROR: 400 responds with an error and appropriate message when passed a valid query but non-existent column and order by that is not asc or desc", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=food&order_by=sideways")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
  });

  xdescribe("/api/articles", () => {
    it("GET: 200 responds with an array of article objects when passed ", () => {});
  });

  describe("PATCH: /api/comments/:comment_id", () => {
    it("PATCH: 201, responds with the updated comment when passed a comment_id with an indication to how much the votes property in the database should be updated by on the request body", () => {
      const updateComment = {
        inc_votes: 1
      };

      return request(app)
        .patch("/api/comments/3")
        .send(updateComment)
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment).to.include.all.keys([
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          ]);
          expect(response.body.comment.votes).to.equal(101);
        });
    });
    it("PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid value e.g. string instead of a number on the request body", () => {
      const newVote = {
        inc_votes: "banana"
      };

      return request(app)
        .patch("/api/comments/7")
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH ERROR: 404 responds with an error and appropriate message when passed a valid but non-existent id", () => {
      const newVote = {
        inc_votes: 7
      };

      return request(app)
        .patch("/api/comments/9999")
        .send(newVote)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not Found");
        });
    });
    it("PATCH ERROR: 400 responds with an error and appropriate message when passed an invalid parameter", () => {
      const newVote = {
        inc_votes: 11
      };

      return request(app)
        .patch("/api/comments/banana")
        .send(newVote)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
  });
});

// DO PROMISE.ALL IN CASE THE CLIENT REQUEST ROUTES THAT ARE NOT ALLOWED!
// e.g. Method not allowed
