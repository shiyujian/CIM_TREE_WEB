import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as safetyGoalActions} from '../store/safetyGoal';
import {actions} from '../store/staticFile';
import {actions as platformActions} from '_platform/store/global';
import {Tabs} from 'antd';
import GoalManage from '../components/SafetyGoal/GoalManage';
import GoalAnalysis from '../components/SafetyGoal/GoalAnalysis';
import GoalCheck from '../components/SafetyGoal/GoalCheck';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
const TabPane = Tabs.TabPane;

@connect(
    state => {
        const {safety:{staticFile = {},safetyGoal={}},platform} = state;
        return {platform,staticFile,safetyGoal}
    },
    dispatch => ({
        actions: bindActionCreators({...actions,...platformActions,...safetyGoalActions}, dispatch)
    })
)

export default class SafetyGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project:{},
            unitProject:{},
            construct:{},
            dataSource:[],
            dataSource1:[],
        }
    }
    componentDidMount(){
        const { 
            actions: { 
                getProjectTree,
                getWorkpackagesByCode,
                getSafetyGoal,
                getPersonSafetyGoal
            } 
        } = this.props;
        let datas = [];
        let datas1 = [];
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                let project=rst.children;
                let unitProject = {};
                for(var i=0;i<project.length;i++){
                    if(project[i].children.length>0){
                        unitProject=project[i].children[0];
                        this.setState({
                            unitProject:unitProject,
                            project:project[i],
                        });
                        getWorkpackagesByCode({code:unitProject.code}).then(rst =>{
                            if(rst.code){
                                if(rst.extra_params && rst.extra_params.unit){
                                    for(let i=0;i<rst.extra_params.unit.length;i++){
                                        if(rst.extra_params.unit[i].type==="施工单位/C"){
                                            this.setState({construct:rst.extra_params.unit[i]});
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                        getSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.id = item.id;
                                data.value = item.goal;
                                data.content = item.content;
                                datas.push(data);
                            });
                            this.setState({dataSource:datas});
                        });
                        getPersonSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.id = item.id;
                                data.value = item.goal;
                                data.content = item.content;
                                data.people = item.responsor.name;
                                datas1.push(data);
                            });
                            this.setState({dataSource1:datas1});
                        });
                        break;
                    }
                }
            }
        });
    }
    callback(key) {
        console.log(key);
    }

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getWorkpackagesByCode,
                getSafetyGoal,
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
            getWorkpackagesByCode({code:unitProject.code}).then(rst =>{
                if(rst.code){
                    if(rst.extra_params && rst.extra_params.unit){
                        for(let i=0;i<rst.extra_params.unit.length;i++){
                            if(rst.extra_params.unit[i].type==="施工单位/C"){
                                this.setState({construct:rst.extra_params.unit[i]});
                                break;
                            }
                        }
                    }
                }
            });
            let datas = [];
            getSafetyGoal({},{project_unit_pk:unitProject.pk}).then(rst=>{
                rst.map(item=>{
                    let data = {};
                    data.id = item.id;
                    data.value = item.goal;
                    data.content = item.content;
                    datas.push(data);
                });
                this.setState({dataSource:datas});
            });
        }else{
            return;
        }
    };
    render() {
        return (
            <div>
                <DynamicTitle title="安全目标" {...this.props} />
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="安全目标管理" key="1">
                            <GoalManage {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="目标分解" key="2">
                            <GoalAnalysis {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="目标考核" key="3">
                            <GoalCheck {...this.props} {...this.state}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
            
        );
    }
}