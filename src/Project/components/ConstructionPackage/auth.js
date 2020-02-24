import {
    getUser
} from '_platform/auth';
export const getConstructionPackageBySection = async (sectionNo, getThinClassList) => {
    let sectionNoArr = sectionNo.split('-');
    let parentNo = sectionNoArr[0] + '-' + sectionNoArr[1];
    let list = await getThinClassList({ no: parentNo }, {section: sectionNoArr[2]});
    let smallCalssPackageList = getSmallClassBySection(list);
    smallCalssPackageList.map(smallClass => {
        let thinClassList = getThinClassBySection(smallClass, list);
        smallClass.children = thinClassList;
    });
    console.log('smallCalssPackageList', smallCalssPackageList);

    return smallCalssPackageList;
};
// 获取项目的小班
export const getSmallClassBySection = (smallClassList) => {
    let user = getUser();
    let section = user.section;
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
            // 项目 + 区块 + 标段 + 小班
            let No = noArr[0] + '-' + noArr[1] + '-' + noArr[4] + '-' + noArr[2];
            // 项目 + 区块 + 标段
            let sectionNo = noArr[0] + '-' + noArr[1] + '-' + noArr[4];

            // 管理员可以查看所有数据，其他人员只能查看符合自己标段的数据
            let permission = false;
            if (user.username === 'admin') {
                permission = true;
            }
            let userRoles = user.roles || '';
            if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('业主') !== -1) {
                permission = true;
            }
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
export const getThinClassBySection = (smallClass, list) => {
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
