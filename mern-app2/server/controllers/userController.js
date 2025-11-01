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

        const mailOptions = {
            from: `"Ali&Ali" <${process.env.SENDER_EMAIL}>`, // must be the verified Brevo address
            to: email,
        
            subject: 'Welcome to Ali&Ali',
            text: `Hello ${name},\n\nYour account has been created successfully!\nEmail: ${email}\nUsername: ${username}`,
            html: `
        <h2>Welcome ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Username:</strong> ${username}</li>
        </ul>
        <p>Enjoy the platform!</p>
      `,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Welcome email sent:', info.messageId);
        } catch (mailErr) {
            console.error('MAIL SEND ERROR:', mailErr);
        }
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

        const userToken = jwt.sign({
            userId: user._id,
            useremail: user.email,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.cookie("userToken", userToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).send({
            status: true,
            message: "User logined successfull",
            userToken
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