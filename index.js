require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const { getResults } = require("./controller");
const axios = require("axios");
const BOT_TOKEN = process.env.BOT_TOKEN;
console.log("Up and running..");
const TelegramBot = require("node-telegram-bot-api");

// // For testing purposes
// const bot = new TelegramBot(BOT_TOKEN, { polling: true });
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;
//   console.log(msg);
//   main(chatId, text);
// });

const bot = {};
bot.sendMessage = async (chatId, text) => {
  try {
    const fixedEncodeURI = (str) => {
      return encodeURI(str).replace(/%5B/g, "[").replace(/%5D/g, "]");
    };
    const msgText = fixedEncodeURI(text) || text; // for accounting for spaces
    return await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${msgText}`
    );
  } catch (err) {
    console.log("Error in sending message: " + err);
  }
};

const MAX_RESULTS = 3;
const main = async (chatId, text) => {
  if (!text) return await bot.sendMessage(chatId, "Text empty");
  const words = text.split(" ");
  const command = words[0];
  const queryTerm = words.slice(1).join(" ");
  if (command === "qs" && !queryTerm.length) {
    return await bot.sendMessage(
      chatId,
      "Please enter the query in the following format:\n /qs search_term"
    );
  }
  switch (command) {
    case "/start":
      await bot.sendMessage(
        chatId,
        "Hi,\nthis bot can help you query the internet directly from Telegram.\nEnter any query after a /qs for the top 3 results.\neg: /qs Software development best practices\nYou can get the top 1 result using /qs1 search_term\neg: /qs1 Nikola Tesla\nYou can also add this bot to groups and query using the same 2 commands"
      );
      break;
    case "/qs":
      await bot.sendMessage(chatId, `Searching for ${queryTerm}...`);
      const results = await getResults(queryTerm);
      for (let i = 0; i < MAX_RESULTS; i++) {
        await bot.sendMessage(chatId, results[i]);
      }
      break;
    case "/qs1":
      await bot.sendMessage(chatId, `Searching for ${queryTerm}...`);
      const [firstResult] = await getResults(queryTerm);
      await bot.sendMessage(chatId, firstResult);
      break;
    default:
      await bot.sendMessage(
        chatId,
        "Please enter a valid query using /qs <searchTerm>"
      );
      break;
  }
};

module.exports.querybot = async (event) => {
  let err = null;
  if (event.body) {
    const body = JSON.parse(event.body);
    const { chat, text } = body.message;
    const chatId = chat.id;
    await main(chatId, text);
  } else {
    err = "no event.body";
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "bot active",
      err,
    }),
  };
};
module.exports.ping = async () => {
  await bot.sendMessage(process.env.TEST_USER_TGID, "Pong");
  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "Bot active",
      time: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Calcutta",
      }),
    }),
  };
};
