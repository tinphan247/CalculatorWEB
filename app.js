// app.js
document.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector(".main-display");
  const subDisplay = document.querySelector(".sub-display");
  const buttons = document.querySelectorAll(".btn");
  const historyPanel = document.querySelector(".history-panel");
  const historyIcon = document.getElementById("historyIcon");
  const historyList = document.querySelector(".history-list");
  const clearHistoryBtn = document.querySelector(".clear-history");

  let currentInput = "0";
  let previousInput = "";
  let operator = "";
  let lastOperator = "";
  let lastOperand = "";
  let resultDisplayed = false;
  let history = [];

  function updateDisplay(value) {
    display.textContent = value;
  }

  function updateSubDisplay(value) {
    subDisplay.textContent = value;
  }

  function clearAll() {
    currentInput = "0";
    previousInput = "";
    operator = "";
    lastOperator = "";
    lastOperand = "";
    resultDisplayed = false;
    updateDisplay(currentInput);
    updateSubDisplay("");
  }

  function clearEntry() {
    currentInput = "0";
    updateDisplay(currentInput);
  }

  function backspace() {
    if (resultDisplayed) return;
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "" || currentInput === "-") currentInput = "0";
    updateDisplay(currentInput);
  }

  function appendNumber(num) {
    if (resultDisplayed) {
      currentInput = num;
      resultDisplayed = false;
    } else if (currentInput === "0") {
      currentInput = num;
    } else {
      currentInput += num;
    }
    updateDisplay(currentInput);
  }

  function appendDot() {
    if (!currentInput.includes(".")) {
      currentInput += ".";
      updateDisplay(currentInput);
    }
  }

  function chooseOperator(op) {
    if (operator && !resultDisplayed) calculate();
    operator = op;
    previousInput = currentInput;
    currentInput = "0";
    resultDisplayed = false;
    updateSubDisplay(`${previousInput} ${operator}`);
  }

  // ✅ xử lý nút %
  function handlePercent() {
    let current = parseFloat(currentInput);
    if (previousInput && operator) {
      let prev = parseFloat(previousInput);
      currentInput = ((prev * current) / 100).toString();
    } else {
      currentInput = (current / 100).toString();
    }
    updateDisplay(currentInput);
  }

  function calculate() {
  let prev, current;
  let result = 0;

  // 🔹 THÊM MỚI: nếu người dùng bấm "=" liên tục
  if (resultDisplayed && lastOperator && lastOperand !== "") {
    prev = parseFloat(currentInput);
    current = parseFloat(lastOperand);
    operator = lastOperator;
  } 
  else if (operator === "" || previousInput === "") {
    return;
  } 
  else {
    prev = parseFloat(previousInput);
    current = parseFloat(currentInput);
    lastOperator = operator;
    lastOperand = currentInput;
  }

  // 🔹 THAY ĐỔI: luôn hiển thị phép tính đầy đủ
  let expression = `${prev} ${operator} ${current} =`;

  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "−":
      result = prev - current;
      break;
    case "×":
      result = prev * current;
      break;
    case "÷":
      result = current === 0 ? "Error" : prev / current;
      break;
  }

  // 🔹 CẬP NHẬT GIÁ TRỊ & HIỂN THỊ
  currentInput = result.toString();
  previousInput = "";
  resultDisplayed = true;

  updateDisplay(currentInput);
  updateSubDisplay(expression);

  // 🔹 Lưu phép toán gần nhất
  previousInput = result.toString();

  if (result !== "Error") addToHistory(expression, result);
  operator = ""; // reset sau khi tính
}


  function handleSpecial(op) {
    let num = parseFloat(currentInput);
    switch (op) {
      case "1/X":
        currentInput = num === 0 ? "Error" : (1 / num).toString();
        break;
      case "X²":
        currentInput = Math.pow(num, 2).toString();
        break;
      case "√x":
        currentInput = num < 0 ? "Error" : Math.sqrt(num).toString();
        break;
      case "±":
        currentInput = (num * -1).toString();
        break;
      default:
        return;
    }
    updateDisplay(currentInput);
    resultDisplayed = true;
  }

  function addToHistory(expr, res) {
    const item = { expression: expr, result: res };
    history.push(item);
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = "";
    history.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.expression} <strong>${item.result}</strong></span>`;
      historyList.appendChild(li);
    });
  }

  clearHistoryBtn.addEventListener("click", () => {
    history = [];
    renderHistory();
  });

  historyIcon.addEventListener("click", () => {
    historyPanel.classList.toggle("hidden");
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.textContent;

      if (!isNaN(value)) {
        appendNumber(value);
      } else if (value === ".") {
        appendDot();
      } else if (["+", "−", "×", "÷"].includes(value)) {
        chooseOperator(value);
      } else if (value === "=") {
        calculate();
      } else if (value === "%") {
        handlePercent();
      } else if (value === "C") {
        clearAll();
      } else if (value === "CE") {
        clearEntry();
      } else if (value === "←") {
        backspace();
      } else {
        handleSpecial(value);
      }
    });
  });

  updateDisplay(currentInput);
  updateSubDisplay("");
});
