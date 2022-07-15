const { DataTypes, db } = require('../utils/database.util');

exports.Users = db.define('user', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'inactive']],
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'normal',
        validate: {
            isIn: [['normal', 'admin']],
        },
    },
});
