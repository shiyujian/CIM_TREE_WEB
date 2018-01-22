import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
//import {fileTypes} from '../../../_platform/store/global/file';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';

export default class Addition extends Component {

    static propTypes = {};

    // static layout = {
    //     labelCol: {span: 8},
    //     wrapperCol: {span: 16}
    // };
    state={
        progress:0,
        isUploading: false
    }
    render() {
        const{
            additionVisible = false,
            docs = []
        } = this.props;
        let {progress,isUploading} = this.state;
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
                                    <FormItem   {...Addition.layoutT} label="单位工程:">
                                     <Select>
                                          <Option value='第一阶段'>第一阶段</Option>
                                          <Option value='第二阶段'>第二阶段</Option>
                                     </Select>
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem {...Addition.layoutT} label="编号:">
                                        <Input />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={20}>
                                    <FormItem  {...Addition.layout} label="审批单位:">
                                        <Select>
                                              <Option value='第一公司'>第一公司</Option>
                                              <Option value='第二公司'>第二公司</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Table  rowSelection={this.rowSelectionAdd}
                                    dataSource={docs}
                                    columns={this.equipment}
                                    className='foresttable'
                                    bordered rowKey="code" />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Button  style={{ marginLeft: 20,marginRight: 10 }} type="primary" ghost>添加</Button>
                            <Button  type="primary" ghost>删除</Button>
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

    equipment=[
        {
            title: '设备名称',
            dataIndex: 'equipName',
            key: 'equipName',
        }, {
            title: '规格型号',
            dataIndex: 'equipNumber',
            key: 'equipNumber',
        }, {
            title: '数量',
            dataIndex: 'equipCount',
            key: 'equipCount',
        }, {
            title: '进场日期',
            dataIndex: 'equipTime',
            key: 'equipTime',
        }, {
            title: '技术状况',
            dataIndex: 'equipMoment',
            key: 'equipMoment'
        },{
            title: '备注',
            dataIndex: 'equipRemark',
            key: 'equipRemark'
        }

    ]
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
        const promises = docs.map(doc => {
            const response = doc.response;
            let files=DeleteIpPort(doc);
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
                    number:doc.number,
                    company:doc.company,
                    time:doc.time,
                    remark: doc.remark,
                    type: doc.type,
                    lasttime: doc.lastModifiedDate,
                    state: '正常文档',
                    submitTime: moment.utc().format()
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
    static layout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };

}