import React, {Component} from 'react';
import {Row,Col,Button,Upload,Select,DatePicker,Icon,Input,Card} from 'antd';
import './style/submit-panel.less';
import testTableData from './testTableData.json';
const Option = Select.Option;

const {TextArea} = Input;

export default class QueryCard extends Component {

	state = {
		//查询参数项
			explainerForQuery:'',
			workOrgForQuery:'',
			designOrgForQuery:'',
			explainTimeForQuery:null,
			volumeNameForQuery:'',
			versionForQuery:'',
			proNameForQuery:'',
		//
	}

	componentDidMount() {
		
	}

	//过滤器 排除 未选项 --- 完成
	getValidFilterItem() {
		let validFilterItem = {
			explainer: this.state.explainerForQuery,
			workOrg: this.state.workOrgForQuery,
			designOrg: this.state.designOrgForQuery,
			explainTime: this.state.explainTimeForQuery,
			volumeName: this.state.volumeNameForQuery,
			version: this.state.versionForQuery,
			proName: this.state.proNameForQuery,
		};

		for (let key in validFilterItem) {
			if (validFilterItem.hasOwnProperty(key)) {
				if (validFilterItem[key]===null||validFilterItem[key]==='') {
					delete validFilterItem[key];
				}
			}
		};
		return validFilterItem;
	}

	//产生过滤后列表 --- 完成
	onQuery() {
		const {
			designExpList,
			actions:{
				setFilteredDesignExpList,
				getCurrentDesignExpList,
			}
		} = this.props;
		//获取有效过滤项
		let validFilterItem = this.getValidFilterItem();
		
		//过滤explist 目前使用测试数据 TODO:
		//designExpList.filter(			
		let filteredDesignExpList = testTableData.filter(
			(designExpItem)=>{
				//是否在过滤中保留当前项
				let isRetainItem = true;
				for (let key in designExpItem) {
					if (designExpItem.hasOwnProperty(key)) {
						if (validFilterItem[key]!==undefined&&designExpItem[key]!==validFilterItem[key]) {
							isRetainItem = false;
						}
					}
				}
				return isRetainItem;
			}
		);

		setFilteredDesignExpList(filteredDesignExpList);
		
	}

	//重置 过滤器 ---完成
	onReset() {
		this.setState(
			{
			//查询参数项
				explainerForQuery:'',
				workOrgForQuery:'',
				designOrgForQuery:'',
				explainTimeForQuery:null,
				volumeNameForQuery:'',
				versionForQuery:'',
				proNameForQuery:'',
			//
			},
			()=>{this.onQuery()}
		);
	}

	//获取所有 可选 施工单位项
	getWorkOrgOptions() {
		let workOrgArray = [];
		workOrgArray = testTableData.map(
			(desExp)=>{
				return desExp.workOrg;
			}
		);
		let workOrgSet = new Set();
		workOrgArray.forEach(
			(workOrg)=>{
				workOrgSet.add(workOrg);
			}
		);

		return Array.from(workOrgSet).map(
			(workOrg)=>{
				return <Option key={workOrg}>{workOrg}</Option>
			}
		);	
	}
	onChangeWorkOrg(value) {
		this.setState({workOrgForQuery:value});
	}

	//获取所有 可选 设计单位项
	getDesignOrgOptions() {
		let designOrgArray = [];
		designOrgArray = testTableData.map(
			(desExp)=>{
				return desExp.designOrg;
			}
		);
		let designOrgSet = new Set();
		designOrgArray.forEach(
			(desOrg)=>{
				designOrgSet.add(desOrg);
			}
		);

		return Array.from(designOrgSet).map(
			(desOrg)=>{
				return <Option key={desOrg}>{desOrg}</Option>
			}
		);	
	}
	onChangeDesignOrg(value) {
		this.setState({designOrgForQuery:value});
	}

	//获取所有 可选 卷册名称
	getVolumeNameOptions() {
		let volumeNameArray = [];
		volumeNameArray = testTableData.map(
			(desExp)=>{
				return desExp.volumeName;
			}
		);
		let volumeNameSet = new Set();
		volumeNameArray.forEach(
			(volumeName)=>{
				volumeNameSet.add(volumeName);
			}
		);

		return Array.from(volumeNameSet).map(
			(volumeName)=>{
				return <Option key={volumeName}>{volumeName}</Option>
			}
		);	
	}
	onChangeVolumeName(value) {
		this.setState({volumeNameForQuery:value});
	}

	//获取所有 可选 版本
	getVersionOptions() {
		let versionArray = [];
		versionArray = testTableData.map(
			(desExp)=>{
				return desExp.version;
			}
		);
		let versionSet = new Set();
		versionArray.forEach(
			(version)=>{
				versionSet.add(version);
			}
		);

		return Array.from(versionSet).map(
			(version)=>{
				return <Option key={version}>{version}</Option>
			}
		);	
	}
	onChangeVersion(value) {
		this.setState({versionForQuery:value});
	}

	//获取所有 可选 专业名
	getProNameOptions() {
		let proNameArray = [];
		proNameArray = testTableData.map(
			(desExp)=>{
				return desExp.proName;
			}
		);
		let proNameSet = new Set();
		proNameArray.forEach(
			(proName)=>{
				proNameSet.add(proName);
			}
		);

		return Array.from(proNameSet).map(
			(proName)=>{
				return <Option key={proName}>{proName}</Option>
			}
		);	
	}
	onChangeProName(value) {
		this.setState({proNameForQuery:value});
	}


	render() {
		const { 
			selectedUnitProject:{
				project={},
				unitProject={},
			}={}
		}=this.props;

		console.log('# this.state: ',this.state);

		return (
                <Card className="submit-panel" style={{marginBottom:10}}>
                    <label>
                        设计交底查询
                    </label>

					<Row>
						<Col span={7}>
							<label>项目名称：</label>
							{project.name}
						</Col>
						<Col span={7}>
						<label>单位工程：</label>
						{unitProject.name}
						
						</Col>
						<Col span={7}>
						<label>交底人：</label>
                        <Input 
							placeholder='输入交底人名字'
							value={this.state.explainerForQuery} 
							size={'small'} 
							style={{width:120}}
							onChange={(e)=>{this.setState({explainerForQuery:e.target.value})}}
							></Input>
						</Col>
						
                        <Col span={3}>
                        <Button type='primary' className='submit-button' onClick={this.onQuery.bind(this)}>
							查询
						</Button>
                        </Col>
					</Row>
					<Row>
						<Col span={7}>
						<label>施工单位：</label>
							<Select 
								value={this.state.workOrgForQuery} size={'small'} style={{ minWidth: 120 }}
								onChange={this.onChangeWorkOrg.bind(this)}
							>
							{this.getWorkOrgOptions()}
							</Select>							
						</Col>
						<Col span={7}>
						<label>设计单位：</label>
							<Select 
								value={this.state.designOrgForQuery} size={'small'} style={{ minWidth: 120 }}
								onChange={this.onChangeDesignOrg.bind(this)}							
							>
							{this.getDesignOrgOptions()}							
							</Select>					
						</Col>
						<Col span={7} >
							<label>交底时间：</label>
							<DatePicker
								value={this.state.explainTimeForQuery}
                                size='small'
                                style={{width:120}}
								onChange={(date) => {
								console.log('date:', date);
								this.setState({ explainTimeForQuery: date })
								}}/>
						</Col>
                        <Col span={3}>
                        <Button className='submit-button' onClick={this.onReset.bind(this)}>
							重置
						</Button>
                        </Col>
                    
					</Row>
					<Row>
						<Col span={7}>
						<label>卷册名称：</label>
							<Select
								placeholder='请选择交底图纸'
								size={'small'} style={{ minWidth: 120 }}
								onChange={this.onChangeVolumeName.bind(this)}														
							>
							{this.getVolumeNameOptions()}														
							</Select>							
						</Col>
						<Col span={7}>
							<label>版本：</label>
							<Select
								value={this.state.versionForQuery} size={'small'} style={{ minWidth: 120 }}
								onChange={this.onChangeVersion.bind(this)}																						
								>
								{this.getVersionOptions()}								
							</Select>							
						</Col>
						<Col span={7}>
							<label>专业：</label>
							<Select
								value={this.state.proNameForQuery} size={'small'} style={{ minWidth: 120 }}
								onChange={this.onChangeProName.bind(this)}																						
								
							>
							{this.getProNameOptions()}
							</Select>							
						</Col>
					</Row>
			</Card>
		);
	}
}
