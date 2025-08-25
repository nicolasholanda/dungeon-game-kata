const express = require("express");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-adapter-http"));

const app = express();
app.use(express.json());

// Test Local DB (em memória, pode usar 'leveldb' para persistência)
const localDB = new PouchDB("localdb");

// Test CouchDB remoto
const remoteDB = new PouchDB("http://admin:admin@localhost:5984/remotedb"); // ajuste usuário/senha/porta

// Test de Sincronização contínua
localDB
  .sync(remoteDB, {
    live: true,
    retry: true,
  })
  .on("change", (info) => {
    console.log("Sync change:", info);
  })
  .on("error", (err) => {
    console.error("Sync error:", err);
  });

// CRUD básico
app.post("/docs", async (req, res) => {
  try {
    const doc = req.body;
    const result = await localDB.put(doc);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/docs/:id", async (req, res) => {
  try {
    const doc = await localDB.get(req.params.id);
    res.json(doc);
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
});

app.get("/docs", async (req, res) => {
  const result = await localDB.allDocs({ include_docs: true });
  res.json(result.rows.map((r) => r.doc));
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
