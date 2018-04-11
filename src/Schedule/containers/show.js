import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';

import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import {Tabs,Table,Row,Col,Card,Checkbox,Progress} from 'antd';
import LeftTop from '../components/Item/LeftTop'
import LeftBottom from '../components/Item/LeftBottom'
import RightBottom from '../components/Item/RightBottom'
import RightTop from '../components/Item/RightTop'
import {PkCodeTree, Cards} from '../components';
import {actions as platformActions} from '_platform/store/global';
import * as actions from '../store/entry';
// var echarts = require('echarts');
// var myChart
// var myChart3
// var myChart2
const TabPane = Tabs.TabPane;
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
            item:null,
             progress:50,
             isUploading: false,
             treetypeoption: [],
            treetyoption: [],
            treetypelist: [],
            treeLists: [],
            sectionoption: [],
            leftkeycode: '',
		};
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
        let {progress,isUploading} = this.state;
	    console.log(this.props);
        console.log(this.state);
        // const {keycode} = this.props;
        const {
            treetypeoption,
            treetypelist,
            treetyoption,
            treeLists,
            sectionoption,
            leftkeycode,
        } = this.state;
        const {platform:{tree={}},keycode} = this.props;
        let treeList = [];
        if(tree.projectList){
            treeList = tree.projectList
        }
		return (
			<div>
                <DynamicTitle title="种植进度展示" {...this.props}/>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                    <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}
                            />
                    </div>
                </Sidebar>
                <Content>
                    <iframe src='/treemapdemo/navigation.html' style={{height:'810',width:'100%'}}></iframe>
                    {/* <video src=" " controls="controls" width="600" height="600"></video>
                    <Row>
                    <Col span={3}>
                    <Checkbox>常绿乔木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                    <Row>
                     <Col span={3}>
                    <Checkbox>落叶乔木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                    <Row>
                     <Col span={3}>
                    <Checkbox>亚乔木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                    <Row>
                     <Col span={3}>
                    <Checkbox>灌木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row> */}
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
