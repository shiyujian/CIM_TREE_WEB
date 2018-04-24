import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Cascader} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import {getUser} from '_platform/auth'
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class CarPackageTable extends Component {
	currentCarID = '';
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	tblData1: [],
        	pagination: {},
        	pagination1: {},
        	loading: false,
        	loading1: false,
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
    		percent1: 0,
    		supervisorcheck: '',
    		checkstatus: '',
    		status: '',
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
		const {tblData,tblData1} = this.state;
		return (
			<div>
				{this.treeTable(tblData)}
				<Modal
					width={1080}
					title='详情'
					visible={this.state.imgvisible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<div>{this.treeTable1(tblData1)}</div>
				</Modal>
			</div>
		);
	}
	treeTable1(details) {
		const {
			users
		} = this.props;
		let columns = [{
				title:"序号",
				dataIndex: 'order',
			},{
				title:"顺序码",
				dataIndex: 'ZZBM',
			},{
				title:"树种",
				dataIndex: 'TreeTypeObj.TreeTypeName',
			},{
				title:"苗龄",
				dataIndex: 'Age',
				render:(text,record) => {
					if(record.BD.indexOf('P010') !== -1){
						return <p>{text}</p>
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
					return <span>{users&&users[text] ? users[text].Full_Name : ''}</span>
				}
			},{
				title:"创建时间",
				render: (text,record) => {
					const {liftertime1 = '',liftertime2 = '' } = record;
					return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
				}
			},{
				title:<div><div>高度</div><div>(cm)</div></div>,
				render: (text,record) => {
					if(record.GD != 0)
					return <span>{record.GD}</span>
					else {
						return <span>/</span>
					}
				}
			},{
				title:<div><div>冠幅</div><div>(cm)</div></div>,
				render: (text,record) => {
					if(record.GF != 0)
					return <span>{record.GF}</span>
					else {
						return <span>/</span>
					}
				}
			},{
				title:<div><div>胸径</div><div>(cm)</div></div>,
				render: (text,record) => {
					if(record.XJ != 0)
						return <span>{record.XJ}</span>
					else {
						return <span>/</span>
					}
				}
			},{
				title:<div><div>地径</div><div>(cm)</div></div>,
				render: (text,record) => {
					if(record.DJ != 0)
					return <span>{record.DJ}</span>
					else {
						return <span>/</span>
					}
				}
			},{
				title:<div><div>土球厚度</div><div>(cm)</div></div>,
				dataIndex: 'tqhd',
				render: (text,record) => {
					if(record.TQHD != 0)
					return <span>{record.TQHD}</span>
					else {
						return <span>/</span>
					}
				}
			},{
				title:<div><div>土球直径</div><div>(cm)</div></div>,
				dataIndex: 'tqzj',
				render: (text,record) => {
					if(record.TQZJ != 0)
					return <span>{record.TQZJ}</span>
					else {
						return <span>/</span>
					}
				}
		}];
		return <div>
			<Table bordered
				className='foresttable'
				columns={columns}  
				rowKey='order'
				loading={{tip:<Progress style={{width:200}} percent={this.state.percent1} status="active" strokeWidth={5}/>,spinning:this.state.loading1}}
				locale={{emptyText:'当天无苗圃测量信息'}}
				dataSource={details} 
				onChange={this.handleTableChange1.bind(this)}
				pagination={this.state.pagination1}
			/>
		</div>

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
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"车牌号",
			dataIndex: 'LicensePlate',
		},{
			title:"标段",
			dataIndex: 'Section',
			render:(text,record) => {
				return <p>{this.getBiao(text)}</p>
			}
		},{
			title:"苗木类型",
            dataIndex: 'IsShrub',
            render:(text,record) => {
                if(text === 0){
                    return <p>乔灌</p>
                }else{
                    return <p>地被</p>
                }
            }
		},{
			title:"苗木规格",
			dataIndex: 'Standard',
			render:(text) => {
				if(text === ''){
					return <p> / </p>
				}else{
					return <p>{text}</p>
				}
			}
		},{
			title:"创建时间",
			render: (text,record) => {
				const {liftertime1 = '',liftertime2 = '' } = record;
				return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
			}
		},{
			title:"总数",
			dataIndex: 'NurseryNum',
		},{
			title:"进场抽检退苗量",
			dataIndex: 'UnQualifiedNum',
		},{
			title:"状态",
            dataIndex: 'Status',
            render:(text,record) => {
                if(text === -1){
                    return <p>打包</p>
                }else if(text === 0){
                    return <p>施工提交</p>
                }else if(text === 1){
                    return <p>监理合格</p>
                }else if(text === 2){
                    return <p>监理退苗</p>
                }else if(text === 3){
                    return <p>监理合格施工同意</p>
                }else if(text === 4){
                    return <p>监理合格施工不同意</p>
                }else if(text === 5){
                    return <p>监理退苗施工同意</p>
                }else if(text === 6){
                    return <p>监理退苗施工不同意</p>
                }else if(text === 7){
                    return <p>业主合格</p>
                }else if(text === 8){
                    return <p>业主退苗</p>
                }else {
                    return <p> / </p>
                }
            }
		},{
			title:'操作',
			render: (text,record) => {
				return <a href='javascript:;' onClick={this.onViewClick.bind(this,record)}>详情</a>
			}
		}];
		header = <div >
					<Row >
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>车牌号：</span>
							<Input suffix={suffix1} value={sxm}  className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>标段：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
                            <span>苗木类型：</span>
                            <Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={mmtype} onChange={this.onmmtypechange.bind(this)}>
                                {mmtypeoption}
                            </Select>
                        </Col>
						<Col xl={8} lg={9} md={10} className='mrg10'>
							<span>创建时间：</span>
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
                        <Col xl={4} lg={5} md={6} className='mrg10'>
                            <span>状态：</span>
                            <Select allowClear className='forestcalcw2 mxw150' defaultValue='全部' value={status} onChange={this.onstatuschange.bind(this)} style={{width:150}}>
								{statusoption}
							</Select>
						</Col>
					</Row>
					<Row>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.handleTableChange.bind(this,{current:1})}>
								查询
							</Button>
						</Col>
						<Col span={18} className='quryrstcnt mrg10'>
							<span >此次查询共有车辆：{this.state.pagination.total}辆</span>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
							</Button>
						</Col>
						{/*<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.exportexcel.bind(this)}>
								导出
							</Button>
	</Col>*/}
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
    onViewClick = (record) => {
		this.currentCarID = record.ID;
		this.query(1)
        this.setState({imgvisible:true})
	}

	query(page){
		const {actions:{getNurserysByPack}} = this.props;
		const {size} = this.state;
		let postData = {
			packid:this.currentCarID,
			page,
			size
		}
		this.setState({loading1:true,percent1:0})
		getNurserysByPack({},postData).then(rst => {
			this.setState({loading1:false,percent1:100})
    		if(!rst)
    			return
    		let tblData1 = rst.content;
    		if(tblData1 instanceof Array) {
	    		tblData1.forEach((plan, i) => {
	    			tblData1[i].order = ((page - 1) * size) + i + 1;
	    			tblData1[i].liftertime1 = !!plan.CreateTime ? moment(plan.CreateTime).format('YYYY-MM-DD') : '/';
					tblData1[i].liftertime2 = !!plan.CreateTime ? moment(plan.CreateTime).format('HH:mm:ss') : '/';
	    		})
		    	const pagination1 = { ...this.state.pagination1 };
				pagination1.total = rst.pageinfo.total;
				pagination1.pageSize = size;
				this.setState({ tblData1,pagination1 });	
	    	}
		})
	}

	emitEmpty1 = () => {
	    this.setState({sxm: ''});
  	}

	sxmchange(value) {
		this.setState({sxm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		sectionselect(value || '')
		this.setState({section:value || '', bigType:'', treetype: '', treetypename: ''})
	}

	onmmtypechange(value){
		this.setState({mmtype:value})
	}

    onstatuschange(value) {    	
		this.setState({status: value})
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
	handleTableChange1(pagination){
        const pager = { ...this.state.pagination1};
        pager.current = pagination.current;
    	this.setState({
        	pagination1: pager,
        });
        this.query(pagination.current);
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
    		treetype = '',
    		stime = '',
    		etime = '',
    		size,
			status = '',
			mmtype = ''
    	} = this.state;
    	const {actions: {getcarpackage},keycode = ''} = this.props;
    	let postdata = {
    		licenseplate:sxm,
    		section:section === '' ? keycode : section,
    		isshrub:mmtype,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
    		size,
    		status,
		}
		if(this.sections.length !== 0){  //不是admin，要做查询判断了
			if(section === ''){
				message.info('请选择标段信息');
				return;
			}
		}
    	
    	this.setState({loading:true,percent:0})
    	getcarpackage({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			let statusname = plan.statusname;
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
    		treetype = '',
    		stime = '',
    		etime = '',
    		size,
			status = '',
			mmtype = ''
    	} = this.state;
    	const {actions: {getcarpackage},keycode = ''} = this.props;
    	let postdata = {
    		licenseplate:sxm,
    		section:section === '' ? keycode : section,
    		isshrub:mmtype,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
    		size,
    		status,
		}
		if(this.sections.length !== 0){  //不是admin，要做查询判断了
			if(section === ''){
				message.info('请选择标段信息');
				return;
			}
		}
    	
    	this.setState({loading:true,percent:0})
    	getexportcarpackage({},postdata)
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
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}