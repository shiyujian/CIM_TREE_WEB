import './Curing.less';
import { PROJECT_UNITS } from '_platform/api';
import { getUser } from '_platform/auth';
// import { getSectionName } from './auth';

export const getAreaTreeData = async (getTreeNodeList, getThinClassList) => {
    let rst = await getTreeNodeList();
    if (rst instanceof Array && rst.length > 0) {
        rst.forEach((item, index) => {
            rst[index].children = [];
        });
    }
    let user = getUser();
    let sections = user.sections;
    let section = '';
    sections = JSON.parse(sections);
    if (sections && sections instanceof Array && sections.length > 0) {
        section = sections[0];
    }
    // 项目级
    let projectList = [];
    // 子项目级
    let unitProjectList = [];
    if (rst instanceof Array && rst.length > 0) {
        rst.map(node => {
            if (user.username === 'admin') {
                if (node.Type === '项目工程') {
                    projectList.push({
                        Name: node.Name,
                        No: node.No
                    });
                } else if (node.Type === '子项目工程') {
                    unitProjectList.push({
                        Name: node.Name,
                        No: node.No,
                        Parent: node.Parent
                    });
                }
            } else if (section) {
                let sectionArr = section.split('-');
                let projectKey = sectionArr[0];
                let unitProjectKey = sectionArr[0] + '-' + sectionArr[1];
                if (node.Type === '项目工程' && node.No.indexOf(projectKey) !== -1) {
                    projectList.push({
                        Name: node.Name,
                        No: node.No
                    });
                } else if (node.Type === '子项目工程' && node.No.indexOf(unitProjectKey) !== -1) {
                    unitProjectList.push({
                        Name: node.Name,
                        No: node.No,
                        Parent: node.Parent
                    });
                }
            }
        });
        for (let i = 0; i < projectList.length; i++) {
            projectList[i].children = unitProjectList.filter(node => {
                return node.Parent === projectList[i].No;
            });
        }
    }
    let totalThinClass = [];
    for (let i = 0; i < unitProjectList.length; i++) {
        let unitProject = unitProjectList[i];
        let list = await getThinClassList({ no: unitProject.No });
        let smallClassList = getSmallClass(list);
        smallClassList.map(smallClass => {
            let thinClassList = getThinClass(smallClass, list);
            smallClass.children = thinClassList;
        });
        totalThinClass.push({
            unitProject: unitProject.No,
            smallClassList: smallClassList
        });
        unitProject.children = smallClassList;
    }
    console.log('projectList', projectList);
    console.log('totalThinClass', totalThinClass);

    return {
        totalThinClass: totalThinClass,
        projectList: projectList
    };
};
// 获取项目的小班
export const getSmallClass = (smallClassList) => {
    let user = getUser();
    let sections = user.sections;
    let section = '';
    sections = JSON.parse(sections);
    if (sections && sections instanceof Array && sections.length > 0) {
        section = sections[0];
    }
    // 将小班的code获取到，进行去重
    let uniqueSmallClass = [];
    // 进行数组去重的数组
    let array = [];
    try {
        smallClassList.map(list => {
            let noArr = list.No.split('-');
            // 如果小于5 说明没有标段  不符合规则
            if (noArr.length < 5) {
                console.log('rst', list);
                return;
            }
            // 项目 + 区块 + 标段 + 小班
            let No = noArr[0] + '-' + noArr[1] + '-' + noArr[4] + '-' + noArr[2];
            // 项目 + 区块 + 标段
            let sectionNo = noArr[0] + '-' + noArr[1] + '-' + noArr[4];

            // 管理员可以查看所有数据，其他人员只能查看符合自己标段的数据
            let userMess = window.localStorage.getItem('QH_USER_DATA');
            userMess = JSON.parse(userMess);
            let permission = false;
            if (userMess.username === 'admin') {
                permission = true;
            }
            let groups = userMess.groups || [];
            groups.map((group) => {
                if (group.name.indexOf('业主') !== -1) {
                    permission = true;
                }
            });
            // permission为true说明是管理员或者业主
            if (permission) {
                // console.log('wwwww', sectionNo);
            } else if (section) {
                if (sectionNo !== section) {
                    return;
                }
            }
            // 之前没有存入过该小班，则push进数组
            if (list.SmallClass && array.indexOf(No) === -1) {
                if (list.SmallClassName) {
                    if (list.SmallClassName.indexOf('小班') !== -1) {
                        uniqueSmallClass.push({
                            Name: list.SmallClassName,
                            No: No
                        });
                    } else {
                        uniqueSmallClass.push({
                            Name: list.SmallClassName + '小班',
                            No: No
                        });
                    }
                } else {
                    uniqueSmallClass.push({
                        Name: list.SmallClass + '小班',
                        No: No
                    });
                }
                array.push(No);
            }
        });
    } catch (e) {
        console.log('getSmallClass', e);
    }

    return uniqueSmallClass;
};
// 获取项目的细班
export const getThinClass = (smallClass, list) => {
    let thinClassList = [];
    let codeArray = [];
    let nameArray = [];
    try {
        list.map(rst => {
            let smallClassCode = smallClass.No.split('-');
            let projectNo = smallClassCode[0];
            let unitProjectNo = smallClassCode[1];
            let sectionNo = smallClassCode[2];
            let smallClassNo = smallClassCode[3];

            let noArr = rst.No.split('-');
            // 如果小于5 说明没有标段  不符合规则
            if (noArr.length < 5) {
                console.log('rst', rst);
                return;
            }
            // 暂时去掉重复的节点
            if (
                noArr[0] === projectNo && noArr[1] === unitProjectNo && noArr[4] === sectionNo &&
                noArr[2] === smallClassNo
            ) {
                // 项目 + 区块 + 标段 + 小班 + 细班
                let No = noArr[0] + '-' + noArr[1] + '-' + noArr[4] + '-' + noArr[2] + '-' + noArr[3];
                if (codeArray.indexOf(No) === -1) {
                    if (rst.ThinClassName) {
                        if (rst.ThinClassName.indexOf('细班') !== -1) {
                            thinClassList.push({
                                Name: rst.ThinClassName,
                                No: No
                            });
                        } else {
                            thinClassList.push({
                                Name: rst.ThinClassName + '细班',
                                No: No
                            });
                        }
                    } else {
                        thinClassList.push({
                            Name: rst.ThinClass + '细班',
                            No: No
                        });
                    }
                    codeArray.push(No);
                    nameArray.push(rst.ThinClassName);
                }
            }
        });
    } catch (e) {
        console.log('getThinClass', e);
    }

    return thinClassList;
};
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
// 点击地图上的图标展示的内容
export const genPopUpContent = (geo) => {
    const { properties = {} } = geo;
    switch (geo.type) {
        case 'danger': {
            return `<div>
                    <h2><span>隐患内容：</span>${properties.name}</h2>
                    <h2><span>隐患类型：</span>${properties.riskType}</h2>
                    <h2><span>隐患描述：</span>${properties.Problem}</h2>
                    <h2><span>整改状态：</span>${properties.status}</h2>
                    <h2 class="btnRow">
                        <a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
                    </h2>
                </div>`;
        }
        case 'task': {
            return `<div class="popupBox">
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
            // <h2 class="btnRow">
            //     <a href="javascript:;" class="btnViewTask" data-id=${properties.ID}>查看详情</a>
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
        case 'people':
            return 'peopleIcon';
        case 'safety':
            return 'cameraIcon';
        case 'danger':
            return 'dangerIcon';
        case 'tree':
            return 'treeIcon';
        case 'task':
            return 'taskIcon';
        default:
            break;
    }
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
            wkt = '(' + wkt + coords[i][0] + ' ' + coords[i][1] + ',';
        } else if (i === len - 1) {
            wkt = wkt + coords[i][0] + ' ' + coords[i][1] + ',' + coords[0][0] + ' ' + coords[0][1] + ')';
        } else {
            wkt = wkt + coords[i][0] + ' ' + coords[i][1] + ',';
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

        // total += this.polarTriangleArea(tanLat, lng, prevTanLat, prevLng);
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
                totalThinClass.map((unitProjectData) => {
                    let unitProject = unitProjectData.unitProject;
                    // 首先根据区块找到对应的细班list
                    if (section.indexOf(unitProject) !== -1) {
                        let smallClassList = unitProjectData.smallClassList;
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
// 查找区域内的细班的名称
export const getThinClassName = (regionThinClass, totalThinClass, sections) => {
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
    let signSection = sections[0];

    // 细班数组，查看细班是否重复，重复不再查询
    let thinNoList = [];
    let smallNoList = [];
    try {
        regionThinClass.map((thinData, index) => {
            let section = thinData.Section;
            // 如果圈选的区域不在登录用户的标段内，则不能下发任务
            if (signSection !== section) {
                sectionBool = false;
                return;
            }
            // 如果圈选的区域不在登录用户的标段内，不需要循环获取数据
            if (!sectionBool) {
                return;
            }
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
            console.log('thinNo', thinNo);
            totalThinClass.map((unitProjectData) => {
                let unitProject = unitProjectData.unitProject;
                // 首先根据区块找到对应的细班list
                if (section.indexOf(unitProject) !== -1) {
                    let smallClassList = unitProjectData.smallClassList;
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
                                    let sectionName = getSectionName(section);
                                    regionSectionNo = section;
                                    regionSectionName = sectionName;
                                    if (index === 0) {
                                        regionThinName = regionThinName + thinClassName;
                                        regionThinNo = regionThinNo + thinNo;
                                    } else {
                                        regionThinName = regionThinName + ' ,' + thinClassName;
                                        regionThinNo = regionThinNo + ' ,' + thinNo;
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
        regionSmallNo: regionSmallNo
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

export const getCuringTaskTreeData = async (getCuringTypes, getCuring) => {
    let user = getUser();
    let sections = user.sections;
    sections = JSON.parse(sections);
    let curingTypes = [];
    let taskTreeData = [];
    if (sections && sections instanceof Array && sections.length > 0) {
        let section = sections[0];
        let postData = {
            section: section
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
    let sections = user.sections;
    sections = JSON.parse(sections);
    let curingTypes = [];
    let taskTreeData = [];
    if (sections && sections instanceof Array && sections.length > 0) {
        let section = sections[0];
        let postData = {
            section: section,
            status: 1
        };
        let curingTypesData = await getCuringTypes();
        curingTypes = curingTypesData && curingTypesData.content;
        if (curingTypes && curingTypes.length > 0) {
            console.log('postData', postData);
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
export const handleAreaLayerData = async (eventKey, treeNodeName, getTreearea) => {
    let handleKey = eventKey.split('-');
    let no = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
    let section = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
    let treearea = [];
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
