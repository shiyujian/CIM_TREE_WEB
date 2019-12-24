import React, { Component } from 'react';
import './MenuSwitch.less';
import {Input} from 'antd';
import L from 'leaflet';
import {
    getIconType
} from './auth';
import {
    trim
} from '_platform/auth';
import irrigationSel from './MenuSwitchImg/irrigation3.gif';
import irrigation from './MenuSwitchImg/irrigation2.png';
import distributedSel from './MenuSwitchImg/distributed3.gif';
import distributed from './MenuSwitchImg/distributed2.png';
import constructionSel from './MenuSwitchImg/construction3.gif';
import construction from './MenuSwitchImg/construction2.png';
import defectSel from './MenuSwitchImg/problem3.gif';
import defect from './MenuSwitchImg/problem2.png';
import monitorSel from './MenuSwitchImg/monitor3.gif';
import monitor from './MenuSwitchImg/monitor2.png';
import mechanicalSel from './MenuSwitchImg/mechanical3.gif';
import mechanical from './MenuSwitchImg/mechanical2.png';
import conservationSel from './MenuSwitchImg/conservation3.gif';
import conservation from './MenuSwitchImg/conservation2.png';
import ratioSel from './MenuSwitchImg/ratio3.gif';
import ratio from './MenuSwitchImg/ratio2.png';
import adoptSel from './MenuSwitchImg/adopt3.gif';
import adopt from './MenuSwitchImg/adopt2.png';
import migrateSel from './MenuSwitchImg/migrate3.gif';
import migrate from './MenuSwitchImg/migrate2.png';
import searchTopImg from './MenuSwitchImg/search0.png';
import searchRightImg from './MenuSwitchImg/2.png';

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
            value: 'geojsonFeature_treePipe',
            img: irrigation,
            imgSel: irrigationSel
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype',
            img: distributed,
            imgSel: distributedSel
        },
        {
            label: '辅助管理',
            value: 'geojsonFeature_auxiliaryManagement',
            img: construction,
            imgSel: constructionSel
        },
        {
            label: '问题上报',
            value: 'geojsonFeature_risk',
            img: defect,
            imgSel: defectSel
        },
        // {
        //     label: '现场监控',
        //     value: 'geojsonFeature_camera',
        //     img: monitor,
        //     imgSel: monitorSel
        // },
        {
            label: '机械情况',
            value: 'geojsonFeature_device',
            img: mechanical,
            imgSel: mechanicalSel
        }
    ];
    options1 = [
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask',
            img: conservation,
            imgSel: conservationSel
        },
        {
            label: '成活率',
            value: 'geojsonFeature_survivalRate',
            img: ratio,
            imgSel: ratioSel
        },
        {
            label: '苗木结缘',
            value: 'geojsonFeature_treeAdopt',
            img: adopt,
            imgSel: adoptSel
        }
        // {
        //     label: '苗木迁移',
        //     value: 'geojsonFeature_treeTransfer',
        //     img: migrate,
        //     imgSel: migrateSel
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
            }
        } = this.props;
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
        document.addEventListener('fullscreenchange', this.exitHandler);
        document.addEventListener('webkitfullscreenchange', this.exitHandler);
        document.addEventListener('mozfullscreenchange', this.exitHandler);
        document.addEventListener('MSFullscreenChange', this.exitHandler);
    }
    checkFull () {
        var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
        return isFullScreen;
    }
    exitHandler = () => {
        try {
            const {
                actions: {
                    switchFullScreenState
                }
            } = this.props;
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                switchFullScreenState('');
            }
        } catch (e) {
            console.log('exitHandler', e);
        }
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
        if (dashboardCompomentMenu &&
            dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' ||
                dashboardCompomentMenu === 'geojsonFeature_treePipe' ||
                dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
                await switchDashboardTreeMess('');
            }
        }
        // 选择了数据测量，就需要取消树木信息和区域地块，视图管理
        if (dashboardDataMeasurement &&
            dashboardDataMeasurement === 'dataMeasurement' &&
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
        if (dashboardCompomentMenu &&
            dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
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
        console.log('buttonID', buttonID);

        if (dashboardCompomentMenu === buttonID) {
            if (menuTreeVisible) {
                // await switchDashboardCompoment('');
                await getMenuTreeVisible(false);
            } else {
                await getMenuTreeVisible(true);
            }
        } else {
            await switchDashboardCompoment(buttonID);
            // await switchDashboardCompoment('geojsonFeature_curingTask');
            await getMenuTreeVisible(true);
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
        console.log('buttonID', buttonID);

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
                switchDashboardRightMenu,
                switchDashboardDataView
            },
            dashboardRightMenu
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardRightMenu === buttonID) {
            await switchDashboardRightMenu('');
        } else {
            await switchDashboardRightMenu(buttonID);
            await switchDashboardDataView('');
        }
    }
    // 数据看板
    handleDataViewButton = async (e) => {
        const {
            actions: {
                switchDashboardDataView,
                switchDashboardRightMenu
            },
            dashboardDataView
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (dashboardDataView === buttonID) {
            await switchDashboardDataView('');
        } else {
            await switchDashboardDataView(buttonID);
            await switchDashboardRightMenu('');
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
            await switchFullScreenState('');
            this.exitFullScreen();
        } else {
            await switchFullScreenState(buttonID);
            this.startFullScreen();
        }
    }
    // 进入全屏
    startFullScreen () {
        try {
            var element = document.documentElement;
            // W3C
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
        } catch (e) {
            console.log('startFullScreen', e);
        }
    }
    // 退出全屏
    exitFullScreen () {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        } catch (e) {
            console.log('exitFullScreen', e);
        }
    }
    // 点击建设
    handleBuildMenuClick = async (event) => {
        let domID = event.target.id;
        console.log('domID', domID);
        if (domID === 'buildmenu' || domID === 'buildmenuName') {
            const {
                actions: {
                    switchDashboardMenuType,
                    getMenuTreeVisible,
                    switchDashboardCompoment
                },
                dashboardMenuType
            } = this.props;
            if (dashboardMenuType && dashboardMenuType === 'buildMenu') {
                await switchDashboardMenuType('');
            } else {
                await switchDashboardMenuType('buildMenu');
            }
            await switchDashboardCompoment('');
            await getMenuTreeVisible(false);
        }
    }
    // 点击运营
    handleOperateMenuClick = async (event) => {
        let domID = event.target.id;
        console.log('domID', domID);
        if (domID === 'operatemenu' || domID === 'operatemenuName') {
            const {
                actions: {
                    switchDashboardMenuType,
                    getMenuTreeVisible,
                    switchDashboardCompoment
                },
                dashboardMenuType
            } = this.props;
            if (dashboardMenuType && dashboardMenuType === 'operateMenu') {
                await switchDashboardMenuType('');
            } else {
                await switchDashboardMenuType('operateMenu');
            }
            await switchDashboardCompoment('');
            await getMenuTreeVisible(false);
        }
    }
    // 搜索苗木
    handleSearchTreeLocation = async (event) => {
        const {
            actions: {
                getTreeLocation
            },
            map
        } = this.props;
        const {
            treeTypeTreeMarkerLayer
        } = this.state;
        console.log('event', event);
        console.log('event.keyCode', event.keyCode);

        let location = {};
        let value = document.getElementById('searchInput').value;
        value = trim(value);
        console.log('value', value);
        let treeData = await getTreeLocation({sxm: value});
        let treeMess = treeData && treeData.content && treeData.content[0];
        // 如果根据顺序码查到的数据存在坐标，则不修改左侧树信息，对树节点进行定位
        if (treeMess && treeMess.X && treeMess.Y) {
            location.X = treeMess.X;
            location.Y = treeMess.Y;
            await this.treeTypeTreeLocation(location);
            this.setState({
                searchValue: ''
            });
        } else {
            if (treeTypeTreeMarkerLayer) {
                map.removeLayer(treeTypeTreeMarkerLayer);
            }
            // 如果根据顺序码查到的数据不存在坐标，则树数据为空，同时没有坐标信息
            this.setState({
                searchValue: value
            });
        }
    }
    // 树种筛选模块搜索树然后进行定位
    treeTypeTreeLocation = async (data) => {
        const {
            map
        } = this.props;
        const {
            treeTypeTreeMarkerLayer
        } = this.state;
        if (treeTypeTreeMarkerLayer) {
            map.removeLayer(treeTypeTreeMarkerLayer);
        }
        let iconType = L.divIcon({
            className: getIconType('treeType')
        });
        let marker = L.marker([data.Y, data.X], {
            icon: iconType
        });
        marker.addTo(map);
        map.panTo([data.Y, data.X]);
        this.setState({
            treeTypeTreeMarkerLayer: marker
        });
    }
    render () {
        const {
            dashboardCompomentMenu,
            dashboardMenuType,
            dashboardRightMenu,
            dashboardAreaTreeLayer,
            dashboardDataView,
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
            <div>
                <div className='menuSwitch-mapCover' />
                <a
                    id='fullScreen'
                    title='全屏展示'
                    onClick={this.handleFullScreenButton.bind(this)}
                    className={fullScreenState === 'fullScreen'
                        ? 'menuSwitch-fullScreenOut'
                        : 'menuSwitch-fullScreenIn'} />
                <div className='menuSwitch-menuSwitchLeftLayout'>
                    <div className='builddemo'>
                        <a
                            onClick={this.handleBuildMenuClick.bind(this)}
                            id='buildmenuName'
                            className={dashboardMenuType === 'buildMenu'
                                ? 'buildmenuNameSel'
                                : 'buildmenuName'} />
                        <div className='buildnavbar'
                            id='buildnavbar'
                            style={
                                dashboardMenuType === 'buildMenu'
                                    ? {
                                        opacity: 1
                                    } : {
                                        opacity: 0
                                    }
                            }
                        >

                            <ul className={'buildmenu'}
                                id='buildmenu'
                                onClick={this.handleBuildMenuClick.bind(this)}
                                style={
                                    dashboardMenuType === 'buildMenu'
                                        ? {
                                            transition: 'transform 0.4s 0.08s, z-index   0s  0.5s',
                                            transform: 'scale(1)',
                                            zIndex: 1
                                        } : {
                                            transform: 'scale(0)',
                                            transition: 'transform 1.4s 0.07s',
                                            zIndex: -1
                                        }
                                }
                            >
                                {
                                    this.options.map((option) => {
                                        let img = option.img;
                                        if (dashboardCompomentMenu === option.value) {
                                            img = option.imgSel;
                                        }
                                        return (
                                            <li>
                                                <a id={option.value}
                                                    key={option.value}
                                                    title={option.label}
                                                    onClick={this.handleLeftMenuButton.bind(this)}
                                                    style={{
                                                        backgroundImage: `url(${img})`
                                                    }} />
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='operatedemo'>
                        <a
                            onClick={this.handleOperateMenuClick.bind(this)}
                            id='operatemenuName'
                            className={dashboardMenuType === 'operateMenu'
                                ? 'operatemenuNameSel'
                                : 'operatemenuName'} />
                        <div className='operatenavbar'
                            id='operatenavbar'
                            style={
                                dashboardMenuType === 'operateMenu'
                                    ? {
                                        opacity: 1
                                    } : {
                                        opacity: 0
                                    }

                            }
                        >
                            <ul className={'operatemenu'}
                                id='operatemenu'
                                onClick={this.handleOperateMenuClick.bind(this)}
                                style={
                                    dashboardMenuType === 'operateMenu'
                                        ? {
                                            transition: 'transform 0.4s 0.08s, z-index   0s  0.5s',
                                            transform: 'scale(1)',
                                            zIndex: 1
                                        } : {
                                            transform: 'scale(0)',
                                            transition: 'transform 1.4s 0.07s',
                                            zIndex: -1
                                        }
                                }
                            >
                                {
                                    this.options1.map((option) => {
                                        let img = option.img;
                                        if (dashboardCompomentMenu === option.value) {
                                            img = option.imgSel;
                                        }
                                        return (
                                            <li>
                                                <a id={option.value}
                                                    key={option.value}
                                                    title={option.label}
                                                    onClick={this.handleLeftMenuButton.bind(this)}
                                                    style={{
                                                        backgroundImage: `url(${img})`
                                                    }} />
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement'
                        ? <div>
                            <div className='menuSwitch-auxiliaryManagementLayout'>
                                <span className='menuSwitch-auxiliaryManagementText'>请点击右侧区域地块按钮</span>
                            </div>
                        </div> : ''
                }
                {
                    dashboardCompomentMenu !== 'geojsonFeature_treetype'
                        ? <div className='menuSwitch-searchLayout'>
                            <img src={searchTopImg} style={{display: 'block'}} />
                            <Input placeholder='请输入苗木编码'
                                id='searchInput'
                                autoComplete='off'
                                onPressEnter={this.handleSearchTreeLocation.bind(this)}
                                className='menuSwitch-searchInputLayout' />
                            <img src={searchRightImg} className='menuSwitch-searchInputRightLayout' />
                        </div> : ''
                }
                <div className='menuSwitch-menuSwitchRightLayout'>
                    <a className={dashboardRightMenu === 'area' ? 'menuSwitch-rightMenuAreaButtonSelLayout' : 'menuSwitch-rightMenuAreaButtonUnSelLayout'}
                        id='area'
                        title='区域地块'
                        onClick={this.handleRightMenuButton.bind(this)} />
                    <a className={dashboardTreeMess === 'dashboardTreeMess' ? 'menuSwitch-rightMenuTreeMessButtonSelLayout' : 'menuSwitch-rightMenuTreeMessButtonUnSelLayout'}
                        id='dashboardTreeMess'
                        title='树木信息'
                        onClick={this.handleTreeMessButton.bind(this)} />
                    <a className={dashboardAreaTreeLayer === 'removeTileTreeLayerBasic' ? 'menuSwitch-rightMenuTileLayer2ButtonSelLayout' : 'menuSwitch-rightMenuTileLayer2ButtonUnSelLayout'}
                        id='removeTileTreeLayerBasic'
                        title='图层控制'
                        onClick={this.handleTileTreeLayerBasicButton.bind(this)} />
                    {/* <a className={dashboardDataMeasurement === 'dataMeasurement' ? 'menuSwitch-rightMenuAreameasureButtonSelLayout' : 'menuSwitch-rightMenuAreameasureButtonUnSelLayout'}
                        id='dataMeasurement'
                        title='数据测量'
                        onClick={this.handleAreaMeasureButton.bind(this)} /> */}
                    <a className={dashboardDataView === 'dataView' ? 'menuSwitch-rightMenuDataViewButtonSelLayout' : 'menuSwitch-rightMenuDataViewButtonUnSelLayout'}
                        id='dataView'
                        title='数据看板'
                        onClick={this.handleDataViewButton.bind(this)} />
                </div>
            </div>);
    }
}
