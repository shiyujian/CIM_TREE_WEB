import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {ContrastTable} from '../components/Contrastinfo';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
const Option = Select.Option;
@connect(
    state => {
        const {forest,platform} = state;
        return {...forest,platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch),
    }),
)
export default class Contrastinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            treetypeoption: [],
            treetypelist: [],
            sectionoption: [],
            typeoption: [],
            standardoption: [],
            leftkeycode: '',
            resetkey: 0,
            bigType: '',
        }
    }
    componentDidMount() {
        const {actions: {getTree,getTreeList}, treetypes} = this.props;
        // 避免反复获取森林树种列表，提高效率
        if(!treetypes){
            getTreeList().then(x => this.setTreeTypeOption(x));
        }
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
        let typeoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>常绿乔木</Option>,
            <Option key={'2'} value={'2'}>落叶乔木</Option>,
            <Option key={'3'} value={'3'}>亚乔木</Option>,
            <Option key={'4'} value={'4'}>灌木</Option>,
            <Option key={'5'} value={'5'}>草本</Option>,
        ];
        this.setState({typeoption})
        //合标
        let standardoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>合标</Option>,
            <Option key={'2'} value={'0'}>不合标</Option>,
        ]
        this.setState({standardoption})
    }

    render() {
        const {keycode} = this.props;
        const {
            leftkeycode,
            treeLists,
            treetypeoption,
            treetypelist,
            sectionoption,
            typeoption,
            bigType,
            standardoption,
            resetkey,
        } = this.state;
        return (
                <Body>
                    <Main>
                        <DynamicTitle title="苗木对比信息" {...this.props}/>
                        <Sidebar>
                            <PkCodeTree treeData={treeLists}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                                onExpand={this.onExpand.bind(this)}
                            />
                        </Sidebar>
                        <Content>
                            <ContrastTable  
                             key={resetkey}
                             {...this.props} 
                             sectionoption={sectionoption}
                             sectionselect={this.sectionselect.bind(this)}
                             bigType={bigType}
                             typeoption={typeoption}
                             typeselect={this.typeselect.bind(this)}
                             treetypeoption={treetypeoption} 
                             treetypelist={treetypelist}
                             standardoption={standardoption}
                             leftkeycode={leftkeycode}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
                        </Content>
                    </Main>
                </Body>);
    }
    //标段选择, 重新获取: 树种
    sectionselect(value) {
        const {actions:{setkeycode}} =this.props;
        const {leftkeycode} = this.state;
        setkeycode(leftkeycode)
        //树种
        this.typeselect('');
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

    //类型选择, 重新获取: 树种
    typeselect(value){
        const {treetypes} =this.props;
        this.setState({bigType: value});
        //树种
        this.setTreeTypeOption(treetypes&&treetypes[value] ? treetypes[value] : []);
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
    
    //重置
    resetinput(leftkeycode) {
        this.setState({resetkey:++this.state.resetkey},() => {
            this.onSelect([leftkeycode])
        })
    }

    //树选择, 重新获取: 标段、树种并置空
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTree}} =this.props;
        setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
        
        //标段
        getTree({},{parent:keycode})
        .then(rst => {
            this.setSectionOption(rst)
        })
        //树种
        this.typeselect('');
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