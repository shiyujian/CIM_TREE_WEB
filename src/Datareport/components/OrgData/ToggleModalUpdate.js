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
        const {visibleUpdata} = this.props;
        return (
            <Modal
                visible={visibleUpdata}
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
        this.props.setDataDel(this.state.dataSource, JSON.parse(this.state.passer));
        ModalVisibleUpdate(false);
    }
    cancel() {
        const { actions: {ModalVisibleUpdate} } = this.props;
        ModalVisibleUpdate(false);
    }
    componentDidMount(){
        const {updateOrg, actions:{getAllUsers, getProjects}} = this.props;
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
        this.setState({
            dataSource:updateOrg
        })
    }
    columns = [ {
        title: '组织机构编码',
        dataIndex:"code",
		render:(record) => (
            <Input value={record.code} />
        )
	}, {
		title: '组织机构类型',
		dataIndex: 'extra_params.org_type',
		render:(record) => (
            <Input value={record.extra_params.org_type} />
        )
	}, {
		title: '参建单位名称',
        dataIndex: 'extra_params.canjian',
        render:(record) => (
            <Input value={extra_params.canjian} />
        )
	}, {
		title: '组织机构部门',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '直属部门',
		dataIndex: 'extra_params.direct',
		key: 'Direct',
	}, {
		title: '负责项目/子项目名称',
		dataIndex: 'extra_params.project',
		key: 'Project',
	},{
		title: '负责单位工程名称',
		dataIndex: 'extra_params.unit',
		key: 'Unit'
	},{
		title: '备注',
		dataIndex: 'extra_params.remarks',
		key: 'Remarks'
	}]
}