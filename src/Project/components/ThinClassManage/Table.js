import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message } from 'antd';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import {FOREST_API} from '_platform/api';

const FormItem = Form.Item;
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            number: '',
            treetype: ''
        };
        this.dataList = []; // 暂存数据
        this.onSearch = this.onSearch.bind(this); // 查询细班
        this.handleNumber = this.handleNumber.bind(this); // 细班编号
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.columns = [
            {
                key: '1',
                title: '序号',
                dataIndex: '',
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    );
                }
            },
            {
                key: '2',
                title: '细班编号',
                dataIndex: 'ThinClass'
            },
            {
                key: '3',
                title: '树木类型',
                dataIndex: 'TreeType'
            },
            {
                key: '4',
                title: '细班面积',
                dataIndex: 'Area'
            },
            {
                key: '6',
                title: '操作',
                dataIndex: 'action',
                render: (text, record, index) => {
                    return (
                        <div>
                            <a onClick={this.onEdit.bind(this, record)}>编辑</a>
                        </div>
                    );
                }
            }
        ];
    }
    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    componentDidMount () {
        this.initMap();
    }
    initMap () {
        
    }
    render () {
        const { dataList, total, page } = this.state;
        const propsUpload = {
            name: 'file',
            action: '',
            beforeUpload: (file, fileList) => {
                console.log(file);
                this.setState({
                    fileList
                });
                return false;
            }
        };
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='细班编号'>
                            <Input style={{width: 200}} onChange={this.handleNumber.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 600, float: 'left'}}>
                        <Table columns={this.columns} dataSource={dataList} pagination={false} rowKey='ID' />
                        <Pagination style={{float: 'right', marginTop: 10}} defaultCurrent={page} total={total} onChange={this.handlePage.bind(this)} />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 600, height: 600, overflow: 'hidden'}}>
                        <div id='mapid' />
                    </div>
                </div>
            </div>
        );
    }
    onSearch () {
        const { treetype, number } = this.state;
        let { getThinClass } = this.props.actions;
        getThinClass({}, {
            no: number,
            treetype: treetype,
            page: 1,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                // this.setState({
                //     dataList: rep.content
                // });
            }
        });
    }
    handleNumber (e) {
        this.setState({
            number: e.target.value
        });
    }
    onAdd () {
        this.setState({
            showModal: true
        });
    }
    onEdit (record, e) {
        e.preventDefault();
        this.setState({
            showModal: true,
            record
        });
    }
    handlePage (page, pageSize = 10) {
        page = page - 1;
        this.setState({
            dataList: this.dataList.slice(page * 10, page * 10 + 9)
        });
    }
}

export default Form.create()(Tablelevel);
