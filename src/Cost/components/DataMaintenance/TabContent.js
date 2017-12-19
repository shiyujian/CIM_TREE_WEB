import React, {Component} from 'react';
import {Table, Tabs, Button, Row, Col, Modal, message, Select, Card, Input, TreeSelect, Radio, Upload, Icon } from 'antd';
import moment from 'moment';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/dataMaintenance';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ESTIMATET,CONSTRACTT,SERVICE_API} from '../../../_platform/api';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

@connect(
	state => {
		const {cost:{dataMaintenance = {jxka:'1213'}},platform} = state;
		return {...dataMaintenance,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions,...platformActions}, dispatch),
	}),
)

export default class TabContent extends Component {
	constructor(props) {
		super(props);
		this.editCache = {};
		//概算表格
		this.column0 = [{
			title:'分部工程编号',
			dataIndex:'code'
		},{
			title:'分部工程名称',
			dataIndex:'name'
		},{
			title:'概算工程量项编号',
			dataIndex:'code1',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'code1', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'概算工程量项名称',
			dataIndex:'name1',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'name1', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'单位',
			dataIndex:'unit',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'unit', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'概算工程量',
			dataIndex:'estimate',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'estimate', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'分部工程概算价格（万元）',
			dataIndex:'price',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'price', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'备注',
			dataIndex:'remark',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'remark', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
		    title: '编辑',
		    dataIndex: 'edit',
		    key: 'edit',
		    width: 100,
		    render: (text, record, index) => {
		        return (
		          <div>
		            {
		                this.state.editable[index]  ?
		                <div >
		                  <a title='保存' onClick={ () => this.changeEditState('save', index) } ><Icon type="save" ></Icon></a>
		                  <span style={ { color: '#DEDEDE', display: 'inline-block', padding: '0 5px', transform: 'scale(1, 0.6)' } } > | </span>
		                  <a title='取消' onClick={ () => this.changeEditState('cancel', index) } ><Icon type="cross" ></Icon></a>
		                </div>
		                :
		                <div >
		                    <span style={ { color: '#DEDEDE', display: 'inline-block', padding: '0 5px', transform: 'scale(1, 0.6)' } } >  </span>
		                    <a title='编辑' onClick={ () => this.changeEditState('edit', index) } ><Icon type="edit" ></Icon></a>
		                </div>
		            }
		          </div>
		        );
		    }
		  }]
		  //合同表格
		this.column1 = [{
			title:'单元工程编号',
			dataIndex:'code'
		},{
			title:'单元工程名称',
			dataIndex:'name'
		},{
			title:'合同清册编号',
			dataIndex:'code1',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'code1', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'合同清册名称',
			dataIndex:'name1',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'name1', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'单位',
			dataIndex:'unit',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'unit', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'单价（元）',
			dataIndex:'unitPrice',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'unitPrice', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'合同工程量',
			dataIndex:'amount',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'amount', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'合计总价（元）',
			dataIndex:'totalPrice',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'totalPrice', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
			title:'备注',
			dataIndex:'remark',
			render: (text, record, index) => {
		                return (
		                    <div>
		                    {
		                        this.state.editable[index] ?
		                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'remark', e.target.value)} />
		                        :
		                        <span>{text}</span>
		                    }
		                    </div>
		                );
		            }
		},{
		    title: '编辑',
		    dataIndex: 'edit',
		    key: 'edit',
		    width: 100,
		    render: (text, record, index) => {
		        return (
		          <div>
		            {
		                this.state.editable[index]  ?
		                <div >
		                  <a title='保存' onClick={ () => this.changeEditState('save', index) } ><Icon type="save" ></Icon></a>
		                  <span style={ { color: '#DEDEDE', display: 'inline-block', padding: '0 5px', transform: 'scale(1, 0.6)' } } > | </span>
		                  <a title='取消' onClick={ () => this.changeEditState('cancel', index) } ><Icon type="cross" ></Icon></a>
		                </div>
		                :
		                <div >
		                    <span style={ { color: '#DEDEDE', display: 'inline-block', padding: '0 5px', transform: 'scale(1, 0.6)' } } >  </span>
		                    <a title='编辑' onClick={ () => this.changeEditState('edit', index) } ><Icon type="edit" ></Icon></a>
		                </div>
		            }
		          </div>
		        );
		    }
		  }]
		this.state = {
			type:'0',//表示tab页的种类 0 为概算 1 为合同 2 结算
			value:undefined,
			subsection:[],//单位工程下拉框选项
			subsubsection:[],//子单位工程下拉框选项
			subProject:'',//单位
			subProject1:'',//子单位
			unit:'',//分项
			unit1:'',//子分项
			units:[],//分项的下拉框选项
			subUnits:[],//子分项
			tableData:[],//表格数据
			editable:{},
		}
	}

	componentDidMount() {
		const {actions:{getExcelTemplate}} = this.props;
		getExcelTemplate().then(rst => {
			console.log(rst);
			//this.createLink(this,rst['t-plan_data']);
		})
		console.log(ESTIMATET);
		console.log(CONSTRACTT);
	}
	createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
	}
	// 下载
	downloadT(){
		let {type} = this.props;
		if(type === '0'){
			this.createLink(this,ESTIMATET);
		}else{
			this.createLink(this,CONSTRACTT);
		}
	}
	//表格操作
    handleEdit(index, key, value ,type) {
    // 暂存编辑中数据
    // if(type == 1){
        if (!this.editCache[index]) {
            this.editCache[index] = { ...this.state.tableData[index] };
        }
        this.editCache[index][key] = value;
	}
	changeEditState(type, index, record) {
        switch (type) {
            case 'edit':
            this.setState({
                editable: { ...this.state.editable, [index]: true },
            });
            break;
            case 'save':
                // 如果有更新, 则更新数据
                // 发送异步请求也在这里
                // 需要注意重复点击, 请自行控制
                if(!this.editCache[index]){
                    this.setState({
                        editable: { ...this.state.editable, [index]: false },
                    });
                    return;
                }
                let self = this;
                let dataSource = this.state.tableData;
                dataSource[index] = this.editCache[index];
                this.setState({
                    editable: { ...this.state.editable, [index]: false, tableData: dataSource },
                });


            break;
            case 'cancel':
                // 清空数据缓存
                this.editCache[index] = undefined;
                this.setState({
                    editable: { ...this.state.editable, [index]: false },
                });
            break;
            default:
            break;
        }
    }
	//下拉款选择变化
	handleChangeSub(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(rst.children_wp.length === 0){
	  			this.setState({subProject:value,units:rst.children_wp,subUnits:rst.children_wp,subProject1:rst.children_wp,subProject1:'',unit:'',unit1:''});
	  		}else{
	  			if(rst.children_wp[0].obj_type_hum === '子单位工程'){
	  				this.setState({subProject:value,subsubsection:rst.children_wp,subProject1:'',unit:'',unit1:''});
	  			}else{
	  				if(type === '0'){
			  			let tableData = dataFormat(rst.children_wp,type);
			  			this.setState({tableData});
			  		}
	  				this.setState({subProject:value,subsubsection:[],units:rst.children_wp,subProject1:'',unit:'',unit1:''});
	  			}
	  		}
	  		
	  	});
	  	/*Promise.all([esti]).then(values => {
		  	console.log(values);
		});*/
	}
	handleChangeSub1(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(type === '0'){
	  			let tableData = dataFormat(rst.children_wp,type);
	  			this.setState({tableData,subProject1:value});
	  		}else{
	  			this.setState({subProject1:value,units:rst.children_wp,unit:'',unit1:''});
	  		}
	  		
	  	});
	  	/*Promise.all([esti]).then(values => {
		  	console.log(values);
		});*/
	}
	handleChange(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(rst.children_wp.length === 0){
	  			this.setState({unit:value,subUnits:[],unit1:''});
	  		}else{
	  			if(rst.children_wp[0].obj_type_hum === '子分部工程'){
	  				this.setState({unit:value,subUnits:rst.children_wp,unit1:''});
	  			}else{
	  				if(type !== '0'){
			  			let tableData = dataFormat(rst.children_wp,type);
			  			this.setState({tableData});
			  		}
	  				this.setState({unit:value,subUnits:[],unit1:''});
	  			}
	  		}
	  		
	  	});
	}
/*	handleChange1(value) {
	  	this.setState({unit1:value});
	}
	handleChangeSub(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(type === '0'){
	  			let tableData = dataFormat(rst.children_wp,type);
	  			this.setState({tableData});
	  		}
	  		this.setState({subProject:value,units:rst.children_wp});
	  	});
	}*/
	handleChange1(value) {
		const {actions:{getEstimateData},type} = this.props;
		if(type !== '0'){
			getEstimateData({pk:value}).then((rst) => {
	  			let tableData = dataFormat(rst.children_wp,type);
	  			this.setState({tableData});
	  		});
		}
	  	this.setState({unit1:value});

	}
	//提交
	submit(){
		let timestamp = Date.parse(new Date());
		const {type,actions:{updateWpData}} = this.props;
		let {tableData} = this.state;
		let data = {};
		let data_list = [];
		tableData.map(item => {
			let extra = {timestamp:timestamp};
			extra[types[type]] = {...item};
			let temp = {
				code:item.code,
				'extra_params':extra
			}
			data_list.push(temp);
		})
		data['data_list'] = data_list;
		updateWpData({},data).then(rst => {
			console.log(rst);
			if(rst.result.length === tableData.length){
				message.info('导入成功');
			}
		})
	}
	//树形选择器
	onChange = (value) => {
	    console.log(arguments);
	    this.setState({ value });
  	}
  	//将Excel数据解析
  	dealExcelData(data){
  		let {type} = this.props;
  		let {tableData} = this.state;
  		data.map((item,index) => {
  			if(index > 1 && index < tableData.length+2){
  				let temp = {};
  				temp = type === '0' ? {
  					code1: item[2],
  					name1: item[3],
  					unit: item[4],
  					estimate: item[5],
  					price: item[6],
  					remark: item[7]
  				} : {
  					code1: item[2],
  					name1: item[3],
  					unit: item[4],
  					unitPrice: item[5],
  					amount: item[6],
  					totalPrice: item[7],
  					remark: item[8]
  				};
  				tableData[index-2] = {...temp,name:tableData[index-2].name,code:tableData[index-2].code};
  			}
  		})
  		this.setState({tableData});
  	}
	render() {
		const { type,subsection=[] } = this.props;
		const {units=[], subsubsection=[], subUnits=[]} = this.state;
		let title = titles[type];
		let tender = tenderTitle[type];
		let columns = type === '0' ? this.column0 : this.column1;
		let jthis = this;
		//上传
		const props = {
		    name: 'file',
			action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
			headers: {
			},
			showUploadList: false,
		    onChange(info) {
		        if (info.file.status !== 'uploading') {
		            console.log(info.file, info.fileList);
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
		        	console.log(importData);
		        	jthis.dealExcelData(importData);
		            message.success(`${info.file.name} file uploaded successfully`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
		};
		return (
			<div style={{marginLeft:'22px'}}>
				<h2 style={{marginBottom:'10px'}}>{title}</h2>
				{

					/*tender !== '' && (
						<Card>
							<label style={{marginRight:'10px'}}>{tender}:</label>
							<Select style={{width:'200px'}} defaultValue="1" onChange={this.handleChange.bind(this)}>
						      	<Option value="1">1标</Option>
						      	<Option value="2">2标</Option>
						      	<Option value="3">3标</Option>
						    </Select>
						   </Card>
						   ) */
				}
				<Card>
						<h3 style={{marginBottom:'10px'}}>单位/子单位工程选择</h3>
						<Row>
							<Col span={10}>
								<label style={{marginRight:'10px'}}>单位工程名称:</label>
								<Select style={{width:'200px',marginRight:'20px'}} value={this.state.subProject}  onChange={this.handleChangeSub.bind(this)}>
						      	{
						      		subsection.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={10}>
							    <label style={{marginRight:'10px'}}>子单位工程名称:</label>
								<Select style={{width:'200px'}} value={this.state.subProject1} onChange={this.handleChangeSub1.bind(this)}>
						      	{
						      		subsubsection.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
						</Row>
					</Card>
					<Card style={{marginTop:'10px'}}>
						<h3 style={{marginBottom:'10px'}}>分部/子分部工程选择</h3>
						<Row>
							<Col span={10}>
								<label style={{marginRight:'10px'}}>分部工程名称:</label>
								<Select style={{width:'200px',marginRight:'20px'}} value={this.state.unit}  onChange={this.handleChange.bind(this)}>
						      	{
						      		units.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={10}>
							    <label style={{marginRight:'10px'}}>子分部工程名称:</label>
								<Select style={{width:'200px'}} value={this.state.unit1} onChange={this.handleChange1.bind(this)}>
						      	{
						      		subUnits.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
						</Row>
					</Card>
				<Card>
					<Row>
						<Col span={4}>
							<Upload {...props}>
								<Button type="primary" style={{marginBottom:'10px'}}>
			      					<Icon type="upload" /> 批量导入
			    				</Button>
			    			</Upload>
			    		</Col>
			    		<Col span={4}>
							<Button type="primary" onClick={this.downloadT.bind(this)} style={{marginRight:'10px',marginBottom:'10px'}}>模板下载</Button>
						</Col>
					</Row>
					<Table columns={columns} dataSource={this.state.tableData}/>
				</Card>
				<Card>
					{/*<h3 style={{marginBottom:'10px'}}>维护原因:</h3>*/}
					{/*<Input style={{marginBottom:'10px'}}/>*/}
					<Row>
						{/*<Col span={8}>
							<label style={{marginRight:'10px'}}>填报人:</label>
							<Input disabled style={{width:'200px'}}/>
						</Col>
						<Col span={8}>
							<label style={{marginRight:'10px'}}>审核人:</label>
							<TreeSelect
						     showSearch
						     style={{ width: 200 }}
						     value={this.state.value}
						     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						     placeholder="Please select"
						     allowClear
						     treeDefaultExpandAll
						     onChange={this.onChange}
						    >
					       		<TreeNode disabled value="parent 1-0" title="xxx公司" key="0-1-1">
					            	<TreeNode value="leaf1" title="xiaowang" key="random" />
					            	<TreeNode value="leaf2" title="小李" key="random1" />
					        	</TreeNode>
					      </TreeSelect>
						</Col>
						<Col style={{lineHeight:'28px'}} span={4}>
							<Radio>短信通知</Radio>
						</Col>*/}
						<Col span={4}>
							<Button type="primary" onClick={this.submit.bind(this)}>提交</Button>
						</Col>
					</Row>
				</Card>
			</div>
		);
	}
}
//处理table数据
function dataFormat(data,type){
	try{
		let result = [];
		data.map(item => {
			let temptype = types[type];
			let temp = {...item.extra_params[temptype],name:item.name,code:item.code};
			result.push(temp);
		})
		return result;
	}catch(e){
		return [];
	}
}
//标题
const titles = {
	2: '合计结算量清单',
	1: '合计工程量清单',
	0: '设计概算工程量清单'
}
//b标段选择
const tenderTitle = {
	0:'',
	1:'标段合同工程量清单',
	2:'标段结算量清单'
}
//不同的类型对应存入extra字段内不同的key
const types = {
	0:'estimate',//概算
	1:'constract',//合同
	2:'actual'//实际
}

//结算表格
const column2 = [{
	title:'单元工程编号',
	dataIndex:'1'
},{
	title:'单元工程名称',
	dataIndex:'2'
},{
	title:'合同清册编号',
	dataIndex:'3'
},{
	title:'合同清册名称',
	dataIndex:'4'
},{
	title:'单位',
	dataIndex:'5'
},{
	title:'单价',
	dataIndex:'434'
},{
	title:'合同工程量',
	dataIndex:'55'
},{
	title:'合计总价',
	dataIndex:'34'
},{
	title:'备注',
	dataIndex:'54'
}]
