const { MongoClient } = require("mongodb");
const { isUndefined } = require("lodash");
const { mongoConfig } = require("./mongoSettings");

let connection = undefined;
let db = undefined;

module.exports = {
  connectToDb: async () => {
    if (isUndefined(connection)) {
      connection = await MongoClient.connect(mongoConfig.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
      });
      db = await connection.db(mongoConfig.database);
    }
    return db;
  },
  closeConnection: () => {
    connection.close();
  },
};
