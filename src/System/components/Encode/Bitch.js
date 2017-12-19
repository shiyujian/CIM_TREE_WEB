import React, {Component} from 'react';
import {Button} from 'antd';

export default class Bitch extends Component {
	render() {
		return (
			<div>
				<Button>单个创建</Button>
				<Button>批量创建</Button>
				<Button>批量删除</Button>
			</div>
		);
	}
}
