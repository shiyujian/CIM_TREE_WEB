import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';

import {Row, Col, Button, Radio, Modal, message, notification} from 'antd';
const RadioGroup = Radio.Group;
import WorkflowHistory from '../WorkflowHistory';
import {getUser} from '_platform/auth';
import Preview from '../../../_platform/components/layout/Preview';
import VedioTable from './VedioTable';
import moment from 'moment';

import {actions} from '../../store/safety';


@connect(
	state => {
		const {platform} = state;
		return {platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions,...actions}, dispatch)
	})
)

export default class VedioCheck extends Component {
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
        const {wk} = this.props,
            dataSource = JSON.parse(wk.subject[0].data);

		return (
            <Modal
			title="视频监控审批表"
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}
            >
                <Row type='flex' justify='center' >
                    <p className="titleFont">结果审核</p>
                </Row>
                <VedioTable
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
        this.props.closeModal("safety_vedioCheck_visible",false)    //selfcare use
        message.info("操作成功");        
    }

    passon = async ()=>{ //通过
        const {wk} = this.props,
            dataSource = JSON.parse(wk.subject[0].data),
            {topDir} = this.state,
            {actions:{
                logWorkflowEvent,
                addDocList,
                getScheduleDir,
                postScheduleDir,
                getWorkpackagesByCode
            }} = this.props;
        const //{unit:{code:unitCode}} = dataSource[0],
            unitCode = 1112,    //需修改
            scheduleDircode = 'datareport_safety_vediodata'; //I'm unique
        let dir = await getScheduleDir({code:scheduleDircode});
        debugger
        if(!dir.obj_type){  //no such directory
            const {pk, code, obj_type} = await getWorkpackagesByCode({code:unitCode}),
                postDirData = {
                    name: '视频监控目录树',
                    code: scheduleDircode,
                    obj_type: "C_DIR",
                    status: "A",
                    related_objects: [{
                        pk,code,obj_type,
                        rel_type: 'safetydoc_vediodata_dirctory', //we are not same
                    }],
                    parent:{pk:topDir.pk,code:topDir.code,obj_type:topDir.obj_type}
                };

            dir = await postScheduleDir({},postDirData);
        }

        // send workflow
        const  {id,username,name:person_name,code:person_code} = getUser(),
            executor = {id,username,person_name,person_code};
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor,attachment:null});

        const docData = dataSource.map(item =>{ //prepare the data which will store in database
            const {cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode} = item,
                extra_params = {cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode};

            return {
                code:'vedioData'+moment().format("YYYYMMDDHHmmss")+item.index,  //makesure code is unique
                name:cameraName,
                obj_type:"C_DOC",
                status:'A',
                profess_folder: {code: dir.code, obj_type: 'C_DIR'},
                extra_params
            }
        })

        const {result} = await addDocList({},{data_list:docData});
        if(result){
            notification.success({ message: '创建文档成功！',duration: 2});
        }else{
            notification.error({message: '创建文档失败！',duration: 2});
        }
    }

    reject = async ()=>{    //不通过
        const {wk} = this.props
        const {actions:{deleteWorkflow}} = this.props
        await deleteWorkflow({pk:wk.id})
    }
}