const http = require("http");
const { Device } = require("../models/associations");
const ONE_SIGNAL_CONFIG = require("../utils/one.signal.config");

const sendNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, message } = req.body;

    const devices = await Device.findAll({
      where: { userId: userId },
    });

    if (devices.length === 0) {
      return res
        .status(400)
        .json({ message: "El usuario no tiene dispositivos registrados" });
    }

    const deviceIds = devices.map((device) => device.deviceId);
    const messageData = JSON.stringify({
      app_id: ONE_SIGNAL_CONFIG.SIGNAL_APP_ID,
      include_player_ids: deviceIds,
      headings: { en: title },
      contents: { en: message },
    });

    const options = {
      hostname: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONE_SIGNAL_CONFIG.SIGNAL_API_KEY}`,
        "Content-Length": Buffer.byteLength(messageData),
      },
    };

    const request = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        return res.status(200).json(JSON.parse(data));
      });
    });

    request.on("error", (error) => {
      return res.status(400).json({ message: error.message });
    });

    request.write(messageData);
    request.end();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message } = req.body;

    const devices = await Device.findAll();
    if (devices.length === 0) {
      return res
        .status(400)
        .json({ message: "No se encontraron dispositivos" });
    }

    const deviceIds = devices.map((device) => device.deviceId);
    const messageData = JSON.stringify({
      app_id: ONE_SIGNAL_CONFIG.SIGNAL_APP_ID,
      include_player_ids: deviceIds,
      headings: { en: title },
      contents: { en: message },
    });

    const options = {
      hostname: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONE_SIGNAL_CONFIG.SIGNAL_API_KEY}`,
        "Content-Length": Buffer.byteLength(messageData),
      },
    };

    const request = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        return res.status(200).json(JSON.parse(data));
      });
    });

    request.on("error", (error) => {
      return res.status(400).json({ message: error.message });
    });

    request.write(messageData);
    request.end();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { sendNotification, sendNotificationToAll };
