const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// create a rotating write stream
let accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});

// setup the logger
app.use(morgan('common', { stream: accessLogStream }));

router.route("/index")
    .get((req, res) => {
        res.status(200).send("ok !");
    });


router.get("*", (req, res) => {
    res.status(404).send("NOT FOUND !");
})

app.use(router);

app.use((err, req,res, next) => {
   console.error(err.stack);
   res.status(500).send("500 ERROR !");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})