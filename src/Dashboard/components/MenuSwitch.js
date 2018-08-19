import React, { Component } from 'react';
import { Button } from 'antd';
import './index.less';

export default class MenuSwitch extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
        this.options = [
            {
                label: '二维展示',
                value: '二维展示'
            },
            {
                label: '工程影像',
                value: '工程影像'
            }
        ];
    }

    render () {
        const {
            dashboardCompomentMenu
        } = this.props;
        return (
            <div className='menuSwitch-menuSwitchButton'>
                {this.options.map(option => {
                    return (
                        <div style={{marginBottom: 10}}>
                            <Button type={dashboardCompomentMenu === option.value ? 'primary' : 'info'} size='large' id={option.value} onClick={this.handleMenuButton.bind(this)}>{option.label}</Button>
                        </div>
                    );
                })}
                {/* <div style={{marginBottom: 10}}>
                    <Button size='large'>二维展示</Button>
                </div>
                <div style={{marginBottom: 10}}>
                    <Button size='large'>工程影像</Button>
                </div> */}
            </div>
        );
    }

    handleMenuButton = (e) => {
        const {
            actions: {
                switchDashboardCompoment
            }
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        switchDashboardCompoment(buttonID);
    }
}
