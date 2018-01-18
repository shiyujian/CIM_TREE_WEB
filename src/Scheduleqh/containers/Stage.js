import React, {Component} from 'react';
import {DynamicTitle,Content,Sidebar} from '_platform/components/layout';

import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {getUser} from '_platform/auth';
import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import EditData from '../components/Stage/EditData';
import moment from 'moment';
import {SERVICE_API} from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util';
import './Schedule.less';
import {Link} from 'react-router-dom';
import {WORKFLOW_CODE} from '_platform/api';
import {SMUrl_template11} from '_platform/api';
import EditableCell from '../components/EditableCell';
import EditableCheckbox from '../components/EditableCheckbox';
import queryString from 'query-string';
import Stagereporttab from '../components/stagereport/stagereporttab'
import {PkCodeTree, Cards} from '../components';
import {actions as platformActions} from '_platform/store/global';
import * as actions from '../store/entry';

import {Row, Col,Spin, Card, DatePicker, Upload,Icon,notification,message,
	Input,Button,Modal,Table,Form,Select,Radio,Calendar,Checkbox,Popover,Tabs} from 'antd';
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const {Option} = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@connect(
	state => {
		const {platform} = state || {};
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch)
	})
)

class Stage extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			  treetypeoption: [],
            treetyoption: [],
            treetypelist: [],
            treeLists: [],
            sectionoption: [],
            leftkeycode: '',
		};
	}

	componentDidMount () {
        console.log(this.props,"46546");
        const {actions: {getTree,gettreetype,getTreeList,getNurserysCount}} = this.props;
        //地块树
       try {
            getTree({},{parent:'root'})
            .then(rst => {
                if(rst instanceof Array && rst.length > 0){
                    rst.forEach((item,index) => {
                        rst[index].children = []
                    })
                    getTree({},{parent:rst[0].No})
                    .then(rst1 => {
                        if(rst1 instanceof Array && rst1.length > 0){
                            rst1.forEach((item,index) => {
                                rst1[index].children = []
                            })
                            getNewTreeData(rst,rst[0].No,rst1)
                            getTree({},{parent:rst1[0].No})
                            .then(rst2 => {
                                if(rst2 instanceof Array && rst2.length > 0){
                                    getNewTreeData(rst,rst1[0].No,rst2)
                                    this.setState({treeLists:rst},() => {
                                        this.onSelect([rst2[0].No])
                                    })
                                    // getNewTreeData(rst,rst[0].No,rst2)
                                    // getTree({},{parent:rst2[0].No})
                                    // .then(rst3 => {
                                    //     if(rst3 instanceof Array && rst3.length > 0){
                                    //         getNewTreeData(rst,rst2[0].No,rst3)
                                    //         this.setState({treeLists:rst},() => {
                                    //             this.onSelect([rst3[0].No])
                                    //         })
                                    //     } else {
                                    //         this.setState({treeLists:rst})
                                    //     }
                                    // })
                                } else {
                                    this.setState({treeLists:rst})
                                }
                            })
                        }else {
                            this.setState({treeLists:rst})
                        }
                    })
                }
            })
        } catch(e){
            console.log(e)
        }
        //类型
        let treetyoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>常绿乔木</Option>,
            <Option key={'2'} value={'2'}>落叶乔木</Option>,
            <Option key={'3'} value={'3'}>亚乔木</Option>,
            <Option key={'4'} value={'4'}>灌木</Option>,
            <Option key={'5'} value={'5'}>草本</Option>,
        ];
        this.setState({treetyoption})
    }
    
	onSelect = (project,unitProjecte)=>{
		console.log('project',project);
		console.log('unitProjecte',unitProjecte);
		let me = this;
		//选择最下级的工程
		if(unitProjecte){
			this.setState({
				item:{
					unitProjecte:unitProjecte,
					project:project
				}
			})
		}
    };

	// onSelect(){}

	render() {
        const {keycode} = this.props;
        const {
            treetypeoption,
            treetypelist,
            treetyoption,
            treeLists,
            sectionoption,
            leftkeycode,
        } = this.state;

		return (
			<div>
				<DynamicTitle title="进度填报" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<PkCodeTree treeData={treeLists}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}/>
                        {/*<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)} />*/}
					</div>
				</Sidebar>
				<Content>
					<div>
					<Tabs>
					<TabPane tab="总计划进度" key="1">
					   <Stagereporttab{...this.props}/>
					</TabPane>
					<TabPane tab="每日计划进度" key="2">
						<Stagereporttab{...this.props}/>
					</TabPane>
					<TabPane tab="每日实际进度" key="3">
					    <Stagereporttab{...this.props}/>
					</TabPane>
				    </Tabs>
					</div>
				</Content>
			</div>);
	}
//类型选择, 重新获取: 树种
    typeselect(value,keycode){
        const {actions:{setkeycode,getTreeList}} =this.props;
        //树种
        getTreeList({},{field:'treetype',no:keycode,treety:value,paginate:false})
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

    //设置树种选项
    setTreeTypeOption(rst) {
        if(rst instanceof Array){
            let treetypeoption = rst.map(item => {
                return <Option key={item.name} value={item.name}>{item.name}</Option>
            })
            treetypeoption.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({treetypeoption,treetypelist:rst})
        }
    }

     //树选择
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{getTreeList,gettreetype}} =this.props;
        this.setState({leftkeycode:keycode})
        //树种
        gettreetype({},{no:keycode,paginate:false})
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

    //树展开
    onExpand(expandedKeys,info) {
        const treeNode = info.node;
        const {actions: {getTree}} = this.props;
        const {treeLists} = this.state;
        const keycode = treeNode.props.eventKey;
        getTree({},{parent:keycode,paginate:false})
        .then(rst => {
            if(rst instanceof Array){
                if(rst.length > 0 && rst[0].wptype != '子单位工程') {
                    rst.forEach((item,index) => {
                        rst[index].children = []
                    })
                }
                getNewTreeData(treeLists,keycode,rst)
                this.setState({treeLists:treeLists})
            }
        })
    }
}

//连接树children
function getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey == item.No) {
                item.children = child;
            }else{
                if(item.children)
                    loop(item.children);
            }
        });
    };
    try {
       loop(treeData);
    } catch(e) {
        console.log(e)
    }
}



export default Form.create()(Stage);
