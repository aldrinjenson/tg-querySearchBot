require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

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
// });

bot.onText(/\/qs/, (msg, match) => {
  const chatId = msg.chat.id;
  // const query =  match[1];
  const query = "largest animal in the world";
  axios
    .get(
      `https://api.wolframalpha.com/v1/result?i=${query}%3F&appid=${process.env.APP_ID}`
    )
    .then((res) => {
      bot.sendMessage(res.data);
      console.log(res.data);
    })
    .catch((err) => console.log(err));
});
