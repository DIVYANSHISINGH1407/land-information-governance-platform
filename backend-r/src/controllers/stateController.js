const State = require("../models/State");
const ParcelImport = require("../models/ParcelImport");

async function getStates(req, res) {
  const [linkedStates, importedStateNames] = await Promise.all([
    State.find().sort({ name: 1 }).lean(),
    ParcelImport.distinct("state"),
  ]);
  const linkedNames = new Set(linkedStates.map((state) => state.name.toLowerCase()));
  const importedStates = importedStateNames
    .filter((name) => name && !linkedNames.has(name.toLowerCase()))
    .map((name) => ({ _id: `source|${name}`, name, source: "parcel_imports" }));
  const states = [...linkedStates, ...importedStates].sort((first, second) =>
    first.name.localeCompare(second.name),
  );

  res.json({ success: true, count: states.length, data: states, message: "States loaded." });
}

async function createState(req, res) {
  const state = await State.create({ name: req.body.name });

  res.status(201).json({ success: true, data: state });
}

module.exports = { getStates, createState };
