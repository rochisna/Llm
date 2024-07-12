const { PythonShell } = require("python-shell");

async function queryingFromRag(req, res) {
  const query = req.body.query;
  let pyshell = await new PythonShell("./controllers/RAG.py", { mode: "text" });

  pyshell.send(query);

  pyshell.on("message", function (message) {
    res.send(message);
  });

  pyshell.end(function (err) {
    if (err) throw err;
  });
}

module.exports = { queryingFromRag };
