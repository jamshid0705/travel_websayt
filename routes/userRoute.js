const express = require('express');
const route = express.Router();
const userController=require('../controllers/userController')

route.route('/').get(userController.getUsers).post(userController.addUser);
route.route('/:id').get(userController.getUserId).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = route;
