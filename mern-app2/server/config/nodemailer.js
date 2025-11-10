// import nodemailer from 'nodemailer';
// const transporter=nodemailer.createTransport({
// host:"smtp.gmail.com",
// port:587,
// secure: false, 
// auth:{
//     user:process.env.SMTP_USER,
//     pass:process.env.SMTP_PASSWORD,
// }
// });

// export default transporter;



import nodemailer from 'nodemailer'
export const sendEmail = async (userEmail, subject, content) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "send.ahasend.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Notes Taker" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: subject,
            html: content,
        });

        console.log("Message sent:", info.messageId);
    } catch (error) {
        console.log("Failed to send email: ", error);
    }
}