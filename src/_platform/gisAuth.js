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
// 点击区域地块处理细班坐标数据
export const handleAreaLayerData = async (eventKey, treeNodeName, getTreearea) => {
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
