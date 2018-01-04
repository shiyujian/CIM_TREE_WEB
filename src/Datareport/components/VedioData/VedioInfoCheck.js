import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';

import {Row, Col, Button, Radio, Modal, message, notification} from 'antd';
const RadioGroup = Radio.Group;
import WorkflowHistory from '../WorkflowHistory';
import {getUser} from '_platform/auth';
import Preview from '../../../_platform/components/layout/Preview';
import VedioInfoTable from './VedioInfoTable';
import moment from 'moment';

import {actions} from '../../store/vedioData';
import {throughProcess} from './commonFunc';

@connect(
	state => {
		const {platform} = state;
		return {platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions,...actions}, dispatch)
	})
)

export default class VedioInfoCheck extends Component {
    constructor(props) {
		super(props);
		this.state = {
            option:1,//1表示通过 2表示不通过
            topDir:{}
		};
    }

    async componentDidMount(){  //直接copy
        const {actions:{getScheduleDir,postScheduleDir}} = this.props;

        let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(!topDir.obj_type){
            const postData = {
                name:'数据报送的顶级节点',
                code:'the_only_main_code_datareport',
                "obj_type": "C_DIR",
                "status": "A",
            };
            topDir = await postScheduleDir({},postData);
        }
        this.setState({topDir});
    }

    render() {
        const {wk,type} = this.props,
            dataSource = JSON.parse(wk.subject[0].data);

		return (
            <Modal
			title={modalTitle[type]}
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}
            >
                <Row type='flex' justify='center' >
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{modalTitle[type]}</h1>
                </Row>
                <VedioInfoTable
                 dataSource={dataSource}
                />
                <Row>
                    <Col span={2}>
                        <span>审查意见：</span>
                    </Col>
                    <Col span={4}>
                        <RadioGroup onChange={this.onChange} value={this.state.option}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={2}>不通过</Radio>
                        </RadioGroup>
                    </Col>
                    <Col span={2} push={14}>
                        <Button type='primary'>
                            导出表格
                        </Button>
                    </Col>
                    <Col span={2} push={14}>
                        <Button type='primary' onClick={this.submit.bind(this)}>
                            确认提交
                        </Button>
                        <Preview />
                    </Col>
                </Row>
                {
                    wk && <WorkflowHistory wk={wk}/>
                }
            </Modal>
		)
    }

    onChange = (e)=>{
        this.setState({option:e.target.value})
    }

    submit = async ()=>{
        if(this.state.option === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        const {type} = this.props;
        this.props.closeModal(modalName[type],false,'submit')    //selfcare use
        notification.success({
            message: '操作成功！',
            duration: 2
        });       
    }

    passon = async ()=>{ //通过
        const {wk,type} = this.props,
            dataSource = JSON.parse(wk.subject[0].data),
            {actions:{logWorkflowEvent}} = this.props;
        await throughProcess(wk,{logWorkflowEvent});
        switch(type){
            case 'create':
                this.createPassion(dataSource);
                break;
            case "change":
                this.changePassion(dataSource);
                break;
            case 'strike':
                const {actions:{deleteDocument,deleteStaticFile}} = this.props;
                let all = [] ,fileAll = [];
                dataSource.forEach(item => {
                    all.push( deleteDocument({code:item.code}) )
                    fileAll.push( deleteStaticFile({id:item.file.id}) )
                });
                Promise.all(fileAll);
                Promise.all(all).then(rst => {
                    notification.success({
                        message: '删除文档成功！',
                        duration: 2
                    });
                })
                break;
        }

    }
    createPassion = async (dataSource)=>{
        const {topDir} = this.state,
            {actions:{
                logWorkflowEvent,
                addDocList,
                getScheduleDir,
                postScheduleDir,
                getWorkpackagesByCode
            }} = this.props;
            const unitCode = JSON.parse(dataSource[0].value[1]).code,
            scheduleDircode = 'datareport_safety_vedioinfodata'; //I'm unique
        let dir = await getScheduleDir({code:scheduleDircode});
        if(!dir.obj_type){  //no such directory
            const {pk, code, obj_type} = await getWorkpackagesByCode({code:unitCode}),
                postDirData = {
                    name: '影像信息目录树',
                    code: scheduleDircode,
                    obj_type: "C_DIR",
                    status: "A",
                    related_objects: [{
                        pk,code,obj_type,
                        rel_type: 'safetydoc_vedioinfodata_dirctory', //we are not same
                    }],
                    parent:{pk:topDir.pk,code:topDir.code,obj_type:topDir.obj_type}
                };

            dir = await postScheduleDir({},postDirData);
        }

        const docData = dataSource.map(item =>{ 
            const {file:{a_file,name,download_url,mime_type}} = item
            const code = 'vedioinfoData'+moment().format("YYYYMMDDHHmmss")+item.index;  //makesure code is unique
            delete item.index;
            return {
                code,
                name:name,
                obj_type:"C_DOC",
                status:'A',
                profess_folder: {code: dir.code, obj_type: 'C_DIR'},
                basic_params: {
                    files: [{
                        a_file,name,download_url,mime_type,
                        misc: "file",
                    }]
                },
                extra_params:{...item}
            }
        })

        const {result} = await addDocList({},{data_list:docData});
        if(result){
            notification.success({ message: '创建文档成功！',duration: 2});
        }else{
            notification.error({message: '创建文档失败！',duration: 2});
        }
    }
    changePassion = async (dataSource)=>{
        const {actions:{putDocument, deleteStaticFile}} = this.props;
        let deleteFileAll = []
        const data_list = dataSource.map(item=>{
            if(item.deleteFile){    //删除旧的文件
                const {deleteFile:{id}} = item;
                deleteFileAll.push( deleteStaticFile({id}) )
            }

            const {file:{a_file,name,download_url,mime_type}} = item;
            const extra = JSON.parse(JSON.stringify(item));
            
            delete extra.code;
            delete extra.index;
            delete extra.deleteFile;
            return {
                code:item.code,
                status:'A',
                version: 'A',
                basic_params: {
                    files: [{
                        a_file,name,download_url,mime_type,
                        misc: "file",
                    }]
                },
                extra_params:{...extra}
            }
        });

        Promise.all(deleteFileAll);
        const {result} = await putDocument({},{data_list});
        if(result){
            notification.success({message: '修改文档成功！',duration: 2});
        }else{
            notification.error({message: '修改文档失败！',duration: 2});
        }
    }

    //不通过
    async reject() {
        const { wk } = this.props
        const { actions: { deleteWorkflow } } = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent(
            {
                pk:wk.id
            },
            {
                state:wk.current[0].id,
                executor:executor,
                action:"退回",
                note:"不通过",
                attachment:null
            }
        );
        notification.success({
            message:"操作成功!",
            duration:2
        })
    }
}

const modalTitle = {
    create: '填报审核',
    strike: '删除审核',
    change: '变更审核'
}
const modalName = {
    create: 'safety_vedioInfoCheck_visible',
    strike: 'safety_vedioInfoDeleteCheck_visible',
    change: 'safety_vedioInfoChangeCheck_visible'
}