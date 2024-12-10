import { useState } from "react"
import { Button } from "../component/Button"
import { Heading } from "../component/Heading"
import { BottomWarning } from "../component/Bottomwarning"
import { InputBox } from "../component/Inputbox"
import { SubHeading } from "../component/Subheading"
import axios from"axios"
import { useNavigate } from "react-router-dom"
 
export const Signin= ()=>{
    const[username,setusername]=useState("")
    const [password,setpassword]=useState("")
    const navigate =useNavigate()


    const handleSignin = async () => {
        // Validate inputs
        if ( !username || !password) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/user/signin", {
                username,
                password
            });
            if(response.status==200){
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username",username)
                navigate("/assessment");
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('User not found');
                }  
        }}
    };

return(
<div className="bg-violet-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2  h-max px-4">
            <Heading label={"Signin"}></Heading>
            <SubHeading label={"Plz fill the information correctly"}></SubHeading>
            <InputBox label={"Username"} onChange={(e)=>{setusername(e.target.value)}} placeholder={"jos@gmail.com"}></InputBox>
            <InputBox label={"Password"} onChange={(e)=>{setpassword(e.target.value)}} placeholder={"7657565"}></InputBox>
            <Button label={"Signin"} onClick={()=>{handleSignin()}}></Button>
            <BottomWarning label={"Don't have an account?"} buttonText={"singup"} to={"/signup"}></BottomWarning>
        </div>

    </div>
</div>

)

}