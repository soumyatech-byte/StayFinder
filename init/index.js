const mongoose= require("mongoose");
const initData=require("./data.js");

const Listing = require("../models/listing.js");

const Mongo_URL='mongodb://127.0.0.1:27017/wonderLust';

main().then(()=>{
    console.log("Connected to MongoDB successfully");
})
   .catch((err)=>{
    console.log(err)
   })
   
async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "69cdf8492b9c6e194abc2fcf"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();
