import React, { useRef} from 'react';
import { classNames } from 'primereact/utils';
import { useForm, Controller } from 'react-hook-form';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Toast} from "primereact/toast";
import classes from "../styles/Form.module.css";
import AuthButton from "../buttons/AuthButton";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {ToastContainer} from "react-toastify";
const Authform = ({...props}, mode) => {

    const toast = useRef(null);


    const defaultValues = {
        userName: props.userName || '',
        password: props.password || ''
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const onSubmit = (data) => {
        if(props.mode === "login") {
            props.submitLogin(data)
        }
        else {
            props.submitRegister(data)
        }
    };

    const handleClick = () => {
        props.switchToRegister()
        reset();
    }
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div key = {mode} className="card flex justify-content-center">
            <form onSubmit={handleSubmit(onSubmit)} className={classes.myForm}>
                <h2 style={{textAlign: "center", color: "white"}}>{props.mode}</h2>
                <Toast ref={toast}/>
                <Controller
                    name="userName"
                    control={control}
                    defaultValue={defaultValues.userName}
                    rules={{required: 'Name - is required.',
                        pattern: {
                            value: /^[^\s]+$/,
                            message: 'Name should not contain spaces.',
                        },
                    }}
                    render={({field, fieldState}) => (
                        <>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.userName})}></label>
                            <i className="pi pi-user" style={{fontSize: "1.5em", color: "whitesmoke"}}></i>
                            <span className="p-float-label">
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    style={{
                                    width: "280px",
                                    background: "transparent",
                                    color: "black",
                                    height: "40px"
                                }}
                                    />
                                <label htmlFor={field.name}>Имя пользователя</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}
                />

                <Toast ref={toast}/>
                <Controller
                    name="password"
                    control={control}
                    defaultValue={defaultValues.password}
                    rules={{required: 'Password is required.',
                        pattern: {
                            value: /^[^\s]+$/,
                            message: 'Password should not contain spaces.',
                        },}}
                    render={({field, fieldState}) => (
                        <>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.password})}></label>
                            <span className="p-float-label">
                           <Password id={field.name} {...field} inputRef={field.ref}
                                     inputStyle={{
                                         width: "285px",
                                         background: "transparent",
                                         color: "black",
                                         height: "40px"
                                     }}
                                     className={classNames({'p-invalid': fieldState.error})} feedback={false}
                                     toggleMask
                           />
                                <label htmlFor={field.name}>Password</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}
                />
                <div style={{display: "flex", flexDirection: "row", gap: "5em"}}>
                <i className="pi pi-apple" style={{fontSize: "2em"}}></i>
                <i className="pi pi-android" style={{fontSize: "2em"}}></i>
                </div>
                <AuthButton type='submit' className={classes.authButton} rounded>{props.mode}</AuthButton>
                <p style={{color: 'white', fontWeight: "lighter"}}>{props.accountHas} have account? <span
                    style={{fontWeight: "bold", cursor: "pointer"}} onClick={handleClick}>{props.swapMode}</span></p>
            </form>
            <ToastContainer />
        </div>
    );
};
export default Authform;