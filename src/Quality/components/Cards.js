import React, {Component} from 'react';

export default class Cards extends Component {
	render() {
		const {search = '',title = '', children} = this.props;
		return (
			<div style={{margin:'0 auto',boxShadow:' 0 -2px 3px rgba(0, 0, 0, .1)',padding:'5px'}}>
				<div style={{marginBottom:5}}>
					{search}
				</div>
				<div >
					{children}
				</div>
				<div style={{textAlign:'center', fontSize: '16px'}}>
					{title}
				</div>
			</div>
		);
	}
}