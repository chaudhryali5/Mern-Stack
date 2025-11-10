import bcrypt from 'bcrypt';
import Users from "../models/userScehma.js";  // matches your file name
import jwt from 'jsonwebtoken';
import validator from 'validator';
// import transporter from '../config/nodemailer.js';
import { sendEmail } from '../config/nodemailer.js';

export const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log('REGISTER ROUTE HIT!', { body: req.body });
    if (!name || !email || !username || !password) {
        return res.send({ status: false, message: "User details are missing" })
    }

    const isValidePattern = validator.isEmail(email)
    if (!isValidePattern) {
        return res.send({ status: false, code: 302, message: "Email pattern will be example@email.com" })
    }
    try {
        console.log(' Looking for existing user with email:', email, username);
        const user = await Users.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });
        console.log("found user:", user);

        if (user) {
            if (user.email === email && user.username === username) {
                console.log(' Email already taken:', email, username);
                return res.send({ status: false, message: "Both email and userName already exist" });
            }
            if (user.email === email) {
                return res.send({ status: false, message: "Email already exists" });
            }
            if (user.username === username) {
                return res.send({ status: false, message: "Username already exists" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const myHashPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            name,
            email,
            username,
            password: myHashPassword
        });

        console.log('4. Saving user to DB...');
        const result = await newUser.save();
        console.log('created user:', result);

        if (result) {
            return res.send({ status: true, message: "Registered Successfully" });
        } else {
            return res.send({ status: false, message: "Not registered" });
        }

    } catch (error) {
        console.error('REGISTER ERROR:', error);
        return res.status(500).send({ status: false, message: "Something went wrong" });
    }
};

export const loginUser = async (req, res) => {
    const { email, username, password } = req.body;
    if (!password || (!email && !username)) {
        return res.send({ status: false, message: "Email or Useranme required" })
    }
    const isValidePattern = validator.isEmail(email)
    if (!isValidePattern) {
        return res.send({ status: false, code: 302, message: "Email pattern will be example@email.com" })
    }
    try {
        const user = await Users.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (!user) {
            return res.send({ status: false, message: "User not found" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.send({ status: false, message: "Password is incorrect" });
        }
        const content = `
        <h1>You have successfully loggedin to our system</h1>
        `;

        const token = jwt.sign({
            userId: user._id,
            useremail: user.email,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        if (token) {
            sendEmail('chaudhryali2285@gmail.com', "Login Successful! ✨🎉", content)
            return res.send({ status: true, code: 200, message: "User loggedin successful", token })
        } else {
            return res.send({ status: false, message: "Logging failed" })
        }

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.send({ status: false, message: "something went wrong" });
    }
};

export const Logout = async (req, res) => {

    try {
        res.clearCookie('userToken', {
            httpOnly: true,
            secure: false,
            path: '/'
        });
        return res.send({ status: true, message: "User Logout Successfully" });
    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        return res.send({ status: false, message: "something went wrong" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({email});
        if (user.isAccountVerified) {
            return res.send({ status: false, message: "Account is already verified" })
        }
        const otp = String(Math.floor(10000 + Math.random() * 90000));

        const content = `Enter this OTP to verify ur account`

        user.verifyOtp = otp;
        user.verifiedOtpExpAt = Date.now() + 24 * 60 * 60 * 1000;


        await user.save();

        if (user.verifyOtp) {
            sendEmail('chzain2285@gmail.com', "this is your OTP", content)
            res.send({
                status: true,
                message: "Verification Otp sent on your Email"
            })
        } else {
            res.send({
                status: true,
                message: "Verification Otp sent on your Email"
            })
        }
    } catch (error) {
        res.send({ status: false, message: "something went wrong" });
    }

};
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.send({
            status: false,
            message: "Details Missing"
        })
    }
    try {
        const user = await Users.findbyId(userId);
        if (!user) {
            return res.send({ status: false, message: "User not found" })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.send({ status: false, message: "Invalid otp" })
        }
        if (user.verifiedOtpExpAt < Date.now()) {
            return res.send({ status: false, message: "OTP  expired" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifiedOtpExpAt = 0;

        await user.save();
        return res.send({ status: true, message: "Email verified Successfully" })
    } catch (error) {
        res.send({ status: false, message: "something went wrong" });
    }

}

