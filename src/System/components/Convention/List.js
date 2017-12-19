import React, {Component} from 'react';
import { Tag } from 'antd';

export default class List extends Component {
	render() {
		const {header = '',dataSource = [], onChange} = this.props;
		return (
			<div style={{margin:'0 auto',boxShadow:' 0 -2px 3px rgba(0, 0, 0, .1)',padding:'10px'}}>
				<div style={{marginBottom:"5px",fontSize:"20px"}} >
					{header}
				</div>
				<div style={{padding:"10px"}}>
					{
					dataSource.map((rst,index) => {
						return <span key={index} style={this.listStyle(rst)} onClick={() => onChange(rst)}>
							{rst}
						</span>
					})
				}
				</div>
			</div>
		);
	}
	listStyle(rst){
		const {selectedtitle = ''} = this.props;
		if(selectedtitle != rst){
			return {
				display:"block",
				height:"30px",
				lineHeight:"30px",
				fontSize:"15px",
				marginBottom:"10px",
				cursor:'pointer',
			}
		} else {
			return {
				display:"block",
				height:"30px",
				lineHeight:"30px",
				fontSize:"15px",
				marginBottom:"10px",
				cursor:'pointer',
				backgroundColor: '#D2F4FF',
			}
		}
	}
}