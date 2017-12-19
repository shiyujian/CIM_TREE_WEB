import React, {Component} from 'react';
import {Row, Col, Button} from 'antd';

export default class Info extends Component {
	//只有选择分部或子分部才可以创建工程部位
	render() {
		const {tableList=[], canCreate}=this.props;
		return (
			<Row gutter={24} style={{marginBottom: 20}}>
				{
					<div>
						<Row>
							<Col span={24}>
								<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
									<span style={{
										fontSize: 16,
										fontWeight: 'bold',
										paddingRight: '1em'
									}}>项目详情</span>
									{
										canCreate ? (
											<div style={{display:"inline-block"}}>
												<Button onClick={this._newWorkPackage.bind(this)}>单个创建工程部位</Button>
												{/* <Button onClick={this._importAddSection.bind(this)}>导入创建工程部位</Button> */}
											</div>
										) : null
									}
								</div>
							</Col>
						</Row>
					</div>
				}
			</Row>
		);
	}
	//导入创建
	_importAddSection(){
		const {actions: {importModalAc}} = this.props;
		importModalAc(true)
	}
	//单个创建
	_newWorkPackage() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: "ADD",
			visible: true
		})
	}
}
