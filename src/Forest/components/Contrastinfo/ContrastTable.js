import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import {getUser} from '_platform/auth'
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class ContrastTable extends Component {
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
        	stime: moment().format('YYYY-MM-DD 00:00:00'),
			etime: moment().format('YYYY-MM-DD 23:59:59'),
			sxm: '',
			section: '',
    		bigType: '',
    		treetype: '',
    		treetypename: '',
    		factory: '',
    		isstandard: '',
			percent:0,
			nursery:''
        }
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
    componentDidMount() {
    	let user = getUser()
		this.sections = JSON.parse(user.sections)
	}
	getThinClassName(no,section){
		const {littleBanAll} = this.props;
		let nob = no.substring(0,15);
		let sectionn = section.substring(8,10);
		let result = '/'
		
		if(littleBanAll){
			littleBanAll.map(item => {
				if(item.No.substring(0,15) === nob && item.No.substring(16,18) === sectionn){
					result = item.ThinClassName;
					return;
				}
			})
		}else{
			return <p> / </p>
		}
		return result;
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
		console.log('details',details)
		const {
			treetypeoption,
			sectionoption,
			typeoption,
			leftkeycode,
			keycode,
			standardoption,
		} = this.props;
		const {
			sxm, 
			factory,
			nursery,
			section,
			bigType,
			treetypename,
			isstandard,
		} = this.state;
		//清除
		const suffix1 = sxm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		const suffix2 = factory ? <Icon type="close-circle" onClick={this.emitEmpty2} /> : null;
		const suffix3 = nursery ? <Icon type="close-circle" onClick={this.emitEmpty3} /> : null;
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"顺序码",
			dataIndex: 'ZZBM',
		}
		// ,{
		// 	title:"项目",
		// 	dataIndex: 'Project',
		// }
		,{
			title:"标段",
			dataIndex: 'Section',
			render:(text,record) => {
				return <p>{this.getBiao(text)}</p>
			}
		},{
			title:"位置",
			dataIndex: 'place',
		},{
			title:"树种",
			dataIndex: 'TreeTypeObj.TreeTypeName',
		},{
			title:"供应商",
			dataIndex: 'Factory',
		},{
			title:"苗圃名称",
			dataIndex: 'NurseryName',
		},{
			title: "起苗时间",
			render: (text,record) => {
				const {liftertime1 = '',liftertime2 = '' } = record;
				return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
			}
		},{
			title:<div><div>高度</div><div>(供应商)</div></div>,
			render: (text,record) => {
				if(record.FGD && record.FGD != 0)
					return <a disabled={!record.FGDFJ} onClick={this.onImgClick.bind(this,record.FGDFJ)}>{record.FGD}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球厚度</div><div>(供应商)</div></div>,
			render: (text,record) => {
				if(record.FTQHD && record.FTQHD != 0)
					return <a disabled={!record.FTQHDFJ} onClick={this.onImgClick.bind(this,record.FTQHDFJ)}>{record.FTQHD}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(供应商)</div></div>,
			render: (text,record) => {
				if(record.FTQZJ && record.FTQZJ != 0)
					return <a disabled={!record.FTQZJFJ} onClick={this.onImgClick.bind(this,record.FTQZJFJ)}>{record.FTQZJ}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>高度</div><div>(监理)</div></div>,
			render: (text,record) => {
				if(record.GD && record.GD != 0)
					return <a disabled={!record.GDFJ} onClick={this.onImgClick.bind(this,record.GDFJ)}>{record.GD}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球高度</div><div>(监理)</div></div>,
			render: (text,record) => {
				if(record.TQHD && record.TQHD != 0)
					return <a disabled={!record.TQHDFJ} onClick={this.onImgClick.bind(this,record.TQHDFJ)}>{record.TQHD}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(监理)</div></div>,
			render: (text,record) => {
				if(record.TQZJ && record.TQZJ != 0)
					return <a disabled={!record.TQZJFJ} onClick={this.onImgClick.bind(this,record.TQZJFJ)}>{record.TQZJ}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title: "是否合标",
			render: (text,record) => {
				return <div>
					{
						record.IsStandard == 1
						? <span>合标</span>
						: <span style={{color: 'red'}}>不合标</span>
					}
				</div>
			}
		},{
			title:"监理人",
			render: (text,record) => {
				if(text === 0){
					return <p> / </p>
				}
				return <span>{users&&users[text] ? users[text].Full_Name+"("+users[text].User_Name+")": ''}</span>
			}
		}];
		header = <div >
					<Row>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>顺序码：</span>
							<Input suffix={suffix1} value={sxm} className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
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
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>供应商：</span>
							<Input suffix={suffix2} value={factory} className='forestcalcw3 mxw150' onChange={this.factorychange.bind(this)}/>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>是否合标：</span>
							<Select allowClear className='forestcalcw4 mxw100' defaultValue='全部' value={isstandard} onChange={this.standardchange.bind(this)}>
								{standardoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>供应商：</span>
							<Input suffix={suffix3} value={nursery} className='forestcalcw3 mxw100' onChange={this.nurserychange.bind(this)}/>
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
							<Button type='primary' style={{display:'none'}} onClick={this.exportexcel.bind(this)}>
								导出
							</Button>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
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
	    this.setState({factory: ''});
  	}

	emitEmpty3 = () => {
	    this.setState({nursery: ''});
  	}
	sxmchange(value) {
		this.setState({sxm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		sectionselect(value || '')
		this.setState({section:value || '', bigType:'', treetype:'', treetypename:''})
	}

	ontypechange(value) {
		const {typeselect} = this.props;
		typeselect(value || '')
		this.setState({bigType:value || '', treetype:'', treetypename:''})
	}

	ontreetypechange(value) {
		this.setState({treetype:value,treetypename:value})
    }

    factorychange(value) {
		this.setState({factory: value.target.value})
	}

	nurserychange(value) {
		this.setState({nursery:value.target.value})
	}

	standardchange(value) {
		this.setState({isstandard:value || ''})
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
    		bigType = '',
    		treetype = '',
			factory = '',
			nursery = '',
    		isstandard = '',
    		stime = '',
    		etime = '',
    		size,
		} = this.state;
		// if(this.sections.length !== 0){  //不是admin，要做查询判断了
		// 	if(section === ''){
		// 		message.info('请选择标段信息');
		// 		return;
		// 	}
		// }
		if(section === '' && sxm === ''){
			message.info('请选择项目及标段信息或输入顺序码');
			return;
		}
    	const {actions: {getfactoryAnalyse},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		bigType,
    		treetype,
			factory,
			nurseryname:nursery,
    		isstandard,
    		// stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		// etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
    		size
    	}
    	this.setState({loading:true,percent:0})
    	getfactoryAnalyse({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			// const {attrs = {}} = plan;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			let place = ''
					if(plan.Section.indexOf('P010') !== -1){
						place = this.getThinClassName(plan.No,plan.Section);
					}else{
						place = `${plan.SmallClass}号小班${plan.ThinClass}号细班`
					}
	    			tblData[i].place = place;
					let liftertime1 = !!plan.LifterTime ? moment(plan.LifterTime).format('YYYY-MM-DD') : '/';
					let liftertime2 = !!plan.LifterTime ? moment(plan.LifterTime).format('HH:mm:ss') : '/';
					tblData[i].liftertime1 = liftertime1;
					tblData[i].liftertime2 = liftertime2;
					// tblData[i].Project = this.getProject(tblData[i].Section)
	    		})
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination });	
	    	}
    	})
	}
	
	getProject(section){
		let projectName = ''
		//获取当前标段所在的项目
		PROJECT_UNITS.map((item)=>{
			if(section.indexOf(item.code) != -1){
				projectName = item.value
			}
		})
		return projectName
	}

	exportexcel() {
		const {
			sxm = '',
    		section = '',
    		treetype = '',
			factory = '',
			nurseryname:nursery,
    		isstandard = '',
    		stime = '',
    		etime = '',
    		exportsize,
		} = this.state;
		if(this.sections.length !== 0){  //不是admin，要做查询判断了
			if(section === ''){
				message.info('请选择标段信息');
				return;
			}
		}
    	const {actions: {getfactoryAnalyse,getexportFactoryAnalyse},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		treetype,
			factory,
			nurseryname:nursery,
    		isstandard,
    		// stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		// etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page:1,
    		size:exportsize
    	}
    	this.setState({loading:true,percent:0})
    	getexportFactoryAnalyse({},postdata)
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