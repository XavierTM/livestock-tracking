

'use strict';

console.clear();


const express = require('express');
const cors = require('cors');


const app = express();

// globals
let location = { lat: -17.8307484, long: 31.04977643 }

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
	location = { lat, long };
	res.send();
	// console.log(location);
});


app.get('/api/coordinates', function(req, res) {
	res.send(location);
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
	console.log('Server started on PORT', PORT);
});