import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import moment from 'moment';
import '../Datum/index.less';
export default class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            previewModalVisible: false,
            video: '',
            filterData: [],
            src: ''
        };
    }

    componentDidUpdate (prevProps, prevState) {
        const { searchrediovisible, searchredio, Doc = [] } = this.props;
        if (
            searchrediovisible &&
            (searchredio !== prevProps.searchredio || Doc !== prevProps.Doc) &&
            Doc.length > 0
        ) {
            this.filter();
        }
    }

    filter () {
        const {
            searchredio,
            Doc
        } = this.props;

        let arr = Doc.filter(
            doc =>
                (searchredio.searchName
                    ? doc.name.indexOf(searchredio.searchName) !== -1
                    : true) &&
                (searchredio.searchDate_begin
                    ? moment(doc.extra_params.time).isAfter(
                        searchredio.searchDate_begin
                    )
                    : true) &&
                (searchredio.searchDate_end
                    ? moment(doc.extra_params.time).isBefore(
                        searchredio.searchDate_end
                    )
                    : true)
        );

        this.setState({
            filterData: arr
        });

        console.log('arrarrarr', arr);

        // searchRedioVisible(false)
    }

    render () {
        const { Doc = [], searchrediovisible } = this.props;
        const { filterData = [] } = this.state;

        // 数据是要搜索后的  还是   所有数据
        let dataSource = Doc;
        if (searchrediovisible) {
            dataSource = filterData;
        }
        return (
            <div>
                <Table
                    rowSelection={this.rowSelection}
                    dataSource={dataSource}
                    columns={this.columns}
                    className='foresttables'
                    bordered
                    rowKey='code'
                />
                <Modal
                    title='影像预览'
                    closable
                    width={920}
                    visible={this.state.previewModalVisible}
                    footer={null}
                    onCancel={this.cancelT.bind(this)}
                    cancelText={'关闭'}
                    maskClosable={false}
                >
                    {/* <video
						controls
						preload="auto"
						width="100%"
						height="500px"
						src={this.state.video}
					>
						<source src={this.props.video} />
					</video> */}
                    <img
                        style={{ width: '490px' }}
                        src={this.state.src}
                        alt='图片'
                    />
                </Modal>
            </div>
        );
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            const {
                actions: { selectDocuments }
            } = this.props;
            selectDocuments(selectedRows);
        }
    };
    cancelT () {
        this.setState({ previewModalVisible: false });
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: '编号',
            dataIndex: 'extra_params.number',
            key: 'extra_params.number',
            sorter: (a, b) =>
                a.extra_params.number.length - b.extra_params.number.length
        },
        {
            title: '发布单位',
            dataIndex: 'extra_params.company',
            key: 'extra_params.company',
            sorter: (a, b) =>
                a.extra_params.company.length - b.extra_params.company.length
        },
        {
            title: '拍摄日期',
            dataIndex: 'extra_params.time',
            key: 'extra_params.time',
            sorter: (a, b) =>
                moment(a.extra_params.time).unix() -
                moment(b.extra_params.time).unix()
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

    // previewFile(file) {
    // 	console.log(file.basic_params.files)
    // 	const videos = file.basic_params.files[0] || []
    // 	console.log(videos.a_file.split(".")[4])
    // 	// const index=videos.a_file.indexOf(".")
    // 	// console.log(index)
    // 	let a_file = videos.a_file.split(".")[4]
    // 	console.log(a_file)

    // 	if (a_file == "mp4") {
    // 		console.log(1)
    // 		this.setState({ previewModalVisible: true, video: videos.a_file })

    // 	} else {
    // 		const { actions: { openPreview } } = this.props;
    // 		console.log(2)

    // 		if (JSON.stringify(file.basic_params) == "{}") {
    // 			console.log(3)
    // 			return
    // 		} else {
    // 			console.log(4)

    // 			const filed = file.basic_params.files[0];
    // 			openPreview(filed);
    // 		}
    // 	}
    // }

    previewFile (file) {
        console.log(file.basic_params.files);
        const videos = file.basic_params.files[0] || {};
        let src =
            SOURCE_API + videos.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        console.log('src', src);

        this.setState({
            src,
            previewModalVisible: true
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
