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
            treetypeoption: [],
            treetyoption: [],
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
        const {actions: {gettreeevery}} = this.props;
        gettreeevery().then(rst=>{
            
            // this.setTreeTypeOption(rst);
            let treetypeoption = rst.map(item => {
                return <Option key={item.ID} lable={item.TreeTypeNo} value={item.ID}>{item.TreeTypeNo}</Option>
            })
            treetypeoption.unshift(<Option key={-1} value={''}>全部</Option>)
            
            this.setState({treetypeoption,treetypelist:rst})
        });
        
        const {actions: {getTree,gettreetype,getTreeList}} = this.props;

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
            treetypeoption,
            treetypelist,
            treetyoption,
            treeLists,
            sectionoption,
            leftkeycode,
        } = this.state;
		return (
            <Body>
                <Main>
                    <DynamicTitle title="苗木进场分析" {...this.props}/>
                    <Sidebar>
                        <PkCodeTree treeData={treeLists}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}/>
                    </Sidebar>
                    <Content>
                        <EntryTable
                         key={leftkeycode}
                         {...this.props}
                         data={this.state.data}
                         shuzhi={this.state.shuzhi}
                         biaoduan={this.state.biaoduan}
                         account={this.state.account}
                         sectionoption={sectionoption}
                         leftkeycode={leftkeycode}
                         treetypeoption={this.state.treetypeoption}
                         treetypelist={treetypelist}
                         treetyoption={treetyoption}
                        
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

   

     //树选择
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{getTreeList,gettreetype}} =this.props;
        this.setState({leftkeycode:keycode})
        //树种
        gettreetype()
        .then(rst => {
            let res = groupBy(rst, function(n){
                return n.Section
            });
            let biaoduan = Object.keys(res);
            let trees = [];
            // let qaz = 0;
            let wsx = [];
            trees = Object.entries(res);
            for(var j = 0 ; j<=trees.length-1; j++){
                  var abc = trees[j][1];
                 let qaz = 0;
                  for(var k = 0 ; k<=abc.length-1; k++){
                     qaz = qaz + abc[k].Num;
                  }
                   wsx.push(qaz);
            }
            let Num1 = 0;
                for(var i = 0; i<=rst.length-1; i++){
                    Num1 = Num1 + rst[i].Num;
                }
            this.setState({
                data:res,
                account:Num1,
                biaoduan:biaoduan,
                shuzhi:wsx,
            })
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