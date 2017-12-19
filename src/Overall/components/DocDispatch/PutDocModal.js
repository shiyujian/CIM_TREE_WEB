import React, {Component} from 'react';
import {Modal, Row, Col, Button,Input, Form,message,Upload,Icon} from 'antd';


import {FILE_API} from '../../../_platform/api';

import {getUser} from '../../../_platform/auth';
// import Editor from 'react-umeditor-pans';

import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';

const FormItem = Form.Item;

class PutDocModal extends Component{
    
    constructor(props) {
		super(props);
        this.state = {
            title: null,
            content: null,
            fileList:[]}
    }

    componentDidMount() {
        const {
            putDocModalVaild: putDocModalVaild = {
                type: 'DOCS',
                status: 'ADD',
                visible: false,
                editDate: null,
            },
            form: {setFieldValue},
        } = this.props;
    }

    modalClick() {
        const {actions: {setPutDocModalVaild}} = this.props;
        setPutDocModalVaild({
            type: null,
			status: null,
			visible: false,
        });
    }

    putDoc(){
        const {
            actions:{postDocument},
            form:{validateFields},
            putDocModalVaild:putDocModalVaild={
                type:'DOCS',
                status:'ADD',
                visible:false,
                editDate:null,
            }
        } = this.props;


        //验证标题是否填写
        validateFields(
            (err,values)=>{
                if(!err){
                    if (putDocModalVaild.status==='ADD'){
                        this.state.title=values['title'];
                        let newDoc={
                            //todo:code待安排
                            //name待安排
                            //目录待安排
                            //
                            'code': 'test_docdispatch_doc_code',
                            'name': this.state.title + '_' + this.state.fileList[0].name,
                            'obj_type': 'C_DOC',
                            'profess_folder': {
                                'code': 'test_docdispatch_doc_code',
                                'obj_type': 'C_DIR',
                            },
                            'basic_params': {
                                'files': this.state.fileList,
                            },
                            'extra_params':{
                                'title': this.state.title,
                                'content': this.state.content,
                                'doc_maker': 'doc_maker',
                                'doc_taker': 'doc_taker',
                                'doc_copy_taker': 'doc_copy_taker',
                                'doc_maker_at_time': 'time',

                            },
                            // 'content': '',
                            // 'attachment': {},
                            // 'publisher': getUser().id,
                        }
                        //上传文档
                        postDocument({},newDoc);
                    }
                }
            }
        );

    }

    
    handleChange = (info)=>{
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        this.setState({ fileList });
        }

    // handleEditorChange = ()=>{
    //     this.setState(
    //         {
    //             content:this.refs.editor.getContent()
    //         }
    //     )
    // }

    uploadProps = {
        onChange: this.handleChange,
        action: `${FILE_API}/api/user/files/`,
        data(file){
            return {
                name: file.fileName,
                a_file: file,
            };
        },

    

    }

    render() {
        const {
            form: {getFieldDecorator},
			putDocModalVaild: putDocModalVaild = {
				type: 'DOCS',
				status: 'ADD',
				visible: false,
			}
        } = this.props;



        const uploadButton =(
            <div><Button>
                <Icon type='upload'/>选择文件
            </Button></div>);


        return (
            <Modal
                title = '发送文件'
                visible = {putDocModalVaild.visible}
                width = "60%"
                footer = {null}
                onOk = {this.modalClick.bind(this)}
                onCancel = {this.modalClick.bind(this)}
            >

                    <Row>
                        <Col span={16} offset={1}>
                            <FormItem 
                                 label='发送标题'
                            >
                                {getFieldDecorator('title',{
                                    rules:[{
                                        required: true,
                                        message: '请输入文档标题'
                                        }],
                                        initialValue: '',
                                    })(<Input type='text' placeholder= '文档标题'/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row offset={1}>
                        <Col offset={1}>
                            <Upload {...this.uploadProps}
                            fileList = {this.state.fileList}>
                               {uploadButton} 
                            </Upload>
                        </Col>
                    </Row>

					<Row>
						<Col span={22} offset={1}>
							{/*<Editor */}
                                {/*icons={[*/}
                                    {/*"bold italic underline strikethrough fontborder emphasis |",*/}
                                    {/*"paragraph fontfamily fontsize | superscript subscript | ",*/}
                                    {/*"forecolor backcolor | removeformat |",*/}
                                    {/*"cleardoc |",*/}
                                {/*]}*/}
                                {/*ref="editor"*/}
								{/*value={this.state.content}*/}
								{/*defaultValue="<p>请输入内容</p>"*/}
								{/*onChange={this.handleEditorChange.bind(this)}*/}
							{/*/>*/}
						</Col>
					</Row>

                    <Row gutter={24}>
                        <Col offset={10} span={2}>
                            <Button onClick= {this.putDoc.bind(this)}>发布</Button>
                        </Col>
                        <Col span={2}>
                            <Button onClick= {this.modalClick.bind(this)}>取消</Button>
                        </Col>
                    </Row>
            </Modal>
        );
    }
}

export default Form.create()(PutDocModal)