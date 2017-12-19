/**
 * Created by tinybear on 17/9/27.
 */

import React,{Component} from 'react';
import {Row,Col,Select,Button,DatePicker,Card} from 'antd';
import UserTreeSelect  from '../UserTreeSelect';
import {transUser} from '../util';
import './style.less';
const {Option} = Select;
const {  RangePicker } = DatePicker;


class QueryBox extends Component{
    state={
        designUnit:{},
        designStage:'',
        drawingChUnit:{},
        modelChUnit:{},
        planWriter:'',
        drawingChecker:'',
        modelChecker:'',
        startTime:null,
        endTime:null,
        clearUser:''
    };

    onQuery=()=>{
        let {designUnit,designStage,drawingChUnit,modelChUnit,drawingChecker,planWriter,modelChecker} = this.state;
        //生成查询条件
        let query = {};
        if(designUnit && designUnit.code){
            query.subject_design_unit__contains = designUnit.code;
        }
        if(designStage){
            query.subject_stage__contains = designStage;
        }
        if(drawingChUnit && drawingChUnit.code){
            query.subject_drawing_ch_unit__contains = drawingChUnit.code;
        }
        if(modelChUnit && modelChUnit.code){
            query.subject_modal_ch_unit__contains = modelChUnit.code;
        }
        if(drawingChecker ){
            query.subject_drawing_checker__contains = drawingChecker.username;
        }
        if(modelChecker ){
            query.subject_model_checker__contains = modelChecker.username;
        }
        if(planWriter){
            query.subject_plan_writer__contains  =planWriter.username;
        }
        const {onQuery } = this.props;
        onQuery(query);
    };

    componentWillMount(){
        this.getDesignStage();
    }

    getDesignStage = ()=>{
        const {getDesignStage} = this.props.actions;
        const {designStageEnum} = this.props.plan;
        if(!designStageEnum){
            getDesignStage();
        }
    };

    reset=()=>{
        this.setState({
            designUnit:{},
            designStage:'',
            drawingChUnit:{},
            modelChUnit:{},
            planWriter:'',
            drawingChecker:'',
            modelChecker:'',
            startTime:null,
            endTime:null,
            clearUser:''
        });
    };

    render(){
        let {designUnit,drawingChUnit,modelChUnit,drawingChecker,clearUser,planWriter,modelChecker} = this.state;
        let {project,unitProject} = this.props;
        const {relateOrgs=[],designStageEnum=[]} = this.props.plan;
        return (
        <Card style={{marginBottom:10}}>
            <Row className="query-box">
                <Col span={22}>
                <Row style={{margin:'10px 0'}}>
                    <Col span={8}>
                        <label htmlFor="">项目名称:</label>
                        <span >{project?project.label:''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">单位工程:</label>
                        <span >{unitProject?unitProject.label:''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">设计阶段: </label>
                        <Select value={this.state.designStage} size={'small'} style={{ minWidth: 120 }}
                                onChange={(value)=>{
                                        this.setState({designStage:value})
                                    }}>
                            {
                                designStageEnum && Object.keys( designStageEnum).map((v)=> {
                                    return <Option value={v} key={v}>{designStageEnum[v]}</Option>
                                })
                            }
                        </Select>
                    </Col>

                </Row>
                <Row style={{margin:'10px 0'}}>
                    <Col span={8}>
                        <label htmlFor="">设计单位: </label>
                        <Select size={'small'} style={{ minWidth: 120 }}
                                value={designUnit.code}
                                onChange={(value)=>{
                                            let org = relateOrgs.find(rt=>rt.code === value);
                                            this.setState({designUnit:org})
                                        }}>
                            {
                                relateOrgs.map(r=>{
                                    return <Option value={r.code} key={r.code} >{r.name}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">图纸审查单位: </label>
                        <Select size={'small'} style={{ minWidth: 120 }}
                                value={drawingChUnit.code}
                                onChange={(value)=>{
                                            let org = relateOrgs.find(rt=>rt.code === value);
                                            this.setState({drawingChUnit:org})
                                        }}>
                            {
                                relateOrgs.map(r=>{
                                    return <Option value={r.code} key={r.code} >{r.name}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">模型审查单位: </label>
                        <Select size={'small'} style={{ minWidth: 120 }}
                                value={modelChUnit.code}
                                onChange={(value)=>{
                                            let org = relateOrgs.find(rt=>rt.code === value);
                                            this.setState({modelChUnit:org})
                                        }}>
                            {
                                relateOrgs.map(r=>{
                                    return <Option value={r.code} key={r.code} >{r.name}</Option>
                                })
                            }
                        </Select>
                    </Col>

                </Row>
                <Row style={{margin:'10px 0'}}>
                    <Col span={8}>
                        <label htmlFor="">设计负责人:</label>
                        <UserTreeSelect rootCode={designUnit.code} placeholder=""
                                        value={planWriter}
                                        onSelect={(user)=>{
                                             this.setState({planWriter:transUser(user)});
                                        }}></UserTreeSelect>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">图纸审查负责人:</label>
                        <UserTreeSelect rootCode={drawingChUnit.code} placeholder=""
                                        value={drawingChecker}
                                        onSelect={(user)=>{
                                             this.setState({drawingChecker:transUser(user)});
                                        }}></UserTreeSelect>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">模型审查负责人:</label>
                        <UserTreeSelect rootCode={modelChUnit.code} placeholder=""
                                        value={modelChecker}
                                        onSelect={(user)=>{
                                             this.setState({modelChecker:transUser(user)});
                                        }}></UserTreeSelect>
                    </Col>
                    {/*<Col span={8}>
                        <label htmlFor="">交付时间:</label>
                        <RangePicker onChange={(dates)=>{
                        console.log(dates)
                            if(dates && dates.length){
                                this.setState({startTime:dates[0],endTime:dates[1]});
                            }
                        }}  size="small" style={{width:170}}/>
                    </Col>*/}
                </Row>
                </Col>
                <Col span={2}>
                    <Row>
                        <Button size="small" style={{marginTop:10}} onClick={this.onQuery}>查询</Button>
                    </Row>
                    <Row>
                        <Button size="small" style={{marginTop:10}} onClick={this.reset}>重置</Button>
                    </Row>
                </Col>
            </Row>
        </Card>
        )
    }
}

export  default QueryBox;