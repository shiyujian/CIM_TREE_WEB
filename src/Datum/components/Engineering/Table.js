import React, { Component } from 'react';
import { Table } from 'antd';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
export default class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            filterData: []
        };
    }

    componentDidUpdate (prevProps, prevState) {
        const { searchenginvisible, searchengin, Doc = [] } = this.props;
        if (
            searchenginvisible &&
            (searchengin !== prevProps.searchengin || Doc !== prevProps.Doc) &&
            Doc.length > 0
        ) {
            this.filter();
        }
    }

    filter () {
        const {
            searchengin,
            Doc,
            selectDoc,
            parent
        } = this.props;

        let canSection = false;
        if (selectDoc === '综合管理性文件' || parent === '综合管理性文件') {
            canSection = true;
        }

        let arr = Doc.filter(
            doc =>
                (searchengin.searchProject
                    ? doc.extra_params.projectName.indexOf(
                        searchengin.searchProject
                    ) !== -1
                    : true) &&
                (canSection
                    ? true
                    : searchengin.searcSection
                        ? doc.extra_params.currentSection.indexOf(
                            searchengin.searcSection
                        ) !== -1
                        : true) &&
                (searchengin.searchName
                    ? doc.name.indexOf(searchengin.searchName) !== -1
                    : true) &&
                (searchengin.searchCode
                    ? doc.extra_params.number.indexOf(searchengin.searchCode) !==
                      -1
                    : true) &&
                (searchengin.searchDate_begin
                    ? moment(doc.extra_params.time).isAfter(
                        searchengin.searchDate_begin
                    )
                    : true) &&
                (searchengin.searchDate_end
                    ? moment(doc.extra_params.time).isBefore(
                        searchengin.searchDate_end
                    )
                    : true)
        );

        this.setState({
            filterData: arr
        });

        // searchEnginVisible(false)
    }
    render () {
        const { Doc = [], selectDoc, parent, searchenginvisible } = this.props;
        const { filterData = [] } = this.state;

        // 是否要显示标段
        let canSection = false;
        if (selectDoc === '综合管理性文件' || parent === '综合管理性文件') {
            canSection = true;
        }

        // 数据是要搜索后的  还是   所有数据
        let dataSource = Doc;
        if (searchenginvisible) {
            dataSource = filterData;
        }
        // 根据登陆账号是否关联标段来筛选数据，只能查看自己项目的
        let data = this.filterData(dataSource);

        return (
            <Table
                rowSelection={this.rowSelection}
                dataSource={data}
                columns={canSection ? this.columns1 : this.columns}
                className='foresttables'
                bordered
                rowKey='code'
            />
        );
    }

    filterData (dataSource) {
        const {
            currentSection,
            currentSectionName,
            projectName
        } = this.props;

        let filterData = [];
        if (currentSection === '' && currentSectionName === '' && projectName === '') {
            return dataSource;
        } else {
            dataSource.map((doc) => {
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
        },
        {
            title: '标段',
            dataIndex: 'extra_params.currentSectionName',
            key: 'extra_params.currentSectionName'
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'extra_params.name'
        },
        {
            title: '编号',
            dataIndex: 'extra_params.number',
            key: 'extra_params.number'
        },
        {
            title: '文档类型',
            dataIndex: 'extra_params.doc_type',
            key: 'extra_params.doc_type'
        },
        // ,{
        // 	title: '提交单位',
        // 	dataIndex: 'extra_params.unit',
        // 	key: 'unit',
        // }
        {
            title: '提交人',
            dataIndex: 'extra_params.people',
            key: 'extra_params.people',
            render: (text, record, index) => {
                if (
                    record &&
                    record.extra_params &&
                    record.extra_params.username
                ) {
                    return (
                        <span>{`${record.extra_params.people}(${
                            record.extra_params.username
                        })`}</span>
                    );
                } else {
                    return <span>{text}</span>;
                }
            }
        },
        {
            title: '提交时间',
            dataIndex: 'extra_params.time',
            key: 'extra_params.time'
        },
        {
            title: '操作',
            render: (record, index) => {
                return (
                    <div>
                        <a onClick={this.previewFile.bind(this, record)}>
                            预览
                        </a>
                        <a
                            style={{ marginLeft: 10 }}
                            onClick={this.update.bind(this, record)}
                        >
                            更新
                        </a>
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

    columns1 = [
        {
            title: '项目',
            dataIndex: 'extra_params.projectName',
            key: 'extra_params.projectName'
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'extra_params.name'
        },
        {
            title: '编号',
            dataIndex: 'extra_params.number',
            key: 'extra_params.number'
        },
        {
            title: '文档类型',
            dataIndex: 'extra_params.doc_type',
            key: 'extra_params.doc_type'
        },
        // ,{
        // 	title: '提交单位',
        // 	dataIndex: 'extra_params.unit',
        // 	key: 'unit',
        // }
        {
            title: '提交人',
            dataIndex: 'extra_params.people',
            key: 'extra_params.people',
            render: (text, record, index) => {
                if (
                    record &&
                    record.extra_params &&
                    record.extra_params.username
                ) {
                    return (
                        <span>{`${record.extra_params.people}(${
                            record.extra_params.username
                        })`}</span>
                    );
                } else {
                    return <span>{text}</span>;
                }
            }
        },
        {
            title: '提交时间',
            dataIndex: 'extra_params.time',
            key: 'extra_params.time'
        },
        {
            title: '操作',
            render: (record, index) => {
                return (
                    <div>
                        <a onClick={this.previewFile.bind(this, record)}>
                            预览
                        </a>
                        <a
                            style={{ marginLeft: 10 }}
                            onClick={this.update.bind(this, record)}
                        >
                            更新
                        </a>
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
