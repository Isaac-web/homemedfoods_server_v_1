const jwt = require("jsonwebtoken");
const config = require("config");
const {User} = require("../models/User");

module.exports = (req, res, next) => {
    const header = req.headers["x-auth-token"]
    if(!header) return res.status(401).send("Access denied. No token provided.");

    try {
        let user = jwt.verify(header, config.get("auth.privateKey"));
        
        req.user = user;

        next();        
    }
    catch(err){

    }
    
}