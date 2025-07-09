let inputField = document.getElementById("input");
let resultField = document.getElementById("result");
let userInput = "";
let result = "";

function updateDisplay() {
    inputField.innerText = userInput;
    resultField.innerText = result;
}

function operate(a, b, operator) {
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "x":
            return a * b;
        case "/":
            return a / b;
    }
}

getIndexes = (input) => {
    let indexes = [];
    for (let i in input) {
        if (input[i] === "x" || input[i] === "/" || input[i] === "+" || input[i] === "-" || input[i] === "%") {
            if (i === "0" && input[i] === "-") {
                continue;
            }
            if (indexes.includes(Number(i)-1) && indexes[Number(i)-1] !== "%") {
                continue;
            }
            indexes.push(Number(i));
        }
    }
    indexes.push(input.length);
    return indexes;
}

parseInput = (input) => {

    if (input[input.length - 1] === "x" || input[input.length - 1] === "/" || input[input.length - 1] === "+" || input[input.length - 1] === "-" || input[input.length - 1] === ".") {
        return result;
    }

    let lhsNum = "";
    let rhsNum = "";
    let res = "";
    let convertedInput = input;
    let indexes = getIndexes(input);

    while(convertedInput.includes("%")) {
        indexes = getIndexes(convertedInput);
        for (let i = 0; i < indexes.length; i++) {
            if (convertedInput[indexes[i]] === "%") {
                if (i === 0) {
                    lhsNum = convertedInput.substring(0, indexes[i]);
                    res = (Number(lhsNum) / 100).toString();
                    convertedInput = res + convertedInput.substring(indexes[i]+1, convertedInput.length);
                    break;
                }
                lhsNum = convertedInput.substring(indexes[i-1]+1, indexes[i]);
                res = (Number(lhsNum) / 100).toString();
                convertedInput = convertedInput.substring(0, indexes[i-1]+1) + res + convertedInput.substring(indexes[i]+1, convertedInput.length);
                console.log(convertedInput);
                break;
            }
        }
    }

    while(convertedInput.includes("/") || convertedInput.includes("x")) {
        indexes = getIndexes(convertedInput);
        for (let i = 0; i < indexes.length; i++) {
            if (convertedInput[indexes[i]] === "/" || convertedInput[indexes[i]] === "x") {
                if (i === 0) {
                    lhsNum = convertedInput.substring(0, indexes[i]);
                    rhsNum = convertedInput.substring(indexes[i] + 1, indexes[i+1]);
                    res = operate(Number(lhsNum), Number(rhsNum), convertedInput[indexes[i]]).toString();
                    convertedInput = res + convertedInput.substring(indexes[i + 1], convertedInput.length);
                    break;
                }
                lhsNum = convertedInput.substring(indexes[i-1]+1, indexes[i]);
                rhsNum = convertedInput.substring(indexes[i] + 1, indexes[i+1]);
                res = operate(Number(lhsNum), Number(rhsNum), convertedInput[indexes[i]]).toString();
                convertedInput = convertedInput.substring(0, indexes[i-1] + 1) + res + convertedInput.substring(indexes[i+1], convertedInput.length);
                break;
            }
        }
    }

    while(convertedInput.includes("+") || convertedInput.includes("-") && indexes[0] !== convertedInput.length) {
        indexes = getIndexes(convertedInput);
        for (let i = 0; i < indexes.length; i++) {
            if (convertedInput[indexes[i]] === "+" || convertedInput[indexes[i]] === "-") {
                if (i === 0) {
                    lhsNum = convertedInput.substring(0, indexes[i]);
                    rhsNum = convertedInput.substring(indexes[i] + 1, indexes[i+1]);
                    res = operate(Number(lhsNum), Number(rhsNum), convertedInput[indexes[i]]).toString();
                    convertedInput = res + convertedInput.substring(indexes[i + 1], convertedInput.length);
                    break;
                }
                lhsNum = convertedInput.substring(indexes[i-1]+1, indexes[i]);
                rhsNum = convertedInput.substring(indexes[i] + 1, indexes[i+1]);
                res = operate(Number(lhsNum), Number(rhsNum), convertedInput[indexes[i]]).toString();
                convertedInput = convertedInput.substring(0, indexes[i-1] + 1) + res + convertedInput.substring(indexes[i+1], convertedInput.length);
                break;
            }
        }
    }

    return convertedInput;
}

let numAvailable = true;
let operatorAvailable = false;
let dotAvailable = true;
let percentAvailable = false;
let minusAvailable = true;

function handleButtonClick(symbol) {
    resultField.classList.remove("result-shown");
    inputField.classList.remove("result-shown");
    if (symbol === "<=") {
        userInput = userInput.substring(0, userInput.length-1);
        if (userInput.length === 0) {
            validateInput(" ");
        } else {
            validateInput(userInput.at(userInput.length - 1));
        }
        if (userInput[userInput.length - 1] === "x" || userInput[userInput.length - 1] === "/" || userInput[userInput.length - 1] === "+" || userInput[userInput.length - 1] === "-" || userInput[userInput.length - 1] === ".")  {
            result = parseInput(userInput.substring(0, userInput.length-1));
        } else {
            result = parseInput(userInput);
        }
        updateDisplay();
        return;
    }

    if (validateInput(symbol)) {
        if (symbol === "AC") {
            userInput = "";
            result = "";
            updateDisplay();
            return;
        }
        if (symbol !== "." || symbol !== "+" || symbol !== "-" || symbol !== "x" || symbol !== "/" ) {
            userInput += symbol;
            result = parseInput(userInput);
        } else { userInput += symbol; }
        updateDisplay();
    }

    if (symbol === "=") {
        resultField.classList.add("result-shown");
        inputField.classList.add("result-shown");
    }
}

function validateInput(symbol) {

    if (symbol === " ") {
        numAvailable = true;
        operatorAvailable = false;
        dotAvailable = true;
        percentAvailable = false;
        minusAvailable = true;
        return true;
    }

    if (symbol === "1" || symbol === "2" || symbol === "3" || symbol === "4" || symbol === "5" || symbol === "6"
        || symbol === "7" || symbol === "8" || symbol === "9" || symbol === "0" || symbol === "00") {
        if (numAvailable) {
            operatorAvailable = true;
            numAvailable = true;
            percentAvailable = true;
            minusAvailable = true;
            return true;
        }
        return false;
    }
    else if (symbol === "+" || symbol === "x" || symbol === "/") {
        if (operatorAvailable) {
            operatorAvailable = false;
            percentAvailable = false;
            dotAvailable = true;
            numAvailable = true;
            minusAvailable = true;
            return true;
        }
        return false;
    }
    else if (symbol === "-") {
        if (minusAvailable) {
            operatorAvailable = false;
            numAvailable = true;
            dotAvailable = true;
            percentAvailable = false;
            minusAvailable = false;
            return true;
        }
        return false;
    }

    else if (symbol === ".") {
        if (dotAvailable) {
            operatorAvailable = false;
            percentAvailable = false;
            numAvailable = true;
            dotAvailable = false;
            minusAvailable = false;
            return true;
        }
        return false;
    }
    else if (symbol === "%") {
        if (percentAvailable) {
            operatorAvailable = true;
            percentAvailable = false;
            numAvailable = false;
            dotAvailable = false;
            minusAvailable = false;
            return true;
        }
        return false;
    }
    else if (symbol === "AC") {
        numAvailable = true;
        operatorAvailable = false;
        dotAvailable = true;
        percentAvailable = false;
        minusAvailable = true;
        return true;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
        handleButtonClick("<=");
        return;
    }
    if (e.key === "Enter") {
        handleButtonClick("=")
        return;
    }
    handleButtonClick(e.key);
});