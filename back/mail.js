const nodemailer = require("nodemailer");

const mail = (receiver, secret, id) => {
	// now send an email to verify
	let transporter = nodemailer.createTransport({
		host: "smtp.mail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		logger: true,
		debug: true,
		auth: { user: "ideopunk@mail.com", pass: process.env.PASS },
		// tls: {
		// 	rejectUnauthorized: false,
		// 	ignoreTLS: false,
		// 	requireTLS: true,
		// 	minVersion: "TLSv1",
		// },
	});

	console.log("transporter created");
	let message = {
		from: "ideopunk@mail.com",
		to: receiver,
		subject: "Email verification",
		html: `<p>Hi there! It looks like you've registered for Conor Barnes's Node blog project. \
				To verify your account, paste the code below onto the site:</p>
				
                <p>${secret}</p>`,
	};

	console.log("message created");

	transporter.sendMail(message, (err, info) => {
		if (err) {
			console.log("err");
			console.error;
		} else {
			console.log("mail sent" + info.response);
			res.json("success");
		}
	});
};

module.exports = mail;
