import React, {Component} from 'react';
import {Row, Col, Button} from 'antd';

export default class Info extends Component {
	//1、不管选择单位还是子单位工程，只能创建分部工程，若单位工程下面是子单位工程，则不能创建单位工程
	//2、选择分部工程，可以创建子分部或分项工程
	//3、选择子分部工程，只能创建分项工程
	//4、
	render() {
		const {tableList=[], nodeType=""}=this.props;

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
										tableList &&
										tableList.length &&
										((tableList[0]["obj_type"] === "C_WP_UNT_S" || tableList[0]["obj_type"] === "C_WP_UNT")) ? (
											<div style={{display:"inline-block"}}>
												<Button onClick={this._newWorkPackage.bind(this,'C_WP_PTR')}>单个创建分部工程</Button>
												<Button onClick={this._importAddSection.bind(this,'C_WP_PTR')}>导入创建分部工程</Button>
											</div>
										) : null
									}
									{
										tableList &&
										tableList.length &&
										((tableList[0]["obj_type"] === "C_WP_PTR")) ? (
											<div style={{display:"inline-block"}}>
													<span>
														<Button onClick={this._newWorkPackage.bind(this, 'C_WP_PTR_S')}>单个创建子分部工程</Button>
														<Button onClick={this._importAddSection.bind(this, 'C_WP_PTR_S')}>导入创建子分部工程</Button>
													</span>
													<div style={{ display: "inline-block" }}>
														&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
															<Button onClick={this._newWorkPackage.bind(this, 'C_WP_ITM')}>单个创建分项工程</Button>
														<Button onClick={this._importAddSection.bind(this, 'C_WP_ITM')}>导入创建分项工程</Button>
													</div>
											</div>
										) : null
									}
									{
										tableList &&
										tableList.length &&
										(tableList[0]["obj_type"] === "C_WP_PTR_S") ? (
											<div style={{display:"inline-block"}}>
												<Button onClick={this._newWorkPackage.bind(this,'C_WP_ITM')}>单个创建分项工程</Button>
												<Button onClick={this._importAddSection.bind(this,'C_WP_ITM')}>导入创建分项工程</Button>
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
	_importAddSection(createType){
		const {actions: {importModalAc,setCreateTypeAc}} = this.props;
		setCreateTypeAc(createType);
		importModalAc(true);
	}
	//单个创建
	_newWorkPackage(createType) {
		const {actions: {toggleModalAc,setCreateTypeAc}} = this.props;
		setCreateTypeAc(createType);
		toggleModalAc({
			type: "ADD",
			visible: true
		});
	}

}
