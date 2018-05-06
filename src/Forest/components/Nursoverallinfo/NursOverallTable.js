import React, {Component} from 'react';
import {Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Icon,Card} from 'antd';
import moment from 'moment';
import { FOREST_API,PROJECT_UNITS} from '../../../_platform/api';
import '../index.less';
import {getUser} from '_platform/auth'
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
        	status: '',
			sxm: '',
    		percent: 0,
			keyword: '',
			seedlingMess:[],
            treeMess:[],
			flowMess:[],
			src:''
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
    
	render() {
		const {
			seedlingMess,
            treeMess,
			flowMess,
			sxm
		} = this.state;
		const suffix = sxm ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
		let header = '';
		let seedlingColumns = [
			{
				title:"顺序码",
				dataIndex: 'sxm',
			},{
				title:"打包车牌",
				dataIndex: 'car',
			},{
				title:"树种",
				dataIndex: 'TreeTypeName',
			},{
				title:"产地",
				dataIndex: 'TreePlace',
			},{
				title:"供应商",
				dataIndex: 'Factory',
			},{
				title:"苗圃名称",
				dataIndex: 'NurseryName',
			},
			{
				title:"起苗时间",
				dataIndex: 'LifterTime',
			},{
				title:"起苗地点",
				dataIndex: 'location',
			},{
				title: "高度(cm)",
				render: (text,record) => {
					if(record.height)
						return <a disabled={!record.heightImg} onClick={this.imgShow.bind(this,record.heightImg)}>{record.height}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title: "冠幅(cm)",
				render: (text,record) => {
					if(record.crown)
						return <a disabled={!record.crownImg} onClick={this.imgShow.bind(this,record.crownImg)}>{record.crown}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title: "土球直径(cm)",
				render: (text,record) => {
					if(record.diameter)
						return <a disabled={!record.diameterImg} onClick={this.imgShow.bind(this,record.diameterImg)}>{record.diameter}</a>
					else {
						return <span>/</span>
					}
				}
			},{
				title: "土球直径(cm)",
				render: (text,record) => {
					if(record.thickness)
						return <a disabled={!record.thicknessImg} onClick={this.imgShow.bind(this,record.thicknessImg)}>{record.thickness}</a>
					else {
						return <span>/</span>
					}
				}
			}
		];
		let treeColumns = [
			{
				title:"顺序码",
				dataIndex: 'sxm',
			},{
				title:"地块",
				dataIndex: 'landName',
			},{
				title:"标段",
				dataIndex: 'sectionName',
			},{
				title:"小班",
				dataIndex: 'SmallClass',
			},{
				title:"细班",
				dataIndex: 'ThinClass',
			},{
				title:"树种",
				dataIndex: 'TreeTypeName',
			},
			{
				title:"位置",
				dataIndex: 'Location',
			},{
				title: "胸径(cm)",
				render: (text,record) => {
					if(record.XJ)
						return <a disabled={!record.XJImg} onClick={this.imgShow.bind(this,record.XJImg)}>{record.XJ}</a>
					else {
						return <span>/</span>
					}
				}
			}
		];

		let flowColumns = [
			{
				title:"流程",
				render: (text,record) => {
					if(record.Node){
						if(record.Node === '种树'){
							return <span>施工提交</span> 
						}else if(record.Node === '监理'){
							if(record.Status === 1){
								return <span>监理通过</span> 
							}else{
								return <span>监理拒绝</span> 
							}
							
						}else if(record.Node === '业主'){
							if(record.Status === 2){
								return <span>业主抽查通过</span> 
							}else{
								return <span>业主抽查拒绝</span> 
							}
						}else if(record.Node === '补种'){
							return <span>施工补录扫码</span> 
						}else if (record.Node === '苗圃提交'){
							return <span>苗圃提交</span> 
						}
					}
				}
			},{
				title:"人员",
				render: (text,record) => {
					if(record.FromUserObj)
						return <span>{record.FromUserObj.Full_Name}</span>
					else {
						return <span>/</span>
					}
				}
			},{
				title:"意见",
				dataIndex: 'Info',
			},{
				title:"时间",
				dataIndex: 'CreateTime',
			},{
				title:"备注",
				dataIndex: 'Remark',
			}
		];
		return (
			<div>
				<Row>
					<Row >
						<Col  xl={3} lg={4} md={5} className='mrg10'>
							<span>顺序码：</span>
							<Input suffix={suffix} value={sxm} className='forestcalcw2 mxw100' onChange={this.sxmchange.bind(this)}/>
						</Col>
					</Row>
					<Row >
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.qury.bind(this)}>
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
				</Row>
				<Card title='苗木信息' style={{marginTop:10}}>
					<Table bordered
						columns={seedlingColumns}  
						loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
						locale={{emptyText:'暂无信息'}}
						dataSource={seedlingMess} 
					/>
				</Card>
				<Card title='树木信息' style={{marginTop:10}}>
					<Table bordered
						columns={treeColumns}  
						loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
						locale={{emptyText:'暂无信息'}}
						dataSource={treeMess} 
					/>
				</Card>
				<Card title='流程信息' style={{marginTop:10}}>
					<Table bordered
						columns={flowColumns} 
						loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
						locale={{emptyText:'暂无信息'}}
						dataSource={flowMess} 
					/>
				</Card>
				<Modal
					width={522}
					title='详细信息'
					style={{textAlign:'center',overflow:'auto'}}
					visible={this.state.imgvisible}
					// onOk={this.handleCancel.bind(this)}
					// onCancel={this.handleCancel.bind(this)}
					footer={null}
				>
					<img style ={{width:'490px'}} src={this.state.src} alt="图片"/>
					<Row style={{marginTop:10}}>
						<Button  onClick={this.handleCancel.bind(this) } style={{float:'right'}}type="primary">关闭</Button>
					</Row>
				</Modal>
			</div>
		);
	}

	emitEmpty = () => {
	    this.setState({sxm: ''});
  	}

	sxmchange(value) {
		this.setState({sxm:value.target.value})
	}

    resetinput(){
    	const {resetinput} = this.props;
		resetinput()
    }

    onImgClick(data) {
       
        let src = ''
        try{
            let srcs = data.split(',')
            if(srcs && srcs instanceof Array && srcs.length>0){
                let len = srcs.length
                src = srcs[len-1]
            }else{
                src = data
            }
        }catch(e){
            console.log('处理图片',e)
        }
		src = src.replace(/\/\//g,'/')
		src =  `${FOREST_API}/${src}`
		return src
        
	}

	handleCancel(){
    	this.setState({imgvisible:false})
	}

	imgShow(src){
		this.setState({
			imgvisible:true,
			src:src
		})
	}

    async qury() {
    	const {
    		sxm = '',
    	} = this.state;
    	
		const {
			actions: {
				getNurserysTree,
				getqueryTree,
				getTreeflows,
				getnurserys,
				getCarpackbysxm
			}
		} = this.props;
		let me = this
    	let postdata = {
    		sxm,
    	}
    
		this.setState({
			loading:true,
			percent:0
		})

		let queryTreeDatas = await getqueryTree({},postdata)
		let treeflowDatas = await getTreeflows({},postdata)
		let nurserysDatas = await getnurserys({},postdata)
		let carData = await getCarpackbysxm(postdata)

		let queryTreeData = {}
		let treeflowData = {}
		let nurserysData = {}

		if(queryTreeDatas && queryTreeDatas.content && queryTreeDatas.content instanceof Array && queryTreeDatas.content.length>0){
			queryTreeData =  queryTreeDatas.content[0]
		}
		if(treeflowDatas && treeflowDatas.content && treeflowDatas.content instanceof Array && treeflowDatas.content.length>0){
			treeflowData =  treeflowDatas.content
		}
		if(nurserysDatas && nurserysDatas.content && nurserysDatas.content instanceof Array && nurserysDatas.content.length>0){
			nurserysData =  nurserysDatas.content[0]
		}

		let seedlingMess = [{
			sxm:queryTreeData.ZZBM?queryTreeData.ZZBM:'',
			car:carData.LicensePlate?carData.LicensePlate:'',
			TreeTypeName:nurserysData.TreeTypeObj?nurserysData.TreeTypeObj.TreeTypeName:'',
			TreePlace:nurserysData.TreePlace?nurserysData.TreePlace:'',
			Factory:nurserysData.Factory?nurserysData.Factory:'',
			NurseryName:nurserysData.NurseryName?nurserysData.NurseryName:'',
			LifterTime:nurserysData.LifterTime?nurserysData.LifterTime:'',
			location:nurserysData.location?nurserysData.location:'',
			height:nurserysData.GD?nurserysData.GD:'',
			heightImg:nurserysData.GDFJ?me.onImgClick(nurserysData.GDFJ):'',
			crown:nurserysData.GF?nurserysData.GF:'',
			crownImg:nurserysData.GFFJ?me.onImgClick(nurserysData.GFFJ):'',
			diameter:nurserysData.TQZJ?nurserysData.TQZJ:'',
			diameterImg:nurserysData.TQZJFJ?me.onImgClick(nurserysData.TQZJFJ):'',
			thickness:nurserysData.TQHD?nurserysData.TQHD:'',
			thicknessImg:nurserysData.TQHDFJ?me.onImgClick(nurserysData.TQHDFJ):'',
			InputerObj:nurserysData.InputerObj?nurserysData.InputerObj:''
		}]

		 //项目code
		 let land = queryTreeData.Land?queryTreeData.Land:''
		 //项目名称
		 let landName = ''
		 //项目下的标段
		 let sections = []
		 //查到的标段code
		 let Section = queryTreeData.Section?queryTreeData.Section:''
		 //标段名称
		 let sectionName = ''
		 
		 PROJECT_UNITS.map((unit)=>{
			 if(land === unit.code){
				 sections = unit.units
				 landName = unit.value
			 }
		 })
		 console.log('sections',sections)
		 
		 sections.map((section)=>{
			 if(section.code === Section){
				 sectionName = section.value
			 }
		 })

		 let treeMess = [{
			sxm:queryTreeData.ZZBM?queryTreeData.ZZBM:'',
			landName:landName,
			sectionName:sectionName,
			SmallClass:queryTreeData.SmallClass?queryTreeData.SmallClass+'号小班':'',
			ThinClass:queryTreeData.ThinClass?queryTreeData.ThinClass + '号细班':'',
			TreeTypeName:nurserysData.TreeTypeObj?nurserysData.TreeTypeObj.TreeTypeName:'',
			Location:queryTreeData.LocationTime ? '已定位' : '未定位',
			XJ:queryTreeData.XJ?queryTreeData.XJ:'',
			XJImg:queryTreeData.XJFJ?me.onImgClick(queryTreeData.XJFJ):'',
		}]
		let flowMess = treeflowData || []
		flowMess.push({
			Node:'苗圃提交',
			FromUserObj:nurserysData.InputerObj?nurserysData.InputerObj:'',
			Info:nurserysData.Factory?nurserysData.Factory:''
		})

		console.log('seedlingMess',seedlingMess)
		console.log('treeMess',treeMess)
		console.log('flowMess',flowMess)
		this.setState({ 
			seedlingMess,
			treeMess,
			flowMess,
			loading:false,
			percent:100
		})
	}
}