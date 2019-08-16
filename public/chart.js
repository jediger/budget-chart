const sendRequest = (path, params) => {
  const url = new URL(`${location.protocol}//${location.host}${path}`);
  url.search = new URLSearchParams(params)
  return fetch(url, {
    method: 'POST',
  })
    .then(response => response.json());
}

const buildChart = (data) => {
  Highcharts.chart('chart', {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Balance'
    },
    xAxis: {
      tickInterval: 24 * 3600 * 1000, // one day
      tickWidth: 0,
      gridLineWidth: 1,
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: '$'
      },
      labels: {
        format: '${value}'
      }
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: ${point.y:.2f}'
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: false
      }
    },
    series: [{
      name: 'Balance',
      type: 'spline',
      data: data.balance,
      negativeColor: '#FF0000'
    }, {
      name: 'Events',
      type: 'column',
      data: data.events,
      color: '#009900',
      negativeColor: '#FF0000',
      tooltip: {
        pointFormat: '{point.text}<br/>',
      },
    }]
  });

};

const updateChart = (balance, startDate) => {
  sendRequest('/budget', {
    startDate,
    balance,
  })
    .then(data => buildChart(data));
};

(() => {
  const balanceField = document.getElementById('balance');
  const startDateField = document.getElementById('startDate');
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateChart(balanceField.value, startDateField.value);
    console.log(e);
  });
  updateChart(balanceField.value, startDateField.value);
})();
