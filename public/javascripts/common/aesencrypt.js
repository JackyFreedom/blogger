/**
 * AES加密
 */
define(['aesFn'], function () {
    const aesSecretUtf8 = CryptoJS.enc.Utf8.parse('jackyBlogger');  //加班的key
    const iv = CryptoJS.enc.Base64.parse('******KKKKKKKKKKKKKKKKK******'); //解密的偏移量
    return {

        encryptByAES: function (strEncrypt) {

            let aesEncrypt = CryptoJS.AES.encrypt(strEncrypt, aesSecretUtf8, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return aesEncrypt.toString()
        },

        /**
         * aes解密
         * @param strEncrypt:需要解密的内容
         * @param keyEncrypt:加密时用到的密钥
         * @return 返回解密后的内容
         **/
        unEncryptByAES: function (strEncrypt) {
            let aesUnEncrypt = CryptoJS.AES.decrypt(strEncrypt, aesSecretUtf8,
                {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
            return aesUnEncrypt.toString(CryptoJS.enc.Utf8);
        },
    }





});