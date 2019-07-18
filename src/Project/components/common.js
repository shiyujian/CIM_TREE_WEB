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

export const layoutT = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

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
