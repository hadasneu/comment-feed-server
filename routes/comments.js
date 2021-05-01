const express = require("express");
const router = express.Router();
const inputValidatorMiddleware = require("../middlewares/inputValidatorMiddleware");
const commentsController = require("../controllers/commentsController");

router.get("/", commentsController.getComments);

router.post("/", inputValidatorMiddleware.emailAndContentValidator, commentsController.saveComment);

module.exports = router;
