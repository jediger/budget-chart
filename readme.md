Create two files:
expenses.json and pay.json

Each should contain an array of financial events, like so:

```[
  {
    "name": "National Grid", // Name of org
    "amount": 150.00, // Amount of charge/debit
    "frequency": 12, // Number of times this occurs per year
    "date": "2019-07-29" // A past date on which this payment occurred
  }
]```

The pay.json file should naturally only contain debits, and expenses.json should only contain debits
