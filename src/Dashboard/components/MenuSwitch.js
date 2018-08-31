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

    async componentDidMount () {
        const {
            actions: {
                switchDashboardAreaTreeLayer,
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
        await switchDashboardAreaTreeLayer('tileTreeLayerBasic');
        console.log();
        const me = this;
        // 监听是否全屏 过去由F11触发的那种浏览器全屏模式和HTML5中内容的全屏模式是不一样的
        window.onresize = function () {
            let data = me.checkFull();
            console.log('data', data);
            console.log('fullScreenState', fullScreenState);
            if (data) {
                if (fullScreenState === 'unFullScreen') {
                    console.log('ssssssssss');
                    switchFullScreenState('fullScreen');
                }
            } else {
                if (fullScreenState === 'fullScreen') {
                    console.log('wwwwwwww');
                    switchFullScreenState('unFullScreen');
                }
            }
        };
    }

    options = [
        {
            label: '区域地块',
            value: 'geojsonFeature_area',
            IconName: 'square'
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype',
            IconName: 'square'
        }
    ];
    options1 = [
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask',
            IconName: 'curingTask'
        },
        {
            label: '成活率',
            value: 'geojsonFeature_survivalRate'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_risk',
            IconName: 'warning'
        },
        {
            label: '巡检路线',
            value: 'geojsonFeature_track',
            IconName: 'universal-access'
        }
    ]

    checkFull () {
        var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
        return isFullScreen;
    }

    render () {
        const {
            dashboardCompomentMenu,
            dashboardMenuType,
            dashboardRightMenu,
            dashboardAreaTreeLayer,
            dashboardAreaMeasure,
            dashboardFocus,
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
                        title='初始位置'
                        onClick={this.handleMapFoucsButton.bind(this)} />
                    <a className={dashboardAreaTreeLayer === 'removeTileTreeLayerBasic' ? 'menuSwitch-rightMenuTileLayer2ButtonSelLayout' : 'menuSwitch-rightMenuTileLayer2ButtonUnSelLayout'}
                        id='removeTileTreeLayerBasic'
                        title='图层控制'
                        onClick={this.handleTileTreeLayerBasicButton.bind(this)} />
                    <a className={dashboardAreaMeasure === 'areaMeasure' ? 'menuSwitch-rightMenuAreameasureButtonSelLayout' : 'menuSwitch-rightMenuAreameasureButtonUnSelLayout'}
                        id='areaMeasure'
                        title='面积计算'
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
                getMenuTreeVisible
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
    // 初始位置
    handleMapFoucsButton = async (e) => {
        const {
            actions: {
                switchDashboardFocus
            },
            dashboardFocus
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardFocus !== buttonID) {
            await switchDashboardFocus(buttonID);
        }
    }
    // 图层控制
    handleTileTreeLayerBasicButton = async (e) => {
        const {
            actions: {
                switchDashboardAreaTreeLayer
            },
            dashboardAreaTreeLayer
        } = this.props;
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
                switchDashboardAreaMeasure
            },
            dashboardAreaMeasure
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardAreaMeasure === buttonID) {
            await switchDashboardAreaMeasure('unAreaMeasure');
        } else {
            await switchDashboardAreaMeasure(buttonID);
        }
    }
    // 右侧菜单
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
