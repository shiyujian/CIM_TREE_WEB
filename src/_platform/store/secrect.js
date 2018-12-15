import CryptoJS from 'crypto-js';

export const encrypt = (ID, token) => {
    let key = CryptoJS.enc.Utf8.parse(token);
    let srcs = CryptoJS.enc.Utf8.parse(ID);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.enc.Utf8.parse('')
    });
    let stringData = encrypted.toString();
    return stringData;
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
