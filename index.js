require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { getResults } = require("./controller");
const http = require("http");

////////////////// fix for heroku start//////////////////
const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Bot active");
};
const server = http.createServer(requestListener);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("server listening"));
////////////////// fix for heroku end//////////////////

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.on("polling_error", console.log);
console.log("Up and running..");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `Hi,\nthis bot can help you query the internet directly from Telegram.\nTo use, enter /qs followed by a query\neg: /qs largest animal in the world`;
  bot.sendMessage(chatId, resp);
});

const MAX_RESULTS = 3;

bot.onText(/\/qs (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1] || " ";
  bot.sendMessage(chatId, `Searching for ${query}...`);

  getResults(query).then((results) => {
    for (let i = 0; i < MAX_RESULTS; i++) {
      bot.sendMessage(chatId, results[i]);
    }
  });
});

// bot.on("inline_query", async (msg) => {
//   const query = msg.query;
//   const results = await getSuggestions(query);
//   const suggestions = results.map((text, index) => ({
//     id: index,
//     type: "article",
//     title: text,
//     message_text: `/qs ${text}`,
//   }));

//   bot.answerInlineQuery(msg.id, suggestions);
// });

// bot.on("message", (msg) => {
//   console.log(msg);
//   const query = msg.text;
//   const chatId = msg.chat.id;
//   getResults(query).then((results) => {
//     for (let i = 0; i < MAX_RESULTS; i++) {
//       bot.sendMessage(chatId, results[i]);
//     }
//   });
// });
