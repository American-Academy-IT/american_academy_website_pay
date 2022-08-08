const router = require('express').Router();
const { addUser, allUsers } = require('./pay.contrller');

router.post('/user', addUser);
router.get('/user', allUsers);

module.exports = router;