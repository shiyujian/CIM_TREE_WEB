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

class EditableCell extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            value: this.props.value,
            // editable: true,
            editable: this.props.editOnOff
        };
        this.editCache = {};
    }

    handleChange = e => {
        const value = e.target.value;
        this.setState({ value });
    };

    check = () => {
        let { asyncVerify } = this.props;
        let value = this.state.value;
        asyncVerify && asyncVerify(value);
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
        this.setState({ editable: false });
    };

    edit = () => {
        this.setState({ editable: true });
    };

    render () {
        const { value, editable } = this.state;
        return (
            <div className='editable-cell' style={{ width: '100%' }}>
                {editable ? (
                    <div className='editable-cell-input-wrapper'>
                        <Input
                            value={value}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                            onBlur={this.check}
                        />
                        <Icon
                            type='check'
                            className='editable-cell-icon-check'
                            onClick={this.check}
                        />
                    </div>
                ) : (
                    <div className='editable-cell-text-wrapper'>
                        {value != undefined || ' '}
                        {value}
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

export default EditableCell;
