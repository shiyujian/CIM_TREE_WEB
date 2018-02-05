import React, {Component} from 'react';
import {Table,Button,Popconfirm,notification,Input,Modal,Upload,Select,Icon,TreeSelect} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,DataReportTemplate_ConstructionUnits} from '_platform/api';
import { getUnit } from '../../store/orgdata';
import { Promise } from 'es6-promise';
import './TableOrg.less'
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
            selectUnit:[],
            flag:'',
            flag_code:''
        }
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
                    jthis.handleExcelData(importData);
		            notification.success({
                        message:`${info.file.name} 上传成功`
                    });
		        } else if (info.file.status === 'error') {
		            notification.error({
                        message:`${info.file.name}解析失败，请检查输入`
                    });
		        }
		    },
        };
        return (
            <Modal
                visible={visibleCJ}
                width={1280}
                okText = "确定"
                cancelText = "取消"
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>新增参建单位</h1>
                <Table 
                    style = {{"textAlign":"center"}}
                    columns={this.columns}
                    bordered={true}
                    dataSource = {this.state.dataSource}
                >
                </Table>
                <Button style={{ marginRight: "10px" }} onClick={this.createLink.bind(this,'muban',`${DataReportTemplate_ConstructionUnits}`)} type="default">模板下载</Button>
                <Upload {...props}>
                    <Button style={{ margin: '10px 10px 10px 0px' }}>
                        <Icon type="upload" />上传并预览
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
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    //判断数据是否重复
    isRepeat(arr){
        var hash = {};
        let repeatCode = [];
        for(var i in arr){
            if (hash[arr[i]]) {
                repeatCode.push(arr[i])
            }
            hash[arr[i]] = true;
        }
        return repeatCode;
    }
     //处理上传excel的数据
     handleExcelData(data) {
        const {actions:{getOrgReverse, getCanjian}} = this.props;
        data.splice(0, 1);
        let res ,codes = [];
        data.map((item, index) => {
            codes.push(item[1]);
            getCanjian({ code: item[0]}).then(rst => {
                if (rst.code !== "code") {
                    
                }else{
                    item[item.length] = "red"
                    this.setState({
                        flag:false
                    })
                }
                res = data.map((item, index) => {
                    return {
                        index: index + 1,
                        // 组织机构类型
                        type:item[0],
                        code: item[1],
                        // 参建单位
                        canjian: item[2],
                        remarks: item[3],
                        color:item[4],
                        selectPro:[],
                        selectUnit:[],
                        editing:false
                    }
                })
                this.setState({
                    dataSource: res
                })
            })
        })
        let repeatCode = this.isRepeat(codes);
        if (repeatCode.length > 1) {
            this.setState({
                flag_code:false
            })
        }
        this.setState({
            repeatCode
        })
    }
    onok(){
        const { actions: { ModalVisibleCJ} } = this.props;
        if (!this.state.passer) {
            notification.warning({
                message:'审批人未选择！'
            });
            return;
        }
        let arr = this.state.dataSource;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].color === "red") {
                notification.warning({
                    message: '不存在该机构类型！'
                });
                return;
            }
        }
        if (this.state.flag_code === false) {
            notification.warning({
                message:'存在重复的参建单位编码！'
            });
            return;
        }
        this.props.setDataCJ(this.state.dataSource, JSON.parse(this.state.passer));
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
                let projects = rst.children;
                this.setState({
                    projects,
                    defaultPro: rst.children[0].name
                })
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
        })
    }
    onSelectUnit(value, node, extra){
        let selectUnit = [];
        extra.checkedNodes.map(item => {
            selectUnit.push(item.key);
        })
        this.setState({selectUnit});
    }
    // 删除数据
    delete(index){
        let dataSource = this.state.dataSource;
        dataSource.splice(index,1);
        this.setState({flag_code:true, flag:true})
        this.delData(dataSource);
        this.setState({dataSource})
    }
    async delData(data) {
        const {actions:{getOrgReverse, getCanjian}} = this.props;
        let res ,codes = [];
        await data.map((item, index) => {
            codes.push(item.code);
            getCanjian({ code: item.type }).then(rst => {
                if (rst.code === "code") {
                    item.color = "red"
                    this.setState({
                        flag: false
                    })
                }
            })
        })
        data.map((item, index) => {
            item.index = index + 1;
        })
        let repeatCode = this.isRepeat(codes);
        if (repeatCode.length > 1) {
            this.setState({
                flag_code:false
            })
        }
        this.setState({
            repeatCode,
            dataSource:data
        })
    }
    changeType(record,e){
        record.type = e.target.value;
        const {actions:{getOrgReverse}} = this.props;
        getOrgReverse({code:record.type}).then(rst => {
            console.log("rst:",rst);
            if (rst.code === "code") {
                record.color = "red"
            }else{
                record.color = ""
            }
            this.forceUpdate();
        })
    }
    changeCode(record,e){
        record.code = e.target.value;
        this.forceUpdate();
        let codes = [];
        this.state.dataSource.map(item => {
            codes.push(item.code);
        })
        let repeatCode = this.isRepeat(codes);
        if (repeatCode.length > 1) {
            this.setState({ flag_code: false })
        }else{
            this.setState({ flag_code: true })
        }
        this.setState({repeatCode});
    }
    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
    }, {
        title: '参建单位编码',
        render:(text,record,index) => {
            if (record.editing === true) {
                if (this.state.repeatCode.indexOf(record.code) !== -1 ) {
                    return <Input value = {record.code} style={{"color":"red"}} onChange = {this.changeCode.bind(this,record)}/>
                }else{
                    return <Input value = {record.code} onChange = {this.changeCode.bind(this,record)}/>
                }
            }
            if (this.state.repeatCode.indexOf(record.code) !== -1 ) {
                return <span style={{"color":"red"}}>{record.code}</span>
            }else{
                return <span>{record.code}</span>
            }
        }
    }, {
        title: '机构类型',
        render:(record) => {
            if (record.editing) {
                if (record.color === "red") {
                    return <Input value={record.type} style={{"color":"red"}} onChange = {this.changeType.bind(this,record)}/>
                }else{
                    return <Input value={record.type} onChange={this.changeType.bind(this,record)}/>
                }
            }else{
                return (<span style={{color:record.color || ""}}>{record.type}</span>)
            }
        }
    }, {
        title: '参建单位名称',
        // dataIndex: 'canjian',
        // key: 'Canjian',
        render:(text, record, indexe) => {
            if (record.editing) {
                return <Input value={record.canjian} onChange={(e) => {
                    record.canjian = e.target.value;
                    this.forceUpdate();
                }}/>
            }else{
                return <span>{record.canjian}</span>
            }
        }
    },{
        title: '负责项目/子项目名称',
        width:"15%",
        height:"64px",
        render:(record) => {
            return (
                <TreeSelect value={record.selectPro || "" } style={{ width: "90%" }} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL}
                 onSelect={(value,node,extra) => {
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
                        record.selectUnits = units;
                        this.forceUpdate(); 
                    });
                }} 
                >
                    {ToggleModalCJ.lmyloop(this.state.projects)}
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
                    this.forceUpdate();
                }} style={{width:"90%"}} allowClear={true} multiple={true} treeCheckable={true} showCheckedStrategy={TreeSelect.SHOW_ALL}>
                    {ToggleModalCJ.lmyloop(record.selectUnits)}
                 </TreeSelect>
            )
        }
    }, {
        title: '备注',
        // dataIndex: 'remarks',
        // key: 'Remarks'
        render:(text, record, index) => {
            if (record.editing) {
                return <Input value={record.remarks} onChange={(e) => {
                    record.remarks = e.target.value;
                    this.forceUpdate();
                }}/>
            }else{
                return <span>{record.remarks}</span>
            }
        }
    }, {
        title: '操作',
        // render: (text, record, index) => (
        //     <span>
        //         {/* <Icon style={{marginRight:"15px"}} type = "edit"/> */}
        //         {/* <span>|</span> */}
        //         <Popconfirm 
        //             title="确认删除吗"
        //             onConfirm={this.delete.bind(this, index)}
        //             okText="确认"
        //             onCancel="取消"
        //         >
        //             <a><Icon type = "delete" /></a>
        //         </Popconfirm>
                
        //     </span>
        // )
        render: (text, record, index) => {
            return <span>
                        {record.editing ||
                            <span>
                                <a><Icon type="edit" onClick={(e) => {
                                    record.editing = true
                                    this.forceUpdate();
                                 }} /></a>
                                <Popconfirm
                                    title="确认删除吗"
                                    onConfirm={this.delete.bind(this, record.index - 1)}
                                    okText="确认"
                                    onCancel="取消"
                                >
                                    <span style={{ "margin": "7px" }}>|</span>
                                    <a><Icon type="delete" /></a>
                                </Popconfirm>
                            </span>
                        }
                        {record.editing &&
                            <a onClick={(e) => {
                                record.editing = false
                                this.forceUpdate();
                            }}>完成</a>
                        }
                </span>
    }
    }]
}