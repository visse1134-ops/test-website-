// server.js
const express = require("express");
const fetch = require("node-fetch");
const os = require("os");
const app = express();

const WEBHOOK_URL = "https://discord.com/api/webhooks/1447081074177081485/bG6xw52GeUlYZ2BTinCZGG0hLAftI7g6n3Uva73q7zhPjUvUnGbgTJvD26_GBoseh3-K"; // paste your webhook here

app.get("/api/systeminfo", async (req, res) => {
  const info = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().map(cpu => cpu.model),
    totalMem: os.totalmem(),
    freeMem: os.freemem()
  };

  // Get public IP + geolocation
  try {
    const response = await fetch("https://ipinfo.io/json?token=YOUR_TOKEN");
    const data = await response.json();
    info.publicIP = data.ip;
    info.city = data.city;
    info.region = data.region;
    info.country = data.country;
    info.loc = data.loc;
  } catch (err) {
    info.publicIP = "Unavailable";
  }

  // Send JSON to Discord webhook
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "📊 New System Info",
      embeds: [
        {
          title: "System Report",
          description: "Collected system information",
          fields: Object.keys(info).map(key => ({
            name: key,
            value: String(info[key]),
            inline: false
          }))
        }
      ]
    })
  });

  res.json({ status: "sent", data: info });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
