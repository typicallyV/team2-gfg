import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectDB from "./utils/connectDB.js";
import connectMongoDBSession from "connect-mongodb-session";
const MongoDBSession = connectMongoDBSession(session);
import routes from './routes/routes.js'

// Connect to the database
dotenv.config();
connectDB();

//what to put instead of local host
//"mongodb+srv://<username>:<password>@cluster0.mongodb.net/session?retryWrites=true&w=majority",
const app = express();
const PORT = process.env.PORT || 3000;


 //store cookies in mongodb
const store = new MongoDBSession({
  uri: "mongodb://localhost:27017/session",
  collection: "mySessions",
});

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "takes key as a string",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
 
//routes 
app.use('/test', routes);

app.get('/', (req, res) => {
    console.log(request);
  return response.status(234).send('working...');

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});