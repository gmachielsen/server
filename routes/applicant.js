const express = require("express");

const router = express.Router();

// middleware 
const { requireSignin } = require("../middlewares");

// controller
const { makeApplicant, getApplicants, approveApplicant } = require("../controllers/applicant");

router.post("/application", requireSignin, makeApplicant);
router.get("/applicants", requireSignin, getApplicants);
router.post("/approved-applicant", requireSignin, approveApplicant);

module.exports = router;
