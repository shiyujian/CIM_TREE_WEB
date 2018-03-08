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
        // 避免反复获取森林树种列表，提高效率
        if(!treetypes){
            getTreeList()
        }
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
        if(tree.treeList){
            treeList = tree.treeList
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
        
        //标段
        getTree({},{parent:keycode})
        .then(rst => {
            this.setSectionOption(rst)
        })

        let treedata = {
            no:value,
        }
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

    //设置标段选项
    setSectionOption(rst){
        console.log('rst',rst)
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
            console.log('sectionoption',sectionoption)
            this.setState({sectionoption: sectionOptions})
        }
    }

    // onSelect(value = []) {
        // let keycode = value[0] || '';
        // const {actions:{getTreeList,gettreetype}} =this.props;
        // this.setState({leftkeycode:keycode})
        // //树种
        // gettreetype()
        // .then(rst => {
        //     let res = groupBy(rst, function(n){
        //         return n.Section
        //     });
        //     let biaoduan = Object.keys(res);
        //     let trees = [];
        //     // let qaz = 0;
        //     let wsx = [];
        //     trees = Object.entries(res);
        //     for(var j = 0 ; j<=trees.length-1; j++){
        //           var abc = trees[j][1];
        //          let qaz = 0;
        //           for(var k = 0 ; k<=abc.length-1; k++){
        //              qaz = qaz + abc[k].Num;
        //           }
        //            wsx.push(qaz);
        //     }
        //     let Num1 = 0;
        //         for(var i = 0; i<=rst.length-1; i++){
        //             Num1 = Num1 + rst[i].Num;
        //         }
        //     this.setState({
        //         data:res,
        //         account:Num1,
        //         biaoduan:biaoduan,
        //         shuzhi:wsx,
        //     })
        // })
    // }

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