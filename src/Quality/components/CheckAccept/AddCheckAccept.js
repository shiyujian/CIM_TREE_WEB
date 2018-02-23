import React, { Component } from 'react';

import {
    Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader, Select, Popconfirm, message, Table, Row, Col, notification,Checkbox
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, DataReportTemplate_SafetyFile } from '_platform/api';
import { getUser } from '_platform/auth';
import Preview from '../../../_platform/components/layout/Preview';
const FormItem = Form.Item;
const Option = Select.Option;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';

export default class AddCheckAccept extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkers: [],//审核人下拉框选项
            check: null,//审核人
            options: [],
            littleBan: [],
            thinBan: [],
        };
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		if (e.file.status === 'done' && !e.file.response.a_file) {
			return []
		}
		this.props.props.form.setFieldsValue({ attachment: e.filelist });
		return e && e.fileList;
	}

    componentWillReceiveProps(props){
        let littleBan = [];
        if(props.state.littleBan){
            for(let i=0;i<props.state.littleBan.length;i++){
                littleBan.push(<Option value={props.state.littleBan[i]} key={Math.random()}>{props.state.littleBan[i]}</Option>)
            }
            this.setState({littleBan})
        }
    }
    onSelectChange(value){
        let data = this.props.state.rst;
        let temp = data.filter(item =>{
            return item.SmallClass === value;
        })
        let thinBan = [];
        temp.map(item =>{
            thinBan.push(<Option value={item.ThinClass} key={Math.random()}>{item.ThinClass}</Option>)
        })
        this.setState({thinBan});
    }

    componentDidMount() {
        let littleBan = [];
        if(this.props.state.littleBan){
            for(let i=0;i<this.props.state.littleBan.length;i++){
                littleBan.push(<Option value={this.props.state.littleBan[i]} key={Math.random()}>{this.props.state.littleBan[i]}</Option>)
            }
            this.setState({littleBan})
        }
        const { actions: { getUsers } } = this.props.props;
        getUsers().then(rst => {
            let checkers = rst.map((o, index) => {
                return (
                    <Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers })
        })
    }

    //下拉框选择人
    selectChecker(value) {
        let check = JSON.parse(value);
        this.setState({ check })
    }


    _cpoyMsgT(e) {
		this.setState({
			isCopyMsg: e.target.checked,
		})
	}

    beforeUploadPicFile = (file) => {
		const fileName = file.name;
		const { actions: { uploadStaticFile } } = this.props.props;

        const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);
		uploadStaticFile({}, formdata).then(resp => {
			if (!resp || !resp.id) {
				message.error('文件上传失败')
				return;
			};
			const filedata = resp;
			filedata.a_file = this.covertURLRelative(filedata.a_file);
			filedata.download_url = this.covertURLRelative(filedata.a_file);
			const attachment = [{
				uid: file.uid,
				name: resp.name,
				status: 'done',
				a_file: resp.a_file,
				thumbUrl: resp.a_file,
				mime_type: resp.mime_type
			}];
			// 删除 之前的文件
			if (this.state.currInitialData) {
				deleteStaticFile({ id: this.state.currInitialData.id })
			}
			this.setState({ currInitialData: filedata })
			this.props.props.form.setFieldsValue({ attachment: resp.id ? attachment : null })
		});
		return false;
	}

    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        // showUploadList: false,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(info) {
            if (info.name.indexOf("pdf") !== -1 || info.name.indexOf("word") !== -1) {
                return true;
            } else {
                notification.warning({
                    message: '只能上传pdf或者word文件！',
                    duration: 2
                });
                return false;
            }
        },
    };
    changeDoc({file,fileList,event}){
        debugger
        if(file.status === 'done'){
        }
    }

    render() {
        const {
			form: { getFieldDecorator }
		} = this.props.props;
        return (
            <Form>
                <Row>
                    <Col span={10}>
                        <FormItem {...AddCheckAccept.layout} label="小班">
                            {getFieldDecorator('littleban', {
                                rules: [
                                    { required: true, message: '请选择小班！' },
                                ]
                            })
                            (<Select placeholder='请选择小班'  onChange={this.onSelectChange.bind(this)}>
                                {this.state.littleBan}
                            </Select>)
                        }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem {...AddCheckAccept.layout} label="细班">
                            {getFieldDecorator('thinban', {
                                rules: [
                                    { required: true, message: '请选择细班！' },
                                ]
                            })
                            (<Select placeholder='请选择细班'>
                                {this.state.thinBan}
                            </Select>)
                        }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem {...AddCheckAccept.layout} label="编号">
                            {getFieldDecorator('number', {
                                rules: [
                                    { required: true, message: '请输入编号！' },
                                ]
                            })
                            (<Input />)
                        }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem {...AddCheckAccept.layout} label="文档类型">
                            {getFieldDecorator('doctype', {
                                rules: [
                                    { required: true, message: '请选择文档类型！' },
                                ]
                            })
                            (<Select placeholder='请选择文档类型'>
                                <Option value='检验批验收'>检验批验收</Option>
                                <Option value='质量缺陷'>质量缺陷</Option>
                                <Option value='质量分析'>质量分析</Option>
                            </Select>)
                        }
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...AddCheckAccept.layout} label="附件">
					{getFieldDecorator('attachment', {
						valuePropName: 'fileList',
						getValueFromEvent: this.coverPicFile,
						rules: [
							{ required: true, message: '请上传附件' },
						]
					}, {})(
						<Upload {...this.uploadProps} onChange={this.changeDoc.bind(this)}>
							<Button>
								<Icon type="upload" />添加文件
							</Button>
						</Upload>
						)}
                </FormItem>
                <Row>
                    <Col span={8} offset={4}>
                        <FormItem {...AddCheckAccept.layout} label='审核人'>
                            {
                                getFieldDecorator('dataReview', {
                                    rules: [
                                        { required: true, message: '请选择审核人员' }
                                    ]
                                })
                                    (
                                        <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
                                            {
                                                this.state.checkers
                                            }
                                        </Select>
                                    )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} offset={4}>
                        <Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
                    </Col>
                </Row>
            </Form>
        )
    }
}
