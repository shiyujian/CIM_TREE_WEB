import './Curing.less';
import { getUser } from '_platform/auth';
import { PROJECT_UNITS } from '_platform/api';

// 获取项目的小班
export const getSmallClass = (smallClassList, totalDataPer) => {
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

    let test = [];
    try {
        smallClassList.map(list => {
            // 加入项目，地块的code，使No不重复，如果重复，点击某个节点，No重复的节点也会选择中
            let codeName =
                    list.LandNo +
                    '#' +
                    list.RegionNo +
                    '#' +
                    list.SmallClass +
                    '#' +
                    list.SmallClassName;

            let noArr = list.No.split('-');
            // 为了让各个细班的code都不一样   把各个细班的code全部加入
            // let No = noArr[0] + '-' + noArr[1] + '-' + noArr[2] + '-' + noArr[3];
            // 如果小于5 说明没有标段  不符合规则
            if (noArr.length < 5) {
                console.log('rst', list);
                return;
            }
            // 项目 + 区块 + 标段
            let sectionNo = noArr[0] + '-' + noArr[1] + '-' + noArr[4];
            if (user.username === 'admin' || totalDataPer) {
                // console.log('wwwww', sectionNo);
            } else if (section) {
                if (sectionNo !== section) {
                    return;
                }
            }
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
