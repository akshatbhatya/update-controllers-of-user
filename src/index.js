import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDb from "./db/index.js";
import app from "./app.js";
connectDb().then(()=>{
    app.listen(()=>{
        console.log(`${}`);
    })

})