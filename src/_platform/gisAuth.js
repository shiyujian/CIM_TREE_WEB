// 点击区域地块处理细班设计坐标数据
export const handleAreaDesignLayerData = async (eventKey, treeNodeName, getTreearea) => {
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
            let data = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf('))') + 1);
            let arr = data.split('),(');
            arr.map((a, index) => {
                if (index === 0) {
                    str = a.slice(a.indexOf('(') + 1, a.length - 1);
                } else if (index === arr.length - 1) {
                    str = a.slice(0, a.indexOf(')'));
                } else {
                    str = a;
                }
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
// 点击区域地块处理细班实际坐标数据
export const handleAreaRealLayerData = async (eventKey, treeNodeName, getTreearea) => {
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
        // 更新后的坐标数据是否存在
        let wkt = data.coords;
        if (data.actualcoords) {
            wkt = data.actualcoords;
        }
        if (wkt.indexOf('MULTIPOLYGON') !== -1) {
            let data = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf('))') + 1);
            let arr = data.split('),(');
            arr.map((a, index) => {
                if (index === 0) {
                    str = a.slice(a.indexOf('(') + 1, a.length - 1);
                } else if (index === arr.length - 1) {
                    str = a.slice(0, a.indexOf(')'));
                } else {
                    str = a;
                }
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

export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
};

// 获取手动框选坐标wkt
export const getHandleWktData = (coords) => {
    let wkt = '';
    let len = coords.length;
    for (let i = 0; i < coords.length; i++) {
        if (i === 0) {
            wkt = '(' + wkt + coords[i][1] + ' ' + coords[i][0] + ',';
        } else if (i === len - 1) {
            wkt = wkt + coords[i][1] + ' ' + coords[i][0] + ',' + coords[0][1] + ' ' + coords[0][0] + ')';
        } else {
            wkt = wkt + coords[i][1] + ' ' + coords[i][0] + ',';
        }
    }
    return wkt;
};
// 获取细班选择坐标wkt
export const getWktData = (coords) => {
    let wkt = '';
    let len = coords.length;
    for (let i = 0; i < coords.length; i++) {
        if (i === 0) {
            wkt = '(' + wkt + coords[i][1] + ' ' + coords[i][0] + ',';
        } else if (i === len - 1) {
            wkt = wkt + coords[i][1] + ' ' + coords[i][0] + ',' + coords[0][1] + ' ' + coords[0][0] + ')';
        } else {
            wkt = wkt + coords[i][1] + ' ' + coords[i][0] + ',';
        }
    }
    return wkt;
};
// 查找区域面积
export const computeSignedArea = (path, type) => {
    let radius = 6371009;
    let len = path.length;
    if (len < 3) return 0;
    let total = 0;
    let prev = path[len - 1];
    let indexT = 1;
    let indexG = 0;
    if (type === 1) {
        indexT = 0;
        indexG = 1;
    }
    let prevTanLat = Math.tan(((Math.PI / 2 - prev[indexG] / 180 * Math.PI) / 2));
    let prevLng = (prev[indexT]) / 180 * Math.PI;
    for (let i in path) {
        let tanLat = Math.tan((Math.PI / 2 -
            (path[i][indexG]) / 180 * Math.PI) / 2);
        let lng = (path[i][indexT]) / 180 * Math.PI;

        // total += polarTriangleArea(tanLat, lng, prevTanLat, prevLng);
        // 上边的方法无法使用，所以把函数写在这里
        let deltaLng = lng - prevLng;
        let t = tanLat * prevTanLat;
        let test = 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
        total += test;

        prevTanLat = tanLat;
        prevLng = lng;
    }
    return Math.abs(total * (radius * radius));
};
export const polarTriangleArea = (tanLat, lng, prevTanLat, prevLng) => {
    let deltaLng = lng - prevLng;
    let t = tanLat * prevTanLat;
    return 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
};
// 根据标段的No获取标段名称
export const getSectionNameBySection = (section, thinClassTree) => {
    try {
        let sectionArr = section.split('-');
        let sectionName = '';
        if (sectionArr instanceof Array && sectionArr.length === 3) {
            thinClassTree.map((projectData) => {
                if (sectionArr[0] === projectData.No) {
                    let sectionData = projectData.children;
                    sectionData.map((child) => {
                        if (section === child.No) {
                            sectionName = child.Name;
                        }
                    });
                }
            });
        }
        return sectionName;
    } catch (e) {
        console.log('getSectionNameBySection', e);
    }
};
// 根据标段的No获取项目名称
export const getProjectNameBySection = (section, thinClassTree) => {
    try {
        let projectName = '';
        let sectionArr = section.split('-');
        if (sectionArr instanceof Array && sectionArr.length === 3) {
            thinClassTree.map((projectData) => {
                if (sectionArr[0] === projectData.No) {
                    projectName = projectData.Name;
                }
            });
        }
        return projectName;
    } catch (e) {
        console.log('getProjectNameBySection', e);
    }
};

// 根据标段，细班的数据获取小班细班的Name
// 此处的细班数据为 P009-01-01-001-001  项目-区块-标段-小班-细班 类型
export const getSmallThinNameByThinClassData = (thinClass, thinClassTree) => {
    let smallClassName = '';
    let thinClassName = '';
    let smallThinName = '';
    try {
        let thinClassArr = thinClass.split('-');
        let selectProjectNo = thinClassArr[0];
        let selectSectionNo = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[2];
        let selectSmallClassNo = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[2] + '-' + thinClassArr[3];
        thinClassTree.map((projectData) => {
            if (projectData.No === selectProjectNo) {
                let sectionDatas = projectData.children;
                sectionDatas.map((sectionData) => {
                    if (selectSectionNo === sectionData.No) {
                        let smallClassDatas = sectionData.children;
                        smallClassDatas.map((smallClassData) => {
                            if (selectSmallClassNo === smallClassData.No) {
                                smallClassName = smallClassData.Name;
                                let thinClassDatas = smallClassData.children;
                                thinClassDatas.map((thinClassData) => {
                                    if (thinClass === thinClassData.No) {
                                        thinClassName = thinClassData.Name;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        smallThinName = smallClassName + thinClassName;
        return smallThinName;
    } catch (e) {
        console.log('getSmallThinNameByPlaceData', e);
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
            return '总体';
        default:
            return '';
    }
};

// 森林大数据-数字化验收 根据验收状态的ID获取验收状态名称
export const getStatusByID = (ID) => {
    if (!ID) {
        return '';
    }
    switch (ID) {
        case 0:
            return '未申请';
        case 1:
            return '待验收';
        case 2:
            return '完成';
        case 3:
            return '退回';
        case 4:
            return '暂存';
        default:
            return '';
    }
};

// wkt 转换 json数据
export const wktToJson = (wkt) => {
    let coords = [];
    if (wkt.indexOf('MULTIPOLYGON') !== -1) {
        let data = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf('))') + 1);
        let arr = data.split('),(');
        arr.map((a, index) => {
            let str = '';
            if (index === 0) {
                str = a.slice(a.indexOf('(') + 1, a.length - 1);
            } else if (index === arr.length - 1) {
                str = a.slice(0, a.indexOf(')'));
            } else {
                str = a;
            }
            coords.push(str);
        });
    } else if (wkt.indexOf('POLYGON') !== -1) {
        let str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
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
