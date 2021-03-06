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
  - GET webhook info: https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo
  - SET Webhook: https://api.telegram.org/bot{BOT_TOKEN}/setWebhook?url={POST_url_received_after_lambda_deployment}
  - Delete Webhook: https://api.telegram.org/bot{BOT_TOKEN}/deleteWebhook

#### Some gotchas to keep in mind

- Serverless Lambda supports only NodeJS v12 for now. Any later features like conditional chaining in later versions of node is not currently supported.
- It is important that you return an object with statusCode 200 so that telegram understands that the query has been successfully answered.
- when you want to send JSON, ensure that you send it after stringifying it first
- For sending URLs sometime you may get the error `TypeError: Request path contains unescaped characters` which can be fixed using [this answer](https://stackoverflow.com/a/62437210/11879596)
