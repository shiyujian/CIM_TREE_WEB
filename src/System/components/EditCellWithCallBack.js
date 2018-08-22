/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import {
    Icon,
    Input
} from 'antd';

class EditableCellWCB extends React.Component {
    constructor (props) {
        super(props);
        console.log(props);
        this.state = {
            checkedValue: props.initCheckedValue,
            value: props.value,
            editable: this.props.editOnOff
        };
        this.editCache = {};
    }

    handleChange = e => {
        const value = e.target.value;
        this.setState({ value });
        this.props.changTag(true);
    };

    check = async () => {
        let value = this.state.value;
        console.log('value:', value);
        let checkedValue = await this.props.checkVal(value);
        this.setState({ editable: false, checkedValue });
    };

    edit = () => {
        this.setState({ editable: true });
    };

    render () {
        const { value, editable, checkedValue } = this.state;
        return (
            <div className='editable-cell' style={{ width: '100%' }}>
                {editable ? (
                    <div
                        className='editable-cell-input-wrapper'
                        style={{ display: 'inline-block' }}
                    >
                        <Input
                            style={{ width: '100% - 80px' }}
                            value={value}
                            onChange={this.handleChange}
                        />
                        <Icon
                            type='check'
                            className='editable-cell-icon-check'
                            onClick={this.check}
                        />
                    </div>
                ) : (
                    <div
                        className='editable-cell-text-wrapper'
                        style={{ display: 'inline-block' }}
                    >
                        {checkedValue != undefined || ' '}
                        {
                            <span
                                style={
                                    this.props.error
                                        ? { color: 'red' }
                                        : { color: 'green' }
                                }
                            >
                                {checkedValue}
                            </span>
                        }
                        <Icon
                            type='edit'
                            className='editable-cell-icon'
                            onClick={this.edit}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default EditableCellWCB;
