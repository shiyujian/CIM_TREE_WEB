import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class CheckerTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	pagination: {},
        	loading: false,
        	size:10,
        	exportsize: 100,
        	leftkeycode: '',
        	stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
			sxm: '',
    		section: '',
    		smallclass: '',
    		thinclass: '',
    		status: '',
    		treety: '',
    		treetype: '',
    		CheckStatus: '',
    		locationstatus: '',
    		role: 'checker',
    		rolename: '',
    		percent:0,        
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
				<Modal
					width={522}
					title='详细信息'
					style={{textAlign:'center'}}
					visible={this.state.imgvisible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<img style={{width:"490px",height:"300px"}} src={this.state.src} alt="图片"/>
				</Modal>
			</div>
		);
	}
	treeTable(details) {
		console.log('details',details)
		const {
			treetypeoption,
			sectionoption,
			smallclassoption,
			thinclassoption,
			typeoption,
			leftkeycode,
			keycode,
			statusoption,
			locationoption,
			users,
		} = this.props;
		const {
			sxm, 
			rolename,
			section,
			smallclass,
			thinclass,
			status,
		} = this.state;
		const suffix1 = sxm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		const suffix2 = rolename ? <Icon type="close-circle" onClick={this.emitEmpty2} /> : null;
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"编码",
			dataIndex: 'ZZBM',
		},{
			title:"标段",
			dataIndex: 'Section',
		},{
			title:"位置",
			dataIndex: 'place',
		},{
			title:"树种",
			dataIndex: 'TreeTypeObj.TreeTypeName',
		},{
			title:"抽查人",
			dataIndex: 'Checker',
			render: (text,record) => {
				return <span>{users&&users[text] ? users[text].Full_Name : ''}</span>
			}
		},{
			title:"状态",
			dataIndex: 'statusname',
		},{
			title:"定位",
			dataIndex: 'locationstatus',
		},{
			title:"状态信息",
			dataIndex: 'SupervisorInfo',
		},{
			title:"状态时间",
			render: (text,record) => {
				const {checktime1 = '',checktime2 = '' } = record;
				return <div><div>{checktime1}</div><div>{checktime2}</div></div>
			}
		}];
		header = <div >
					<Row>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>编码：</span>
							<Input  suffix={suffix1} value={sxm} className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>标段：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>小班：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={smallclass} onChange={this.onsmallclasschange.bind(this)}>
								{smallclassoption}
							</Select>
						</Col>
						<Col xl={4} lg={6} md={7} className='mrg10'>
							<span>细班：</span>
							<Select allowClear className='forestcalcw2 mxw170' defaultValue='全部' value={thinclass} onChange={this.onthinclasschange.bind(this)}>
								{thinclassoption}
							</Select>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>状态：</span>
							<Select allowClear className='forestcalcw2 mxw150' defaultValue='全部' value={status} onChange={this.onstatuschange.bind(this)}>
								{statusoption}
							</Select>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>抽查人：</span>
							<Input suffix={suffix2} value={rolename} className='forestcalcw3 mxw100' onChange={this.onrolenamechange.bind(this)}/>
						</Col>
						<Col xl={10} lg={12} md={14} className='mrg10'>
							<span>抽查时间：</span>
							<RangePicker 
							 style={{verticalAlign:"middle"}} 
							 defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]} 
							 showTime={{ format: 'HH:mm:ss' }}
							 format={'YYYY/MM/DD HH:mm:ss'}
							 onChange={this.datepick.bind(this)}
							 onOk={this.datepick.bind(this)}
							>
							</RangePicker>
						</Col>
					</Row>
					<Row>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.handleTableChange.bind(this,{current:1})}>
								查询
							</Button>
						</Col>
						<Col span={18} className='quryrstcnt mrg10'>
							<span >此次查询共有苗木：{this.state.pagination.total}棵</span>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
							</Button>
						</Col>
						<Col span={2} className='mrg10'>
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
						 locale={{emptyText:'当天无业主抽查信息'}}
						 dataSource={details}
						 onChange={this.handleTableChange.bind(this)}
						 pagination={this.state.pagination}
						/>
					</Row>
				</div>
	}

	emitEmpty1 = () => {
	    this.setState({sxm: ''});
  	}

  	emitEmpty2 = () => {
	    this.setState({rolename: ''});
  	}

	sxmchange(value) {
		this.setState({sxm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		sectionselect(value || '')
		this.setState({section:value || '', smallclass:'', thinclass:''})
	}

	onsmallclasschange(value) {
		const {smallclassselect} = this.props;
		const {section,leftkeycode} = this.state;
		smallclassselect(value || leftkeycode,section);
		this.setState({smallclass:value || '',thinclass:''})
	}

	onthinclasschange(value) {
		const {thinclassselect} = this.props;
		const {section,smallclass} = this.state;
		thinclassselect(value || smallclass,section);
		this.setState({thinclass:value || ''})
	}

	onstatuschange(value) {
		console.log('value',value)
		let CheckStatus = '';
		switch(value){
			case "1": 
				CheckStatus = 0;
				break;
			case "2": 
				CheckStatus = -1;
				break;
			case "3": 
				CheckStatus = 1;
				break;
			default:
				break;
		}
		this.setState({CheckStatus,status:value || ''})
    }

    onlocationchange(value) {
		this.setState({locationstatus:value})
    }

	onrolenamechange(value) {
		this.setState({rolename:value.target.value})
	}

	datepick(value){
		this.setState({stime:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
		this.setState({etime:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
    }

	handleTableChange(pagination){
        const pager = { ...this.state.pagination};
        pager.current = pagination.current;
    	this.setState({
        	pagination: pager,
        });
        this.qury(pagination.current)
    }

	onImgClick(src) {
		src = src.replaceAll('//','/')
		src =  `${FOREST_API}/${src}`
		this.setState({src},() => {
			this.setState({imgvisible:true,})
		})
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
    		sxm = '',
    		section = '',
    		status = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		size,
    	} = this.state;
    	const {actions: {getqueryTree},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		status,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
    		size
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getqueryTree({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			// const {attrs = {}} = plan;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			let place = `${plan.No.substring(3,4)}号地块${plan.No.substring(6,7)}区${plan.No.substring(8,11)}号小班${plan.No.substring(12,15)}号细班`;
	    			tblData[i].place = place;
	    			let statusname = '';
					if(plan.CheckStatus == 0)
						statusname = "抽检不通过"
					else if(plan.CheckStatus == -1) 
						statusname = "业主未抽查"
					else {
						statusname = "抽检通过"
					}
					tblData[i].statusname = statusname;
					let locationstatus = !!plan.LocationTime ? '已定位' : '未定位';
					tblData[i].locationstatus = locationstatus;
					let checktime1 = !!plan.CheckTime ? moment(plan.CheckTime).format('YYYY-MM-DD') : '/';
					let checktime2 = !!plan.CheckTime ? moment(plan.CheckTime).format('HH:mm:ss') : '/';
					tblData[i].checktime1 = checktime1;
					tblData[i].checktime2 = checktime2;
	    		})
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination });	
	    	}
    	})
    }

	exportexcel() {
		const {
    		sxm = '',
    		section = '',
    		// CheckStatus = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		exportsize,
    	} = this.state;
    	const {actions: {getqueryTree,getexportTree4Checker},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		// CheckStatus,
    		stime:stime&&moment(stime).unix(),
    		etime:etime&&moment(etime).unix(),
    		page:1,
    		size:exportsize
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getexportTree4Checker({},postdata)
		.then(rst3 => {
			console.log('rst3',rst3)
			this.setState({loading:false})
			window.location.href = `${FOREST_API}/${rst3}`
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