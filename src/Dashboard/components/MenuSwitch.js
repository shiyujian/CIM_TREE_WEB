import React, { Component } from 'react';
import './MenuSwitch.less';
import buildImg from './MenuImg/build.png';
import buildImgSel from './MenuImg/buildSelect.png';
import operateImg from './MenuImg/operate.png';
import operateImgSel from './MenuImg/operateSelect.png';
// window = window || {};
export default class MenuSwitch extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    options = [
        {
            label: '灌溉管网',
            value: 'geojsonFeature_treePipe'
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype'
        },
        {
            label: '辅助管理',
            value: 'geojsonFeature_auxiliaryManagement'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_risk'
        },
        {
            label: '巡检路线',
            value: 'geojsonFeature_track'
        }
    ];
    options1 = [
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask'
        },
        {
            label: '成活率',
            value: 'geojsonFeature_survivalRate'
        },
        {
            label: '苗木结缘',
            value: 'geojsonFeature_treeAdopt'
        }
        // {
        //     label: '辅助验收',
        //     value: 'geojsonFeature_assistCheck'
        // }
    ]

    async componentDidMount () {
        const {
            actions: {
                switchDashboardAreaTreeLayer,
                switchFullScreenState,
                switchDashboardMenuType,
                switchDashboardCompoment,
                setUserMapPositionName,
                switchDashboardDataMeasurement,
                switchAreaDistanceMeasureMenu,
                switchDashboardFocus,
                switchDashboardTreeMess,
                switchDashboardRightMenu
            },
            platform: {
                tabs = {}
            }
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        // 左侧菜单
        // 默认不选择任何菜单
        await switchDashboardMenuType('');
        // 默认不选择任何按钮
        await switchDashboardCompoment('');
        // 右侧菜单
        // 视图管理
        // 默认不打开视图菜单
        await switchDashboardFocus('');
        // 默认不选择任何视图
        await setUserMapPositionName('');
        // 树木信息
        // 默认不查看树木信息
        await switchDashboardTreeMess('');
        // 图层控制
        // 默认选择初始图层
        await switchDashboardAreaTreeLayer('tileTreeLayerBasic');
        // 数据测量
        // 默认不选择数据测量
        await switchDashboardDataMeasurement('');
        // 默认不选择测量图片还是距离
        await switchAreaDistanceMeasureMenu('');
        // 区域地块
        // 默认不打开区域地块树
        await switchDashboardRightMenu('');
        const me = this;
        // 监听是否全屏 过去由F11触发的那种浏览器全屏模式和HTML5中内容的全屏模式是不一样的
        window.onresize = function () {
            let data = me.checkFull();
            if (data) {
                if (fullScreenState === 'unFullScreen') {
                    switchFullScreenState('fullScreen');
                }
            } else {
                if (fullScreenState === 'fullScreen') {
                    switchFullScreenState('unFullScreen');
                }
            }
        };
    }

    checkFull () {
        var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
        return isFullScreen;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            dashboardCompomentMenu,
            dashboardDataMeasurement,
            dashboardTreeMess,
            dashboardRightMenu,
            dashboardFocus,
            actions: {
                switchDashboardTreeMess,
                switchDashboardDataMeasurement,
                switchAreaDistanceMeasureMenu,
                switchDashboardAreaTreeLayer,
                switchDashboardRightMenu,
                switchDashboardFocus
            }
        } = this.props;
        // 选择成活率，苗木结缘时，不能够点击树木信息开关
        if (dashboardCompomentMenu && dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' ||
                dashboardCompomentMenu === 'geojsonFeature_treePipe' ||
                dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
                await switchDashboardTreeMess('');
            }
        }
        // 选择了数据测量，就需要取消树木信息和区域地块，视图管理
        if (dashboardDataMeasurement && dashboardDataMeasurement === 'dataMeasurement' &&
            dashboardDataMeasurement !== prevProps.dashboardDataMeasurement) {
            await switchDashboardTreeMess('');
            await switchDashboardRightMenu('');
            await switchDashboardFocus('');
        }
        // 选择了树木信息，就需要取消数据测量和区域地块，视图管理
        if (dashboardTreeMess && dashboardTreeMess === 'dashboardTreeMess' &&
            dashboardTreeMess !== prevProps.dashboardTreeMess) {
            await switchDashboardDataMeasurement('');
            await switchAreaDistanceMeasureMenu('');
            await switchDashboardRightMenu('');
            await switchDashboardFocus('');
        }
        // 选择了树木信息，就需要取消数据测量和区域地块，视图管理
        if (dashboardRightMenu && dashboardRightMenu === 'area' &&
            dashboardRightMenu !== prevProps.dashboardRightMenu) {
            await switchDashboardDataMeasurement('');
            await switchAreaDistanceMeasureMenu('');
            await switchDashboardTreeMess('');
            await switchDashboardFocus('');
        }
        // 选择了视图管理，就需要取消数据测量和区域地块，树木信息
        if (dashboardFocus && dashboardFocus === 'mapFoucs' &&
            dashboardFocus !== prevProps.dashboardFocus) {
            await switchDashboardDataMeasurement('');
            await switchAreaDistanceMeasureMenu('');
            await switchDashboardTreeMess('');
            await switchDashboardRightMenu('');
        }
        // 选择成活率，树种筛选，辅助验收，苗木结缘, 灌溉管网时，不能够点击图层控制开关
        if (dashboardCompomentMenu && dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' ||
            dashboardCompomentMenu === 'geojsonFeature_treetype' ||
            dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement' ||
            dashboardCompomentMenu === 'geojsonFeature_treePipe' ||
            dashboardCompomentMenu === 'geojsonFeature_treeAdopt'
            ) {
                await switchDashboardAreaTreeLayer('tileTreeLayerBasic');
            }
        }
    }

    render () {
        const {
            dashboardCompomentMenu,
            dashboardMenuType,
            dashboardRightMenu,
            dashboardAreaTreeLayer,
            dashboardDataMeasurement,
            dashboardFocus,
            dashboardTreeMess,
            platform: {
                tabs = {}
            }
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        return (
            <div >
                <div className='menuSwitch-menuSwitchLeftLayout'>
                    <a className='menuSwitch-menuButtonLayout'>
                        <img src={dashboardMenuType === 'buildMenu' ? buildImgSel : buildImg} id='buildMenu' onClick={this.handleChangeMenuType.bind(this)} />
                    </a>
                    <a className='menuSwitch-menuButtonLayout'>
                        <img src={dashboardMenuType === 'operateMenu' ? operateImgSel : operateImg} id='operateMenu' onClick={this.handleChangeMenuType.bind(this)} />
                    </a>
                </div>
                {
                    dashboardMenuType === 'buildMenu'
                        ? (
                            <div className='menuSwitch-secondMenuLayout'>
                                {
                                    this.options.map((option) => {
                                        return (
                                            <a className={dashboardCompomentMenu === option.value ? 'menuSwitch-secondMenuButtonSelLayout' : 'menuSwitch-secondMenuButtonUnSelLayout'}
                                                id={option.value}
                                                key={option.value}
                                                onClick={this.handleLeftMenuButton.bind(this)}>
                                                {option.label}
                                            </a>
                                        );
                                    })
                                }
                            </div>
                        ) : ''
                }
                {
                    dashboardMenuType === 'operateMenu'
                        ? (
                            <div className='menuSwitch-secondMenuLayout'>
                                {
                                    this.options1.map((option) => {
                                        return (
                                            <a className={dashboardCompomentMenu === option.value ? 'menuSwitch-secondMenuButtonSelLayout' : 'menuSwitch-secondMenuButtonUnSelLayout'}
                                                id={option.value}
                                                key={option.value}
                                                onClick={this.handleLeftMenuButton.bind(this)}>
                                                {option.label}
                                            </a>
                                        );
                                    })
                                }
                            </div>
                        ) : ''
                }
                <div className='menuSwitch-menuSwitchRightLayout'>
                    <a className={dashboardFocus === 'mapFoucs' ? 'menuSwitch-rightMenuMapFoucsButtonSelLayout' : 'menuSwitch-rightMenuMapFoucsButtonUnSelLayout'}
                        id='mapFoucs'
                        title='视图管理'
                        onClick={this.handleMapFoucsButton.bind(this)} />
                    <a className={dashboardTreeMess === 'dashboardTreeMess' ? 'menuSwitch-rightMenuTreeMessButtonSelLayout' : 'menuSwitch-rightMenuTreeMessButtonUnSelLayout'}
                        id='dashboardTreeMess'
                        title='树木信息'
                        onClick={this.handleTreeMessButton.bind(this)} />
                    <a className={dashboardAreaTreeLayer === 'removeTileTreeLayerBasic' ? 'menuSwitch-rightMenuTileLayer2ButtonSelLayout' : 'menuSwitch-rightMenuTileLayer2ButtonUnSelLayout'}
                        id='removeTileTreeLayerBasic'
                        title='图层控制'
                        onClick={this.handleTileTreeLayerBasicButton.bind(this)} />
                    <a className={dashboardDataMeasurement === 'dataMeasurement' ? 'menuSwitch-rightMenuAreameasureButtonSelLayout' : 'menuSwitch-rightMenuAreameasureButtonUnSelLayout'}
                        id='dataMeasurement'
                        title='数据测量'
                        onClick={this.handleAreaMeasureButton.bind(this)} />
                    <a className={dashboardRightMenu === 'area' ? 'menuSwitch-rightMenuAreaButtonSelLayout' : 'menuSwitch-rightMenuAreaButtonUnSelLayout'}
                        id='area'
                        title='区域地块'
                        onClick={this.handleRightMenuButton.bind(this)} />
                    <a className={fullScreenState === 'fullScreen' ? 'menuSwitch-rightMenuFullscreenButtonSelLayout' : 'menuSwitch-rightMenuFullscreenButtonUnSelLayout'}
                        id='fullScreen'
                        title='全屏展示'
                        onClick={this.handleFullScreenButton.bind(this)} />
                </div>
            </div>);
    }
    // 左侧第一级菜单
    handleChangeMenuType = async (e) => {
        const {
            actions: {
                switchDashboardMenuType,
                getMenuTreeVisible,
                switchDashboardCompoment
            },
            dashboardMenuType
        } = this.props;
        let target = e.target;
        let menuType = target.getAttribute('id');
        if (dashboardMenuType && dashboardMenuType === menuType) {
            await switchDashboardMenuType('');
        } else {
            await switchDashboardMenuType(menuType);
        }
        await switchDashboardCompoment('');
        await getMenuTreeVisible(false);
    }
    // 左侧第二级菜单
    handleLeftMenuButton = async (e) => {
        const {
            actions: {
                switchDashboardCompoment,
                getMenuTreeVisible
            },
            dashboardCompomentMenu,
            menuTreeVisible
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardCompomentMenu === buttonID) {
            if (menuTreeVisible) {
                await getMenuTreeVisible(false);
                // await switchDashboardCompoment('');
            } else {
                await getMenuTreeVisible(true);
            }
        } else {
            await getMenuTreeVisible(true);
            await switchDashboardCompoment(buttonID);
        }
    }
    // 视图管理
    handleMapFoucsButton = async (e) => {
        const {
            actions: {
                switchDashboardFocus
            },
            dashboardFocus
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardFocus === buttonID) {
            await switchDashboardFocus('');
        } else {
            await switchDashboardFocus(buttonID);
        }
    }
    // 树木信息
    handleTreeMessButton = async (e) => {
        const {
            actions: {
                switchDashboardTreeMess
            },
            dashboardTreeMess,
            dashboardCompomentMenu
        } = this.props;
        // 当处于成活率和苗木结缘模块时，不能点击
        if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' ||
            dashboardCompomentMenu === 'geojsonFeature_treePipe' ||
            dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
            return;
        }
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardTreeMess === buttonID) {
            await switchDashboardTreeMess('');
        } else {
            await switchDashboardTreeMess(buttonID);
        }
    }
    // 图层控制
    handleTileTreeLayerBasicButton = async (e) => {
        const {
            actions: {
                switchDashboardAreaTreeLayer
            },
            dashboardAreaTreeLayer,
            dashboardCompomentMenu
        } = this.props;
        // 选择成活率，树种筛选，辅助验收，苗木结缘时，不能够点击图层
        if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' ||
            dashboardCompomentMenu === 'geojsonFeature_treetype' ||
            dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement' ||
            dashboardCompomentMenu === 'geojsonFeature_treePipe' ||
            dashboardCompomentMenu === 'geojsonFeature_treeAdopt'
        ) {
            return;
        }
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardAreaTreeLayer === buttonID) {
            await switchDashboardAreaTreeLayer('tileTreeLayerBasic');
        } else {
            await switchDashboardAreaTreeLayer(buttonID);
        }
    }
    // 面积计算
    handleAreaMeasureButton = async (e) => {
        const {
            actions: {
                switchDashboardDataMeasurement,
                switchAreaDistanceMeasureMenu
            },
            dashboardDataMeasurement
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardDataMeasurement === buttonID) {
            await switchDashboardDataMeasurement('');
            await switchAreaDistanceMeasureMenu('');
        } else {
            await switchDashboardDataMeasurement(buttonID);
        }
    }
    // 区域地块
    handleRightMenuButton = async (e) => {
        const {
            actions: {
                switchDashboardRightMenu
            },
            dashboardRightMenu
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardRightMenu === buttonID) {
            await switchDashboardRightMenu('');
        } else {
            await switchDashboardRightMenu(buttonID);
        }
    }
    // 全屏展示
    handleFullScreenButton = async (e) => {
        const {
            actions: {
                switchFullScreenState
            },
            platform: {
                tabs = {}
            }
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        let target = e.target;
        let buttonID = target.getAttribute('id');

        if (fullScreenState === buttonID) {
            await switchFullScreenState('unFullScreen');
        } else {
            await switchFullScreenState(buttonID);
        }
    }
}
