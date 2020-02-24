const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array if passed an empty array", () => {
    const actual = formatDates([]);
    const expected = [];
    expect(actual).to.deep.equal(expected);
  });
  it("returns a new array which is not a mutation of the input array", () => {
    const firstArray = [];
    const actual = formatDates(firstArray);
    expect(actual).to.not.equal(firstArray);
  });
  it("returns an array of the single object that has its timestamp converted into a javascript date object", () => {
    const actual = formatDates([
      {
        title: "Making sense of Redux",
        topic: "coding",
        author: "jessjelly",
        body:
          "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
        created_at: 1514093931240
      }
    ]);

    const expected = [
      {
        title: "Making sense of Redux",
        topic: "coding",
        author: "jessjelly",
        body:
          "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
        created_at: new Date(1514093931240)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
  it("returns an array of multiple objects that has its timestamp converted into a javascript date object", () => {
    const actual = formatDates([
      {
        title: "Please stop worrying about Angular 3",
        topic: "coding",
        author: "jessjelly",
        body:
          "Another Angular version planned already? Whaaaat? Didn’t Angular 2 just ship? Why Angular 3? What? Why? First off, there is no massive rewrite, and won’t be for Angular 3. Secondly, let me explain the future of Angular 2 and what Angular 3, Angular 4 will mean for you.",
        created_at: 1477282382648
      },
      {
        title:
          "JavaScript’s Apply, Call, and Bind Methods are Essential for JavaScript Professionals",
        topic: "coding",
        author: "grumpy19",
        body:
          "Functions are objects in JavaScript, as you should know by now, if you have read any of the prerequisite articles. And as objects, functions have methods, including the powerful Apply, Call, and Bind methods. On the one hand, Apply and Call are nearly identical and are frequently used in JavaScript for borrowing methods and for setting the this value explicitly. We also use Apply for variable-arity functions; you will learn more about this in a bit.",
        created_at: 1521023259137
      }
    ]);

    const expected = [
      {
        title: "Please stop worrying about Angular 3",
        topic: "coding",
        author: "jessjelly",
        body:
          "Another Angular version planned already? Whaaaat? Didn’t Angular 2 just ship? Why Angular 3? What? Why? First off, there is no massive rewrite, and won’t be for Angular 3. Secondly, let me explain the future of Angular 2 and what Angular 3, Angular 4 will mean for you.",
        created_at: new Date(1477282382648)
      },
      {
        title:
          "JavaScript’s Apply, Call, and Bind Methods are Essential for JavaScript Professionals",
        topic: "coding",
        author: "grumpy19",
        body:
          "Functions are objects in JavaScript, as you should know by now, if you have read any of the prerequisite articles. And as objects, functions have methods, including the powerful Apply, Call, and Bind methods. On the one hand, Apply and Call are nearly identical and are frequently used in JavaScript for borrowing methods and for setting the this value explicitly. We also use Apply for variable-arity functions; you will learn more about this in a bit.",
        created_at: new Date(1521023259137)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
  it("returns an array of the complete object and has its timestamp converted into a javascript date object", () => {
    const actual = formatDates([
      {
        title: "Making sense of Redux",
        topic: "coding",
        author: "jessjelly",
        body:
          "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
        created_at: 1514093931240
      }
    ]);

    const expected = [
      {
        title: "Making sense of Redux",
        topic: "coding",
        author: "jessjelly",
        body:
          "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
        created_at: new Date(1514093931240)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
});

describe.only("makeRefObj", () => {
  it("returns an empty object if passed an empty array", () => {
    const actual = makeRefObj([]);
    const expected = {};
    expect(actual).to.deep.equal(expected);
  });
  it("returns a single reference object with the article's title and article's id as a key-value pair when passed a single array object", () => {
    const articleArr = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const actual = makeRefObj(articleArr);

    const expected = {
      "Eight pug gifs that remind me of mitch": 3
    };

    expect(actual).to.deep.equal(expected);
  });
  it("returns a single reference object with the article's title and article's id as a key-value pair when passed multiple array objects", () => {
    const articleArr = [
      {
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        article_id: 7,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    const actual = makeRefObj(articleArr);

    const expected = {
      A: 6,
      Z: 7
    };

    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original input", () => {
    const articleArr = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];

    const articleArrCopy = articleArr.map(article => {
      return { ...article };
    });

    const actual = makeRefObj(articleArr);

    expect(articleArr).to.deep.equal(articleArrCopy);
  });
});

describe("formatComments", () => {});
