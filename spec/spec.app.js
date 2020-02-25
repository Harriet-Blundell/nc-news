process.env.NODE_ENV = "test";
const { expect } = require("chai");
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
    it("GET ERROR: 400 responds with an error and appropriate message when passed a number as username", () => {
      return request(app)
        .get("/api/users/999")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad Request");
        });
    });
  });

  describe.only("/api/articles/:article_id", () => {
    it("GET: 200 responds with an article object when passed an article id", () => {
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
    it("GET ERROR: 404 responds with an error and appropriate message when passed an article id that does not exist", () => {
      return request(app)
        .get("/api/articles/900")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("404 not found");
        });
    });
    it("GET ERROR: 400 responds with an error and appropriate message when passed an article id that is not a number", () => {
      return request(app)
        .get("/api/articles/notANumber")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("400 Bad Request");
        });
    });
  });
});
