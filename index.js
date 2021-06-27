require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { getResults } = require("./controller");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.on("polling_error", console.log);
console.log("Hello world!");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `Hi,\nthis bot can search and find short answers for your queries.\nTo use, enter /qs followed by your query\neg: /qs largest animal in the world`;
  bot.sendMessage(chatId, resp);
});

bot.on("inline_query", (query) => {
  console.log(query);
  bot.sendMessage;
});

// bot.onText(/\/qs/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(
//     chatId,
//     "Inavlid command format\nPlease enter /play song name\neg: /play hello adele"
//   );
// })

// bot.addListener("inline_query", (query) => {
//   // console.log(query);
//   // get suggestions here
//   bot.sendMessage(query.from.id, "hi");
// });

const MAX_RESULTS = 3;

bot.onText(/\/qs (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1] || "largest animal in the world";
  bot.sendMessage(chatId, "Searching..");

  getResults(query).then((results) => {
    for (let i = 0; i < MAX_RESULTS; i++) {
      bot.sendMessage(chatId, results[i]);
    }
  });
});
