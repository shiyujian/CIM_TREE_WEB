import React, {Component} from 'react';
const dgn = window.dgn;

class DGN extends Component {

	static propTypes = {};

	render() {
		return (
			<div></div>
		);
	}

	componentDidMount() {
		this.show();
		let re = dgn.OpenDgnDbProject(encodeURI(this.props.model));
		if (re == 0) {
			let re = dgn.OpenDgnDbProject(encodeURI('NULL-A'));
		}
		setTimeout(function() {
			this.refs.dgnviewer.html(dgn);
			dgn.ViewOperation(2, 1);
			dgn.ViewOperation(6, 1);
		}, 200);
		if (this.props.viewType == 1) {
			setTimeout(function() {
				dgn.SetTwoViewsOnOff(1);
			}, 200);
		}
	}

	componentWillUnmount() {
		this.hide();
		dgn.SetTwoViewsOnOff(0);
	}

	show() {
		dgn.style.height = this.props.height;
		dgn.style.width = this.props.width;
		dgn.style.display = 'block';
	}

	hide() {
		dgn.style.height = 0;
		dgn.style.width = 0;
		dgn.style.display = 'none';
	}
}


