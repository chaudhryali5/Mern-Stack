import bcrypt from 'bcrypt';
import Users from "../models/userScehma.js";  // matches your file name
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

export const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log('REGISTER ROUTE HIT!', { body: req.body });
    if (!name || !email || !username || !password) {
        return res.send({ status: false, message: "User details are missing" })
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


        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: newUser.email || email,
        //     subject:'   Welcome to Ali&Ali',
        //     text:`Welcome to Ali&Ali websites .Your account has been successfullt created 
        //     with email id :${email}`

        // };
        // await transporter.sendMail(mailOptions);
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

    try {
        // Find user by email OR username
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

        const token = jwt.sign({
            userId: user._id,
            useremail: user.email,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).send({
            status: true,
            message: "User logined successfull",
            token
        });

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

// export const verifyOtp = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         const user = await Users.findbyId(userId);
//         if (user.isAccountVerified) {
//             return res.send({ status: false, message: "Account is already verified" })
//         }
//         const otp = String(Math.floor(10000 + Math.random() * 90000));

//         user.verifyOtp = otp;
//         user.verifiedOtpExpAt = Date.now() + 24 * 60 * 60 * 1000;

//         await user.save();

//         const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account Vrification Otp',
//             text: `Your OTP is ${otp}.Verify your account with this OTP`
//         }
//         await transporter.sendMail(mailOption);
//         res.send({
//             status: true,
//             message: "Verification Otp sent on your Email"
//         })
//     } catch (error) {
//         res.send({ status: false, message: "something went wrong" });
//     }

// };

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.send({
            status: false,
            message: "Details Missing"
        })
    }
    try {
const user=await Users.findbyId(userId);
if (!user) {
    return res.send({status:false,message:"User not found"})
}
if (user.verifyOtp===''||user.verifyOtp!==otp) {
    return res.send({status:false,message:"Invalid otp"})
}
if (user.verifiedOtpExpAt<Date.now()) {
    return res.send({status:false,message:"OTP  expired"})
}

user.isAccountVerified=true;
user.verifyOtp='';
user.verifiedOtpExpAt=0;

await user.save();
return res.send({status:true,message:"Email verified Successfully"})


    } catch (error) {
        res.send({ status: false, message: "something went wrong" });
    }

}

export const verifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            return res.send({ status: false, message: "User not found" })
        }
        if (user.isAccountVerified) {
            return res.send({ status: false, message: "Account is already verified" })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifiedOtpExpAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification Otp',
            text: `Your OTP is ${otp}. Verify your account with this OTP. Valid for 10 minutes.`
        }
        await transporter.sendMail(mailOption);
        res.send({
            status: true,
            message: "Verification Otp sent on your Email"
        })
    } catch (error) {
        res.send({ status: false, message: "something went wrong" });
    }
};