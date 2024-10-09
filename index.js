const express = require('express');
require('dotenv').config();
const urlRoute = require('./routes/url.route.js');
const userRoute = require('./routes/user.route.js')
const staticRoute = require('./routes/static.route.js')
const {  restrictToLoggedinUserOnly , checkAuth} = require('./middlewares/auth.middlewares.js')
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./connect.js');
const URL = require('./models/url.models.js');
const app = express();


const  port = process.env.PORT  || 5000;
const dbURL = process.env.MONGOURI;


connectToMongoDB(dbURL)
.then(() => console.log( 'Mongodb connect successfully')).catch((error) => {
    console.log("mongoDB not connected ",error);
}) ;


app.set('view engine', 'ejs'); 
app.set('views', path.resolve('./views'));  
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use('/user',userRoute);
app.use('/url',restrictToLoggedinUserOnly, urlRoute ); 
app.use('/', checkAuth , staticRoute);
app.get('/url/:shortId',async (req, res) => {
  const shortId = req.params.shortId;
const entry =  await  URL.findOneAndUpdate({
        shortId
    },{
        $push : {
            visitHistory : {
                timestamp :  Date.now()
            }
        }
    })

res.redirect(entry.redirectURL); 
});

app.listen(port, ()=> {
    console.log(`server got started successfully at PORT ${port}`);
})


