require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { getResults } = require("./controller");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.on("polling_error", console.log);
console.log("Up and running..");

bot.sendMessage = async (chatId, text) => {
  const msgText = encodeURI(text); // for accounting for spaces
  try {
    await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${msgText}`
    );
  } catch (err) {
    console.log("Error in sending message: " + err);
  }
};

const MAX_RESULTS = 3;
const main = async (chatId, text) => {
  const words = text?.split(" ");
  const command = words[0];
  const queryTerm = words.slice(1).join(" ");
  if (command === "qs" && !queryTerm.length) {
    return bot.sendMessage(
      chatId,
      "Please enter the query in the following format:\n /qs search_term"
    );
  }
  switch (command) {
    case "/start":
      bot.sendMessage(
        chatId,
        "Hi,\nthis bot can help you query the internet directly from Telegram.\nEnter any query after a /qs for the top 3 results.\neg: /qs Software development best practices\nYou can get the top 1 result using /qs1 search_term\neg: /qs1 Nikola Tesla\nYou can also add this bot to groups and query using the same 2 commands"
      );
      break;
    case "/qs":
      bot.sendMessage(chatId, `Searching for ${queryTerm}...`);
      const results = await getResults(queryTerm);
      for (let i = 0; i < MAX_RESULTS; i++) {
        bot.sendMessage(chatId, results[i]);
      }
      break;
    case "/qs1":
      bot.sendMessage(chatId, `Searching for ${queryTerm}...`);
      const [firstResult] = await getResults(queryTerm);
      bot.sendMessage(chatId, firstResult);
      break;
    default:
      bot.sendMessage(
        chatId,
        "Please enter a valid query using /qs <searchTerm>"
      );
      break;
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log(msg);
  main(chatId, text);
});

module.exports.querySearchBot = async (event) => {
  const body = JSON.parse(event.body);
  const { chat, text } = body.message;
  const chatId = chat.id;
  main(chatId, text);
};
