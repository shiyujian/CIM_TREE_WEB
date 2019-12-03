import React, { Component } from 'react';
import { Table, Row, Col, Modal, Card, TreeSelect } from 'antd';
import moment from 'moment';
import {
    getDefaultProject
} from '_platform/auth';
import { Link } from 'react-router-dom';
import './styles.less';
// import {
//     getAreaTreeData
// } from '_platform/auth';
var echarts = require('echarts');
// const { TreeNode } = TreeSelect;
export default class Person extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            count: 0
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.section != this.props.section) {
            this.getWorkMansbyday(nextProps.section);
        }
    }

    componentDidMount = async () => {
        let defaultProject = await getDefaultProject();
        this.getWorkMansbyday(defaultProject);
    }

    getWorkMansbyday (params) { // 获取今日人员投入
        const {
            actions: { getWorkMansbyday }
        } = this.props;
        let now = new Date(); // 获取当前日期
        let year = now.getFullYear(); // 得到年份
        let month = now.getMonth() + 1;// 得到月份
        month = month < 10 ? '0' + month : month;
        let date = now.getDate();// 得到日期
        date = date < 10 ? '0' + date : date;
        let section = params && params != '0' ? params : '';
        let stime = year + '-' + month + '-' + date + ' ' + '00:00:00';
        let etime = year + '-' + month + '-' + date + ' ' + '24:00:00';
        getWorkMansbyday({}, {
            section: section,
            stime: stime,
            etime: etime
        }).then(rep => {
            if (rep.code === 200) {
                let data = rep.content;
                this.setState({
                    count: data.length
                });
                this.drawPile(data);
            }
        });
    }

    drawPile (data) { // 绘制饼图
        let arrs = this.groupArr(data);
        let type = [];
        let datas = [];
        for (let i = 0; i < arrs.length; i++) {
            type.push(
                arrs[i].worktype
            );
            datas.push({
                value: arrs[i].data.length,
                name: arrs[i].worktype
            });
        }
        this.setState({
            dataList: arrs
        });

        let myChart = echarts.init(document.getElementById('pieChart'));
        let option = {
            title: {
                text: '',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 300
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}人 ({d}%)',
                position: 'right'
            },
            legend: {
                // orient: 'vertical',
                // x: 'left',
                // top: 40,
                type: 'scroll',
                bottom: 0,
                data: type,
                textStyle: {
                    fontSize: 10
                }
            },
            series: [
                {
                    name: '投入人数',
                    type: 'pie',
                    // label: {
                    //     normal: {
                    //         show: false
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: false
                    //     }
                    // },
                    radius: ['50%', '70%'],
                    data: datas,
                    itemStyle: {
                        // emphasis: {
                        //     shadowBlur: 10,
                        //     shadowOffsetX: 0,
                        //     shadowColor: 'rgba(0, 0, 0, 0.5)'
                        // },
                        normal: {
                            color: function (params) {
                            // 自定义颜色
                                var colorList = [
                                    '#FE7295', '#33CEFE', '#6D66DA', '#FEC200', '#43DDA1', '#FE8463'
                                ];
                                return colorList[params.dataIndex];
                            }
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    groupArr (data) {
        var arr = [];
        if (data.length > 0) { // 初步处理简化数据
            for (let i = 0; i < data.length; i++) {
                if (data[i].WorkType) {
                    arr.push({
                        id: data[i].ID,
                        worktype: data[i].WorkType.Name
                    });
                } else {
                    arr.push({
                        id: data[i].ID,
                        worktype: '其他'
                    });
                }
            }
        }
        var map = {},
            dest = [];
        for (let j = 0; j < arr.length; j++) { // 深层处理  数据分类
            var ai = arr[j];
            if (!map[ai.worktype]) {
                dest.push({
                    id: ai.id,
                    worktype: ai.worktype,
                    data: [ai]
                });
                map[ai.worktype] = ai;
            } else {
                for (var k = 0; k < dest.length; k++) {
                    var dj = dest[k];
                    if (dj.worktype == ai.worktype) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        return dest;
        console.log(dest);
    }

    columns = [
        {
            title: '工种',
            dataIndex: 'worktype',
            key: 'worktype',
            render: (text, record, index) => {
                text = text.split('（')[0];
                if (index == 0 || index % 6 == 0) {
                    return (
                        <div style={{float: 'left', marginLeft: '30%'}}>
                            <span style={{backgroundColor: '#FE7295', display: 'inline-block', height: '10px', width: '10px'}} />
                            <span style={{marginLeft: '10px'}}>{text}</span>
                        </div>
                    );
                } else if (index == 1 || index % 6 == 1) {
                    return (
                        <div style={{float: 'left', marginLeft: '30%'}}>
                            <span style={{backgroundColor: '#33CEFE', display: 'inline-block', height: '10px', width: '10px'}} />
                            <span style={{marginLeft: '10px'}}>{text}</span>
                        </div>
                    );
                } else if (index == 2 || index % 6 == 2) {
                    return (
                        <div style={{float: 'left', marginLeft: '30%'}}>
                            <span style={{backgroundColor: '#6D66DA', display: 'inline-block', height: '10px', width: '10px'}} />
                            <span style={{marginLeft: '10px'}}>{text}</span>
                        </div>
                    );
                } else if (index == 3 || index % 6 == 3) {
                    return (
                        <div style={{float: 'left', marginLeft: '30%'}}>
                            <span style={{backgroundColor: '#FEC200', display: 'inline-block', height: '10px', width: '10px'}} />
                            <span style={{marginLeft: '10px'}}>{text}</span>
                        </div>
                    );
                } else if (index == 4 || index % 6 == 4) {
                    return (
                        <div style={{float: 'left', marginLeft: '30%'}}>
                            <span style={{backgroundColor: '#43DDA1', display: 'inline-block', height: '10px', width: '10px'}} />
                            <span style={{marginLeft: '10px'}}>{text}</span>
                        </div>
                    );
                } else if (index == 5 || index % 6 == 5) {
                    return (
                        <div style={{float: 'left', marginLeft: '30%'}}>
                            <span style={{backgroundColor: '#FE8463', display: 'inline-block', height: '10px', width: '10px'}} />
                            <span style={{marginLeft: '10px'}}>{text}</span>
                        </div>
                    );
                }
            }
        },
        {
            title: '人数',
            dataIndex: 'data',
            key: 'data',
            render: (text, record) => {
                if (text) {
                    text = text.length;
                }
                return text + ' 人';
            }
        }
    ];

    // onChangeSection (value) { // 标段切换查询数据
    //     this.getWorkMansbyday(value);
    //     this.setState({
    //         section: value
    //     });
    // }

    render () {
        const {
            dataList,
            count
        } = this.state;
        return (
            <Row>
                <Card title='今日人员投入' className='HomeCard' style={{marginLeft: '2%'}} extra={
                    <Link to='/project/manentranceanddeparture'>
                        更多
                    </Link>
                }>
                    <div id='pieChart' style={{ float: 'left', height: 250, width: '50%' }} />
                    <div style={{ float: 'left', height: 250, width: '50%' }}>
                        <div style={{marginTop: '5px'}}>总计：<span style={{color: '#17bfb1'}}>{count}</span> 人</div>
                        <Table
                            size='small'
                            dataSource={dataList}
                            pagination={false}
                            columns={this.columns}
                            rowKey='id'
                            style={{marginRight: '10px', marginTop: '10px'}}
                            scroll={{ y: '200px' }}
                        />
                    </div>
                </Card>
            </Row>
        );
    }
}
