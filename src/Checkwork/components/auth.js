import './Checkwork.less';
export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
};

export const handleCoordinates = (str) => {
    let target = str.split(',').map(item => {
        return item.split(' ').map(_item => _item - 0);
    });
    let treearea = [];
    let arr = [];
    target.map((data, index) => {
        if (data && data instanceof Array && data[1] && data[0]) {
            arr.push([data[1], data[0]]);
        }
    });
    treearea.push(arr);
    return treearea;
};
// 处理搜索数据
export const handleFilterData = (values, start, end) => {
    let params = {};
    params.orgID = values.orgID ? values.orgID : '';
    params.groupId = values.groupId ? values.groupId : '';
    if (values.searchDate) {
        params.sTime = start;
        params.eTime = end;
    }
    if (values.status === 2) { // 迟到默认可查询状态5
        params.status = values.status + ',5';
    } else if (values.status === 3) { // 早退默认可查询状态5
        params.status = values.status + ',5';
    } else {
        params.status = values.status ? values.status : '';
    }
    params.role = values.role ? values.role : '';
    params.duty = values.duty ? values.duty : '';
    return params;
};
