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
import { SOURCE_API } from '../../../_platform/api';
import {actions} from '../../store/defect';
import {Table, Select, Button, Modal} from 'antd';
import './index.css';
import moment from 'moment';

const Option = Select.Option;

@connect(
	state => {
		const {defect = {}} = state.quality || {}
		return defect
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

export class DefectTable extends Component{

    constructor(props){
    	super(props)
    	this.state = {
            selectedRow: null,
            tblData: [],
            sectionOptions: [],
            subsectionOptions: [],
            // locationOptions: [],
            selectedPtr: '',
            selectedSubPtr: '',
            // selectedLoc: '',
            picModalVisible: false,
            selectedPic: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        const {ptrData} = nextProps
        const sectionOptions = ptrData.map(x => (
            <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
        ))
        this.setState({ sectionOptions })
        if (this.props.ptrData !== nextProps.ptrData) {
            this.setState({
                selectedPtr: '', selectedSubPtr: '',
            })
        }
    }

    render() {
        const columns = [{
            title: '缺陷编号',
            dataIndex: 'defectNum',
            width: '10%',
        },{
            title: '内容',
            dataIndex: 'content',
            width: '20%',
            render: (text, record) => {
                return (
                    <div className="ellipsisTd">
                        {record.content}
                    </div>
                )
            }
        },{
            title: '所属单位工程',
            dataIndex: 'engineering',
            width: '20%',
        },{
            title: '工程部位',
            dataIndex: 'position',
            width: '15%',
        },{
            title: '整改截止期限',
            dataIndex: 'deadline',
            width: '15%',
        },{
            title: '状态',
            dataIndex: 'status',
            width: '10%',
        },{
            title: '是否过期',
            dataIndex: 'overdue',
            width: '10%',
        }]
        const {
            selectedRow, tblData: dataSource, picModalVisible, selectedPic,
            sectionOptions, subsectionOptions,
            // locationOptions,selectedLoc,
            selectedPtr, selectedSubPtr,
        } = this.state
        const strArr = selectedPic.split('/')
        const modalTitle = strArr[strArr.length - 1]
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
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    rowClassName={this.rowClassName}
                    className="defectTable"
                    onRowClick={this.onTblRowClick}
                    pagination={{ pageSize: 5 }}
                />
                { selectedRow ? this.getDetailContent(selectedRow) : null }
                {
                    picModalVisible &&
                    <Modal
                        width={800}
                        height={600}
                        title={modalTitle}
                        visible={true}
                        onCancel={() => {this.setState({selectedPic: '', picModalVisible: false})}}
                        footer={null}
                    >
                        <img src={`${SOURCE_API}${selectedPic}`} alt="" style={{width: '100%', height: '100%'}}/>
                    </Modal>
                }
            </div>
        )
    }

    handleSearch = (value) => {
        console.log('search ', value)
    }

    onTblRowClick = async (record) => {
        const {setDefectData} = this.props.actions
        await this.getWorkflowInfo(record)
        this.setState({selectedRow: record})
        setDefectData({defectData: record})
    }

    rowClassName = (record) => {
        const { selectedRow } = this.state
        return selectedRow
            ? record.key === selectedRow.key
                ? 'tableRowSelected'
                : ''
            : ''
    }
    //得到流程信息
    async getWorkflowInfo(selectedRow){
        const {getWorkflowInstance,getWorkflowDetail} = this.props.actions;
        let rst1 = await getWorkflowInstance({id:selectedRow.key})
        let rst = await getWorkflowDetail({pk:rst1[0].id})
        console.log(rst)
        rst.history.map((item,index) => {
            if(index === 0){
                console.log(item.records[0].log_on);
                selectedRow.created_on = item ? moment(item.records[0].log_on).format('YYYY-MM-DD hh:mm:ss') : ''
                selectedRow.zhenggai = ''
                selectedRow.check = ''
            }else if(index === 1){
                selectedRow.zhenggai = item.records[0] ? moment(item.records[0].log_on).format('YYYY-MM-DD hh:mm:ss') : ''
                selectedRow.check = ''
            }else if(index === 2){
                selectedRow.check = item.records[0] ? moment(item.records[0].log_on).format('YYYY-MM-DD hh:mm:ss') : ''
            } 
        }) 
    }
     getDetailContent = (selectedRow) => {
        const recordOnSpotBefore = this.getRecordOnSpotBeforeChange(selectedRow)
        const recordOnSpotAfter = this.getRecordOnSpotAfterChange(selectedRow)   
        return (
            <div className="defectDetailDiv">
                <div>详情：{selectedRow.content}</div>
                <div>整改前现场记录:</div>
                    {recordOnSpotBefore}
                <div>整改后现场记录:</div>
                    {recordOnSpotAfter}
                <div>上报时间:<span className="timeSpan"> {selectedRow.created_on}</span></div>
                <div>整改时间:<span className="timeSpan"> {selectedRow.zhenggai}</span></div>
                <div>审核时间:<span className="timeSpan"> {selectedRow.check}</span></div>
                <div className="buttonDiv">
                    <Button type="primary" onClick={this.handleWorkContactSheet}>质量缺陷整改工作联系单</Button>
                    <Button type="primary" className="buttonRight" onClick={this.handleNotificationReplySheet}>质量缺陷整改通知回复单</Button>
                </div>
            </div>
        )
    }

    getRecordOnSpotBeforeChange = (selectedRow) => {
        const picData = selectedRow.rectify_before.images || []
        return (
            <div className="defectPicDiv">
                {picData.map(x => (
                    <img className="defectPicImg" src={`${SOURCE_API}${x}`} alt=""
                        onClick={() => {this.setState({selectedPic: x, picModalVisible: true})}}
                    />
                ))}
            </div>
        )
    }

    getRecordOnSpotAfterChange = (selectedRow) => {
        const picData = selectedRow.rectify_after.images || []
        return (
            <div className="defectPicDiv">
                {picData.map(x => (
                    <img className="defectPicImg" src={`${SOURCE_API}${x}`} alt=""
                        onClick={() => {this.setState({selectedPic: x, picModalVisible: true})}}
                    />
                ))}
            </div>
        )
    }

    handleWorkContactSheet = () => {
        this.props.setPage(1, this.state.selectedRow, 0)
    }

    handleNotificationReplySheet = () => {
        this.props.setPage(1, this.state.selectedRow, 1)
    }

    handleSections = async (value) => {
        const {getWorkpackagesDetail, fetchDefectDataByLoc} = this.props.actions
        const wrk_res = await getWorkpackagesDetail({pk: value})
        const subPtrArr = wrk_res.children_wp.filter(y => y.obj_type === 'C_WP_PTR_S')
        const subsectionOptions = subPtrArr.map(x => (
            <Option key={String(x.pk)} code={String(x.code)} extra={x}>{x.name}</Option>
        ))
        const defectArr = await fetchDefectDataByLoc({keyword: encodeURI(wrk_res.name)}).catch(() => alert())
        const tblData = defectArr.filter(x => x.project_location.pk === value).map(x => {
            let status_type = ['待确认','整改中','未通过','已整改'];
            return {
                key: String(x.id),
                defectNum: x.id,
                content: x.risk_content,
                engineering: x.project_location.project_name,
                position: x.project_location.location_name,
                deadline: x.deadline,
                status: status_type[x.status],
                overdue: x.overdue ? '是' : '否',
                lng: x.coordinate.longitude,
                lat: x.coordinate.latitude,
                rectify_before: x.rectify_before || {},
                rectify_after: x.rectify_after || {}
            }
        })
        console.log(tblData)
        this.setState({
            selectedPtr: value, subsectionOptions, selectedSubPtr: '', tblData, selectedRow: null,
        })
    }

    handleSubSections = async (value) => {
        const {getWorkpackagesDetail, fetchDefectDataByLoc} = this.props.actions
        const wrk_res = await getWorkpackagesDetail({pk: value})
        const defectArr = await fetchDefectDataByLoc({keyword: wrk_res.name})
        const tblData = defectArr.filter(x => x.project_location.pk === value).map(x => {
            let status_type = ['待确认','整改中','未通过','已整改'];
            return {
                key: String(x.id),
                defectNum: x.id,
                content: x.risk_content,
                engineering: x.project_location.project_name,
                position: x.project_location.location_name,
                deadline: x.deadline,
                status: status_type[x.status],
                overdue: x.overdue ? '是' : '否',
                lng: x.coordinate.longitude,
                lat: x.coordinate.latitude,
                rectify_before: x.rectify_before || {},
                rectify_after: x.rectify_after || {}
            }
        })
        this.setState({
            selectedSubPtr: value, tblData,
            selectedRow: null,
        })
    }
}
