const axios = require('axios');

const isProd = process.env.ENV === 'production';

const API = isProd ? process.env.PROD_API : process.env.TEST_API;
const MERCHANT = isProd ? process.env.PROD_MERCHANT : process.env.TEST_MERCHANT;
const PASSWORD = isProd ? process.env.PROD_PASSWORD : process.env.TEST_PASSWORD;

async function openSession(order) {
  const config = {
    url: `${API}/${MERCHANT}/session`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    auth: {
      username: `merchant.${MERCHANT}`,
      password: PASSWORD,
    },
    data: {
      apiOperation: 'INITIATE_CHECKOUT',
      interaction: {
        timeout: '1800',
        returnUrl: 'https://americanacademyeg.com',
        operation: 'PURCHASE',
        merchant: {
          name: MERCHANT,
        },
      },
      order: {
        currency: order.currency || 'EGP',
        id: order.id,
        reference: order.id,
        amount: order.amount,
        description: order.description || 'NA',
      },
      transaction: {
        reference: 'QNBAA_2023',
      },
    },
  };

  const res = await axios(config);
  return res.data.session;
}

module.exports = { openSession };
