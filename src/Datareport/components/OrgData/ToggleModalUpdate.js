import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Modal,Upload,Select,Icon,TreeSelect} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
import { getUnit } from '../../store/orgdata';
import { Promise } from 'es6-promise';
const Search = Input.Search;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
export default class ToggleModalUpdate extends Component{
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
    render(){
        const {visibleUpdate} = this.props;
        return (
            <Modal
                visible={visibleUpdate}
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
                    rowKey="code"
                >
                </Table>
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
    onok(){
        const { actions: { ModalVisibleUpdate} } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setDataUpdate(this.state.dataSource, JSON.parse(this.state.passer));
        ModalVisibleUpdate(false);
    }
    cancel() {
        const { actions: {ModalVisibleUpdate} } = this.props;
        ModalVisibleUpdate(false);
    }
    componentDidMount(){
        const {updateOrg, actions:{getAllUsers, getProjects, getUnit}} = this.props;
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
            }
        }) 
        this.setState({dataSource:updateOrg})
        let units = [];
        updateOrg.map(item => {
            item.extra_params.project.map(it => {
                getUnit({code:it.split("--")[0]}).then(rst => {
                    units.push(...rst.children);
                    this.setState({
                        units:units
                    })
                })
            })
        })
    }
    columns = [ {
        title: '组织机构编码',
        dataIndex:"code",
	}, {
		title: '组织机构类型',
		dataIndex: 'extra_params.org_type',
	}, {
		title: '参建单位名称',
        dataIndex: 'extra_params.canjian',
	}, {
		title: '组织机构部门',
		// dataIndex: 'name',
		render:(text, record, index) =>{ 
            return <Input value = {record.name || ""} onChange={ele => {
                record.name = ele.target.value
                this.forceUpdate();
            }}/>
        }
	}, {
		title: '直属部门',
		dataIndex: 'extra_params.direct',
		key: 'Direct',
	}, {
		title: '负责项目/子项目名称',
		dataIndex: 'extra_params.project',
        width:"15%",
        height:"64px",
        render:(text, record, index) => {
            return (
                <TreeSelect value={record.selectPro || record.extra_params.project} style={{ width: "90%" }} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL} onSelect={(value,node,extra) => {
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
                    })
                    this.forceUpdate();

                }} 
                >
                    {ToggleModalUpdate.lmyloop(this.state.projects)}
                </TreeSelect>
            )
        }
	},{
        title: '负责单位工程名称',
        width:"15%",
		render:(text, record, index) => {
            console.log("dfggdfg:",this.state.units);
            return (
                <TreeSelect value={record.selectUnit || record.extra_params.unit} onSelect={(value, node, extra) => {
                    let selectUnit = [];
                    extra.checkedNodes.map(item => {
                        selectUnit.push(item.key);
                    }); 
                    record.selectUnit = selectUnit;
                    this.forceUpdate();
                }} style={{width:"90%"}} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL}>
                    {
                        ToggleModalUpdate.lmyloop(this.state.units) 
                    }
                 </TreeSelect>
            )
        }
	},{
		title: '备注',
		dataIndex: 'extra_params.remarks',
		key: 'Remarks'
    }]
    static lmyloop(data = [],depth=1) {
		if (data.length <= 0 || depth > 1) {
			return;
        }
		return data.map((item) => {
			if (item.children && item.children.length>0) {
				return (
					<TreeNode
                        data = {item}
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
                    data = {item}
					key={`${item.code}--${item.name}`}
					value={`${item.code}--${item.name}`}
                    title={`${item.code} ${item.name}`} />
                );
			}
		});
    };
}