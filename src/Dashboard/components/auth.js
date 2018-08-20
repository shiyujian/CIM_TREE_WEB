import './OnSite/OnSite.less';
import { PROJECT_UNITS, FOREST_API } from '_platform/api';
// 获取项目的小班
export const getSmallClass = (smallClassList) => {
    // 将小班的code获取到，进行去重
    let uniqueSmallClass = [];
    // 进行数组去重的数组
    let array = [];

    let test = [];
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
            // 之前没有存入过该小班，则push进数组
            if (list.SmallClass && array.indexOf(No) === -1) {
                uniqueSmallClass.push({
                    Name: list.SmallClassName
                        ? list.SmallClassName + '小班'
                        : list.SmallClass + '小班',
                    No: No
                });
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
                    thinClassList.push({
                        Name: rst.ThinClassName
                            ? rst.ThinClassName + '细班'
                            : rst.ThinClass + '细班',
                        No: No
                    });
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
// 点击地图上的图标展示的内容
export const genPopUpContent = (geo) => {
    const { properties = {} } = geo;
    switch (geo.type) {
        case 'track': {
            return `<div class="popupBox">
						<h2><span>姓名：</span>${properties.name}</h2>
						<h2><span>所属单位：</span>${properties.organization}</h2>
						<h2><span>联系方式：</span>${properties.person_telephone}</h2>
						<h2><span>标段：</span>${properties.sectionName}</h2>
					</div>`;
        }
        case 'risk': {
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
        case 'curingTask': {
            return `<div class="popupBox">
                    <h2><span>养护类型：</span>${properties.typeName}</h2>
                    <h2><span>状态：</span>${properties.status}</h2>
                    <h2><span>养护人：</span>${properties.CuringMans}</h2>
                    <h2><span>标段：</span>${properties.sectionName}</h2>
                    <h2><span>小班：</span>${properties.smallClassName}</h2>
                    <h2><span>细班：</span>${properties.thinClassName}</h2>
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
        case 'survivalRate': {
            return `<div class="popupBox">
                    <h2><span>标段：</span>${properties.sectionName}</h2>
                    <h2><span>小班：</span>${properties.smallClassName}</h2>
                    <h2><span>细班：</span>${properties.thinClassName}</h2>
                    <h2><span>树种：</span>${properties.treetype}</h2>
                    <h2><span>成活率：</span>${properties.SurvivalRate}</h2>
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
        case 'track':
            return 'dashboard-peopleIcon';
        case 'risk':
            return 'dashboard-riskIcon';
        case 'tree':
            return 'dashboard-treeIcon';
        case 'curingTask':
            return 'dashboard-curingTaskIcon';
        case 'survivalRate':
            return 'dashboard-treeIcon';
        default:
            break;
    }
};

export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
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
// 树节点信息查看图片时格式转换
export const onImgClick = (data) => {
    let srcs = [];
    try {
        let arr = data.split(',');
        arr.map(rst => {
            let src = rst.replace(/\/\//g, '/');
            src = `${FOREST_API}/${src}`;
            srcs.push(src);
        });
    } catch (e) {
        console.log('处理图片', e);
    }
    return srcs;
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

// 获取任务中的标段，小班，细班名称
export const getThinClassName = (thinClass, section, totalThinClass) => {
    try {
        let thinClassList = thinClass.split(',');
        let SectionName = '';
        let SmallName = '';
        let SmallNo = '';
        let ThinName = '';
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
                                            if (!SmallName) {
                                                SmallName = smallClass.Name;
                                                SmallNo = smallClass.No;
                                            } else {
                                                SmallName = SmallName + ' ,' + smallClass.Name;
                                                SmallNo = SmallNo + ' ,' + smallClass.No;
                                            }
                                            smallNoList.push(smallClassNo);
                                        }
                                        // 找到符合条件的数据的name
                                        let thinName = thinClass.Name;
                                        let sectionName = getSectionName(section);
                                        SectionName = sectionName;
                                        if (index === 0) {
                                            ThinName = ThinName + thinName;
                                        } else {
                                            ThinName = ThinName + ' ,' + thinName;
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
            ThinName: ThinName,
            SmallName: SmallName,
            SmallNo: SmallNo,
            SectionName: SectionName
        };
        return regionData;
    } catch (e) {
        console.log('getTaskThinClassName', e);
    }
};
