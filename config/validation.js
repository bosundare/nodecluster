const { check, validationResult } = require('express-validator/check');
const clusterValidationRules = () => {
  return [
    check('clustername')
  .isLength({min:9}).trim().withMessage('Cluster Name should be in format RTP-POC###'),
  check('privlan')
  .isLength({min:1}).trim().withMessage('Primary Vlan is required')
  .isInt().withMessage('Primary Vlan should only be numbers'),
  check('secvlan')
  .isLength({min:1}).trim().withMessage('Secondary Vlan is required')
  .isInt().withMessage('Secondary Vlan should only be numbers'),
  check('tor1ip')
  .isLength({min:4}).trim().withMessage('IP address is required')
  .isIP().withMessage('IP Address should be in the format eg 10.10.10.10'),
  check('tor2ip')
  .isLength({min:4}).trim().withMessage('IP address is required')
  .isIP().withMessage('IP Address should be in the format eg 10.10.10.10'),
  check('interface')
  .isLength({min:5}).trim().withMessage('Minimum lenght of 5 in the form Et1/1')
  .isLength({max:8}).trim().withMessage('Max lenght of Interface is 8')
  ]
}

const userValidationRules = () => {
    return [
       check('username')
       .isLength({min:3}).trim().withMessage('Username field must not be empty')
       .isAlphanumeric().withMessage('Username cannot contain symbols'),
       check('password')
       .isLength({min:5}).trim().withMessage('Minimum 5 Character Password')
       .custom((value,{req, loc, path}) => {
        if (value !== req.body.password2) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    }),
       ]
}
module.exports = {clusterValidationRules, userValidationRules}