import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
// import Submenu from './components/SubMenu';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';

export default class Video extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');

        injectReducer('video', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const { Panorama, PanoramaManage, VideoMonitor, CameraManage } =
            this.state || {};

        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={Video.menus} />
                </Aside>
                <Main>
                    {VideoMonitor && (
                        <Route
                            exact
                            path='/video/monitor'
                            component={VideoMonitor}
                        />
                    )}
                    {CameraManage && (
                        <Route
                            exact
                            path='/video/cameraManage'
                            component={CameraManage}
                        />
                    )}
                    {Panorama && (
                        <Route
                            exact
                            path='/video/panorama'
                            component={Panorama}
                        />
                    )}
                    {/* {PanoramaManage && <Route exact path="/video/panoramaManage" component={PanoramaManage}/>} */}
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'video',
            name: '视频监控',
            id: 'VIDEO.VIDEO',
            path: '/video/monitor',
            icon: <Icon name='podcast' />
        },
        {
            key: 'cameraManage',
            id: 'VIDEO.CAMERAMANAGE',
            name: '摄像头管理',
            path: '/video/cameraManage',
            icon: <Icon name='wpforms' />
        },
        {
            key: 'panorama',
            name: '全景图',
            id: 'VIDEO.PANORAMA',
            path: '/video/panorama',
            icon: <Icon name='dot-circle-o' />
            // },{
            // 	key: 'panoramaManage',
            // 	name: '全景图管理',
            // 	id: 'VIDEO.PANORAMAMANAGE',
            // 	path: '/video/panoramaManage',
            // 	icon: <Icon name="fa-wrench"/>
        }
    ];

    // static defaultOpenKeys = ['safetyPlan']
}
