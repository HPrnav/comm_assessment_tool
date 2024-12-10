const express = require("express");
const cors =require("cors")
const mainroute =require('./route/index')

const app=express();
app.use(cors())
app.use(express.json())

app.use('/',mainroute)

app.listen(3000);