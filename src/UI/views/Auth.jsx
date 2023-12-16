import React, {useState} from 'react';
import Authform from "../forms/Authform";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import Header from "./Header";
import {request} from "../../actions/request";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import classes from "../styles/Form.module.css"

const Auth = () => {

    const [userName, setUserName] = useState("")
    const[password, setPassword] = useState("")
    const [formMode, setFormMode] = useState('login')
    const navigate = useNavigate();
    const expiredTokenDate = useSelector(state => state.token.expiredTime)
    let expiresIn = null;
    const switchToMode = (formMode) =>{
        setFormMode(formMode)

    }

    const dispatch = useDispatch()
    const handleLogin =  (data) =>{
        const user = {userName: data.userName, password: data.password}
        axios.post("http://localhost:8080/web-programming4/api/auth/login",user, {
            withCredentials: true
        })
            .then(response => {
                dispatch(request(response.data))
                navigate("/main")
            })
            .catch(error =>{
                toast.error("Логин или пароль введены неверно!")
                console.error("Ошибка при входе", error)
            })
    }

    const handleRegister = (data) =>{
        const user = {userName: data.userName, password: data.password}
        axios.post("http://localhost:8080/web-programming4/api/auth/register", user, {
            withCredentials: true
        })
            .then(response =>{
                dispatch(request(response.data))
                navigate("/main")
                toast.success("Регистрация прошла успешно!")
            })
            .catch(error =>{
                console.error("Ошибка при регистрации", error)
                if(error.response.status === 400){
                    toast.error("Такой логин уже существует, попробойте другой")
                }
                else {
                    toast.error("Что-то пошло не так при регистрации, попробуйте снова")
                }

            })
    }

        if (expiredTokenDate) {
            const expiredTokenTime = new Date(expiredTokenDate);
            const initDate = Math.floor(new Date().getTime() / 1000);
            expiresIn = Math.floor(expiredTokenTime.getTime() / 1000) - initDate;
            console.log(`Токен истекает через ${expiresIn} секунд`);
            // Выполните любую другую логику, основанную на expiresIn
        }


    return (
        <div style={{display: "flex", alignItems: "center", width: '100%', flexDirection: "column"}}>
            <div className={classes.authHeader}>
                <Header  expiresIn = {expiresIn}/>
            </div>
            {formMode==="login" ? (
                    <Authform
                        {...{
                            mode: formMode,
                            swapMode: "register",
                            userName,
                            password,
                            setUserName,
                            setPassword,
                            accountHas: "Don't",
                            switchToRegister: () => switchToMode("register"),
                            submitLogin: (data) => handleLogin(data),
                        }}
                    />
            )
            : (
                    <Authform
                        {...{
                            mode: formMode,
                            swapMode: "login",
                            userName,
                            password,
                            setUserName,
                            setPassword,
                            accountHas: "Already",
                            switchToRegister: () => switchToMode("login"),
                            submitRegister: (data) => handleRegister(data)
                        }}
                    />
                )}
        </div>
    );
};

export default Auth;