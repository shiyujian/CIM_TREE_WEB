/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/subitem';
import {actions as actions1} from '../../store/cells';
import { SOURCE_API, STATIC_DOWNLOAD_API} from '../../../_platform/api';
import {Table, Select, Button, Modal, Radio, Carousel, Row, Col, Input, Form} from 'antd';
// import moment from 'moment';
import './index.css';
import WorkflowHistory from '../WorkflowHistory';
const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
	state => {
		const {subitem = {}} = state.quality || {}
		return subitem
	},
	dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        cellActions: bindActionCreators(actions1, dispatch)
	}),
)

export class SubitemTable extends Component{

    constructor(props){
    	super(props)
    	this.state = {
            selectedRow: null,
            tblData_1: [],
            tblData_2: [],
            sectionOptions: [],
            subsectionOptions: [],
            locationOptions: [],
            selectedPtr: '',
            selectedSubPtr: '',
            selectedItem: '',
            detailModalVisible: false,
            wk:null,
            selectedStatus: 1,
            sub_project_data: {},
        }
    }

    componentWillReceiveProps(nextProps) {
        const {ptrData} = nextProps
        const sectionOptions = ptrData.map(x => (
            <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
        ))
        this.setState({ sectionOptions })
        if (this.props.ptrData !== nextProps.ptrData) {
            this.setState({ selectedPtr: '', selectedSubPtr: '', selectedItem: '' })
        }
    }

    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'order_number',
            width: '10%',
        },{
            title: '检验批内容',
            dataIndex: 'inspection_lot_content',
            width: '20%',
            render: (text, record) => {
                return (
                    <div className="ellipsisTd">
                        {text}
                    </div>
                )
            }
        },{
            title: '工程部位',
            dataIndex: 'engineering_position',
            width: '20%',
        },{
            title: '当前状态',
            dataIndex: 'check_status',
            width: '15%',
            render: (text, record) => (
                <span> {text === 1 ? '待验收' : text === 2 ? '已验收' : '-'} </span>
            )
        },{
            title: '合格率',
            dataIndex: 'qualified_rate',
            width: '15%',
        },{
            title: '提交时间',
            dataIndex: 'tianbaoTime',
            width: '10%',
        },{
            title: '审核时间',
            dataIndex: 'check_time',
            width: '10%',
        },{
            title: '操作',
            render:(text,record,index)=>{
                console.log(text,record,index);
                return(
                    <Button onClick = {this.onTblRowClick.bind(this,record)} >
                    详情
                    </Button>
                );
            }
        }]
        const {
            sectionOptions, subsectionOptions, locationOptions,
            selectedPtr, selectedSubPtr, selectedItem,
            selectedStatus, tblData_1, tblData_2,
            sub_project_data, detailModalVisible, selectedRow,wk
        } = this.state

        const dataSource = selectedStatus === 1 ? tblData_1 : selectedStatus === 2 ? tblData_2 : []
        const sub_project_checkstatus = sub_project_data.extra_params && (sub_project_data.extra_params.check_status || 0)
        // const launchable = tblData_2.length === sub_project_data.children_wp.length
        const launchable = tblData_2.length !==0 && tblData_1.length === 0
            ? sub_project_checkstatus === 0
                ? true
                : false
            : false
        const btnContent = sub_project_checkstatus === 2
            ? '分项已被验收'
            : sub_project_checkstatus === 1
                ? '分项正在验收'
                : '发起分项验收'
        return (
            <div>
                <div style={{marginBottom: 15}}>
                    <span>
                        分部:
                        <Select className="section" value={selectedPtr} onSelect={this.handleSections}>
                            {sectionOptions}
                        </Select>
                    </span>
                    <span>
                        子分部:
                        <Select className="subsection" value={selectedSubPtr} onSelect={this.handleSubSections}>
                            {subsectionOptions}
                        </Select>
                    </span>
                    <span>
                        分项:
                        <Select className="locationOption" value={selectedItem} onSelect={this.handleLocations}>
                            {locationOptions}
                        </Select>
                    </span>
                    <RadioGroup className="radioGroup" onChange = {this.radioChange} value={selectedStatus}>
                        <RadioButton value={1}>待验收</RadioButton>
                        <RadioButton value={2}>已验收</RadioButton>
                    </RadioGroup>
                    <Button className="checkBtn" disabled={!launchable} onClick={this.handleLaunchTask} type="primary">
                        {btnContent}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    rowClassName={this.rowClassName}
                    className="defectTable"
                    pagination={{ pageSize: 20 }}
                />
                {
                    detailModalVisible &&
                    <Modal
                        width={800}
                        height={600}
                        title="验收详情"
                        visible={true}
                        onCancel={() => {this.setState({selectedRow: null, detailModalVisible: false})}}
                        footer={null}
                        maskClosable={false}
                    >
                        {this.getModalContent(selectedRow,wk)}
                    </Modal>
                }
            </div>
        )
    }

    onTblRowClick = (record) => {
        const {getUnitTreeByPk,getWorkflow} = this.props.cellActions;
		getUnitTreeByPk({pk:record.pk}).then((rst) => {
			let pk = rst.extra_params.workflowid || rst.extra_params.workflow_id || rst.extra_params.workflow || rst.extra_params.wfid;
			//显示流程详情
			getWorkflow({pk:pk}).then( res => {
				this.setState({selectedRow: rst, detailModalVisible: true,wk:res})
			})
		})
    }

    rowClassName = (record) => {
        const { selectedRow } = this.state
        return selectedRow
            ? record.key === selectedRow.key
                ? 'tableRowSelected'
                : ''
            : ''
    }

    handleSections = (value) => {
        const {getWorkpackagesDetail} = this.props.actions
        getWorkpackagesDetail({pk: value}).then(res => {
            const subPtrArr = res.children_wp.filter(y => y.obj_type === 'C_WP_PTR_S')
            const subsectionOptions = subPtrArr.map(x => (
                <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
            ))
            const locationOptions = subPtrArr.length
                ? []
                : res.children_wp.filter(y => y.obj_type === 'C_WP_ITM').map(x => (
                    <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
                ))
            this.setState({selectedPtr: value, subsectionOptions, locationOptions, selectedSubPtr: '', selectedItem: ''})
        })
    }

    handleSubSections = (value) => {
        const {getWorkpackagesDetail} = this.props.actions
        getWorkpackagesDetail({pk: value}).then(res => {
            const locArr = res.children_wp.filter(y => y.obj_type === 'C_WP_ITM')
            const locationOptions = locArr.map(x => (
                <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
            ))
            this.setState({selectedSubPtr: value, locationOptions, selectedItem: ''})
        })
    }

    handleLocations = (value) => {
        this.setState({selectedItem: value})
        this.initTblData(value)
    }

    radioChange = (event) => {
        const value = event.target.value
        this.setState({selectedStatus: value})
    }

    initTblData = (item) => {
        const {getWorkpackagesDetail} = this.props.actions
        getWorkpackagesDetail({pk: item}).then(res => {
            console.log('getWorkpackagesDetail: ', res)
            const tblData_1 = res.children_wp.filter(x => x.obj_type === 'C_WP_CEL'
                && x.extra_params.check_status && x.extra_params.check_status === 1
            ).map((x, i) => {
                const qualified_rate = this.getPercent(x.extra_params.qualified_rate, 1)
                return {
                    pk:x.pk,
                    key: i,
                    order_number: i + 1,
                    inspection_lot_content: x.name,
                    engineering_position: `GKA-${i + 70}`,
                    check_status: x.extra_params.check_status,
                    qualified_rate: qualified_rate,
                    tianbaoTime: x.extra_params.time,//moment(x.extra_params.time).format('LL'),
                    check_time: '//',
                    extra: x.extra_params,
                }
            })
            const tblData_2 = res.children_wp.filter(x => x.obj_type === 'C_WP_CEL'
                && x.extra_params.check_status && x.extra_params.check_status === 2
            ).map((x, i) => {
                const qualified_rate = this.getPercent(x.extra_params.qualified_rate, 1)
                return {
                    pk:x.pk,
                    key: i,
                    order_number: i + 1,
                    inspection_lot_content: x.name,
                    engineering_position: `GKA-${i + 70}`,
                    check_status: x.extra_params.check_status,
                    qualified_rate: qualified_rate,
                    tianbaoTime: x.extra_params.time,//moment(x.extra_params.time).format('LL'),
                    check_time: x.extra_params.check_time || '未知',
                    extra: x.extra_params,
                }
            })
            this.setState({tblData_1, tblData_2, sub_project_data: res})
        })
    }
    getPercent = (num, total) => {
        num = parseFloat(num)
        total = parseFloat(total)
        if (isNaN(num) || isNaN(total)) {
            return "-"
        }
        return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%")
    }
    handleLaunchTask = () => {
        const {sub_project_data} = this.state
        // this.props.setPage(page, initialData)
        this.props.setPage(1, sub_project_data)
    }

    //生成模态框内容
    getModalContent = (record,wk) => {
        console.log('getModalContent: ', record)
        const imgArr = record.extra_params.img || []
        const file = record.extra_params.file ? record.extra_params.file : ''
        const formItemLayout = {
            labelCol: { span: 8},
            wrapperCol: { span: 12},
        }
        return (
            <div>
                <div style={{marginBottom: 10}}>
                    现场记录:
                </div>
                {!imgArr.length ? '暂无图片' :
                    <Carousel autoplay>
                        {
                            imgArr.map(x => (
                                <div className="picDiv">
                                    <img className="picImg" src={`${SOURCE_API}${x}`} alt=""/>
                                </div>
                            ))
                        }
                    </Carousel>
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
