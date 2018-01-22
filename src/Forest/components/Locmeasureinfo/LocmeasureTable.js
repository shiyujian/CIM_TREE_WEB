import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class LocmeasureTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	pagination: {},
        	loading: false,
        	size:10,
        	exportsize:100,
        	leftkeycode: '',
        	stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
			sxm: '',
    		section: '',
    		treety: '',
    		treetype: '',
    		smallclass: '',
        	thinclass: '',
        	treetypename: '',
        	status: '',
    		SupervisorCheck: '',
    		CheckStatus: '',
    		islocation: '',
    		role: 'inputer',
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
		console.log('details',details);
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
		} = this.props;
		const {
			sxm, 
			rolename,
			section,
			smallclass,
			thinclass,
			treety,
			treetypename,
			status,
			islocation,
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
			dataIndex: 'TreeTypeObj.TreeTypeNo',
		},{
			title:"状态",
			dataIndex: 'statusname',
		},{
			title:"定位",
			dataIndex: 'islocation',
		},{
			title:"测量人",
			render: (text,record) => {
				return <span>{record.Inputer || '/'}</span>
				
			}
		},{
			title:"测量时间",
			render: (text,record) => {
				const {createtime1 = '',createtime2 = '' } = record;
				return <div><div>{createtime1}</div><div>{createtime2}</div></div>
			}
		},{
			title:<div><div>树高</div><div>(cm)</div></div>,
			render: (text,record) => {
				if(record.GD != 0)
					return <a disabled={!record.GDFJ} onClick={this.onImgClick.bind(this,record.GDFJ)}>{record.GD}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>胸径</div><div>(cm)</div></div>,
			render: (text,record) => {
				if(record.XJ != 0)
					return <a disabled={!record.XJFJ} onClick={this.onImgClick.bind(this,record.XJFJ)}>{record.XJ}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>冠幅</div><div>(cm)</div></div>,
			render: (text,record) => {
				if(record.GF != 0)
					return <a disabled={!record.GFFJ} onClick={this.onImgClick.bind(this,record.GFFJ)}>{record.GF}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>地径</div><div>(cm)</div></div>,
			render: (text,record) => {
				if(record.DJ != 0)
					return <a disabled={!record.DJFJ} onClick={this.onImgClick.bind(this,record.DJFJ)}>{record.DJ}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球高度</div><div>(cm)</div></div>,
			dataIndex: 'tqhd',
			render: (text,record) => {
				if(record.TQHD != 0)
					return <a disabled={!record.TQHDFJ} onClick={this.onImgClick.bind(this,record.TQHDFJ)}>{record.TQHD}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(cm)</div></div>,
			dataIndex: 'tqzj',
			render: (text,record) => {
				if(record.TQZJ != 0)
					return <a disabled={!record.TQHDFJ} onClick={this.onImgClick.bind(this,record.TQHDFJ)}>{record.TQZJ}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>是否</div><div>截干</div></div>,
			render: (text,record) => {
				return <div>
							{
								record.JG == 1
								? <span>是</span>
								: <span>否</span>
							}
						</div>
			}
		},{
			title:<div><div>干皮有无</div><div>损伤</div></div>,
			render: (text,record) => {
				return <div>
							{
								record.GP == 1
								? <span>有</span>
								: <span>无</span>
							}
						</div>
			}
		},{
			title:<div><div>冠型完整，</div><div>不偏冠</div></div>,
			render: (text,record) => {
				return <div>
							{
								record.GXWZ == 1
								? <span>是</span>
								: <span>否</span>
							}
						</div>
			}
		},{
			title:<div><div>生长</div><div>健壮</div></div>,
			render: (text,record) => {
				return <div>
							{
								record.SZJZ == 1
								? <span>是</span>
								: <span>否</span>
							}
						</div>
			}
		},{
			title:<div><div>有无病</div><div>虫害</div></div>,
			render: (text,record) => {
				return <div>
							{
								record.BCH == 1
								? <span>有</span>
								: <span>无</span>
							}
						</div>
			}
		}];
		header = <div >
					<Row >
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>编码：</span>
							<Input suffix={suffix1} value={sxm}  className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
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
						<Col xl={3} lg={5} md={6} className='mrg10'>
							<span>状态：</span>
							<Select allowClear className='forestcalcw2 mxw150' defaultValue='全部' value={status} onChange={this.onstatuschange.bind(this)}>
								{statusoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>定位：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={islocation} onChange={this.onlocationchange.bind(this)}>
								{locationoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>测量人：</span>
							<Input suffix={suffix2} value={rolename}  className='forestcalcw3 mxw100' onChange={this.onrolenamechange.bind(this)}/>
						</Col>
						<Col xl={10} lg={12} md={14} className='mrg10'>
							<span>测量时间：</span>
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
					<Row >
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
						 locale={{emptyText:'当天无现场测量信息'}}
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
		const {treety} = this.state;
		sectionselect(value || '',treety)
		this.setState({section:value || '', smallclass:'', thinclass:'', treetype:'', treetypename:''})
	}

	onsmallclasschange(value) {
		const {smallclassselect} = this.props;
		const {treety,section,leftkeycode} = this.state;
		smallclassselect(value || leftkeycode,treety,section);
		this.setState({smallclass:value || '', thinclass:'', treetype:'', treetypename:''})
	}

	onthinclasschange(value) {
		const {thinclassselect} = this.props;
		const {treety,section,smallclass} = this.state;
		thinclassselect(value || smallclass,treety,section);
		this.setState({thinclass:value || '', treetype:'', treetypename:''})
	}

	ontypechange(value) {
		const {typeselect,keycode = ''} = this.props;
		const {section} = this.state;
		typeselect(value || '',keycode,section)
		this.setState({treety:value || '', treetype:'', treetypename:''})
	}

	ontreetypechange(value) {
		const {treetypelist} = this.props;
		let treetype = treetypelist.find(rst => rst.TreeTypeNo == value)
		this.setState({treetype:treetype?treetype.ID:'',treetypename:value || ''})
    }

	onstatuschange(value) {
		let SupervisorCheck = '';
		let CheckStatus  = '';
		switch(value){
			case "1": 
				SupervisorCheck = -1;
				break;
			case "2": 
				SupervisorCheck = 1;
				CheckStatus = -1;
				break;
			case "3": 
				SupervisorCheck = 0;
				break;
			case "4": 
				SupervisorCheck = 1;
				CheckStatus = 0;
				break;
			case "5": 
				SupervisorCheck = 1;
				CheckStatus = 1;
				break;
			// case "6": 
			// 	SupervisorCheck = 1;
			// 	CheckStatus = 2;
			// 	break;
			default:
				break;
		}
		this.setState({SupervisorCheck,CheckStatus,status:value || ''})

    }

    onlocationchange(value) {
		this.setState({islocation:value || ''})
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
		src = src.replace(/\/\//g,'/')
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
    		treety = '',
    		treetype = '',
    		supervisorcheck = '',
    		checkstatus = '',
    		islocation = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		status = '',
    		size,
    	} = this.state;
    	const {actions: {getqueryTree},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		treety,
    		treetype,
    		supervisorcheck,
    		checkstatus,
    		islocation,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		status,
    		page,
    		size:size
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
	    			console.log('plan.No',~~plan.No)
	    			let place = `${plan.No.substring(3,4)}号地块${plan.No.substring(6,7)}区${plan.No.substring(8,11)}号小班${plan.No.substring(12,15)}号细班`;
	    			tblData[i].place = place;
	    			let statusname = '';
					if(plan.SupervisorCheck == -1)
						statusname = "待审批"
					else if(plan.SupervisorCheck == 0) 
						statusname = "审批未通过"
					else {
						if(plan.CheckStatus == 0)
							statusname = "抽检不通过"
						else if(plan.CheckStatus == 1)
							statusname = "抽检通过"
						// else if(plan.CheckStatus == 2)
							
						else {
							statusname = "审批通过"
						}
					}
					tblData[i].statusname = statusname;
					let islocation = !!plan.LocationTime ? '已定位' : '未定位';
					tblData[i].islocation = islocation;
					let createtime1 = !!plan.CreateTime ? moment(plan.CreateTime).utc().format('YYYY-MM-DD') : '/';
					let createtime2 = !!plan.CreateTime ? moment(plan.CreateTime).utc().format('HH:mm:ss') : '/';
					tblData[i].createtime1 = createtime1;
					tblData[i].createtime2 = createtime2;
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
    		treety = '',
    		treetype = '',
    		supervisorcheck = '',
    		checkstatus = '',
    		locationstatus = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		exportsize,
    	} = this.state;
    	const {actions: {getqueryTree,getexportTree},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		treetype,
    		// supervisorcheck,
    		// checkstatus,
    		// locationstatus,
    		stime:stime&&moment(stime).add(8, 'h').unix(),
    		etime:etime&&moment(etime).add(8, 'h').unix(),
    		page:1,
    		size:exportsize
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getexportTree({},postdata)
		.then(rst3 => {
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