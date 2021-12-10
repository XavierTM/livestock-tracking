
'use strict'

const nodemailer = require('nodemailer');

let transporter;

async function sendEmail( {to, subject, text, html, from }) {

	if (transporter === undefined)
		throw new Error('Not Initialized.');

	const mailOptions = { from, to, subject, text, html };
	await transporter.sendMail(mailOptions);
	
}

function init({ host, credentials, service, port }) {
	transporter = nodemailer.createTransport({
		host,
		service,
		auth: {
			user: credentials.username,
			pass: credentials.password
		},
		tls: {
			rejectUnauthorized: false
		},
		port
	});
}

module.exports = { 
	init,
	sendEmail,
};