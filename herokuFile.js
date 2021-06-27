const http = require("http");

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Bot active");
};

const server = http.createServer(requestListener);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("server listening"));
