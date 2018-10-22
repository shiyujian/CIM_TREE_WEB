import { PROJECT_UNITS } from '_platform/api';
import { getUser } from '_platform/auth';

// 获取标段名称
export const getSectionName = (section) => {
    let sectionName = '';
    try {
        let arr = section.split('-');
        if (arr && arr.length === 3) {
            PROJECT_UNITS.map(project => {
                if (project.code === arr[0]) {
                    let units = project.units;
                    sectionName = project.value;
                    units.map(unit => {
                        if (unit.code === section) {
                            sectionName =
                            sectionName + unit.value;
                        }
                    });
                }
            });
        }
    } catch (e) {
        console.log('e', e);
    }
    return sectionName;
};
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
// 获取任务中的标段，小班，细班名称
export const getTaskThinClassName = (task, totalThinClass) => {
    try {
        let thinClass = task.ThinClass;
        let section = task.Section;
        let thinClassList = thinClass.split(',');
        let regionSectionName = '';
        let regionSmallName = '';
        let regionSmallNo = '';
        let regionThinName = '';
        let smallNoList = [];
        if (thinClassList && thinClassList instanceof Array && thinClassList.length > 0) {
            thinClassList.map((thinNo, index) => {
                totalThinClass.map((sectionData) => {
                    let sectionNo = sectionData.section;
                    // 首先根据区块找到对应的细班list
                    if (section === sectionNo) {
                        let smallClassList = sectionData.smallClassList;
                        smallClassList.map((smallClass) => {
                        // tree结构的数据经过了处理，需要和api获取的数据调整一致
                            let smallClassHandleKey = smallClass.No.split('-');
                            let smallClassNo = smallClassHandleKey[0] + '-' + smallClassHandleKey[1] + '-' + smallClassHandleKey[3];
                            let childSection = smallClassHandleKey[0] + '-' + smallClassHandleKey[1] + '-' + smallClassHandleKey[2];
                            if (thinNo.indexOf(smallClassNo) !== -1 && childSection === section) {
                                // 找到符合条件的数据的name
                                let thinClassList = smallClass.children;
                                thinClassList.map((thinClass) => {
                                    let thinClassHandleKey = thinClass.No.split('-');
                                    let thinClassNo = thinClassHandleKey[0] + '-' + thinClassHandleKey[1] + '-' + thinClassHandleKey[3] + '-' + thinClassHandleKey[4];
                                    if (thinNo.indexOf(thinClassNo) !== -1) {
                                        // 是否小班重复
                                        let isUniqueSmall = true;
                                        smallNoList.map((smallData) => {
                                            if (smallData === smallClassNo) {
                                                isUniqueSmall = false;
                                            }
                                        });
                                        if (isUniqueSmall) {
                                            if (!regionSmallName) {
                                                regionSmallName = smallClass.Name;
                                                regionSmallNo = smallClass.No;
                                            } else {
                                                regionSmallName = regionSmallName + ' ,' + smallClass.Name;
                                                regionSmallNo = regionSmallNo + ' ,' + smallClass.No;
                                            }
                                            smallNoList.push(smallClassNo);
                                        }
                                        // 找到符合条件的数据的name
                                        let thinName = thinClass.Name;
                                        let sectionName = getSectionName(section);
                                        regionSectionName = sectionName;
                                        if (index === 0) {
                                            regionThinName = regionThinName + thinName;
                                        } else {
                                            regionThinName = regionThinName + ' ,' + thinName;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }

        let regionData = {
            regionThinName: regionThinName,
            regionSmallName: regionSmallName,
            regionSmallNo: regionSmallNo,
            regionSectionName: regionSectionName
        };
        return regionData;
    } catch (e) {
        console.log('getTaskThinClassName', e);
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
