// function LoanCalculatorTester() {

//   var myFailedTests = [];
//   var myloanCalc = new LoanCalculator();

//   LoanCalculatorTester.prototype.getFailedTests = function() {  return myFailedTests; }
  
//   LoanCalculatorTester.prototype.addError = function(result, expected) {
//     error = "Expected Result: \n" + JSON.stringify(myloanCalc.getResults()) + "\n\nDid not match: \n" + JSON.stringify(expectedResults);
//     myFailedTests.push(error);
//   }

//   LoanCalculatorTester.prototype.runTests = function() {

//     // Test We have correct values in result
//     var args = {
//       totalSum: 150,
//       bankRate: 0.02,
//       months: 5,
//       monthlyRepay: 30
//     }
//     myloanCalc.calculate_installment_loan(args);
//     expectedResults = [
//       { month: "0 mån", sumLeft: 150, interest: 3, amortization: 0 },
//       { month: "1 mån", sumLeft: 123, interest: 3, amortization: 27 },
//       { month: "2 mån", sumLeft: 95.46, interest: 2.46, amortization: 27.54 },
//       { month: "3 mån", sumLeft: 67.37, interest: 1.91, amortization: 28.09 },
//       { month: "4 mån", sumLeft: 38.72, interest: 1.35, amortization: 28.65 },
//       { month: "5 mån", sumLeft: 9.49, interest: 0.77, amortization: 29.23 },
//       { month: "6 mån", sumLeft: 0, interest: 0.19, amortization: 9.49 }
//     ]

//     if(!_.isEqual(myloanCalc.getResults(), expectedResults)) {
//       this.addError(myloanCalc.getResults(), expectedResults);
//     }

//     // Test args ar validated
//     var args = {
//       totalSum: 150,
//       bankRate: 0.03,
//       months: null,
//       monthlyRepay: 1
//     }
//     myloanCalc.calculate_installment_loan(args);
//      if(!myloanCalc.getErrors()[0] == "Sum to pay back 1 SEK cannot be less than the initial interest: 4.5SEK") {
//       myFailedTests.push("failed to validate args");
//     }
//   }
// }