import React, {Component} from 'react';
import {
    Form, Input, Select, Button, DatePicker, Row, Col,message,Popconfirm
} from 'antd';
import {base, STATIC_DOWNLOAD_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const Search = Input.Search;

export default class Filter extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 1},
        wrapperCol: {span: 23}
    };

    render() {
        const {actions: {toggleAddition},Doc = []} = this.props;
        console.log(66666,Doc);
        return (
            <Form style={{marginBottom: 24}}>
                <Row gutter={24}>
                    <Col span={14}>
                        <FormItem>
                            <Search placeholder="输入内容"
                                    onSearch={this.query.bind(this)}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span ={24}>
	                    <Button style={{marginRight: 10}} type="primary" onClick={toggleAddition.bind(this, true)}>上传文件</Button>
	                    {
		                    (Doc.length === 0 )?
			                    <Button style={{marginRight: 10}} disabled>下载文件</Button>:
			                    <Button style={{marginRight: 10}} type="primary" onClick={this.download.bind(this)}>下载文件</Button>
	                    }
	                    {
		                    (Doc.length === 0 )?
			                    <Button style={{marginRight: 10}} disabled>删除文件</Button>:
			                    <Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
				                    <Button style={{marginRight: 10}} type="primary" onClick={this.delete.bind(this)}>删除文件</Button>
			                    </Popconfirm>
	                    }
                    </Col>
                </Row>
            </Form>
        );
    }

    query(value){
        console.log(value);
        const {actions:{getdocument},currentcode={}} =this.props;
        let search = {
	        doc_name:value
        };
	    getdocument({code:currentcode.code},search);
    }

    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    download(){
        const {selected=[],file =[],files=[],down_file=[]} = this.props;
	    if(selected.length == 0){
		    message.warning('没有选择无法下载');
	    }
        selected.map(rst =>{
            file.push(rst.basic_params.files);
        });
        file.map(value =>{
            value.map(cot =>{
                files.push(cot.download_url)
            })
        });
        console.log('files',files);
        files.map(down =>{
            let down_load = STATIC_DOWNLOAD_API + "/media"+down.split('/media')[1];
            this.createLink(this,down_load);
        });
    }

    delete() {
        const {selected} = this.props;
        // if (selected.length === 0) {
        //     message.warning('请先选择要删除的文件！');
        //     return;
        // }
    }

    confirm(){
	    const {
	        coded=[],
		    selected=[],
	        currentcode = {},
	        actions: {deletedoc, getdocument}
	    } = this.props;
	    if (selected === undefined ||selected.length === 0 ) {
		    message.warning('请先选择要删除的文件！');
		    return;
	    }
	    selected.map(rst =>{
	        coded.push(rst.code);
	    });
	    let promises = coded.map(function (code) {
	        return deletedoc({code: code});
	    });
	    message.warning('删除文件中...');
	    Promise.all(promises).then(() => {
	        message.success('删除文件成功！');
	        getdocument({code: currentcode.code})
	            .then(() => {
	            });
	    }).catch(() => {
	        message.error('删除失败！');
	        getdocument({code: currentcode.code})
	            .then(() => {
	            });
	    });
    }

	cancel(){}
};
