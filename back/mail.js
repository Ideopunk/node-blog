const nodemailer = require("nodemailer");

const mail = (receiver, secret, id) => {
	// now send an email to verify
	let transporter = nodemailer.createTransport(transport);

	let message = {
		from: "ideopunk@mail.com",
		to: receiver,
		subject: "Email verification",
		html:   `<p>Hi there! It looks like you've registered for Conor Barnes's Node blog project. \
                To verify your account, click this link: \
                <a href="localhost:3000/auth/${id}/${secret}">localhost:3000/auth/${id}/${secret}</a></p>`,
	};
	transporter.sendMail(message, (err) => {
		if (err) {
			console.log(err);
			return next(err);
		}

		res.redirect("/");
	});
};

export default mail;
