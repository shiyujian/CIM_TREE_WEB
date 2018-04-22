import React, { Component } from 'react';
import { Table, Spin, Button, notification, Modal, Form, Row, Col, Input, Select, Checkbox, Upload, Progress, Icon, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Link } from 'react-router-dom';
import { getUser } from '../../../_platform/auth';
import {PROJECT_UNITS,STATIC_DOWNLOAD_API } from '../../../_platform/api';
// import PerSearch from './PerSearch';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import {getNextStates} from '../../../_platform/components/Progress/util';
import queryString from 'query-string';
import '../../../Datum/components/Datum/index.less'
import SearchInfo from './SearchInfo';
import DetailModal from './DetailModal';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const Option = Select.Option;
moment.locale('zh-cn');
class TableInfo extends Component {
    static propTypes = {};
    array = [];
    code = '';
    constructor(props) {
        super(props)
        this.state = {
            workdata: [],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            fileList: [],
            isCopyMsg: false, //接收人员是否发短信
            TreatmentData: [],
            newFileLists:[],
            detailvisible: false,
            DetailModaldata:[],
            code:'',
        }
    }

    columns = [
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
        }, {
            title: '文档类型',
            dataIndex: 'document',
            key: 'document',
        }, {
            title: '提交单位',
            dataIndex: 'submitOrg',
            key: 'submitOrg',
        }, {
            title: '提交人',
            dataIndex: 'submitPerson',
            key: 'submitPerson',
        }, {
            title: '提交时间',
            dataIndex: 'submitTime',
            key: 'submitTime',
            sorter: (a, b) => moment(a['submitTime']).unix() - moment(b['submitTime']).unix(),
            render: text => {
                return moment(text).format('YYYY-MM-DD');
            }
        }, {
            title: '流程状态',
            dataIndex: 'status',
        }, {
            title: '操作',
            render: record => {
                return (
                    <span>
                        <a onClick={this.clickInfo.bind(this, record)}>查看</a>
					</span>
                )
            },
        }
    ]

    async componentDidMount() {
       
        this.gettaskSchedule();
    }

    async componentDidUpdate(prevProps,prevState){
		const {
            selectedDir,
            searchForm
		}=this.props

		if(selectedDir != prevProps.selectedDir){
			this.gettaskSchedule()
        }
        if(searchForm != prevProps.searchForm){
			this.gettaskSchedule()
        }
	}

    // 获取表单管理流程流程信息
    gettaskSchedule = async ()=>{
        const { 
            actions: { 
                getWorkflows 
            },
            selectedDir
        } = this.props;

        let flow = selectedDir.extra_params ? selectedDir.extra_params.workflow : ''
        let flowCode = ''
        let document = selectedDir.name?selectedDir.name:''
        try{
            flowCode = flow.split('--')[0]
            
        }catch(e){
            console.log(e)
        }

        if(!flowCode){
            return
        }


        let reqData={};
        this.props.form.validateFields((err, values) => {
			console.log("表单管理流程", values);
            console.log("err", err);
            
            values.ssection?reqData.subject_sectionName__contains = values.ssection : '';
            values.sname?reqData.subject_name__contains = values.sname : '';
            values.scode?reqData.subject_code__contains = values.scode : '';
            
            if(values.stimedate && values.stimedate instanceof Array && values.stimedate.length>0){
				values.stimedate?reqData.real_start_time_begin = moment(values.stimedate[0]._d).format('YYYY-MM-DD 00:00:00') : '';
				values.stimedate?reqData.real_start_time_end = moment(values.stimedate[1]._d).format('YYYY-MM-DD 23:59:59') : '';
			}
            values.sstatus?reqData.status = values.sstatus : (values.sstatus === 0? reqData.status = 0 : '');
        })
        document?reqData.subject_document__contains = document : '';
        
        console.log('reqData',reqData)

        let tmpData = Object.assign({}, reqData);


        let task = await getWorkflows({ code: flowCode },tmpData);
        let subject = [];
        let workdata = [];
        let arrange = {};
        task.map((item,index)=>{
            let subject = item.subject[0];
			let creator = item.creator;
			let postData = subject.postData?JSON.parse(subject.postData):{};
			let data = {
				id:item.id,
				workflow:item,
				TreatmentData:subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
				section: subject.section?JSON.parse(subject.section):'',
                sectionName: subject.sectionName?JSON.parse(subject.sectionName):'',
                projectName: subject.projectName?JSON.parse(subject.projectName):'',
                name: subject.name?JSON.parse(subject.name):'',
				code: subject.code?JSON.parse(subject.code):'',
				document: document,
				submitOrg: postData.upload_unit?postData.upload_unit:'',
				submitPerson: creator.person_name?creator.person_name+'('+creator.username+')':creator.username,
				submitTime: moment(item.workflow.created_on).utc().zone(-8).format('YYYY-MM-DD'),
				status: item.status===2?'执行中':'已完成',
			}
			workdata.push(data)
        })
        this.setState({
            workdata:workdata
        },()=>{
			this.filterTask()
		})
    }

    	//对流程信息根据选择项目进行过滤
	filterTask(){
		const {
			workdata 
		}=this.state
		let filterData = []
		let user = getUser()
		
		let sections = user.sections
		
		sections = JSON.parse(sections)
		
		let selectCode = ''
		//关联标段的人只能看自己项目的进度流程
		if(sections && sections instanceof Array && sections.length>0){
			let code = sections[0].split('-')
			selectCode = code[0] || '';

			workdata.map((task)=>{
			
				let projectName = task.projectName
				let projectCode = this.getProjectCode(projectName)
				
				if(projectCode === selectCode && task.section === sections[0]){
					filterData.push(task);
				}
			})
		}else{
			filterData = workdata
		}      
		
		this.setState({
			filterData
		})
    }
    //获取项目code
    getProjectCode(projectName){
        let projectCode = ''
        PROJECT_UNITS.map((item)=>{
            if(projectName === item.value){
                projectCode = item.code
            }
        })
		
		return projectCode 
    }

    render() {
        const { 
            selectedRowKeys,
            filterData 
        } = this.state;

        const {
            form: { getFieldDecorator },
            fileList = [],
            isTreeSelected,
            depth
        } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        
        //如果第三级节点被选中，才允许新增
        let disabled = true 
        if(isTreeSelected && depth === '3'){
            disabled = false
        }
        return (
            <div>
                {
                    this.state.detailvisible &&
                    <DetailModal 
                        {...this.props}
                        {...this.state}
                        oncancel={this.detailCancle.bind(this)}
                        onok={this.detailOk.bind(this)}
                    />
                }
                <SearchInfo {...this.props} gettaskSchedule={this.gettaskSchedule.bind(this)}/>
                <Button onClick={this.addClick.bind(this)} disabled={disabled}>新增</Button>
                <Button onClick={this.deleteClick.bind(this)}>删除</Button>
                <Table
                    columns={this.columns}
                    rowSelection={rowSelection} 
                    dataSource={filterData}
                    bordered
                />
                
            </div>

        );
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    }

    // 操作--查看
    clickInfo(record) {
        this.setState({ detailvisible: true ,record:record});
    }
    // 查看流程详情取消
    detailCancle() {
        this.setState({ detailvisible: false });
    }
    // 查看流程详情确定
    detailOk() {
        this.setState({ detailvisible: false });
    }
    // 删除
    deleteClick = () => {
        const { selectedRowKeys } = this.state
        if (selectedRowKeys.length === 0) {
            notification.warning({
                message: '请先选择数据！',
                duration: 2
            });
            return
        } else {
            alert('还未做删除功能')
        }
    }

    // 新增按钮
    addClick = () => {
        const {
            actions: {
                FormAddVisible
            },
            selectedDir
        } = this.props;
        if(selectedDir && selectedDir.extra_params && selectedDir.extra_params.workflow){
            FormAddVisible(true)
        }else{
            notification.warning({
                message:'此节点未关联流程，不能发起流程',
                duration:3
            })
        }
		
    }
}
export default Form.create()(TableInfo)
