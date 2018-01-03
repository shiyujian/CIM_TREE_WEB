import React, { Component } from 'react';

import {
    Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader, Select, Popconfirm, message, Table, Row, Col, notification
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API,DataReportTemplate_ProjectVolumeSettlement } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import { Promise } from 'es6-promise';
const FormItem = Form.Item;
const Option = Select.Option;

export default class ProjectSum extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers: [],//审核人下来框选项
            check: null,//审核人
            project: {},
            unit: {},
            options: [],
            changeRed:'',
        };
    }

    componentDidMount() {
        const { actions: { getAllUsers, getProjectTree ,getQuantitiesCode,getSearcherDoc} } = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers })
        })
        getProjectTree({ depth: 1 }).then(rst => {
            if (rst.status) {
                let projects = rst.children.map(item => {
                    return (
                        {
                            value: JSON.stringify(item),
                            label: item.name,
                            isLeaf: false
                        }
                    )
                })
                this.setState({ options: projects });
            } else {
                //获取项目信息失败
            }
        });
        let cacheData =  getSearcherDoc({keyword:"hfdsjhbsadfhb"}).then(res => {
            // let cacheData = res.filter(item => item.extra_params.projectcoding);
            let cacheArr = []
            res.result.map(item => {
                if(item.extra_params.projectcoding) {
                    cacheArr.push(item.extra_params.projectcoding);
                }
            })
            this.setState({cacheArr});
        });
        
     
    }
    beforeUpload = (info) => {
        if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }
    uplodachange = async (info) => {
        //info.file.status/response
        let {cacheArr} = this.state;
        let usedMark = false;
        const { actions: { getQuantitiesCode} } = this.props;
        if (info && info.file && info.file.status === 'done') {
            notification.success({
                message: '上传成功！',
                duration: 2
            });
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            let dataSource = [];
            for (let i = 1; i < dataList.length; i++) {
                let res = await getQuantitiesCode({code:dataList[i][0]});
                let isUsed = cacheArr.indexOf(dataList[i][0]);
                dataList[i].flag = res !== 'object not found' && isUsed == -1 ? true : false;
                if(isUsed !== -1) {
                    usedMark = true;
                }
                dataSource.push({
                    key:i,
                    projectcoding:dataList[i][0] ? dataList[i][0] : '',
                    projectname:{
                       editable: false, 
                       value:dataList[i][1] ? dataList[i][1] : '',
                    },
                    company:{
                        editable: false,
                        value:dataList[i][2] ? dataList[i][2] : ''
                    } ,
                    number:{
                        editable: false,
                        value: dataList[i][3] ? dataList[i][3] : '',
                    } ,
                    total: {
                        editable: false,
                        value:dataList[i][4] ? dataList[i][4] : ''
                    },
                    remarks:{
                        editable: false,
                        value:dataList[i][5] ? dataList[i][5] : ''
                    },
                    action:'normal',
                    flag: dataList[i].flag,
                    project: {
                        code: "",
                        name: "",
                        obj_type: ""
                    },
                    unit: {
                        code: "",
                        name: "",
                        obj_type: ""
                    },
                    file: {

                    }

                })
                
            }

            // dataSource.map(item => {
            //     if(cacheArr.indexOf(item.extra_params.projectcoding) && item.flag) {
            //         item.flag = false;
            //     };
            //     return item;
            // });
            if(dataSource.some(item => {
                return !item.flag
            })) {
                notification.warning({
                    message: "清单项目编号错误",
                    duration: 2
                })
            }

            if(usedMark) {
                notification.warning({
                    message:"清单项目编号已经被使用",
                    duration: 2
                })
            }
            dataSource = this.checkCodeRepeat(dataSource);
            this.setState({dataSource}); 
            
        }

    }
    checkCodeRepeat(dataSource) {
        let codearr = dataSource.map(data => data.projectcoding);
        let repeatFlag = false;
        for(var i = 0, l = codearr.length; i < l; ++i) {
            if (codearr.indexOf(codearr[i]) !== i) {
                if(dataSource[i].flag) {
                    dataSource[i].flag = false;
                    repeatFlag = true;
                }
            }
        }
      
        repeatFlag && notification.warning({
            message:  "清单项目编号重复",
            duration: 2
        });
        return dataSource;
    }
    //下拉框选择人
    selectChecker(value) {
        let check = JSON.parse(value);
        this.setState({ check })
    }

    onSelectProject = (value, selectedOptions) => {
        let project = {};
        let unit = {};
        if (value.length === 2) {
            let temp1 = JSON.parse(value[0]);
            let temp2 = JSON.parse(value[1]);
            project = {
                name: temp1.name,
                code: temp1.code,
                obj_type: temp1.obj_type
            }
            unit = {
                name: temp2.name,
                code: temp2.code,
                obj_type: temp2.obj_type
            }
            this.setState({ project, unit });
            return;
        }
        //must choose all,otherwise make it null
        this.setState({ project: {}, unit: {} });
    }

    loadData = (selectedOptions) => {
        const { actions: { getProjectTree } } = this.props;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getProjectTree({ depth: 2 }).then(rst => {
            if (rst.status) {
                let units = [];
                rst.children.map(item => {
                    if (item.code === JSON.parse(targetOption.value).code) {  //当前选中项目
                        units = item.children.map(unit => {
                            return (
                                {
                                    value: JSON.stringify(unit),
                                    label: unit.name
                                }
                            )
                        })
                    }
                })
                targetOption.loading = false;
                targetOption.children = units;
                this.setState({ options: [...this.state.options] })
            } else {
                //获取项目信息失败
            }
        });
    }

    onok() {
        if (!this.state.check) {
            notification.warning({
                message: "请选择审核人",
                duration: 2
            })
            return
        }
        if (this.state.dataSource.length === 0) {
            notification.warning({message:"请上传excel",duration: 2})
            return
        }
        let flag = this.state.dataSource.some((o,index) => {
            return !o.flag
        })

        if(flag) {
            notification.warning({message:"清单项目编号错误",duration: 2});
            return
        }

        const { project, unit } = this.state;
        if (!project.name) {
            notification.warning({message:`请选择项目和单位工程`,duration: 2});
            return;
        }      
        let { check } = this.state
        let per = {
            id: check.id,
            username: check.username,
            person_name: check.account.person_name,
            person_code: check.account.person_code,
            organization: check.account.organization
        }
        // for (let i = 0; i < this.state.dataSource.length; i++) {
        //     this.state.dataSource[i].project = project;
        //     this.state.dataSource[i].unit = unit;
        // }
     
        let {dataSource} = this.state;
        let newdataSource = [];
        dataSource.map((item,key)=>{
            let newDatas = {
                key:key+1,
                subproject: project,//项目/子项目
                unit: unit,//单位工程
                projectcoding: item.projectcoding,//项目编号
                projectname: item.projectname.value,//项目名称
                company: item.company.value,//计量单位
                number: item.number.value,//数量
                total: item.total.value,//单价
                remarks: item.remarks.value,//备注
            }
            newdataSource.push(newDatas)
        })
        this.props.onok(newdataSource, per);
        notification.success({
            message: '信息上传成功！',
            duration: 2
        });
    }
	//模板下载
	DownloadExcal(){
		this.createLink("工程量结算模板下载",DataReportTemplate_ProjectVolumeSettlement)
	}
	createLink = (name, url) => {
		let link = document.createElement("a");
		link.href=url;
		link.setAttribute("download",this);
		link.setAttribute("target","_blank");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
    //删除
    delete(index) {
        let { dataSource } = this.state
        dataSource.splice(index, 1)
        let newdataSource = [];
        dataSource.map((item,key)=>{
            let newDatas = {
                key:key+1,
                code: item.code,
                subproject: item.subproject,//项目/子项目
                unit: item.unit,//单位工程
                projectcoding: item.projectcoding,//项目编号
                projectname: item.projectname,//项目名称
                company: item.company,//计量单位
                number: item.number,//数量
                total: item.total,//单价
                remarks: item.remarks,//备注
                action:item.action
            }
            newdataSource.push(newDatas)
        })
      this.setState({dataSource:newdataSource})  
    }

    //预览
    handlePreview(index) {
        const { actions: { openPreview } } = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }

    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    beforeUploadPicFile = (index, file) => {
        // 上传到静态服务器
        const subproject = file.name;
        let { dataSource, unit, project } = this.state;
        let temp = subproject.split(".")[0]
        const { actions: { uploadStaticFile } } = this.props;
        const formdata = new FormData();
        formdata.append('a_file', file);
        formdata.append('name', subproject);
        let myHeaders = new Headers();
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
        };
        //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`, myInit).then(async resp => {
            resp = await resp.json()
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                notification.error({message:'文件上传失败',duration: 2})
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                size: resp.size,
                id: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
                //thumbUrl: SOURCE_API + resp.a_file,
                a_file: filedata.a_file,
                download_url: filedata.download_url,
                mime_type: resp.mime_type
            };
            let unitProject = {
                name: unit.name,
                code: unit.code,
                obj_type: unit.obj_type
            }
            let projectt = {
                name: project.name,
                code: project.code,
                obj_type: project.obj_type
            }
            dataSource[index]['file'] = attachment;
            dataSource[index]['unit'] = unitProject;
            dataSource[index]['project'] = projectt;
            this.setState({ dataSource });
        });
        return false;
    }
    //编辑
    edit (index) {
        const { dataSource } = this.state;
        dataSource[index].action = 'edit';
        Object.keys(dataSource[index]).forEach( v =>{
          if (dataSource[index][v].hasOwnProperty('editable')) dataSource[index][v]['editable'] = true;      
        })
        this.setState({dataSource});

    }
    // 表格数据改变时
    handeleChange(index,text,value){
        const {dataSource} = this.state;
        dataSource[index][text].value = value;
        this.setState({dataSource});
    }
    //改变表格完成；
    changeOk(index){
      
        const { dataSource } = this.state;
        dataSource[index].action = 'normal';
        Object.keys(dataSource[index]).forEach( v =>{
          if (dataSource[index][v].hasOwnProperty('editable')) dataSource[index][v]['editable'] = false;      
        })
        this.setState({dataSource});
    }
      // 处理表格渲染数据
    renderColumns(index,text,data){
        const { editable } = this.state.dataSource[index][text];
        if( typeof editable === 'undefined'){
        return data;
        }
        return (
        <div>
            {!editable ?(
            <span>{data.value}</span>
            ) :(
            <Input value={data.value} onChange = {e => this.handeleChange(index,text,e.target.value)}/>
            )}
        </div>
        )
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
            }, {
                title: '清单项目编号',
                dataIndex: 'projectcoding',
                render: (text, record, index) => {
                    if(record.flag === false){
                        return (<span style={{color:'red'}}>{record.projectcoding}</span>)    
                    }else{
                        return <span style={{color:'green'}}>{record.projectcoding}</span>
                    }
                }
            }, {
                title: '项目名称',
                dataIndex: 'projectname',
                render:(text,record,index) =>{
                    return this.renderColumns(record.key-1,'projectname',text);
                }
            },  {
                title: '计量单位',
                dataIndex: 'company',
                render:(text,record,index) =>{
                    return this.renderColumns(record.key-1,'company',text);
                }
            },{
                title: '数量',
                dataIndex: 'number',
                render:(text,record,index) =>{
                    return this.renderColumns(record.key-1,'number',text);
                }
            },{
                title: '综合单价(元)',
                dataIndex: 'total',
                render:(text,record,index) =>{
                    return this.renderColumns(record.key-1,'total',text);
                }
            },{
                title: '备注',
                dataIndex: 'remarks',
                render:(text,record,index) =>{
                    return this.renderColumns(record.key-1,'remarks',text);
                }
            }, 
            {
                title: "操作", 
                render: (text, record, index) => {
                    return record.action === 'normal' ? (
                      <div>
                        <a onClick={this.edit.bind(this,record.key-1)}><Icon style={{marginRight:"15px"}} type = "edit"/></a>
                        <Popconfirm
                          placement="leftTop"
                          title="确定删除吗？"
                          onConfirm={this.delete.bind(this, record.key-1)}
                          okText="确认"
                          cancelText="取消"
                        >
                          <a><Icon type = "delete"/></a>
                        </Popconfirm>
                      </div>   
                    ):(
                        <a onClick={this.changeOk.bind(this,record.key-1)}>完成</a>
                    );
                } 
            }
        ];
        return (
            <Modal
                visible={true}
                width={1280}
                onOk={this.onok.bind(this)}
                maskClosable={false}
                onCancel={this.props.oncancel}>
                <h1 style ={{textAlign:'center',marginBottom:20}}>发起填报</h1>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button style={{ margin: '10px 10px 10px 0px' }} onClick={this.DownloadExcal.bind(this)}>模板下载</Button></Col>
                    <Col>
                        <Upload
                            onChange={this.uplodachange.bind(this)}
                            name='file'
                            showUploadList={false}
                            action={`${SERVICE_API}/excel/upload-api/`}
                            beforeUpload={this.beforeUpload.bind(this)}
                        >
                            <Button style={{ margin: '10px 10px 10px 0px' }}>
                                <Icon type="upload" />上传并预览
                             </Button>
                        </Upload>
                    </Col>
                    <Col>
                        <span>
                            审核人：
                            <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span>
                    </Col>
                    <Col>
                        <span>
                            项目-单位工程：
                        <Cascader
                                options={this.state.options}
                                className='btn'
                                loadData={this.loadData.bind(this)}
                                onChange={this.onSelectProject.bind(this)}
                                placeholder="请选择"
                                changeOnSelect
                            />
                        </span>
                    </Col>
                </Row>
                <Preview />
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </Row>
            </Modal>
        )
    }
}

