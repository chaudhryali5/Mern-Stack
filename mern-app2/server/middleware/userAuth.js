// import jwt from 'jsonwebtoken';

// export const userAuth = async (req, res, next) => {
//     const token = req.cookies.Authorization;
//     console.log(token)
//     if (!token) {
//         return res.send({ status: false, message: "Not Authorized .Login Again" })
//     }
//     try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         if (decodedToken.userId) {
//             req.body.userId = decodedToken.userId
//         } else {
//             return res.send({ status: false, message: "Not Authorized .Login Again" })
//         }
//         next();
//     } catch (error) {
//         return res.send({ status: false, message: "Something went wrong!" })
//     }
// }

import jwt from 'jsonwebtoken'
export const userAuth = async (req, res, next) => {
    const userToken = req.headers.authorization;

    if (!userToken) {
        return res.send({status: false, code: 401, message: "Unauthorized!"})
    }

    try {
        const token = userToken.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.send({status: false, code: 302, message: "User not loggedin"})
            }
            req.user = user
            next();
        })
    } catch (error) {
        return res.send({status: false, code: 500, message: "Something went wrong"})
    }
}