var CONFIG = {};
CONFIG.JWT = {
    SECRET: 'TEST_SECRET'
}
CONFIG.MODE = 'PROD';
CONFIG.PROD_MODE = CONFIG.MODE === 'DEV' ? false: true;
CONFIG.IS_CERT_AUTH_ENABLED = false;
CONFIG.CURRENCY= process.env.CURRENCY_LABEL;
CONFIG.TEST_GATEWAY = {
    BASEURL: process.env.BASEURL,
    API_VERSION: process.env.API_VERSION,
    USERNAME: 'merchant.' + process.env.MERCHANT,
    PASSWORD: process.env.PASSWORD ,
    MERCHANTID: process.env.MERCHANT
};
CONFIG.PKI_GATEWAY = {
    BASEURL: process.env.BASEURL ,
    API_VERSION: process.env.API_VERSION,
    MERCHANTID:process.env.MERCHANT
}
CONFIG.SSL_FILES = {
    CRT: process.env.SSL_CRT_PATH,
    KEY: process.env.SSL_KEY_PATH
}
module.exports = CONFIG;