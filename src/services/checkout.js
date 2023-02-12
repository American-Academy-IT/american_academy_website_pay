const axios = require("axios");
const generateId = require("./generateId");

const API = process.env.API;
const MERCHANT = process.env.MERCHANT;
const PASSWORD = process.env.PASSWORD;

async function openSession(amount, description) {
  const config = {
    url: API + MERCHANT + "/session",
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    auth: {
      username: `merchant.${MERCHANT}`,
      password: PASSWORD,
    },
    data: {
      apiOperation: "INITIATE_CHECKOUT",
      interaction: {
        operation: "PURCHASE",
        merchant: {
          name: "American Academy",
          address: {},
        },
      },
      order: {
        id: generateId(),
        currency: "EGP",
        amount: amount,
        description: description || "Not Specified",
      },
    },
  };

  const res = await axios(config);
  return res.data?.session?.id;
}

module.exports = openSession;
