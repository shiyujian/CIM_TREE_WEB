import './Curing.less';
import { PROJECT_UNITS } from '_platform/api';

// 获取项目的小班
export const getSmallClass = (smallClassList) => {
    // 将小班的code获取到，进行去重
    let uniqueSmallClass = [];
    // 进行数组去重的数组
    let array = [];

    let test = [];
    try {
        smallClassList.map(list => {
            // if (!list.SmallClassName) {
            //     console.log('list', list);
            // }
            // 加入项目，地块的code，使No不重复，如果重复，点击某个节点，No重复的节点也会选择中
            let codeName =
                    list.LandNo +
                    '#' +
                    list.RegionNo +
                    '#' +
                    list.SmallClass +
                    '#' +
                    list.SmallClassName;
            if (list.SmallClass && array.indexOf(codeName) === -1) {
                uniqueSmallClass.push({
                    Name: list.SmallClassName
                        ? list.SmallClassName + '小班'
                        : list.SmallClass + '小班',
                    No: codeName
                });
                array.push(codeName);
            } else {
                test.push({
                    SmallClassName: list.SmallClassName,
                    SmallClass: list.SmallClass
                });
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
            let codeName = smallClass.No.split('#');
            let code = codeName[2];
            let name = codeName[3];
            if (name === 'null') {
                name = null;
            }
            // 暂时去掉重复的节点
            if (
                rst.ThinClass &&
                    rst.SmallClass === code &&
                    rst.SmallClassName === name
            ) {
                let noArr = rst.No.split('-');
                // 为了让各个细班的code都不一样   把各个细班的code全部加入
                // let No = noArr[0] + '-' + noArr[1] + '-' + noArr[2] + '-' + noArr[3];
                // 如果小于5 说明没有标段  不符合规则
                if (noArr.length < 5) {
                    console.log('rst', rst);
                    return;
                }
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
                    <h2><span>创建时间：</span>${properties.CreateTime}</h2>
                    <h2><span>计划开始时间：</span>${properties.PlanStartTime}</h2>
                    <h2><span>计划结束时间：</span>${properties.PlanEndTime}</h2>
                    <h2><span>实际开始时间：</span>${properties.StartTime}</h2>
                    <h2><span>实际结束时间：</span>${properties.EndTime}</h2>
                    <h2 class="btnRow">
                        <a href="javascript:;" class="btnViewTask" data-id=${properties.ID}>查看详情</a>
                    </h2>
                </div>`;
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
