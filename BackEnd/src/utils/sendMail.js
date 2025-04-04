import nodemailer from "nodemailer";

async function sendMail(token, email) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: email,
    subject: "Verify your email",
    text: `Please Verify by clicking on this following link
        ${process.env.BASE_URL}/api/v1/users/verify/${token}
        `,
  };

  return await transporter.sendMail(mailOptions);
}

export default sendMail;
