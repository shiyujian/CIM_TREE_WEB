import {handlePOLYGONWktData} from '_platform/gisAuth';

// 森林大数据-数字化验收 根据验收状态的ID获取验收状态名称
export const getStatusByID = (ID) => {
    switch (ID) {
        case 0:
            return '施工提交';
        case 1:
            return '监理审核通过';
        case 2:
            return '监理审核不通过';
        case 3:
            return '业主审核通过';
        case 4:
            return '业主审核不通过';
        default:
            return '';
    }
};

// 森林大数据-数字化验收 根据验收类型的ID获取验收类型名称
export const getYsTypeByID = (ID) => {
    if (!ID) {
        return '';
    }
    switch (ID) {
        case 1:
            return '土地整理';
        case 2:
            return '放样点穴';
        case 3:
            return '挖穴';
        case 4:
            return '苗木质量';
        case 5:
            return '土球质量';
        case 6:
            return '苗木栽植';
        case 7:
            return '苗木支架';
        case 8:
            return '苗木浇水';
        case 9:
            return '大数据';
        case 10:
            return '造林面积';
        case 11:
            return '总体合格率';
        default:
            return '';
    }
};

// wkt 转换 json数据
export const wktToJson = (wkt) => {
    let coords = [];
    if (wkt.indexOf('MULTIPOLYGON') !== -1) {
        let datas = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf(')))') + 1);
        let arr = datas.split('),(');
        arr.map((a, index) => {
            let str = a.slice(a.indexOf('(') + 1, a.length - 1);
            coords.push(str);
        });
    } else if (wkt.indexOf('POLYGON') !== -1) {
        let str = handlePOLYGONWktData(wkt);
        coords.push(str);
    } else if (wkt.indexOf('LINESTRING') !== -1) {
        let wktStr = wkt.split('(')[1].split(')')[0];
        let middle = wktStr.split(',');
        middle.map(item => {
            let obj = {
                X: parseFloat(item.split(' ')[0]),
                Y: parseFloat(item.split(' ')[1])
            };
            coords.push(obj);
        });
    }
    return coords;
};

// 点击区域地块处理细班坐标数据
export const handleAreaLayerData = async (eventKey, getTreearea, sectionn) => {
    let handleKey = eventKey.split('-');
    let no = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
    let section = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
    if (handleKey.length === 4) {
        no = eventKey;
        section = sectionn;
    }
    try {
        let rst = await getTreearea({}, { no: no });
        if (!(rst && rst.content && rst.content instanceof Array && rst.content.length > 0)) {
            return;
        }
        let coords = [];
        let str = '';
        let contents = rst.content;
        let datas = [];
        let coordsList = [];
        contents.map((content) => {
            if (content.Section && content.Section === section) {
                datas.push(content);
            }
        });
        // let data = contents.find(content => content.Section === section);
        // console.log('data', data);
        datas.map((data) => {
            let wkt = data.coords;
            if (wkt.indexOf('MULTIPOLYGON') !== -1) {
                let datas = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf(')))') + 1);
                let arr = datas.split('),(');
                arr.map((a, index) => {
                    str = a.slice(a.indexOf('(') + 1, a.length - 1);
                    coords.push(str);
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = handlePOLYGONWktData(wkt);
                coords.push(str);
            }
            coordsList.push(coords);
        });
        console.log('coordsList', coordsList);

        return coordsList;
    } catch (e) {
        console.log('handleAreaLayerData', e);
    }
};

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
