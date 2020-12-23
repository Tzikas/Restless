const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    //Combine Routes with Socket
    const io = req.app.get("socketIo");

    //io.sockets.emit("fromRouter", { response: "I am alive" })
    res.send({ response: "I am alive" }).status(200);
});

module.exports = router