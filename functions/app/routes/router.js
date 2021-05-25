var express = require("express");
var { TokenGenerator } = require("../controllers/token_generator");
const { InvalidParamsException } = require("../utils/exceptions");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("hello type script");
});

/* Generate Agora RTC Token */
router.post("/token", (req, res, next) => {
  const { app_id, app_certificate, uid, channel, role } = req.body;

  var generator = new TokenGenerator(app_id, app_certificate);

  try {
    var result = generator.process(uid, channel, role);

    res.status(200).send({
      success: "Token generated!",
      ...result,
    });
  } catch (e) {
    if (e instanceof InvalidParamsException) res.status(401).send(e.toJson());
    res.status(500).send(e);
  }
});

module.exports = router;
