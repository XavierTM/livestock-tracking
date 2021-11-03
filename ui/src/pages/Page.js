
import React from 'react';
import Component from '../components/Component';



class Page extends Component {

	constructor(props) {
		
		super(props);

		if (window.App === undefined) {

			// setting up the App global object
			window.App = {};
		
		}

		if (window.App.history === undefined) {
			
			window.App.history = props.history;
			
			// creating a function to redirect SPAically 
			const redirect = (path) => {
				window.App.history.push(path);
			}


			Page.redirect = redirect;
			window.App.redirect = redirect;
		}

	}

	_componentDidMount() {

	}

	async componentDidMount() {

		const winHeight = window.innerHeight + 'px';
		document.documentElement.style.setProperty('--window-height', winHeight);

		await this._componentDidMount();
	}


	_render() {
		return <h1>Please implement <code>_render()</code></h1>
	}

	render() {
		return <div style={{ paddingTop: 'var(--navbar-height)' }}>
			{this._render()}
		</div>
	}

}

export default Page;