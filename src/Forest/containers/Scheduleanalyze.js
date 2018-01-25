import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Cards} from 'antd';
import * as actions from '../store';
import moment from 'moment';
import {PkCodeTree} from '../components';
import {ScheduleTable} from '../components/Scheduleanalyze';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';

var echarts = require('echarts');
const {RangePicker} = DatePicker;
const Option = Select.Option;

@connect(
	state => {
		const {platform} = state || {};
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Scheduleanalyze extends Component {

    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            leftkeycode: '',
            section: '',
            smallclass: '',
        }
    }

    componentDidMount () {
        const {actions: {getTree,getTreeList}} = this.props;

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
    }

	render() {
        const {keycode} = this.props;
        const {
            treeLists,
            sectionoption,
            leftkeycode,
            smallclassoption,
            section,
            smallclass,
        } = this.state;
		return (
			<Body>
				<Main>
					<DynamicTitle title="种植进度分析" {...this.props}/>
					<Sidebar>
						<PkCodeTree treeData={treeLists}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}
						/>
					</Sidebar>
					<Content>
                        <ScheduleTable
                            key={leftkeycode}
                            {...this.props} 
                            sectionoption={sectionoption}
                            section={section}
                            leftkeycode={leftkeycode}
                            smallclassoption={smallclassoption}
                            sectionselect={this.sectionselect.bind(this)}
                            smallclass={smallclass}
                        />
					</Content>
				</Main>
			</Body>
		);
	}
    //标段选择, 重新获取: 小班、细班、树种
    sectionselect(value) {
        const {actions:{setkeycode,getTree}} = this.props;
        const {leftkeycode} = this.state;
        this.setState({section:value})
        //小班
        getTree({},{parent:leftkeycode})
        .then(rst => {
            let smallclasses = [];
            let smallclassList = [];
            let smallclassOptions = [];
            rst.map((item, index) => {
                if(rst[index].Section == value) {
                    let smallname = {
                        Name: rst[index].Name,
                    }
                    smallclasses.push(smallname)
                }
            })
            let smallclassoption = smallclasses.map(item => {
                if(item.Name) {
                    let smallName = item.Name.replace("号小班","");
                    smallclassList.push(smallName);
                }
            })
            smallclassList.map(small => {
                smallclassOptions.push(<Option key={small} value={small}>{small}</Option>)
            })
            this.setState({smallclassoption: smallclassOptions, smallclass: smallclassList[0]})
        })
    }
     //树选择
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{getTree}} =this.props;
        this.setState({leftkeycode:keycode})
        //标段
        getTree({},{parent:keycode})
        .then(rst => {
            console.log('rst1',rst)
            if(rst instanceof Array){
                let sectionList = [];
                let sectionOptions = [];
                let sectionoption = rst.map((item, index) => {
                    if(item.Section) {
                        let sections = item.Section;
                        sectionList.push(sections);
                    }
                })
                let sectionData = [...new Set(sectionList)];
                sectionData.sort();
                sectionData.map(sec => {
                    sectionOptions.push(<Option key={sec} value={sec}>{sec}</Option>)
                })
                 // 小班默认值
                getTree({},{parent:keycode})
                .then(rst => {
                    let smallclasses = [];
                    let smallclassList = [];
                    let smallclassOptions = [];
                    rst.map((item, index) => {
                        if(rst[index].Section == "1标段") {
                            let smallname = {
                                Name: rst[index].Name,
                            }
                            smallclasses.push(smallname)
                        }
                    })
                    let smallclassoption = smallclasses.map(item => {
                        if(item.Name) {
                            let smallName = item.Name.replace("号小班","");
                            smallclassList.push(smallName);
                        }
                    })
                    smallclassList.map(small => {
                        smallclassOptions.push(<Option key={small} value={small}>{small}</Option>)
                    })
                    this.setState({smallclassoption: smallclassOptions, smallclass: smallclassList[0]})
                })
                this.setState({sectionoption: sectionOptions,section:rst[0].Section})
            }
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