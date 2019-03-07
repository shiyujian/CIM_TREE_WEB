import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';
export default class Quality extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dwysjl: false
        };
    }

    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('quality', reducer);
        this.setState({
            ...Containers
        });
    }
    render () {
        const {
            Defect,
            // Search,
            Appraising,
            Faithanalyze,
            Qualityanalyze
        } = this.state || {};

        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={menus} />
                </Aside>
                <Main>
                    {Defect && (
                        <Route path='/quality/defect' component={Defect} />
                    )}
                    {Faithanalyze && (
                        <Route
                            path='/quality/faithanalyze'
                            component={Faithanalyze}
                        />
                    )}
                    {Qualityanalyze && (
                        <Route
                            path='/quality/qualityanalyze'
                            component={Qualityanalyze}
                        />
                    )}
                </Main>
            </Body>
        );
    }
}

const menus = [
    {
        key: 'appraising',
        id: 'QUALITY.APPRAISING',
        name: '质量评优',
        path: '/quality/appraising',
        icon: <Icon name='tasks' />
    },
    {
        key: 'defect',
        id: 'QUALITY.DEFECT',
        name: '质量缺陷',
        path: '/quality/defect',
        icon: <Icon name='life-buoy' />
    },
    {
        key: 'qualityanalyze',
        id: 'QUALITY.QUALITYANALYZE',
        path: '/quality/qualityanalyze',
        name: '种植质量分析'
    },
    {
        key: 'faithanalyze',
        id: 'QUALITY.FAITHANALYZE',
        name: '诚信供应商分析',
        path: '/quality/faithanalyze',
        icon: <Icon name='crosshairs' />
    }
];
