const express = require('express');
const router = express.Router();

//Generate a new dossier
router.post("/", async function(req, res){

});

//Activate an existing dossier
router.put("/", async function(req, res){

});

//Retrieve dossier info
router.get("/:dossierId", async function(req, res){

});

//Retrieve base information of all the dossiers
router.get("/", async function(req, res){

});

//Send a message for a specific dossier
router.post("/:dossierId/messages", async function(req, res){

});

module.exports = router;