const mongoose=require ('mongoose');

const DB= process.env.DATABASE;


mongoose.connect(DB).then(() => {
    console.log(`Connected to database successfully`);
}).catch((err)=> console.log(`no connection`));