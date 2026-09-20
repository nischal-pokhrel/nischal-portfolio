function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'short', year: 'numeric', month: 'short', 
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
  };
  const formatted = now.toLocaleString('en-US', options);
  document.getElementById('dateTime').textContent = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime();
