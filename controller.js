const bing = require("bing-scraper");

const getSuggestions = (query) => {
  return new Promise((resolve, reject) => {
    bing.suggest(query, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const MAX_LENGTH = 250; // max charachters in description
const truncateText = (text = "") => {
  let res = text;
  if (text.length > MAX_LENGTH) {
    res = text.substring(0, MAX_LENGTH) + "...";
  }
  return res;
};

const getResults = (query) => {
  return new Promise((resolve, reject) => {
    bing.search(
      {
        q: query,
        enforceLanguage: true,
      },
      (err, resp) => {
        if (err) {
          reject(err);
        }
        const { results } = resp;
        const entries = results.map((item) => {
          const { title, description, url } = item;
          const abstract = truncateText(description);
          return `${title}\n${abstract}\n${url}\n\n`;
        });
        resolve(entries);
      }
    );
  });
};

module.exports = { getResults, getSuggestions };
