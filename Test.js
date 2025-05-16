fetch("http://127.0.0.1:8000/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "What is AI?" })
})
.then(response => response.json())
.then(data => console.log(data));
