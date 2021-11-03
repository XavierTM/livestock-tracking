

import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import Toast from './components/Toast';
import Navbar from './components/Navbar';

// pages
import Cattle from './pages/Cattle';
import Cow from './pages/Cow';
import Login from './pages/Login';


import './App.css';


window.App = {};

function App() {
	return (

		<Router>
			<Navbar />
			<Toast />

			
			<Route exact path="/" component={Login} />
			<Route exact path="/cattle" component={Cattle} />
			<Route exact path="/cattle/:id" component={Cow} />


		</Router>
	);
}

export default App;
