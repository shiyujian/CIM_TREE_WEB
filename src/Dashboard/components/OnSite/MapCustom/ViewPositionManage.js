import React, { Component } from 'react';
import { Button, Popconfirm, Notification } from 'antd';
import './ViewPositionManage.less';
import SaveUserMapCustomPositionModal from './SaveUserMapCustomPositionModal';
// 自定义视图
import areaViewImg from '../../InitialPositionImg/areaView.png';
import customViewImg from '../../InitialPositionImg/customView.png';
import customViewCloseUnSelImg from '../../InitialPositionImg/delete1.png';
import customViewCloseSelImg from '../../InitialPositionImg/delete2.png';
import {
    PROJECTPOSITIONCENTER
} from '_platform/api';
import {getUser} from '_platform/auth';

export default class ViewPositionManage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 自定义视图
            saveUserMapCustomPositionVisible: false,
            saveUserMapCustomPositionCenter: '',
            saveUserMapCustomPositionZoom: ''
        };
    }
    render () {
        const {
            userMapPositionName = '',
            customViewByUserID = []
        } = this.props;
        const {
            saveUserMapCustomPositionVisible
        } = this.state;
        return (
            <div>
                <div className='ViewPositionManage-rightInitialPositionMenu'>
                    <aside className='ViewPositionManage-rightInitialPositionMenu-aside' draggable='false'>
                        <div className='ViewPositionManage-rightInitialPositionMenu-areaTree'>
                            <div style={{height: '100%'}}>
                                <div className='ViewPositionManage-rightInitialPositionMenu-viewList'>
                                    <div className='ViewPositionManage-rightInitialPositionMenu-areaViewTitle'>
                                        <img src={areaViewImg} style={{marginRight: 10, marginTop: -1}} />
                                        <span>区域视图</span>
                                    </div>
                                    <div>
                                        {
                                            PROJECTPOSITIONCENTER.map((view, index) => {
                                                return (<div className='ViewPositionManage-rightInitialPositionMenu-areaViewData' key={view.name}>
                                                    <Button
                                                        className='ViewPositionManage-rightInitialPositionMenu-areaViewData-button'
                                                        onClick={this.locationToMapCustomPosition.bind(this, view)}
                                                        type={userMapPositionName === view.name ? 'primary' : 'default'}>
                                                        {view.name}
                                                    </Button>
                                                </div>);
                                            })
                                        }
                                    </div>
                                    <div className='ViewPositionManage-rightInitialPositionMenu-customViewTitle'>
                                        <img src={customViewImg} style={{marginRight: 10, marginTop: -1}} />
                                        <span>自定义视图</span>
                                    </div>
                                    <div>
                                        {
                                            customViewByUserID.map((view, index) => {
                                                if (userMapPositionName === view.name) {
                                                    return (<div className='ViewPositionManage-rightInitialPositionMenu-customViewData-Select' key={view.id}>
                                                        <a className='ViewPositionManage-rightInitialPositionMenu-customViewData-ALabel-Select'
                                                            title={view.name}
                                                            onClick={this.locationToMapCustomPosition.bind(this, view)}>
                                                            {view.name}
                                                        </a>
                                                        <Popconfirm title='确认要删除么'
                                                            onConfirm={this.handleDeleteMapCustomPosition.bind(this, view)}
                                                            onCancel={this.handleDeleteMapCustomPositionCancel.bind(this)}
                                                            okText='Yes' cancelText='No'>
                                                            <img src={customViewCloseSelImg} className='ViewPositionManage-rightInitialPositionMenu-customViewData-deleteImg' />
                                                        </Popconfirm>
                                                    </div>);
                                                } else {
                                                    return (<div className='ViewPositionManage-rightInitialPositionMenu-customViewData-Unselect' key={view.id}>
                                                        <a className='ViewPositionManage-rightInitialPositionMenu-customViewData-ALabel-Unselect'
                                                            title={view.name}
                                                            onClick={this.locationToMapCustomPosition.bind(this, view)}>
                                                            {view.name}
                                                        </a>
                                                        <Popconfirm title='确认要删除么'
                                                            onConfirm={this.handleDeleteMapCustomPosition.bind(this, view)}
                                                            onCancel={this.handleDeleteMapCustomPositionCancel.bind(this)}
                                                            okText='Yes' cancelText='No'>
                                                            <img src={customViewCloseUnSelImg}
                                                                className='ViewPositionManage-rightInitialPositionMenu-customViewData-deleteImg' />
                                                        </Popconfirm>
                                                    </div>);
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='ViewPositionManage-rightInitialPositionMenu-footerButton'>
                                    <Button style={{width: '100%', height: 40}}
                                        onClick={this.saveUserMapCustomPosition.bind(this)}
                                        type='primary' ghost>
                                        保存当前视图
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
                { // 添加自定义视图的弹窗
                    saveUserMapCustomPositionVisible
                        ? (
                            <SaveUserMapCustomPositionModal
                                {...this.props}
                                {...this.state}
                                onCancel={this.handleCancelMapCustomPositionModal.bind(this)} />
                        ) : ''
                }
            </div>
        );
    }
    // 定位至视图所在的坐标位置
    locationToMapCustomPosition = async (view) => {
        const {
            actions: {
                setUserMapPositionName
            },
            map
        } = this.props;
        await setUserMapPositionName(view.name);
        // 修改地图聚焦点
        if (view && view.id && view.center && view.center instanceof Array && view.center.length > 0) {
            let center = [view.center[0].lat, view.center[0].lng];
            await map.panTo(center);
        } else {
            await map.panTo(view.center);
        }
        // 因先设置直接跳转,然后直接修改放大层级，无法展示，只能在跳转坐标之后，设置时间再重新修改放大层级
        setTimeout(async () => {
            await map.setZoom(view.zoom);
        }, 500);
    }
    // 删除选择的视图
    handleDeleteMapCustomPosition = async (view) => {
        const {
            actions: {
                deleteUserCustomView,
                getCustomViewByUserID
            }
        } = this.props;
        try {
            let postData = {
                id: view.id
            };
            let data = await deleteUserCustomView(postData);
            if (data) {
                Notification.error({
                    message: '删除视图失败',
                    duration: 3
                });
            } else {
                Notification.success({
                    message: '删除视图成功',
                    duration: 3
                });
            }
            let user = getUser();
            await getCustomViewByUserID({id: user.ID});
        } catch (e) {
            console.log('handleDeleteMapCustomPosition', e);
        }
    }
    handleDeleteMapCustomPositionCancel = async () => {

    }
    // 获取当前视图的中心和放大层级，打开保存自定义视图弹窗
    saveUserMapCustomPosition = async () => {
        const {
            customViewByUserID = [],
            map
        } = this.props;
        if (customViewByUserID && customViewByUserID instanceof Array && customViewByUserID.length < 3) {
            let center = map.getCenter();
            let zoom = map.getZoom();
            this.setState({
                saveUserMapCustomPositionVisible: true,
                saveUserMapCustomPositionCenter: center,
                saveUserMapCustomPositionZoom: zoom
            });
        } else {
            Notification.info({
                message: '自定义视图最多为三个',
                duration: 3
            });
        }
    }
    // 关闭保存自定义视图弹窗
    handleCancelMapCustomPositionModal = async () => {
        this.setState({
            saveUserMapCustomPositionVisible: false,
            saveUserMapCustomPositionCenter: '',
            saveUserMapCustomPositionZoom: ''
        });
    }
}
