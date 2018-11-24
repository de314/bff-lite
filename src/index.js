const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { dataService } = require("./DataService");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.get("/api/v1/data/search", (req, res) => {
  const {
    query: { start, stop, prefix, cursor }
  } = req;
  let {
    query: { limit, reverse }
  } = req;
  if (!_.isNil(limit)) {
    limit = parseInt(limit);
  }
  reverse = reverse === "true";
  const options = { limit, reverse };
  if (!_.isNil(prefix)) {
    if (!_.isNil(cursor)) {
      dataService
        .findByKeyRange(`${cursor} `, `${prefix}~`, options)
        .then(data => res.send(data));
    } else {
      dataService.findByPrefix(prefix, options).then(data => res.send(data));
    }
  } else if (!_.isNil(start) || !_.isNil(stop)) {
    dataService
      .findByKeyRange(start, stop, options)
      .then(data => res.send(data));
  } else {
    res
      .status(400)
      .header("X-ERROR", "Invalid search params")
      .send(null);
  }
});

app.get("/api/v1/data/:key", (req, res) => {
  const {
    params: { key }
  } = req;
  dataService.findById(key).then(data => res.send(data));
});

app.post("/api/v1/data/:key", (req, res) => {
  const {
    params: { key },
    body
  } = req;
  dataService.put(key, body).then(data => res.send(data));
});

app.delete("/api/v1/data/:prefix", (req, res) => {
  const {
    params: { prefix }
  } = req;
  dataService
    .deleteByPrefix(prefix)
    .then(() => res.send(true))
    .catch(() => res.status(500).send(false));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
