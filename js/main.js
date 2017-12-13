var sum_chart = null;
var interest_chart = null;
var amortization_chart = null;
var payed_sum_chart = null;
var chartsInitialized = false;

// var loanCalculatorTester = new LoanCalculatorTester();
// loanCalculatorTester.runTests();
// if(loanCalculatorTester.getFailedTests().length > 0) {
//   console.log("Warning: loanCalc has " + loanCalculatorTester.getFailedTests().length + " failing tests...");
//   _.forEach(loanCalculatorTester.getFailedTests(), function(error) {
//     console.log(error);
//   });
// }

var loanCalc = new LoanCalculator();

function onWindowLoaded() {
  initButtons();
}

function onCalculatePressed(event) {
  button = $(event.currentTarget).attr("id");
  if(button == "calculate-straight-button") {
    calculateLoan("straight");
  } else if (button == "calculate-annuity-button") {
    calculateLoan("annuity");
  }
}

function calculateLoan(type) {
  $("#error-message").text("");
  $("#info-message").text("");

  var loan = parseFloat($("#loan-form").val());
  var rate = parseFloat($("#rate-form").val());
  var months = parseFloat($("#months-form").val());

  var mising_args = [];

  if(isNaN(loan)) {
    mising_args.push("lån");
  }
  if(isNaN(rate)) {
    mising_args.push("ränta");
  }
  if(isNaN(months)) {
    mising_args.push("månader");
  }

  if (mising_args.length > 0) {
    $("#error-message").text("Fält ej korrekt ifyllt för: " + mising_args.join());
    return;
  }

  if(!chartsInitialized) {
    initCharts();
    chartsInitialized = true;
  }

  var args = {
    totalLoan: loan,
    bankRate: (rate * 0.01), //10% yearly
    months: months,
  }
  if(type == "straight") {
    loanCalc.calculate_straight_amortization_loan(args);
  } else {
    loanCalc.calculate_annuity_loan(args);
  }

  if(!loanCalc.hasErrors()) {
    if (sum_chart != null) {
      sum_chart.data = chartDataFromCalculator('sum');
      sum_chart.update();
    }
    if (interest_chart != null) {
      interest_chart.data = chartDataFromCalculator('interest');
      interest_chart.update();
    }
    if (amortization_chart != null) {
      amortization_chart.data = chartDataFromCalculator('amortization');
      amortization_chart.update();
    }
    if (payed_sum_chart != null) {
      payed_sum_chart.data = chartDataFromCalculator('payed_sum');
      payed_sum_chart.update();
    }

    var totalSum = Math.round(loanCalc.getTotalSumPayed());
    var totalInterest = Math.round(loanCalc.getTotalInterest());
    var averageMonthly = Math.round(totalSum / loanCalc.getTotalMonths());
    $("#info-total-sum").text("Totala Summa: " + formatNumber(totalSum) + " kr");
    $("#info-total-interest").text("Ränta: " + formatNumber(totalInterest) + " kr");
    if(type == "straight") {
      $("#info-total-monthly").text("Betalat genomsnitt/mån: " + formatNumber(averageMonthly) + " kr");
    } else {
      $("#info-total-monthly").text("Betalat/mån: " + formatNumber(averageMonthly) + " kr");
    }
  } else {
    $("#error-message").text(loanCalc.getErrors().join());
  }
}

function initButtons() {
  $("#calculate-straight-button").click(onCalculatePressed);
  $("#calculate-annuity-button").click(onCalculatePressed);
}

function chartDataFromCalculator(chart) {

  var calculatedData = loanCalc.getResults();

  if(chart == 'sum') {
    var months = _.map(calculatedData, function(item) {
      return item.month;
    });
    var loanData = _.map(calculatedData, function(item) {
      return item.sumLeft;
    });

    return {
    datasets: [
        {
          label: 'Kvarvarande Lån',
          data: loanData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 0.6)'
        }
      ],
      labels: months,
    }
  } else if(chart == 'interest') {
    var months = _.map(calculatedData, function(item) {
      return item.month;
    });
    var interest_data = _.map(calculatedData, function(item) {
      return item.interest;
    });

    return {
    datasets: [
        {
          label: 'Ränta',
          data: interest_data,
          backgroundColor: 'rgba(36, 124, 26, 0.2)',
          borderColor: 'rgba(36, 124, 26, 0.6)'
        },
      ],
      labels: months,
    }
  } else if(chart == 'amortization') {
    var months = _.map(calculatedData, function(item) {
      return item.month;
    });
    var amortization_data = _.map(calculatedData, function(item) {
      return item.amortization;
    });

    return {
    datasets: [
        {
          label: 'Amortering',
          data: amortization_data,
          backgroundColor: 'rgba(196, 155, 43, 0.2)',
          borderColor: 'rgba(196, 155, 43, 0.6)'
        }
      ],
      labels: months,
    }
  } else if(chart == 'payed_sum') {
    var months = _.map(calculatedData, function(item) {
      return item.month;
    });
    var payedSumData= _.map(calculatedData, function(item) {
      return item.sumPayed;
    });

    return {
    datasets: [
        {
          label: 'Amortering',
          data: payedSumData,
          backgroundColor: 'rgba(132, 35, 26, 0.2)',
          borderColor: 'rgba(132, 35, 26, 0.6)'
        }
      ],
      labels: months,
    }
  }
}

function months() {
  return [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
  ]
}

function randomizeDecreasingData() {
  var data = [100];
  var total = 100;
  for(index = 0; index < 11; index++) {
    // Random reduction between 5 and 20
    var randomReduction = Math.floor((Math.random() * 20) + 1);
    // Make sure total stays at 0
    total = Math.max(0, total - randomReduction);
    data.push(total);
  }
  return data;
}

function chartDataTest() {
  return {
    datasets: [
      {
        label: 'Mika',
        data: randomizeDecreasingData(),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        label: 'Lisa',
        data: randomizeDecreasingData(),
        backgroundColor: 'rgba(36, 124, 26, 0.2)',
        borderColor: 'rgba(36, 124, 26, 0.6)'
      }
    ],
    labels: months(),
  }
}

function chartOptions() {
  return {
    scales: {
      yAxes: [{
        // type: 'logarithmic'
        type: 'linear',
        ticks: {
          min: 0,
          callback: function(value, index, values) {
            return formatNumber(value) + ' SEK';
          }
        }
      }]
    }
  }
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function initCharts() {
  var ctx = document.getElementById("loan-chart-sum").getContext('2d');
  sum_chart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: chartOptions()
  });
  var ctx = document.getElementById("loan-chart-interest").getContext('2d');
  interest_chart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: chartOptions()
  });
  var ctx = document.getElementById("loan-chart-amortization").getContext('2d');
  amortization_chart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: chartOptions()
  });
  var ctx = document.getElementById("loan-chart-payed-sum").getContext('2d');
  payed_sum_chart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: chartOptions()
  });
}