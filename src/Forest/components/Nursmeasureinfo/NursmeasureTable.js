import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Cascader} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class NursmeasureTable extends Component {
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
    		bigType: '',
    		treetype: '',
    		treetypename: '',
    		treeplace: '',
    		nurseryname: '',
    		factory: '',
    		role: 'inputer',
    		rolename: '',
    		percent: 0,
    		supervisorcheck: '',
    		checkstatus: '',
    		status: '',
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
		const {
			treetypeoption,
			sectionoption,
			typeoption,
			leftkeycode,
			keycode,
			statusoption,
			users
		} = this.props;
		const {
			sxm, 
			rolename, 
			factory, 
			treeplace, 
			nurseryname,
			section,
			bigType,
			treetypename,
			status,
		} = this.state;
		const suffix1 = sxm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		const suffix2 = rolename ? <Icon type="close-circle" onClick={this.emitEmpty2} /> : null;
		const suffix3 = factory ? <Icon type="close-circle" onClick={this.emitEmpty3} /> : null;
		const suffix4 = treeplace ? <Icon type="close-circle" onClick={this.emitEmpty4} /> : null;
		const suffix5 = nurseryname ? <Icon type="close-circle" onClick={this.emitEmpty5} /> : null;
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
			dataIndex: 'BD',
		},{
			title:"树种",
			dataIndex: 'TreeTypeObj.TreeTypeNo',
		},{
			title:"产地",
			dataIndex: 'TreePlace',
		},{
			title:"供苗商",
			dataIndex: 'Factory',
		},{
			title:"苗圃名称",
			dataIndex: 'NurseryName',
		},{
			title:"填报人",
			dataIndex: 'Inputer',
			render: (text,record) => {
				return <span>{users&&users[text] ? users[text].Full_Name : ''}</span>
			}
		},{
			title:"起苗时间",
			render: (text,record) => {
				const {liftertime1 = '',liftertime2 = '' } = record;
				return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
			}
		},{
			title:"状态",
			dataIndex: 'statusname',
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
					return <a disabled={!record.TQZJFJ} onClick={this.onImgClick.bind(this,record.TQZJFJ)}>{record.TQZJ}</a>
				else {
					return <span>/</span>
				}
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
							<span>类型：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={bigType} onChange={this.ontypechange.bind(this)}>
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
							<span>苗圃：</span>
							<Input suffix={suffix5} value={nurseryname} className='forestcalcw2 mxw200' onChange={this.nurschange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>填报人：</span>
							<Input suffix={suffix2} value={rolename} className='forestcalcw3 mxw150' onChange={this.onrolenamechange.bind(this)}/>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>供苗商：</span>
							<Input suffix={suffix3} value={factory} className='forestcalcw3 mxw200' onChange={this.factorychange.bind(this)}/>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>产地：</span>
							<Input suffix={suffix4} value={treeplace} className='forestcalcw2 mxw200' onChange={this.placechange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>状态：</span>
							<Cascader 
								allowClear
								className='forestcalcw2 mxw150' 
								defaultValue={['']}
								// value={[status]}
								options={statusoption} 
								expandTrigger='hover' 
								onChange={this.onstatuschange.bind(this)} 
								changeOnSelect 
							/>
						</Col>
						<Col xl={10} lg={11} md={12} className='mrg10'>
							<span>起苗时间：</span>
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
						 locale={{emptyText:'当天无苗圃测量信息'}}
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

  	emitEmpty3 = () => {
	    this.setState({factory: ''});
  	}

  	emitEmpty4 = () => {
	    this.setState({treeplace: ''});
  	}

  	emitEmpty5 = () => {
	    this.setState({nurseryname: ''});
  	}

	sxmchange(value) {
		this.setState({sxm:value.target.value})
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
		let treetype = treetypelist.find(rst => rst.TreeTypeNo == value);
		this.setState({treetype:treetype?treetype.ID:'',treetypename:value || ''})
    }

    onstatuschange(value) {    	
    	let status = '';
    	if (value.length === 2) {
    		switch(value[1]){
    			// 进场退回
				case "1": 
					status = 1;
					break;
				// 监理退回
				case "2": 
					status = 2;
					break;
				// 业主退回
				case "3": 
					status = 3;
					break;
				default:
					break;
			}
    	} else {
    		switch(value[0]) {
    			//已种植
    			case "0":
    				status = 0;
    				break;
    			//未种植
    			case "-1":
    				status = -1;
    				break;
    			default:
    				break;
    		}
    	}
		this.setState({status: value[1] || value[0] || ''})
	}

	onrolenamechange(value) {
		this.setState({rolename:value.target.value})
	}

	factorychange(value) {
		this.setState({factory: value.target.value})
	}

	placechange(value) {
		this.setState({treeplace: value.target.value})
	}
	
	nurschange(value) {
		this.setState({nurseryname: value.target.value})
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
        this.qury(pagination.current);
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
    		bigType = '',
    		treetype = '',
    		factory = '',
    		treeplace = '',
    		nurseryname = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		size,
    		supervisorcheck = '',
    		checkstatus = '',
    		status = '',
    	} = this.state;
    	const {actions: {getnurserys},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		bigType,
    		treetype,
    		factory,
    		treeplace,
    		nurseryname,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
    		size,
    		supervisorcheck,
    		checkstatus,
    		status,
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getnurserys({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			let statusname = plan.statusname;
	    			if(postdata.status === '0') 
	    				statusname = '已种植'
	    			else if(postdata.status === '1')
	    				statusname = '进场退回'
	    			else if(postdata.status === '2')
	    				statusname = '监理退回'
	    			else if(postdata.status === '3')
	    				statusname = '业主退回'
	    			else
	    				statusname = ''
	    			tblData[i].statusname = statusname;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			tblData[i].liftertime1 = !!plan.LifterTime ? moment(plan.LifterTime).utc().format('YYYY-MM-DD') : '/';
					tblData[i].liftertime2 = !!plan.LifterTime ? moment(plan.LifterTime).utc().format('HH:mm:ss') : '/';
	    		})
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination });	
	    	}
    	})
    }

	exportexcel() {
		const {
    		sxm = '',
    		section = '',
    		bigType = '',
    		treetype = '',
    		factory = '',
    		treeplace = '',
    		nurseryname = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		exportsize,
    		status = '',
    	} = this.state;
    	const {actions: {getnurserys,getexportNurserys},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		bigType,
    		treetype,
    		factory,
    		treeplace,
    		nurseryname,
    		liftime_min:stime&&moment(stime).add(8, 'h').unix(),
    		liftime_max:etime&&moment(etime).add(8, 'h').unix(),
    		page: 1,
    		size: exportsize,
    		status,
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getexportNurserys({},postdata)
		.then(rst3 => {
			window.location.href = `${FOREST_API}/${rst3}`
			this.setState({loading:false})
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