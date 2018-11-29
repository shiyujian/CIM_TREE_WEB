import React, { Component } from 'react';
import { Input, Modal, Form, Notification } from 'antd';
import { PROJECTPOSITIONCENTER } from '_platform/api';
import './AdoptTreeMess.less';

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
            }
            let repeat = false;
            PROJECTPOSITIONCENTER.map((view) => {
                if (name === view.name) {
                    repeat = true;
                }
            });
            customViewByUserID.map((view) => {
                if (name === view.name) {
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
            const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
            console.log('user', user);
            let postData = {
                name: name,
                zoom: saveUserMapCustomPositionZoom,
                center: [
                    {
                        lng: saveUserMapCustomPositionCenter.lng,
                        lat: saveUserMapCustomPositionCenter.lat
                    }
                ],
                user: user.id
            };
            let data = await postUserCustomView({}, postData);
            console.log('data', data);
            if (data && data.id) {
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
            await getCustomViewByUserID({id: user.id});
            await this.props.onCancel();
        } catch (e) {
            console.log('e', e);
        }
    }

    handleSaveCustomPositionCancel = async () => {
        await this.props.onCancel();
    }

    render () {
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
                <Input placeholder='请输入名称' onChange={this.handleNameChange.bind(this)} />
            </Modal>

        );
    }

    handleNameChange = async (e) => {
        this.setState({
            name: e.target.value
        });
    }
}
export default Form.create()(SaveUserMapCustomPositionModal);
