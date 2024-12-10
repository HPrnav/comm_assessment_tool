const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken")

const auth_middleware = (req, res, next) => {
    const auth_header = req.headers.authorization;

    if (!auth_header || !auth_header.startsWith('Bearer ')) {
        return res.status(400).json({
            msg: "invalid user"
        })
    }

    const token = auth_header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        // console.log("token "+token +"  "+JWT_SECRET)
        req.userid = decoded.userid;
        // console.log(req.userid+ "----> " + decoded)
        next();
    } catch (err) {
        return res.status(403).json({ msg: "error inside middleware" + err });
    }

}
module.exports = { auth_middleware }
