import {Sequelize} from "sequelize";

const db = new Sequelize('gps-management', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;