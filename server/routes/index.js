const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    //Combine Routes with Socket
    const io = req.app.get("socketIo");
    //io.sockets.emit("helloWorld", { fromRouter: true })
    res.send({ response: "I am alive" }).status(200);
});

module.exports = router