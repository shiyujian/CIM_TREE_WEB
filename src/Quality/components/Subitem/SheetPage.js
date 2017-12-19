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
import {actions as actions2} from '../../store/cells';
import {Row, Col, Button, Switch, Icon, Input, Table, Select, Form, Modal, Upload, message} from 'antd';
import {WORKFLOW_MAPS, SubItem_WordTemplate, previewWord_API,STATIC_UPLOAD_API,STATIC_DOWNLOAD_API} from '../../../_platform/api'
import moment from 'moment';
import {getUser} from '_platform/auth'
import './index.css'
import ImgFileUpload from '../ImgFileUpload.js'
const TextArea = Input.TextArea
const Option = Select.Option
const FormItem = Form.Item

@connect(
	state => {
		const {subitem = {}} = state.quality || {};
		return subitem;
	},
	dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        cellActions: bindActionCreators(actions2, dispatch),
	}),
)

class SheetPage extends Component{
    constructor(props) {
    	super(props);
    	this.state = {
            sub_project_data: null,
            sheetData: null,
            inspection_lot_data: null,
            average_qualified_rate: 0,
            isChecked: false,

            workUnitOptions: [],
            workUnit_c: '',
            projectManagerOptions: [],
            projectManager_c: '',
            qualityPrincipalOptions: [],
            qualityPrincipal_c: '',
            techPrincipalOptions: [],
            techPrincipal_c: '',
            supervisorUnitOptions: [],
            supervisorUnit_c: '',
            proSupervisingEngineerOptions: [],
            proSupervisingEngineer_c: '',

            subcontractUnitOptions: [],
            subcontractManagerOptions: [],
            subcontractTechPrincipalOptions: [],
            subcontractQualityPrincipalOptions: [],
            subcontractUnit_c: '',
            subcontractManager_c: '',
            subcontractTechPrincipal_c: '',
            subcontractQualityPrincipal_c: '',
            modalVisible: false,
            modalContent: null,
            allUsers:[],//全部人员
            uploadVisivle:false,//上传附件模态框
            fileList:[],
            img:[],//上传的图片
            peoples:null
        };
    }

    componentDidMount() {
        const {initialData: sub_project_data} = this.props
        const {getAllUsers} = this.props.actions;
        getAllUsers().then(rst=>{
            this.setState({allUsers:rst});
        })
        console.log('sub_project_data: ', sub_project_data)
        //设置附件
        if(sub_project_data.extra_params.file){
            this.setState({fileList:sub_project_data.extra_params.file})
        }
        if(sub_project_data.extra_params.img){
            let img = sub_project_data.extra_params.img || [];
            this.setState({img})
        }
        this.initOptions()
        this.setState({sub_project_data})
        this.initSheetData(sub_project_data)
    }

    render() {
        const {
            inspection_lot_data,
            average_qualified_rate,
            isChecked,
            workUnitOptions,
            projectManagerOptions,
            qualityPrincipalOptions,
            techPrincipalOptions,
            supervisorUnitOptions,
            proSupervisingEngineerOptions,
            subcontractUnitOptions,
            subcontractManagerOptions,
            subcontractTechPrincipalOptions,
            subcontractQualityPrincipalOptions,
            modalVisible,
            modalContent,
            fileList,
        } = this.state
        console.log(fileList);
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
                            label="单位工程名称"
                        >
                            {
                                getFieldDecorator('unitEngineeringName_d', {
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
                            {getFieldDecorator('projectManager', {
                                rules: [{ required: true, message: '请输入项目经理' }],
                            })(
                                <Input className="sheetPageSpanInput" onChange={this.handleProjectManager}/>
                                   
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="质检负责人"
                        >
                            {getFieldDecorator('qualityPrincipal', {
                                rules: [{ required: true, message: '请输入质检负责人' }],
                            })(
                                <Input className="sheetPageSpanInput" onChange={this.handleQualityPrincipal}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="项目技术负责人"
                        >
                            {getFieldDecorator('techPrincipal', {
                                rules: [{ required: true, message: '请输入项目技术负责人' }],
                            })(
                                <Input className="sheetPageSpanInput" onChange={this.handleTechPrincipal}/>
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
                            {getFieldDecorator('subcontractUnit', {
                                rules: [{ required: isChecked, message: '请选择分包单位' }],
                            })(
                                <Input className="sheetPageSpanInput" disabled={!isChecked} onChange={this.handleSubcontractUnit} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8" style={{textAlign: 'left'}}>
                        <Switch
                            style={{margin: '5px 0 0 5px'}}
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="cross" />}
                            checked={isChecked}
                            onChange={this.handleSwitch}
                        />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包项目经理"
                        >
                            {getFieldDecorator('subcontractManager', {
                                rules: [{ required: isChecked, message: '请输入分包项目经理' }],
                            })(
                                <Input className="sheetPageSpanInput" disabled={!isChecked} onChange={this.handleSubcontractManager}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包项目技术负责人"
                        >
                            {getFieldDecorator('subcontractTechPrincipal', {
                                rules: [{ required: isChecked, message: '请输入分包项目技术负责人' }],
                            })(
                                <Input className="sheetPageSpanInput" disabled={!isChecked} onChange={this.handleSubcontractTechPrincipal}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="分包质检负责人"
                        >
                            {getFieldDecorator('subcontractQualityPrincipal', {
                                rules: [{ required: isChecked, message: '请输入分包质检负责人' }],
                            })(
                                <Input className="sheetPageSpanInput" disabled={!isChecked} onChange={this.handleSubcontractQualityPrincipal}/>
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
                                initialValue: average_qualified_rate + '%',
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
                            label="施工方"
                        >
                            {getFieldDecorator('workUnitRemark', {
                                rules: [{ required: false, message: '请填写施工方备注' }],
                            })(
                                <TextArea
                                    autosize={{minRows: 2, maxRows: 2}}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout2}
                            label="监理方"
                        >
                            {getFieldDecorator('supervisorUnitRemark', {
                                rules: [{ required: false, message: '请填写监理方备注' }],
                            })(
                                <TextArea disabled autosize={{minRows: 2, maxRows: 2}} />
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
                                rules: [{ required: true, message: '请填写施工单位检查意见' }],
                            })(
                                <TextArea autosize={{minRows: 4, maxRows: 4}} />
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
                                rules: [{ required: false, message: '请填写监理单位检查意见' }],
                            })(
                                <TextArea disabled autosize={{minRows: 4, maxRows: 4}} />
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
                            {getFieldDecorator('workUnit', {
                                rules: [{ required: true, message: '请选择施工单位' }],
                            })(
                                <Select className="sheetPageSpanSelect" onSelect={this.handleWorkUnit}>
                                    {workUnitOptions}
                                </Select>
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
                            {getFieldDecorator('supervisorUnit', {
                                rules: [{ required: true, message: '请选择监理单位' }],
                            })(
                                <Select className="sheetPageSpanSelect" onSelect={this.handleSupervisorUnit}>
                                    {supervisorUnitOptions}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} className="ColSpan8">
                        <FormItem
                            {...formItemLayout}
                            label="专业监理工程师"
                        >
                            {getFieldDecorator('proSupervisingEngineer', {
                                rules: [{ required: true, message: '请选择专业监理工程师' }],
                            })(
                                <Select className="sheetPageSpanSelect" onSelect={this.handleProSupervisingEngineer}>
                                    {   
                                        this.state.peoples &&
                                        this.generateAllUsers2(this.state.peoples,'监理')
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <ImgFileUpload img={this.state.img} onChange={this.handleFormChange}/>
                <div style={{margin: '10px 0 5px 0', textAlign: 'right'}}>
                    <Button type="primary" onClick={() => {this.setState({uploadVisivle:true})}}>上传附件</Button>
                    <Button type="primary" style={{marginLeft: 20}} onClick={this.handlePreviewForm}>预览表单</Button>
                    <Button type="primary" htmlType="submit" style={{marginLeft: 20}} onClick={this.handleSubmit}>确认发起</Button>
                </div>
                {
                    this.state.uploadVisivle &&
                        <Modal
                            okText='确认'
                            visible={true}
                            onOk={this.ok.bind(this)}
                            onCancel={() => this.setState({uploadVisivle: false})}>
                            <div style={{ width: '450px' }}>
                                    <Upload
                                        style={{ margin: '10px' }}
                                        showUploadList={true}
                                        beforeUpload={this.beforeUpload.bind(this)}
                                    >
                                        <Button style={{ marginRight: '10px' }}>上传相关文件</Button>
                                    </Upload>
                                    <div style={{marginTop:'5px'}}>已上传文件:</div>
                                    { 
                                        fileList.map((item,index) => {
                                            return (<div><a href='#'>{item.name}</a>
                                                        <span style={{marginLeft:'20px',color:'red'}}
                                                            onClick={ () => {
                                                                const {deleteStaticFile} = this.props.actions;
                                                                deleteStaticFile({id:fileList[index].id});
                                                                //let {fileList} = this.state;
                                                                fileList.splice(index,1);
                                                                this.setState({fileList});
            
                                                            }}
                                                        >x</span>
                                                </div>)
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

    //获取某个单位下的所有人员，包括其一级zi子单位
    getAllUsersByOrgcode = async(orgcode) => {
        const {getOrgTreeByCode,fetchUsersByOrgCode} = this.props.cellActions
        let org_code = orgcode
        let rst = await getOrgTreeByCode({code:orgcode});
        rst.children.map((item) => {
            org_code += `,${item.code}`        
        })
        let res = await fetchUsersByOrgCode({org_code:org_code})
        return res;
    }

    //上传图片组件变化
    handleFormChange = (changedFields) => {
        console.log(changedFields);
        let img = [];
        changedFields.img && changedFields.img.value.map(item => {
            img.push(item.a_file)
        })
        this.setState({img})
      }
    //上传附件ok
    ok(){
        this.setState({uploadVisivle:false});
    }
    //beforeupload
    beforeUpload(file){
        const {uploadStaticFile} = this.props.actions;
        const formdata = new FormData();
        formdata.append('a_file',file);
        formdata.append('name',file.name);
        //debugger;
       // console.log(file,formdata.get('a_file'));
        uploadStaticFile({},formdata).then(rst=>{
           console.log(rst);
            if(rst.id){
                message.success('上传成功');
                let {fileList} = this.state;
                fileList.push(rst);
                console.log(fileList);
                this.setState({fileList});
            }else{
                message.error('上传失败');
            }
        });
        return false;
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

    initSheetData = async (sub_project_data) => {
        const res = sub_project_data
        const sheetData = []
        const inspection_lot_data = res.children_wp.filter(x => x.obj_type === 'C_WP_CEL'
            && x.extra_params.check_status && x.extra_params.check_status === 2
        ).map((x, i) => {
            const qualified_rate = this.getPercent(x.extra_params.qualified_rate, 1)
            return {
                key: i,
                order_number: i + 1,
                name: x.name,
                check_status: '验收通过',
                qualified_rate: qualified_rate,
                qualified_result: qualified_rate >= 60 ? '合格' : '不合格',
            }
        })
        // const qualified_count = count_data.reduce((sum, item) => sum + item.extra_params.qualified_count, 0)
        const average_qualified_rate = inspection_lot_data.reduce((sum, item) => sum = sum + item.qualified_rate, 0) / inspection_lot_data.length
        this.setState({sheetData, inspection_lot_data, average_qualified_rate})
        const {actions: {getWorkpackagesDetail}, form: {setFieldsValue}} = this.props
        let partition = await getWorkpackagesDetail({pk: sub_project_data.pk}).then(res => res.parent)
        if (partition.obj_type === 'C_WP_PTR_S') partition = await getWorkpackagesDetail({pk: partition.pk}).then(res => res.parent)
        let unitEngineering = await getWorkpackagesDetail({pk: partition.pk}).then(res => res.parent)
        if (unitEngineering.obj_type === 'C_WP_UNT_S') unitEngineering = await getWorkpackagesDetail({pk: unitEngineering.pk}).then(res => res.parent)
        const project = await getWorkpackagesDetail({pk: unitEngineering.pk}).then(res => res.parent)
        setFieldsValue({
            projectName_d: project.name,
            unitEngineeringName_d: unitEngineering.name,
            subPositionEngineering_d: partition.name,
            subItemEngineering_d: sub_project_data.name,
            inspectionLotNumber_d: sub_project_data.children_wp.length,
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
		this.handleAcceptance(fieldValues)
    }

    handleAcceptance = async (fieldValues) => {
        const {createWorkflow, setWorkpackagesDetail, logWorkflowEvent, fetchUserDetail} = this.props.actions
        const {sub_project_data, average_qualified_rate} = this.state
        const userData = getUser()
        const tianbaoTime = moment(Date.now()).format('L')
        const deepCopiedFieldValues = JSON.parse(JSON.stringify(fieldValues))
        const workflow_instance_data = {
            name: `分项工程质量验收${String(Date.now())}`,
            description: `分项工程质量验收${String(Date.now())}`,
            subject: [
                {
                    itmWp: JSON.stringify({pk: sub_project_data.pk, name: sub_project_data.name, code: sub_project_data.code}),
                    ptrWp: JSON.stringify({pk: sub_project_data.parent.pk, name: sub_project_data.parent.name, code: sub_project_data.parent.code}),
                    extra: JSON.stringify(Object.assign(deepCopiedFieldValues, {
                        projectManager_c: this.state.projectManager_c,
                        qualityPrincipal_c: this.state.qualityPrincipal_c,
                        techPrincipal_c: this.state.techPrincipal_c,
                        workUnit_c: this.state.workUnit_c,
                        supervisorUnit_c: this.state.supervisorUnit_c,
                        proSupervisingEngineer_c:  this.state.proSupervisingEngineer_c,
                        subcontractUnit_c: this.state.subcontractUnit_c,
                        subcontractManager_c: this.state.subcontractManager_c,
                        subcontractTechPrincipal_c: this.state.subcontractTechPrincipal_c,
                        subcontractQualityPrincipal_c: this.state.subcontractQualityPrincipal_c,
                    })),
                    pk:sub_project_data.pk,
                    code:sub_project_data.code,
                    obj_type:sub_project_data.obj_type,
                    obj_type_hum:sub_project_data.obj_type_hum
                }
            ],
            code: WORKFLOW_MAPS.QUALITY_ITEM.code,
            creator: {
                id: userData.id,
                username: userData.username,
                person_name: userData.name,
                person_code: userData.code,
            },
            plan_start_time: null,
            deadline: null,
            status: 2
        }
        const workflow_res = await createWorkflow({}, workflow_instance_data)
        console.log('createWorkflow', workflow_res)
        if (!workflow_res.id) return
        // return
        const userDetail = await fetchUserDetail({pk: fieldValues.proSupervisingEngineer})
        const current_state_id = workflow_res.current[0].id
        const next_state_id = workflow_res.workflow.transitions.find(x => x.from_state === current_state_id).to_state
        const logevent_data = {
            //提交时可通过next_state字段同时指定下一节点的执行人，或者通过【添加流程实例执行人】接口分开指定也行,如果不指定next_states的执行人，
            //则next_states不传或者传空,通常情况下，退回时直接退回到原来的执行人，此时不用传值
            next_states: [
                {
                    state: next_state_id,
                    participants: [{
                        // id: 15, username: 'QTK_0303', person_name: '王广珍', person_code: 'QTK_0103',
                        id: userDetail.id,
                        username: userDetail.username,
                        person_name: userDetail.account.person_name,
                        person_code: userDetail.account.person_code,
                    }],
                    deadline: null,
                    remark: null
                }
            ],
            state: current_state_id,
            executor: {
                id: userData.id,
                username: userData.username,
                person_name: userData.name,
                person_code: userData.code,
            },
            action: '提交',     // 必须是state.action中的一项
            note: fieldValues.workUnitCheckOpinion,
            attachment: null // 附件，空填null
        }
        await logWorkflowEvent({pk: workflow_res.id}, logevent_data).then(event_res => {
            console.log('logWorkflowEvent', event_res)
        })

        const count_data = sub_project_data.children_wp.filter(x => x.obj_type === 'C_WP_CEL'
            && x.extra_params.check_status && x.extra_params.check_status === 2 )
        const qualified_count = count_data.reduce((sum, item) => sum + item.extra_params.qualified_count, 0)
        const total_count = count_data.reduce((sum, item) => sum + item.extra_params.total_count, 0)
        const new_extra = {
            check_status : 1,
            tianbaoTime : tianbaoTime,
            average_qualified_rate : average_qualified_rate,
            workflow: workflow_res.id,
            total_count: total_count, //cehck_status为2的子节点的total_count的和
            qualified_count: qualified_count, //cehck_status为2的子节点的qualified_count的和
            qualified_rate: qualified_count / total_count, //qyalified除以total
            check_time: '', //监理方审批时的日期，字符串
        }
        const extra_params = Object.assign(sub_project_data.extra_params, new_extra)
        const workpackage_data = {
            // version: sub_project_data.version,
            version: 'A',
            extra_params: extra_params
        }
        const package_res = await setWorkpackagesDetail({pk: sub_project_data.pk}, workpackage_data)
        console.log('setWorkpackagesDetail: ', package_res)
        //更新上传的文件
        const {updateWpData} = this.props.actions;
        let data = {};
        let data_list = [];
        let extra = {};
        let {fileList,img} = this.state;
        let extra_file_list = fileList.map(item => {
            return {
                    a_file:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    name:item.name,
                    download_url:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    misc:item.misc,
                    mime_type:item.mime_type   
                }
        })
        extra['file'] = extra_file_list;
        extra['img'] = img;
        let temp = {
            pk:sub_project_data.pk,
            extra_params:extra,
        }
        data_list.push(temp);
        data['data_list'] = data_list;
        await updateWpData({},data).then(rst => {
            console.log(rst);
        })
        this.props.setPage(0, null)
        message.info("操作成功")
    }

    initOptions = () => {
        const { targetDanwei } = this.props
        console.log('initOptions', targetDanwei)
        if (!targetDanwei) return
        const workUnit_f = targetDanwei.extra_params.unit.filter(x => x.type === '施工单位')
        const workUnitOptions = workUnit_f ? workUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        const supervisorUnit_f = targetDanwei.extra_params.unit.filter(x => x.type === '监理单位')
        const supervisorUnitOptions = supervisorUnit_f ? supervisorUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        this.setState({workUnitOptions, subcontractUnitOptions: workUnitOptions, supervisorUnitOptions})
    }

    handleSwitch = (checked) => {
        this.setState({isChecked: checked})
    }
    handleWorkUnit = async (value, option) => {
        const {form: {setFieldsValue}, actions: {fetchOrgDetail, fetchUsersByOrgCode}} = this.props
        setFieldsValue({workUnit_d: option.props.children});
        const org_res = await fetchOrgDetail({code: value})
        if (!org_res.pk) return
        const orgs = org_res.children.map(x => x.code).join(',') + ',' + value
        const user_res = await fetchUsersByOrgCode({org_code: orgs})
        console.log('fetchUsersByOrgCode1: ', user_res)
        const projectManagerOptions = user_res
            .filter(x => x.groups.some(y => y.name === '项目经理'))
            .map(x => <Option key={String(x.id)}>{x.account.person_name}</Option>)
        const qualityPrincipalOptions = user_res
            .filter(x => x.groups.some(y => y.name === '质量员'))
            .map(x => <Option key={String(x.id)}>{x.account.person_name}</Option>)
        const techPrincipalOptions = user_res
            .filter(x => x.groups.some(y => y.name === '总工'))
            .map(x => <Option key={String(x.id)}>{x.account.person_name}</Option>)
        this.setState({
            projectManagerOptions,
            qualityPrincipalOptions,
            techPrincipalOptions,
            workUnit_c: option.props.children,
        })
    }
    handleQualityPrincipal = (e) => {
        const {form: {setFieldsValue}} = this.props
        setFieldsValue({qualityPrincipal_d: e.target.value});
        this.setState({qualityPrincipal_c: e.target.value})
    }
    handleTechPrincipal = (e) => {
        const {form: {setFieldsValue}} = this.props
        setFieldsValue({techPrincipal_d: e.target.value});
        this.setState({techPrincipal_c: e.target.value})
    }
    handleSupervisorUnit = async (value, option) => {
        let peoples = await this.getAllUsersByOrgcode(value)
        /*const {actions: {fetchOrgDetail, fetchUsersByOrgCode}} = this.props
        const org_res = await fetchOrgDetail({code: value})
        if (!org_res.pk) return
        const orgs = org_res.children.map(x => x.code).join(',') + ',' + value
        const user_res = await fetchUsersByOrgCode({org_code: orgs})
        console.log('fetchUsersByOrgCode2: ', user_res)
        const proSupervisingEngineerOptions = user_res
            .filter(x => x.groups.some(y => y.name === '专业监理工程师'))
            .map(x => <Option key={String(x.id)}>{x.account.person_name}</Option>)
        this.setState({
            proSupervisingEngineerOptions,
            supervisorUnit_c: option.props.children,
        })*/
        this.setState({supervisorUnit_c: option.props.children,peoples})
    }
    handleProjectManager = (e) => {
        console.log(e.target.value);
        this.setState({projectManager_c: e.target.value})
    }
    handleProSupervisingEngineer = (value, option) => {
        this.setState({proSupervisingEngineer_c: option.props.children})
    }

    handleSubcontractUnit = (e) => {
        /*const {actions: {fetchOrgDetail, fetchUsersByOrgCode}} = this.props
        const org_res = await fetchOrgDetail({code: value})
        if (!org_res.pk) return
        const orgs = org_res.children.map(x => x.code).join(',') + ',' + value
        const user_res = await fetchUsersByOrgCode({org_code: orgs})
        console.log('fetchUsersByOrgCode3: ', user_res)
        const subcontractManagerOptions = user_res.map(x => <Option key={String(x.id)}>{x.account.person_name}</Option>)
        this.setState({
            subcontractManagerOptions,
            subcontractTechPrincipalOptions: subcontractManagerOptions,
            subcontractQualityPrincipalOptions: subcontractManagerOptions,
            subcontractUnit_c: option.props.children,
        })*/
        this.setState({ subcontractUnit_c: e.target.value})
    }
    handleSubcontractManager = (e) => {
        this.setState({subcontractManager_c: e.target.value})
    }
    handleSubcontractTechPrincipal = (e) => {
        this.setState({subcontractTechPrincipal_c: e.target.value})
    }
    handleSubcontractQualityPrincipal = (e) => {
        this.setState({subcontractQualityPrincipal_c: e.target.value})
    }

    handlePreviewForm = () => {
		const { getFieldsValue } = this.props.form
        const { exchangeWordFile } = this.props.actions
        const { inspection_lot_data, average_qualified_rate } = this.state
		const values = getFieldsValue()
        console.log(values);
        const deepCopiedFieldValues = JSON.parse(JSON.stringify(values))
        const fieldValues = Object.assign(deepCopiedFieldValues, {
            projectManager_c: this.state.projectManager_c,
            qualityPrincipal_c: this.state.qualityPrincipal_c,
            techPrincipal_c: this.state.techPrincipal_c,
            workUnit_c: this.state.workUnit_c,
            supervisorUnit_c: this.state.supervisorUnit_c,
            proSupervisingEngineer_c:  this.state.proSupervisingEngineer_c,
            subcontractUnit_c: this.state.subcontractUnit_c,
            subcontractManager_c: this.state.subcontractManager_c,
            subcontractTechPrincipal_c: this.state.subcontractTechPrincipal_c,
            subcontractQualityPrincipal_c: this.state.subcontractQualityPrincipal_c,
        })
        console.log(fieldValues)
        const d1 = this.parseCNDate('')
        const d2 = this.parseCNDate('')
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
            average_rate: average_qualified_rate || '',
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
        console.log(pageData);
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
    //生成监理审批人
    generateAllUsers2(data,filter){
        let arr= [];
        data.forEach((user,index)=>{
            if(filter)
            {
                let group = '';
                user.groups.map(item => {
                    group += item.name;
                })
                if(group.indexOf(filter) === -1){
                    return;
                }
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key ={index} value={user.id}>{user.account.person_name}</Select.Option>);
            }
          //  console.log(user.account.person_name);
        });
        //console.log(arr);
        return arr;
    }
}

export default Form.create({})(SheetPage)
