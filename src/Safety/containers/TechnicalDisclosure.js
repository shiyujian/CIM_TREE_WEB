/**
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/technicalDisclosure';
import { actions as fileActions } from '../store/staticFile';
//import cookie from 'component-cookie';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import {
    Table, Button, Row, Col, Icon, Modal, Input, message, Popconfirm,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card
} from 'antd';
// import {ProjectTree}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import { actions as supportActions } from '../store/supportActions';
import * as previewActions from '_platform/store/global/preview';
import AddTechnicalDisclosure from '../components/TechnicalDisclosure/AddTechnicalDisclosure';
import { SOURCE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;

@connect(
    state => {
        const { safety: { technicalDisclosure = {} } = {}, platform } = state;
        return { ...technicalDisclosure, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions,...fileActions,...supportActions }, dispatch)
    })
)

class TechnicalDisclosure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            setVisible: false,
            newKey: Math.random(),
            record: {},
            dataSource: [],
            code:"",
            pcode:"",
            imgs:null
        }
    }
    componentDidMount() {

    }
    //点击树事件
    onTreeNodeClick(selectedKeys,e){
        const { actions: {getSafetyDisclosure} } = this.props
        if(!selectedKeys.length){
            this.setState({code:"",pcode:""})
            return
        }
        let node = e.selectedNodes[0].props;
        if(!node.pk){
            const tempcode =`?project_code=${node.dataRef.key}`;
            getSafetyDisclosure({code:tempcode}).then(rst => {
                let dataSource = this.handleData(rst);
                this.setState({code:"",pcode:node.dataRef.key,dataSource,imgs:null})
            })      
        }else{
            const tempcode = `?project_unit_code=${node.dataRef.key}`
            getSafetyDisclosure({code:tempcode}).then(rst => {
                let dataSource = this.handleData(rst);
                this.setState({code:node.dataRef.key,dataSource,imgs:null}) 
            })
                       
        }
    }
    addClick = () => {
        if(this.state.code === ""){
            message.info("请选择单位工程")
       }else{
           this.setState({
               newKey: Math.random()*2,
               setVisible: true,
           });
       } 
    }
    goCancel() {
        this.setState({
            setVisible: false
        });
    }

    setAddData() {
        const { actions: {addSafetyDisclosure,getWkByCode} } = this.props
        let {code} = this.state
        this.props.form.validateFields(async(err, values) => {
            debugger
            if (!err) {
                debugger
                let wkunit = await getWkByCode({code:code});
                let project = wkunit.parent.obj_type !== "C_PJ" ?  await getWkByCode({code:wkunit.parent.code}) : wkunit.parent; 
                values.disclosure_date = moment(values.disclosure_date._d).format("YYYY-MM-DD");
                let location = JSON.parse(values.location.key)
                let putData = {
                    project:{
                        pk:project.pk,
                        code:project.code,
                        name:project.name,
                        obj_type:project.obj_type
                    },
                    project_unit:{
                        pk:wkunit.pk,
                        code:wkunit.code,
                        name:wkunit.name,
                        obj_type:wkunit.obj_type
                    },
                    plan:values.plan,
                    location:{
                        pk:location.pk,
                        name:location.name,
                        code:location.code,
                        obj_type:location.obj_type
                    },
                    work:values.work,
                    disclosure_person:{
                        name:values.disclosure_person
                    },
                    disclosure_level:values.disclosure_level,
                    disclosure_date:values.disclosure_date,
                    disclosure_chart:values.disclosure_chart[0],
                    images: values.images ? values.images : [],
                };
                addSafetyDisclosure({},putData).then(rst => {
                    try{
                        let dataSource = this.state.dataSource.concat(this.handleData([rst]));
                        this.setState({
                            setVisible:false,
                            dataSource,
                            imgs:null
                        });
                    }catch(e){
                        message.info("添加失败")
                        this.setState({setVisible:false})
                    }
                });
            }
        });
    }

    previewFiles(record,index) {
        const { actions: { openPreview } } = this.props;
        let data = this.state.dataSource;
        let f = data[index].disclosure_chart
        let filed = {};
        filed = {
            "a_file": `${SOURCE_API}${f.a_file}`,
            "misc": f.misc,
            "mime_type": f.mime_type,
            "download_url": `${STATIC_DOWNLOAD_API}${f.a_file}`,
            "name": f.name
        }
        openPreview(filed);
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
    download(record,index) {
        let data = this.state.dataSource;
        let apiGet = `${STATIC_DOWNLOAD_API}` + data[index].disclosure_chart.a_file;
        this.createLink(this, apiGet);
    }
    delete(index) {
        let datas = this.state.dataSource;
        const {actions:{delSafetyDisclosure}} = this.props
        delSafetyDisclosure({id:datas[index].id}).then(rst => {
            datas.splice(index, 1);
            this.setState({ dataSource: datas, imgs:null });
        })
    }

    onSearch(value){  
        const {actions:{getSafetyDisclosure}} = this.props
        let param = "?keyword=" + value
        getSafetyDisclosure({code:param}).then(rst => {
            let dataSource = this.handleData(rst)
            this.setState({dataSource})
        })  
    }
    //展示图片
    showImg(record,index){
        let datas = this.state.dataSource;
        let imgs = datas[index].images
        this.setState({imgs})
    }
    //将数据处理成适用于表格的数据
    handleData(data){
       return data.map(item => {
            return {
                projectName: item.project_unit.name,
                division: item.location.name,
                end: item.disclosure_person.name,//交底人
                ...item
            }
        })
    }
    render() {
        const { dataSource } = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>
            }
        }, {
            title: '专项方案',
            dataIndex: 'plan',
        }, {
            title: '工程名称',
            dataIndex: 'projectName',
        }, {
            title: '分部分项',
            dataIndex: 'division',
        }, {
            title: '工种',
            dataIndex: 'work',
        }, {
            title: '交底人',
            dataIndex: 'end',
        }, {
            title: '交底层级',
            dataIndex: 'disclosure_level',
        }, {
            title: '交底日期',
            dataIndex: 'disclosure_date',
        }, {
            title: '记录表',
            dataIndex: 'record',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.previewFiles.bind(this, record, index)}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.download.bind(this, record, index)}>下载</a>
                </span>
            ),
        }, {
            title: '照片',
            dataIndex: 'photo',
            // width: '11%',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.showImg.bind(this, record, index)}>查看</a>
                </span>
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            // width: '15%',
            render: (text, record, index) => (
                <span>
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }];

        return (
            <div className='titleRegister'>
                <DynamicTitle title="安全技术交底" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props} onSelect={this.onTreeNodeClick.bind(this)} />
                </Sidebar>
                <Content>
                    <Card>
                        <Row>
                            <Col span={12}>
                                <Search
                                    placeholder="请输入搜索关键词"
                                    style={{ width: '80%', display: 'block' }}
                                    onSearch={(value) => this.onSearch(value)}
                                >
                                </Search>
                            </Col>
                            <Col span={12}>
                                <Button
                                    key='create'
                                    type="primary"
                                    onClick={() => this.addClick()}
                                    style={{ width: '110px', marginBottom: '20px', float: 'right' }}
                                    size="large" icon="plus-circle-o"
                                >添加</Button></Col>

                        </Row>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            title={() => '安全技术交底'}
                        />
                    </Card>
                    {
                        this.state.imgs && 
                        <Card>
                            <div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
                                {
                                    this.state.imgs.map((item,index) => {
                                        let d_url = `${STATIC_DOWNLOAD_API}${item.a_file}`;
                                        return (
                                            <img style={{height:'100%',margin:'8px'}} src={`${SOURCE_API}${item.a_file}`} alt="" onClick={() => this.createLink(this,d_url)}/>
                                        )
                                    })
                                }
                            </div>    
                        </Card>
                    }
                    <Modal
                        key={this.state.newKey}
                        width="50%"
                        maskClosable={false}
                        title={"添加技术交底"}
                        key={this.state.newKey}
                        visible={this.state.setVisible}
                        onOk={() => this.setAddData()}
                        onCancel={this.goCancel.bind(this)}>
                        <AddTechnicalDisclosure props={this.props} state={this.state} />
                    </Modal>
                </Content>
                <Preview />
            </div>
        );
    }
}
export default Form.create()(TechnicalDisclosure);
