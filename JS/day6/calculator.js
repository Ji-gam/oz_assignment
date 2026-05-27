// calculator.js

// DOM Elements
const display = document.getElementById('display');
const onOffBtn = document.querySelector('.on-off');

// Calculator State
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let isOn = true; // The calculator is turned ON by default

// Initialize the calculator state
function init() {
    onOffBtn.classList.add('on');
    updateDisplay();
}

// Update the display value
function updateDisplay() {
    if (!isOn) {
        display.value = '';
    } else {
        display.value = displayValue;
    }
}

// Input number/dot digit
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit === '.' ? '0.' : digit;
        waitingForSecondOperand = false;
    } else {
        if (displayValue === '0' && digit !== '.') {
            displayValue = digit;
        } else if (digit === '.' && displayValue.includes('.')) {
            return; // Ignore if display already has a decimal point
        } else {
            displayValue += digit;
        }
    }
}

// Handle operator button click
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    // If operator is clicked and waiting for second operand, change the operator
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = formatResult(result);
        firstOperand = displayValue === 'Error' ? null : parseFloat(displayValue);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Calculate the arithmetic operation
function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') {
        if (second === 0) return 'Error';
        return first / second;
    }
    return second;
}

// Format the calculation result (fixes float precision and removes trailing zeros)
function formatResult(value) {
    if (value === 'Error') return 'Error';
    if (isNaN(value)) return 'Error';

    const num = parseFloat(value);
    // Limit precision to 10 decimals, then convert back to strip unnecessary trailing zeros
    const fixed = parseFloat(num.toFixed(10));
    return fixed.toString();
}

// Reset calculation state
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Handle equals / Enter action
function handleEnter() {
    if (operator === null || waitingForSecondOperand) {
        return;
    }

    const inputValue = parseFloat(displayValue);
    const result = calculate(firstOperand, inputValue, operator);

    displayValue = formatResult(result);
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
}

// Toggle ON/OFF state
function toggleOnOff() {
    isOn = !isOn;
    if (isOn) {
        onOffBtn.classList.add('on');
        resetCalculator();
    } else {
        onOffBtn.classList.remove('on');
        resetCalculator();
        displayValue = '';
    }
    updateDisplay();
}

// Event Delegation for Button Clicks
document.querySelector('.buttons').addEventListener('click', (event) => {
    const { target } = event;

    // Only respond to button clicks
    if (!target.matches('button')) {
        return;
    }

    // ON/OFF button can be clicked even if the calculator is OFF
    if (target.classList.contains('on-off')) {
        toggleOnOff();
        return;
    }

    // If the calculator is OFF, ignore all other inputs
    if (!isOn) {
        return;
    }

    // Clear (C) Button
    if (target.classList.contains('clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    // Operator Buttons (+, -, *, /)
    if (target.classList.contains('operator')) {
        handleOperator(target.textContent);
        updateDisplay();
        return;
    }

    // Enter Button
    if (target.classList.contains('enter')) {
        handleEnter();
        updateDisplay();
        return;
    }

    // Number Buttons (0-9, .)
    if (target.classList.contains('number')) {
        inputDigit(target.textContent);
        updateDisplay();
        return;
    }
});

// Run initialization
init();
