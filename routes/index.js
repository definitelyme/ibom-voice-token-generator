var express = require("express");
var { TokenGenerator } = require("../utils/token_generator");
// const { InvalidParamsException } = require("./exceptions");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Generate Agora RTC Token */
router.post("/token/generate", async function (req, res, next) {
  const { app_id, app_certificate, uid, channel, role } = req.body;

  var generator = new TokenGenerator(app_id, app_certificate);

  try {
    var result = await generator.process(uid, channel, role);

    res.status(200).send({
      success: "Token generated!",
      ...result,
    });
  } catch (e) {
    res.status(401).send(e.toJson());
  }
});

module.exports = router;
