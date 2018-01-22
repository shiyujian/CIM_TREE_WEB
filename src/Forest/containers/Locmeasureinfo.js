import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {LocmeasureTable} from '../components/Locmeasureinfo';
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
export default class Locmeasureinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            treetypeoption: [],
            treetypelist: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            typeoption: [],
            statusoption: [],
            locationoption: [],
            leftkeycode: '',
            resetkey: 0,
        }
    }
    componentDidMount() {
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
        //状态
        let statusoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={"-1"}>待审批</Option>,
            <Option key={'2'} value={"0"}>审批通过</Option>,
            <Option key={'3'} value={"1"}>审批未通过</Option>,
            <Option key={'4'} value={"2"}>抽检未通过</Option>,
            <Option key={'5'} value={"3"}>抽检通过</Option>,
        ]
        this.setState({statusoption})
        //定位 
        let locationoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={"1"}>已定位</Option>,
            <Option key={'2'} value={"0"}>未定位</Option>,
        ]
        this.setState({locationoption})
    }

    render() {
        const {keycode} = this.props;
        const {
            leftkeycode,
            treeLists,
            treetypeoption,
            treetypelist,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            statusoption,
            locationoption,
            resetkey,
        } = this.state;
        return (
                <Body>
                    <Main>
                        <DynamicTitle title="现场测量信息" {...this.props}/>
                        <Sidebar>
                            <PkCodeTree treeData={treeLists}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                                onExpand={this.onExpand.bind(this)}
                            />
                        </Sidebar>
                        <Content>
                            <LocmeasureTable  
                             key={resetkey}
                             {...this.props} 
                             sectionoption={sectionoption}
                             sectionselect={this.sectionselect.bind(this)}
                             smallclassoption={smallclassoption}
                             smallclassselect={this.smallclassselect.bind(this)}
                             thinclassoption={thinclassoption}
                             thinclassselect={this.thinclassselect.bind(this)}
                             typeoption={typeoption}
                             typeselect={this.typeselect.bind(this)}
                             treetypeoption={treetypeoption} 
                             treetypelist={treetypelist}
                             statusoption={statusoption}
                             locationoption={locationoption}
                             leftkeycode={leftkeycode}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
                        </Content>
                    </Main>
                </Body>);
    }
    //标段选择, 重新获取: 小班、细班、树种
    sectionselect(value,treety) {
        const {actions:{setkeycode,getTreeList,getTree}} =this.props;
        const {leftkeycode} = this.state;
        setkeycode(leftkeycode)
        //小班
        getTree({},{parent:leftkeycode})
        .then(rst => {
            let smallclasses = [];
            rst.map((item, index) => {
                if(rst[index].Section == value) {
                    let smallname = {
                        Name: rst[index].Name,
                    }
                    smallclasses.push(smallname)
                }
            })
            this.setSmallClassOption(smallclasses)
        })
        //细班
        getTree({},{parent:leftkeycode})
        .then((rst, index) => {
            let thin = [];
            let promises = rst.map(item => {
                return getTree({}, {parent: item.No})
            })
            Promise.all(promises).then(rest => {
                rest.map(items => {
                    items.map(i => {
                        thin.push(i);
                    })
                })
                this.setThinClassOption(thin)
            })
        })
        //树种
        getTreeList()
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

    //小班选择, 重新获取: 细班、树种
    smallclassselect(value,treety,section) {
        const {actions:{setkeycode,getTree,getTreeList}} =this.props;
        setkeycode(value);
        const {leftkeycode} = this.state;
        //细班
        getTree({},{parent:leftkeycode})
        .then((rst, index) => {
            let thin = [];
            let promises = rst.map(item => {
                return getTree({}, {parent: item.No})
            })
            Promise.all(promises).then(rest => {
                rest.map(items => {
                    items.map(i => {
                        if(i.Name.indexOf(value) !== -1) {
                            let thinnames = {
                                Name: i.Name,
                            }
                            thin.push(thinnames);
                        }
                    })
                })
                this.setThinClassOption(thin)
            })
        })
        //树种
        getTreeList()
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

    //细班选择, 重新获取: 树种
    thinclassselect(value,treety,section) {
        const {actions:{setkeycode,getTreeList}} =this.props;
        setkeycode(value);
        //树种
        getTreeList()
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }
    //类型选择, 重新获取: 树种
    typeselect(value,keycode,section){
        const {actions:{setkeycode,getTreeList}} =this.props;
        setkeycode(value);
        //树种
        getTreeList()
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

    //设置树种选项
    setTreeTypeOption(rst) {
        if(rst instanceof Array){
            let treetypeoption = rst.map(item => {
                return <Option key={item.TreeTypeNo} value={item.TreeTypeNo}>{item.TreeTypeNo}</Option>
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
                console.log('sec',sec)
                sectionOptions.push(<Option key={sec} value={sec}>{sec}</Option>)
            })
            sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({sectionoption: sectionOptions})
        }
    }
    //设置小班选项
    setSmallClassOption(rst){
        if(rst instanceof Array){
            let smallclassList = [];
            let smallclassOptions = [];
            let smallclassoption = rst.map(item => {
                if(item.Name) {
                    let smalls = item.Name;
                    smallclassList.push(smalls);
                }
            })
            let smallclassData = [...new Set(smallclassList)];
            smallclassData.sort();
            smallclassData.map(small => {
                smallclassOptions.push(<Option key={small} value={small}>{small}</Option>)
            })
            smallclassOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({smallclassoption: smallclassOptions})
        }
    }

    // 设置细班选项
    setThinClassOption(rst){
        if(rst instanceof Array){
            let thinclassList = [];
            let thinclassOptions = [];
            let thinclassoption = rst.map(item => {
                if(item.Name) {
                    let thins = item.Name;
                    thinclassList.push(thins);
                }
            })
            let thinclassData = [...new Set(thinclassList)];
            thinclassData.sort();
            thinclassData.map(thin => {
                thinclassOptions.push(<Option key={thin} value={thin}>{thin}</Option>)
            })
            thinclassOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({thinclassoption: thinclassOptions})
        }
    }

    //重置
    resetinput(leftkeycode) {
        this.setState({resetkey:++this.state.resetkey},() => {
            this.onSelect([leftkeycode])
        })
    }

    //树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTreeList,getTree}} =this.props;
        setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
        
        //标段
        getTree({},{parent:keycode})
        .then(rst => {
            this.setSectionOption(rst)
        })

        //小班
        getTree({},{parent:keycode})
        .then(rst => {
            this.setSmallClassOption(rst)
        })

        //细班
        getTree({},{parent:keycode})
        .then((rst, index) => {
            let thin = [];
            let promises = rst.map(item => {
                return getTree({}, {parent: item.No})
            })
            Promise.all(promises).then(rest => {
                rest.map(items => {
                    items.map(i => {
                        thin.push(i);
                    })
                })
                this.setThinClassOption(thin)
            })
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
}
//连接树children
function getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
        console.log('data',data)
        data.forEach((item) => {
            console.log('item',item)
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