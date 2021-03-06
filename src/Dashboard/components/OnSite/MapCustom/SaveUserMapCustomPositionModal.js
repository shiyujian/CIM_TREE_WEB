import React, { Component } from 'react';
import { Input, Modal, Form, Notification } from 'antd';
import { PROJECTPOSITIONCENTER } from '_platform/api';
import {
    getUser,
    trim
} from '_platform/auth';

class SaveUserMapCustomPositionModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            name: ''
        };
    }

    handleSaveCustomPositionOk = async () => {
        const {
            actions: {
                postUserCustomView,
                getCustomViewByUserID
            },
            saveUserMapCustomPositionCenter = '',
            saveUserMapCustomPositionZoom = '',
            customViewByUserID = []
        } = this.props;
        const {
            name
        } = this.state;
        try {
            if (!name) {
                Notification.error({
                    message: '请输入视图名称',
                    duration: 3
                });
                return;
            } else {
                if (name.length >= 4 && name.length <= 20) {
                    console.log('name', name);
                } else {
                    Notification.warning({
                        message: '请输入4到20个字符'
                    });
                    return;
                }
            }
            let repeat = false;
            PROJECTPOSITIONCENTER.map((view) => {
                if (name === view.Name) {
                    repeat = true;
                }
            });
            customViewByUserID.map((view) => {
                if (name === view.Name) {
                    repeat = true;
                }
            });
            if (repeat) {
                Notification.error({
                    message: '视图名称已存在，请重新修改',
                    duration: 3
                });
                return;
            }
            let user = getUser();
            let postData = {
                Name: name,
                Zoom: saveUserMapCustomPositionZoom,
                Lng: saveUserMapCustomPositionCenter.lng,
                Lat: saveUserMapCustomPositionCenter.lat,
                // center: [
                //     {
                //         lng: saveUserMapCustomPositionCenter.lng,
                //         lat: saveUserMapCustomPositionCenter.lat
                //     }
                // ],
                Creater: user.ID
            };
            let data = await postUserCustomView({}, postData);
            if (data && data.code && data.code === 1) {
                Notification.success({
                    message: '保存视图成功',
                    duration: 3
                });
            } else {
                Notification.error({
                    message: '保存视图失败',
                    duration: 3
                });
            }
            await getCustomViewByUserID({id: user.ID});
            await this.props.onCancel();
        } catch (e) {
            console.log('handleSaveCustomPositionOk', e);
        }
    }

    handleSaveCustomPositionCancel = async () => {
        await this.props.onCancel();
    }

    render () {
        const {
            name
        } = this.state;
        return (
            <Modal
                title={'新建视图命名'}
                visible
                width={530}
                centered
                closable={false}
                maskClosable={false}
                onOk={this.handleSaveCustomPositionOk.bind(this)}
                onCancel={this.handleSaveCustomPositionCancel.bind(this)}
            >
                <Input
                    placeholder='请输入名称（4到20个字符，支持中英文，数字和特殊字符）'
                    onChange={this.handleNameChange.bind(this)} />
            </Modal>

        );
    }

    handleNameChange = async (e) => {
        let value = e.target.value;
        value = trim(value);
        this.setState({
            name: value
        });
    }
}
export default Form.create()(SaveUserMapCustomPositionModal);
