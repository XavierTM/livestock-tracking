

import Page from './Page';
import GoogleMapWithMarker from '../components/GoogleMapWithMarker';
import axios from 'axios';

class Cow extends Page {


	constructor(props) {
		super(props);

		this.updateLocation = this.updateLocation.bind(this);
	}


	async updateLocation() {

		try {
			const response = await axios.get('/api/coordinates');
			const location = response.data;

			this._updateState({ location });
		} catch (err) {
			console.log(err);
		}
	}


	state = {
		location: {lat: 0 , long: 0 }
	}

	_componentDidMount() {
		setInterval(this.updateLocation, 3000);
		// this.updateLocation();
	}

	_render() {

		const { lat, long, outOfBounds=false } = this.state.location;

		let radiusStatusColor, radiusStatusText;
		if (outOfBounds) {
			radiusStatusText = 'OUT OF BOUNDS';
			radiusStatusColor = 'red';
		} else {
			radiusStatusText = 'IN RADIUS';
			radiusStatusColor = 'green';
		}

		return <div>
			<h1 style={{ paddingLeft: 20 }}>LIVE LOCATION OF COW <span style={{ color: 'green' }}>1001</span></h1>
			<h3 style={{ paddingLeft: 20 }}>STATUS: <span style={{ color: radiusStatusColor }}>{radiusStatusText}</span></h3>

			<GoogleMapWithMarker
				lat={lat}
				long={long}
			/>
		</div>
	}
}


export default Cow;