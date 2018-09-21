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
