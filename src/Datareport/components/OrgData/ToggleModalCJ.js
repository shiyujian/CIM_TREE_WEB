import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Modal,Upload,Select,Icon,TreeSelect} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
import { getUnit } from '../../store/orgdata';
import { Promise } from 'es6-promise';
const Search = Input.Search;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
export default class ToggleModalCJ extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: [],
            defaultPro: "",
            defaultchecker: "",
            units:[],
            selectPro:[],
            selectUnit:[]
        }
    }
    setData(data,participants){
		// console.log("data:",data);
		// console.log("participants:",participants);
		// return;
		const {actions:{ createWorkflow, logWorkflowEvent}} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"参建单位信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"参建单位信息批量录入",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起参建单位填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
					attachment:null
				});
		});
	}
    render(){
        const {visibleCJ = false} = this.props;
        let jthis = this;
        const props = {
			action: `${SERVICE_API}/excel/upload-api/`,
			showUploadList: false,
		    onChange(info) {
		        if (info.file.status !== 'uploading') {
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
                    let dataSource = jthis.handleExcelData(importData);
                    jthis.setState({
                        dataSource
                    })
		            message.success(`${info.file.name} file uploaded successfully`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
        };
        return (
            <Modal
                visible={visibleCJ}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
                <Table 
                    style = {{"textAlign":"center"}}
                    columns={this.columns}
                    bordered={true}
                    dataSource = {this.state.dataSource}
                >
                </Table>
                <Upload {...props}>
                    <Button style={{ margin: '10px 10px 10px 0px' }}>
                        <Icon type="upload" />上传附件
                     </Button>
                </Upload>
                <span>
                    审核人：
                        <Select defaultValue={this.state.defaultchecker} style={{ width: '200px' }} className="btn" onSelect = {ele=>{
                            this.setState({passer:ele})
                        }} >
                        {
                            this.state.checkers
                        }
                    </Select>
                </span> 
                <Button type="primary" onClick = {this.onok.bind(this)}>提交</Button>
               <div style={{marginTop:"30px"}}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{paddingLeft:"25px"}}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
               </div>
            </Modal>
        )
    }
     //处理上传excel的数据
     handleExcelData(data) {
        const {actions:{getOrgReverse}} = this.props;
        data.splice(0, 1);
        let type = [], canjian = [];
        let promises = data.map(item => {
            return getOrgReverse({code:item[3]});
        })
        let res;
        Promise.all(promises).then(rst => {
            rst.map(item => {
                type.push(item.children[0].name);
                canjian.push(item.children[0].children[0].name);
                console.log("type:",type)
                console.log("canjian:",canjian)
            })
            res = data.map((item,index) => {
                return {
                    index: item[0],
                    code: item[1],
                    // 组织机构类型
                    type: type[index],
                    // 参建单位
                    canjian: canjian[index],
                    // 部门
                    depart: item[2],
                    // 直属部门
                    direct: item[3],
                    remarks: item[4]
                }
            })
        })
        return res;
    }
    onok(){
        const { actions: { ModalVisibleCJ, } } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        console.log(this.state.selectPro);
        console.log(this.state.selectUnit);
        this.setData.bind(this, this.state.dataSource, JSON.parse(this.state.passer));
        ModalVisibleCJ(false);
    }
    cancel() {
        const { actions: { ModalVisibleCJ } } = this.props;
        ModalVisibleCJ(false);
    }
    onChange(){

    }
    componentDidMount(){
        const {actions:{getAllUsers, getProjects}} = this.props;
        getAllUsers().then(rst => {
            let users = [];
            if (rst.length) {
                let checkers = rst.map(o => {
                    return (
                        <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                    )
                })
                this.setState({
                    checkers,
                    defaultchecker: rst[0].account.person_name
                })
            }
        });
        getProjects().then(rst => {
            if (rst.children.length) {
                // let projects = rst.children.map(item => {
                //     return (
                //         // <Option value={JSON.stringify(item)}>{item.name}</Option>
                //         <Option value={JSON.stringify(item)}>{item.name}</Option>
                //     )
                // })
                let projects = rst.children;
                this.setState({
                    projects,
                    defaultPro: rst.children[0].name
                })
                console.log("this.state.projects",this.state.projects);
            }
        })
    }
    static lmyloop(data = [],depth=1) {
		if (data.length <= 0 || depth > 1) {
			return;
        }
		return data.map((item) => {
			if (item.children && item.children.length>0) {
				return (
					<TreeNode
						key={`${item.code}--${item.name}`}
						value={`${item.code}--${item.name}`}
						title={`${item.code} ${item.name}`}>
						{
							ToggleModal.lmyloop(item.children,depth++)
						}
					</TreeNode>
				);
			} else {
				return(<TreeNode
					key={`${item.code}--${item.name}`}
					value={`${item.code}--${item.name}`}
                    title={`${item.code} ${item.name}`} />
                );
			}
		});
    };
    onSelect(value,node,extra){
        const {actions:{getUnit}} = this.props;
        let units = [];
        let selectPro = [];
        let promises = extra.checkedNodes.map(item => {
            selectPro.push(item.key);
            return getUnit({code:item.key.split("--")[0]});
        })
        this.setState({selectPro});
        Promise.all(promises).then(rst => {
            rst.map(item => {
                item.children.map(it => {
                    units.push(it);
                })
            })
            this.setState({units})
            console.log("this.state.units",this.state.units);
        })
    }
    onSelectUnit(value, node, extra){
        let selectUnit = [];
        extra.checkedNodes.map(item => {
            selectUnit.push(item.key);
        })
        this.setState({selectUnit});
    }
    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
    }, {
        title: '参建单位编码',
        dataIndex: 'code',
        key: 'Code',
    }, {
        title: '机构类型',
        dataIndex: 'type',
        key: 'Type',
    }, {
        title: '参建单位名称',
        dataIndex: 'canjian',
        key: 'Canjian',
    }, {
        title: '组织机构部门',
        dataIndex: 'depart',
        key: 'depart',
    }, {
        title: '负责项目/子项目名称',
        width:"15%",
        height:"64px",
        render:(record) => {
            return (
                // <Select style={{width:"90%"}} value = {record.project || this.state.defaultPro} onSelect={ele => {
                //     record.project = JSON.parse(ele).name;
                //     console.log("ele",ele);
                //     const {actions:{getUnit}} = this.props;
                //     getUnit({code:JSON.parse(ele).code}).then(rst => {
                //         let units = rst.children.map(item => {
                //             return (
                //                 <Option value={JSON.stringify(item)}>{item.name}</Option>
                //             )
                //         })
                //         this.setState({units})
                //     })
                //     this.forceUpdate();
                // }}>
                //     {this.state.projects}
                // </Select>
                // <TreeSelect onSelect={this.onSelect.bind(this)} style={{width:"90%"}} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL}>
                //     {ToggleModal.lmyloop(this.state.projects)}
                // </TreeSelect>
                <TreeSelect style={{ width: "90%" }} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL} onSelect={(value,node,extra) => {
                    const {actions:{getUnit}} = this.props;
                    let units = [];
                    let selectPro = [];
                    let promises = extra.checkedNodes.map(item => {
                        selectPro.push(item.key);
                        return getUnit({code:item.key.split("--")[0]});
                    })
                    record.selectPro = selectPro;
                    Promise.all(promises).then(rst => {
                        rst.map(item => {
                            item.children.map(it => {
                                units.push(it);
                            })
                        })
                        this.setState({units})
                        console.log("this.state.units",this.state.units);
                    })

                }} 
                >
                    {ToggleModal.lmyloop(this.state.projects)}
                </TreeSelect>
            )
        }
    }, {
        title: '负责单位工程名称',
        width:"15%",
        render:(record) => {
            return (
                <TreeSelect onSelect={(value, node, extra) => {
                    let selectUnit = [];
                    extra.checkedNodes.map(item => {
                        selectUnit.push(item.key);
                    })
                    record.selectUnit = selectUnit;
                }} style={{width:"90%"}} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL}>
                    {ToggleModal.lmyloop(this.state.units)}
                 </TreeSelect>
            )
        }
    }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'Remarks'
    }, {
        title: '编辑',
        render: (record) => (
            <span>
                <Icon style={{marginRight:"15px"}} type = "edit"/>
                <Icon type = "delete"/>
            </span>
        )
    }]
}