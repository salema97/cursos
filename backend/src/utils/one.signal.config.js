require("dotenv").config();

const ONE_SIGNAL_CONFIG = {
  SIGNAL_APP_ID: process.env.SIGNAL_APP_ID,
  SIGNAL_API_KEY: process.env.SIGNAL_API_KEY,
};

module.exports = ONE_SIGNAL_CONFIG;
