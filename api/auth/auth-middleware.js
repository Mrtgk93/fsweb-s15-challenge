const bcryptjs = require("bcryptjs");
const userModel = require("../models/user-model");

const validatePayload = (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "username veya password eksik" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const usernameCheck = async (req, res, next) => {
  try {
    let { username } = req.body;
    const existUser = await userModel.getByFilter({ username: username });
    if (!existUser) {
      res.status(404).json({ message: "Böyle bir user yok" });
    } else {
      req.user = existUser;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const passwordCheck = (req, res, next) => {
  try {
    const { password } = req.body;
    let validPassword = bcryptjs.compareSync(password, req.user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Geçersiz kriter" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validatePayload,
  passwordCheck,
  usernameCheck,
};
