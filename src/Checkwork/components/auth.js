import './Checkwork.less';
export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
};
// 点击区域地块处理电子围栏坐标数据
export const handleAreaLayerData = async (eventKey, getTreearea) => {
    let handleKey = eventKey.split('-');
    let no = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
    let section = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
    try {
        let rst = await getTreearea({}, { no: no });
        if (!(rst && rst.content && rst.content instanceof Array && rst.content.length > 0)) {
            return;
        }
        let coords = [];
        let str = '';
        let contents = rst.content;
        let data = contents.find(content => content.Section === section);
        let wkt = data.coords;
        if (wkt.indexOf('MULTIPOLYGON') !== -1) {
            let datas = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf(')))') + 1);
            let arr = datas.split('),(');
            arr.map((a, index) => {
                str = a.slice(a.indexOf('(') + 1, a.length - 1);
                coords.push(str);
            });
        } else if (wkt.indexOf('POLYGON') !== -1) {
            str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
            coords.push(str);
        }
        return coords;
    } catch (e) {
        console.log('await', e);
    }
};

export const handleCoordinates = (str) => {
    let target = str.split(',').map(item => {
        return item.split(' ').map(_item => _item - 0);
    });
    let treearea = [];
    let arr = [];
    target.map((data, index) => {
        if ((data[1] > 30) && (data[1] < 45) && (data[0] > 110) && (data[0] < 120)) {
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
