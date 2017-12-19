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
    		treety: '',
    		treetype: '',
    		treetypename: '',
    		integrity: '',
    		percent:0,
    		visible: false,
    		nurseryname: '',
        }
    }
    componentDidMount() {
    	
    }
    componentWillReceiveProps(nextProps){
    	if(nextProps.leftkeycode != this.state.leftkeycode) {
			this.setState({
				leftkeycode: nextProps.leftkeycode,
    		},()=> {
    			this.qury(1);
    		})
    	} 
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
			nurseryname,
			section,
			treety,
			treetypename,
		} = this.state;
		//清除
		const suffix = nurseryname ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
			width: '5%',
		},{
			title:"供苗商",
			dataIndex: 'nurseryname',
			width: '26%',
		},{
			title:"树种",
			dataIndex: 'treetype',
			width: '52%',
		},{
			title:"总诚信度",
			dataIndex: 'integrity',
			width: '8%',
		},{
			title:"详情",
			render: (record) => {
				return (
					<div>
						<a onClick = {this.showModal.bind(this,record.nurseryname)}>详情</a>
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
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={treety} onChange={this.ontypechange.bind(this)}>
								{typeoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>树种：</span>
							<Select allowClear showSearch className='forestcalcw2 mxw100' defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
								{treetypeoption}
							</Select>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>供苗商：</span>
							<Input suffix={suffix} value={nurseryname} className='forestcalcw3 mxw200' onChange={this.nurserynamechange.bind(this)}/>
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
							<Button type='primary' onClick={this.exportexcel.bind(this)}>
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
						/>
					</Row>
				</div>
	}

  	emitEmpty = () => {
	    this.setState({nurseryname: ''});
  	}
  	showModal(name){
  		this.setState({loading1: true})
    	const {actions:{changeModal1,getHonestyNew,getHonestyNewDetail,clearList, nurseryName}} = this.props;
    	getHonestyNewDetail({name:name}).then(rst => {
    		// console.log("rst:",rst);
    		this.setState({loading1: false})
    	})
    	clearList();
    	nurseryName(name);
    	changeModal1(true);
    }
	onsectionchange(value) {
		const {sectionselect} = this.props;
		const {treety} = this.state;
		sectionselect(value || '',treety)
		this.setState({section:value || '', treetype:'', treetypename:''})
	}

	ontypechange(value) {
		const {typeselect,keycode = ''} = this.props;
		const {section} = this.state;
		typeselect(value || '',keycode,section)
		this.setState({treety:value || '', treetype:'', treetypename:''})
	}

	ontreetypechange(value) {
		const {treetypelist} = this.props;
		let treetype = treetypelist.find(rst => rst.name == value)
		this.setState({treetype:treetype?treetype.oid:'',treetypename:value || ''})
    }

    nurserynamechange(value) {
		this.setState({nurseryname: value.target.value})
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
    		treety = '',
    		integrity = '',
    		treetype = '',
    		nurseryname = '',
    	} = this.state;
    	const {actions: {getHonestyNew},keycode = ''} = this.props;
    	let postdata = {
    		section,
    		treety,
    		integrity,
    		treetype,
    		nurseryname,
    	}
    	this.setState({loading:true,percent:0})
    	getHonestyNew({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst;
    		if(tblData instanceof Array) {
    			tblData.forEach((plan, i) => {
    				let treetys = []
    				if(plan.treetype.length > 1) {
    					treetys = plan.treetype.join(" , ")
    				}else {
    					treetys = plan.treetype
    				}
    				tblData[i].treetype = treetys
	    			tblData[i].order = ++i
    			})
				this.setState({ tblData});	
	    	}
    	})
    }

	exportexcel() {
		const {
    		treetype = '',
    		integrity = '',
    		nurseryname = '',
    		section = '',
    		treety = '',

    	} = this.state;
    	const {actions: {getHonestyNew,getexportTree},keycode = ''} = this.props;
    	let postdata = {
    		treetype,
    		integrity,
    		nurseryname,
    		section,
    		treety,
    	}
    	this.setState({loading:true,percent:0})
    	getHonestyNew({},postdata)
    	.then(result => {
            if(!result) {
            	this.setState({loading:false,percent:100})
    			return
    		}
    		if(result instanceof Array) {
    			let data = result.map((plan, i) => {
    				
    				return [
    					++i,
    					plan.nurseryname || '/',
    					plan.treetype.join() || '/',
    					plan.integrity || '',
    				]
    			})
	    		const postdata = {
	    			keys: ["序号", "供苗商", "树种" , "总诚信度"],
	    			values: data
	    		}
	    		getexportTree({},postdata)
	    		.then(rst3 => {
	    			this.setState({loading:false,percent:100})
	    			let url = `${FOREST_API}/${rst3.file_path}`
					this.createLink("excel_link", url);
	    		})
            } else {
            	this.setState({loading:false,percent:100})
            }
    	})
	}

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