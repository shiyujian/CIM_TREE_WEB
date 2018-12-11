import CryptoJS from 'crypto-js';
import {FOREST_SECRECT} from '../api';

export const encrypt = (ID, token) => {
    let key = CryptoJS.enc.Utf8.parse('BFSmin0bP9');
    // const iv = CryptoJS.enc.Utf8.parse('0000000000');
    const iv = CryptoJS.enc.Utf8.parse('\0\0\0\0\0\0\0\0');
    console.log('utf8处理后key:' + key);
    console.log('utf8处理后iv:' + iv);
    let source = ID;
    let password = CryptoJS.enc.Utf8.parse(source);
    console.log('原始字符串:' + source);
    console.log('utf8处理后:' + password);

    // let options = {
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.Pkcs7
    // };
    let options = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
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
    //  128   laBC8ujEo6RemT23ISP8dg==
};

    // public static string Encrypt(string encryptStr, string key)
    // {
    //     Byte[] bKey = new Byte[16];
    //     Array.Copy(Encoding.ASCII.GetBytes(key), bKey, key.Length);
    //     var _aes = new AesCryptoServiceProvider();
    //     _aes.BlockSize = 128;
    //     _aes.KeySize = 128;
    //     _aes.Key = bKey;
    //     _aes.IV = (byte[])(object)new sbyte[16];//Encoding.UTF8.GetBytes(IV);
    //     _aes.Padding = PaddingMode.PKCS7;
    //     _aes.Mode = CipherMode.CBC;

    //     var _crypto = _aes.CreateEncryptor(_aes.Key, _aes.IV);
    //     byte[] encrypted = _crypto.TransformFinalBlock(Encoding.UTF8.GetBytes(encryptStr), 0, Encoding.UTF8.GetBytes(encryptStr).Length);

    //     _crypto.Dispose();

    //     return System.Convert.ToBase64String(encrypted);
    // }

    // /*
    //  * 加密
    //  */
    // public static String encrypt(String cleartext) {
    //     if (TextUtils.isEmpty(cleartext)) {
    //         return cleartext;
    //     }
    //     try {
    //         byte[] result = encrypt(cleartext.getBytes());
    //         return new String(Base64.encode(result, Base64.DEFAULT)).replace("\n", "");
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    //     return null;
    // }

    // /**
    //  * 加密
    //  */
    // private static byte[] encrypt(byte[] clear) throws Exception {
    //     SecretKeySpec skeySpec = new SecretKeySpec(PUBKEY.getBytes(), AES);
    //     Cipher cipher = Cipher.getInstance(CBC_PKCS5_PADDING);
    //     cipher.init(Cipher.ENCRYPT_MODE, skeySpec, new IvParameterSpec(new byte[cipher.getBlockSize()]));
    //     byte[] encrypted = cipher.doFinal(clear);
    //     return encrypted;
    // }

    // private final static String HEX = "0123456789ABCDEF";
    // private static final String CBC_PKCS5_PADDING = "AES/CBC/PKCS5Padding";//AES是加密方式 CBC是工作模式 PKCS5Padding是填充模式
    // private static final String AES = "AES";//AES 加密
    // private static final String SHA1PRNG = "SHA1PRNG";// SHA1PRNG 强随机种子算法, 要区别4.2以上版本的调用方法
    // private static final String PUBKEY = "8gvPuMCBKpkVNkMO";
