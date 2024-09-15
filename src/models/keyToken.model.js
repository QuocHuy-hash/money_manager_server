'use strict';
const { Model, DataTypes, ARRAY } = require('sequelize');

module.exports = (sequelize) => {
    class Keytoken extends Model {
        static associate(models) {

        }
    }
    Keytoken.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', // Tham chiếu đến model 'Shops'
                key: 'id', // Tham chiếu đến trường 'id' của model 'Shops'
            },
        },
        publicKey: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        privateKey: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        refreshTokensUsed: {
            type: DataTypes.JSON, //da duoc su dung
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Keytoken',
    });

    return Keytoken;
};
