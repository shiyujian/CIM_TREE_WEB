import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification,Card
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
import PerSearch from '../Task/PerSearch';
import { getUser } from '../../../_platform/auth';
import { WORKFLOW_CODE } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { base, SOURCE_API, DATASOURCECODE } from '../../../_platform/api';
import queryString from 'query-string';
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

class OverallResourceRefill extends Component {

    static propTypes = {};

   
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
        TreatmentData:[],
        newFileLists: [],
    }
    equipment=[
        {
            title: '名称',
            dataIndex: 'extra_params.equipName',
            key: 'extra_params.equipName',
            render: (text, record) => this.renderColumns(text, record, 'extra_params.equipName'),
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
  
    columns1 = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '20%',
    }, {
        title: '文件名称',
        dataIndex: 'fileName',
        key: 'fileName',
        width: '45%',
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '20%',
        render: (text, record, index) => {
            return <div>
                <Popconfirm
                    placement="rightTop"
                    title="确定删除吗？"
                    onConfirm={this.deleteTreatmentFile.bind(this, record, index)}
                    okText="确认"
                    cancelText="取消">
                    <a>删除</a>
                </Popconfirm>
            </div>
        }
    }]
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
            <Card title='流程详情'>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row gutter={24}>
                        <Col span={24} style={{paddingLeft:'2em'}}>
                            <Row gutter={15} >
                                <Col span={8}>
                                    <FormItem {...OverallResourceRefill.layoutT} label="单位工程:">
                                    {
                                        getFieldDecorator('unit', {
                                            rules: [
                                                { required: true, message: '请选择单位工程' }
                                            ]
                                        })
                                        (
                                            <Select 
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
                                    <FormItem {...OverallResourceRefill.layoutT} label="名称:">
                                    {
                                        getFieldDecorator('name', {
                                            rules: [
                                                { required: true, message: '请输入材料名称' }
                                            ]
                                        })
                                        (
                                            <Input  placeholder='请输入材料名称' />
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...OverallResourceRefill.layoutT} label="编号:">
                                    {
                                        getFieldDecorator('code', {
                                            rules: [
                                                { required: true, message: '请输入编号' }
                                            ]
                                        })
                                        (
                                            <Input  placeholder='请输入编号'/>
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={8}>
                                    <FormItem  {...OverallResourceRefill.layoutT} label="审批单位:">
                                    {
                                        getFieldDecorator('reviewUnit', {
                                            rules: [
                                                { required: true, message: '请选择审核人员' }
                                            ]
                                        })
                                        (
                                            <Select 
                                            >
                                                <Option value='第一公司'>第一公司</Option>
                                                <Option value='第二公司'>第二公司</Option>
                                            </Select>
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...OverallResourceRefill.layoutT} label="进场日期:">
                                    {
                                        getFieldDecorator('date', {
                                            rules: [
                                                { required: true, message: '请选择进场日期' }
                                            ]
                                        })
                                        (
                                            <DatePicker placeholder='材料进场日期'/>
                                        )
                                    }
                                        
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...OverallResourceRefill.layoutT} label="施工部位:">
                                    {
                                        getFieldDecorator('site', {
                                            rules: [
                                                { required: true, message: '请输入施工部位' }
                                            ]
                                        })
                                        (
                                            <Input  placeholder='请输入施工部位'/>
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
                            <Dragger {...this.uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox"/>
                                </p>
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                                <p className="ant-upload-hint">
                                    支持 pdf、doc、docx 文件

                                </p>
                            </Dragger>
                            {/* <Progress percent={progress} strokeWidth={5} /> */}
                        </Col>
                    </Row>
                    <Row gutter={24} style={{marginTop: 15}}>
                        <Col span={24}>
                            <Table 
                                columns={this.columns1}
                                dataSource={this.state.TreatmentData}
                                pagination={true}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: 15}}>
                        <Col span={10} >
                            <FormItem {...OverallResourceRefill.layoutT} label='审核人'>
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
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">提交</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </Card>
                
            
        );
    }

    //上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: base + "/service/fileserver/api/user/files/",
        onChange: ({ file, fileList, event }) => {
            console.log('file',file)
            const status = file.status;
            const {TreatmentData } = this.state;
            let newdata = [];
            if (status === 'done') {
                // const { actions: { postUploadFilesAc } } = this.props;
                console.log('fileList',fileList)
                let length = TreatmentData.length
                
                TreatmentData.push({
                    index: length,
                    file_id: file.response.id,
                    fileName: file.name,
                    send_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    file_partial_url: '/media' + file.response.a_file.split('/media')[1],
                    download_url: '/media' + file.response.download_url.split('/media')[1],
                    a_file: '/media' + file.response.a_file.split('/media')[1],
                    misc:file.response.misc,
                    mime_type:file.response.mime_type,
                })
            
                this.setState({ TreatmentData: TreatmentData })

            }
        },
    };

    //删除文件表格中的某行
    deleteTreatmentFile = (record, index) => {
        const {
            TreatmentData
        }=this.state
        TreatmentData.splice(record.index,1)

        for(let i=0;i<TreatmentData.length;i++){
            if(i>=record.index){
                TreatmentData[i].index = TreatmentData[i].index - 1;
            }
        }
        this.setState({
            TreatmentData:TreatmentData
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            platform: { task = {} } = {},
            actions: {
                putFlow,
                postSubject
            },
            location
        } = this.props;
        const{
            TreatmentData,
            dataSource
        } = this.state
        let user = getUser();//当前登录用户
        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {

                const { state_id = '0' } = queryString.parse(location.search) || {};
                console.log('state_id', state_id)

                let me = this;
                const user = getUser();
                let executor = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let nextUser = {};
                
                nextUser = values.dataReview;
                // 获取流程的action名称
                let action_name = '';
                let nextStates = getNextStates(task, Number(state_id));
                console.log('nextStates',nextStates)
                let stateid = 0
                action_name = nextStates[0].action_name
                stateid = nextStates[0].to_state[0].id
                console.log('nextStates', nextStates)

                
                let note = action_name + '。';
                
                let state = task.current[0].id;
                let postdata = {
                    next_states: [
                        {
                            state: stateid,
                            participants: [nextUser],
                            dealine: null,
                            remark: null,
                        }
                    ],
                    state: state,
                    executor: executor,
                    action: action_name,
                    note: note,
                    attachment: null
                }

                let subject = [{
                    "dataSource":JSON.stringify(dataSource),
                    "TreatmentData":JSON.stringify(TreatmentData),
                    "unit":JSON.stringify(values.unit),
                    "name":JSON.stringify(values.name),
                    "code":JSON.stringify(values.code),
                    "reviewUnit":JSON.stringify(values.reviewUnit),
                    "date":JSON.stringify(values.date),
                    "site":JSON.stringify(values.site)
                }];

                let newSubject = {
                    subject:subject
                }
                let data = {
                    pk: task.id
                }
                postSubject(data,newSubject).then( value=>{
                    console.log('value',value)
                })

                putFlow(data,postdata).then( rst=>{
                    console.log('rst',rst)
                    if(rst && rst.creator){
                        notification.success({
                            message: '流程提交成功',
                            duration: 2
                        }) 
                        let to = `/selfcare`;
                        me.props.history.push(to)
                    } else {
                        notification.error({
                            message: '流程通过失败',
                            duration: 2
                        })
                        return
                    }
                })
             
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
export default Form.create()(OverallResourceRefill)