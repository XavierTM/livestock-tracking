
import Page from './Page';
import Component from '../components/Component';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';


class Cattle extends Page {


	_render() {

		return <div>

			<h1 style={{ textAlign: 'center', color: 'grey' }}>REGISTERED CATTLE</h1>

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
							variant="contained"
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


export default Cattle