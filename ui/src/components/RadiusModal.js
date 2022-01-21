
import Component from './Component';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';


class RadiusModal extends Component {

	state = {
		values: {}
	}


	componentDidUpdate(prevProps) {

		// if the modal just opened
		if (prevProps.open !== this.props.open)
			this._updateState({
				values: {
					radius: this.props.radius
				}
			})
	}


	async submitRadius() {

		const radius = this.state.values.radius;

		if (!radius)
			return alert("Provide a valid radius.");

		try {
			await axios.post('/api/radius', { radius });
			await this.props.updateRadius(radius);
			await this.props.close();
		} catch (err) {
			alert("Something went wrong.");
		}
	}


	componentDidMount() {
		this._updateState({
			values: {
				radius: this.props.radius
			}
		});
	}

	constructor(...args) {
		super(...args);
		this.submitRadius = this.submitRadius.bind(this);
	}


	render() {


		return <Dialog open={this.props.open}>

			<DialogTitle>UPDATE RADIUS</DialogTitle>

			<DialogContent
				style={{
					width: 200
				}}
			>

				<TextField
					fullWidth
					type="number"
					value={this.state.values.radius}
					onChange={this.onChangeHandlerGenerator('radius')}
					size="large"
					variant="standard"
					label="Radius (meters)"
				/>

				<Button
					style={{
						marginTop: 10
					}}
					variant={"contained"}
					fullWidth
					onClick={this.submitRadius}
				>
					UPDATE
				</Button>
			</DialogContent>

			<DialogActions>
				<Button onClick={this.props.close}>
					close
				</Button>
			</DialogActions>

		</Dialog>
	}
}


export default RadiusModal;