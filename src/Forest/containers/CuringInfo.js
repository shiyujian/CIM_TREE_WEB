import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { PROJECT_UNITS } from '_platform/api';
import { CuringTable } from '../components/CuringInfo';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { getUser } from '_platform/auth';
const Option = Select.Option;
@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class CuringInfo extends Component {
    biaoduan = [];
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            leftkeycode: '',
            resetkey: 0,
            curingTypesOption: []
        };
    }
    componentDidMount () {
        this.biaoduan = [];
        for (let i = 0; i < PROJECT_UNITS.length; i++) {
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            });
        }
        const {
            actions: {
                getForestUsers,
                getTreeNodeList,
                getLittleBanAll,
                setkeycode,
                getCuringTypes
            },
            users,
            littleBanAll,
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林用户数据，提高效率
        if (!users) {
            getForestUsers();
        }
        getCuringTypes().then((curingTypesData) => {
            let curingTypes = curingTypesData && curingTypesData.content;
            let curingTypesOption = [];
            try {
                curingTypes.map((type) => {
                    curingTypesOption.push(<Option title={type.Base_Name} key={type.ID} value={type.ID}>{type.Base_Name}</Option>);
                });
                this.setState({
                    curingTypesOption
                });
            } catch (e) {
                console.log('获取养护类型', e);
            }
        });
        if (!tree.bigTreeList) {
            getTreeNodeList();
        }
        if (!littleBanAll) {
            getLittleBanAll();
        }

        setkeycode('');
    }

    render () {
        const { keycode } = this.props;
        const {
            leftkeycode,
            sectionoption,
            smallclassoption,
            thinclassoption,
            resetkey,
            curingTypesOption
        } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='养护信息' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <CuringTable
                            key={resetkey}
                            {...this.props}
                            sectionoption={sectionoption}
                            sectionselect={this.sectionselect.bind(this)}
                            smallclassoption={smallclassoption}
                            smallclassselect={this.smallclassselect.bind(this)}
                            thinclassoption={thinclassoption}
                            thinclassselect={this.thinclassselect.bind(this)}
                            leftkeycode={leftkeycode}
                            keycode={keycode}
                            resetinput={this.resetinput.bind(this)}
                            curingTypesOption={curingTypesOption}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
    sectionselect (value) {
        const {
            actions: { getLittleBan }
        } = this.props;
        this.currentSection = value;
        getLittleBan({ no: value }).then(rst => {
            let smallclasses = [];
            rst.map((item, index) => {
                let smallname = {
                    code: rst[index].SmallClass,
                    name: rst[index].SmallClassName
                        ? rst[index].SmallClassName
                        : rst[index].SmallClass
                };
                smallclasses.push(smallname);
            });
            this.setSmallClassOption(smallclasses);
        });
    }

    // 小班选择, 重新获取: 细班、树种
    smallclassselect (value) {
        const {
            actions: { getLittleBan }
        } = this.props;
        getLittleBan({ no: this.currentSection }).then(rst => {
            let smallclasses = [];
            rst.map((item, index) => {
                if (item.SmallClass === value) {
                    let smallname = {
                        code: rst[index].ThinClass,
                        name: rst[index].ThinClassName
                            ? rst[index].ThinClassName
                            : rst[index].ThinClass
                    };
                    smallclasses.push(smallname);
                }
            });
            this.setThinClassOption(smallclasses);
        });
    }

    // 细班选择, 重新获取: 树种
    thinclassselect (value, section) {
    }

    // 设置标段选项
    setSectionOption (rst) {
        if (rst instanceof Array) {
            let sectionList = [];
            let sectionOptions = [];
            rst.map((item, index) => {
                sectionList.push(item);
            });
            let sectionData = [...new Set(sectionList)];
            sectionData.sort();
            sectionData.map(sec => {
                sectionOptions.push(
                    <Option key={sec.code} value={sec.code} title={sec.value}>
                        {sec.value}
                    </Option>
                );
            });
            this.setState({ sectionoption: sectionOptions });
        }
    }
    // 设置小班选项
    setSmallClassOption (rst) {
        if (rst instanceof Array) {
            let smallclassList = [];
            let smallclassOptions = [];
            rst.map(item => {
                if (item.name) {
                    let smalls = {
                        name: item.name,
                        code: item.code
                    };
                    smallclassList.push(smalls);
                }
            });
            let smalls = [];
            let array = [];
            smallclassList.map(item => {
                if (array.indexOf(item.code) === -1) {
                    smalls.push(item);
                    array.push(item.code);
                }
            });
            smalls.map(small => {
                smallclassOptions.push(
                    <Option key={small.code} value={small.code} title={small.name}>
                        {small.name}
                    </Option>
                );
            });
            smallclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                    全部
                </Option>
            );
            this.setState({ smallclassoption: smallclassOptions });
        }
    }

    // 设置细班选项
    setThinClassOption (rst) {
        if (rst instanceof Array) {
            let thinclassList = [];
            let thinclassOptions = [];

            // 去除重复的细班,虽然细班是最小的节点，但是只要还有其他元素组成不同，所以数组里面会有相同的细班code，需要去重
            let array = [];
            let data = [];
            rst.map(item => {
                if (item.code && array.indexOf(item.code) === -1) {
                    let thins = {
                        code: item.code,
                        name: item.name
                    };
                    thinclassList.push(thins);
                    array.push(item.code);
                } else {
                    data.push(item);
                }
            });
            // 重复数据
            console.log('data', data);

            thinclassList.map(thin => {
                thinclassOptions.push(
                    <Option key={thin.code} value={thin.code} title={thin.name}>
                        {thin.name}
                    </Option>
                );
            });
            thinclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                    全部
                </Option>
            );
            this.setState({ thinclassoption: thinclassOptions });
        }
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
    }

    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (value = []) {
        let user = getUser();
        let keycode = value[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });
        let sections = JSON.parse(user.sections);
        // 标段
        let rst = [];
        if (sections.length === 0) {
            // 是admin
            rst = this.biaoduan.filter(item => {
                return item.code.indexOf(keycode) !== -1;
            });
        } else {
            rst = this.biaoduan.filter(item => {
                return (
                    item.code.indexOf(keycode) !== -1 &&
                    sections.indexOf(item.code) !== -1
                );
            });
        }
        this.setSectionOption(rst);
    }
}
