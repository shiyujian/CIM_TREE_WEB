import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';

import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import {Tabs,Table,Row,Col,Card,DatePicker} from 'antd';
import LeftTop from '../components/Item/LeftTop'
import LeftBottom from '../components/Item/LeftBottom'
import RightBottom from '../components/Item/RightBottom'
import RightTop from '../components/Item/RightTop'
import moment from 'moment';
import {PkCodeTree, Cards} from '../components';
import {actions as platformActions} from '_platform/store/global';
import * as actions from '../store/entry';
// var echarts = require('echarts');
// var myChart
// var myChart3
// var myChart2
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
@connect(
	state => {
		const {platform} = state || {};
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch)
	})
)
export default class Proprogress extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
            leftkeycode: '',
		};
    }
    componentDidMount () {
        const {
            actions: {
            gettreetype,getTreeList,getProjectList,getNurserysCount
            },
            treetypes,
            platform:{tree = {}}
        } = this.props;
    
        if(!tree.projectList){
            getProjectList()
        }
        this.setState({
            leftkeycode:"P009"
        })
    }
    
	//树选择
    onSelect(value = []) {
        console.log('onSelect  value',value)
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype}} =this.props;
        setkeycode(keycode);
        this.setState({leftkeycode:keycode})
    }


	render() {
        const {
            leftkeycode,
        } = this.state;
        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.projectList){
            treeList = tree.projectList
        }
        console.log('tree',tree)
	    
		return (
			<div>
                <DynamicTitle title="项目进度" {...this.props}/>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                       <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            //  onExpand={this.onExpand.bind(this)}
                            />
                    </div>
                </Sidebar>
                <Content>
                    <Row gutter={10} style={{margin: '10px 5px'}}>
                        <Col span={12}>
                            <LeftTop  {...this.props} {...this.state}/>
                        </Col>
                        <Col span={12}>
                            <RightTop  {...this.props} {...this.state}/>
                        </Col>
                    </Row>
                    <Row gutter={10} style={{margin: '10px 5px'}}>
                        {/* <Col span={12}>
                            <LeftBottom   {...this.props} {...this.state}/>
                        </Col> */}
                        <Col span={24}>
                            <RightBottom  {...this.props} {...this.state}/>
                        </Col>
                    </Row>
                </Content>
			</div>);
	}
}




