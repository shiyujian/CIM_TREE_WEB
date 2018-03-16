import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Cascader} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import {getUser} from '_platform/auth'
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class CarPackageTable extends Component {
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
					width={1280}
					title='详情'
					style={{textAlign:'center'}}
					visible={this.state.imgvisible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<p>123</p>
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
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"车牌号",
			dataIndex: 'LicensePlate',
		},{
			title:"苗木类型",
            dataIndex: 'isShrub',
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
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>车牌号：</span>
							<Input suffix={suffix1} value={sxm}  className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>标段：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col xl={10} lg={11} md={12} className='mrg10'>
                            <span>状态：</span>
                            <Select allowClear className='forestcalcw2 mxw150' defaultValue='全部' value={status} onChange={this.onstatuschange.bind(this)} style={{width:150}}>
								{statusoption}
							</Select>
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
                        <Col xl={4} lg={5} md={6} className='mrg10'>
                            <span>苗木类型：</span>
                            <Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={mmtype} onChange={this.onmmtypechange.bind(this)}>
                                {mmtypeoption}
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
    onViewClick = () => {
        this.setState({imgvisible:true})
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
    		treetype:mmtype,
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
		if(keycode!== ''&& keycode.indexOf('P010') !== -1){   //有苗木类型选项
			postdata.foresttype = mmtype
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