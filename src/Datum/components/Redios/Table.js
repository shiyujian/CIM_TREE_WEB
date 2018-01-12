import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, Spin,Input,Select,Popover,Modal,Button} from 'antd';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import moment from 'moment';
const Option = Select.Option;

export default class GeneralTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            imgurl:null
        };
    }
    render() {
	    const {newkey = [],tableSrc =[]} = this.props;

	    const columns = newkey.map(rst=>{
		    if(rst.name === "文件名" ||rst.name === "卷册名" ||rst.name === "事件" ||rst.name ==="名称"){
			    return 	{
				    title:rst.name,
				    dataIndex:'extra_params.name',
				    key:rst.name
			    }
		    }
		    else if(rst.name !== "操作"){
			    return 	{
				    title:rst.name,
				    key:rst.name,
				    dataIndex:`extra_params[${rst.code}]`
			    }
		    }else{
			    return {
				    title:'操作',
				    key:'操作',
				    render:(record) =>{
					    let nodes = [];
					    nodes.push(
						    <div>
							    {/*<a onClick={this.previewFile.bind(this,record)}>预览</a>*/}
							    <Popover content={this.genDownload(record.basic_params.files)}
							             placement="right">
								    <a>预览</a>
							    </Popover>
                                <span className="ant-divider" />
							    <a onClick={this.update.bind(this,record)}>更新</a>
						    </div>
					    );
					    return nodes;
				    }
			    }
		    }
	    });

	    columns.splice(-1,0,{title:'状态',dataIndex:'extra_params.state'});

        return (
        	<div>
				<Table rowSelection={this.rowSelection}
					   dataSource={tableSrc}
					   columns={columns}
					   bordered rowKey="code"/>
				<Modal  title="图片预览"
        				width='70%'
        				closable={false}
					 visible={this.state.visible}
					 footer={[<Button key="back" size="large" onClick={this.cancel.bind(this)}>关闭查看</Button>]}>
				  <img  src={`${SOURCE_API}` + this.state.imgurl} alt="图片"/>
				</Modal>
			</div>
        );
    }
    cancel(){
    	this.setState({
    		visible:false
		})
	}
    rowSelection = {
        onChange: (selectedRowKeys,selectedRows) => {
            const {actions: {selectDocuments}} = this.props;
            selectDocuments(selectedRows);
        }
    };

	genDownload = (text)=>{
		return(
			text.map((rst) =>{
				return (
					<div>
						<a onClick={this.previewFile.bind(this,rst)}>{rst.name}</a>
					</div>)
			})
		)
	};


previewFile(file) {
        const {actions: {openPreview}} = this.props;
    	let imgurl = file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        if(file.mime_type == "image/png" || file.mime_type == "image/jpg" || file.mime_type == "image/jpeg")
		{
            this.setState({visible:true,imgurl:imgurl})
		}else{
            if(JSON.stringify(file) === "{}"){
                return
            }else {
                const filed = file;
                openPreview(filed);
            }
		}

    }

    update(file){
	    const {actions:{updatevisible,setoldfile}}= this.props;
	    updatevisible(true);
	    setoldfile(file);
    }
}
