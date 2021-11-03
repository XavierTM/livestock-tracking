

import Component from './Component';
import { v4 as uuid } from 'uuid';



class GoogleMapWithMarker extends Component {


	constructor(props) {
		// code...
		super(props)
		this.id = uuid();
		this.script_id = 'brtforce-gmap-script';
	}


	updateMarkerAndCenterPosition() {

		try {
			const { lat, long:lng } = this.props;
			const location = { lat, lng };	
		
			this.map.setCenter(location);
			this.marker.setPosition(location);
		} catch (err) {
			console.log(err);			
		}


	}


	createMapAndMarker() {

		try {

			const { lat, long:lng } = this.props;
			const location = { lat, lng };
			const id = this.props.id || this.id;
			
			const map = new window.google.maps.Map(document.getElementById(id), {
				zoom: 14,
				center: location,
			});

			const marker = new window.google.maps.Marker({
				position: location,
				map,
				icon: '/img/cowson.png'
			});


			this.map = map;
			this.marker = marker;

		} catch (err) {
			console.log(err);
		}
	}


	componentDidUpdate(prevProps) {

		const { props } = this;

		if (prevProps.lat !== props.lat || prevProps.long !== props.long)
			this.updateMarkerAndCenterPosition();


	}

	componentDidMount() {

		if (document.getElementById(this.script_id) === null) {

			const script = document.createElement('script');
			script.setAttribute('id', this.script_id);
			script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDCHVEW419nFc2wjmO6eYEgQXyAoJy62dE&libraries=&v=weekly';
			
			const self = this;

			script.onload = function() {
				self.createMapAndMarker();
				self.updateMarkerAndCenterPosition();
			}


			script.async = true;
			document.body.append(script);
		} else {
			this.updateMarkerAndCenterPosition();
		}
	}

	render() {

		return <div
			style={{
				height: '500px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				margin: 20
			}}
			id={this.props.id || this.id}
		>
			<span style={{ color: 'grey', fontSize: 20, fontFamily: 'Arial' }}>The location will be displayed here.</span>
		</div>
	}
}


export default GoogleMapWithMarker;