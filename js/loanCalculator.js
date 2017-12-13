function LoanCalculator() {

  var myMonthlyResults = [];
  var myTotalSumPayed = 0;
  var myTotalInterest = 0;
  var myTotalMonths = 0;
  var myErrors = [];

  LoanCalculator.prototype.getResults = function() { return myMonthlyResults; }
  LoanCalculator.prototype.getTotalSumPayed = function() { return myTotalSumPayed; }
  LoanCalculator.prototype.getTotalInterest = function() { return myTotalInterest; }
  LoanCalculator.prototype.getTotalMonths = function() { return myTotalMonths; }
  LoanCalculator.prototype.hasErrors = function() { return myErrors.length > 0; }
  LoanCalculator.prototype.getErrors = function() { return myErrors; }

  LoanCalculator.prototype.resetCalc = function() {
    myMonthlyResults = [];
    myTotalSumPayed = 0;
    myErrors = [];
    myTotalInterest = 0;
    myTotalMonths = 0;
  }

  LoanCalculator.prototype.calculate_straight_amortization_loan = function(args) {
    
    this.resetCalc();

    var bankRate = args.bankRate / 12; // Assuming interest is defined yearly
    var monthlyAmortization = args.totalLoan / args.months;
    var currentDept = args.totalLoan;

    // Initial entry
    this.collectMonthlyResults(myTotalMonths, currentDept, currentDept * bankRate, monthlyAmortization, 0);

    while(myTotalMonths < args.months) {
      myTotalMonths += 1;
      var currentInterest = currentDept * bankRate;
      var sumToPay = monthlyAmortization + currentInterest;
      currentDept -= monthlyAmortization;
      myTotalSumPayed += sumToPay;
      myTotalInterest += currentInterest;

      this.collectMonthlyResults(myTotalMonths, currentDept, currentInterest, monthlyAmortization, sumToPay);
    }
  }

  LoanCalculator.prototype.calculate_annuity_loan = function(args) {

    this.resetCalc();

    var bankRate = args.bankRate / 12; // Assuming interest is defined yearly

    // formula to calc annuity ---> http://www.amortering.info/
    var temp = (bankRate * Math.pow((1 + bankRate), args.months)) / (Math.pow((1 + bankRate), args.months) - 1);
    var annuitet = args.totalLoan * temp;
    var currentDept = args.totalLoan;

    // Initial entry
    this.collectMonthlyResults(myTotalMonths, currentDept, currentDept * bankRate, 0, 0);
    while(currentDept > 0) {
      myTotalMonths += 1;
      var currentInterest = currentDept * bankRate;
      var currentAmortization = annuitet - currentInterest;
      currentDept = Math.max(0, currentDept - currentAmortization);

      myTotalSumPayed += annuitet;
      myTotalInterest += currentInterest;

      this.collectMonthlyResults(myTotalMonths, currentDept, currentInterest, currentAmortization, annuitet);
    }
  }

  LoanCalculator.prototype.collectMonthlyResults = function(month, sumLeft, interest, amortization, sumPayed) {
    myMonthlyResults.push({
      month: month + " mån",
      sumLeft: sumLeft,
      interest: interest,
      amortization: amortization,
      sumPayed: sumPayed
    })
  }
}