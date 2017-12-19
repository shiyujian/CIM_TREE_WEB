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
import {getUser} from '_platform/auth'
import {Table, Select, Radio} from 'antd';
// import moment from 'moment';
import './index.css';

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
	}),
)

export class SubitemTable2 extends Component{

    constructor(props){
    	super(props)
    	this.state = {
            selectedRow: null,
            tblData_1: [],
            tblData_2: [],
            sectionOptions: [],
            subsectionOptions: [],
            selectedPtr: '',
            selectedSubPtr: '',
            selectedStatus: 1,
        }
    }

    componentWillReceiveProps(nextProps) {
        const {ptrData} = nextProps
        const sectionOptions = ptrData.map(x => (
            <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
        ))
        this.setState({ sectionOptions })
        if (this.props.ptrData !== nextProps.ptrData) {
            this.setState({ selectedPtr: '', selectedSubPtr: '' })
        }
    }

    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'order_number',
            width: '10%',
        },{
            title: '分项工程名称',
            dataIndex: 'subItemName',
            width: '40%',
            render: (text, record) => {
                return (
                    <div className="ellipsisTd">
                        {text}
                    </div>
                )
            }
        },{
            title: '提交时间',
            dataIndex: 'tianbaoTime',
            width: '20%',
        },{
            title: '审核时间',
            dataIndex: 'check_time',
            width: '20%',
        },{
            title: '当前状态',
            dataIndex: 'check_status',
            width: '10%',
            render: (text, record) => (
                <span> {text === 1 ? '待验收' : text === 2 ? '已验收' : '-'} </span>
            )
        }]
        const {
            sectionOptions, subsectionOptions,
            selectedPtr, selectedSubPtr,
            selectedStatus, tblData_1, tblData_2,
        } = this.state

        const dataSource = selectedStatus === 1 ? tblData_1 : selectedStatus === 2 ? tblData_2 : []
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
                    <RadioGroup className="radioGroup" onChange = {this.radioChange} value={selectedStatus}>
                        <RadioButton value={1}>待验收</RadioButton>
                        <RadioButton value={2}>已验收</RadioButton>
                    </RadioGroup>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    rowClassName={this.rowClassName}
                    className="defectTable"
                    onRowClick={this.onTblRowClick}
                    pagination={{ pageSize: 20 }}
                />
            </div>
        )
    }

    onTblRowClick = (record) => {
        this.setState({selectedRow: record})
        this.handleLaunchTask(record)
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
            if (!subPtrArr.length) {
                this.initTblData(value)
            }
            this.setState({selectedPtr: value, subsectionOptions, selectedSubPtr: ''})
        })
    }

    handleSubSections = (value) => {
        this.setState({selectedSubPtr: value})
        this.initTblData(value)
    }

    radioChange = (event) => {
        const value = event.target.value
        this.setState({selectedStatus: value})
    }

    initTblData = (ptrValue) => {
        const {getWorkpackagesDetail} = this.props.actions
        getWorkpackagesDetail({pk: ptrValue}).then(res => {
            console.log('getWorkpackagesDetail: ', res)
            const tblData_1 = res.children_wp.filter(x => x.obj_type === 'C_WP_ITM'
                && x.extra_params.check_status && x.extra_params.check_status === 1
            ).map((x, i) => {
                return {
                    key: x.pk,
                    order_number: i + 1,
                    subItemName: x.name,
                    check_status: x.extra_params.check_status,
                    tianbaoTime: x.extra_params.tianbaoTime,
                    check_time: '//',
                    workflow: x.extra_params.workflow,
                    extra: x.extra_params,
                    version: x.version,
                }
            })
            const tblData_2 = res.children_wp.filter(x => x.obj_type === 'C_WP_ITM'
                && x.extra_params.check_status && x.extra_params.check_status === 2
            ).map((x, i) => {
                return {
                    key: x.pk,
                    order_number: i + 1,
                    subItemName: x.name,
                    check_status: x.extra_params.check_status,
                    tianbaoTime: x.extra_params.tianbaoTime,
                    check_time: x.extra_params.check_time || '未知',
                    workflow: x.extra_params.workflow,
                    extra: x.extra_params,
                    version: x.version,
                }
            })
            this.setState({tblData_1, tblData_2})
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

    handleLaunchTask = (record) => {
        console.log('handleLaunchTask', record)
        if (!record.workflow) return
        const {getWorkflow} = this.props.actions
        if (record.check_status === 2) {
            const pageData = Object.assign({}, {subItemRecord: record})
            this.props.setPage(1, pageData)
        } else {
            const userData = getUser()
            getWorkflow({pk: record.workflow}).then(res => {
                let executor = null
                try {
                    executor = res.current[0].participants[0].executor
                    if (executor && userData.id === executor.id) {
                        const pageData = Object.assign(res, {subItemRecord: record})
                        this.props.setPage(1, pageData)
                    }
                } catch (e) { }
            })
        }
        // this.props.setPage(page, initialData)
        // this.props.setPage(1, sub_project_data)
    }
}
