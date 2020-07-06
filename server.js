const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const shortUrlRoute = require("./server/shortUrl.route");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};
mongoose
  .connect(
    process.env.MONGO_DB,
    mongooseOptions
  )
  .then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(cors());
  server.use(express.json());

  server.use(shortUrlRoute);

  server.use("/", (req, res, next) => {
    app.render(req, res, "/", req.query);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
