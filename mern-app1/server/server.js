console.log("Hello Server");
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app=express();
const PORT=process.env.PORT||8000;
const users=[
        {id:1,name:"user1"},
        {id:2,name:"user2"},
        {id:3,name:"user3"},
        {id:4,name:"user4"},
        {id:5,name:"user5"},
        {id:6,name:"user6"},
        {id:7,name:"user7"},
        {id:8,name:"user8"},
        {id:9,name:"user9"},
        {id:10,name:"user10"},
    ];
app.get('/',(req,res)=>{
    res.send("Hello from server   ");
})
app.get('/test',(req,res)=>{
    res.send("Hello from server 11");
})
app.get('/users',(req,res)=>{
    
    res.send(users);
})
app.listen(PORT,()=>{
    console.log(`server is runing at http://localhost:${PORT}`);
    
})