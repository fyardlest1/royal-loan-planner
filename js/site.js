function getValues() {
	// get the values from the user
	let amount = document.getElementById('loan').value;
	let monthlyTerm = document.getElementById('term').value;
	let interest = document.getElementById('interestRates').value;

	// convert the values to integers
	amount = parseInt(amount)
	monthlyTerm = parseInt(monthlyTerm)
	interest = parseInt(interest)	

	let results = {
		loan: amount,
		term: monthlyTerm,
		interest: interest,
	}

	let totalPayment = {
		payment: monthlyPayment(results),
		interest: interestPayment(results),
		principal: principalPayment(results)
	}

	// let payment = monthlyPayment(results)
	// let rate = interestPayment(results)
	displayCard(totalPayment)
	let allPayment = totalMonthlyPayment(results, totalPayment)
	displayTable(allPayment)
}

// total payment 
// Formula: (amount loaned) * (rate / 1200) / ( 1 - (1 + rate/1200)^(-Number of Months) )
// 25000 * (5 / 1200) / (1 - (1 + 5/1200)^(-60))

// total interest
function interestRates(rate) {	
	let interest = (rate / 1200)
	return interest
}

// claculate the monthly payment
function monthlyPayment(results) {
	let payment =
		(results.loan * interestRates(results.interest)) /
		((1 - (1 + interestRates(results.interest))** -results.term))

	payment = Math.round(payment * 100) / 100
	return payment
}

// calculate the interest to pay base on the amount
// Interest Payment = Previous Remaining Balance * rate/1200
function interestPayment(results) {
	let interest = results.loan * interestRates(results.interest)
	interest = Math.round(interest * 100) / 100
	return interest
}

// Principal Payment = Total Monthly Payment - Interest Payment
function principalPayment(results) {
	let totalMonthlyPayment = parseFloat(monthlyPayment(results));
	let interest = parseFloat(interestPayment(results));

	// calculate the principal
	let principal = totalMonthlyPayment - interest
	principal = Math.round(principal * 100) / 100
	return principal
}

// At the end of each month, Remaining Balance = Previous Remaining Balance - Principal Payment
// Calculate the Remaining Balance
// function remainingBalance(results, totalPayment) {
// 	// calculate the remaining balance
// 	let newBalance = results.loan - totalPayment.principal
// 	newBalance = Math.round(remainingBalance * 100) / 100
// 	return newBalance
// }

// calculate result for each month
function totalMonthlyPayment(results, totalPayment) {
	// creating an empty array to hold the objects
	let resultsArray = []

	let payment = totalPayment.payment
	let principal = totalPayment.principal
	let interest = totalPayment.interest
	let balance = results.loan
	let totalInterest = interest

	// iterate through the months and make calculation
	for (let i = 0; i < results.term; i++) {
		// the remaining balance
		balance = results.loan - principal
		// creating a new object for each iteration
		let resultsObject = {
			month: i + 1,
			payment: totalPayment.payment,
			principal: Math.round(principal * 100) / 100,
			interest: Math.round(interest * 100) / 100,
			balance: Math.round(balance * 100) / 100,
			totalInterest: Math.round(totalInterest * 100) / 100,
		}

		// calculating the principal and interest
		interest = balance * interestRates(results.interest)
		principal = payment - interest
		totalInterest += interest
		
		// update the loan for the next iteration
		results.loan = balance


		// add the new object in the array
		resultsArray.push(resultsObject)
	}

	return resultsArray
}

// displaying the card information
function displayCard(totalPayment) {
	// clean up the screen
	document.getElementById('paymentResults').innerHTML = ''
	// get a copy of the template
	let template

	// access the template
	template = document.getElementById('card-template')
	// get a new copy of the template's contents
	let templateCopy = template.content.cloneNode(true)

	// put the original message into the card
	templateCopy.querySelector(
		'.monthly-payment'
	).textContent = `$${totalPayment.payment}`
	templateCopy.querySelector(
		'.principal'
	).textContent = `$${totalPayment.payment}`
	templateCopy.querySelector(
		'.interest'
	).textContent = `$${totalPayment.interest}`
	templateCopy.querySelector('.cost').textContent = `$${totalPayment.principal}`

	// add the copy of the template tag to the div element with the ID: 'paymentResults'
	document.getElementById('paymentResults').appendChild(templateCopy)
}


function displayTable(results) {
	// get a copy of the template
	let template
	// Iterate through the resultsArray
	template = document.getElementById('table-template')

	// getting the div id "tblResult"
	let tableData = document.getElementById('tblResult')
	
	for (let i = 0; i < results.length; i++) {
		let newItem = results[i]

		// get a new copy of the template's contents
		let templateCopy = template.content.cloneNode(true)

		templateCopy.querySelector('.month').textContent = newItem.month
		templateCopy.querySelector('.payment').textContent = newItem.payment
		templateCopy.querySelector('.principal').textContent = newItem.principal
		templateCopy.querySelector('.interest').textContent = newItem.interest
		templateCopy.querySelector('.totalInterest').textContent =
			newItem.totalInterest
		templateCopy.querySelector('.balance').textContent = newItem.balance
		
		tableData.appendChild(templateCopy)
	}
}

