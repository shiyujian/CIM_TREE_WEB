import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Cards} from 'antd';
import * as actions from '../store/entry';
import moment from 'moment';
import {PkCodeTree} from '../components';
import {ScheduleTable} from '../components/Scheduleanalyze';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {groupBy} from 'lodash';
import LeftTop from '../components/Scheduleanalyze/LeftTop';
import RightTop from '../components/Scheduleanalyze/RightTop';
import MiddleTop from '../components/Scheduleanalyze/MiddleTop';
import Bottom from '../components/Scheduleanalyze/Bottom';


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
            leftkeycode: 'P009',
            section: '',
            smallclass: '',
            data:[],
            account:"",
            biaoduan:[],
            shuzhi:[],
        }
    }

    async componentDidMount() {
        const {actions: {getProjectList}, treetypes,platform:{tree = {}}} = this.props; 
    
        if(!tree.projectList){
            let data = await getProjectList()
            if(data && data instanceof Array && data.length>0){
                data = data[0]
                let leftkeycode = data.No? data.No :''
                this.setState({
                    leftkeycode
                })
            }
        }else{
            let data = tree.projectList
            if(data && data instanceof Array && data.length>0){
                data = data[0]
                let leftkeycode = data.No? data.No :''
                this.setState({
                    leftkeycode
                })
            }
        }
    }
    //树选择, 重新获取: 标段、树种并置空
    onSelect(value = []) {
        console.log('onSelect  value',value)
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype}} =this.props;
        setkeycode(keycode);
        console.log('ScheduleanalyzeScheduleanalyze',keycode)
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
    }

    render() {
        const {
            sectionoption,
            leftkeycode,
            smallclassoption,
            section,
            smallclass,
        } = this.state;
        const {platform:{tree={}},keycode} = this.props;
        let treeList = [];
        if(tree.projectList){
            treeList = tree.projectList
        }
        console.log('tree',tree)
        return (
            <Body>
                <Main>
                    <DynamicTitle title="种植进度分析" {...this.props}/>
                    <Sidebar>
                        <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)}
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
                        <Row gutter={10} style={{margin: '10px 5px'}}>
                            <Col span={8}>
                                <LeftTop  {...this.props} {...this.state}/>
                            </Col>
                            <Col span={8}>
                                <MiddleTop  {...this.props} {...this.state}/>
                            </Col>
                            <Col span={8}>
                                <RightTop  {...this.props} {...this.state}/>
                            </Col>
                        </Row>
                        <Row gutter={10} style={{margin: '10px 5px'}}>
                            <Col span={24}>
                                <Bottom   {...this.props} {...this.state}/>
                            </Col>
                        </Row>
                        
                        
                    </Content>
                </Main>
            </Body>
        );
    }


    //标段选择, 重新获取: 小班、细班、树种
    sectionselect(value,treety) {
        const {actions:{setkeycode, getTreeList}} =this.props;
        const {leftkeycode} = this.state;
        setkeycode(leftkeycode)
        //小班
        this.setState({section:value});
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
            this.setState({sectionoption: sectionOptions,section:sectionList[0]})
        }
    }

    //设置小班选项
    setSmallClassOption(rst,biaoduan){
        if(rst instanceof Array){
            let smallclassList = [];
            let smallclassOptions = [];
            let smallclassoption = rst.map(item => {
                if (item.Section === biaoduan){
                if(item.Name) {
                    let smalls = item.Name.replace("号小班","");
                     if (smalls < 100) {
                            smalls = "0" + smalls;
                        }
                    smallclassList.push(smalls)
                }
            }
            })
            smallclassList.map(small => {
                smallclassOptions.push(<Option key={small} value={small}>{small}</Option>)
            })
            this.setState({smallclassoption: smallclassOptions, smallclass: smallclassList[0]})
        }
    }
}
