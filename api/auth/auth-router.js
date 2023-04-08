const router = require("express").Router();
const {
  validatePayload,
  passwordCheck,
  usernameCheck,
} = require("./auth-middleware");
const userModel = require("../models/user-model");
const bcryptjs = require("bcryptjs");
const utils = require("../../secrets/utils");

router.post("/register", validatePayload, async (req, res, next) => {
  try {
    let inserted = await userModel.insert({
      username: req.body.username,
      password: bcryptjs.hashSync(req.body.password, 8),
      rolename: req.body.rolename,
    });
    res.status(201).json(inserted);
  } catch (error) {
    next(error);
  }

  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
});

router.post(
  "/login",
  validatePayload,
  usernameCheck,
  passwordCheck,
  async (req, res, next) => {
    try {
      const payload = {
        username: req.body.username,
        rolename: req.body.rolename,
      };
      const token = utils.createUserToken(payload, "1d");
      res.json({ message: `welcome ${payload.username}`, token: token });
    } catch (error) {
      next(error);
    }
    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
  }
);

module.exports = router;
