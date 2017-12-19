/**
 * Created by tinybear on 17/8/15.
 */

import React,{Component} from 'react';
import ProjectUnitTree from '_platform/components/panels/ProjectUnitTree';

class ProjectUnitWrapper extends Component{

    componentDidMount(){
        const {getProjectTree} = this.props.actions;
        const {onLoad} = this.props;
        getProjectTree({},{depth:2}).then(()=>{
            onLoad&&onLoad();
        });
    }

    state={
        selectedKey:''
    };

    selectProject=(keys)=>{
        const {
            platform:{wp:{projectTree=[]}={}}
        } = this.props;
        let key = keys[0];
        let project = null;
        let unitProject = null;
        let isFind = false;
        projectTree.forEach(p1=>{
            // p1.children.forEach(p2=>{
                if(!isFind){
                    project = p1;
                    if(p1.value === key){
                        isFind = true;
                    }
                    p1.children.forEach(p3=>{
                        if(p3.value === key){
                            isFind = true;
                            unitProject = p3;
                        }
                    })
                }
            // });
        });
        if(!isFind) project = null;
        const {onSelect} = this.props;
        onSelect(project,unitProject);
        if(unitProject){
            this.setState({selectedKey:unitProject.value});
        }else if(project){
            this.setState({selectedKey:project.value});
        }else{
            this.setState({selectedKey:''});
        }
    };

    render(){
        const {
            platform:{wp:{projectTree=[]}={}}
        } = this.props;
        const {selectedKey} = this.state;

        return (<ProjectUnitTree dataSource={projectTree}
                                 selectedKey={selectedKey}
                                 onSelect={this.selectProject}></ProjectUnitTree>)
    }
}

export default ProjectUnitWrapper;
