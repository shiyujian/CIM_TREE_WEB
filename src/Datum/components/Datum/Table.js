import React, { Component } from 'react';
import { Table } from 'antd';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import './index.less';
export default class GeneralTable extends Component {
    render () {
        // 根据登陆账号是否关联标段来筛选数据，只能查看自己项目的
        let data = this.filterData();
        return (
            <Table
                rowSelection={this.rowSelection}
                dataSource={data}
                columns={this.columns}
                className='foresttables'
                bordered
                rowKey='code'
            />
        );
    }

    filterData () {
        const {
            Doc = [],
            currentSection,
            currentSectionName,
            projectName
        } = this.props;

        let filterData = [];
        if (currentSection === '' && currentSectionName === '' && projectName === '') {
            return Doc;
        } else {
            Doc.map((doc) => {
                if (doc && doc.extra_params && doc.extra_params.projectName) {
                    if (doc.extra_params.projectName === projectName) {
                        filterData.push(doc);
                    }
                }
            });
            return filterData;
        }
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            const {
                actions: { selectDocuments }
            } = this.props;
            selectDocuments(selectedRows);
        }
    };

    columns = [
        {
            title: '项目',
            dataIndex: 'extra_params.projectName',
            key: 'extra_params.projectName'
            // sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
            // sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: '编号',
            dataIndex: 'extra_params.number',
            key: 'extra_params.number'
            // sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
        },
        {
            title: '发布单位',
            dataIndex: 'extra_params.company',
            key: 'extra_params.company'
            // sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
        },
        {
            title: '实施日期',
            dataIndex: 'extra_params.time',
            key: 'extra_params.time'
            // sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
        },
        {
            title: '备注',
            dataIndex: 'extra_params.remark',
            key: 'extra_params.remark'
        },
        {
            title: '文档状态',
            dataIndex: 'extra_params.state',
            key: 'extra_params.state'
        },
        {
            title: '操作',
            render: (record, index) => {
                return (
                    <div>
                        <a onClick={this.previewFile.bind(this, record)}>
                            预览
                        </a>
                        {record.extra_params.state === '正常文档' ? (
                            <a
                                style={{ marginLeft: 10 }}
                                onClick={this.update.bind(this, record)}
                            >
                                更新
                            </a>
                        ) : (
                            ''
                        )}
                        <a
                            style={{ marginLeft: 10 }}
                            type='primary'
                            onClick={this.download.bind(this, record)}
                        >
                            下载
                        </a>
                    </div>
                );
            }
        }
    ];
    createLink = (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    download (record) {
        let array = record.basic_params.files;
        array.map(down => {
            // debugger
            let download =
                STATIC_DOWNLOAD_API +
                down.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            this.createLink(this, download);
        });
        // const { selected = [], file = [], files = [], down_file = [] } = this.props;
        // debugger
        // if (selected.length == 0) {
        // 	message.warning('没有选择无法下载');
        // }
        // for (var j = 0; j < selected.length; j++) {
        // 	if (selected[j].code == index.code) {

        // 		selected.map(rst => {
        // 			file.push(rst.basic_params.files);
        // 		});
        // 		file.map(value => {
        // 			value.map(cot => {
        // 				files.push(cot.download_url)
        // 			})
        // 		});
        // 		files.map(down => {
        // 			let down_load = STATIC_DOWNLOAD_API + "/media" + down.split('/media')[1];
        // 			this.createLink(this, down_load);
        // 		});
        // 	}
        // }
    }

    previewFile (file) {
        const {
            actions: { openPreview }
        } = this.props;
        if (JSON.stringify(file.basic_params) === '{}') {

        } else {
            const filed = file.basic_params.files[0];
            openPreview(filed);
        }
    }

    update (file) {
        const {
            actions: { updatevisible, setoldfile }
        } = this.props;
        updatevisible(true);
        setoldfile(file);
    }
}
