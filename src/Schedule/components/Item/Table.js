import React, { Component } from 'react';
import { Table, Icon, Popconfirm, Select, message } from 'antd';
import Selector from './PackageSelector';
const Option = Select.Option;

export default class ItemTable extends Component {
    static layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };

    render () {
        const { parameters = [] } = this.props;
        return (
            <Table
                title={this.title.bind(this)}
                dataSource={parameters}
                columns={this.columns}
                bordered
                rowKey='code'
            />
        );
    }

    title () {
        return <Selector {...this.props} />;
    }

    componentDidMount () {
        const {
            actions: { getWpitemtypesMeta }
        } = this.props;
        getWpitemtypesMeta();
    }

    remove (item) {
        const { removeParameters } = this.props.actions;
        removeParameters(item);
    }

    save (item) {
        const {
            actions: { setParameters }
        } = this.props;
        item.editing = false;
        setParameters();
    }

    changeSuffix (item, value = '') {
        const {
            actions: { setParameters }
        } = this.props;
        const [code, name] = value.split('---');
        item.code = `${item.section}-${code}`;
        item.name = name;
        setParameters(); // todo
    }

    columns = [
        {
            title: '子分项工程',
            dataIndex: 'section'
        },
        {
            title: '分项工程编码',
            render: item => {
                if (item.code <= 0) {
                    return '';
                } else {
                    return item.code;
                }
            }
        },
        {
            title: '分项工程名称',
            render: item => {
                if (item.editing) {
                    const { itemTypes = [] } = this.props;
                    return (
                        <div>
                            <Select
                                value={item.name}
                                onChange={this.changeSuffix.bind(this, item)}
                                style={{ width: '100%' }}
                            >
                                {itemTypes.map(suffix => {
                                    return (
                                        <Option
                                            key={suffix.code}
                                            value={`${suffix.code}---${
                                                suffix.name
                                            }`}
                                        >
                                            {suffix.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                    );
                } else {
                    return item.name;
                }
            }
        },
        {
            title: '操作',
            render: item => {
                if (item.editing) {
                    return [
                        <a
                            key='0'
                            href='#'
                            onClick={this.save.bind(this, item)}
                        >
                            <Icon type='save' />
                        </a>,
                        <Popconfirm
                            key='1'
                            title='确定删除新增项?'
                            onConfirm={this.remove.bind(this, item)}
                            okText='是'
                            cancelText='否'
                        >
                            <a href='#'>
                                <Icon type='close' />
                            </a>
                        </Popconfirm>
                    ];
                } else {
                    return [
                        <Popconfirm
                            key='2'
                            title='确定删除分项?'
                            onConfirm={this.remove.bind(this, item)}
                            okText='是'
                            cancelText='否'
                        >
                            <a href='#'>
                                <Icon type='delete' />
                            </a>
                        </Popconfirm>
                    ];
                }
            }
        }
    ];
}
