const dotenv= require ('dotenv'); 
const mongoose= require ('mongoose');
const express=require ('express');
const app= express();

dotenv.config({path: './config.env'});
require('./DB/connection');

app.use(express.json());

app.use(require('./router/auth'));

const PORT= process.env.PORT;

const middleware=(req,res,next) =>{
    console.log(`Hello midware`);
    next();
}

app.get('/', (req,res)=> {
    res.send(`Hello World from app js`)
});
app.get('/about', middleware, (req,res)=> {
    res.send(`About us`)
});
app.get('/contact', (req,res)=> {
    res.send(`Contact us`)
});
app.get('/signin', (req,res)=> {
    res.send(`Sign in`)
});
app.get('/signup', (req,res)=> {
    res.send(`Register`)
});

app.listen(PORT, ()=> {
    console.log(`Server is running at port ${PORT}`); 
})