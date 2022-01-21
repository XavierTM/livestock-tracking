

import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import Component from './components/Component';
import Toast from './components/Toast';
import Navbar from './components/Navbar';

// pages
import Cattle from './pages/Cattle';
import Cow from './pages/Cow';
import Login from './pages/Login';


import './App.css';



// functions 
function setWindowDimensions () {

	const winHeight = window.innerHeight + 'px';
	document.documentElement.style.setProperty('--window-height', winHeight);

	const winWidth = window.innerWidth + 'px';
	document.documentElement.style.setProperty('--window-width', winWidth);
}


window.App = {};

class App extends Component {

	componentDidMount() {

		window.addEventListener('resize', setWindowDimensions);
		setWindowDimensions();

	}


	render() {

		return <Router>
			<Navbar />
			<Toast />

			
			<Route exact path="/" component={Login} />
			<Route exact path="/cattle" component={Cattle} />
			<Route exact path="/cattle/:id" component={Cow} />


		</Router>
	}
}

export default App;
