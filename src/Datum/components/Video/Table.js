import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button
} from 'antd';
import { STATIC_DOWNLOAD_API, FOREST_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';

export default class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            viewVisible: false,
            viewUrl: '',
            videos: []
        };
    }

    componentDidMount = async () => {
        const {
            actions: { getForsetVideo }
        } = this.props;
        try {
            let videos = await getForsetVideo();
            this.setState({
                videos
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    componentDidUpdate (prevProps, prevState) {
        const { searchvideovisible, searchvideo } = this.props;
        if (
            searchvideovisible
        ) {
            this.filter();
        }
    }

    filter = async () => {
        const {
            searchvideo,
            actions: {
                getForsetVideo,
                searchVideoVisible
            }
        } = this.props;

        try {
            let postData = {};
            if (searchvideo && searchvideo.searchName) {
                postData = {
                    videoname: searchvideo.searchName
                };
            }
            let videos = await getForsetVideo({}, postData);
            await searchVideoVisible(false);
            this.setState({
                videos
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        const {
            selectedRowKeys
        } = this.props;
        const { videos = [] } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <Table
                    rowSelection={rowSelection}
                    dataSource={videos}
                    columns={this.columns}
                    className='foresttables'
                    bordered
                    rowKey='code'
                />
                <Modal
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
                            src={this.state.viewUrl}
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        const {
            actions: { selectDocuments, selectTableRowKeys }
        } = this.props;
        selectDocuments(selectedRows);
        selectTableRowKeys(selectedRowKeys);
    }

    columns = [
        {
            title: '视频名称',
            dataIndex: 'VideoName',
            key: 'VideoName'
        },
        {
            title: '备注',
            dataIndex: 'VideoDescribe',
            key: 'VideoDescribe'
        },
        {
            title: '提交日期',
            dataIndex: 'CreateTime',
            key: 'CreateTime'
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
                            type='primary'
                            onClick={this.update.bind(this, record)}
                        >
                            更新
                        </a>
                    </div>
                );
            }
        }
    ];

    update (record) {
        const {
            actions: { updatevisible, setoldfile }
        } = this.props;
        updatevisible(true);
        setoldfile(record);
    }

    previewFile (record) {
        try {
            let src = record.VideoPath.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            src = `${FOREST_API}/${src}`;
            this.setState({
                viewUrl: src,
                viewVisible: true
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    onCancel () {
        this.setState({
            viewVisible: false,
            viewUrl: ''
        });
    }
}
