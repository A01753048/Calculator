let inputField = document.getElementById("input");
let resultField = document.getElementById("result");
let userInput = "";
let result = "";

add = (a,b) => {
    return a + b;
}

substract = (a,b) => {
    return a - b;
}

multiply = (a,b) => {
    return a * b;
}

divide = (a,b) => {
    return a * b;
}

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
            if (indexes.includes(Number(i)-1)) {
                continue;
            }
            indexes.push(Number(i));
        }
    }
    indexes.push(input.length);
    return indexes;
}

function handleDecimals(input) {
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
                    console.log(res);
                    convertedInput = res + convertedInput.substring(indexes[i] + 1, convertedInput.length);
                    break;
                }
                lhsNum = convertedInput.substring(indexes[i-1]+1, indexes[i]);
                res = (Number(lhsNum) / 100).toString();
                convertedInput = convertedInput.substring(0, indexes[i-1]+1) + res + convertedInput.substring(indexes[i+1], convertedInput.length);
                console.log(convertedInput);
                break;
            }
        }
    }

    while(convertedInput.includes("/")) {
        indexes = getIndexes(convertedInput);
        for (let i = 0; i < indexes.length; i++) {
            if (convertedInput[indexes[i]] === "/") {
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

parseInput = (input) => {

    if (input[input.length - 1] === "x" || input[input.length - 1] === "/" || input[input.length - 1] === "+" || input[input.length - 1] === "-") {
        return result;
    }

    input = handleDecimals(input);
    console.log("Converted input on decimals: " + input);

    let lhsNum = "";
    let rhsNum = "";
    let convertedInput = input;
    let lastOperatorIndex = -1;
    let res = "";

    let indexes = getIndexes(input);

    for (let i in indexes) { //First loop for multiplication and division
        if (input[indexes[i]] === "x" || input[indexes[i]] === "/") {
            if (i === "0") {
                lhsNum = input.substring(0, indexes[i]);
                rhsNum = input.substring(indexes[i] + 1, indexes[Number(i) + 1]);
                res = operate(Number(lhsNum), Number(rhsNum), input[indexes[i]]).toString();
                convertedInput = res.toString() + " ".repeat(lhsNum.length + rhsNum.length + 1 - res.length) + input.substring(indexes[Number(i + 1)], input.length);
                continue;
            }


            if (indexes[i] === input.length) {
                break;
            }

            if (input[indexes[Number(i) - 1]] === "x" || input[indexes[Number(i) - 1]] === "/") {
                lhsNum = convertedInput.substring(lastOperatorIndex + 1, indexes[i]);
                rhsNum = convertedInput.substring(indexes[i] + 1, indexes[Number(i) + 1]);
                res = operate(Number(lhsNum), Number(rhsNum), input[indexes[i]]).toString();
                convertedInput = convertedInput.substring(0, lastOperatorIndex + 1) + res + " ".repeat(lhsNum.length + rhsNum.length - res.length + 1) + convertedInput.substring(indexes[Number(i) + 1], input.length);
                continue;
            }

            lhsNum = convertedInput.substring(indexes[Number(i - 1)] + 1, indexes[i]);
            rhsNum = convertedInput.substring(indexes[i] + 1, indexes[Number(i) + 1]);
            res = operate(Number(lhsNum), Number(rhsNum), input[indexes[i]]).toString();
            convertedInput = convertedInput.substring(0, indexes[Number(i) - 1] + 1) + res + " ".repeat(lhsNum.length + rhsNum.length + 1 - res.length) + convertedInput.substring(indexes[Number(i) + 1], input.length);

            lastOperatorIndex = indexes[Number(i) - 1];
        }
    }

    indexes.length = 0;
    console.log(convertedInput);

    indexes = getIndexes(convertedInput);
    console.log(indexes);

    for (let i in indexes) {
        if (indexes[i] === convertedInput.length) {
            return convertedInput.trim();
        }
        lhsNum = convertedInput.substring(0, indexes[i]);
        rhsNum = convertedInput.substring(indexes[i] + 1, indexes[Number(i) + 1]);
        res = operate(Number(lhsNum), Number(rhsNum), convertedInput[indexes[i]]).toString();
        convertedInput = res.toString() + " ".repeat(lhsNum.length + rhsNum.length + 1 - res.length) + convertedInput.substring(indexes[Number(i) + 1], input.length);
    }
}

let numAvailable = true;
let operatorAvailable = true;
let dotAvailable = true;
let percentAvailable = false;
let minusAvailable = true;

function handleButtonClick(symbol) {
    resultField.classList.remove("result-shown");
    inputField.classList.remove("result-shown");
    if (symbol === "<=") {
        validateInput(userInput.at(userInput.length-2));
        userInput = userInput.substring(0, userInput.length-1);
        result = parseInput(userInput);
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

    if (symbol === "1" || symbol === "2" || symbol === "3" || symbol === "4" || symbol === "5" || symbol === "6"
        || symbol === "7" || symbol === "8" || symbol === "9" || symbol === "0" || symbol === "00") {
        if (numAvailable) {
            operatorAvailable = true;
            numAvailable = true;
            percentAvailable = true;
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
    }else if (symbol === "-") {
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
        operatorAvailable = true;
        dotAvailable = true;
        percentAvailable = false;
        minusAvailable = true;
        return true;
    }
}