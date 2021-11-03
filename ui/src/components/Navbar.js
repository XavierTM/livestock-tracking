
import React from 'react'
import Component from './Component';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';



function setNavbarDimensions() {
	const navbarHeight = document.getElementById('navbar').offsetHeight + 'px';
	document.documentElement.style.setProperty('--navbar-height', navbarHeight);
}


class Navbar extends Component {


	componentDidMount() {
		window.addEventListener('resize', setNavbarDimensions);
		setNavbarDimensions();
	}


	render () {

		return <AppBar
			id="navbar" 
			style={{ 
				color: 'white', 
				// background: 'teal'
			}}
		>

			<Grid container>

				<Grid item xs={8} sm={10}>
					<h4
						style={{  
							letterSpacing: 3,
							fontFamily: 'sans-serif',
							// textAlign: 'center',
							fontSize: '20px',
							paddingLeft: '20px',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}
					>
						LIVESTOCK TRACKER DEMO
					</h4>

				</Grid>

				<Grid item xs={4} sm={2}>

					<div
						style={{
							height: '100%'
						}}
						className="vh-align"
					>
						<Button
							style={{
								color: 'blue',
								background: 'white'
							}}
							component={Link}
							to="/"
							variant="contained"
						>
							LOG OUT
						</Button>
					</div>
				</Grid>
			</Grid>
		</AppBar>
	}
}

export default Navbar;