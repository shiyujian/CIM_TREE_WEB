import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Col, Input, Icon, DatePicker, Select} from 'antd';
import * as actions from '../store/entry';
import {PkCodeTree, Cards} from '../components';
import {EntryTable} from '../components/Enteranalyze';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import moment from 'moment';
import {groupBy} from 'lodash';

var echarts = require('echarts');
const Option = Select.Option;
const {RangePicker} = DatePicker;

@connect(
	state => {
		const {platform} = state || {};
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Enteranalyze extends Component {

    constructor(props) {
        super(props)
        this.state = {
            treetypelist: [],
            treeLists: [],
            sectionoption: [],
            leftkeycode: '',
            data:[],
            account:"",
            biaoduan:[],
            shuzhi:[],
        }
    }

    componentDidMount () {
        const {actions: {getTree,getTreeList,getTreeNodeList}, treetypes,platform:{tree = {}}} = this.props; 
    
        if(!tree.treeList){
            getTreeNodeList()
        }
        this.setState({
            leftkeycode:"P009-01"
        })
       
    }

	render() {
       
  		const {keycode} = this.props;
        const {
            treetypelist,
            sectionoption,
            leftkeycode,
        } = this.state;
        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.bigTreeList){
            treeList = tree.bigTreeList
        }
        console.log('tree',tree)
		return (
            <Body>
                <Main>
                    <DynamicTitle title="苗木进场分析" {...this.props}/>
                    <Sidebar>
                        <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <EntryTable
                         key={leftkeycode}
                         {...this.props}
                         {...this.state}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

   

     //树选择
    //树选择, 重新获取: 标段、树种并置空
    onSelect(value = []) {
        console.log('onSelect  value',value)
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTree}} =this.props;
        setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
    }
}