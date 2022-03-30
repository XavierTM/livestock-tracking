

'use strict';

console.clear();


const express = require('express');
const cors = require('cors');
const { init:initMail, sendEmail } = require('./modules/email');
const { Storage, init: dbInit } = require('./db');



function status_500(err, res) {
	res.sendStatus(500);
	console.log(err);
}

async function outOfBoundsAlert() {
	await sendEmail({
		to: 'xaviermukodi@gmail.com, livestock.tracking.bruteforce@gmail.com, lsimoyi@gmail.com',
		from: 'Livestock Tracker <N0162736C@students.nust.ac.zw>',
		subject: 'Cow out of bounds',
		text: 'Cow 1001 is now out bounds',
	});
}


const app = express();

// globals
const center = { lat: -17.8307484, long: 31.04977643 };
let location = { lat: -17.8307484, long: 31.04977643, outOfBounds: false };
const GEO_FENCING_RADIUS = 10;

// helper functions
const { getDistance } = require('./utils')

// middleware
const corsOptions = {
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: true,
	optionsSuccessStatus: 200,
	credentials: true,
	allowedHeaders: 'Content-Type,openstack-xavisoft-auth-token',
	exposedHeaders: 'openstack-xavisoft-auth-token'
}


app.options('*', cors(corsOptions))
app.use(cors(corsOptions))
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// routes

app.post('/api/coordinates', async function(req, res) {


	try {

		const { lat, long } = req.body;
		const time = Date.now();

		// validate
		if (typeof lat !== 'number')		
			return res.status(400).send(`lat(${lat}) is of type '${typeof lat}'`);
		if (typeof long !== 'number')
			return res.status(400).send(`long(${long}) is of type '${typeof long}'`);

		const storage = await Storage.findOne();
		const distanceFromCenter = getDistance( { lat, long },  center);
		const radius = parseInt(storage.radius);

		const outOfBounds = distanceFromCenter > radius;
		const prevOutOfBounds = storage.outOfBounds;

		// update storage
		storage.outOfBounds = outOfBounds;
		storage.distanceFromCenter = distanceFromCenter;
		storage.coordinates = JSON.stringify({ lat, long });

		await storage.save();


		// sending the email if cow is out of bounds
		if (outOfBounds && !prevOutOfBounds) {
			await outOfBoundsAlert();
		}

		// sending the response
		res.send();

	} catch (err) {
		status_500(err, res);
	}

		
	
});


app.get('/api/coordinates', async function(req, res) {

	try {

		const storage = await Storage.findOne();
		const { lat, long } = JSON.parse(storage.coordinates);
		const { outOfBounds } = storage;
		const distanceFromCenter = parseInt(storage.distanceFromCenter)

		res.send({
			lat,
			long,
			outOfBounds,
			distanceFromCenter
		});

	} catch (err) {
		status_500(err, res);
	}

});


app.get('/api/geofencing-data', async function(req, res) {

	try {

		const storage = await Storage.findOne();
		const radius = parseInt(storage.radius);
		const center = JSON.parse(storage.center);

		res.send({ radius, center });

	} catch (err) {
		status_500(err, res);
	}

});

app.post('/api/center', async function(req, res) {

	try {

		const { lat, long } = req.body;

		if (typeof lat !== 'number')		
			return res.status(400).send(`lat(${lat}) is of type '${typeof lat}'`);
		if (typeof long !== 'number')
			return res.status(400).send(`long(${long}) is of type '${typeof long}'`);


		const storage = await Storage.findOne();
		const coordinates = JSON.parse(storage.coordinates);
		const radius = parseInt(storage.radius);

		const distanceFromCenter = getDistance({ lat, long }, coordinates);
		const outOfBounds = distanceFromCenter > radius;

		const prevOutOfBounds = storage.outOfBounds;


		// update storage
		storage.outOfBounds = outOfBounds;
		storage.distanceFromCenter = distanceFromCenter;
		storage.center = JSON.stringify({ lat, long});

		await storage.save();

		// sending the email if cow is out of bounds
		if (outOfBounds && !prevOutOfBounds) {
			await outOfBoundsAlert();
		}

		res.send();


	} catch (err) {
		status_500(err, res);
	}

});

app.post('/api/radius', async function(req, res) {


	const radius = parseInt(req.body.radius);

	if (typeof radius !== 'number')
		return res.status(400).send("Invalid radius");

	try {


		const storage = await Storage.findOne();
		storage.radius = radius;
		
		const coordinates = JSON.parse(storage.coordinates);
		const center = JSON.parse(storage.center);
		const distanceFromCenter = getDistance(center, coordinates);
		const prevOutOfBounds = storage.outOfBounds;
		storage.outOfBounds = distanceFromCenter > radius;

		await storage.save();

		if (storage.outOfBounds && !prevOutOfBounds)
			await outOfBoundsAlert();

		res.send();

	} catch (err) {
		status_500(err, res);
	}
});


const PORT = process.env.PORT || 8080;

initMail({
	service: 'gmail',
	credentials: {
		username: 'livestock.tracking.bruteforce@gmail.com',
		password: 'livetrack_2020'
	}
});


dbInit();

app.listen(PORT, function() {
	console.log('Server started on PORT', PORT);
});