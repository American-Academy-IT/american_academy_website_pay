const express = require('express');
const { join } = require('path');
const cors = require('cors');

const openSession = require('./services/checkout');
const sendNotification = require('./services/mailer');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const { errMiddleware, errHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));
app.use(loggerMiddleware);

app.post(
  '/checkout',
  errHandler(async (req, res) => {
    const { amount, currency, description } = req.body;
    if (!amount || !currency || !description) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    if (+amount < 100) {
      return res.status(400).send({ message: 'Invalid amount' });
    }
    if (!['EGP', 'USD'].includes(currency)) {
      return res.status(400).send({ message: 'Invalid Currency' });
    }

    const sessionId = await openSession(req.body);
    return res.status(200).send({ sessionId });
  })
);

app.post(
  '/webhook',
  errHandler(async (req, _, next) => {
    console.log('Headers:', Object.keys(req.header).length ? req.header : undefined);
    // sendNotification(req.body);
    next();
  })
);

app.get('/*', (_, res) => {
  return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

app.use(errMiddleware);

module.exports = app;
