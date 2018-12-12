import React, { Component } from 'react';
import echarts from 'echarts';
import { Card, Spin, Row, Col, Table } from 'antd';
import moment from 'moment';

export default class TreeTypeRight extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false
        };
    }
    async componentDidMount () {

    }

    async componentDidUpdate (prevProps, prevState) {
        const {
            statByTreetypeQueryTime,
            queryTime
        } = this.props;
        if (queryTime && queryTime !== prevProps.queryTime) {
            this.loading();
        }
        if (statByTreetypeQueryTime && statByTreetypeQueryTime !== prevProps.statByTreetypeQueryTime) {
            this.query();
        }
    }

    loading = () => {
        this.setState({
            loading: true
        });
    }

    query = () => {
        const {
            statByTreetype
        } = this.props;
        try {
            if (statByTreetype && statByTreetype instanceof Array) {
                // 将获取的数据按照 ProgressTime 时间排序
                statByTreetype.sort(function (a, b) {
                    if (a.Num > b.Num) {
                        return -1;
                    } else if (a.Num < b.Num) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                this.setState({
                    dataSource: statByTreetype,
                    loading: false
                });
            }
        } catch (e) {
            console.log('middleRight', e);
        }
    }

    render () {
        const {
            dataSource
        } = this.state;

        return (
            <Spin spinning={this.state.loading}>
                <div
                    id='middleRight'
                    style={{ width: '100%', height: '350px' }}
                >
                    <Table
                        dataSource={dataSource}
                        columns={this.column}
                        rowKey='index'
                        bordered
                        pagination={false}
                        scroll={{ y: 291 }}
                        style={{height: '100%'}}
                    />
                </div>
            </Spin>
        );
    }

    column = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (record, text, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '树种',
            dataIndex: 'TreeTypeName'
        },
        {
            title: '数量',
            dataIndex: 'Num'
        }
    ]
}
