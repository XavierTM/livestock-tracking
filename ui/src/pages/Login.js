
// import React from 'react';
import Page from './Page';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import { withStyles } from '@material-ui/styles';

import { errorToast } from '../components/Toast';
// import request from '../lib/request';
// import { getRequestErrorMessage } from '../lib/request';
// import { messageBox } from '../components/MessageBox';


// style

// const useStyles = theme => ({
// 	controls_container: {
// 		margin: '12px',
// 		'& > *': {
// 			marginTop: '10px'
// 		}
// 	}
// })


const divAlignStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: 'calc(var(--window-height) - var(--navbar-height))'
}

const divLoginStyle = {
	width: '300px',
	border: '1px solid var(--primary-color)'
}

const hTitleStyle = {
	margin: 0,
	padding: '10px',
	color: 'white',
	background: 'var(--primary-color)',
	textAlign: 'center',
	fontFamily: 'sans-serif'
}


class Login extends Page {

	state = {}

	async submit() {
		const { username, password } = this.state.values;

		if (!username) {
			document.getElementById('txt-username').focus();
			return errorToast('Provide a username');
		}

		if (!password) {
			document.getElementById('txt-password').focus();
			return errorToast('Provide a password');
		}


		if (username.toLowerCase() !== 'demo' || password !== "demo2021")
			return errorToast('Invalid credentials');

		Page.redirect('/cattle');


		// const data = { username, password };

		// try {
		// 	await request.post('/api/login', data);
		// 	window.Netro.redirect('/dashboard');
		// } catch (err) {
		// 	const err_msg = getRequestErrorMessage(err);
		// 	messageBox('ERROR', err_msg);
		// }
	}

	_render() {

		const { username, password } = this.state.values || {};

		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const submit = this.submit.bind(this);

		const controlStyle = {
			marginTop: 10
		}

		return <div style={divAlignStyle}>
			<div style={divLoginStyle}>
				<h5 style={hTitleStyle}>LOGIN</h5>

				<div style={{ margin: 12 }}>
					<TextField variant="outlined" size="small" id="txt-username" label="Username" fullWidth value={username} onChange={onChangeHandlerGenerator('username') } style={controlStyle} />
					<TextField variant="outlined" size="small" id="txt-password" label="Password" fullWidth value={password} onChange={onChangeHandlerGenerator('password') } type="password" style={controlStyle} />

					<Button variant="contained" size="large" className="btn-primary" onClick={submit} fullWidth  style={controlStyle} >LOGIN</Button>
				</div>

			</div>
		</div>
	}
}


export default Login //withStyles(useStyles)(Login);