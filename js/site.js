function getValues() {
	// get the values from the user
	let amount = document.getElementById('loan').value
	let monthlyTerm = document.getElementById('term').value
	let interest = document.getElementById('interestRates').value

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
		principal: principalPayment(results),
	}

	// let payment = monthlyPayment(results)
	// let rate = interestPayment(results)
	let allPayment = totalMonthlyPayment(results, totalPayment)
	displayTable(allPayment)
	displayCard(totalPayment)
}

// total payment
// Formula: (amount loaned) * (rate / 1200) / ( 1 - (1 + rate/1200)^(-Number of Months) )
// 25000 * (5 / 1200) / (1 - (1 + 5/1200)^(-60))

// total interest
function interestRates(rate) {
	let interest = rate / 1200
	return interest
}

// claculate the monthly payment
function monthlyPayment(results) {
	let payment =
		(results.loan * interestRates(results.interest)) /
		(1 - (1 + interestRates(results.interest)) ** -results.term)
	return payment
}

// calculate the interest to pay base on the amount
// Interest Payment = Previous Remaining Balance * rate/1200
function interestPayment(results) {
	let interest = results.loan * interestRates(results.interest)
	interest = interest
	return interest
}

// Principal Payment = Total Monthly Payment - Interest Payment
function principalPayment(results) {
	let totalMonthlyPayment = parseFloat(monthlyPayment(results))
	let interest = parseFloat(interestPayment(results))

	// calculate the principal
	let principal = totalMonthlyPayment - interest
	principal = principal
	return principal
}

// calculate result for each month
function totalMonthlyPayment(results, totalPayment) {
	// creating an empty array to hold the objects
	let resultsArray = []

	let payment = totalPayment.payment
	let principal = totalPayment.principal
	let interest = totalPayment.interest
	let balance = results.loan
	let totalInterest = interest
	let totalPrincipal = 0
	let totalCost = 0

	// iterate through the months and make calculation
	for (let i = 0; i < results.term; i++) {
		// the remaining balance
		balance = results.loan - principal
		// creating a new object for each iteration
		let resultsObject = {
			month: i + 1,
			payment: totalPayment.payment,
			principal: principal,
			interest: interest,
			balance: balance,
			totalInterest: totalInterest,
		}

		// calculating the principal and interest
		interest = balance * interestRates(results.interest)
		principal = payment - interest
		totalInterest += interest
		totalPrincipal = +principal
		totalCost = totalPrincipal + totalInterest

		// update the loan for the next iteration
		results.loan = balance

		// add the new object in the array
		resultsArray.push(resultsObject)
	}

	// adding the totalPrincipal, totalInterest, and totalCost into the array
	resultsArray.push({
		totalPrincipal: totalPrincipal,
		totalInterest: totalInterest,
		totalCost: totalCost,
	})

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
	templateCopy.querySelector(
		'.cost'
	).textContent = `$${totalPayment.principal}`

	// add the copy of the template tag to the div element with the ID: 'paymentResults'
	document.getElementById('paymentResults').appendChild(templateCopy)
}

// display the payment details per month
function displayTable(results) {
	// clean up the screen
	document.getElementById('tblResult').innerHTML = ''
	// get a copy of the template
	let template
	// select the table-template
	template = document.getElementById('table-template')

	// getting the div id "tblResult"
	let tableData = document.getElementById('tblResult')

	for (let i = 0; i < results.length; i++) {
		let newItem = results[i]

		// get a new copy of the template's contents
		let templateCopy = template.content.cloneNode(true)

		templateCopy.querySelector('.month').textContent = newItem.month
		templateCopy.querySelector('.payment').textContent =
			Math.round(newItem.payment * 100) / 100
		templateCopy.querySelector('.principal').textContent =
			Math.round(newItem.principal * 100) / 100
		templateCopy.querySelector('.interest').textContent =
			Math.round(newItem.interest * 100) / 100
		templateCopy.querySelector('.totalInterest').textContent =
			Math.round(newItem.totalInterest * 100) / 100
		templateCopy.querySelector('.balance').textContent =
			Math.round(newItem.balance * 100) / 100

		tableData.appendChild(templateCopy)
	}
}
