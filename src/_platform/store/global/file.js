/**
 * Created by pans0911 on 2017/5/25.
 */
import { STATIC_PREVIEW_API } from '../../api';
export const fileTypes = `application/pdf,.mp4,video/mp4,
	application/vnd.openxmlformats-officedocument.wordprocessingml.document,
	application/msword,
	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
	application/vnd.ms-excel`;
export const whichType = file => {
    return (
        file.mime_type.indexOf('officedocument') > 0 ||
        file.mime_type.indexOf('msword') > 0 ||
        file.mime_type === '' ||
        file.mime_type.indexOf('vnd.ms-excel') > 0
    );
};
export const getFileData = file => {
    let data = {
        previewType: '',
        previewUrl: '',
        previewVisible: false,
        loading: false,
        canPreview: false
    };
    if (
        file.mime_type.indexOf('officedocument') > 0 ||
        file.mime_type.indexOf('msword') > 0 ||
        file.mime_type === '' ||
        file.mime_type.indexOf('vnd.ms-excel') > 0
    ) {
        // office的预览
        data.previewType = 'office';
        let previewUrl =
                STATIC_PREVIEW_API +
                file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        data.previewUrl = previewUrl;
        data.previewVisible = true;
        data.loading = true;
        data.canPreview = true;
    } else {
        // pdf的预览
        data.previewType = 'pdf';
        let previewUrl =
                STATIC_PREVIEW_API +
                file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        data.previewUrl = previewUrl;
        data.previewVisible = true;
        data.loading = true;
        data.canPreview = true;
    }
    return data;
};
