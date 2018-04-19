import React, { Component } from 'react';
import { Table, Spin, Button, notification, Modal, Form, Row, Col, Input, Select, Checkbox, Upload, Progress, Icon, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Link } from 'react-router-dom';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API, DATASOURCECODE, UNITS, WORKFLOW_CODE } from '../../../_platform/api';
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    }

    getSomeNode(children){
		children.map(item =>{
			if(item.children.length > 0){
				this.getSomeNode(item.children);
			}else{
				this.array.push(<Option value={item.code} key={item.code}>{item.name}</Option>)
			}
		})
    }
    setUserByUnit(unit){
        this.code = unit;
        this.setState({code:unit})
    }

    async componentDidMount() {
        const {actions: {getPublicUnitList}} = this.props;
        let unit = await getPublicUnitList();
		if(unit.children){
            this.array = [];
			this.getSomeNode(unit.children);
		}
        this.gettaskSchedule();
    }

    // 获取表单管理流程流程信息
    gettaskSchedule = async ()=>{
        const { actions: { getTaskSchedule } } = this.props;
        let reqData={};
        this.props.form.validateFields((err, values) => {
			console.log("表单管理流程", values);
            console.log("err", err);
            
            values.sunit?reqData.subject_unit__contains = values.sunit : '';
            values.sname?reqData.subject_name__contains = values.sname : '';
            values.snumbercode?reqData.subject_numbercode__contains = values.snumbercode : '';
            values.sdocument?reqData.subject_document__contains = values.sdocument : '';
            values.stimedate?reqData.real_start_time_begin = moment(values.stimedate[0]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.stimedate?reqData.real_start_time_end = moment(values.stimedate[1]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.sstatus?reqData.status = values.sstatus : (values.sstatus === 0? reqData.status = 0 : '');
        })
        
        console.log('reqData',reqData)

        let tmpData = Object.assign({}, reqData);


        let task = await getTaskSchedule({ code: WORKFLOW_CODE.表单管理流程 },tmpData);
        let subject = [];
        let workdata = [];
        let arrange = {};
        task.map((item,index)=>{
            let itemdata = item.workflowactivity.subject[0];
            let itempostdata = itemdata.postData?JSON.parse(itemdata.postData):null;
            let itemtreatmentdata = itemdata.TreatmentData ? JSON.parse(itemdata.TreatmentData) : null;
            let itemarrange = {
                index:index+1,
                id:item.workflowactivity.id,
                unit: itemdata.unit?JSON.parse(itemdata.unit):'',
                name: itemdata.name?JSON.parse(itemdata.name):'',
                numbercode:itemdata.numbercode?JSON.parse(itemdata.numbercode):'',
                document:itemdata.document?JSON.parse(itemdata.document):'',
                submitunit:item.workflowactivity.creator.org?item.workflowactivity.creator.org:'',
                submitperson:item.workflowactivity.creator.person_name,
                status:item.workflowactivity.status===2?'执行中':'已完成',
                treatmentdata:itemtreatmentdata,
                dataReview:itemdata.dataReview?JSON.parse(itemdata.dataReview).person_name:'',
                superunit:itemdata.dataReview?JSON.parse(itemdata.dataReview).org:'',
                remarks:itemtreatmentdata[0].remarks||"--",
                submittime:item.workflowactivity.real_start_time,
            }
            workdata.push(itemarrange);
        })
        this.setState({
            workdata:workdata
        })
    }

    // 操作--查看
    clickInfo(record) {
        this.setState({ detailvisible: true ,DetailModaldata:record});
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

    render() {
        const { 
            selectedRowKeys,
            workdata 
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
                    <DetailModal {...this.props}
                        {...this.state.DetailModaldata}
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
                    dataSource={workdata}
                    bordered
                />
                
            </div>

        );
    }

    columns = [
        {
            title: '单位工程',
            dataIndex: 'unit',
        }, {
            title: '名称',
            dataIndex: 'name',
        }, {
            title: '编号',
            dataIndex: 'numbercode',
        }, {
            title: '文档类型',
            dataIndex: 'document',
        }, {
            title: '提交单位',
            dataIndex: 'submitunit',
        }, {
            title: '提交人',
            dataIndex: 'submitperson',
        }, {
            title: '提交时间',
            dataIndex: 'submittime',
            sorter: (a, b) => moment(a['submittime']).unix() - moment(b['submittime']).unix(),
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
}
export default Form.create()(TableInfo)
