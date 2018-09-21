import cookie from 'js-cookie';
import {PROJECT_UNITS} from './api';

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
        sections: cookie.get('sections')
    };
};

export const setUser = (username, id, name, org, tasks, password, code, is_superuser, org_code, sections, isOwnerClerk) => {
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

export const getProjectUnits = (projectName) => {
    let units = [];
    PROJECT_UNITS.map((item) => {
        // if (item.value === projectName) {
        if (projectName.indexOf(item.value) !== -1) {
            units = item.units;
        }
    });
    return units;
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
