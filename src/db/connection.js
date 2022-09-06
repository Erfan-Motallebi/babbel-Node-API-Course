const { Pool } = require("pg");
const path = require("node:path");
require("dotenv").config({
  path: path.resolve(".env.development"),
  encoding: "utf8",
});

/**
 *
 * @param {function} [callback=null]
 * @returns
 */
module.exports = (callback = null) => {
  // NOTE: PostgreSQL creates a superuser by default on localhost using the OS username.
  const pool = new Pool({
    user: process.env.NODE_ENV === "development" && "postgres",
    // user:
    //   (process.env.NODE_ENV === "development" &&
    //     (os.userInfo() || {}).username) ||
    //   "",
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    max: 10,
  });

  const connection = {
    pool,
    query: (...args) => {
      return pool.connect().then((client) => {
        return client.query(...args).then((res) => {
          client.release();
          return res;
        });
      });
    },
  };

  // various ways to make the pool of connections available globally

  // 1. process.pgClient = connection;
  globalThis.pgPool = connection;

  if (callback) {
    callback(connection);
  }

  return connection;
};
