import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.send({ status: false, message: "Not Authorized .Login Again" })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.userId) {
            req.body.userId = decodedToken.userId
        } else {
            return res.send({ status: false, message: "Not Authorized .Login Again" })
        }
        next();
    } catch (error) {
        return res.send({ status: false, message: "Something went wrong!" })
    }
}