import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as responsibilityAtions} from '../store/responsibilitySystem';
import {actions} from '../store/staticFile';
import {actions as platformActions} from '_platform/store/global';
import {Tabs} from 'antd';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import Responsibility from '../components/ResponsibilitySystem/Responsibility';
import ResponsibilityCheck from '../components/ResponsibilitySystem/ResponsibilityCheck';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {safety:{staticFile = {},responsibilitySystem={}},platform} = state;
		return {platform,staticFile,responsibilitySystem}
	},
	dispatch => ({
		actions: bindActionCreators({...actions,...platformActions,...responsibilityAtions,...previewActions}, dispatch)
	})
)

export default class ResponsibilitySystem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project:{},
            unitProject:{},
            construct:{},
            dataSource:[],
        }
    }
    componentDidMount() {
        
    }
    callback(key) {
        console.log(key);
    }
    
    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getWorkpackagesByCode,
                getResponsibility,
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
            getResponsibility({},{project_unit_pk:unitProject.pk}).then(rst=>{
                debugger
                rst.map(item=>{
                    let data = {};
                    data.responsible = item.responsor.name;
                    data.duties = item.responsor.duty;
                    data.responsibilities = item.duty;
                    data.attachment = item.response_docs[0];
                    data.id = item.id;
                    datas.push(data);
                });
                this.setState({setVisible:false,dataSource:datas});
            });
        }else{
            return;
        }
    };

    render() {
        return (
            <div>
                <DynamicTitle title="安全责任制" {...this.props} />
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="安全责任制" key="1">
                            <Responsibility {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="安全责任制考核" key="2">
                            <ResponsibilityCheck {...this.props} {...this.state}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
        );
    }
}