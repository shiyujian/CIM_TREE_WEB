import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import {getUser} from '_platform/auth'
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const { TextArea } = Input;

export default class SeedlingsChange extends Component {
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
			percent:0,        
			remark:'',
			changevisible:false,
			changeRecord:'',
			remarkvisible:false,
			remarkRecord:'',
			remarkInfo:''
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
    
	render() {
		const {
			tblData,
			remarkRecord,
			changeRecord,
			remarkInfo
		} = this.state;
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
				<Modal
					width={522}
					title='修改备注信息'
					style={{textAlign:'center'}}
					visible={this.state.remarkvisible}
					onOk={this.remarkOK.bind(this)}
					onCancel={this.remarkCancel.bind(this)}
				>
					<div>
						<div style={{textAlign:'left'}}>备注：</div>
						<div>
							<TextArea  rows={4} value={remarkInfo} id='remarkID' onChange={this.remarkInfochange.bind(this)}/>
						</div>
					</div>
				</Modal>
				<Modal
					width={522}
					title='修改详细信息'
					style={{textAlign:'center'}}
					visible={this.state.changevisible}
					onOk={this.changeOK.bind(this)}
					onCancel={this.changeCancel.bind(this)}
				>
					<div>

					</div>
				</Modal>
			</div>
		);
	}
	treeTable(details) {
		const {
			sxm, 
			remark
		} = this.state;
		const {
			users
		} = this.props;
	
		let columns = [];
		let header = '';
		columns = [
			{
				title:"序号",
				dataIndex: 'order',
			},{
				title:"顺序码",
				dataIndex: 'ZZBM',
			},{
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
				title:"状态",
				dataIndex: 'statusname',
			},{
				title:"定位",
				dataIndex: 'islocation',
			},{
				title:"测量人",
				dataIndex: 'Inputer',
				render: (text,record) => {
					return <span>{users&&users[text] ? users[text].Full_Name+"("+users[text].User_Name+")": ''}</span>
				}
			},{
				title:"测量时间",
				render: (text,record) => {
					const {createtime1 = '',createtime2 = '' } = record;
					return <div><div>{createtime1}</div><div>{createtime2}</div></div>
				}
			},{
				title:"定位时间",
				render: (text,record) => {
					const {createtime3 = '',createtime4 = '' } = record;
					return <div><div>{createtime3}</div><div>{createtime4}</div></div>
				}
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
						return <a disabled={!record.TQHDFJ} onClick={this.onImgClick.bind(this,record.TQHDFJ)}>{record.TQZJ}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title:"操作",
				render: (text,record) => {
					return <div>
								<a onClick={this.remark.bind(this,record)}>备注</a>
								{/* <span className="ant-divider" />
								<a onClick={this.change.bind(this,record)}>修改</a> */}
							</div>
				}
			}
		];
		header = <div >
					<Row>
						<Col  xl={3} lg={4} md={5} className='mrg10'>
							<span>顺序码：</span>
							<Input   className='forestcalcw2 mxw100' id='sxmID'/>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>备注关键字：</span>
							<Input   className='forestcalcw2 mxw100'  id='remarkValueID'/>
						</Col>
						<Col xl={10} lg={12} md={14} className='mrg10'>
							<span>时间选择：</span>
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
						<Col span={20} className='quryrstcnt mrg10'>
							
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
						 locale={{emptyText:'当天无业主抽查信息'}}
						 dataSource={details}
						 onChange={this.handleTableChange.bind(this)}
						 pagination={this.state.pagination}
						/>
					</Row>
				</div>
	}

	remarkInfochange(value){
		this.setState({remarkInfo:value.target.value})
	}

	remark(record){
		console.log('record',record)
		this.setState({
			remarkRecord:record,
			remarkvisible:true,
			remarkInfo:record.Remark?record.Remark:''
		})
	}

	async remarkOK(){
		const{
			actions:{
				getSeedlingInfo
			}
		}=this.props
		const{
			remarkRecord,
			remarkInfo
		}=this.state
	
		let postdata = {
			remark:remarkInfo,
			sxm:remarkRecord.ZZBM
		}
		let rst = await getSeedlingInfo(postdata)
		this.setState({
			remarkvisible:false
		},()=>{
			document.querySelector('#remarkID').value = ''
			this.handleTableChange({current:1})
		})
	}

	remarkCancel(){
		this.setState({
			remarkvisible:false
		})
	}

	change(record){
		this.setState({
			changevisible:true,
			changeRecord:record
		})
	}

	changeOK(){
		this.setState({
			changevisible:false
		})
	}

	changeCancel(){
		this.setState({
			changevisible:false
		})
	}

	remarkchange(value){
		this.setState({remark:value.target.value})
	}

	onImgClick(src) {
		src = src.replace(/\/\//g,'/')
		src =  `${FOREST_API}/${src}`
		this.setState({src},() => {
			this.setState({imgvisible:true,})
		})
	}


	sxmchange(value) {
		this.setState({sxm:value.target.value})
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

	handleCancel(){
    	this.setState({imgvisible:false})
    }
    resetinput(){
    	const {resetinput,leftkeycode} = this.props;
		resetinput(leftkeycode)
	}
	
	getThinClassName(no,section){
		const {littleBanAll} = this.props;
		let nob = no.substring(0,15);
		let sectionn = section.substring(8,10);
		let result = '/'
		debugger
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
    async qury(page) {
    	const {
    		
    		stime = '',
    		etime = '',
			size,
		} = this.state;
		const {
			actions: {
				getqueryTree,
				getnurserys
			},
			keycode = ''
		} = this.props;

		let sxm = document.querySelector('#sxmID').value 
		let remark = document.querySelector('#remarkValueID').value 
		let user = getUser()
		let section = ''
		console.log('this.sections',this.sections)
		if(user.username !='admin' && this.sections.length > 0){  //不是admin，要做查询判断了
			section = this.sections[0]
		}else if(user.username !='admin' && this.sections.length === 0){
			message.info('没有权限进行查询')
		}
    	
    	let postdata = {
    		no:keycode,
    		sxm,
    		section,
    		stime:stime&&moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    		etime:etime&&moment(etime).format('YYYY-MM-DD HH:mm:ss'),
    		page,
			size,
			remark
    	}

    	this.setState({loading:true,percent:0})
    	getqueryTree({},postdata)
    	.then( async rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst || !rst.content)
				return
				
    		let tblData = rst.content;
    		if(tblData instanceof Array) {
				let sxmArr = []

	    		tblData.map((plan, i) => {
					sxmArr.push(plan.ZZBM)
					
	    			// const {attrs = {}} = plan;
					tblData[i].order = ((page - 1) * size) + i + 1;
					let place = ''
					if(plan.Section.indexOf('P010') !== -1){
						place = this.getThinClassName(plan.No,plan.Section);
					}else{
						place = `${plan.SmallClass}号小班${plan.ThinClass}号细班`
					}
	    			tblData[i].place = place;
	    			
	    			let statusname = '';
					if(plan.SupervisorCheck == -1)
						statusname = "未抽查"
					else if(plan.SupervisorCheck == 0) 
						statusname = "抽查未通过"
					else if(plan.SupervisorCheck === 1){
						statusname = "抽查通过"
					}
					tblData[i].statusname = statusname;
					let islocation = plan.LocationTime ? '已定位' : '未定位';
					tblData[i].islocation = islocation;
					let createtime1 = plan.CreateTime ? moment(plan.CreateTime).format('YYYY-MM-DD') : '/';
					let createtime2 = plan.CreateTime ? moment(plan.CreateTime).format('HH:mm:ss') : '/';
					let createtime3 = plan.LocationTime ? moment(plan.LocationTime).format('YYYY-MM-DD') : '/';
					let createtime4 = plan.LocationTime ? moment(plan.LocationTime).format('HH:mm:ss') : '/';
					tblData[i].createtime1 = createtime1;
					tblData[i].createtime2 = createtime2;
					tblData[i].createtime3 = createtime3;
					tblData[i].createtime4 = createtime4;
				})
				
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination });	
	    	}
    	})
    }
}