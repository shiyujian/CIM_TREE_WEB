/**
 * Created by tinybear on 17/8/15.
 */

import React,{Component} from 'react';
import ProjectUnitTree from '_platform/components/panels/ProjectUnitTree';

class ScheduleProjectTree extends Component{

    componentDidMount(){
        const {getProjectTree} = this.props.actions;
        const {onLoad} = this.props;
        getProjectTree({},{depth:4}).then(()=>{
            onLoad&&onLoad();
        });
    }

    selectProject=(keys)=>{
        const {
            platform:{wp:{projectTree=[]}={}}
        } = this.props;
        let key = keys[0];
        let project = null;
        let unitProject = null;
        let isFind = false;
        projectTree.forEach(p1=>{
            if(!isFind){
                for(var i=0;i<p1.children.length;i++){
                    let p2=p1.children[i];
                    if(p2.value === key){
                        isFind = true;
                        project = p2;
                        break;
                    }
                    for(var t=0;t<p2.children.length;t++){
                        let p3=p2.children[t];
                        if(p3.value === key){
                            isFind = true;
                            project = p2;
                            unitProject = p3;
                            break;
                        }
                    }
                }
                
            }
        });
        const {onSelect} = this.props;
        onSelect(project,unitProject);
    }

    render(){
        const {
            platform:{wp:{projectTree=[]}={}}
        } = this.props;

        return (<ProjectUnitTree dataSource={projectTree} onSelect={this.selectProject}></ProjectUnitTree>)
    }
}

export default ScheduleProjectTree;
