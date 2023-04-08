/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const defBilmeceler = require("../../api/bilmeceler/bilmeceler-data");
const defRoles = [{ rolename: "admin" }, { rolename: "user" }];
const defUsers = [
  {
    username: "mertgok",
    password: "$2a$08$g2w139CcnT46xKKzNiAu2.Atep8AcgsHGDxfNoG2ClfeaBDIPh9em",
    role_id: 1,
  },
  {
    username: "mert",
    password: "$2a$08$g2w139CcnT46xKKzNiAu2.Atep8AcgsHGDxfNoG2ClfeaBDIPh9em",
    role_id: 2,
  },
];
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("riddles").truncate();
  await knex("users").truncate();
  await knex("roles").truncate();

  await knex("riddles").insert(defBilmeceler);
  await knex("roles").insert(defRoles);
  await knex("users").insert(defUsers);
};
