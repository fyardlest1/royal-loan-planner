// Get the values from the user
function getValues() {
	// get the values from the user
	let amount = document.getElementById('loan').value
	let term = document.getElementById('term').value
	let interest = document.getElementById('interestRates').value

	// convert the values to integers
	amount = parseFloat(amount)
	term = parseInt(term)
	interest = parseFloat(interest)

	// chek if the numbers are valid numbers
	if (isNaN(amount) || isNaN(term) || isNaN(interest)) {
		Swal.fire({
			icon: 'error',
			title: 'Oops!',
			text: 'Please enter valid numbers into the form.',
			backdrop: false,
		})
	} else if (amount < 0 || term < 0 || interest < 0) {
		Swal.fire({
			icon: 'error',
			title: 'Sorry!',
			text: 'Please enter positive valid numbers.',
			backdrop: false,
		});
	} else if (interest > 30) {
		Swal.fire({
			icon: 'error',
			title: 'Oh no!',
			text: 'The interest is too big, you need a lawyer.',
			backdrop: false,
		})
	} else {
		let allPayment = totalPayment(amount, interest, term)
		displayCard(allPayment)
		let monthlyAmount = totalMonthlyPayment(
			amount,
			interest,
			term,
			allPayment.payment
		)
		displayTable(monthlyAmount)
	}	
}

// interest rate
function interestRates(rate) {
	let interest = rate / 1200
	return interest
}

// claculate the monthly payment
function totalPayment(amount, rate, term) {
	// the total monthly payment
	let payment =
		(amount * interestRates(rate)) /
		(1 - (1 + interestRates(rate)) ** -term)

	// the total cost
	let totalCost = payment * term
	// the total interest
	let totalInterest = totalCost - amount

	// create a new object with the value
	let payments = {
		amount: amount,
		payment: payment,
		interestRate: totalInterest,
		cost: totalCost
	}

	// returning the object
	return payments
}

// calculate result for each month
function totalMonthlyPayment(amount, rate, term, monthlyPayment) {
	// creating an empty array to hold the objects
	let resultsArray = [] 
	// the remaining balance
	let remainingBalance = amount
	let totalInterest = 0

	// iterate through the months and make calculation
	for (let month = 1; month <= term; month++) {
		// interest to pay
		let interest = remainingBalance * interestRates(rate)
		let amountPayment = monthlyPayment - interest
		totalInterest += interest
		// update the balance for the next iteration
		remainingBalance -= amountPayment
		// allways return a positiv number of the remaining balance
		// using the absolute amount
		remainingBalance = Math.abs(remainingBalance)

		// create a new object with the data
		let paymentObj = {
			month,
			monthlyPayment,
			interest,
			amountPayment,
			totalInterest,
			remainingBalance,
		}
		// add the new object in the array
		resultsArray.push(paymentObj)
	}

	return resultsArray
}

// displaying the card information
function displayCard(payments) {
	// format number to US dollar
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	})

	let monthlyPayment = USDollar.format(payments.payment)
	let amount = USDollar.format(payments.amount)
	let interest = USDollar.format(payments.interestRate)
	let totalCost = USDollar.format(payments.cost)

	// add the value to the card
	document.getElementById('monthly-payment').textContent = monthlyPayment
	document.getElementById('principal').textContent = amount
	document.getElementById('interest').textContent = interest
	document.getElementById('cost').textContent = totalCost
}

// display the payment details per month
function displayTable(results) {
	// format number to US dollar currency
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	})

	// clean up the screen
	document.getElementById('tblResult').innerHTML = ''
	// get a copy of the template
	let template = document.getElementById('table-template')

	// getting the div id "tblResult"
	let tableData = document.getElementById('tblResult')

	// the arrow function that return the template
	results.forEach((newItem) => {
		let templateCopy = template.content.cloneNode(true)

		templateCopy.querySelector('.month').textContent = newItem.month
		templateCopy.querySelector('.payment').textContent = USDollar.format(
			newItem.monthlyPayment
		)
		templateCopy.querySelector('.principal').textContent = USDollar.format(
			newItem.amountPayment
		)
		templateCopy.querySelector('.interest').textContent = USDollar.format(
			newItem.interest
		)
		templateCopy.querySelector('.totalInterest').textContent =
			USDollar.format(newItem.totalInterest)
		templateCopy.querySelector('.balance').textContent = USDollar.format(
			newItem.remainingBalance
		)

		tableData.appendChild(templateCopy)
	})

	// the equivalent with a for loop
	// for (let i = 0; i < results.length; i++) {
	// 	let newItem = results[i]

	// 	// get a new copy of the template's contents
	// 	let templateCopy = template.content.cloneNode(true)

	// 	templateCopy.querySelector('.month').textContent = newItem.month
	// 	templateCopy.querySelector('.payment').textContent = USDollar.format(
	// 		newItem.monthlyPayment
	// 	)
	// 	templateCopy.querySelector('.principal').textContent = USDollar.format(
	// 		newItem.amountPayment
	// 	)
	// 	templateCopy.querySelector('.interest').textContent = USDollar.format(
	// 		newItem.interest
	// 	)
	// 	templateCopy.querySelector('.totalInterest').textContent =
	// 		USDollar.format(newItem.totalInterest)
	// 	templateCopy.querySelector('.balance').textContent = USDollar.format(
	// 		newItem.remainingBalance
	// 	)
	// 	tableData.appendChild(templateCopy)
	// }
}
