# tg-querySearchBot

### A bot for querying the internet directly from Telegram, written in nodeJS

Enter any query after a /qs for the top 3 results.
eg: /qs Software development best practices

You can get the top 1 result using /qs1 search_term
eg: /qs1 Nikola Tesla

You can also add this bot to groups and query using the same 2 commands

To try, check out [@querySearchBot](https://t.me/querySearchBot)

### Development

- The bot runs using serverless framework in AWS Lambda with Telegram webhooks
- For setting up webooks easily, refer this [article](https://xabaras.medium.com/setting-your-telegram-bot-webhook-the-easy-way-c7577b2d6f72)
  OR
  - GET webhook info: https://api.telegram.org/bot{my_bot_token}/getWebhookInfo
  - SET Webhook: https://api.telegram.org/bot(mytoken)/setWebhook?url=https://mywebpagetorespondtobot/mymethod
  - Delete Webhook: https://api.telegram.org/bot{my_bot_token}/deleteWebhook
- Note: Serverless Lambda supports only NodeJS v12 for now. Any later features like conditional chaining in later versions of node is not currently supported.
