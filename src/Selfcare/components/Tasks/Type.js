import React, { Component } from 'react';
import { Radio } from 'antd';
import { getUser } from '_platform/auth';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class Type extends Component {
    render () {
        const { filter: { type = 'processing' } = {} } = this.props;
        return (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <RadioGroup value={type} onChange={this.chaneType}>
                    <RadioButton key={0} value='processing'>
                        待办任务
                    </RadioButton>
                    <RadioButton key={1} value='finish'>
                        已完成任务
                    </RadioButton>
                </RadioGroup>
            </div>
        );
    }

    chaneType = async (event) => {
        console.log('切换', event.target.value);
        // event.preventDefault();
        // const user = getUser();
        // const {
        //     actions: {
        //         changeFilterField,
        //         getTasks,
        //         setLoadingStatus,
        //         setTablePage
        //     }
        // } = this.props;
        // const value = event.target.value;
        // console.log('value222', value);
        // changeFilterField('type', value);

        // setLoadingStatus(true);
        // await getTasks(
        //     {},
        //     { task: value, executor: user.ID, order_by: '-real_start_time' }
        // );
        // setLoadingStatus(false);
        // setTablePage({ current: 1, pageSize: 10 });
    }
}
