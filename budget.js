const accounting = require('accounting');
const moment = require('moment');

const expenses = require('./expenses.json');
const pay = require('./pay.json');

const advanceTime = (frequency, date) => {
  switch (frequency) {
    case 1:
      date.add(1, 'year');
      break;
    case 6:
      date.add(6, 'months');
      break;
    case 12:
      date.add(1, 'month');
      break;
    case 24:
      date.add(15, 'days');
      break;
    case 26:
      date.add(2, 'weeks');
      break;
    default:
      throw new Error('Invalid frequency');
  }
}

const fillDateRange = (list) => {
  const filledRange = [];
  const endDate = moment().add(1, 'year');
  list.forEach(p => {
    let payday = moment(p.date);
    while (payday.isBefore(endDate)) {
      filledRange.push({
        ...p,
        date: moment(payday),
      });
      advanceTime(p.frequency, payday);
    }
  });
  return filledRange;
}

const applyEvents = (list, date, sign, eventList) => {
  return list.filter(c => c.date.isSame(date, 'day')).reduce((acc, val) => {
    //console.log(`${val.name}: ${sign}${accounting.formatMoney(val.amount)}`);
    eventList.push({
      point: {
        xAxis: 0,
        yAxis: 0,
        x: date.valueOf(),
        y: val.amount,
      },
      text: `${val.name}: ${sign}${accounting.formatMoney(val.amount)}`,
    });
    return acc + val.amount;
  }, 0);
}

const runBudget = (startingMoney, startingTime, pay, expenses) => {
  const date = moment(startingTime);
  //console.log(`Budget for ${date.format('MMMM YYYY')}`);
  //console.log(`Starting Balance: ${accounting.formatMoney(startingMoney)}`);
  const credits = fillDateRange(pay);
  const debits = fillDateRange(expenses);


  let money = startingMoney;
  const balance = [];
  const creditEvents = [];
  const debitEvents = [];
  for (let i = 0; i < 30; i++) {
    const today = moment(startingTime).add(i, 'days');
    //console.log(`${today.format('Do')}: `);
    money += applyEvents(credits, today, '+', creditEvents);
    money -= applyEvents(debits, today, '-', debitEvents);
    //console.log('Balance: ', accounting.formatMoney(money));
    //console.log(' ');
    balance.push([today.valueOf(), money]);
  }
  return { balance, creditEvents, debitEvents };
};

//const month = runBudget(1687, moment(), pay, expenses);
//console.log(month)

module.exports = { runBudget };
