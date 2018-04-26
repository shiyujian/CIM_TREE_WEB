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
			remarkRecord:''
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
			changeRecord
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
							<TextArea  rows={4} defaultValue={remarkRecord.Remark?remarkRecord.Remark:''} id='remarkID'/>
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
				title:"树种",
				dataIndex: 'TreeTypeObj.TreeTypeName',
			},{
				title:"苗龄",
				dataIndex: 'Age',
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
					const {InputerObj} = record
					return <div>{InputerObj.Full_Name?InputerObj.Full_Name:InputerObj.User_Name}</div>
				}
			},{
				title:"起苗时间",
				dataIndex: 'time',
				render: (text,record) => {
					const {liftertime1 = '',liftertime2 = '' } = record;
					return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
				}
			},{
				title:"状态",
				dataIndex: 'statusname',
			},,{
				title:"高度(cm)",
				dataIndex: 'height',
				render: (text,record) => {
					if(record.GD != 0)
						return <a disabled={!record.GDFJ} onClick={this.onImgClick.bind(this,record.GDFJ)}>{record.GD}</a>
					else {
						return <span>/</span>
					}
				}
			},
			{
				title:"冠幅(cm)",
				dataIndex: 'guanfu',
				render: (text,record) => {
					if(record.GF != 0)
						return <a disabled={!record.GFFJ} onClick={this.onImgClick.bind(this,record.GFFJ)}>{record.GF}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title:"胸径(cm)",
				dataIndex: 'xiongjing',
				render: (text,record) => {
					if(record.XJ != 0)
						return <a disabled={!record.XJFJ} onClick={this.onImgClick.bind(this,record.XJFJ)}>{record.XJ}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title:"地径(cm)",
				dataIndex: 'dijing',
				render: (text,record) => {
					if(record.DJ != 0)
						return <a disabled={!record.DJFJ} onClick={this.onImgClick.bind(this,record.DJFJ)}>{record.DJ}</a>
					else {
						return <span>/</span>
					}
				}
				
			},{
				title:"土球厚度(cm)",
				dataIndex: 'houdu',
				render: (text,record) => {
					if(record.TQHD != 0)
						return <a disabled={!record.TQHDFJ} onClick={this.onImgClick.bind(this,record.TQHDFJ)}>{record.TQHD}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title:"土球直径(cm)",
				dataIndex: 'zhijing',
				render: (text,record) => {
					if(record.TQZJ != 0)
						return <a disabled={!record.TQZJFJ} onClick={this.onImgClick.bind(this,record.TQZJFJ)}>{record.TQZJ}</a>
					else {
						return <span>/</span>
					}
				}
			},
			{
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
							<Input   value={sxm} className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>备注关键字：</span>
							<Input  value={remark} className='forestcalcw2 mxw100' onChange={this.remarkchange.bind(this)}/>
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

	remark(record){
		this.setState({
			remarkvisible:true,
			remarkRecord:record
		})
	}

	async remarkOK(){
		const{
			actions:{
				getSeedlingInfo
			}
		}=this.props
		const{
			remarkRecord
		}=this.state
		let remark = document.querySelector('#remarkID').value;
	

		let postdata = {
			remark:remark,
			sxm:remarkRecord.ZZBM
		}
		let rst = getSeedlingInfo(postdata)
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
    async qury(page) {
    	const {
    		sxm = '',
    		stime = '',
    		etime = '',
			size,
			remark = ''
		} = this.state;
		const {
			actions: {
				getqueryTree,
				getnurserys
			},
			keycode = ''
		} = this.props;

		let user = getUser()
		let section = ''
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

	    		tblData.forEach((plan, i) => {
					sxmArr.push(plan.ZZBM)
					
	    			// const {attrs = {}} = plan;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			
	    			let statusname = '';
					if(plan.SupervisorCheck == -1)
						statusname = "未抽查"
					else if(plan.SupervisorCheck == 0) 
						statusname = "抽查未通过"
					else if(plan.SupervisorCheck === 1){
						statusname = "抽查通过"
					}
					tblData[i].statusname = statusname;
					let locationstatus = !!plan.LocationTime ? '已定位' : '未定位';
					tblData[i].locationstatus = locationstatus;
					let checktime1 = !!plan.CheckTime ? moment(plan.CheckTime).format('YYYY-MM-DD') : '/';
					let checktime2 = !!plan.CheckTime ? moment(plan.CheckTime).format('HH:mm:ss') : '/';
					tblData[i].checktime1 = checktime1;
					tblData[i].checktime2 = checktime2;
				})
				let postdata = [] 
				sxmArr.map((sxm)=>{
					postdata.push(getnurserys({},{sxm:sxm}))
				})
				let datas = await Promise.all(postdata)
				// debugger
				if(datas && datas.length>0){
					datas.map((data,index)=>{
						if(data.content && data.content.length>0){
							let treeinfo = data.content[0]
							tblData[index].Age = treeinfo.Age?treeinfo.Age:''
							tblData[index].TreePlace = treeinfo.TreePlace?treeinfo.TreePlace:''
							tblData[index].Factory = treeinfo.Factory?treeinfo.Factory:''
							tblData[index].NurseryName = treeinfo.NurseryName?treeinfo.NurseryName:''
							tblData[index].Inputer = treeinfo.Inputer?treeinfo.Inputer:''
							tblData[index].InputerObj = treeinfo.InputerObj?treeinfo.InputerObj:''
							tblData[index].liftertime1 = treeinfo.CreateTime?moment(treeinfo.CreateTime).format('YYYY-MM-DD'):'/'
							tblData[index].liftertime2 = treeinfo.CreateTime?moment(treeinfo.CreateTime).format('HH:mm:ss') : '/';
							tblData[index].GD = treeinfo.GD?treeinfo.GD:''
							tblData[index].GDFJ = treeinfo.GDFJ?treeinfo.GDFJ:''
							tblData[index].GF = treeinfo.GF?treeinfo.GF:''
							tblData[index].GFFJ = treeinfo.GFFJ?treeinfo.GFFJ:''
							tblData[index].XJFJ = treeinfo.XJFJ?treeinfo.XJFJ:''
							tblData[index].DJ = treeinfo.DJ?treeinfo.DJ:''
							tblData[index].DJFJ = treeinfo.DJFJ?treeinfo.DJFJ:''
							tblData[index].TQHD = treeinfo.TQHD?treeinfo.TQHD:''
							tblData[index].TQHDFJ = treeinfo.TQHDFJ?treeinfo.TQHDFJ:''
							tblData[index].TQZJ = treeinfo.TQZJ?treeinfo.TQZJ:''
							tblData[index].TQZJFJ = treeinfo.TQZJFJ?treeinfo.TQZJFJ:''
						}
						
					})
				}
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.pageinfo.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination });	
	    	}
    	})
    }
}