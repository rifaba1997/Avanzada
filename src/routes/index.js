const { Router } = require('express');
const router = Router();
const { getPacientes,
        login, 
        signup} = require('../controllers/index.controller');

router.get('/pacientes', getPacientes);
router.post('/login', login);
router.post('/signup',signup)

module.exports = router;