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
      }
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
    }]
  });

};

(() => {
  sendRequest('/budget', {
    startDate: '',
    balance: 1687,
  })
    .then(data => buildChart(data));
})();
