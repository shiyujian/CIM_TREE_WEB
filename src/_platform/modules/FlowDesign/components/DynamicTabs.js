import React from 'react';
import { string, array, func } from 'prop-types';
import { Tabs } from 'antd';

import styles from './styles.css';

const TabPane = Tabs.TabPane;

export default class DynamicTabs extends React.Component {
    static propTypes = {
        name: string,
        tabs: array,
        activeKey: string,
        onChange: func,
        removeTab: func
    };

    constructor (props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps (nextProps) {}

    edit = (targetKey, action) => {
        this[action](targetKey);
    };

    change = targetKey => {
        this.props.onChange(targetKey);
    };

    remove = targetKey => {
        this.props.removeTab(targetKey);
    };

    render () {
        const { tabs, activeKey } = this.props;

        console.log('activeKey ', activeKey);

        return (
            <Tabs
                defaultActiveKey='0'
                activeKey={String(activeKey)}
                type={tabs.length > 1 ? 'editable-card' : 'card'}
                hideAdd
                onEdit={this.edit}
                onChange={this.change}
            >
                {tabs.map((tab, index) => {
                    let title = tab.title;
                    return <TabPane key={index} tab={title} />;
                })}
            </Tabs>
        );
    }
}
