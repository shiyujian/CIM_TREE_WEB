import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Cards} from 'antd';
import * as actions from '../store';
import moment from 'moment';
import {PkCodeTree} from '../components';
import {FaithTable} from '../components/Faithanalyze';
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
export default class Faithanalyze extends Component {

    constructor(props) {
        super(props)
        this.state = {
            treetypeoption: [],
            treetyoption: [],
            treeLists: [],
            sectionoption: [],
            leftkeycode: '',
            section: '',
            treetypelist: [],
        }
    }

    componentDidMount () {
        const {actions: {getTree, getTreeList, gettreetype}} = this.props;

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

    render() {
        const {keycode} = this.props;
        const {
            treeLists,
            sectionoption,
            leftkeycode,
            section,
            treetypeoption,
            treetyoption,
            treetypelist,
        } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title="诚信供应商分析" {...this.props}/>
                    <Sidebar>
                        <PkCodeTree treeData={treeLists}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <FaithTable
                            key={leftkeycode}
                            {...this.props} 
                            sectionoption={sectionoption}
                            section={section}
                            leftkeycode={leftkeycode}
                            treetypeoption={treetypeoption}
                            treetyoption={treetyoption}
                            typeselect={this.typeselect.bind(this)}
                            treetypelist={treetypelist}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

    //设置树种选项
    setTreeTypeOption(rst) {
        if(rst instanceof Array){
            let treetypeoption = rst.map(item => {
                return <Option key={item.TreeTypeNo} value={item.TreeTypeName}>{item.TreeTypeName}</Option>
            })
            treetypeoption.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({treetypeoption,treetypelist:rst})
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
    
     //树选择
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{getTree, gettreetype}} =this.props;
        this.setState({leftkeycode:keycode})
        //标段
        getTree({},{parent:keycode})
        .then(rst => {
            this.setSectionOption(rst)
        })
        //树种
        gettreetype()
        .then(rst => {
            if(rst instanceof Array){
                this.setTreeTypeOption(rst)
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

    //类型选择, 重新获取: 树种
    typeselect(value,keycode){
        const {actions:{setkeycode,gettreetype}} =this.props;
        //树种
        gettreetype()
        .then(rst => {
            if(rst instanceof Array){
                this.setTreeTypeOption(rst)
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