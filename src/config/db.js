// connect db
const { Pool } = require("pg")

module.exports = new Pool({
    user: 'pedrolopes',
    password: "",
    host: "localhost",
    post: 5432,
    database: "gymmanager"
})