require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const bing = require("bing-scraper");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.on("polling_error", console.log);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `Hi,\nthis bot can search and find short answers for your queries.\nTo use, enter /qs followed by your qury\neg: /qs largest animal in the world`;
  bot.sendMessage(chatId, resp);
});

// bot.onText(/\/qs/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(
//     chatId,
//     "Inavlid command format\nPlease enter /play song name\neg: /play hello adele"
//   );
// })

bot.addListener('inline_query',query=>{
  console.log(query)
})

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
          const entries = results.map(item=>{
            const { title, description, url } = item;
            const abstract = description.substring(0, 250) + "...";
            return `${title}\n${abstract}\n${url}\n\n`;
          })
          resolve(entries)
        }
      }
    );
  });
};

const MAX_RESULTS = 3

bot.onText(/\/qs (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1] || "largest animal in the world";
  bot.sendMessage(chatId, "Searching..");

  getResults(query).then((results) => {
    for(let i = 0; i < MAX_RESULTS; i ++){
      bot.sendMessage(chatId, results[i]);
    }
  });
});
