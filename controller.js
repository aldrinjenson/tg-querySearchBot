const bing = require("bing-scraper");

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
        } else {
          const { results } = resp;
          const entries = results.map((item) => {
            const { title, description, url } = item;
            const abstract = description.substring(0, 250) + "...";
            return `${title}\n${abstract}\n${url}\n\n`;
          });
          resolve(entries);
        }
      }
    );
  });
};

module.exports = { getResults };
