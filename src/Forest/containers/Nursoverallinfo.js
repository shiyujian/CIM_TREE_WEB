import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {NursOverallTable} from '../components/Nursoverallinfo';
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
export default class Nursoverallinfo extends Component {
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
            roleoption:[],
            statusoption: [],
            locationoption: [],
            leftkeycode: '',
            bigType: '',
            resetkey: 0,
            options: [],
        }
    }
    componentDidMount() {
        const {actions: {getTree,gettreetype,getTreeList,getForestUsers,getTreeNodeList}, users, treetypes} = this.props;
        // 避免反复获取森林用户数据，提高效率
        if(!users){
            getForestUsers();
        }
        // 避免反复获取森林树种列表，提高效率
        if(!treetypes){
            getTreeList().then(x => this.setTreeTypeOption(x));
        }
        getTreeNodeList()
        //地块树
        // try {
        //     getTree({},{parent:'root'})
        //     .then(rst => {
        //         if(rst instanceof Array && rst.length > 0){
        //             rst.forEach((item,index) => {
        //                 rst[index].children = []
        //             })
        //             getTree({},{parent:rst[0].No})
        //             .then(rst1 => {
        //                 if(rst1 instanceof Array && rst1.length > 0){
        //                     rst1.forEach((item,index) => {
        //                         rst1[index].children = []
        //                     })
        //                     getNewTreeData(rst,rst[0].No,rst1)
        //                     getTree({},{parent:rst1[0].No})
        //                     .then(rst2 => {
        //                         if(rst2 instanceof Array && rst2.length > 0){
        //                             getNewTreeData(rst,rst1[0].No,rst2)
        //                             this.setState({treeLists:rst},() => {
        //                                 this.onSelect([rst2[0].No])
        //                             })
        //                             // getNewTreeData(rst,rst[0].No,rst2)
        //                             // getTree({},{parent:rst2[0].No})
        //                             // .then(rst3 => {
        //                             //     if(rst3 instanceof Array && rst3.length > 0){
        //                             //         getNewTreeData(rst,rst2[0].No,rst3)
        //                             //         this.setState({treeLists:rst},() => {
        //                             //             this.onSelect([rst3[0].No])
        //                             //         })
        //                             //     } else {
        //                             //         this.setState({treeLists:rst})
        //                             //     }
        //                             // })
        //                         } else {
        //                             this.setState({treeLists:rst})
        //                         }
        //                     })
        //                 }else {
        //                     this.setState({treeLists:rst})
        //                 }
        //             })
        //         }
        //     })
        // } catch(e){
        //     console.log(e)
        // }
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
        //角色
        let roleoption = [
            <Option key={'-1'} value={'person'}>全部</Option>,
            <Option key={'1'} value={'inputer'}>测量人</Option>,
            <Option key={'2'} value={'supervisor'}>监理人</Option>,
            <Option key={'3'} value={'checker'}>抽查人</Option>,
        ];
        this.setState({roleoption});
    }

	render() {
  		const {keycode} = this.props;
  		const {
            leftkeycode,
            treetypeoption,
            treetypelist,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            bigType,
            roleoption,
            statusoption,
            locationoption,
            resetkey,
        } = this.state;
        const {treeList} = this.props;
        return (
				<Body>
					<Main>
						<DynamicTitle title="苗木综合信息" {...this.props}/>
						<Sidebar>
							<PkCodeTree treeData={treeList}
								selectedKeys={leftkeycode}
								onSelect={this.onSelect.bind(this)}
								// onExpand={this.onExpand.bind(this)}
							/>
						</Sidebar>
						<Content>
							<NursOverallTable 
                             key={resetkey} 
                             {...this.props} 
                             sectionoption={sectionoption}
                             sectionselect={this.sectionselect.bind(this)}
                             smallclassoption={smallclassoption}
                             smallclassselect={this.smallclassselect.bind(this)}
                             thinclassoption={thinclassoption}
                             thinclassselect={this.thinclassselect.bind(this)}
                             bigType={bigType}
                             typeoption={typeoption}
                             typeselect={this.typeselect.bind(this)}
                             treetypeoption={treetypeoption} 
                             treetypelist={treetypelist}
                             statusoption={statusoption}
                             locationoption={locationoption}
                             roleoption={roleoption}
                             leftkeycode={leftkeycode}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
						</Content>
					</Main>
				</Body>);
	}
    //标段选择, 重新获取: 小班、细班、树种
    sectionselect(value) {
        const {actions:{setkeycode, getTree}} =this.props;
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
        this.typeselect('');
    }

    //小班选择, 重新获取: 细班、树种
    smallclassselect(value,section) {
        const {actions:{setkeycode,getTree}} =this.props;
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
        this.typeselect('');
    }

    //细班选择, 重新获取: 树种
    thinclassselect(value,section) {
        const {actions:{setkeycode}} =this.props;
        setkeycode(value);
        //树种
        this.typeselect('');
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
    //截取后的细班
    // setThinClassOption(rst){
    //     console.log('rst',rst)
    //     if(rst instanceof Array){
    //         let thinclassList = [];
    //         let thinclassOptions = [];
    //         let thinData = [];
    //         let thinclassoption = rst.map(item => {
    //             if(item.Name) {
    //                 let thins = item.Name;
    //                 thinclassList.push(thins);
    //             }
    //         })
            
    //         thinclassList.map(items => {
    //             thinData.push(items.substr((items.indexOf('班') + 1)))
    //         })
    //         console.log('thinData',thinData)
    //         let thinclassData = [...new Set(thinData)];
    //         thinclassData.sort();
    //         thinclassData.map(thin => {
    //             thinclassOptions.push(<Option key={thin} value={thin}>{thin}</Option>)
    //             // console.log('thinclassOptions',thinclassOptions)
    //         })
    //         thinclassOptions.unshift(<Option key={-1} value={''}>全部</Option>)
    //         this.setState({thinclassoption: thinclassOptions})
    //     }
    // }

    //重置
    resetinput(leftkeycode) {
        this.setState({resetkey:++this.state.resetkey},() => {
            this.onSelect([leftkeycode])
        })
    }

    //树选择, 重新获取: 标段、小班、细班、树种并置空
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
        this.typeselect('');
    }
    //树展开
    // onExpand(expandedKeys,info) {
    // 	const treeNode = info.node;
    //     const {actions: {getTree}} = this.props;
    //     const {treeLists} = this.state;
    //     const keycode = treeNode.props.eventKey;
    //     getTree({},{parent:keycode,paginate:false})
    //     .then(rst => {
    //      	if(rst instanceof Array){
    //             if(rst.length > 0 && rst[0].wptype != '子单位工程') {
    //          		rst.forEach((item,index) => {
    //          			rst[index].children = []
    //          		})
    //             }
    //             getNewTreeData(treeLists,keycode,rst)
    //             this.setState({treeLists:treeLists})
    //      	}
    //     })
    // }
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