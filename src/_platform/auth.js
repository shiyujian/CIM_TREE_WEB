import cookie from 'js-cookie';
import { FOREST_API, FOREST_IMG } from './api';

export default () => {
    return !!cookie.get('id');
};

export const getUser = () => {
    // const permissions = cookie.get('permissions') || '[]';
    return {
        username: cookie.get('username'),
        id: +cookie.get('id'),
        name: cookie.get('name'),
        org: cookie.get('org'),
        tasks: cookie.get('tasks'),
        password: cookie.get('password'),
        code: cookie.get('code'),
        is_superuser: cookie.get('is_superuser') !== 'false',
        org_code: cookie.get('org_code'),
        sections: cookie.get('sections'),
        isOwnerClerk: cookie.get('isOwnerClerk'),
        phone: cookie.get('phone')
    };
};

export const setUser = (username, id, name, org, tasks, password, code, is_superuser, org_code, sections, isOwnerClerk, phone) => {
    cookie.set('username', username);
    cookie.set('id', id);
    cookie.set('name', name);
    cookie.set('org', org);
    cookie.set('tasks', tasks);
    cookie.set('password', password);
    cookie.set('code', code);
    cookie.set('is_superuser', is_superuser);
    cookie.set('org_code', org_code); // 所在组织机构code
    cookie.set('sections', sections);
    cookie.set('isOwnerClerk', isOwnerClerk);
    cookie.set('phone', phone); // 用户手机号
};

export const clearUser = () => {
    cookie.remove('username');
    cookie.remove('id');
    cookie.remove('name');
    cookie.remove('org');
    cookie.remove('tasks');
    cookie.remove('password');
    cookie.remove('code');
    cookie.remove('is_superuser');
    cookie.remove('org_code');
    cookie.remove('sections');
    cookie.remove('isOwnerClerk');
    cookie.remove('phone');
};

export const clearCookies = () => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
};

export const setPermissions = (permissions) => {
    const text = JSON.stringify(permissions);
    window.localStorage.setItem('permissions', text);
};

export const getPermissions = () => {
    let permissions = [];
    const text = window.localStorage.getItem('permissions');
    // var add= localStorage.getItem("TREE_LOGIN_USER")

    try {
        permissions = JSON.parse(text);
        // permissions = JSON.parse(add);
    } catch (e) {

    }
    return permissions;
};

export const removePermissions = () => {
    window.localStorage.removeItem('permissions');
};

// 校验手机号 以13等开头9位,以0554-4418039
export const checkTel = (tel) => {
    let mobile = /^1[3|5|4|6|8|7|9|]\d{9}$/, phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
};
// 校验身份证号 18位，以及15位
export const isCardNo = (card) => {
    let card_18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let card_15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
    return card_18.test(card) || card_15.test(card);
};
// 根据pk获取林工库里的id
export const getUserId = () => {
    let userData = JSON.parse(localStorage.getItem('LZ_TOTAL_USER_DATA'));
    let userId;
    if (userData && userData.length > 0) {
        userData.map(item => {
            if (item.PK === getUser().id + '') {
                userId = item.ID;
            }
        });
    }
    return userId;
};
export const searchToObj = (url) => {
    // 这个方法将"?letter=2&opp=23"这种string转换为JS对象形式，方便获取URL的参数
    let obj = {};
    if (url.indexOf('?') > -1) {
        let str = url.slice(1);
        let strs = str.split('&');
        strs.map(item => {
            const arr = item.split('=');
            obj[arr[0]] = arr[1];
        });
    }
    return obj;
};
// Modal布局
export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
    }
};

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
    // 单位工程级
    let sectionList = [];
    // 业主和管理员
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
    if (rst instanceof Array && rst.length > 0) {
        rst.map(node => {
            if (permission) {
                if (node.Type === '项目工程') {
                    projectList.push({
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
            } else if (section) {
                let sectionArr = section.split('-');
                let projectKey = sectionArr[0];
                if (node.Type === '项目工程' && node.No.indexOf(projectKey) !== -1) {
                    projectList.push({
                        Name: node.Name,
                        No: node.No
                    });
                } else if (node.Type === '单位工程' && node.No === section) {
                    sectionList.push({
                        Name: node.Name,
                        No: node.No,
                        Parent: projectKey
                    });
                }
            }
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
// 根据登录用户的部门code获取所在公司
export const getCompanyDataByOrgCode = async (orgCode, getOrgTreeByCode) => {
    let orgData = await getOrgTreeByCode({code: orgCode}, {reverse: true});
    let parent = {};
    let loopData = loopOrgCompany(orgData);
    parent = loopArrayCompany(loopData);
    return parent;
};

// 对获取的组织机构树进行遍历，返回数组
export const loopOrgCompany = (orgData) => {
    try {
        let extra_params = orgData && orgData.extra_params;
        let companyStatus = extra_params && extra_params.companyStatus;
        if (companyStatus && companyStatus === '公司') {
            return orgData;
        } else if (orgData && orgData.children && orgData.children.length > 0 &&
            companyStatus && companyStatus === '项目') {
            return orgData.children.map((child) => {
                return loopOrgCompany(child);
            });
        }
    } catch (e) {
        console.log('loopOrgCompany', e);
    }
};
// 对返回的数组进行遍历，获取内部的Object
export const loopArrayCompany = (loopData) => {
    try {
        if (loopData && loopData instanceof Array && loopData.length > 0) {
            let parent = loopData[0];
            return loopArrayCompany(parent);
        } else {
            return loopData;
        }
    } catch (e) {
        console.log('loopArrayCompany', e);
    }
};

// 判断用户是否为文书
export const getUserIsDocument = () => {
    try {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        let groups = user.groups;
        let userIsDocument = false;
        groups.map((group) => {
            if (group.name.indexOf('文书') !== -1) {
                userIsDocument = true;
            }
        });
        return userIsDocument;
    } catch (e) {
        console.log('getUserIsDocument', e);
    }
};

// 对林总数据库中的图片进行判断
export const getForestImgUrl = (data) => {
    try {
        let imgUrl = '';
        if (data.indexOf(FOREST_IMG) !== -1) {
            imgUrl = data;
        } else {
            imgUrl = FOREST_API + '/' + data.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        }
        return imgUrl;
    } catch (e) {
        console.log('getForestImgUrl', e);
    }
};
