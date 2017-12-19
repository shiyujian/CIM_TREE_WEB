import React, { Component } from 'react';
import { Upload, Icon, Progress } from 'antd';
import { FILE_API } from '../../api';

const fileTypes =
    'video/mp4,.mp4,.dwg,.dgn,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
export const whichType = file => {
    return file.type.indexOf('officedocument') > 0 || file.type.indexOf('msword') > 0 || file.type === '';
};
export const whichTypT = file => {
    return (
        file.mime_type.indexOf('officedocument') > 0 || file.mime_type.indexOf('msword') > 0 || file.mime_type === ''
    );
};

export default class Dragger extends Component {
    static propTypes = {};

    state = {
        progress: 0
    };

    render() {
        let { progress } = this.state;
        let { isShowProgress, accept } = this.props;
        return (
            <div>
                <Upload.Dragger
                    {...this.uploadProps}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                    accept={accept !== undefined ? accept : fileTypes}
                >
                    {this.props.children}
                </Upload.Dragger>
                {isShowProgress ? <Progress percent={progress} strokeWidth={5} /> : ''}
            </div>
        );
    }

    onChange = ({ file, fileList, event }) => {
        const { onChange, handleUploading } = this.props;
        if (file.status === 'done') {
            onChange(sliceFile(file));
		}
        // 增加判断处理uploading状态的回调函数handleUploading
        if (typeof handleUploading === 'function') {
		    handleUploading(file.status === 'done' ? false : true);
        }

        if (event) {
            let { percent } = event;
            if (percent !== undefined) this.setState({ progress: parseFloat(percent.toFixed(1)) });
        }
    };

    beforeUpload = file => {
        // const valid = file.type === 'application/pdf';
        // if (!valid) {
        // 	message.error('只能上传 word、dwg、pdf、excel 文件！');
        // }
        // return valid;
        this.setState({ progress: 0 });
    };

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        headers: {
            authorization: 'authorization-text'
        },
        showUploadList: false,
        data(file) {
            return {
                name: file.fileName,
                a_file: file
            };
        }
    };
}

const sliceUrl = url => {
    const sections = url.split('/');
    const suffix = sections.slice(3).join('/');
    return `/${suffix}`;
};
export const sliceFile = file => {
    const response = file.response;
    return {
        a_file: sliceUrl(response.a_file),
        download_url: sliceUrl(response.download_url),
        misc: response.misc,
        mime_type: file.type,
        name: file.name
    };
};
