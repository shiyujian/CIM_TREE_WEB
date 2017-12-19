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
import {Row, Col, Button, Switch, Icon, Input, Table, Form, Modal,message} from 'antd';
import {SubItem_WordTemplate, previewWord_API,STATIC_DOWNLOAD_API} from '../../../_platform/api'
import moment from 'moment';
import './index.css'
import ImgShow from '../ImgShow.js'
import {getNextStates} from '../../../_platform/components/Progress/util';
import WorkflowHistory from '../WorkflowHistory'
const TextArea = Input.TextArea
const FormItem = Form.Item

@connect(
	state => {
		const {subitem = {}} = state.quality || {};
		return subitem;
	},
	dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        cellActions:bindActionCreators(actions1, dispatch)
	}),
)

class SheetPage2 extends Component{
    constructor(props) {
    	super(props);
    	this.state = {
            inspection_lot_data: null,
            isRecordChecked: false,
            modalVisible: false,
            modalContent: null,
            uploadVisivle:false,//上传附件模态框
            fileList:[],
            img:[],
            wk:null
        };
    }

    componentDidMount() {
        const {initialData: sub_project_data} = this.props
        // this.initOptions()
        this.setState({sub_project_data})
        this.initSheetData(sub_project_data)
    }

    render() {
        const {
            inspection_lot_data,
            isRecordChecked,
            modalVisible,
            modalContent,
        } = this.state
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 12},
            wrapperCol: { span: 12},
        }
        const formItemLayout2 = {
            labelCol: { span: 8},
            wrapperCol: { span: 16},
        }
        return (
            <Form className="wrapperDiv">
                <h2> 分项工程质量验收记录 </h2>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="工程名称"
                        >
                            {
                                getFieldDecorator('projectName_d', {
                                    rules: [{required: false}],
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="单位工程名称"
                        >
                            {
                                getFieldDecorator('unitEngineeringName_d', {
                                    rules: [{required: false}],
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="施工单位"
                        >
                            {
                                getFieldDecorator('workUnit_d', {
                                    rules: [{required: false}]
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="检验批数"
                        >
                            {
                                getFieldDecorator('inspectionLotNumber_d', {
                                    rules: [{required: false}]
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分部工程名称"
                        >
                            {
                                getFieldDecorator('subPositionEngineering_d', {
                                    rules: [{required: false}]
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分项工程"
                        >
                            {
                                getFieldDecorator('subItemEngineering_d', {
                                    rules: [{required: false}]
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="项目经理"
                        >
                            {getFieldDecorator('projectManager_c', {
                                rules: [{ required: false, message: '请选择项目经理' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="质检负责人"
                        >
                            {getFieldDecorator('qualityPrincipal_c', {
                                rules: [{ required: false, message: '请选择质检负责人' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="项目技术负责人"
                        >
                            {getFieldDecorator('techPrincipal_c', {
                                rules: [{ required: false, message: '请选择项目技术负责人' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包单位"
                        >
                            {getFieldDecorator('subcontractUnit_c', {
                                rules: [{ required: false, message: '请选择分包单位' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8" style={{textAlign: 'left'}}>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包项目经理"
                        >
                            {getFieldDecorator('subcontractManager_c', {
                                rules: [{ required: false, message: '请选择分包项目经理' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包项目技术负责人"
                        >
                            {getFieldDecorator('subcontractTechPrincipal_c', {
                                rules: [{ required: false, message: '请选择分包项目技术负责人' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包质检负责人"
                        >
                            {getFieldDecorator('subcontractQualityPrincipal_c', {
                                rules: [{ required: false, message: '请选择分包质检负责人' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{textAlign: 'center', margin: '10px 0 5px 0'}}>
                    <Table
                        bordered
                        columns={this.columns}
                        dataSource={inspection_lot_data}
                        pagination={{pageSize: 8}}
                    />
                </div>
                <Row gutter={8} style={{margin: '10px 0 10px 0'}}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout2}
                            label="平均合格率"
                        >
                            {getFieldDecorator('average_qualified_rate', {
                                rules: [{ required: false }],
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <h3>质量控制资料</h3>
                <Row gutter={8} style={{margin: '10px 0 10px 0'}}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout2}
                            label="施工方备注"
                        >
                            {getFieldDecorator('workUnitRemark', {
                                rules: [{ required: false, message: '请填写施工方备注' }],
                            })(
                                <TextArea disabled autosize={{minRows: 2, maxRows: 2}} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout2}
                            label="监理方备注"
                        >
                            {getFieldDecorator('supervisorUnitRemark', {
                                rules: [{ required: !isRecordChecked, message: '请填写监理方备注' }],
                            })(
                                <TextArea disabled={isRecordChecked} autosize={{minRows: 2, maxRows: 2}} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8} style={{margin: '10px 0 10px 0'}}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout2}
                            label={(
                                <div style={{display: 'inline-block'}}>
                                    <p> 施工单位 </p>
                                    <p> 检查意见 </p>
                                </div>
                            )}
                        >
                            {getFieldDecorator('workUnitCheckOpinion', {
                                rules: [{ required: false, message: '请填写施工单位检查意见' }],
                            })(
                                <TextArea disabled autosize={{minRows: 4, maxRows: 4}} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout2}
                            label={(
                                <div style={{display: 'inline-block'}}>
                                    <p> 监理单位 </p>
                                    <p> 验收结论 </p>
                                </div>
                            )}
                        >
                            {getFieldDecorator('supervisorUnitOpinion', {
                                rules: [{ required: !isRecordChecked, message: '请填写监理单位检查意见' }],
                            })(
                                <TextArea disabled={isRecordChecked} autosize={{minRows: 4, maxRows: 4}} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <h3> 参加验收单位 </h3>
                <Row gutter={8} style={{margin: '10px 0 10px 0'}}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="施工单位"
                        >
                            {getFieldDecorator('workUnit_c', {
                                rules: [{ required: false, message: '请选择施工单位' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="项目技术负责人"
                        >
                            {
                                getFieldDecorator('techPrincipal_d', {
                                    rules: [{required: false}]
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="质检员"
                        >
                            {
                                getFieldDecorator('qualityPrincipal_d', {
                                    rules: [{required: false}]
                                })(
                                    <Input disabled className="sheetPageSpanInput"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="监理单位"
                        >
                            {getFieldDecorator('supervisorUnit_c', {
                                rules: [{ required: false, message: '请选择监理单位' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="专业监理工程师"
                        >
                            {getFieldDecorator('proSupervisingEngineer_c', {
                                rules: [{ required: false, message: '请选择专业监理工程师' }],
                            })(
                                <Input disabled className="sheetPageSpanInput"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={3} className="ColSpan8">
                        <label style={{color:'rgba(0, 0, 0, 0.85)'}}>现场图片:</label>
                    </Col>
                    <Col span={21} className="ColSpan8">
                        <ImgShow style={{marginLeft:'10px'}} img={this.state.img}/>
                    </Col>
                </Row>
                <WorkflowHistory wk={this.state.wk}/>
                <div style={{margin: '10px 0 5px 0', textAlign: 'right'}}>
                    <Button type="primary" onClick={() => {this.setState({uploadVisivle:true})}}>查看附件</Button>
                    <Button type="primary" style={{marginLeft:'20px'}} onClick={this.handlePreviewForm}>预览表单</Button>
                    {!isRecordChecked &&
                        <span>
                            <Button type="danger" style={{marginLeft: 20}} onClick={this.reject}>不予通过</Button>
                            <Button type="primary" htmlType="submit" style={{marginLeft: 20}} onClick={this.handleSubmit}>审核通过</Button>
                        </span>
                    }
                </div>
                {
                    this.state.uploadVisivle &&
                        <Modal
                            okText='确认'
                            visible={true}
                            onOk={() => this.setState({uploadVisivle: false})}
                            onCancel={() => this.setState({uploadVisivle: false})}>
                            <div style={{ width: '450px' }}>
                                    <div style={{marginTop:'5px'}}>已上传文件:</div>
                                    { 
                                        this.state.fileList.map(item => {
                                            return (<p><a href={`${STATIC_DOWNLOAD_API}${item.download_url}`}>{item.name}</a></p>)           
                                        })
                                    }
                            </div>
                        </Modal>
                }
                {modalVisible &&
                    <Modal
                        title="分项验收表单预览"
                        width={1200}
                        height={800}
                        visible={true}
                        footer={null}
                        maskClosable={false}
                        onCancel={() => {this.setState({modalVisible: false, modalContent: null})}}
                    >
                        {this.getModalContent(modalContent)}
                        <div style={{textAlign: 'right', marginTop: 10}}>
                            <Button type="primary" onClick={() => {
                                document.querySelector('#root').insertAdjacentHTML('afterend',
                                '<iframe src="'+`${modalContent.download_url}`+'" style="display: none"></iframe>')
                            }}>打印</Button>
                        </div>
                    </Modal>
                }
            </Form>
        )
    }
    //不予通过
    reject = () => {
        const {updateWpData,deleteWorkflow,getWorkflow} = this.props.actions;
        const {sub_project_data} = this.state
        let data = {};
        let data_list = [];
        let extra = {};
        extra['check_status'] = 0;
        extra['img'] = '';
        let temp = {
            pk:sub_project_data.subItemRecord.key,
            extra_params:extra,
        }
        data_list.push(temp);
        data['data_list'] = data_list;
        updateWpData({},data).then(rst => {
            console.log(rst);
            deleteWorkflow({pk:sub_project_data.id}).then(rst => {
                message.info('操作成功，请重新发起验收')
                this.props.setPage(0, null)
                message.info("操作成功")
            })
        })


    }
    getModalContent = (modalContent) => {
        return (
            <iframe style={{width:"100%", height:"700px"}}
                src={`${previewWord_API}${modalContent.a_file}`}
            >
                <p>您的浏览器不支持  iframe 标签。</p>
            </iframe>
        )
    }

    initSheetData = (sub_project_data) => {
        const {getWorkpackagesDetail} = this.props.actions
        const {getWorkflow} = this.props.cellActions
        console.log('initSheetData: ', sub_project_data)
        const isRecordChecked = sub_project_data.subItemRecord.check_status === 1 ? false : true
        const fieldValues = isRecordChecked
            ? sub_project_data.subItemRecord.extra.sheetData
            : JSON.parse(sub_project_data.subject[0].extra)
        const {setFieldsValue} = this.props.form
        setFieldsValue({...fieldValues})
        getWorkpackagesDetail({pk: sub_project_data.subItemRecord.key}).then(res => {
            //设置附件
            if(res.extra_params.file){
                this.setState({fileList:res.extra_params.file})
            }
            if(res.extra_params.img){
                let img = res.extra_params.img || [];
                this.setState({img})
            }
            let pk = res.extra_params.workflowid || res.extra_params.workflow_id || res.extra_params.workflow || res.extra_params.wfid;
			//显示流程详情
			getWorkflow({pk:pk}).then( res => {
				this.setState({wk:res})
			})  
            const inspection_lot_data = res.children_wp.filter(x => x.obj_type === 'C_WP_CEL'
                && x.extra_params.check_status && x.extra_params.check_status === 2
            ).map((x, i) => {
                // const qc_counts = x.basic_params.qc_counts
                // const qualified_rate = qc_counts && this.getPercent(qc_counts.fine, qc_counts.checked)
                const qualified_rate = this.getPercent(x.extra_params.qualified_rate, 1)
                return {
                    key: i,
                    order_number: i + 1,
                    name: x.name,
                    check_status: '验收通过',
                    qualified_rate: qualified_rate,
                    qualified_result: qualified_rate >= 60 ? '合格' : '不合格'
                }
            })
            this.setState({inspection_lot_data, isRecordChecked})
        })
    }

    getPercent = (num, total) => {
        num = parseFloat(num)
        total = parseFloat(total)
        if (isNaN(num) || isNaN(total)) {
            return "-"
        }
        return total <= 0 ? 0 : (Math.round(num / total * 10000) / 100.00)
    }

    columns = [{
        title: '序号',
        dataIndex: 'order_number',
        width: '10%',
    },{
        title: '已验收检验批',
        dataIndex: 'name',
        width: '35%',
    },{
        title: '施工单位自检情况',
        children: [{
            title: '合格率',
            dataIndex: 'qualified_rate',
            width: '15%',
            render: (text) => (<span>{text + '%'}</span>)
        },{
            title: '检验结论',
            dataIndex: 'qualified_result',
            width: '15%',
        }]
    },{
        title: '监理验收意见',
        dataIndex: 'check_status',
        width: '25%',
    }]

    handleSubmit = (e) => {
		const { validateFields } = this.props.form
		let fieldValues = []
		validateFields({}, (err, values) => {
			if (err) return
			fieldValues = values
		})
		if (fieldValues.length === 0) return
        console.log('handleSubmit: ', fieldValues)
        console.log('sub_project_data: ', this.state.sub_project_data)
		this.handleAcceptance(fieldValues)
    }

    handleAcceptance = (fieldValues) => {
        const {setWorkpackagesDetail, logWorkflowEvent} = this.props.actions
        const {sub_project_data} = this.state
        const workflow_res = sub_project_data
        const check_time = moment(Date.now()).format('L')
        const new_extra = {
            check_status : 2,
            check_time : check_time,
            sheetData: Object.assign(JSON.parse(sub_project_data.subject[0].extra), fieldValues)
        }
        const extra_params = Object.assign(sub_project_data.subItemRecord.extra, new_extra)
        const workpackage_data = {
            version: 'A',
            extra_params: extra_params
        }

        if (!workflow_res.id) return
        const current_state_id = workflow_res.current[0].id
        const logevent_data = {
            state: current_state_id,
            executor: workflow_res.current[0].participants[0].executor,
            action: '通过',     // 必须是state.action中的一项
            note: fieldValues.supervisorUnitOpinion,
            attachment: null // 附件，空填null
        }
        logWorkflowEvent({pk: workflow_res.id}, logevent_data).then(event_res => {
            console.log('logWorkflowEvent', event_res)
            setWorkpackagesDetail({pk: sub_project_data.subItemRecord.key}, workpackage_data).then(package_res => {
                console.log('setWorkpackagesDetail: ', package_res)
                this.props.setPage(0, null)
                message.info("操作成功")
            })
        })
    }

    handlePreviewForm = () => {
		const { getFieldsValue } = this.props.form
        const { exchangeWordFile } = this.props.actions
        const { sub_project_data, inspection_lot_data } = this.state
		const values = getFieldsValue()
        const isRecordChecked = sub_project_data.subItemRecord.check_status === 1 ? false : true
        const extra = sub_project_data.subItemRecord.extra
        const oldValues = isRecordChecked
            ? sub_project_data.subItemRecord.extra.sheetData
            : JSON.parse(sub_project_data.subject[0].extra)
        const fieldValues = Object.assign(oldValues, values)
        const d1 = this.parseCNDate(extra.tianbaoTime)
        const d2 = this.parseCNDate(extra.check_time)
        let lots = inspection_lot_data.map((x, i) => {
            return {
                index: x.order_number,
                name: x.name,
                opinion: x.check_status,
                rate: x.qualified_rate + '%',
                result: x.qualified_result,
            }
        })
        while (lots.length < 10) {
            lots.push({
                index: '',
                name: '',
                opinion: '',
                rate: '',
                result: '',
            })
        }
        const pageData = {
            pN: fieldValues.projectName_d || '',
            uEN: fieldValues.unitEngineeringName_d || '',
            wU: fieldValues.workUnit_c || '',
            scU: fieldValues.subcontractUnit_c || '',
            sPN: fieldValues.subPositionEngineering_d || '',
            sIN: fieldValues.subItemEngineering_d || '',
            lotNum: fieldValues.inspectionLotNumber_d || '',
            pM: fieldValues.projectManager_c || '',
            pT: fieldValues.techPrincipal_d || '',
            pQ: fieldValues.qualityPrincipal_d || '',
            scPM: fieldValues.subcontractManager_c || '',
            scPT: fieldValues.subcontractTechPrincipal_c || '',
            scPQ: fieldValues.subcontractQualityPrincipal_c || '',
            lots: lots,
            average_rate: fieldValues.average_qualified_rate || '',
            wM: fieldValues.workUnitRemark || '',
            sM: fieldValues.supervisorUnitRemark || '',
            wO: fieldValues.workUnitCheckOpinion || '',
            wQ: fieldValues.qualityPrincipal_d || '',
            wT: fieldValues.techPrincipal_d || '',
            sO: fieldValues.supervisorUnitOpinion || '',
            sPS: fieldValues.proSupervisingEngineer_c || '',
            ty1: d1[0],
            tm1: d1[1],
            td1: d1[2],
            ty2: d2[0],
            tm2: d2[1],
            td2: d2[2],
            doc_template_url: SubItem_WordTemplate,
        }
        exchangeWordFile({}, pageData).then(exfile_res  => {
            const modalContent = JSON.parse(exfile_res)
            this.setState({
                modalVisible: true,
                modalContent: modalContent,
            })
        })
    }

    // String -> [String]
    parseCNDate = (date) => {
        let pd = []
        try {
            const t_date = date.trim()
            if (!t_date.includes('年') && !t_date.includes('月') && !t_date.includes('日')) {
                throw 'invalid CN Date'
            }
            let t = date.split('年')//2017,10月20日
            pd.push(t[0])
            t = t[1].split('月')//10,20日
            pd.push(t[0])
            t = t[1].split('日')
            pd.push(t[0])
        } catch (e) {
            pd = ['','','']
        }
        return pd
    }
}

export default Form.create({})(SheetPage2)
