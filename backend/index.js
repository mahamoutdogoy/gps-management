import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import Users from "./models/UserModel.js";
import UserRoute from "./routes/UserRoute.js";




dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

//     (async()=>{
//         await db.sync();
//     })();

//    await Users.sync({ alter: true });

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(UserRoute);




//static Images Folder

app.use('/Images', express.static('./Images'))

//  store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});