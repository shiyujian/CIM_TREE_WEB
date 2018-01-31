import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
import PerSearch from './PerSearch';
import { getUser } from '../../../_platform/auth';
import { WORKFLOW_CODE } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
//import {fileTypes} from '../../../_platform/store/global/file';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const EditableCell = ({ editable, value, onChange }) => (
          <div>
            {editable
              ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
              : value
            }
          </div>
        );

class SeedingAddition extends Component {

    static propTypes = {};

    // static layout = {
    //     labelCol: {span: 8},
    //     wrapperCol: {span: 16}
    // };
    state={
        dataSource:[],
        progress:0,
        isUploading: false,
        engineerName:'',
        resourceName:'',
        engineerNumber:'',
        engineerApprove:'',
        engineerTime:'',
        engineerBody:'',
        count:0,
    }
    equipment=[
        {
            title: '名称',
            dataIndex: 'extra_params.equipName',
            key: 'extra_params.equipName',
            render: (text, record) => this.renderColumns(text, record, 'extra_params.equipName'),
            // render:() => {
            //     return <Input onChange={(event)=>{
            //                     event=(event)?event:window.event;
            //                     const {
            //                         docs = [],
            //                         actions: {changeDocs}
            //                     } = this.props;
            //                     this.state.equipName = event.target.value;
            //                     changeDocs(docs);
            //                 }}
            //             />;
            // }
        }, {
            title: '规格',
            dataIndex: 'extra_params.equipFormat',
            key: 'extra_params.equipFormat',
            render: (text, record) => this.renderColumns(text, record, 'extra_params.equipFormat'),
        }, {
            title: '数量',
            dataIndex: 'extra_params.equipCount',
            key: 'extra_params.equipCount',
            render: (text, record) => this.renderColumns(text, record, 'extra_params.equipCount'),
        }, {
            title: '单位',
            dataIndex: 'extra_params.equipUnit',
            key: 'extra_params.equipUnit',
            render: (text, record) => this.renderColumns(text, record, 'extra_params.equipUnit'),
        }, {
            title: '产地',
            dataIndex: 'extra_params.equipPlace',
            key: 'extra_params.equipPlace',
            render: (text, record) => this.renderColumns(text, record, 'extra_params.equipPlace'),
        }, {
          title: '操作',
          dataIndex: 'extra_params.equipOperation',
          render: (text, record) => {
            const { editable } = record;
            return (
              <div>
                    <span>
                      <a style={{marginRight:'10'}}onClick={() => this.saveTable(record.key)}>
                        <Icon type='save' style={{fontSize:20}}/>
                      </a>
                      <a onClick={() => this.edit(record.key)}>
                        <Icon type='edit' style={{fontSize:20}}/>
                      </a>
                    </span>
              </div>
            );
          }
        }
    ];
    docCols = [
        {
            title:'名称',
            dataIndex:'name'
        }, {
            title:'备注',
            render: (doc) => {
                return <Input onChange={this.remark.bind(this, doc)}/>;
            }
        },{
            title:'操作',
            render: doc => {
                return (
                    <a onClick={this.remove.bind(this, doc)}>删除</a>
                );
            }
        }
    ];
    static layoutT = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };
    
    render() {
        const{
            additionVisible = false,
            docs = [],
            form: { getFieldDecorator },
        } = this.props;
        let {progress,isUploading,
            engineerName,resourceName,engineerNumber,engineerApprove,engineerTime,engineerFlow,dataSource,count} = this.state;
        let cacheData=this.state.dataSource.map(item => ({ ...item }));
        
        return (  
            <Modal title="新增文档"
                   width={920} visible={additionVisible}
                   closable={false}
                   footer={false}
                   maskClosable={false}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row gutter={24}>
                        <Col span={24} style={{paddingLeft:'2em'}}>
                            <Row gutter={15} >
                                <Col span={8}>
                                    <FormItem {...SeedingAddition.layoutT} label="单位工程:">
                                    {
                                        getFieldDecorator('unit', {
                                            rules: [
                                                { required: true, message: '请选择单位工程' }
                                            ]
                                        })
                                        (
                                            <Select onSelect={(value,option)=>{
                                                const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerName = value;
                                                    changeDocs(docs);
                                             }}
                                            >
                                                <Option value='第一阶段'>第一阶段</Option>
                                                <Option value='第二阶段'>第二阶段</Option>
                                                <Option value='第三阶段'>第三阶段</Option>
                                                <Option value='第四阶段'>第四阶段</Option>
                                            </Select>
                                        )
                                    }
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...SeedingAddition.layoutT} label="名称:">
                                    {
                                        getFieldDecorator('name', {
                                            rules: [
                                                { required: true, message: '请输入材料名称' }
                                            ]
                                        })
                                        (
                                            <Input  placeholder='材料名称' 
                                                onChange={(event)=>{
                                                    event=(event)?event:window.event;
                                                    const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.resourceName = event.target.value;
                                                    changeDocs(docs);
                                                }}
                                            />
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...SeedingAddition.layoutT} label="编号:">
                                    {
                                        getFieldDecorator('code', {
                                            rules: [
                                                { required: true, message: '请输入编号' }
                                            ]
                                        })
                                        (
                                            <Input  placeholder='系统自动编号'
                                                onChange={(event)=>{
                                                    event=(event)?event:window.event;
                                                    const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerNumber = event.target.value;
                                                    changeDocs(docs);
                                                }}
                                            />
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={8}>
                                    <FormItem  {...SeedingAddition.layoutT} label="审批单位:">
                                    {
                                        getFieldDecorator('reviewUnit', {
                                            rules: [
                                                { required: true, message: '请选择审核人员' }
                                            ]
                                        })
                                        (
                                            <Select placeholder='系统默认相应监理单位'
                                                onSelect={(value,option)=>{
                                                const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerApprove = value;
                                                    changeDocs(docs);
                                             }}
                                            >
                                                <Option value='第一公司'>第一公司</Option>
                                                <Option value='第二公司'>第二公司</Option>
                                            </Select>
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...SeedingAddition.layoutT} label="进场日期:">
                                    {
                                        getFieldDecorator('date', {
                                            rules: [
                                                { required: true, message: '请选择进场日期' }
                                            ]
                                        })
                                        (
                                            <DatePicker placeholder='材料进场日期'
                                                onChange={(data,dataString)=>{
                                                    const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerTime = dataString;
                                                    changeDocs(docs);
                                                    }}
                                            />
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...SeedingAddition.layoutT} label="施工部位:">
                                    {
                                        getFieldDecorator('site', {
                                            rules: [
                                                { required: true, message: '请输入施工部位' }
                                            ]
                                        })
                                        (
                                            <Input  placeholder='材料具体应用部位'
                                                onChange={(event)=>{
                                                    event=(event)?event:window.event;
                                                    const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerBody = event.target.value;
                                                    changeDocs(docs);
                                                }}
                                            />
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Table  rowSelection={this.rowSelectionAdd}
                                    dataSource={this.state.dataSource}
                                    columns={this.equipment}
                                    pagination={false}
                                    bordered rowKey="code" />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Button style={{ marginLeft: 20,marginRight: 10 }} type="primary" ghost
                                    onClick={this.handleAdd. bind(this)}>添加</Button>
                            <Button  type="primary" onClick={this.onDelete.bind(this)}>删除</Button>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} style={{marginTop: 16, height: 160}}>
                            <Dragger {...this.uploadProps}
                                     accept={fileTypes}
                                     onChange={this.changeDoc.bind(this)}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox"/>
                                </p>
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                                <p className="ant-upload-hint">
                                    支持 pdf、doc、docx 文件

                                </p>
                            </Dragger>
                            <Progress percent={progress} strokeWidth={5} />
                        </Col>
                    </Row>
                    <Row gutter={24} style={{marginTop: 15}}>
                        <Col span={24}>
                            <Table rowSelection={this.rowSelection}
                                   columns={this.docCols}
                                   dataSource={docs}
                                   bordered rowKey="uid"/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 15}}>
                        <Col span={10} >
                            <FormItem {...SeedingAddition.layoutT} label='审核人'>
                                {
                                    getFieldDecorator('dataReview', {
                                        rules: [
                                            { required: true, message: '请选择审核人员' }
                                        ]
                                    })
                                        (
                                        <PerSearch selectMember={this.selectMember.bind(this)} />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8} offset={4}>
                            <Checkbox >短信通知</Checkbox>
                        </Col>
                    </Row>
                    <FormItem>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button  onClick={this.cancel.bind(this)}>取消</Button>
                                <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">确认</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </Modal>
        );
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            currentcode = {},
            docs = [],
            actions: {
                createFlow,
                getWorkflowById,
                putFlow
            },
            location
            // actions: {toggleAddition, postDocument, getdocument,changeDocs}
        } = this.props;
        let user = getUser();//当前登录用户
        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {

                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let subject = [{
                    
                }];
                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: "物资管理苗木资料报批流程",
                    desc: "综合管理模块物资管理苗木资料报批流程",
                    code: WORKFLOW_CODE.苗木资料报批流程
                };
                let workflowdata = {
                    name: WORKFLOW_MAP.name,
                    description: WORKFLOW_MAP.desc,
                    subject: subject,
                    code: WORKFLOW_MAP.code,
                    creator: currentUser,
                    plan_start_time: null,
                    deadline: null,
                    "status": 2
                }
                createFlow({}, workflowdata).then((instance) => {
                    if (!instance.id) {
                        notification.error({
                            message: '数据提交失败',
                            duration: 2
                        })
                        return;
                    }
                    const { id, workflow: { states = [] } = {} } = instance;
                    const [{ id: state_id, actions: [action] }] = states;

                    getWorkflowById({ id: id }).then(instance => {
                        if (instance && instance.current) {
                            let currentStateId = instance.current[0].id;
                            let nextStates = getNextStates(instance, currentStateId);
                            let stateid = nextStates[0].to_state[0].id;

                            let postInfo = {
                                next_states: [{
                                    state: stateid,
                                    participants: [nextUser],
                                    deadline: null,
                                    remark: null
                                }],
                                state: instance.workflow.states[0].id,
                                executor: currentUser,
                                action: nextStates[0].action_name,
                                note: "提交",
                                attachment: null
                            }
                            let data = { pk: id };
                            //提交流程到下一步
                            putFlow(data, postInfo).then(rst => {
                                if (rst && rst.creator) {
                                    notification.success({
                                        message: '流程提交成功',
                                        duration: 2
                                    });
                                    this.setState({
                                        visible: false
                                    })
                                } else {
                                    notification.error({
                                        message: '流程提交失败',
                                        duration: 2
                                    });
                                    return;
                                }
                            });


                        }
                    });

                });
            }
        })
        
    }

    //选择人员
    selectMember(memberInfo) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    "username": memberValue[4],
                    "person_code": memberValue[1],
                    "person_name": memberValue[2],
                    "id": parseInt(memberValue[3]),
                }
            }
        } else {
            this.member = null
        }

        setFieldsValue({
            dataReview: this.member
        });
    }

    cancel() {
        const {
            actions: {toggleAddition,changeDocs}
        } = this.props;
        toggleAddition(false);
        changeDocs();
        this.setState({
            progress:0
        })
    }

    rowSelectionAdd = {
        onChange: (selectedRowKeys, selectedRows) => {
            const { actions: { selectDocuments } } = this.props;
            selectDocuments(selectedRows);
        },
    };
    rowSelection = {
        onChange: (selectedRowKeys) => {
            const {actions: {selectDocuments}} = this.props;
            selectDocuments(selectedRowKeys);
        },
    };

    

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: false,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            const valid = fileTypes.indexOf(file.type) >= 0;
            //console.log(file);
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
            }
            return valid;
            this.setState({ progress: 0 });
        },
    };

    changeDoc({file, fileList, event}) {
        const {
            docs = [],
            actions: {changeDocs}
        } = this.props;
        if (file.status === 'done') {
            changeDocs([...docs, file]);
        }
        this.setState({
            isUploading: file.status === 'done' ? false : true
        })
        if(event){
            let {percent} = event;
            if(percent!==undefined)
                this.setState({progress:parseFloat(percent.toFixed(1))});
        }
    }

    

    handleAdd(){
        const {count,dataSource } = this.state;
        const newData = {
          key:count,
          // equipName:this.state.equipName,
          // equipNumber:this.state.equipNumber,
        };
        console.log('newDate',newData)
        this.setState({
          dataSource: [...dataSource, newData],
          count: count + 1,
        });
        console.log('dataSource',dataSource)
    }

    onDelete(){
        const { selected } = this.props;
        console.log('selected',selected)
        const dataSource = [...this.state.dataSource];
        selected.map(rst => {
            this.setState({ dataSource: dataSource.filter(item => item.key !== rst.key) });
        });
    }
    renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}
          />
        );
    }
    handleChange(value, key, column) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.setState({ dataSource: newData });
        }
    }
    edit(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        const {
            docs = [],
            actions: {changeDocs}
        } = this.props;
        changeDocs(docs);
        if (target) {
          target.editable = true;
          this.setState({ dataSource: newData });
        }
    }
    saveTable(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = false;
          this.setState({dataSource: newData });
          this.cacheData = newData.map(item => ({ ...item }));
        }
    }

    remark(doc, event) {
        const {
            docs = [],
            actions: {changeDocs}
        } = this.props;
        doc.remark = event.target.value;
        changeDocs(docs);
    }

    remove(doc) {
        const {
            docs = [],
            actions: {changeDocs}
        } = this.props;
        changeDocs(docs.filter(d => d !== doc));
        this.setState({
            progress:0
        })
    }
    

}
export default Form.create()(SeedingAddition)