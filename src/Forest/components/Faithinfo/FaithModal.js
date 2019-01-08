import React, { Component } from 'react';
import { Table, Modal, Row, Col, Button, Progress } from 'antd';
import { FOREST_API } from '../../../_platform/api';
import '../index.less';

export default class FaithModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            loading1: true,
            size: 10,
            exportsize: 100,
            leftkeycode: '',
            section: '',
            bigType: '',
            treetype: '',
            treetypename: '',
            integrity: '',
            percent: 0,
            factory: ''
        };
    }

    componentWillReceiveProps (nextProps) {
        const { honestyList = [] } = nextProps;
        if (honestyList.length != 0) {
            this.setState({
                loading1: false
            });
        } else {
            this.setState({
                loading1: true
            });
        }
    }

    render () {
        const {
            faith: { visibleModal } = false,
            honestyList = [],
            nurseryName = ''
        } = this.props;
        let newList = [];
        honestyList.map((item, index) => {
            item.order = index + 1;
            newList.push(item);
        });
        return (
            <Modal
                closable={false}
                visible={visibleModal}
                onOk={this.hideModal.bind(this)}
                onCancel={this.hideModal.bind(this)}
                okText='确认'
                cancelText='取消'
            >
                <Row>
                    <Col span={20}>
                        {`${nurseryName} 诚信度详情`}
                    </Col>
                    <Col span={2}>
                        <Button type='primary' onClick={this.exportexcel.bind(this)}>
                            导出
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Table bordered
                        className='foresttable'
                        columns={this.columns}
                        rowKey='order'
                        loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status='active' strokeWidth={5} />, spinning: this.state.loading1 }}
                        locale={{ emptyText: '当天无信息' }}
                        dataSource={newList}
                    />
                </Row>
            </Modal>
        );
    }

    columns = [{
        title: '序号',
        dataIndex: 'order'
    }, {
        title: '标段',
        dataIndex: 'Section'
    }, {
        title: '树种',
        dataIndex: 'TreeTypeName'
    }, {
        title: '诚信度',
        dataIndex: 'Sincerity'
    }];

    hideModal () {
        const { actions: { changeModal1 } } = this.props;
        changeModal1(false);
    }

    exportexcel () {
        const {
            section = '',
            treetype = '',
            integrity = ''
        } = this.state;
        const {
            actions: { getHonestyNewDetailModal, getexportFactoryAnalyseDetailInfo },
            keycode = '',
            nurseryName = ''
        } = this.props;

        let postdata = {
            factory: nurseryName
        };
        this.setState({ loading: true, percent: 0 });
        getexportFactoryAnalyseDetailInfo({}, postdata)
            .then(rst3 => {
                this.setState({ loading: false, percent: 100 });
                window.location.href = `${FOREST_API}/${rst3}`;
            });
    }

    createLink (name, url) {
        let link = document.createElement('a');
        // link.download = name;
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
