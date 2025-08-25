 const mongoose =  require("mongoose");
 const initData = require("./data.js");
 const Listing = require("../models/listing");


 async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};
main().
 then(()=> {console.log("connection successful")})
.catch(err => console.log(err));

 const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"68aaa5cfbcf99460e0cfb14f"}));// for owner autherize
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
 };
 initDB();