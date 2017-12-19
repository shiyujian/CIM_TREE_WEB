import React ,{Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;


export default class DashPanel extends Component {

    constructor(props){
        super(props);
        this.featureName = this.props.featureName;
        this.originOnCheck = this.props.onCheck;
        this.originOnSelect = this.props.onSelect;
    }

    onCheck(keys){
        this.originOnCheck(keys,this.featureName);
    }

    onSelect(keys){
        this.originOnSelect(keys,this.featureName);
    }
    
    genIconClass(){
        let icClass = "";
        let featureName = this.featureName;
        switch(featureName){
            case 'geojsonFeature_people':
                icClass = "tr-people";
                break;
            case 'geojsonFeature_safety':
                icClass = "tr-safety";
                break;
            case 'geojsonFeature_hazard':
                icClass = "tr-hazard";
                break;
            case 'geojsonFeature_monitor':
                icClass = "tr-monitor";
                break;
            case 'geojsonFeature_area':
                icClass = "tr-area";
                break;
            case 'geojsonFeature_360':
                icClass = 'tr-allview';
                break;
        }
        return icClass;
    }

    loop(p){
        let me = this;
        if(p.disabled){
            return (<TreeNode title={p.properties.name} key={p.key} isLeaf={p.isLeaf} disabled={true}>
                {
                    p.children && p.children.map((m)=> {
                        return me.loop(m);
                    })
                }
            </TreeNode>);
        }else{
            return (<TreeNode title={p.properties.name} key={p.key} isLeaf={p.isLeaf}>
                {
                    p.children && p.children.map((m)=> {
                        return me.loop(m);
                    })
                }
            </TreeNode>);
        }
        
    }

    render() {
        let {content = [],loadData,userCheckKeys} = this.props;
        return (
            <div className={this.genIconClass()}>
                {
                    this.featureName == 'geojsonFeature_people'?(
                        <Tree checkable showIcon={true} onCheck={this.onCheck.bind(this)} showLine
                              onSelect={this.onSelect.bind(this)} defaultExpandAll={true}
                              checkedKeys={userCheckKeys}
                              loadData={loadData}
                    >
                        {
                            content.map((p) => {
                                return this.loop(p);
                            })
                        }
                    </Tree>):(<Tree checkable showIcon={true} onCheck={this.onCheck.bind(this)} showLine
                                    onSelect={this.onSelect.bind(this)} defaultExpandAll={true}
                    >
                        {
                            content.map((p) => {
                                return this.loop(p);
                            })
                        }
                    </Tree>)
                }

            </div>
        );
    }
}
