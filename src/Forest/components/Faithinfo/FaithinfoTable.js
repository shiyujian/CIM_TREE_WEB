import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

export default class FaithinfoTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	loading: false,
        	loading1: false,
        	leftkeycode: '',
        	pagination: {},
			section: '',
    		bigType: '',
    		treetype: '',
    		treetypename: '',
    		percent:0,
    		visible: false,
    		factory: '',
        }
    }
    componentDidMount() {
    	console.log('hi man i am here again!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	}
	componentWillUnmount(){
		console.log('oh why you got destroy')
	}
    componentWillReceiveProps(nextProps){
    	// if(nextProps.leftkeycode != this.state.leftkeycode) {
		// 	this.setState({
		// 		leftkeycode: nextProps.leftkeycode,
    	// 	},()=> {
    	// 		this.qury(1);
    	// 	})
    	// } 
    }
    
	render() {
		const {tblData} = this.state;
		return (
			<div>
			{this.treeTable(tblData)}
			</div>
		);
	}
	treeTable(details) {
		const {
			treetypeoption,
			sectionoption,
			typeoption,
			leftkeycode,
			keycode,
		} = this.props;
		const {
			factory,
			section,
			bigType,
			treetypename,
		} = this.state;
		//清除
		const suffix = factory ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
			width: '5%',
		},{
			title:"供应商",
			dataIndex: 'Factory',
			width: '26%',
		},{
			title:"树种",
			dataIndex: 'TreeTypeName',
			width: '52%',
		},{
			title:"总诚信度",
			dataIndex: 'Sincerity',
			width: '8%',
			render: (text,record) => {
				return <span>{text.toFixed(2)*1}</span>
			}
		},{
			title:"详情",
			render: (record) => {
				// console.log('record',record)
				return (
					<div>
						<a onClick = {this.showModal.bind(this,record.Factory)}>详情</a>
					</div>
				)
			}
		}];
		header = <div >
					<Row>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>标段：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>类型：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={bigType} onChange={this.ontypechange.bind(this)}>
								{typeoption}
							</Select>
						</Col>
						{/* <Col xl={3} lg={4} md={5} className='mrg10'>
							<span>树种：</span>
							<Select allowClear showSearch className='forestcalcw2 mxw100' defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
								{treetypeoption}
							</Select>
						</Col> */}
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>供应商：</span>
							<Input suffix={suffix} value={factory} className='forestcalcw3 mxw200' onChange={this.factorychange.bind(this)}/>
						</Col>
					</Row>
					<Row >
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.handleTableChange.bind(this,{current:1})}>
								查询
							</Button>
						</Col>
						<Col span={2} push={18} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
							</Button>
						</Col>
						<Col span={2} push={18} className='mrg10'>
							<Button type='primary' style={{display:'none'}} onClick={this.exportexcel.bind(this)}>
								导出
							</Button>
						</Col>
					</Row>
				</div> 
		return <div>
					<Row>
						{header}
					</Row>
					<Row>
						<Table bordered
						 className='foresttable'
						 columns={columns}
						 rowKey='order'
						 loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
						 locale={{emptyText:'当天无信息'}}
						 dataSource={details}
						 pagination={this.state.pagination}
						 onChange={this.handleTableChange.bind(this)}
						/>
					</Row>
				</div>
	}

  	emitEmpty = () => {
	    this.setState({factory: ''});
  	}
  	showModal(name){
  		console.log('name',name)
  		this.setState({loading1: true})
    	const {actions:{changeModal1,getHonestyNew,getHonestyNewDetail,clearList, nurseryName}} = this.props;
    	getHonestyNewDetail({name:name}).then(rst => {
    		console.log("rst:",rst);
    		this.setState({loading1: false})
    	})
    	clearList();
    	nurseryName(name);
    	changeModal1(true);
	}
	
	onsectionchange(value) {
		const {sectionselect} = this.props;
		sectionselect(value || '')
		this.setState({section:value || '', bigType:'', treetype: '', treetypename: ''})
	}
	
	ontypechange(value) {
		const {typeselect} = this.props;
		const {section} = this.state;
		typeselect(value || '')
		this.setState({bigType:value || '', treetype: '', treetypename:''})
	}

	ontreetypechange(value) {
		const {treetypelist} = this.props;
		let treetype = treetypelist.find(rst => rst.TreeTypeName == value)
		this.setState({treetype:treetype?treetype.ID:'',treetypename:value || ''})
    }

    factorychange(value) {
		this.setState({factory: value.target.value})
	}

	handleTableChange(pagination){
        const pager = { ...this.state.pagination};
        pager.current = pagination.current;
    	this.setState({
        	pagination: pager,
        });
        this.qury(pagination.current)
    }
	handleCancel(){
    	this.setState({imgvisible:false})
    }

    resetinput(){
    	const {resetinput,leftkeycode} = this.props;
		resetinput(leftkeycode)
    }

    qury(page) {
    	const {
    		section = '',
    		bigType = '',
    		treetype = '',
    		factory = '',
    	} = this.state;
    	const {actions: {getHonestyNew},keycode = ''} = this.props;
    	let postdata = {
    		section,
    		bigType,
    		treetype,
    		factory,
    	}
    	this.setState({loading:true,percent:0})
    	getHonestyNew({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
    			tblData.forEach((plan, i) => {
    				// console.log('plan',plan)
    				// let treetys = []
    				// if(plan.treetype.length > 1) {
    				// 	treetys = plan.treetype.join(" , ")
    				// }else {
    				// 	treetys = plan.treetype
    				// }
    				// tblData[i].treetype = treetys
	    			tblData[i].order = ++i
    			})
				this.setState({ tblData});	
	    	}
    	})
    }

    exportexcel() {
		const {
    		treetype = '',
    		factory = '',
    		section = '',
    		bigType = '',
    	} = this.state;
    	const {actions: {getHonestyNew,getexportFactoryAnalyseInfo},keycode = ''} = this.props;
    	let postdata = {
    		treetype,
    		factory,
    		section,
    		bigType,
    	}
    	this.setState({loading:true,percent:0})
    	getexportFactoryAnalyseInfo({},postdata)
		.then(rst3 => {
			if(rst3 === ''){
				message.info('没有符合条件的信息');
			}else{
				this.createLink(this,`${FOREST_API}/${rst3}`)
			}
			this.setState({loading:false})
		})
	}

	// exportexcel() {
	// 	const {
 //    		treetype = '',
 //    		factory = '',
 //    		section = '',
 //    		bigType = '',

 //    	} = this.state;
 //    	const {actions: {getHonestyNew,getexportTree},keycode = ''} = this.props;
 //    	let postdata = {
 //    		treetype,
 //    		factory,
 //    		section,
 //    		bigType,
 //    	}
 //    	this.setState({loading:true,percent:0})
 //    	getHonestyNew({},postdata)
 //    	.then(result => {
 //            if(!result) {
 //            	this.setState({loading:false,percent:100})
 //    			return
 //    		}
 //    		if(result instanceof Array) {
 //    			let data = result.map((plan, i) => {
    				
 //    				return [
 //    					++i,
 //    					plan.Factory || '/',
 //    					plan.TreeTypeName || '/',
 //    					plan.Sincerity || '',
 //    				]
 //    			})
	//     		const postdata = {
	//     			keys: ["序号", "供应商", "树种" , "总诚信度"],
	//     			values: data
	//     		}
	//     		getexportTree({},postdata)
	//     		.then(rst3 => {
	//     			console.log('rst3',rst3)
	//     			this.setState({loading:false,percent:100})
	//     			// window.location.href = 
	//     		})
 //            } else {
 //            	this.setState({loading:false,percent:100})
 //            }
 //    	})
	// }

	createLink(name,url) {
        let link = document.createElement("a");
        // link.download = name;
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}