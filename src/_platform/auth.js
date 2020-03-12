import cookie from 'js-cookie';
import { FOREST_API, FOREST_IMG, DEFAULT_PROJECT } from './api';

export default () => {
    return !!cookie.get('id');
};

export const trim = (str) => {
    if (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    } else {
        return str;
    }
};

export const getUser = () => {
    try {
        let user = window.localStorage.getItem('LOGIN_USER_DATA');
        if (!user) {
            return {
                username: '',
                ID: '',
                duty: '',
                name: '',
                org: '',
                phone: '',
                ssBlack: '',
                number: '',
                roles: '',
                section: '',
                status: '',
                token: '',
                tasks: 0,
                password: ''
            };
        }
        user = JSON.parse(user);
        const {
            User_Name = '',
            ID = '',
            Duty = '',
            Full_Name = '',
            Org = '',
            OrgObj = '',
            Phone = '',
            IsBlack = 0,
            Number = '',
            Roles = '',
            Section = '',
            Status = 1,
            Token = ''
        } = user;
        let roles = '';
        if (Roles && Roles instanceof Array && Roles.length > 0) {
            roles = Roles[0];
        }
        return {
            username: User_Name,
            ID: ID,
            duty: Duty,
            name: Full_Name,
            org: Org,
            orgObj: OrgObj,
            phone: Phone,
            isBlack: IsBlack,
            number: Number,
            roles: roles,
            section: Section,
            status: Status,
            token: Token,
            tasks: cookie.get('tasks'),
            password: cookie.get('password')
        };
    } catch (e) {
        console.log('getUser', e);
    }
};

export const setUser = (username, ID, duty, name, org, phone, isBlack, number, roles, section, status, token, tasks, password) => {
    cookie.set('username', username);
    cookie.set('ID', ID);
    cookie.set('duty', duty);
    cookie.set('name', name);
    cookie.set('org', org);
    cookie.set('phone', phone);
    cookie.set('isBlack', isBlack);
    cookie.set('number', number);
    cookie.set('roles', roles);
    cookie.set('section', section);
    cookie.set('status', status);
    cookie.set('token', token);
    cookie.set('tasks', tasks);
    cookie.set('password', password);
};

export const clearUser = () => {
    cookie.remove('username');
    cookie.remove('ID');
    cookie.remove('duty');
    cookie.remove('name');
    cookie.remove('org');
    cookie.remove('phone');
    cookie.remove('number');
    cookie.remove('roles');
    cookie.remove('section');
    cookie.remove('status');
    cookie.remove('token');
    cookie.remove('tasks');
    cookie.remove('password');
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
    try {
        if (text) {
            permissions = JSON.parse(text);
            if (!(permissions && permissions instanceof Array)) {
                permissions = [];
            }
        }
    } catch (e) {
        console.log('getPermissions', e);
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
    // 项目级
    let projectList = [];
    // 单位工程级
    let sectionList = [];
    // 业主和管理员
    let user = getUser();
    let section = user.section;
    let permission = false;
    if (user.username === 'admin') {
        permission = true;
    }
    let userRoles = user.roles || '';
    if (userRoles && userRoles.RoleName) {
        if (userRoles.RoleName.indexOf('业主') !== -1) {
            permission = true;
        } else if (userRoles.RoleName.indexOf('项目技术负责人') !== -1) {
            permission = true;
        } else if (userRoles.RoleName.indexOf('项目经理') !== -1) {
            permission = true;
        }
    }

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
export const getCompanyDataByOrgCode = async (orgID, getParentOrgTreeByID) => {
    let orgData = await getParentOrgTreeByID({id: orgID});
    let parent = {};
    let loopData = loopOrgCompany(orgData);
    parent = loopArrayCompany(loopData);
    return parent;
};

// 对获取的组织机构树进行遍历，返回数组
export const loopOrgCompany = (orgData) => {
    try {
        let OrgType = (orgData && orgData.OrgType) || '';
        if (OrgType && OrgType.indexOf('单位') !== -1) {
            return orgData;
        } else if (orgData && orgData.children && orgData.children.length > 0 &&
            OrgType && OrgType === '非公司') {
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
        const user = getUser();
        let userIsDocument = false;
        let userRoles = user.roles || '';
        if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('文书') !== -1) {
            userIsDocument = true;
        }
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

// 判断用户是否为业主和管理员
export const getUserIsManager = () => {
    try {
        const user = getUser();
        let permission = false;
        if (user.username === 'admin') {
            permission = true;
        }
        let userRoles = user.roles || '';
        if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('业主') !== -1) {
            permission = true;
        }
        return permission;
    } catch (e) {
        console.log('getUserIsManager', e);
    }
};

// 判断用户应该选择的标段
export const getDefaultProject = async () => {
    try {
        let permission = await getUserIsManager();
        if (permission) {
            return DEFAULT_PROJECT;
        } else {
            const user = getUser();
            let section = user.section;
            if (section) {
                let sectionArr = section.split('-');
                if (sectionArr && sectionArr instanceof Array && sectionArr.length > 0) {
                    let project = sectionArr[0];
                    return project;
                } else {
                    return null;
                }
            }
        }
    } catch (e) {
        console.log('getUserIsManager', e);
    }
};
