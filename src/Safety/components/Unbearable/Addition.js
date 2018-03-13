import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
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

export default class Addition extends Component {

    static propTypes = {};
    state={
        progress:0,
        isUploading: false,
        engineerNumber:'',
        engineerName:'',
        engineerApprove:'',
        engineerTheme:'',
        dataSource:[],
        count:0,

    }
    render() {
        const{
            additionVisible = false,
            docs = []
        } = this.props;
        let {progress,isUploading,engineerName,engineerNumber,engineerApprove,engineerTheme,dataSource,count,
             equipName,equipNumber
            } = this.state;
        let cacheData=this.state.dataSource.map(item => ({ ...item }));
        let arr = [ 
            <Row gutter={24}>
                <Col span={12}>
                <Form>
                    <FormItem style={{marginLeft:'100',marginRight:'50'}}  {...Addition.layoutT} label="审核人:">
                        <Select>
                            <Option value='第一经理'>第一经理</Option>
                            <Option value='第二经理'>第二经理</Option>
                        </Select> 
                    </FormItem>
                </Form>
                </Col>
                <Col span={12}>
                    <Checkbox style={{marginRight:'150'}}>短信通知</Checkbox>
                    <Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>
                </Col>
            </Row>
        ];
        let footer = isUploading ? null : arr;
        return (
			<Modal title="新增文档"
				   width={920} visible={additionVisible}
                   closable={false}
                   footer={footer}
                   maskClosable={false}>
				<Form>
                    <Row gutter={24}>
                        <Col span={24} style={{paddingLeft:'3em'}}>
                            <Row gutter={15} >
                                <Col span={10}>
                                    <FormItem   {...Addition.layoutT} label="工程名称:">
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
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem {...Addition.layoutT} label="主题:">
                                        <Input  placeholder="请输入..." 
                                                onChange={(event)=>{
                                                    event=(event)?event:window.event;
                                                    const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerTheme = event.target.value;
                                                    changeDocs(docs);
                                                }}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={10}>
                                    <FormItem  {...Addition.layoutT} label="文档类型:">
                                        <Select onSelect={(value,option)=>{
                                                const {
                                                        docs = [],
                                                        actions: {changeDocs}
                                                    } = this.props;
                                                    this.state.engineerApprove = value;
                                                    changeDocs(docs);
                                             }}
                                        >
                                              <Option value='水环境'>水环境</Option>
                                              <Option value='空气环境'>空气环境</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem {...Addition.layoutT} label="编号:">
                                        <Input  placeholder="请输入..." 
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
                                    </FormItem>
                                </Col>
                            </Row>
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
								<p>点击或者拖拽开始上传</p>
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
				</Form>

			</Modal>
        );
    }

    rowSelection = {
        onChange: (selectedRowKeys) => {
            const {actions: {selectDocuments}} = this.props;
            selectDocuments(selectedRowKeys);
        },
    };
    
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
    docCols = [
        {
            title:'名称',
            dataIndex:'name'
        }, {
            title:'备注',
            render: (doc) => {
                return <Input onChange={this.remark.bind(this, doc)}/>;
            }
        }, {
            title:'操作',
            render: doc => {
                return (
					<a onClick={this.remove.bind(this, doc)}>删除</a>
                );
            }

        }
    ];

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

    save() {
        const {
            currentcode = {},
            docs = [],
            actions: {toggleAddition, postDocument, getdocument,changeDocs}
        } = this.props;
        console.log('docs',docs)
        const promises = docs.map(doc => {
            const response = doc.response;
            let files=DeleteIpPort(doc);
            doc.engineer=this.state.engineerName;
            doc.number=this.state.engineerNumber;
            doc.approve=this.state.engineerApprove;
            doc.theme=this.state.engineerTheme;
            return postDocument({}, {
                code: `${currentcode.code}_${response.id}`,
                name: doc.name,
                obj_type: 'C_DOC',
                profess_folder: {
                    code: currentcode.code, obj_type: 'C_DIR',
                },
                basic_params: {
                    files:[files]
                },
                extra_params: {
                    engineer:doc.engineer,
                    number:doc.number,
                    approve:doc.approve,
                    theme:doc.theme,
                    company:doc.company,
                    time:doc.time,
                    remark: doc.remark,
                    type: doc.type,
                    lasttime: doc.lastModifiedDate,
                    style: '生态环境',
                    submitTime: moment.utc().format(),
                    children:doc.children,
                },
            });
        });
        message.warning('新增文件中...');
        Promise.all(promises).then(rst => {
            message.success('新增文件成功！');
            changeDocs();
            toggleAddition(false);
            getdocument({code: currentcode.code});
        });
        this.setState({
            progress:0
        })
    }
    static layoutT = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };

}