const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/create-payment", async (req, res) => {
  try {
    const purchaseId = "123";
    const callbackData = `purchase_id_${purchaseId}`;

    const response = await axios.post(
      `https://gateway.gear.mycelium.com/gateways/b34435a52426a24fc9c14714e471cd32c910412d97b575889d90465ebd2a606a/orders?amount=100&callback_data=${callbackData}`
    );

    if (response.data && response.data.address) {
      res.json({
        address: response.data.address,
        amount_in_btc: response.data.amount_in_btc,
      });
    } else {
      res.status(400).json({ error: "Payment creation failed." });
    }
  } catch (error) {
    console.error(
      "Error in /create-payment:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/callback", (req, res) => {
  console.log("Received callback from Mycelium Gear:", req.query);

  // Extract callback_data
  const callbackData = req.query.callback_data;
  if (callbackData && callbackData.startsWith("purchase_id_")) {
    const purchaseId = callbackData.split("_")[2];
    console.log(`The callback is associated with purchase ID: ${purchaseId}`);
  }

  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}}`);
});
