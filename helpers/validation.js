const { check } = require('express-validator');

exports.signUpValidation = [
    check('username','Name is reqired').not().isEmpty(),
    check('phone','Please Enter Phone Number').not().isEmpty(),
    check('password','Password is reqired').isLength({ min:8}),
    check('address','Address is reqired').not().isEmpty(),
    check('businessname','Business Name is reqired').not().isEmpty(),
]

exports.loginValidation = [
    check('phone','Please Enter Phone Number').not().isEmpty(),
    check('password','Password is reqired').isLength({ min:8}),
]