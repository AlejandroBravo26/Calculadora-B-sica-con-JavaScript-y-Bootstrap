document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el display y los botones.
    const display = document.getElementById('display');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');

    // Variables de estado de la calculadora.
    let firstOperand = '';
    let secondOperand = '';
    let currentOperation = null;
    let shouldResetDisplay = false; // Indica si el display debe limpiarse.

    // Actualiza el valor del display.
    function updateDisplay(value) {
        display.value = value;
    }

    // Añade números o el punto al display.
    function appendNumber(number) {
        if (shouldResetDisplay) { // Limpia si se inicia un nuevo número.
            display.value = '';
            shouldResetDisplay = false;
        }
        if (number === '.' && display.value.includes('.')) { // Evita múltiples puntos.
            return;
        }
        if (display.value === '0' && number !== '.') { // Reemplaza '0' inicial.
            display.value = number;
        } else {
            display.value += number;
        }
    }

    // Maneja la selección de operaciones.
    function chooseOperation(operation) {
        if (display.value === '') return;
        if (firstOperand !== '' && currentOperation !== null && !shouldResetDisplay) {
            calculate(); // Encadena operaciones.
        }
        firstOperand = display.value;
        currentOperation = operation;
        shouldResetDisplay = true; // Prepara para el segundo número.
        if (operation !== '=') {
            updateDisplay(`${firstOperand} ${currentOperation}`); // Muestra la operación temporalmente.
        }
    }

    // Realiza el cálculo.
    function calculate() {
        if (firstOperand === '' || currentOperation === null || display.value === '' || shouldResetDisplay) {
            return;
        }
        secondOperand = display.value;
        let result;
        const num1 = parseFloat(firstOperand);
        const num2 = parseFloat(secondOperand);
        if (isNaN(num1) || isNaN(num2)) { // Valida números.
            clearCalculator();
            alert('Error: Entrada inválida. Limpiando calculadora.');
            return;
        }
        switch (currentOperation) { // Realiza la operación.
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/':
                if (num2 === 0) { // Valida división por cero.
                    alert('¡Error: No se puede dividir por cero!');
                    clearCalculator();
                    return;
                }
                result = num1 / num2;
                break;
            default: return;
        }
        updateDisplay(result.toString());
        firstOperand = result.toString(); // Para cálculos encadenados.
        currentOperation = null;
        secondOperand = '';
        shouldResetDisplay = true;
    }

    // Limpia el estado de la calculadora.
    function clearCalculator() {
        firstOperand = '';
        secondOperand = '';
        currentOperation = null;
        shouldResetDisplay = false;
        updateDisplay('0');
    }

    // Asigna eventos a los botones numéricos.
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.dataset.number);
        });
    });

    // Asigna eventos a los botones de operación.
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operation = button.dataset.operation;
            if (operation === '=') {
                calculate();
            } else if (operation === 'clear') {
                clearCalculator();
            } else {
                chooseOperation(operation);
            }
        });
    });

    clearCalculator(); // Inicializa la calculadora al cargar.
});
