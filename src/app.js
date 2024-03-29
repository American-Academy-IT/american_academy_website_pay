const express = require('express');
const { join } = require('path');
const cors = require('cors');

const { openSession } = require('./services/checkout');
const { loggerMiddleware } = require('./middlewares/loggerMiddleware');
const { errMiddleware, errHandler } = require('./middlewares/errorMiddleware');
const { generateId } = require('./services/generateId');
const { addNewOrder } = require('./model/order');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5000', 'https://americanacademyeg.com'],
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));
app.use(loggerMiddleware);

app.post(
  '/checkout',
  errHandler(async (req, res) => {
    // return res.status(503).send({ message: 'Temporary unavailable' });
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

    const order = {
      id: generateId(),
      ...req.body,
    };

    const session = await openSession(order);
    await addNewOrder(order); // store on db
    return res.status(200).send(session);
  })
);

app.post(
  '/webhook',
  errHandler(async (req, _, next) => {
    console.log('Headers: ', JSON.stringify(req.headers));
    // sendNotification(req.body);
    next();
  })
);

app.get('/*', (_, res) => {
  return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

app.use(errMiddleware);

module.exports = app;
