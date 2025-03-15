document.getElementById("fetchBtn").addEventListener("click", function() {
    let inputValue = document.getElementById("inputData").value;
    
    fetch("http://localhost:4000/patients/birthData", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `value=${encodeURIComponent(inputValue)}` // Send as form-encoded data
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("result").innerText = JSON.parse(data).bdata.BirthTime;
        
        // Send message to background script to fill input field
        chrome.runtime.sendMessage({ action: "fillInput", data: data });
    })
    .catch(error => {
        document.getElementById("result").innerText = "Error fetching data";
    });
});