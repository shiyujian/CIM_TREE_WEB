import React, {Component} from 'react';
import {Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Icon} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class NursOverallTable extends Component {
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
        	smallclass: '',
        	thinclass: '',
        	treetypename: '',
        	status: '',
        	keycode: '-1',
        	stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
			sxm: '',
    		section: '',
    		treety: '',
    		treetype: '',
    		gd_min: '',
    		gd_max: '',
    		xj_min: '',
    		xj_max: '',
    		gf_min: '',
    		gf_max: '',
    		dj_min: '',
    		dj_max: '',
    		tqhd_min: '',
    		tqhd_max: '',
    		tqzj_min: '',
    		tqzj_max: '',
    		gd: '',
			xj: '',
			gf: '',
			dj: '',
			tqhd: '',
			tqzj: '',
    		supervisorcheck: '',
    		checkstatus: '',
    		locationstatus: '',
    		factory: '',
    		role: 'person',
    		rolename: '',
    		percent: 0,
    		keyword: '',
        }
    }
    componentDidMount() {
    	
    }
    componentWillReceiveProps(nextProps){
    	if(nextProps.leftkeycode != this.state.leftkeycode) {
			this.setState({
				leftkeycode: nextProps.leftkeycode,
    		},() => {
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
			smallclassoption,
			thinclassoption,
			typeoption,
			roleoption,
			leftkeycode,
			keycode,
			statusoption,
			locationoption,
		} = this.props;
		const {
			sxm, 
			factory, 
			rolename,
			section,
			smallclass,
			thinclass,
			treetypename,
			treety,
			status,
			locationstatus,
			role,
		} = this.state;
		const suffix = sxm ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
		const suffix1 = factory ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
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
			dataIndex: 'status',
		},{
			title:"定位",
			dataIndex: 'locationstatus',
		},{
			title:"定位时间",
			render: (text,record) => {
				const {locationtime1 = '',locationtime2 = '' } = record;
				return <div><div>{locationtime1}</div><div>{locationtime2}</div></div>
			}
		},{
			title:"供苗商",
			dataIndex: 'Factory',
		},{
			title:"测量人",
			render: (text,record) => {
				const {attrs = {}}= record;
				return <span>{attrs.inputer || '/'}</span>
				
			}
		},{
			title: "监理人",
			render: (text,record) => {
				const {attrs = {}}= record;
				return <span>{attrs.supervisor || '/'}</span>
				
			}
		},{
			title: "抽查人",
			render: (text,record) => {
				const {attrs = {}}= record;
				return <span>{attrs.checker || '/'}</span>
				
			}
		},{
			title:<div><div>树高</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.gd != 0)
					return <a disabled={!attrs.gdfj} onClick={this.onImgClick.bind(this,attrs.gdfj)}>{attrs.gd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>胸径</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.xj != 0)
					return <a disabled={!attrs.xjfj} onClick={this.onImgClick.bind(this,attrs.xjfj)}>{attrs.xj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>冠幅</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.gf != 0)
					return <a disabled={!attrs.gffj} onClick={this.onImgClick.bind(this,attrs.gffj)}>{attrs.gf}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>地径</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.dj != 0)
					return <a disabled={!attrs.djfj} onClick={this.onImgClick.bind(this,attrs.djfj)}>{attrs.dj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球高度</div><div>(cm)</div></div>,
			dataIndex: 'tqhd',
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.tqhd != 0)
					return <a disabled={!attrs.tqhdfj} onClick={this.onImgClick.bind(this,attrs.tqhdfj)}>{attrs.tqhd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(cm)</div></div>,
			dataIndex: 'tqzj',
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.tqzj != 0)
					return <a disabled={!attrs.tqzjfj} onClick={this.onImgClick.bind(this,attrs.tqzjfj)}>{attrs.tqzj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>是否</div><div>截干</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				return <div>
							{
								attrs.jg == 1
								? <span>是</span>
								: <span>否</span>
							}
						</div>
			}
		},{
			title:<div><div>干皮有无</div><div>损伤</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				return <div>
							{
								attrs.gp == 1
								? <span>有</span>
								: <span>无</span>
							}
						</div>
			}
		},{
			title:<div><div>冠型完整，</div><div>不偏冠</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				return <div>
							{
								attrs.gxwz == 1
								? <span>是</span>
								: <span>否</span>
							}
						</div>
			}
		},{
			title:<div><div>生长</div><div>健壮</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				return <div>
							{
								attrs.szjz == 1
								? <span>是</span>
								: <span>否</span>
							}
						</div>
			}
		},{
			title:<div><div>有无病</div><div>虫害</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				return <div>
							{
								attrs.bch == 1
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
							<Input suffix={suffix} value={sxm} className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
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
						<Col xl={4} lg={6} md={8} className='mrg10'>
							<span>高度(cm)：</span>
							<InputNumber
							  className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.gdminchange.bind(this)}
						    />
						    &nbsp;<span>-</span>&nbsp;
						    <InputNumber
						      className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.gdmaxchange.bind(this)}
						    />
						</Col>
						<Col xl={4} lg={6} md={8} className='mrg10'>
							<span>胸径(cm)：</span>
							<InputNumber
							  className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.xjminchange.bind(this)}
						    />
						    &nbsp;<span>-</span>&nbsp;
						    <InputNumber
						      className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.xjmaxchange.bind(this)}
						    />
						</Col>
						<Col xl={4} lg={6} md={8} className='mrg10'>
							<span>冠幅(cm)：</span>
							<InputNumber
							  className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.gfminchange.bind(this)}
						    />
						    &nbsp;<span>-</span>&nbsp;
						    <InputNumber
						      className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.gfmaxchange.bind(this)}
						    />
						</Col>
						<Col xl={4} lg={6} md={8} className='mrg10'>
							<span>地径(cm)：</span>
							<InputNumber
							  className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.djminchange.bind(this)}
						    />
						    &nbsp;<span>-</span>&nbsp;
						    <InputNumber
						      className='forestcalcw4-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.djmaxchange.bind(this)}
						    />
						</Col>
						<Col xl={4} lg={7} md={8} className='mrg10'>
							<span>土球高度(cm)：</span>
							<InputNumber
							  className='forestcalcw6-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.tqhdminchange.bind(this)}
						    />
						    &nbsp;<span>-</span>&nbsp;
						    <InputNumber
						      className='forestcalcw6-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.tqhdmaxchange.bind(this)}
						    />
						</Col>
						<Col xl={4} lg={7} md={8} className='mrg10'>
							<span>土球直径(cm)：</span>
							<InputNumber
							  className='forestcalcw6-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.tqzjminchange.bind(this)}
						    />
						    &nbsp;<span>-</span>&nbsp;
						    <InputNumber
						      className='forestcalcw6-1 mxw80'
						      min={0}
						      max={9999.9}
						      step={0.1}
						      precision={1}
						      onChange={this.tqzjmaxchange.bind(this)}
						    />
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>定位：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={locationstatus} onChange={this.onlocationchange.bind(this)}>
								{locationoption}
							</Select>
						</Col>
						<Col xl={6} lg={7} md={8} className='mrg10'>
							<span>供苗商：</span>
							<Input suffix={suffix1} value={factory} className='forestcalcw3 mxw250' onChange={this.factorychange.bind(this)}/>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>角色：</span>
							<Select allowClear className='forestcalcw2-1 mxw50' defaultValue='全部' value={role} onChange={this.onrolechange.bind(this)}>
								{roleoption}
							</Select>
							<Input suffix={suffix2} value={rolename} className='forestcalcw2-1 mxw150' onChange={this.onrolenamechange.bind(this)}/>
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

	emitEmpty = () => {
	    this.setState({sxm: ''});
  	}

  	emitEmpty1 = () => {
	    this.setState({factory: ''});
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
		this.setState({smallclass:value || '',thinclass:'', treetype:'', treetypename:''})
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
		this.setState({treety:value || '' , treetype:'', treetypename:''})
	}

	ontreetypechange(value) {
		const {treetypelist} = this.props;
		let treetype = treetypelist.find(rst => rst.TreeTypeNo == value)
		this.setState({treetype:treetype?treetype.ID:'',treetypename:value || ''})
    }

	gdminchange(value) {
		this.setState({gd_min:value})
	}

	gdmaxchange(value) {
		this.setState({gd_max:value})
	}

	xjminchange(value) {
		this.setState({xj_min:value})
	}

	xjmaxchange(value) {
		this.setState({xj_max:value})
	}

	gfminchange(value) {
		this.setState({gf_min:value})
	}

	gfmaxchange(value) {
		this.setState({gf_max:value})
	}

	djminchange(value) {
		this.setState({dj_min:value})
	}

	djmaxchange(value) {
		this.setState({dj_max:value})
	}

	tqhdminchange(value) {
		this.setState({tqhd_min:value})
	}

	tqhdmaxchange(value) {
		this.setState({tqhd_max:value})
	}

	tqzjminchange(value) {
		this.setState({tqzj_min:value})
	}

	tqzjmaxchange(value) {
		this.setState({tqzj_max:value})
	}
	onstatuschange(value) {
		let supervisorcheck = '';
		let checkstatus  = '';
		switch(value){
			case "1": 
				supervisorcheck = -1;
				break;
			case "2": 
				supervisorcheck = 1;
				checkstatus = -1;
				break;
			case "3": 
				supervisorcheck = 0;
				break;
			case "4": 
				supervisorcheck = 1;
				checkstatus = 0;
				break;
			case "5": 
				supervisorcheck = 1;
				checkstatus = 1;
				break;
			case "6": 
				supervisorcheck = 1;
				checkstatus = 2;
				break;
			default:
				break;
		}
		this.setState({supervisorcheck,checkstatus,status:value || ''})
    }

    onlocationchange(value) {
		this.setState({locationstatus:value || ''})
    }

	factorychange(value) {
		this.setState({factory: value.target.value})
	}

	onrolechange(value) {
		this.setState({role:value || 'person'})
	}

	onrolenamechange(value) {
		this.setState({rolename:value.target.value})
	}

	datepick(value){
		this.setState({stime:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
		this.setState({etime:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
    }

    resetinput(){
    	const {resetinput,leftkeycode} = this.props;
		resetinput(leftkeycode)
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

    qury(page) {
    	const {
    		sxm = '',
    		section = '',
    		treety = '',
    		treetype = '',
    		gd = '',
    		xj = '',
    		gf = '',
    		dj = '',
    		tqhd = '',
    		tqzj = '',
    		supervisorcheck = '',
    		checkstatus = '',
    		locationstatus = '',
    		factory = '',
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
    		treety,
    		treetype,
    		gd,
    		xj,
    		gf,
    		dj,
    		tqhd,
    		tqzj,
    		supervisorcheck,
    		checkstatus,
    		locationstatus,
    		factory,
    		createtime_min:stime&&moment(stime).add(8, 'h').unix(),
    		createtime_max:etime&&moment(etime).add(8, 'h').unix(),
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
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			// let place = `${~~plan.land.replace('P','')}地块${~~plan.region}区块${~~attrs.smallclass}小班${~~attrs.thinclass}细班`;
	    			let place = '';
	    			tblData[i].place = place;
	    			let status = '';
					if(plan.supervisorcheck == -1)
						status = "待审批"
					else if(plan.supervisorcheck == 0) 
						status = "审批未通过"
					else {
						if(plan.checkstatus == 0)
							status = "抽检不通过"
						else if(plan.checkstatus == 1)
							status = "抽检通过"
						else if(plan.checkstatus == 2)
							status = "抽检不通过后修改"
						else {
							status = "审批通过"
						}
					}
					tblData[i].status = status;
					let locationstatus = !!plan.locationtime ? '已定位' : '未定位';
					tblData[i].locationstatus = locationstatus;
					let locationtime1 = !!plan.LocationTime ? moment(plan.LocationTime).format('YYYY-MM-DD') : '/';
					let locationtime2 = !!plan.LocationTime ? moment(plan.LocationTime).format('HH:mm:ss') : '/';
					tblData[i].locationtime1 = locationtime1;
					tblData[i].locationtime2 = locationtime2;
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
    		gd_min = '',
    		gd_max = '',
    		xj_min = '',
    		xj_max = '',
    		gf_min = '',
    		gf_max = '',
    		dj_min = '',
    		dj_max = '',
    		tqhd_min = '',
    		tqhd_max = '',
    		tqzj_min = '',
    		tqzj_max = '',
    		supervisorcheck = '',
    		checkstatus = '',
    		locationstatus = '',
    		factory = '',
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
    		treety,
    		treetype,
    		gd_min,
    		gd_max,
    		xj_min,
    		xj_max,
    		gf_min,
    		gf_max,
    		dj_min,
    		dj_max,
    		tqhd_min,
    		tqhd_max,
    		tqzj_min,
    		tqzj_max,
    		supervisorcheck,
    		checkstatus,
    		locationstatus,
    		factory,
    		createtime_min:stime&&moment(stime).add(8, 'h').unix(),
    		createtime_max:etime&&moment(etime).add(8, 'h').unix(),
    		page: 1,
    		per_page: exportsize
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getqueryTree({},postdata)
    	.then(result => {
    		let rst = result.results;
    		let total = result.pages;
    		this.setState({percent:parseFloat((100/total).toFixed(2)),num:1});
    		if(total !== undefined) {
    			let all = [Promise.resolve(rst)];
    			for(let i=2; i<=total; i++)
                {
                	postdata.page = i;
                    all.push(getqueryTree({},postdata)
                        .then(rst1 => {
                            let {num} = this.state;
                            num++;
                            this.setState({percent:parseFloat((num*100/total).toFixed(2)),num:num});
                            if(!rst1) {
                            	message.error(`数据获取失败,丢失100条数据`)
				    			return []
				    		} else {
                            	return rst1.results
                            }
                        }))
                }
    			Promise.all(all)
                .then(rst2 => {
                    if(!rst2) {
                    	this.setState({loading:false})
		    			return
		    		}
		    		let allData = rst2.reduce((a,b) => {
                        return a.concat(b)
                    })
		    		if(allData instanceof Array) {
		    			let data = allData.map((plan, i) => {
		    				const {attrs = {}}= plan;
		    				let place = `${~~plan.land.replace('P','')}地块${~~plan.region}区块${~~attrs.smallclass}小班${~~attrs.thinclass}细班`;
		    				let status = '';
							if(attrs.supervisorcheck == -1)
								status = "待审批"
							else if(attrs.supervisorcheck == 0) 
								status = "审批未通过"
							else {
								if(attrs.checkstatus == 0)
									status = "抽检不通过"
								else if(attrs.checkstatus == 1)
									status = "抽检通过"
								else if(attrs.checkstatus == 2)
									status = "抽检不通过后修改"
								else {
									status = "审批通过"
								}
							}
							let locationstatus = !!attrs.locationtime ? '已定位' : '未定位';
							let locationtime = !!attrs.locationtime ? moment(attrs.locationtime).format('YYYY-MM-DD HH:mm:ss') : '/';
							let jg = attrs.jg == 1 ? '是' : "否";
							let gp = attrs.gp == 1 ? '有' : "无";
							let gxwz = attrs.gxwz == 1 ? '是' : "否";
							let szjz = attrs.szjz == 1 ? '是' : "否";
							let bch = attrs.bch == 1 ? '有' : "无";
		    				return [
		    					++i,
		    					attrs.sxm || '/',
		    					plan.section || '/',
		    					place,
		    					plan.treetype || '/',
		    					status,
		    					locationstatus,
		    					locationtime,
		    					plan.factory,
		    					attrs.inputer || '/',
		    					attrs.supervisor || '/',
		    					attrs.checker || '/',
		    					attrs.gd || '/',
		    					attrs.xj || '/',
		    					attrs.gf || '/',
		    					attrs.dj || '/',
		    					attrs.tqhd || '/',
		    					attrs.tqzj || '/',
		    					jg,
		    					gp,
		    					gxwz,
		    					szjz,
		    					bch,
		    				]
						})
			    		const postdata = {
			    			keys: ["序号", "编码", "标段", "位置", "树种", "状态", "定位", "定位时间", "供苗商", "测量人", "监理人", "抽查人","树高（cm）", "胸径（cm）", "冠幅（cm）", "地径（cm）", "土球高度（cm）", "土球直径（cm）", "是否截干（cm）", "干皮有无损伤", "冠型完整，不偏冠", "生长健壮", "有无病虫害"],
			    			values: data
			    		}
			    		getexportTree({},postdata)
			    		.then(rst3 => {
			    			this.setState({loading:false})
			    			let url = `${FOREST_API}/${rst3.file_path}`
							this.createLink("excel_link", url);
			    		})
                    } else {
                    	this.setState({loading:false})
                    }
    		    })
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