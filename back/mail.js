const nodemailer = require("nodemailer");

const mail = (receiver, secret, callback) => {
	// now send an email to verify
	let transporter = nodemailer.createTransport({
		host: "smtp.mail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		logger: true,
		debug: true,
		auth: { user: "ideopunk@mail.com", pass: process.env.PASS },
	});

	let message = {
		from: "ideopunk@mail.com",
		to: receiver,
		subject: "Email verification",
		html: `<p>Hi there! It looks like you've registered for Conor Barnes's Node blog project. \
				To verify your account, paste the code below onto the site:</p>
				
                <p>${secret}</p>`,
	};

	transporter.sendMail(message, (err, info) => {
		if (err) {
			console.log(err);
			callback(err);
		} else {
			console.log("info.response");
			console.log(info);
			console.log(info.response);
			callback(info.response);
		}
	});
};

module.exports = mail;
