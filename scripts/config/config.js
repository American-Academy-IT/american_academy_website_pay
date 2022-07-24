var CONFIG = {};
CONFIG.JWT = {
    SECRET: 'TEST_SECRET'
}
CONFIG.MODE = 'LIVE';
CONFIG.PROD_MODE = CONFIG.MODE === 'DEV' ? false: true;
CONFIG.IS_CERT_AUTH_ENABLED = true;
CONFIG.CURRENCY= process.env.CURRENCY_LABEL;
CONFIG.TEST_GATEWAY = {
    BASEURL: process.env.TEST_GATEWAY_URL,
    API_VERSION: process.env.API_VERSION,
    USERNAME: 'merchant.' + process.env.USERNAMETEST,
    PASSWORD: process.env.PASSWORD ,
    MERCHANTID: process.env.USERNAMETEST
};
CONFIG.PKI_GATEWAY = {
    BASEURL: process.env.BASEURL ,
    API_VERSION: process.env.API_VERSION,
    MERCHANTID:process.env.USERNAMETEST
}
CONFIG.SSL_FILES = {
    CRT: process.env.SSL_CRT_PATH,
    KEY: process.env.SSL_KEY_PATH
}
module.exports = CONFIG;