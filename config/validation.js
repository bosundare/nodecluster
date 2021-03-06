const { check, validationResult } = require('express-validator/check');
const clusterValidationRules = () => {
  return [
    check('clustername')
  .isLength({min:9}).trim().withMessage('Cluster Name should be in format RTP-POC###'),
  check('clusterip')
  .isLength({min:4}).trim().withMessage('IP address is required')
  .isIP().withMessage('IP Address should be in the format eg 10.10.10.10'),
  check('privlan')
  .isLength({min:1}).trim().withMessage('Primary Vlan is required')
  .isInt().withMessage('Primary Vlan should only be numbers')
  .matches(/^(?:[1-9]\d{0,2}|[1-3]\d{3}|40(?:[0-8]\d|9[0-3]))$/).withMessage('Vlan ID must be between 1 and 4093'),
  check('secvlan')
  .isLength({min:1}).trim().withMessage('Secondary Vlan is required')
  .isInt().withMessage('Secondary Vlan should only be numbers')
  .matches(/^(?:[1-9]\d{0,2}|[1-3]\d{3}|40(?:[0-8]\d|9[0-3]))$/).withMessage('Vlan ID must be between 1 and 4093'),
  check('tor1ip')
  .isLength({min:4}).trim().withMessage('IP address is required')
  .isIP().withMessage('IP Address should be in the format eg 10.10.10.10'),
  check('tor2ip')
  .isLength({min:4}).trim().withMessage('IP address is required')
  .isIP().withMessage('IP Address should be in the format eg 10.10.10.10'),
  check('interface')
  .isLength({min:5}).trim().withMessage('Minimum lenght of 5 in the form Et1/1')
  .isLength({max:8}).trim().withMessage('Max lenght of Interface is 8')
  .matches(/^(?:(E|e)[t][0-2]?\d{0,1}[/][1][-][2-4])$/).withMessage('Interface must be in the format Et28/1-4')
  ]
}

const userValidationRules = () => {
    return [
       check('username')
       .isLength({min:3}).trim().withMessage('Username field must not be empty')
       .matches(/^[a-zA-Z 0-9\.\_]*$/).withMessage('Username only allows dot and underscore symbols'),
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

const vlanValidationRules = () => {
  return [
    check('extravlan')
    .blacklist(' ')
    .isLength({min:1}).trim().withMessage('Vlan Field is required')
    .matches(/^(?:[1-9]\d{0,2}|[1-3]\d{3}|40(?:[0-8]\d|9[0-3]))(?:[,-] *(?:[1-9]\d{0,2}|[1-3]\d{3}|40(?:[0-8]\d|9[0-3]))?)*$/).withMessage('Invalid Vlans Entered')
     ]
}

module.exports = {clusterValidationRules, userValidationRules, vlanValidationRules}