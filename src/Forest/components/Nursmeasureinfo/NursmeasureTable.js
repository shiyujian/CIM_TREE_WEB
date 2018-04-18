import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Cascader} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import {getUser} from '_platform/auth'
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
        	stime: moment().format('YYYY-MM-DD 00:00:00'),
			etime: moment().format('YYYY-MM-DD 23:59:59'),
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
    	let user = getUser()
		this.sections = JSON.parse(user.sections)
	}
	getBiao(code){
		let str = '';
		PROJECT_UNITS.map(item => {
			item.units.map(single => {
				if(single.code === code){
					str = single.value;
				}
			})
		})
		return str;
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
					<img style={{width:"490px"}} src={this.state.src} alt="图片"/>
				</Modal>
			</div>
		);
	}
	treeTable(details) {
		const {
			treetypeoption,
			sectionoption,
			typeoption,
			mmtypeoption,
			leftkeycode = '',
			keycode = '',
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
			mmtype
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
			title:"顺序码",
			dataIndex: 'ZZBM',
		},{
			title:"标段",
			dataIndex: 'BD',
			render:(text,record) => {
				return <p>{this.getBiao(text)}</p>
			}
		},{
			title:"树种",
			dataIndex: 'TreeTypeObj.TreeTypeName',
		},{
			title:"苗龄",
			dataIndex: 'Age',
			render:(text,record) => {
				if(record.BD.indexOf('P010') !== -1){
					if(text === 0){
						return <p> / </p>
					}else{
						return <p>{text}</p>
					}
				}else{
					return <p> / </p>
				}
			}
		},{
			title:"产地",
			dataIndex: 'TreePlace',
		},{
			title:"供应商",
			dataIndex: 'Factory',
		},{
			title:"苗圃名称",
			dataIndex: 'NurseryName',
		},{
			title:"填报人",
			dataIndex: 'Inputer',
			render: (text,record) => {
				return <span>{users&&users[text] ? users[text].Full_Name+"("+users[text].User_Name+")": ''}</span>
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
			title:<div><div>高度</div><div>(cm)</div></div>,
			render: (text,record) => {
				if(record.GD != 0)
					return <a disabled={!record.GDFJ} onClick={this.onImgClick.bind(this,record.GDFJ)}>{record.GD}</a>
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
			title:<div><div>胸径</div><div>(cm)</div></div>,
			render: (text,record) => {
				if(record.XJ != 0)
					return <a disabled={!record.XJFJ} onClick={this.onImgClick.bind(this,record.XJFJ)}>{record.XJ}</a>
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
			title:<div><div>土球厚度</div><div>(cm)</div></div>,
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
					<Col  xl={3} lg={5} md={6} className='mrg10'>
							<span>顺序码：</span>
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
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>产地：</span>
							<Input suffix={suffix4} value={treeplace} className='forestcalcw2 mxw150' onChange={this.placechange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>供应商：</span>
							<Input suffix={suffix3} value={factory} className='forestcalcw3 mxw150' onChange={this.factorychange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>苗圃：</span>
							<Input suffix={suffix5} value={nurseryname} className='forestcalcw2 mxw150' onChange={this.nurschange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>填报人：</span>
							<Input suffix={suffix2} value={rolename} className='forestcalcw3 mxw150' onChange={this.onrolenamechange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>状态：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' onChange={this.onstatuschange.bind(this)} value={status}>
								{statusoption}
							</Select>
						</Col>
						<Col xl={8} lg={9} md={10} className='mrg10'>
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
						{
							keycode === '' ? null : keycode.indexOf('P010') === -1 ? null :
							<Col xl={3} lg={4} md={5} className='mrg10'>
								<span>苗木类型：</span>
								<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={mmtype} onChange={this.onmmtypechange.bind(this)}>
									{mmtypeoption}
								</Select>
							</Col>
						}
					</Row>
					<Row>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
							</Button>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.handleTableChange.bind(this,{current:1})}>
								查询
							</Button>
						</Col>
						<Col span={18} className='quryrstcnt mrg10'>
							<span >此次查询共有苗木：{this.state.pagination.total}棵</span>
						</Col>
						<Col span={2} className='mrg10'>
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
	onmmtypechange(value){
		this.setState({mmtype:value})
	}

	ontreetypechange(value) {
    	// const {treetypelist} = this.props;
		// let treetype = treetypelist.find(rst => rst.TreeTypeName == value);
		// this.setState({treetype:treetype?treetype.ID:'',treetypename:value || ''})
		this.setState({treetype:value,treetypename:value})
    }

    onstatuschange(value) {    	
		this.setState({status: value})
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
			mmtype = ''
    	} = this.state;
    	const {actions: {getnurserys},keycode = ''} = this.props;
    	let postdata = {
    		// no:keycode,
    		sxm,
    		bd:section === '' ? keycode : section,
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
		if(this.sections.length !== 0){  //不是admin，要做查询判断了
			if(section === ''){
				message.info('请选择标段信息');
				return;
			}
		}
		if(keycode!== ''&& keycode.indexOf('P010') !== -1){   //有苗木类型选项
			postdata.foresttype = mmtype
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
	    			tblData[i].statusname = plan.IsPack === 0 ? '未打包' : '已打包';
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			tblData[i].liftertime1 = !!plan.CreateTime ? moment(plan.CreateTime).format('YYYY-MM-DD') : '/';
					tblData[i].liftertime2 = !!plan.CreateTime ? moment(plan.CreateTime).format('HH:mm:ss') : '/';
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
			mmtype
		} = this.state;
		if(this.sections.length !== 0){  //不是admin，要做查询判断了
			if(section === ''){
				message.info('请选择标段信息');
				return;
			}
		}
    	const {actions: {getnurserys,getexportNurserys},keycode = ''} = this.props;
    	let postdata = {
    		// no:keycode,
    		sxm,
    		bd:section === '' ? keycode : section,
    		bigType,
    		treetype,
    		factory,
    		treeplace,
    		nurseryname,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page: 1,
    		size: exportsize,
    		status,
		}
		if(keycode!== ''&& keycode.indexOf('P010') !== -1){   //有苗木类型选项
			postdata.foresttype = mmtype
		}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getexportNurserys({},postdata)
		.then(rst3 => {
			if(rst3 === ''){
				message.info('没有符合条件的信息');
			}else{
				this.createLink(this,`${FOREST_API}/${rst3}`)
			}
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