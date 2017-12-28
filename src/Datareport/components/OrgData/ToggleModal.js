import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Modal,Upload,Select,Icon,TreeSelect} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
import { getUnit } from '../../store/orgdata';
import { Promise } from 'es6-promise';
const Search = Input.Search;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
export default class ToggleModal extends Component{
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
            selectUnit:[],
            flag:""
        }
    }
    render(){
        const {visible = false} = this.props;
        let jthis = this;
        const props = {
			action: `${SERVICE_API}/excel/upload-api/`,
			showUploadList: false,
		    onChange(info) {
		        if (info.file.status !== 'uploading') {
		        }
		        if (info.file.status === 'done') {
                    let importData = info.file.response.Sheet1;
                    jthis.handleExcelData(importData);
		            message.success(`${info.file.name} file uploaded successfully`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
        };
        console.log("this.state.dataSource:",this.state.dataSource);
        return (
            <Modal
                visible={visible}
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
                    rowKey="index"
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
        console.log("data:",data);
        let type = [], canjian = [], color = [];
        let promises = data.map(item => {
            return getOrgReverse({code:item[3]});
        })
        let res;
        Promise.all(promises).then(rst => {
            rst.map(item => {
                if (item.children.length === 0) {
                    type.push(" ");
                    canjian.push(" ");
                    this.setState({
                        flag:false
                    })
                }else{
                    type.push(item.children[0].name || "");
                    canjian.push(item.children[0].children[0].name || "");
                }
            })
            res = data.map((item,index) => {
                return {
                    index: item[0],
                    code: item[1],
                    // 组织机构类型
                    type: type[index] || "" ,
                    // 参建单位
                    canjian: canjian[index] || "",
                    // 部门
                    depart: item[2],
                    // 直属部门
                    direct: item[3],
                    remarks: item[4],
                    color
                }
            });
            console.log("res:",res);
            this.setState({
                dataSource:res
            })
        })
    }
    onok(){
        const { actions: { ModalVisible, ModalVisibleOrg } } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        if (this.state.flag === false) {
            message.error('存在错误数据');
            return;
        }
        console.log(this.state.selectPro);
        console.log(this.state.selectUnit);
        this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
        ModalVisible(false);
    }
    cancel() {
        const { actions: { ModalVisibleOrg, ModalVisible } } = this.props;
        ModalVisible(false);
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
        title: '组织机构编码',
        dataIndex: 'code',
        key: 'Code',
    }, {
        title: '组织机构类型',
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
        title: '直属部门',
        // dataIndex: 'direct',
        // key: 'Direct',
        render:(record) => {
            if (record.canjian === " " || record.direct === " ") {
                return (
                    <span style={{color:"red"}}>{record.direct}</span>
                )
            }else{
                return (
                    <span>{record.direct}</span>
                )
            }
        }
    }, {
        title: '负责项目/子项目名称',
        width:"15%",
        height:"64px",
        render:(record) => {
            return (
                <TreeSelect value={record.selectPro || ""} style={{ width: "90%" }} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL} onSelect={(value,node,extra) => {
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
                    this.forceUpdate();

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
                <TreeSelect value={record.selectUnit || ""} onSelect={(value, node, extra) => {
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