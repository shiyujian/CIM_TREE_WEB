import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store';
import {actions as platformActions} from '_platform/store/global';
import {Cards,PkCodeTree} from '../components';
import {QualityTable} from '../components/Qualityanalyze';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Row, Col, Input, Icon, DatePicker,Select,Spin} from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
const {RangePicker} = DatePicker;
const Option = Select.Option;
var echarts = require('echarts');

@connect(
	state => {
		const {platform} = state || {};
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Qualityanalyze extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	treeLists: [],
        	sectionoption: [],
        	leftkeycode: '',
            section: '',
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
	}

    //设置标段选项
    setSectionOption(rst){
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
            sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({sectionoption: sectionOptions})
        }
    }
    
	render() {
        const {keycode} = this.props;
        const {
            leftkeycode,
            treeLists,
            sectionoption,
            section,
        } = this.state;
		return (
			<Body>
				<Main>
					<DynamicTitle title="种植质量分析" {...this.props}/>
					<Sidebar>
						<PkCodeTree treeData={treeLists}
							selectedKeys={leftkeycode}
							onSelect={this.onSelect.bind(this)}
							onExpand={this.onExpand.bind(this)}
						/>
					</Sidebar>
					<Content>
						<QualityTable
						 key={leftkeycode}
						 {...this.props} 
						 sectionoption={sectionoption}
                         section={section}
						 leftkeycode={leftkeycode}
						/>
					</Content>
				</Main>
			</Body>
		);
	}

    //树选择
	onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{getTree}} =this.props;
        this.setState({leftkeycode:keycode})
        //标段
        getTree({},{parent:keycode})
        .then(rst => {
            this.setSectionOption(rst)
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