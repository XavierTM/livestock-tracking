

// const DmsCoordinates = require('dms-conversion');
const SCRIPT_ID = 'brtforce-gmap-script';


async function getGoogleMapsScript() {
	if (isGoogleMapsScriptAvailable())
		return;

	const script = document.createElement('script');
	script.setAttribute('id', SCRIPT_ID);
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDCHVEW419nFc2wjmO6eYEgQXyAoJy62dE&libraries=&v=weekly';
	

	return new Promise((resolve, reject) => {

		script.onload = resolve;
		script.onerror = reject;

		document.body.append(script);

	});

}


function isGoogleMapsScriptAvailable() {
	return document.getElementById(SCRIPT_ID) !== null;
}


function decimalAngleToDMS(angle) {

	angle = Math.abs(angle);

	const d = parseInt(angle);
	const minutes = 60 * (angle - d);
	const m = parseInt(minutes);
	const seconds = 60 * (minutes - m);
	const s = parseInt(seconds);

	return `${d}°${m}'${s}''`;

}


function latLongToString({ lat, long }) {
	// const dmsCoords = new DmsCoordinates(lat, long);
	// return dmsCoords.toString();

	const latDMS = decimalAngleToDMS(lat);
	const longDMS = decimalAngleToDMS(long);

	const latDrxn = lat > 0 ? 'N' : 'S';
	const longDrxn = long > 0 ? 'E' : 'W';

	return `${latDMS} ${latDrxn}, ${longDMS} ${longDrxn}`;
}


export {
	getGoogleMapsScript,
	latLongToString
}