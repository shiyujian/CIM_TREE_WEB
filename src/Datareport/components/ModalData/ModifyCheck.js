import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/ModalData';
import {actions as platformActions} from '_platform/store/global';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col,DatePicker,Select,notification } from 'antd';
import WorkflowHistory from '../WorkflowHistory'
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import {getUser} from '_platform/auth';
import Preview from '../../../_platform/components/layout/Preview';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 
import moment from 'moment';


const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(
    state => {
        const { datareport: { ModalData = {} } = {}, platform } = state;
        return { ...ModalData, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
    })
)
export default class ModifyCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            option: 1,
        };
    }
    async componentWillReceiveProps() {
        const { wk } = this.props

        let dataSources = JSON.parse(wk.subject[0].data)
      
        let dataSource = [];
        dataSources.map(item => {
            dataSource.push(item)
        })
        this.setState({ dataSource, wk });
    }

    async componentDidMount() {
        const { wk } = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk });
        const { actions: {
            getScheduleDir,
            postScheduleDir,
        } } = this.props;
        let topDir = await getScheduleDir({ code: 'the_only_main_code_ModalCheck' });
        if (!topDir.obj_type) {
            let postData = {
                name: '数据报送的顶级节点',
                code: 'the_only_main_code_datareport',
                "obj_type": "C_DIR",
                "status": "A",
            }
            topDir = await postScheduleDir({}, postData);
        }
        this.setState({ topDir });
    }



    //提交
    async submit() {
        if (this.state.option === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("modify_check_visbile", false,'submit');
        notification.info({message:"操作成功"});
    }

    //通过
    async passon() {
        const { dataSource, wk, topDir } = this.state;
        const { actions: {
            logWorkflowEvent,
            putDocument,
            getScheduleDir,
            postScheduleDir,
            getWorkpackagesByCode
        } } = this.props;
       
        let unit = dataSource[0].unit;
      
        
        let project = dataSource[0].project;
        let code = 'datareport_modaldatadoc';
        //get workpackage by unit's code 
        let workpackage = await getWorkpackagesByCode({ code:unit.code });

        let postDirData = {
            "name": '模型信息目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            related_objects: [{
                pk: workpackage.pk,
                code: workpackage.code,
                obj_type: workpackage.obj_type,
                rel_type: 'modaldata_wp_dirctory', // 自定义，要确保唯一性
            }],
            "parent": { "pk": topDir.pk, "code": topDir.code, "obj_type": topDir.obj_type }
        }
        let dir = await getScheduleDir({ code: code });
        //no such directory
        if (!dir.obj_type) {
            dir = await postScheduleDir({}, postDirData);
        }

        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({ pk: wk.id }, { state: wk.current[0].id, action: '通过', note: '同意', executor: executor, attachment: null });

        //prepare the data which will store in database
        const docData = [];   //asure the code of every document only
        let all = [];
        dataSource.forEach((item, index) => {
         
            let newdata = {
                name: item.fdbMode.name,
                obj_type: "C_DOC",
                status: 'A',
                profess_folder: { code: dir.code, obj_type: 'C_DIR' },
                basic_params: {
                    files: [
                        {
                            "a_file":item.fdbMode.a_file,
                            "name": item.fdbMode.name,
                            "download_url": item.fdbMode.download_url,
                            "misc": "file",
                            "mime_type": item.fdbMode.mime_type
                          },
                          {
                            "a_file": item.tdbxMode.a_file,
                            "name": item.tdbxMode.name,
                            "download_url": item.tdbxMode.download_url,
                            "misc": "file",
                            "mime_type": item.tdbxMode.mime_type
                          },
                          {
                            "a_file": item.attributeTable.a_file,
                            "name": item.attributeTable.name,
                            "download_url": item.attributeTable.download_url,
                            "misc": "file",
                            "mime_type": item.attributeTable.mime_type
                          }
                    ]
                },
                extra_params: {
                    code:item.code,
                    coding:item.coding,
                    filename:item.modelName,
                    submittingUnit:item.submittingUnit,
                    modelDescription:item.modelDescription,
                    modeType:item.modeType,
                    unit:item.unit,
                    project:item.project,
                    reportingTime:item.reportingTime,
                    reportingName:item.reportingName,
                }
            }
            all.push(putDocument({ code: dataSource[index].code }, newdata))    
            //删除旧附件 todo
        });
        Promise.all(all)
            .then(rst => {
               
                notification.success({message:'修改文档成功！'});
            })

    }
   
    // //不通过
    // async reject() {
    //     const { wk } = this.props
    //     const { actions: { deleteWorkflow } } = this.props
    //     await deleteWorkflow({ pk: wk.id })
    // }

      //不通过
      async reject() {
        const { wk, } = this.state;
        const { actions: { logWorkflowEvent, } } = this.props;
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;

        await logWorkflowEvent( // step3: 提交填报 [post] /instance/{pk}/logevent/ 参数
            {
                pk: wk.id
            }, {
                state: wk.current[0].id,
                executor: executor,
                action: '退回',
                note: '不通过',
                attachment: null
            }
        );
        notification.success({
            message: '操作成功！',
            duration: 2
        });
    }

    onChange(e) {
        this.setState({ option: e.target.value })
    }

     //预览
     handlePreview(index,name){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index][name]
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }

    render() {


        const columns = [{
            title: '序号',
            dataIndex: 'index',
           
        }, {
            title: '模型编码',
            dataIndex: 'coding'
        }, {
            title: '项目/子项目名称',
            dataIndex: 'project.name'
        }, {
            title: '单位工程',
            dataIndex: 'unit.name'
        }, {
            title: '模型名称',
            dataIndex: 'modelName'
        }, {
            title: '提交单位',
            dataIndex: 'submittingUnit'
        }, {
            title: '模型描述',
            dataIndex: 'modelDescription'
        }, {
            title: '模型类型',
            dataIndex: 'modeType'
        }, {
            title: 'fdb模型',
            dataIndex: 'fdbMode',
            render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,record.index-1,'fdbMode')}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.fdbMode.a_file}`}>下载</a>
                    </span>)
            }

        }, {
            title: 'tdbx模型',
            dataIndex: 'tdbxMode',
            render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,record.index-1,'tdbxMode')}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.tdbxMode.a_file}`}>下载</a>
                    </span>)
            }

        }, {
            title: '属性表',
            dataIndex: 'attributeTable',
            render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,record.index-1,'attributeTable')}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.attributeTable.a_file}`}>下载</a>
                    </span>)
            }


        }, {
            title: '上报时间',
            dataIndex: 'reportingTime'
        }, {
            title: '上报人',
            dataIndex: 'reportingName'
        }];


        return (
            <Modal
                title="模型信息更改审批表"
                footer={null}
                visible={true}
                width={1280}
                onCancel={this.cancel.bind(this)}

            >
                <h1 style={{ textAlign: 'center', marginBottom: 20 }}>变更审核</h1>
                <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                    columns={columns}
                    dataSource={this.state.dataSource}

                    bordered />
                <Row>
                    <Col span={2}>
                        <span>审查意见：</span>
                    </Col>
                    <Col span={4}>
                        <RadioGroup onChange={this.onChange.bind(this)} value={this.state.option}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={2}>不通过</Radio>
                        </RadioGroup>
                    </Col>
                   
                    <Col span={2} push={14}>
                        <Button type='primary' onClick={this.submit.bind(this)}>
                            确认提交
                        </Button>
                        <Preview />
                    </Col>
                </Row>
                {
                    this.state.wk && <WorkflowHistory wk={this.state.wk} />
                }
            </Modal>
        )
    }

    cancel() {
        this.props.closeModal("modify_check_visbile", false)
    }
}