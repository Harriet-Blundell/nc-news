exports.formatDates = list => {
  if (list.length === 0) {
    return [];
  }

  const formattedDates = [];

  list.forEach(articleObj => {
    formattedDates.push({ ...articleObj });
  });

  formattedDates.forEach(newArticleObj => {
    newArticleObj.created_at = new Date(newArticleObj.created_at);
    delete formattedDates.created_at;
  });

  return formattedDates;
};

exports.makeRefObj = list => {
  if (list.length === 0) {
    return {};
  }

  const newRefArr = [];

  list.forEach(articleArr => {
    newRefArr.push({ ...articleArr });
  });

  const refObj = {};

  newRefArr.forEach(articles => {
    refObj[articles.title] = articles.article_id;
    delete articles.title;
  });

  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) {
    return [];
  }

  const newComments = [];

  comments.forEach(originalObj => {
    newComments.push({ ...originalObj });
  });

  newComments.forEach(commentObj => {
    commentObj.author = commentObj.created_by;
    commentObj.article_id = articleRef[commentObj.belongs_to];
    commentObj.created_at = new Date(commentObj.created_at);
    delete commentObj.created_by;
    delete commentObj.belongs_to;
  });

  return newComments;
};
