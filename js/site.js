function getValues() {
	// get the values from the user
	let amount = document.getElementById('loan').value
	let monthlyTerm = document.getElementById('term').value
	let interest = document.getElementById('interestRates').value

	// convert the values to integers
	amount = parseFloat(amount)
	monthlyTerm = parseInt(monthlyTerm)
	interest = parseFloat(interest)

	// chek if the numbers are valid numbers
	if (isNaN(amount) || isNaN(term) || isNaN(interest)) {
		Swal.fire({
			icon: 'error',
			title: 'Oops!',
			text: '....',
			backdrop: false,
		})
	} else if (fizzNumber > stopNumber || buzzNumber > stopNumber) {
		// tell the user what to do
		Swal.fire({
			icon: 'error',
			title: 'Almost there!',
			text: '....',
			backdrop: false,
		})
	} else {
		let allPayment = totalMonthlyPayment(results, totalPayment)
		displayTable(allPayment)
		displayCard(allPayment)
	}	
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

	return resultsArray
}

// displaying the card information
function displayCard(totalPayment) {
	
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

	for (let i = 0; i < results.length - 1; i++) {
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
