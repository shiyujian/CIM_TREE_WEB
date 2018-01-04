import React, {Component} from 'react';

export default class CityMarker extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div id="appendBody"
				 style={{
					 "position": "absolute",
					 "top": 0,
					 "bottom": 0,
					 "left": 0,
					 "right": 0
				 }}>
				<iframe id="showCityMarkerId" src="/xaxq/index.html" frameBorder="0"
						style={{width: '100%', height: '100%'}}></iframe>
			</div>
		)
	}
}