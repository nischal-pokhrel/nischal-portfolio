function append(value) {
  const display = document.getElementById("display");
  display.value += value;
  display.scrollLeft = display.scrollWidth; // Auto-scroll to end
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function deleteLast() {
  const display = document.getElementById("display");
  display.value = display.value.slice(0, -1);
}

function calculate() {
  const display = document.getElementById("display");
  try {
    const result = eval(display.value.replace('%', '/100'));
    display.value = result;
  } catch (e) {
    display.value = "Error";
  }
}

function goHome() {
  window.location.href = "../index.html"; 
}
