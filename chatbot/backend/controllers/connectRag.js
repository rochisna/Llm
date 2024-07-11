const { PythonShell } = require("python-shell");

async function queryingFromRag(query) {
  let pyshell = await new PythonShell(
    "./controllers/RAG.PY",
    { mode: "text" }
  );
  // sends a message to the Python script via stdin
  // console.log(originalData)
  pyshell.send(query);

  pyshell.on("message", function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(typeof message);
    temp1 = message;
    res.send(message);
    console.log(query);
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) throw err;
    console.log("The exit code was: " + code);
    console.log("The exit signal was: " + signal);
    console.log("finished");
  });
}

module.exports = { queryingFromRag };
