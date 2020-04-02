import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../store/qrcodedistribute';
import { TableList, Details, Examine } from '../components/QRCodeDistribute';
import {
    getUser,
    getAreaTreeData,
    getUserIsManager
} from '_platform/auth';

@connect(
    state => {
        const {
            platform,
            project: { qrcodedistribute }
        } = state;
        return { platform, ...qrcodedistribute };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class QRCodeDistribute extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visibleDetails: false, // 显示详情
            detailType: '', // 详情类型
            examineVisible: false, // 显示审核
            type: '', // 审核类型
            qrcodelist: [], // 列表数据
            mmqrcodelist: [], // 列表数据
            qrcodestat: [], // 本标段统计数据
            qrcodestatcount: [], // 本项目统计数据
            detailRow: {}, // 详情
            activeKey: 'nursery', // 默认显示苗木设施
            projectList: [], // 地块标段数据
            isApply: false, // 是否具有申请权限
            isExamine: false, // 是否具有审批权限
            section: '', // 当前登录用户标段信息
            userid: '', // 当前登录用户id
            org: '', // 当前登录用户单位
            isadmin: false, // 是否是管理员
            storenum: 0, // 二维码库存量
            mmqrcodestat: [], // 本标段统计数据
            mmqrcodestatcount: [], // 本项目统计数据
            mmstorenum: 0 // 二维码库存量
        };
        this.onVisibleView = this.onVisibleView.bind(this);
        this.onExamine = this.onExamine.bind(this);
        this.onDetailBack = this.onDetailBack.bind(this);
        this.onApplyBack = this.onApplyBack.bind(this);
        this.changeTabs = this.changeTabs.bind(this);
    }

    componentWillMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林用户数据，提高效率

        // 避免反复获取森林树种列表，提高效率
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的区段数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                projectList: projectList
            });
        }else{
            this.setState({
                projectList: tree.thinClassTree
            });
        }
        this.getQrcodestat('nursery');
        this.getQrcodestatCount('nursery');
        this.getQrcodestores('nursery');
    }

    componentDidMount = async () => {
        let user = getUser();
        let section = user.section; // 获取当前登录用户的标段
        let userid = user.ID; // 获取当前登录用户的id
        let org = user.orgObj ? user.orgObj.OrgName : '';// 获取当前登录用户的单位
        let username = user.username; // 获取当前登录用户的用户名
        let permission = getUserIsManager(); // 是否是admin或业主
        if (user.roles.RoleName.indexOf('施工') > -1 && !permission) {
            this.setState({ // 是否可以申请
                isApply: true
            });
        }
        if (user.roles.RoleName.indexOf('业主') > -1 || permission) {
            this.setState({ // 是否可以审核
                isExamine: true
            });
        }
        if (username == 'admin') {
            this.setState({
                isadmin: true
            });
        }
        this.setState({
            section: section,
            userid: userid,
            org: org
        });
        this.getMmQrcodes();
    }

    getMmQrcodes (queryParams) { // 获取二维码申请列表和审核列表
        const {actions: {getQrcodes}} = this.props;
        let user = getUser();
        let section = user.section;
        let isgarden = 0;
        if (queryParams && queryParams.mmProjct && !section) {
            section = queryParams.mmProjct;
        }
        section = section || '';
        let status = queryParams ? (queryParams.mmstatus ? queryParams.mmstatus : '') : '';
        let stime = queryParams ? (queryParams.mmstime ? queryParams.mmstime : '') : '';
        let etime = queryParams ? (queryParams.mmetime ? queryParams.mmetime : '') : '';
        let postData = {
            section: section,
            isgarden: isgarden,
            status: status,
            stime: stime,
            etime: etime
        };
        getQrcodes({}, postData).then((data) => {
            let mmqrcodelist = [];
            let mmylcodelist = [];
            let mmcodelist = [];
            data.content.map(item => {
                let arr = item.Section.split('-');
                if (arr[0].length === 4) {
                    mmqrcodelist.push(item);
                } else if (arr[0].length === 5) {
                    mmylcodelist.push(item);
                } else {
                    mmcodelist.push(item);
                }
            });
            console.log('所有森林列表数据', mmqrcodelist);
            console.log('所有园林列表数据', mmylcodelist);
            console.log('其他列表数据', mmcodelist);
            this.setState({
                mmqrcodelist
            });
        });
    }

    getQrcodeDetail (id) { // 根据详情id获取二维码申请
        const {actions: {getQrcodeDetail}} = this.props;
        let ID = id;
        getQrcodeDetail({ID: ID})
            .then((data) => {
                this.setState({
                    detailRow: data
                });
            });
    }

    getQrcodestat (type) { // 二维码申请审核统计(本标段)
        const {
            actions: {
                getQrcodestat
            }
        } = this.props;
        const {
            section
        } = this.state;
        let params = {
            stattype: 'section',
            section: section || '',
            isgarden: 0
        };
        getQrcodestat({}, params)
            .then((data) => {
                this.setState({
                    mmqrcodestat: data
                });
            });
    }
    getQrcodestatCount (type) { // 二维码申请审核统计(本项目)
        const {
            actions: {
                getQrcodestat
            }
        } = this.props;
        const {
            section
        } = this.state;
        let params = {
            stattype: 'section',
            section: section || '',
            isgarden: 0
        };
        getQrcodestat({}, params)
            .then((data) => {
                this.setState({
                    mmqrcodestatcount: data
                });
            });
    }

    getQrcodestores (type) { // 获取二维码库存量
        const {
            actions: {
                getQrcodestores
            }
        } = this.props;
        const {
            section
        } = this.state;
        let params = {
            section: section || '',
            isgarden: 0
        };
        getQrcodestores({}, params)
            .then((data) => {
                if (data && data.content && data.content.length > 0) {
                    let count = 0;
                    for (let i = 0; i < data.content.length; i++) {
                        count = count + data.content[i].StoreNum;
                    }
                    this.setState({
                        mmstorenum: count
                    });
                }
            });
    }

    onVisibleView (type, ID) {
        this.getQrcodeDetail(ID);
        this.setState({
            visibleDetails: !this.state.visibleDetails,
            detailType: type
        });
    }
    onDetailBack (type) {
        this.setState({
            visibleDetails: !this.state.visibleDetails,
            activeKey: type
        });
    }
    onExamine (type, ID) {
        this.getQrcodeDetail(ID);
        this.setState({
            examineVisible: !this.state.examineVisible,
            type: type
        });
    }
    onApplyBack (type) {
        this.setState({
            examineVisible: !this.state.examineVisible,
            activeKey: type
        });
    }
    reloadList () { // 刷新页面
        this.getMmQrcodes();
    }
    changeTabs (key) {
        this.getQrcodestat(key);
        this.getQrcodestatCount(key);
        this.getQrcodestores(key);
    }
    render () {
        return (
            <div>
                <DynamicTitle title='派发信息' {...this.props} />
                {!this.state.examineVisible
                    ? <Content>
                        {this.state.visibleDetails
                            ? <Details
                                projectList={this.state.projectList}
                                onVisibleView={this.onVisibleView}
                                detailType={this.state.detailType}
                                onDetailBack={this.onDetailBack}
                                detailRow={this.state.detailRow}
                            />
                            : <TableList
                                changeTabs={this.changeTabs}
                                mmstorenum={this.state.mmstorenum}
                                mmqrcodestat={this.state.mmqrcodestat}
                                mmqrcodestatcount={this.state.mmqrcodestatcount}
                                storenum={this.state.storenum}
                                qrcodestat={this.state.qrcodestat}
                                qrcodestatcount={this.state.qrcodestatcount}
                                qrcodelist={this.state.qrcodelist}
                                mmqrcodelist={this.state.mmqrcodelist}
                                activeKey={this.state.activeKey}
                                {...this.props}
                                onVisibleView={this.onVisibleView}
                                onExamine={this.onExamine}
                                isApply={this.state.isApply}
                                isExamine={this.state.isExamine}
                                section={this.state.section}
                                userid={this.state.userid}
                                org={this.state.org}
                                isadmin={this.state.isadmin}
                                projectList={this.state.projectList}
                                reloadList={this.reloadList.bind(this)}
                                mmquery={this.getMmQrcodes.bind(this)}
                            />
                        }
                    </Content>
                    : <Content>
                        <Examine
                            {...this.props}
                            userid={this.state.userid}
                            reloadList={this.reloadList.bind(this)}
                            onApplyBack={this.onApplyBack}
                            detailRow={this.state.detailRow}
                            projectList={this.state.projectList}
                            onExamine={this.onExamine}
                            type={this.state.type}
                        />
                    </Content>
                }
            </div>
        );
    }
}
