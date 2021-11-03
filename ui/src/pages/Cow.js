

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

		const { lat, long } = this.state.location;

		return <div>
			<h1 style={{ paddingLeft: 20 }}>LIVE LOCATION OF COW <span style={{ color: 'green' }}>1001</span></h1>

			<GoogleMapWithMarker
				lat={lat}
				long={long}
			/>
		</div>
	}
}


export default Cow;