import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/item';
import {actions as actions2} from '../store/cells';
import {actions as platformActions} from '_platform/store/global';
import {message,Select,Table,Input,Button,Upload,Modal,Spin,Radio,Carousel, Row, Col, Form} from 'antd';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import DocTree from '../components/DocTree';
import Approval from '_platform/components/singleton/Approval';
import {Filter, Blueprint} from '../components/Item';
import QualityTree from '../components/QualityTree'
import './common.less';
import WorkflowHistory from '../components/WorkflowHistory.js';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SOURCE_API,STATIC_DOWNLOAD_API,} from '_platform/api';
import '../../Datum/components/Datum/index.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
@connect(
	state => {
		const {item = {}} = state.quality || {};
		return item;
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
		cellActions: bindActionCreators({...actions2}, dispatch),
	}),
)
export default class Query extends Component {

	static propTypes = {};
	constructor(props){
		super(props);
		this.columns_danwei = [
			{
				title: `单位工程名称`,
				width:'14%',
				dataIndex: 'name',
			}, {
				title: `分部验收数量`,
				dataIndex: 'total',
				width:'14%',				
			},	{
				title: '当前状态',
				dataIndex: 'check_status',
				width:'14%',				
				render: text => text === 2 ? '已验收' : '待验收'
			}, {
				title: '合格率',
				dataIndex: 'qualified_rate',
				width:'14%',
				render: text => text + '%'
			}, {
				title: '提交时间',
				width:'14%',
				dataIndex: 'tianbaoTime',
			},	{
				title: '审核时间',
				width:'14%',
				dataIndex: 'check_time',
			},{
                title: '操作',
                render:(text,record,index)=>{
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.show.bind(this,record)} >
                        详情
                        </Button>
                    );
                }
            }
		];
 		this.columns_fenbu = [
			{
				title: `分部工程名称`,
				dataIndex: 'name',
				width:'14%',
			}, {
				title: `分项验收数量`,
				dataIndex: 'total',
				width:'14%',
			},	{
				title: '当前状态',
				dataIndex: 'check_status',
				width:'14%',
				render: text => text === 2 ? '已验收' : '待验收'
			}, {
				title: '合格率',
				dataIndex: 'qualified_rate',
				width:'14%',
				render: text => text + '%'
			}, {
				title: '提交时间',
				dataIndex: 'tianbaoTime',
				width:'14%',
			},	{
				title: '审核时间',
				dataIndex: 'check_time',
				width:'14%',
			},{
                title: '操作',
                render:(text,record,index)=>{
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.show.bind(this,record)} >
                        详情
                        </Button>
                    );
                }
            }
		];
		this.columns_fenxiang = [
			{
				title: `分项工程名称`,
				dataIndex: 'name',
				width:'14%',
			}, {
				title: `检验批批数`,
				dataIndex: 'total',
				width:'14%',
			},	{
				title: '当前状态',
				dataIndex: 'check_status',
				width:'14%',
				render: text => text === 2 ? '已验收' : '待验收'
			}, {
				title: '合格率',
				dataIndex: 'qualified_rate',
				width:'14%',
				render: text => text + '%'
			}, {
				title: '提交时间',
				dataIndex: 'tianbaoTime',
				width:'14%',
			},	{
				title: '审核时间',
				dataIndex: 'check_time',
				width:'14%',
			},{
                title: '操作',
                render:(text,record,index)=>{
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.show.bind(this,record)} >
                        详情
                        </Button>
                    );
                }
            }
		];
		this.columns_jianyanpi = [
			{
				title: `检验批内容`,
				dataIndex: 'name',
				width:'14%',
			}, {
				title: `工程部位`,
				dataIndex: 'remark',
				width:'14%',
				render:i => 1
			},	{
				title: '当前状态',
				dataIndex: 'check_status',
				width:'14%',
				render: text => text === 2 ? '已验收' : '待验收'
			}, {
				title: '合格率',
				dataIndex: 'qualified_rate',
				width:'14%',
				render: text => text + '%'
			}, {
				title: '提交时间',
				dataIndex: 'tianbaoTime',
				width:'14%',
			},	{
				title: '审核时间',
				dataIndex: 'check_time',
				width:'14%',
			},{
                title: '操作',
                render:(text,record,index)=>{
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.show.bind(this,record)} >
                        详情
                        </Button>
                    );
                }
            }
		];
		this.columns_all = {
			danwei:this.columns_danwei,
			zidanwei:this.columns_danwei,
			fenbu:this.columns_fenbu,
			zifenbu:this.columns_fenbu,
			fenxiang:this.columns_fenxiang,
			jianyanpi:this.columns_jianyanpi,
		}
		this.state={
			fenbus:[],
			zifenbus:[],
			fenxiangs:[],
			jianyanpis:[],
			//targetFenxiang:null,
			loading:false,
			fileUpLoadAddress:UPLOADFILE_API,
			checkObj:'jianyanpi',//验收对象
			checkType:'checked',//是否验收
			checked:[],
			unchecked:[],
			detailModalVisible:false,
			selectedRow:null,
			wk:null,
			//当前选择的树节点、分部、子分部和分项de pk
			treeNode:false,
			selectedFenbu:false,
			selectedZifenbu:false,
			selectedFenxiang:false
		};
	}
	componentDidMount(){
		const {getUnitTree, getUnitTreeByPk} = this.props.cellActions
        getUnitTree().then(res => {
            try {
                const unitPk = res.children[0].children[0].pk
                this.setState({loading:true,treeNode:unitPk})
                getUnitTreeByPk({pk: unitPk}).then(res => {
                	//debugger
                    this.getQuertData(res,objTypeHums[this.state.checkObj]).then((tableData) => {
                    	this.setCheck(tableData)
                    })
                })
            } catch (e) {
                console.log('not fount C_WP_UNT!')
            }
        })
	}
    getOptions(datas){
		let arr = [];
		datas.forEach(ele=>{
			arr.push(<Option value = {ele.pk}>{ele.name}</Option>);
		});
		return arr;
	}
	selectFenbu(fenbu){
		// console.log(fenbu);
		this.setState({loading:true});
		let fenxiangs = [];
		let zifenbus = [];
		let {getUnitTreeByPk} = this.props.cellActions;
		let {checkObj} = this.state;
		getUnitTreeByPk({pk:fenbu}).then(rst=>{
			this.getQuertData(rst,objTypeHums[checkObj]).then((tableData) => {
				this.setCheck(tableData);
			});
			if(rst.children.length>0){
				if(rst.children[0].obj_type ==='C_WP_PTR_S'){
					zifenbus = rst.children;
				}else{
					fenxiangs = rst.children;
				}
			}
			this.setState({fenxiangs:fenxiangs,zifenbus:zifenbus,selectedFenbu:fenbu,selectedZifenbu:false,selectedFenxiang:false});
		});
	}
	selectZifenbu(zifenbu){
		this.setState({loading:true});
		let {getUnitTreeByPk} = this.props.cellActions;
		let fenxiangs = [];
		let {checkObj} = this.state;
		getUnitTreeByPk({pk:zifenbu}).then(rst=>{
			/*if(checkObj === 'zifenbu'){
				this.setCheck([rst]);
			}else if(checkObj === 'fenxiang'){
				if(rst.children.length > 0){
					this.setCheck(rst.children);
				}
			}*/
			this.getQuertData(rst,objTypeHums[checkObj]).then((tableData) => {
				this.setCheck(tableData);
			});
			console.log(rst);
			if(rst.children.length>0){
				this.setState({fenxiangs:rst.children,selectedZifenbu:zifenbu,selectedFenxiang:false});
			}
		});
	}
	selectFenxiang(fenxiang){
		this.setState({loading:true});
		let {getUnitTreeByPk} = this.props.cellActions;
		let {checkObj} = this.state;
		getUnitTreeByPk({pk:fenxiang}).then(rst=>{
			if(checkObj === 'fenxiang'){
				if(rst.obj_type_hum === '分项工程'){
					this.setCheck([rst]);
				}
			}else if(checkObj === 'jianyanpi'){
				if(rst.children.length > 0){
					this.setCheck(rst.children);
				}
			}
			this.setState({selectedFenxiang:fenxiang,loading:false});
		})
	}
	treeNodeClk(code){
		//console.log(code);
		let [pk,type,] = code[0].split('--');
		console.log(pk,type);
		let {getUnitTreeByPk1,getUnitTreeByPk} = this.props.cellActions;
		let {checkObj} = this.state;
		this.setState({loading:true});
		if(type === 'C_PJ'){
			getUnitTreeByPk1({pk:pk}).then(rst => {
				this.getQuertData(rst,objTypeHums[checkObj]).then((tableData) => {
					this.setCheck(tableData);
				});
				let fenbus = [];
				rst.children.forEach(re => {
					re.children.map(item => {
						if(item.obj_type === "C_WP_UNT_S"){
							fenbus = fenbus.concat(item.children)
						}else{
							if(item.obj_type === "C_WP_PTR"){
								fenbus.push(item);
							}
						}
					})
				})
				pk = rst.children.length ? rst.children[0].pk : '';
				this.setState({fenbus:fenbus,fenxiangs:[],zifenbus:[],treeNode:pk,selectedZifenbu:false,selectedFenbu:false,selectedFenxiang:false});
			})
		}else{
			getUnitTreeByPk({pk:pk}).then(rst=>{
				let fenbus = [];
				this.getQuertData(rst,objTypeHums[checkObj]).then((tableData) => {
					this.setCheck(tableData);
				});
				rst.children.map(item => {
					if(item.obj_type === "C_WP_UNT_S"){
						fenbus = fenbus.concat(item.children)
					}else{
						if(item.obj_type === "C_WP_PTR"){
							fenbus.push(item);
						}
					}
				})
				this.setState({fenbus:fenbus,fenxiangs:[],zifenbus:[],treeNode:pk,selectedZifenbu:false,selectedFenbu:false,selectedFenxiang:false});
			});
		}
		
	}
	    //将得到的数据分类，已检验 未检验,flag为true时，代表要
    setCheck(data){
        let checked = [],unchecked =[];
        for(let i=0;i<data.length;i++){           
            if(data[i].extra_params.check_status  && data[i].extra_params.check_status === 2){
                checked.push(data[i]);
            }else if(data[i].extra_params.check_status  && data[i].extra_params.check_status === 1){
                unchecked.push(data[i]);
            }
        }
        unchecked = this.handleData(unchecked);
        checked = this.handleData(checked);

        this.setState({loading:false,checked,unchecked});
    }
    //处理check 和 unchecked数据
    handleData(data){
    	let res = [];
        data.map((item) => {
        	let temp = {};
           	temp.total = item.extra_params.total_count || '暂无';
           	temp.qualified_rate = (item.extra_params.qualified_rate*100).toFixed(2) || '暂无';
           	temp.qualified_rate = isNaN(temp.qualified_rate) ? 0 : temp.qualified_rate;
           	temp.check_status = item.extra_params.check_status || '暂无';
           	temp.check_time = item.extra_params.check_time || '暂无';
           	temp.pk = item.pk;
           	temp.name = item.name;
           	temp.tianbaoTime = item.extra_params.tianbaoTime || '暂无';
           	res.push(temp);
        })
        return res;
    }
    //根据当前选择对象的变化，返回合适的pk
    getRightPk(type){
    	let {selectedFenxiang,selectedFenbu,selectedZifenbu,treeNode} = this.state;
    	switch (type){
    		case 'jianyanpi':return selectedFenxiang || selectedZifenbu || selectedFenbu || treeNode;
    		case 'fenxiang': return selectedZifenbu || selectedFenbu || treeNode;
    		case 'zifenbu': return selectedFenbu || treeNode;
    		default: return treeNode;
    	}
    }
	//验收对象选择变化
	handleCheckObj(e){
		this.setState({loading:true})
		let pk = this.getRightPk(e.target.value)
		const {getUnitTreeByPk} = this.props.cellActions;
		if(pk){
			getUnitTreeByPk({pk:pk}).then(rst=>{
				this.getQuertData(rst,objTypeHums[e.target.value]).then((tableData) => {
					this.setCheck(tableData);
					this.setState({checkObj:e.target.value,loading:false})
				});
			});
		}else{
			this.setState({checkObj:e.target.value,checked:[],unchecked:[],loading:false})
		}
	}
	handleCheckType(e){
		this.setState({checkType:e.target.value})	
	}
	//得到检验批相应的数据,默认取第一个
	async getQuertData(data,type){
		const {getUnitTreeByPk} = this.props.cellActions;
		if(data.obj_type_hum === type){
			return [data];
		}
		if(data.children.length > 0){
			if(data.children[0].obj_type_hum === type){
				return data.children;
			}else{
				let child = await getUnitTreeByPk({pk:data.children[0].pk});
				return this.getQuertData(child,type);
			}

		}else{
			return [];
		}
	}
	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const {table: {editing = false} = {}} = this.props;
		let columns = this.columns_all[this.state.checkObj];
		let ds = this.state.checkType === 'checked' ? this.state.checked : this.state.unchecked;
		let disables = selectDisable[this.state.checkObj];
		let fenxiangs = this.state.fenxiangs.filter((element) => {
				return element.obj_type === "C_WP_LOC" ? false : true; 
		});
		return (
			<Main>
				<DynamicTitle title="验收查询" {...this.props} />
				<Sidebar>
					<QualityTree
						nodeClkCallback={this.treeNodeClk.bind(this)}
						actions={this.props.cellActions} />
				</Sidebar>
				<Content>
                    <Spin spinning = {this.state.loading}>
                        <div className = 'flexBox'>
                        	<span style={{marginRight:'5px'}}>验收对象：</span>
                            <RadioGroup className='' value={this.state.checkObj} onChange={this.handleCheckObj.bind(this)}>
                                <Radio value='danwei'>单位验收</Radio>
                                <Radio value='zidanwei'>子单位验收</Radio>
                                <Radio value='fenbu'>分部验收</Radio>
                                <Radio value='zifenbu'>子分部验收</Radio>
                                <Radio value='fenxiang'>分项验收</Radio>
                                <Radio value='jianyanpi'>检验批验收</Radio>
                            </RadioGroup>
                        </div>
                        <div className = 'flexBox'>
                            <Select
                            	disabled={disables[0]}
                                onSelect={this.selectFenbu.bind(this)}
                                className='mySelect' placeholder='分部'>
                                {this.getOptions(this.state.fenbus)}
                            </Select>
                            <Select
                            	disabled={disables[1]}
                                onSelect={this.selectZifenbu.bind(this)}
                                className='mySelect' placeholder='子分部'>
                                {this.getOptions(this.state.zifenbus)}
                            </Select>
                            <Select
                           		disabled={disables[2]}
                                onSelect={this.selectFenxiang.bind(this)}
                                className='mySelect' placeholder='分项'>
                                {this.getOptions(fenxiangs)}
                            </Select>
                            <RadioGroup className = 'endFlexItem'
                             style = {{padding:'10px'}}
                             value={this.state.checkType}
                             onChange={this.handleCheckType.bind(this)}
                            >
                                <Radio value='checked'>已验</Radio>
                                <Radio value='unchecked'>待验</Radio>
                            </RadioGroup>
                        </div>
                        <div className = 'flexBox'>
							<Table dataSource={ds} 
							rowSelection={rowSelection}
							style = {{width:'100%'}} 
							columns ={ columns } 
							className="foresttables"
							bordered
							/>
                        </div>
					</Spin>
					{
	                    this.state.detailModalVisible &&
	                    <Modal
	                        width={800}
	                        height={600}
	                        title="验收详情"
	                        visible={true}
	                        onCancel={() => {this.setState({selectedRow: null, detailModalVisible: false,wk:null})}}
	                        footer={null}
	                        maskClosable={false}
	                    >
	                        {this.getModalContent(this.state.selectedRow,this.state.wk)}
	                    </Modal>
	                }
				</Content>
			</Main>

		);
	}
	//弹出详情 表格点击
	show(record){
		const {getUnitTreeByPk,getWorkflow} = this.props.cellActions;
		getUnitTreeByPk({pk:record.pk}).then((rst) => {
			let pk = rst.extra_params.workflowid || rst.extra_params.workflow_id || rst.extra_params.workflow || rst.extra_params.wfid;
			//显示流程详情
			getWorkflow({pk:pk}).then( res => {
				this.setState({selectedRow: rst, detailModalVisible: true,wk:res})
			})
		})
    }
	//生成模态框内容
	 getModalContent = (record,wk) => {
        console.log('getModalContent: ', record)
        const imgArr = record.extra_params.img || []
        const file = record.extra_params.file ? record.extra_params.file : ''
        return (
            <div>
                <div style={{marginBottom: 10}}>
                    现场记录:
                </div>
                {!imgArr.length ? '暂无图片' :
                    <div style={{overflowX:'scroll',height:"500px"}}>
                        {
                            imgArr.map(x => (
								<img className="picImg" style={{margin:'8px'}} src={`${SOURCE_API}${x}`} alt=""/>
                                /*<div className="picDiv" style={{display:'inline'}}>
                                    <img className="picImg" style={{display:'inline'}} src={`${SOURCE_API}${x}`} alt=""/>
                                </div>*/
                            ))
                        }
                    </div>
                }
                <div style={{margin: '10px 0 10px 0'}}>
                    <span style={{marginRight: 20}}>附件:</span>
                    <span>
                        {file && file.length
                            ?
                            file.map((item) => {
                                return (<p><a href={`${STATIC_DOWNLOAD_API}${item.download_url}`}>{item.name}</a></p>)
                            })
                            :'暂无附件'
                        }
                    </span>
                </div>
				<WorkflowHistory wk={wk}/>
            </div>
        )
    }
}

//根据验收对象来禁用下拉框
const selectDisable = {
	'danwei':[true,true,true],
	"zidanwei":[true,true,true],
	"fenbu":[true,true,true],
	"zifenbu":[false,true,true],
	"fenxiang":[false,false,true],
	"jianyanpi":[false,false,false]
}
const objTypeHums = {
	fenxiang:'分项工程',
	fenbu:'分部工程',
	danwei:'单位工程',
	zidanwei:'子单位工程',
	zifenbu:'子分部工程',
	jianyanpi:'单元工程'
}