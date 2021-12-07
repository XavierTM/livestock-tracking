

'use strict';

console.clear();


const express = require('express');
const cors = require('cors');


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

app.post('/api/coordinates', function(req, res) {

	const { lat, long } = req.body;

	if (!req.is('application/json'))
		console.log("Not JSON");

	if (typeof lat !== 'number')		
		return res.status(400).send(`lat(${lat}) is of type '${typeof lat}'`);
	if (typeof long !== 'number')
		return res.status(400).send(`long(${long}) is of type '${typeof long}'`);


	const distance = getDistance( { lat, long },  center);
	location = { lat, long, distance };
	location.outOfBounds = (distance > GEO_FENCING_RADIUS); 
	res.send();
	
});


app.get('/api/coordinates', function(req, res) {
	res.send(location);
});

app.post('/api/center', function(req, res) {
	const { lat, long } = req.body;


	if (typeof lat !== 'number')		
		return res.status(400).send(`lat(${lat}) is of type '${typeof lat}'`);
	if (typeof long !== 'number')
		return res.status(400).send(`long(${long}) is of type '${typeof long}'`);

	center.lat = lat;
	center.long = long;

	location.distance = getDistance(center, location);
	location.outOfBounds = location.distance > GEO_FENCING_RADIUS;

	res.send();
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
	console.log('Server started on PORT', PORT);
});