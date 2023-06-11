import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";
const {PORT = 8888} = process.env;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
// renders each checkout page with a unique client token
app.get("/", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const clientToken = await paypal.generateClientToken();
  res.render("checkout", { clientId, clientToken });
});


app.post("/api/orders", async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  res.json(captureData);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
