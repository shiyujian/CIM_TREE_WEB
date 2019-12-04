import './OnSite/OnSite.less';
import { LBSAMAP_KEY } from '_platform/api';
import {getForestImgUrl} from '_platform/auth';
import {
    handlePOLYGONWktData,
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import moment from 'moment';

// 获取施工包数据，并将数据进行整理
export const getAreaData = async (getTreeNodeList, getThinClassList) => {
    let rst = await getTreeNodeList();
    if (!(rst && rst instanceof Array && rst.length > 0)) {
        return;
    }
    // 项目级
    let projectList = [];
    // 单位工程级
    let sectionList = [];
    let survivalRateTree = [];
    if (rst instanceof Array && rst.length > 0) {
        rst.map(node => {
            if (node.Type === '项目工程') {
                projectList.push({
                    Name: node.Name,
                    No: node.No
                });
                survivalRateTree.push({
                    Name: node.Name,
                    No: node.No
                });
            } else if (node.Type === '单位工程') {
                let noArr = node.No.split('-');
                if (noArr && noArr instanceof Array && noArr.length === 3) {
                    sectionList.push({
                        Name: node.Name,
                        No: node.No,
                        Parent: noArr[0]
                    });
                }
            }
        });
        survivalRateTree.map((survivalRate) => {
            let sectionTree = [];
            rst.map(node => {
                if (node.Type === '单位工程' && node.No.indexOf(survivalRate.No) !== -1) {
                    sectionTree.push({
                        Name: node.Name,
                        No: node.No
                    });
                }
            });
            survivalRate.children = sectionTree;
        });
        for (let i = 0; i < projectList.length; i++) {
            projectList[i].children = sectionList.filter(node => {
                return node.Parent === projectList[i].No;
            });
        }
    }
    let totalThinClass = [];
    for (let i = 0; i < sectionList.length; i++) {
        let section = sectionList[i];
        let sectionNo = section.No;
        let sectionNoArr = sectionNo.split('-');
        let parentNo = sectionNoArr[0] + '-' + sectionNoArr[1];
        let list = await getThinClassList({ no: parentNo }, {section: sectionNoArr[2]});
        let smallClassList = getSmallClass(list);
        smallClassList.map(smallClass => {
            let thinClassList = getThinClass(smallClass, list);
            smallClass.children = thinClassList;
        });
        totalThinClass.push({
            section: section.No,
            smallClassList: smallClassList
        });
        section.children = smallClassList;
    }
    return {
        totalThinClass: totalThinClass,
        survivalRateTree: survivalRateTree,
        projectList: projectList
    };
};
// 获取项目的小班
export const getSmallClass = (smallClassList) => {
    // 将小班的code获取到，进行去重
    let uniqueSmallClass = [];
    // 进行数组去重的数组
    let array = [];
    try {
        smallClassList.map(list => {
            let noArr = list.No.split('-');
            // 如果小于5 说明没有标段  不符合规则
            if (noArr.length < 5) {
                return;
            }
            // // 项目 + 区块 + 标段 + 小班 + 细班
            // let No = noArr[0] + '-' + noArr[1] + '-' + noArr[4] + '-' + noArr[2] + '-' + noArr[3];
            // 项目 + 区块 + 标段 + 小班
            let No = noArr[0] + '-' + noArr[1] + '-' + noArr[4] + '-' + noArr[2];
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
                // uniqueSmallClass.push({
                //     Name: list.SmallClassName
                //         ? list.SmallClassName + '小班'
                //         : list.SmallClass + '小班',
                //     No: No
                // });
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
                    // thinClassList.push({
                    //     Name: rst.ThinClassName
                    //         ? rst.ThinClassName + '细班'
                    //         : rst.ThinClass + '细班',
                    //     No: No
                    // });
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
// 点击地图上的图标展示的内容
export const genPopUpContent = (geo) => {
    const { properties = {} } = geo;
    switch (geo.type) {
        case 'track': {
            return `<div class="popupBox">
						<h2><span>姓名：</span>${properties.name}</h2>
						<h2><span>联系方式：</span>${properties.phone}</h2>
						<h2><span>标段：</span>${properties.sectionName}</h2>
					</div>`;
        }
        case 'riskQuality': {
            return `<div>
						<h2><span>隐患内容：</span>${properties.name}</h2>
                        <h2><span>隐患类型：</span>${properties.riskType}</h2>
                        <h2><span>隐患描述：</span>${properties.Problem}</h2>
						<h2><span>整改状态：</span>${properties.status}</h2>
                        <div class="btnRow">
                            <a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
                        </div>
					</div>`;
        }
        case 'riskDanger': {
            return `<div>
						<h2><span>隐患内容：</span>${properties.name}</h2>
                        <h2><span>隐患类型：</span>${properties.riskType}</h2>
                        <h2><span>隐患描述：</span>${properties.Problem}</h2>
						<h2><span>整改状态：</span>${properties.status}</h2>
                        <div class="btnRow">
                            <a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
                        </div>
					</div>`;
        }
        case 'riskOther': {
            return `<div>
						<h2><span>隐患内容：</span>${properties.name}</h2>
                        <h2><span>隐患类型：</span>${properties.riskType}</h2>
                        <h2><span>隐患描述：</span>${properties.Problem}</h2>
						<h2><span>整改状态：</span>${properties.status}</h2>
                        <div class="btnRow">
                            <a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
                        </div>
					</div>`;
        }
        case 'planCuringTask': {
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
                </div>`;
            // <h2 class="btnRow">
            //     <a href="javascript:;" class="btnViewTask" data-id=${properties.ID}>查看详情</a>
            // </h2>
        }
        case 'realCuringTask': {
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
        case 'adoptTree': {
            return `<div>
                        <h2><span>顺序码：</span>${properties.SXM}</h2>
						<h2><span>领养人：</span>${properties.Aadopter}</h2>
                        <h2><span>领养时间：</span>${properties.AdoptTime}</h2>
                        <h2 class="btnRow">
                            <a href="javascript:;" class="btnViewAdopt" data-id=${geo.key}>查看详情</a>
                        </h2>
					</div>`;
        }
        case 'treePipe': {
            return `<div>
                        <h2><span>类型：</span>${geo.typeName}</h2>
                        <h2><span>创建时间：</span>${geo.CreateTime}</h2>
                        <h2><span>标段：</span>${geo.Section}</h2>
                        <h2><span>细班：</span>${geo.ThinClass}</h2>
						<h2><span>材质：</span>${geo.Material}</h2>
                        <h2><span>管径：</span>${geo.DN}</h2>
                        <h2><span>埋深：</span>${geo.Depth}</h2>
                        <h2><span>高程：</span>${geo.Altitude}</h2>
					</div>`;
        }
        case 'treePipeNode': {
            return `<div>
                        <h2><span>类型：</span>${geo.typeName}</h2>
                        <h2><span>创建时间：</span>${geo.CreateTime}</h2>
                        <h2><span>标段：</span>${geo.Section}</h2>
                        <h2><span>细班：</span>${geo.ThinClass}</h2>
                        <h2><span>设备类型：</span>${geo.PipeType}</h2>
                        <h2><span>埋深：</span>${geo.Depth}</h2>
                        <h2><span>高程：</span>${geo.Altitude}</h2>
                        <h2><span>型号：</span>${geo.Model}</h2>
                        
					</div>`;
        }
        case 'device': {
            return `<div>
                    <h2><span>项目：</span>${properties.projectName}</h2>
                    <h2><span>标段：</span>${properties.sectionName}</h2>
                    <h2><span>机械名称：</span>${properties.name}</h2>
                    <h2><span>机械编号：</span>${properties.indexNum}</h2>
                    <h2><span>进场时间：</span>${properties.enterTime}</h2>
                    <h2><span>司机姓名：</span>${properties.contacter}</h2>
                    <h2><span>联系方式：</span>${properties.phone}</h2>
                    <h2><span>设备照片：</span>
                        <a href="javascript:;" class="btnViewDevicePic" data-id=${geo.key}>
                        ${properties.images ? '查看' : ''}
                        </a>
                    </h2>
                    <h2><span>设备轨迹：</span>
                        <a href="javascript:;" class="btnViewDeviceTrack" data-id=${properties.carNo}>
                        ${!properties.trackStatus ? '查看' : ''}
                    </a>
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
        case 'track':
            return 'dashboard-peopleIcon';
        case 'riskQuality':
            return 'dashboard-riskQualityIcon';
        case 'riskDanger':
            return 'dashboard-riskDangerIcon';
        case 'riskOther':
            return 'dashboard-riskOtherIcon';
        case 'tree':
            return 'dashboard-treeIcon';
        case 'realCuringTask':
            return 'dashboard-curingTaskIcon';
        case 'planCuringTask':
            return 'dashboard-curingTaskIcon';
        case 'survivalRate':
            return 'dashboard-treeIcon';
        case 'adopt':
            return 'dashboard-adoptIcon';
        case 'treeType':
            return 'dashboard-treeIcon';
        case '施肥':
            return 'dashboard-curingTaskFeedImg';
        case '排涝':
            return 'dashboard-curingTaskDrainImg';
        case '补植':
            return 'dashboard-curingTaskReplantingImg';
        case '病虫害防治':
            return 'dashboard-curingTaskWormImg';
        case '修剪':
            return 'dashboard-curingTaskTrimImg';
        case '除草':
            return 'dashboard-curingTaskWeedImg';
        case '浇水':
            return 'dashboard-curingTaskWatering';
        case '其他':
            return 'dashboard-curingTaskOther';
        case 'deviceExcavatorImg':
            return 'dashboard-deviceExcavatorImg';
        case 'deviceLoaderImg':
            return 'dashboard-deviceLoaderImg';
        case 'deviceRollerImg':
            return 'dashboard-deviceRollerImg';
        case 'deviceRammerImg':
            return 'dashboard-deviceRammerImg';
        case 'deviceDumpTruckImg':
            return 'dashboard-deviceDumpTruckImg';
        case 'deviceCraneImg':
            return 'dashboard-deviceCraneImg';
        case 'deviceFogGunTruckImg':
            return 'dashboard-deviceFogGunTruckImg';
        case 'deviceDitchingMachineImg':
            return 'dashboard-deviceDitchingMachineImg';
        case 'deviceSprinklerImg':
            return 'dashboard-deviceSprinklerImg';
        case 'deviceDiggerImg':
            return 'dashboard-deviceDiggerImg';
        default:
            break;
    }
};
// 图层颜色填充
export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
};
// 获取标段名称
export const getSectionName = (section, bigTreeList = []) => {
    let sectionName = '';
    try {
        let arr = section.split('-');
        if (arr && arr.length === 3) {
            bigTreeList.map(project => {
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
        console.log('getSectionNamee', e);
    }
    return sectionName;
};
// 树节点信息查看图片时格式转换
export const onImgClick = (data) => {
    let srcs = [];
    try {
        let arr = data.split(',');
        arr.map(rst => {
            let src = getForestImgUrl(rst);
            srcs.push(src);
        });
    } catch (e) {
        console.log('处理图片', e);
    }
    return srcs;
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
        // 获取设计数据
        let rst = await getTreearea({}, { no: no });
        if (!(rst && rst.content && rst.content instanceof Array && rst.content.length > 0)) {
            return;
        }
        let coords = [];
        let str = '';
        let contents = rst.content;
        let data = contents.find(content => content.Section === section);
        let wkt = data.coords;
        // 将坐标字符串转化为数组
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
        console.log('handleAreaLayerData', e);
    }
};
// 字符串转数组
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
// 获取任务中的标段，小班，细班名称
export const getTaskThinClassName = (task, totalThinClass, bigTreeList = []) => {
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
// 获取成活率的标段，小班，细班名称
export const getThinClassName = (thinClass, section, totalThinClass, bigTreeList = []) => {
    try {
        let thinClassList = thinClass.split(',');
        let SectionName = '';
        let SmallName = '';
        let SmallNo = '';
        let ThinName = '';
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
                                        let sectionName = getSectionName(section, bigTreeList);
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
        console.log('getThinClassName', e);
    }
};
export const handleRiskData = (datas) => {
    let riskObj = {};
    let risks = [];
    // 安全隐患数据处理
    if (datas && datas instanceof Array && datas.length > 0) {
        datas.forEach((v, index) => {
            // 去除坐标为0的点  和  名称为空的点（名称为空的点   type类型也不一样）
            if (v['X'] === 0 || v['Y'] === 0 || v['ProblemType'] === '') {
                return;
            }
            let level = v['EventType'];
            let name = v['ProblemType'];
            let ResponseOrg = v['ReorganizerObj'];
            // 位置
            let locationX = v['X'];
            let locationY = v['Y'];
            let coordinates = [locationY, locationX];
            // 隐患类型
            let iconType = 'riskQuality';
            let riskType = '';
            if (v.EventType === 0) {
                riskType = '质量缺陷';
                iconType = 'riskQuality';
            } else if (v.EventType === 1) {
                riskType = '安全隐患';
                iconType = 'riskDanger';
            } else if (v.EventType === 2) {
                riskType = '其他';
                iconType = 'riskOther';
            }
            riskObj[level] = riskObj[level] || {
                key: riskType,
                properties: {
                    name: riskType
                },
                children: []
            };
            let status = '';
            if (v.Status === -1) {
                status = '已提交';
            } else if (v.Status === 0) {
                status = '未审核通过';
            } else if (v.Status === 1) {
                status = '（审核通过）整改中';
            } else if (v.Status === 2) {
                status = '整改完成';
            } else if (v.Status === 3) {
                status = '确认完成';
            }
            riskObj[level].children.push({
                type: iconType,
                key: v.ID,
                properties: {
                    riskType: riskType,
                    measure: '',
                    name: name,
                    Problem: v.Problem,
                    response_org: ResponseOrg ? ResponseOrg.Full_Name : '',
                    status: status,
                    RouteID: v.RouteID,
                    CreateTime: v.CreateTime,
                    ID: v.ID,
                    InputerObj: v.InputerObj,
                    Supervisor: v.Supervisor,
                    type: 'risk'
                },
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                }
            });
        });
    }
    for (let i in riskObj) {
        risks.push(riskObj[i]);
    }
    return risks;
};

export const handleTrackData = (routes) => {
    let trackTree = [];
    let personNoList = [];
    if (routes && routes instanceof Array && routes.length > 0) {
        routes.forEach(route => {
            if (route && route.ID && route.PatrolerUser !== undefined && route.PatrolerUser !== null) {
                let PatrolerUser = route.PatrolerUser;
                let getDataStatus = true;
                let dataIndex = 0;
                personNoList.forEach((person, index) => {
                    if (person === PatrolerUser.ID) {
                        getDataStatus = false;
                        dataIndex = index;
                    }
                });
                if (getDataStatus) {
                    let children = [];
                    children.push({
                        ID: route.ID,
                        CreateTime: route.CreateTime,
                        EndTime: route.EndTime,
                        Patroler: route.Patroler,
                        Status: route.Status,
                        PatrolerUser: route.PatrolerUser
                    });
                    trackTree.push({
                        ID: PatrolerUser.ID,
                        Full_Name: PatrolerUser.Full_Name,
                        PK: PatrolerUser.PK,
                        Phone: PatrolerUser.Phone,
                        User_Name: PatrolerUser.User_Name,
                        children: children
                    });
                    personNoList.push(PatrolerUser.ID);
                } else {
                    trackTree[dataIndex].children.push({
                        ID: route.ID,
                        CreateTime: route.CreateTime,
                        EndTime: route.EndTime,
                        Patroler: route.Patroler,
                        Status: route.Status,
                        PatrolerUser: route.PatrolerUser
                    });
                }
            }
        });
    }
    return trackTree;
};

export const handleCuringTaskData = async (curingTypesData, curingTasks) => {
    let curingTaskTreeData = [];
    if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
        for (let i = 0; i < curingTasks.length; i++) {
            let task = curingTasks[i];
            if (task && task.ID) {
                curingTypesData.map((type) => {
                    if (type.ID === task.CuringType) {
                        let exist = false;
                        let childData = [];
                        // 查看TreeData里有无这个类型的数据，有的话，push
                        curingTaskTreeData.map((treeNode) => {
                            if (treeNode.ID === type.ID) {
                                exist = true;
                                childData = treeNode.children;
                                childData.push((task));
                            }
                        });
                        // 没有的话，创建
                        if (!exist) {
                            childData.push(task);
                            curingTaskTreeData.push({
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
    return curingTaskTreeData;
};

export const handleCuringTaskMess = (str, taskMess, totalThinClass, curingTypes, bigTreeList) => {
    let target = str.split(',').map(item => {
        return item.split(' ').map(_item => _item - 0);
    });
    let treeNodeName = taskMess.CuringMans;
    let typeName = '';
    curingTypes.map((type) => {
        if (type.ID === taskMess.CuringType) {
            typeName = type.Base_Name;
        }
    });
    let treearea = [];
    let status = '未完成';
    if (taskMess.Status === 2) {
        status = '已上报';
    }
    let regionData = getTaskThinClassName(taskMess, totalThinClass, bigTreeList);
    let sectionName = regionData.regionSectionName;
    let smallClassName = regionData.regionSmallName;
    let thinClassName = regionData.regionThinName;
    taskMess.sectionName = sectionName;
    taskMess.smallClassName = smallClassName;
    taskMess.thinClassName = thinClassName;
    taskMess.status = status;
    taskMess.typeName = typeName;
    let arr = [];
    target.map((data, index) => {
        if (data && data instanceof Array && data[1] && data[0]) {
            arr.push([data[1], data[0]]);
        }
    });
    treearea.push(arr);
    let message = {
        key: 3,
        type: status === '已上报' ? 'realCuringTask' : 'planCuringTask',
        properties: {
            ID: taskMess.ID,
            name: treeNodeName,
            type: status === '已上报' ? 'realCuringTask' : 'planCuringTask',
            typeName: typeName || '',
            status: status || '',
            CuringMans: taskMess.CuringMans || '',
            Area: (taskMess.Area || '') + '亩',
            CreateTime: taskMess.CreateTime || '',
            PlanStartTime: taskMess.PlanStartTime || '',
            PlanEndTime: taskMess.PlanEndTime || '',
            StartTime: taskMess.StartTime || '',
            EndTime: taskMess.EndTime || '',
            sectionName: taskMess.sectionName || '',
            smallClassName: taskMess.smallClassName || '',
            thinClassName: taskMess.thinClassName || ''
        },
        geometry: { type: 'Polygon', coordinates: treearea }
    };
    return message;
};
// 根据坐标获取
export const handleGetAddressByCoordinate = async (location, getLocationNameByCoordinate) => {
    try {
        let postData = {
            key: LBSAMAP_KEY,
            s: 'rsv3',
            location: location,
            radius: 2800,
            // callback: 'jsonp_10127_',
            platform: 'JS',
            logversion: 2.0,
            sdkversion: 1.3,
            appname: 'https://lbs.amap.com/console/show/picker',
            csid: '8A18DA11-6CD2-445E-B0B0-B3DEFEB925B3'
        };
        let addressData = await getLocationNameByCoordinate({}, postData);
        return addressData;
    } catch (e) {

    }
};

export const handleLocationDeviceData = (datas, thinClassTree) => {
    let devicesObj = {};
    let devices = [];
    if (datas && datas instanceof Array && datas.length > 0) {
        datas.forEach((data, index) => {
            // 去除坐标为0的点  和  名称为空的点（名称为空的点   type类型也不一样）
            if (!data.DeviceWork || !data.Latitude || !data.Longitude) {
                return;
            }
            let type = data.DeviceWork.DeviceName;
            let name = data.DeviceWork.DeviceName;
            let noArr = data.QRCode.split('-');
            let indexNum = '';
            if (noArr && noArr instanceof Array && noArr.length === 3) {
                indexNum = noArr[2];
            }
            let section = data.DeviceWork.Section;
            let sectionName = getSectionNameBySection(section, thinClassTree) || '';
            let projectName = getProjectNameBySection(section, thinClassTree) || '';
            let contacter = data.DeviceWork.Contacter || '';
            let phone = data.DeviceWork.Phone || '';
            let enterTime = data.DeviceWork.EnterTime || '';
            let leaveTime = data.DeviceWork.LeaveTime || '';
            let fictitiousLeaveTime = data.DeviceWork.LeaveTime || moment().add(1, 'days').format('YYYY-MM-DD 00:00:00');
            let images = data.DeviceWork.Images || '';
            // 位置
            let locationX = data.Longitude;
            let locationY = data.Latitude;
            let coordinates = [locationY, locationX];
            // CarNo
            let carNo = data.CarNo;
            // 机械类型
            let iconType = 'deviceExcavatorImg';
            let deviceType = data.DeviceWork.DeviceName;
            if (data.DeviceWork.DeviceName === '挖掘机') {
                iconType = 'deviceExcavatorImg';
            } else if (data.DeviceWork.DeviceName === '装载机') {
                iconType = 'deviceLoaderImg';
            } else if (data.DeviceWork.DeviceName === '压路机') {
                iconType = 'deviceRollerImg';
            } else if (data.DeviceWork.DeviceName === '打夯机') {
                iconType = 'deviceRammerImg';
            } else if (data.DeviceWork.DeviceName === '自卸汽车') {
                iconType = 'deviceDumpTruckImg';
            } else if (data.DeviceWork.DeviceName === '吊车') {
                iconType = 'deviceCraneImg';
            } else if (data.DeviceWork.DeviceName === '雾炮车') {
                iconType = 'deviceFogGunTruckImg';
            } else if (data.DeviceWork.DeviceName === '开沟机') {
                iconType = 'deviceDitchingMachineImg';
            } else if (data.DeviceWork.DeviceName === '洒水车') {
                iconType = 'deviceSprinklerImg';
            } else if (data.DeviceWork.DeviceName === '挖坑机') {
                iconType = 'deviceDiggerImg';
            } else {
                iconType = '';
            }
            devicesObj[type] = devicesObj[type] || {
                key: deviceType,
                properties: {
                    name: deviceType
                },
                children: []
            };
            devicesObj[type].children.push({
                type: 'device',
                // iconType: iconType,
                key: data.ID,
                properties: {
                    deviceType: deviceType,
                    name: name,
                    indexNum: indexNum,
                    projectName: projectName,
                    sectionName: sectionName,
                    enterTime: enterTime,
                    leaveTime: leaveTime,
                    fictitiousLeaveTime: fictitiousLeaveTime,
                    images: images,
                    phone: phone,
                    ID: data.ID,
                    contacter: contacter,
                    type: 'device',
                    iconType: iconType,
                    carNo: carNo,
                    trackStatus: false
                },
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                }
            });
        });
    }
    for (let i in devicesObj) {
        devices.push(devicesObj[i]);
    }
    return devices;
};
