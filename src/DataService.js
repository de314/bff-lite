const level = require("level");

const DB_PATH = "./db";
// TODO

class DataService {
  constructor(db = defaultDataService) {
    this.db = db;
    this.binCache = {};
  }
  put(key, value) {
    return new Promise((resolve, reject) => {
      this.db
        .put(key, value)
        .then(() => resolve(value))
        .catch(e => {
          console.error(`Error putting key "${key}"`, e);
          resolve(null);
        });
    });
  }
  findById(key) {
    return new Promise((resolve, reject) => {
      this.db
        .get(key)
        .then(data => resolve(data))
        .catch(e => {
          console.error(`Error reading key "${key}"`, e);
          resolve(null);
        });
    });
  }
  findByPrefix(prefix, options) {
    return this.findByKeyRange(prefix, `${prefix}~`, options);
  }
  findByKeyRange(gte, lte, options) {
    options = { limit: 25, ...options, gte, lte };
    return new Promise((resolve, reject) => {
      const results = [];
      this.db
        .createReadStream(options)
        .on("data", function(data) {
          results.push(data);
        })
        .on("error", function(err) {
          reject(err);
        })
        .on("end", function() {
          resolve(results);
        });
    });
  }
  deleteByPrefix(prefix) {
    return new Promise((resolve, reject) => {
      const batchOps = [];
      this.db
        .createKeyStream({ gte: prefix, lte: `${prefix}~` })
        .on("data", function(data) {
          batchOps.push({ type: "del", key: data });
        })
        .on("error", function(err) {
          console.error("Failed to collect batch deletes", err);
          reject(err);
        })
        .on("end", () => {
          this.db
            .batch(batchOps)
            .then(() => resolve(true))
            .catch(err => {
              console.error("Failed to execute batch deletes", err);
              reject(err);
            });
        });
    });
  }
}

const db = (exports.db = level(DB_PATH, { valueEncoding: "json" }));

exports.default = DataService;

exports.dataService = new DataService(db);
