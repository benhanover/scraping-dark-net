module.exports.getAuthor = (str) => {
  let author = str.trim().slice(10, -29);
  if ((author === 'Guest' || author === 'UnKnown', author === 'Anonymous'))
    return 'Anonymous';
  return author;
};

module.exports.getDate = (str) => {
  const strDate = str.trim().slice(23, -4);
  const finalDate = {
    date: new Date(strDate),
    dateStr: new Date(strDate).toUTCString(),
  };
  return finalDate;
};

module.exports.getTitle = (str) => {
  return str.trim();
};

module.exports.getContent = ($, $paste) => {
  const content = [];
  $paste('.text ol li div').each((i, elem) => {
    content.push($(elem).text());
  });
  return content;
};
