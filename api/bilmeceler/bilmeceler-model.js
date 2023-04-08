const db = require("../../data/dbConfig");
const { v4: uuidv4 } = require("uuid");

async function getAll() {
  return await db("riddles");
}

async function getById(riddle_id) {
  return await db("riddles").where("id", riddle_id).first();
}
async function insert(riddle) {
  riddle.id = v4();
  await db("riddles").insert(riddle);
  return getById(riddle.id);
}

module.exports = { getAll, getById, insert };
