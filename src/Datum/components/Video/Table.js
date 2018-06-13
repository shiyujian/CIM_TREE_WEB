import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button
} from 'antd';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';

export default class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            video: '',
            filterData: [],
            src: '',
            viewVisible: false,
            down_file: ''
        };
    }

    componentDidUpdate (prevProps, prevState) {
        const { searchvideovisible, searchvideo, Doc = [] } = this.props;
        if (
            searchvideovisible &&
            (searchvideo !== prevProps.searchvideo || Doc !== prevProps.Doc) &&
            Doc.length > 0
        ) {
            this.filter();
        }
    }

    filter () {
        const {
            searchvideo,
            Doc
        } = this.props;

        let arr = Doc.filter(
            doc =>
                (searchvideo.searchName
                    ? doc.name.indexOf(searchvideo.searchName) !== -1
                    : true) &&
                (searchvideo.searchType
                    ? doc.extra_params.type.indexOf(searchvideo.searchType) !==
                      -1
                    : true) &&
                (searchvideo.searchDate_begin
                    ? moment(doc.extra_params.time).isAfter(
                        searchvideo.searchDate_begin
                    )
                    : true) &&
                (searchvideo.searchDate_end
                    ? moment(doc.extra_params.time).isBefore(
                        searchvideo.searchDate_end
                    )
                    : true)
        );

        this.setState({
            filterData: arr
        });

        // searchRedioVisible(false)
    }

    render () {
        const { Doc = [], searchvideovisible } = this.props;
        const { filterData = [] } = this.state;

        // 数据是要搜索后的  还是   所有数据
        let dataSource = Doc;
        if (searchvideovisible) {
            dataSource = filterData;
        }
        // 根据登陆账号是否关联标段来筛选数据，只能查看自己项目的
        let data = this.filterData(dataSource);
        return (
            <div>
                <Table
                    rowSelection={this.rowSelection}
                    dataSource={data}
                    columns={this.columns}
                    className='foresttables'
                    bordered
                    rowKey='code'
                />
                <Modal
                    // title="视频预览"
                    visible={this.state.viewVisible}
                    cancelText={'关闭'}
                    width='800px'
                    footer={null}
                    onCancel={this.onCancel.bind(this)}
                    onOk={this.onCancel.bind(this)}
                >
                    <div>
                        <video
                            controls
                            preload='auto'
                            width='100%'
                            height='500px'
                            src={this.state.down_file}
                        >
                            <source
                                src='this.state.video'
                                type='video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;'
                            />
                            <source
                                src='this.state.video'
                                type='video/ogg; codecs=&quot;theora, vorbis&quot;'
                            />
                            <source
                                src='this.state.video'
                                type='video/webm; codecs=&quot;vp8, vorbis&quot;'
                            />
                        </video>
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.onCancel.bind(this)}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                关闭
                            </Button>
                        </Row>
                    </div>
                </Modal>
            </div>
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
            // sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: '视频名称',
            dataIndex: 'name',
            key: 'name'
            // sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: '视频类型',
            dataIndex: 'extra_params.type',
            key: 'extra_params.type'
            // sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
        },
        {
            title: '提交日期',
            dataIndex: 'extra_params.time',
            key: 'extra_params.time'
            // sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
        },
        {
            title: '备注',
            dataIndex: 'extra_params.remark',
            key: 'extra_params.remark'
            // sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
        },
        {
            title: '资料状态',
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
    }

    previewFile (record) {
        this.setState({
            down_file: record.basic_params.files[0].download_url,
            viewVisible: true
        });
    }
    onCancel () {
        this.setState({
            viewVisible: false
        });
    }

    update (file) {
        const {
            actions: { updatevisible, setoldfile }
        } = this.props;
        updatevisible(true);
        setoldfile(file);
    }
}
