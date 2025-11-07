import nodemailer from "nodemailer";

const formatLeaveType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const sendMail = async (email, password, username)=>{

    console.log(email)
        try {
            // Create a transporter for Gmail
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "samuelfernandes10001@gmail.com",
                    pass: "hkkb rnkb qeqa jtmy", // 🔑 Use an App Password (NOT your regular Gmail password)
                },
            });

            // Send mail
            const info = await transporter.sendMail({
                from: '"Samuel Fernandes" <samuelfernandes10001@gmail.com>',
                to: email,
                subject: "Login Credentials",
                text: "Hello world?",
                html: `<p>Hello world <b>${username}</b> Your login credentials are Email: <b>${email}</b> and Password: <b>${password}</b> . Please change it later on for security purposes</p>`,
            });

            console.log("✅ Message sent:", info.messageId);
        } catch (err) {
            console.error("❌ Error sending email:", err);
        }

}

export const sendMailForLeave = async (email, leaveDetails)=>{
    try {
        // Create a transporter for Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "samuelfernandes10001@gmail.com",
                pass: "hkkb rnkb qeqa jtmy", // 🔑 Use an App Password (NOT your regular Gmail password)
            },
        });

        // Send mail
        const info = await transporter.sendMail({
            from: '"Samuel Fernandes" <samuelfernandes10001@gmail.com>',
            to: email,
            subject: leaveDetails.status === "ACCEPTED"?"Leave Accepted":"Leave Rejected",
            html: `<p>Hello <b>${leaveDetails.username}</b> Your leave for ${formatLeaveType(leaveDetails.leaveType) } for the reason ${leaveDetails.reason} from ${formatDate(leaveDetails.startDate)} to ${leaveDetails.endDate} is ${leaveDetails.status}</p>`,
        });

        console.log("✅ Message sent:", info.messageId);
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
}


