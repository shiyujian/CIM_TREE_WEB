import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import { NursOverallTable } from '../components/NurSoverAllInfo';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getAreaTreeData
} from '_platform/auth';
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
export default class Nursoverallinfo extends Component {
    biaoduan = [];
    currentSection = '';
    constructor (props) {
        super(props);
        this.state = {
            resetkey: 0
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }
    }

    render () {
        const { resetkey } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='苗木综合信息' {...this.props} />
                    <Content>
                        <NursOverallTable
                            key={resetkey}
                            {...this.props}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

    // 重置
    resetinput () {
        this.setState({
            resetkey: ++this.state.resetkey
        });
    }
}
