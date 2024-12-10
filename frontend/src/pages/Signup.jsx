import { Heading } from "../component/Heading";
import { Button } from "../component/Button";
import { InputBox} from "../component/Inputbox";
import { BottomWarning } from "../component/Bottomwarning";
import { SubHeading } from "../component/Subheading";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export  const Signup=()=>{
    const navigate = useNavigate();
    const[firstname,setfirstname]=useState("")
    const[lastname,setlastname]=useState("")
    const[username,setusername]=useState("")
    const[password,setpassword]=useState("")
 return(
 <div className="bg-violet-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white  w-80 text-center p-2 h-max px-4">
            <Heading label={"Signup"}></Heading>
            <SubHeading label={"Enter Your information to create an account"}></SubHeading>
            <InputBox onChange={(e)=>{setfirstname(e.target.value)}} label={"First Name"} placeholder={"jhon"}></InputBox>
            <InputBox onChange={(e)=>{setlastname(e.target.value)}}  label={"Last Name"} placeholder={"David"}></InputBox>
            <InputBox onChange={(e)=>{setusername(e.target.value)} }  label={"Email"} placeholder={"jhon@gmail.com"}></InputBox>
            <InputBox onChange={(e)=>{setpassword(e.target.value)}}  label={"Password"} placeholder={"139344"}></InputBox>
            <BottomWarning label={"Already have an account?"} buttonText={"Signin"} to={'/signin'}></BottomWarning>
            <Button label={"Signup"} onClick={async ()=>{
                console.log(firstname+lastname)
                const response=await axios.post("http://localhost:3000/user/signup",{
                     firstname,
                     lastname,
                     username,
                     password
            });
            localStorage.setItem("token",response.data.token)
            navigate("/")
             }} />
        </div>
    </div>

</div>
)
}

