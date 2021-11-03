

import React, { Component, Fragment } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { v4 as uuid } from 'uuid';


function errorToast(message) {
	window.App.Toasts.errorToast(message);
}

function successToast(message) {
	window.App.Toasts.successToast(message);
}

function toast(message, props) {
	window.App.Toasts.toast(message, props);
}

class Toast extends Component {

	errorToast(message) {
		const style = { backgroundColor: 'red' };
		const props = { style };
		this.toast(message, props);
	}

	successToast(message) {
		const style = { backgroundColor: 'green' };
		const props = { style };
		this.toast(message, props);
	}

	toast(message, props={}) {

		// add toast to DOM
		const _id = uuid();
		const toast = { _id, message, props };
		this.addToast(toast);

		// remove it after some period
		const self = this;

		setTimeout(function() {

			const toasts = self.state.toasts.filter(toast => {
				return (toast._id !== _id);
			});

			const newState = { ...self.state, toasts };
			self.setState(newState);
		}, 4000);
	}

	addToast(toast) {
		const toasts = this.state.toasts;
		toasts.push(toast);
		const newState = { ...this.state, toasts };
		this.setState(newState);
	} 

	state = {
		toasts: []
	}

	componentDidMount() {
		
		window.App.Toasts = {
			errorToast: this.errorToast.bind(this),
			successToast: this.successToast.bind(this),
			toast: this.toast.bind(this)
		};

	}

	render() {
		return <Fragment>
			{
				this.state.toasts.map(toast => {
					const { message, props } = toast;
					return <Snackbar message={message} ContentProps={props} open={true} />
				})
			}
		</Fragment>
	}
}

export default Toast;

export {
	errorToast,
	successToast,
	toast,
}