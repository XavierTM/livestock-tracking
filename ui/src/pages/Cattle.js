
import Page from './Page';
import Component from '../components/Component';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { latLongToString } from '../utils';
import RadiusModal from '../components/RadiusModal';
import axios from 'axios';


class Cattle extends Page {


	constructor(...args) {

		super(...args);

		this.openLocationPicker = this.openLocationPicker.bind(this);
		this.closeLocationPicker = this.closeLocationPicker.bind(this);
		this.updateCenterLocation = this.updateCenterLocation.bind(this);
		this.fetchCenterAndRadius = this.fetchCenterAndRadius.bind(this);
		this.openRadiusModal = this.openRadiusModal.bind(this);
		this.closeRadiusModal = this.closeRadiusModal.bind(this);
		this.updateRadius = this.updateRadius.bind(this);

	}

	updateRadius(radius) {
		this._updateState({ radius });
	}

	updateCenterLocation({ lat, long }) {
		this._updateState({ center: { lat, long } });
	}


	openLocationPicker() {
		this._updateState({ locationPickerOpen: true });
	}

	closeLocationPicker() {
		this._updateState({ locationPickerOpen: false });
	}

	closeRadiusModal() {
		this._updateState({ radiusModalOpen: false });
	}

	openRadiusModal() {
		this._updateState({ radiusModalOpen: true });
	}


	async fetchCenterAndRadius() {

		try {
			const response = await axios.get('/api/geofencing-data');
			const { center, radius } = response.data;

			await this._updateState({
				center,
				radius,
				dataLoaded: true
			});

		} catch (err) {
			await this._updateState({
				errorMessage: 'Something went wrong!'
			})
		}
	}


	state = {
		locationPickerOpen: false,
		center: { lat: 0, long: 0 },
		radius: 10,
		dataLoaded: false,
		errorMessage: '',
		radiusModalOpen: false
	}

	_componentDidMount() {
		this.fetchCenterAndRadius();
	}


	_render() {


		let errorJSX;

		if (!this.state.dataLoaded) {
			errorJSX = <div

				style={{
					width: '100%',
					height: 'calc(var(--window-height) - var(--navbar-height))',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<span>
					Something went wrong.
					<br />
					<Button onClick={this.fetchCenterAndRadius}>
						retry
					</Button>
				</span>
			</div>
		}

		return errorJSX || <div style={{ padding: 10 }}>

			<h1 style={{ color: 'grey' }}>GEOFENCING</h1>

			<Grid container>
				<Grid item xs={12} sm={6}>
					<h4>CENTER</h4>

					<Location
						lat={this.state.center.lat}
						long={this.state.center.long}
					/>

					<br />

					<Button 
						onClick={this.openLocationPicker}
					>
						CHANGE
					</Button>

					<LocationPicker
						lat={0}
						long={0} 
						open={this.state.locationPickerOpen}
						close={this.closeLocationPicker}
						updateCenterLocation={this.updateCenterLocation}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>

					<h4>RADIUS</h4>

					<span style={{ fontSize: '40px'}}>
						<span style={{ color: 'grey' }}>
							{(parseInt(this.state.radius)||0).toLocaleString() + " metres"}
						</span>
					</span>

					<br />

					<Button onClick={this.openRadiusModal}>CHANGE</Button>

					<RadiusModal
						radius={this.state.radius}
						open={this.state.radiusModalOpen}
						close={this.closeRadiusModal}
						updateRadius={this.updateRadius}
					/>

				</Grid>
			</Grid>

			<hr />


			<h1 style={{ color: 'grey' }}>REGISTERED CATTLE</h1>

			<Grid container>
				<Grid item xs={12} sm={6} md={4}>
					<CowThumbnail />
				</Grid>
			</Grid>
		</div>
	}
}


class CowThumbnail extends Component {

	render() {

		return <div
			style={{
				padding: 20
			}}
		>
			<Grid
				style={{
					border: '1px blue solid',
				}}
				container
			>

				<Grid item xs={9}>
					<div
						style={{
							height: '100%'
						}}
						className="vh-align"
					>
						<h4>1001</h4>
					</div>
				</Grid>

				<Grid item xs={3}
				>
					<div
						style={{
							height: '100%'
						}}
						className="vh-align"
					>
						<Button
							variantt="contained"
							component={Link}
							to="/cattle/1001"
						>
							TRACK
						</Button>
					</div>
				</Grid>
			</Grid>
		</div>
	}
}



class Location extends Component {


	constructor(...args) {
		super(...args);
		this.resolveCoordinates = this.resolveCoordinates.bind(this);
	}


	async resolveCoordinates() {

		const { lat, long } = this.props;

		await this._updateState({
			content: latLongToString({ lat, long })
		});
	}

	state = {
		content: 'Loading center...'
	}

	componentDidUpdate(prevProps) {

		if (this.props.lat !== prevProps.lat || this.props.long !== prevProps.long)
			this.resolveCoordinates();
	}


	componentDidMount() {
		this.resolveCoordinates();
	}


	render() {
		return <span
			title={this.state.content}
			style={{
				display: 'inline-block',
				width: '100%', 
				fontSize: '40px', 
				color: 'grey', 
				textOverflow: 'ellipsis', 
				overflow: 'hidden', 
				whiteSpace: 'nowrap',
			}}
		>
			{this.state.content}
		</span>		
	}
}


export default Cattle;