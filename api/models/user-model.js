const db = require("../../data/dbConfig");

async function getAll() {
  return await db("users");
}

async function getByFilter(filter) {
  return await db("users as u")
    .leftJoin("roles as r", "r.role_id", "u.role_id")
    .select("u.*", "r.rolename")
    .where(filter)
    .first();
}

async function insert(user) {
  const { role_id } = await db("roles")
    .where("rolename", user.rolename)
    .first();
  const newUser = {
    username: user.username,
    password: user.password,
    role_id: role_id,
  };
  const insertedId = await db("users").insert(newUser);
  return getByFilter({ "u.user_id": insertedId[0] });
}

module.exports = { getAll, getByFilter, insert };
