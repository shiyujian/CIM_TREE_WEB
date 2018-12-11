import CryptoJS from 'crypto-js';
import {FOREST_SECRECT} from '../api';

export const encrypt = (data) => {
    let key = CryptoJS.enc.Utf8.parse(FOREST_SECRECT);
    let source = data;
    let password = CryptoJS.enc.Utf8.parse(source);
    console.log('原始字符串:' + source);
    console.log('utf8处理后:' + password);
    let options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    };
    let encrypted = CryptoJS.AES.encrypt(password, key, options);
    // let decrypted = CryptoJS.AES.decrypt(encrypted, key, options);
    let stringData = encrypted.toString();
    // console.log('加密后base64:' + encrypted);
    // console.log('stringData:', stringData);
    // let encryptedStr = encrypted.ciphertext.toString();
    // console.log('加密后16进制:' + encryptedStr);
    // console.log('解密后utf8:' + decrypted);
    // console.log('解密后原始字符串:' + decrypted.toString(CryptoJS.enc.Utf8));
    // console.log('encrypted:', encrypted);
    return stringData;
};
