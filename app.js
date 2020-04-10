// DOM SELECTION
const numbers = document.querySelectorAll('[data-number]');
const operations = document.querySelectorAll('[data-operation]');
const allClear = document.querySelector('[data-all-clear]');
const equal = document.querySelector('[data-equal]');
const currentDisplay = document.querySelector('[data-current]');
const history = document.querySelector('[data-history]');

// Global helper variables
let currentNumber = '';
let previousNumber = '';
let operator = undefined;
let operationStatus = false;

// Operations
function add(x, y) {
	return x + y;
}
function subtract(x, y) {
	return x - y;
}
function multiply(x, y) {
	return x * y;
}
function divide(x, y) {
	return x / y;
}
function negate(x) {
	return x * -1;
}
function percent(x) {
	return x / 100;
}

function operate() {
	let result;

	let prev = parseFloat(previousNumber);
	let curr = parseFloat(currentNumber);

	if (operator === '%' || operator === '±') {
		switch (operator) {
			case '±':
				result = negate(curr);
				break;
			case '%':
				result = percent(curr);
		}
		currentNumber = result;
		operator = undefined;
		previousNumber = '';
		updateDisplay();
	}

	if (isNaN(prev) || isNaN(curr)) return;

	switch (operator) {
		case '+':
			result = add(prev, curr);
			break;
		case '÷':
			result = divide(prev, curr);
			if (curr === 0) {
				currentDisplay.innerText = 'Yknow this aint math!';
				return;
			}
			break;
		case 'X':
			result = multiply(prev, curr);
			break;
		case '-':
			result = subtract(prev, curr);
			break;
	}

	console.log(result);
	if (!Number.isInteger(result)) {
		result = +result.toFixed(2);
	}
	currentNumber = result;
	operator = undefined;
	previousNumber = '';
	updateDisplay();
}

function displayNumberClicked(number) {
	if (number === '.' && currentNumber.toString().includes('.')) return;
	currentNumber = currentNumber.toString() + number.toString();
	if (number !== '.') {
		currentNumber = +currentNumber;
	}

	allClear.innerText = 'C';
}

function setOperation(operation) {
	if (currentNumber === '') return;
	if (previousNumber !== '') {
		operate();
	}

	if (typeof operation === 'object') {
		operator = operation.innerText;
	} else {
		operator = operation;
	}

	if (operator === '%' || operator === '±') {
		operate();
	}

	previousNumber = currentNumber;
	currentNumber = '';
}

function updateDisplay() {
	currentDisplay.innerText = currentNumber;
	history.innerText = previousNumber;
}

function init() {
	// Reset global variables
	currentNumber = '';
	previousNumber = '';
	operator = undefined;

	// Reset display
	currentDisplay.innerText = '';
	history.innerText = '';

	allClear.innerText = 'AC';
}

function deleteNumber() {
	currentNumber = currentNumber.toString().slice(0, -1);
	updateDisplay();
}

// Event Listeners

numbers.forEach((number) => {
	number.addEventListener('click', () => {
		displayNumberClicked(number.innerText);
		updateDisplay();
	});
});

operations.forEach((operation) => {
	operation.addEventListener('click', () => {
		setOperation(operation);
	});
});

equal.addEventListener('click', () => {
	operate();
});

allClear.addEventListener('click', init);

// Keyboard events

document.addEventListener('keydown', (e) => {
	// Delete number with backspace
	if (e.keyCode === 8) deleteNumber();

	// Enter number
	if (e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey) {
		displayNumberClicked(String.fromCharCode(e.keyCode));
		updateDisplay();
	}

	// Compute, same as equal sign
	if (e.keyCode === 187 || e.keyCode === 13) {
		operate();
	}

	// Clear all with escape
	if (e.keyCode === 27) {
		init();
	}
});

document.addEventListener('keypress', (e) => {
	// console.log(e.keyCode);

	// Set operation with shift and the appropriate key
	let operation;
	if (e.keyCode === 42) {
		operation = 'X';
		setOperation(operation);
	} else if (e.keyCode === 43) {
		operation = '+';
		setOperation(operation);
	} else if (e.keyCode === 47) {
		operation = '÷';
		setOperation(operation);
	} else if (e.keyCode === 45) {
		operation = '-';
		setOperation(operation);
	} else if (e.keyCode === 37) {
		operation = '%';
		setOperation(operation);
	} else if (e.keyCode === 8211) {
		operation = '±';
		setOperation(operation);
	}
});
