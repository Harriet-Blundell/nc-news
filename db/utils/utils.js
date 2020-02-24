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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
