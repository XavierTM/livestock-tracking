
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Component from './Component';
import Button from '@mui/material/Button';
import { v4 as uuid } from 'uuid';
import { hideLoading, showLoading } from './LoadingIndicator';
import axios from 'axios';
import { getGoogleMapsScript } from '../utils';


function getLocation() {
	return new Promise((resolve, reject) => {
		return navigator.geolocation.getCurrentPosition(resolve, reject, {
			enableHighAccuracy: true,
		});
	})
}


class LocationPicker extends Component {


	async createMapAndMarker() {

		if (this.map && this.marker)
			return;

		try {

			const { lat, long:lng } = this.props;
			const location = { lat, lng };
			const id = this.props.id || this.id;

			await getGoogleMapsScript();

			const elem = document.getElementById(id);			
			const map = new window.google.maps.Map(elem, {
				zoom: 14,
				center: location,
			});

			const marker = new window.google.maps.Marker({
				position: location,
				map,
				// icon: '/img/cowson.png'
			});


			this.map = map;
			this.marker = marker;

			// click event
			map.addListener('click', this.mapOnClickHandler);


		} catch (err) {
			console.log(err);
		}
	}

	updateCenterLocation({ lat, long }) {

		const position = { lat, lng: long };

		this.marker.setPosition(position);
		this.map.setCenter(position);

		this.lat = lat;
		this.long = long;

	}

	mapOnClickHandler({ latLng }) {
		const lat = latLng.lat();
		const long = latLng.lng();
		
		this.updateCenterLocation({ lat, long });
	}

	async componentDidUpdate(prevProps) {

		if (!prevProps.open && this.props.open) {
			await this.createMapAndMarker();
		}
	}

	async selectThisLocation() {

		showLoading();
		// check permissions
		const permission = await navigator.permissions.query({ name: 'geolocation' });

		if (permission.state === 'denied')
			return alert("You need to allow the website to access your location for this to work.");

		const location = await getLocation();
		const { latitude:lat, longitude:long } = location.coords;
		this.updateCenterLocation({ lat, long });

		hideLoading();
	}


	async submitCenterLocation() {

		const { lat, long } = this;

		try {

			await axios.post('/api/center', { lat, long });
			this.props.updateCenterLocation({ lat, long });
			this.props.close();

		} catch (err) {
			alert("Something went wrong, please try again.");
		}

	}


	constructor(props) {
		// code...
		super(props)
		this.id = uuid();
		this.script_id = 'brtforce-gmap-script';

		this.mapOnClickHandler = this.mapOnClickHandler.bind(this);
		this.selectThisLocation = this.selectThisLocation.bind(this);
		this.submitCenterLocation = this.submitCenterLocation.bind(this);

	}



	async componentDidMount() {

		this.lat = this.props.lat;
		this.long = this.props.long;

		try {
			await getGoogleMapsScript();
		} catch (err) {
			console.log(err.toString());
		}

	}


	render() {
		return <Dialog
			open={this.props.open}
			maxWidth={"xl"}
		>

			<DialogTitle>PICK YOUR GEOFENCING CENTER</DialogTitle>

			<DialogContent>

				<div 
					id={this.props.id || this.id}
					style={{
						width: 'calc(0.7 * var(--window-width))',
						height: 'calc(0.5 * var(--window-height))',
					}}
				>

				</div>
			</DialogContent>

			<DialogActions>
				<Button onClick={this.selectThisLocation}>
					THIS LOCATION
				</Button>

				<Button
					onClick={this.submitCenterLocation}
					variant={"contained"}
				>
					submit
				</Button>

				<Button
					onClick={this.props.close}
				>
					close
				</Button>

			</DialogActions>
		</Dialog>
	}
}


export default LocationPicker;