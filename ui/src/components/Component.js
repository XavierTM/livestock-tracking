
import React from 'react';
import Queue from 'queue-fifo';



class Component extends React.Component {


	constructor(props) {
		super(props);
		this.onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this)
	}


	___state_update_locks___ = new Queue();
	___state_update_in_progress = false;


	___lock_state_update___() {

		return new Promise(resolve => {

			const queue = this.___state_update_locks___;
			queue.enqueue(resolve);

			if (!this.___state_update_in_progress) {
				this.___state_update_in_progress = true;
				this.___process_next_update___();
			}
			
		});

	}


	___process_next_update___() {

		const resolve = this.___state_update_locks___.peek();

		if (!resolve) {
			this.___state_update_in_progress = false;
			return;
		}

		resolve();

	}

	___unlock_state_update___() {
		this.___state_update_locks___.dequeue(); // remove my lock;
		this.___process_next_update___();
	}

	

	async _updateState(object) {
		await this.___lock_state_update___();
		const newState = { ...(this.state || {} ), ...object };
		await this.setState(newState);
		this.___unlock_state_update___();
	}

	onChangeHandlerGenerator(name) {

		return (function(arg) {

			let value;

			if (typeof arg === 'object')
				value = arg.target.value;
			else
				value = arg;

			const values = (this.componentInstance.state || {} ).values || {};
			values[this.name] = value;

			this.componentInstance._updateState({ values });

		}).bind({ componentInstance: this, name });
	}

	render() {
		return <p>
			Please implement <code>render()</code>
		</p>
	}
}


export default Component;