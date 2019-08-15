const express = require('express');
const budget = require('./budget');
const moment = require('moment');
const expenses = require('./expenses.json');
const pay = require('./pay.json');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.post('/budget', (req, res) => {
  const date = req.query.startDate ? moment(req.query.startDate) : moment();
  const balance = parseFloat(req.query.balance);
  return res.send(budget.runBudget(balance, date, pay, expenses));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
