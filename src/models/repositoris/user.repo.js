'use strict'

const { User } = require("../../models");

const findByEmail = async ({ user_name }) => {
    // Specify the attributes you want to retrieve
    const attributes = ['id', 'email', 'password', 'firstName', 'lastName', 'status','verify'];
    // Use the attributes in the findOne query
    return await User.findOne({
        where: { user_name: user_name },
        attributes: attributes, // Only select the specified attributes
    });
}
const findById = async ({ userId }) => {
    // Specify the attributes you want to retrieve
    const attributes = ['id', 'email',];
    // Use the attributes in the findOne query
    return await User.findOne({
        where: { id: userId },
        attributes: attributes, // Only select the specified attributes
    });
};
const updateverifyUsers = async ({ email, verify }) => {
    const data = {
        verify: verify
    }
    return await User.update(data, {
        where: { email: email },
    });
}


module.exports = { findByEmail, findById, updateverifyUsers }