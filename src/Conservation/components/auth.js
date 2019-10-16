import './Conservation.less';
import { getUser } from '_platform/auth';
import {handlePOLYGONWktData} from '_platform/gisAuth';

// 获取标段名称
export const getSectionName = (section, sectionData) => {
    let sectionName = '';
    try {
        let arr = section.split('-');
        if (arr && arr.length === 3) {
            sectionData.map(project => {
                if (project.No === arr[0]) {
                    let units = project.children;
                    sectionName = project.Name;
                    units.map(unit => {
                        if (unit.No === section) {
                            sectionName =
                            sectionName + unit.Name;
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
// 点击地图上的图标展示的内容
export const genPopUpContent = (geo) => {
    const { properties = {} } = geo;
    switch (geo.type) {
        case 'task': {
            return `<div class="Conservation-popupBox">
                    <h2><span>养护类型：</span>${properties.typeName}</h2>
                    <h2><span>状态：</span>${properties.status}</h2>
                    <h2><span>养护人：</span>${properties.CuringMans}</h2>
                    <h2><span>标段：</span>${properties.sectionName}</h2>
                    <h2><span>小班：</span>${properties.smallClassName}</h2>
                    <h2><span>细班：</span>${properties.thinClassName}</h2>
                    <h2><span>养护面积：</span>${properties.Area}</h2>
                    <h2><span>创建时间：</span>${properties.CreateTime}</h2>
                    <h2><span>计划开始时间：</span>${properties.PlanStartTime}</h2>
                    <h2><span>计划结束时间：</span>${properties.PlanEndTime}</h2>
                    <h2><span>实际开始时间：</span>${properties.StartTime}</h2>
                    <h2><span>实际结束时间：</span>${properties.EndTime}</h2>
                </div>`;
            // <h2 class="Conservation-btnRow">
            //     <a href="javascript:;" class="Conservation-btnViewTask" data-id=${properties.ID}>查看详情</a>
            // </h2>
        }
        case 'realTask': {
            return `<div class="Conservation-popupBox">
                    <h2><span>养护类型：</span>${properties.typeName}</h2>
                    <h2><span>状态：</span>${properties.status}</h2>
                    <h2><span>养护人：</span>${properties.CuringMans}</h2>
                    <h2><span>标段：</span>${properties.sectionName}</h2>
                    <h2><span>小班：</span>${properties.smallClassName}</h2>
                    <h2><span>细班：</span>${properties.thinClassName}</h2>
                    <h2><span>养护面积：</span>${properties.Area}</h2>
                    <h2><span>创建时间：</span>${properties.CreateTime}</h2>
                    <h2><span>计划开始时间：</span>${properties.PlanStartTime}</h2>
                    <h2><span>计划结束时间：</span>${properties.PlanEndTime}</h2>
                    <h2><span>实际开始时间：</span>${properties.StartTime}</h2>
                    <h2><span>实际结束时间：</span>${properties.EndTime}</h2>
                </div>`;
            // <h2 class="Conservation-btnRow">
            //     <a href="javascript:;" class="Conservation-btnViewTask" data-id=${properties.ID}>查看详情</a>
            // </h2>
        }
        default: {
            return null;
        }
    }
};
// 获取对应的ICON
export const getIconType = (type) => {
    switch (type) {
        case 'task':
            return 'Conservation-taskIcon';
        case 'realTask':
            return 'Conservation-taskIcon';
        default:
            break;
    }
};

export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
};
// 获取任务中的标段，小班，细班名称
export const getTaskThinClassName = (task, totalThinClass, bigTreeList) => {
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
                                        let sectionName = getSectionName(section, bigTreeList);
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
// 查找区域内的细班的名称
export const getThinClassName = (regionThinClass, totalThinClass, signSection, bigTreeList) => {
    // 经过筛选后的细班No
    let regionThinNo = '';
    // 经过筛选后的细班Name
    let regionThinName = '';
    // 经过筛选后的小班
    let regionSmallNo = '';
    let regionSmallName = '';
    // 经过筛选后的标段No
    let regionSectionNo = '';
    // 经过筛选后的标段Name
    let regionSectionName = '';
    // 标段是否是登陆用户所在标段
    let sectionBool = true;
    // 小班细班名称
    let regionSmallThinClassName = '';

    // 细班数组，查看细班是否重复，重复不再查询
    let thinNoList = [];
    let smallNoList = [];
    try {
        regionThinClass.map((thinData, index) => {
            let section = thinData.Section;
            // 如果圈选的区域不在登录用户的标段内，则不能下发任务
            // if (signSection !== section) {
            //     sectionBool = false;
            //     return;
            // }
            // // 如果圈选的区域不在登录用户的标段内，不需要循环获取数据
            // if (!sectionBool) {
            //     return;
            // }
            let thinNo = thinData.no;
            let pushState = true;
            // 获取的thinNo可能又会重复的，需要进行处理
            thinNoList.map((data) => {
                if (data === thinNo) {
                    pushState = false;
                }
            });
            if (!pushState) {
                return;
            }
            thinNoList.push(thinNo);
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
                                        if (!regionSmallNo) {
                                            regionSmallNo = smallClassNo;
                                            regionSmallName = smallClass.Name;
                                        } else {
                                            regionSmallNo = regionSmallNo + ' ,' + smallClassNo;
                                            regionSmallName = regionSmallName + ' ,' + smallClass.Name;
                                        }
                                        smallNoList.push(smallClassNo);
                                    }
                                    let thinClassName = thinClass.Name;
                                    let sectionName = getSectionName(section, bigTreeList);
                                    regionSectionNo = section;
                                    regionSectionName = sectionName;
                                    if (index === 0) {
                                        regionThinName = regionThinName + thinClassName;
                                        regionThinNo = regionThinNo + thinNo;
                                        regionSmallThinClassName = regionSmallThinClassName + smallClass.Name + thinClassName;
                                    } else {
                                        regionThinName = regionThinName + ' ,' + thinClassName;
                                        regionThinNo = regionThinNo + ' ,' + thinNo;
                                        regionSmallThinClassName = regionSmallThinClassName + ' ,' + smallClass.Name + thinClassName;
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
    } catch (e) {
        console.log('细班名称', e);
    }
    let regionData = {
        regionThinName: regionThinName,
        regionThinNo: regionThinNo,
        regionSectionNo: regionSectionNo,
        regionSectionName: regionSectionName,
        sectionBool: sectionBool,
        regionSmallName: regionSmallName,
        regionSmallNo: regionSmallNo,
        regionSmallThinClassName: regionSmallThinClassName
    };
    return regionData;
};
// 计算养护任务的状态
export const getTaskStatus = (task) => {
    let status = '未完成';
    if (task.Status === 2) {
        status = '已上报';
    } else if (task.StartTime && task.EndTime) {
        status = '已完成且未上报';
    }
    return status;
};

export const getCuringTaskCreateTreeData = async (getCuringTypes, getCuring) => {
    let user = getUser();
    let section = user.section;
    let curingTypes = [];
    let taskTreeData = [];
    if (section) {
        let postData = {
            section: section,
            status: 2
        };
        let curingTypesData = await getCuringTypes();
        curingTypes = curingTypesData && curingTypesData.content;
        if (curingTypes && curingTypes.length > 0) {
            let curingTaskData = await getCuring({}, postData);
            let curingTasks = curingTaskData.content;
            if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                for (let i = 0; i < curingTasks.length; i++) {
                    let task = curingTasks[i];
                    if (task && task.ID) {
                        curingTypes.map((type) => {
                            if (type.ID === task.CuringType) {
                                let exist = false;
                                let childData = [];
                                // 查看TreeData里有无这个类型的数据，有的话，push
                                taskTreeData.map((treeNode) => {
                                    if (treeNode.ID === type.ID) {
                                        exist = true;
                                        childData = treeNode.children;
                                        childData.push((task));
                                    }
                                });
                                // 没有的话，创建
                                if (!exist) {
                                    childData.push(task);
                                    taskTreeData.push({
                                        ID: type.ID,
                                        Name: type.Base_Name,
                                        children: childData
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    return {
        curingTypes: curingTypes,
        taskTreeData: taskTreeData
    };
};
export const getCuringTaskReportTreeData = async (getCuringTypes, getCuring) => {
    let user = getUser();
    let section = user.section;
    let curingTypes = [];
    let taskTreeData = [];
    if (section) {
        let postData = {
            section: section,
            status: 1
        };
        let curingTypesData = await getCuringTypes();
        curingTypes = curingTypesData && curingTypesData.content;
        if (curingTypes && curingTypes.length > 0) {
            let curingTaskData = await getCuring({}, postData);
            let curingTasks = curingTaskData.content;
            if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                for (let i = 0; i < curingTasks.length; i++) {
                    let task = curingTasks[i];
                    if (task && task.ID) {
                        curingTypes.map((type) => {
                            if (type.ID === task.CuringType) {
                                let exist = false;
                                let childData = [];
                                // 查看TreeData里有无这个类型的数据，有的话，push
                                taskTreeData.map((treeNode) => {
                                    if (treeNode.ID === type.ID) {
                                        if (task.Status !== 2 && task.StartTime && task.EndTime) {
                                            exist = true;
                                            childData = treeNode.children;
                                            childData.push((task));
                                        }
                                    }
                                });
                                // 没有的话，创建
                                if (!exist) {
                                    if (task.Status !== 2 && task.StartTime && task.EndTime) {
                                        childData.push(task);
                                        taskTreeData.push({
                                            ID: type.ID,
                                            Name: type.Base_Name,
                                            children: childData
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    return {
        curingTypes: curingTypes,
        taskTreeData: taskTreeData
    };
};
// 点击区域地块处理细班坐标数据
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
            str = handlePOLYGONWktData(wkt);
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
        if (data && data instanceof Array && data[1] && data[0]) {
            arr.push([data[1], data[0]]);
        }
    });
    treearea.push(arr);
    return treearea;
};
