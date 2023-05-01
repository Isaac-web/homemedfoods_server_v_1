const config = require("config");

const getMobileAppInfo = (req, res) => {
    const mobile = config.get("system.mobile");

    res.send({
        message: "Mobile info retrieved",
        payload: mobile
    });
}


module.exports.getMobileAppInfo = getMobileAppInfo;