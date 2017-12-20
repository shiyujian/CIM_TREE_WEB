import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
const Search = Input.Search;
export default class ToggleModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: []
        }
    }
    render(){
        const {visible} = this.props;
        let jthis = this
		//上传
		const props = {
			action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
			headers: {
			},
			showUploadList: false,
			onChange(info) {
                console.log(info)
				if (info.file.status !== 'uploading') {
					// console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					let importData = info.file.response.Sheet1;
					console.log('bbb', importData);
					let { dataSource } = jthis.state
					dataSource = jthis.handleExcelData(importData)
					jthis.setState({ dataSource })
					message.success(`${info.file.name} 上传成功`);
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name}解析失败，请检查输入`);
				}
			},
		};
        return (
            <Modal
                visible={visible}
                width={1280}
                onOk={this.ok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
                <Table 
                    style = {{"textAlign":"center"}}
                    columns={this.columns}
                    bordered={true}
                    dataSource = {this.state.dataSource}
                >
                </Table>
                <Upload {...props}>
                    <Button style={{ margin: '10px 10px 10px 0px' }}>
                        <Icon type="upload" />上传附件
                     </Button>
                </Upload>
                <span>
                    审核人：
                        <Select style={{ width: '200px' }} className="btn" >
                        {
                            // this.state.checkers
                        }
                    </Select>
                </span> 
                <Button type="primary" >提交</Button>
               <div style={{marginTop:"30px"}}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{paddingLeft:"25px"}}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
               </div>
            </Modal>
        )
    }
    ok(){
      const {actions:{ModalVisibleUnit}} = this.props;
      ModalVisibleUnit(false);
    }
    cancel(){
      const {actions:{ModalVisibleUnit}} = this.props;
      ModalVisibleUnit(false);
    }
    onChange(){

    }
    componentDidMount(){

    }
    columns = [{
        title: '序号',
        dataIndex: 'index',
        // key: 'Index',
      }, {
        title: '单位工程名称',
        dataIndex: 'code',
        // key: 'Code',
      }, {
        title: '所属项目/子项目名称',
        dataIndex: 'genus',
        key: 'Genus',
      },{
        title: '项目类型',
        dataIndex: 'area',
        // key: 'Area',
      },{
         title: '项目阶段',
         dataIndex :'type',
        //  key: 'Type',
      },{
        title: '项目红线坐标',
        dataIndex :'address',
        // key: 'Address',
      },{
        title: '计划开工日期',
        dataIndex :'coordinate',
        // key: 'Coordinate',
      },{
        title: '计划竣工日期',
        dataIndex :'duty',
        // key:'Duty'
      },{
        title: '建设单位',
        dataIndex :'stime',
        // key:'Stime'
      },{
        title: '单位工程简介',
        dataIndex :'etime',
        // key:'Etime'
      },{
          title:'附件',
          key:'nearby',
          render:(record) => (
            <span>
                附件
            </span>
          )
      }]
    //处理上传excel的数据
    handleExcelData(data) {
        console.log('data',data)
        data.splice(0, 1);
        let res = data.map(item => {
            return {
                index: item[0],
                code: item[1],
                genus: item[2],
                area: item[3],
                type: item[4],
                address: item[5],
                coordinate: item[6],
                duty: item[7],
                stime: item[8],
                etime: item[9]
            }
        })
        return res;
    }
}