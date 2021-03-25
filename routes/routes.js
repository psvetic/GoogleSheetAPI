const express = require('express');
const router = express.Router();
const { getRateOnDate, gsrun } = require("../handling-sheets")

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', async(req, res) => {
    res.sendFile(__dirname + '/index.html');
});

router.post('/', async function(req, res) {

    let rate = await getRateOnDate(req.body.datePicker, req.body.currency);

    let amount = parseFloat((rate.replace(",", ".")) * req.body.amount).toFixed(2);

    gsrun(req.body.datePicker, amount, req.body.company);

    var data = 'Congrats! You have submitted ' +
        req.body.amount + ' ' +
        req.body.currency + ' on this date: ' +
        req.body.datePicker + ', which equals ' +
        amount + ' kn. Money was from ' +
        req.body.company;

    res.send(data);
});

module.exports = router;