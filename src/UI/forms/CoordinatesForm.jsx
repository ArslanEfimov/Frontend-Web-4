import React, {useRef} from 'react';
import {Toast} from "primereact/toast";
import {Controller, useForm} from "react-hook-form";
import {Dropdown} from "primereact/dropdown";
import {classNames} from "primereact/utils";
import classes from "../styles/Main.module.css";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';

const CoordinatesForm = ({...props}) => {

    const toasts = useRef(null);
    const navigate = useNavigate();
    const optionsX = [
        { label: 'X: -5', value: -5 },
        { label: 'X: -4', value: -4 },
        { label: 'X: -3', value: -3 },
        { label: 'X: -2', value: -2 },
        { label: 'X: -1', value: -1 },
        { label: 'X: 0', value: 0 },
        { label: 'X: 1', value: 1 },
        { label: 'X: 2', value: 2 },
        { label: 'X: 3', value: 3 },
    ];
    const optionsR = [
        { label: 'R: -5', value: -5 },
        { label: 'R: -4', value: -4 },
        { label: 'R: -3', value: -3 },
        { label: 'R: -2', value: -2 },
        { label: 'R: -1', value: -1 },
        { label: 'R: 0', value: 0 },
        { label: 'R: 1', value: 1 },
        { label: 'R: 2', value: 2 },
        { label: 'R: 3', value: 3 },
    ];
    const defaultValue = ""
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const onSubmit = (data) => {
        const coordinates = {x: data.x, y: Number(data.y), r: data.r}
        axios.post("http://localhost:8080/web-programming4/api/main/addDot", coordinates, {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache',
            }
        })
            .then(response =>{
                console.log(response.data.x)
                const newResults = {
                    x: response.data.x,
                    y: response.data.y,
                    r: response.data.r,
                    currentTime: response.data.currentTime,
                    executionTime: response.data.executionTime,
                    result: response.data.result ? "Попадание" : "Промах"
                }
                props.setResults([...props.tableResults, newResults])
            })
            .catch(error =>{

                if(error.response.status === 401){
                    navigate("/auth")
                }
                if(error.response.status === 400){
                    toast.error("Значение не валидны или выходят за пределы")
                }
            })
        reset();
    };

    const onDelete = () =>{
        axios.delete("http://localhost:8080/web-programming4/api/main/deleteDots", {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache',
            }
        }).then(response =>{
            props.setResults([])

        }).catch(error =>{
            if(error.response.status === 401){
                navigate("/auth")
            }
        })

    }


    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Toast ref={toasts}/>
                <Controller
                    name="x"
                    control={control}
                    defaultValue={defaultValue}
                    rules={{required: 'X is required.'}}
                    render={({field, fieldState}) => (
                        <>
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                onChange={e => field.onChange(e.value)}
                                options={optionsX}
                                focusInputRef={field.ref}
                                className={classNames({'p-invalid': fieldState.error}, classes.selectStyle)}
                                placeholder="Select X"
                            >
                            </Dropdown>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}
                />
            </div>

            <div>
                <Toast ref={toasts}/>
                <Controller
                    name="y"
                    control={control}
                    defaultValue={defaultValue}
                    rules={{
                        required: 'Value Y - is required.',
                        pattern: {
                            value: /^[^\s]+$/,
                            message: 'Value Y should not contain spaces.',
                        },
                        validate: {
                            isNumber: (value) => !isNaN(Number(value)) || 'Please enter a valid number.',
                            withinRange: (value) => (value >= -3 && value <= 3) || 'Value should be between -3 and 3.',
                            decimalPlaces: (value) => /^[+-]?([0-9]+([.][0-9]{0,6})?|[.][0-9]+)$/.test(value) || 'Up to six decimal places allowed.',
                        },
                    }}
                    render={({field, fieldState}) => (
                        <>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.userName})}></label>
                            <span className="p-float-label">
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={classNames({'p-invalid': fieldState.error}, classes.inputTextStyles)}
                                    type="number"
                                    min="-3"
                                    max="3"
                                    step="any"

                                />
                                <label htmlFor={field.name}>Input Y</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}
                />
                <div style={{marginTop: "10px"}}>
                    <Toast ref={toasts}/>
                    <Controller
                        name="r"
                        control={control}
                        defaultValue={defaultValue}
                        rules={{
                            required: 'R is required.',
                            validate: {
                                positiveValue: (value) => parseFloat(value) > 0 || 'Please select a positive R value.',
                            },
                        }}
                        render={({field, fieldState}) => (
                            <>
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    onChange={e => {
                                        field.onChange(e.value)
                                        props.setRValue(e.target.value)
                                    }}
                                    options={optionsR}
                                    focusInputRef={field.ref}
                                    className={classNames({'p-invalid': fieldState.error}, classes.selectStyle)}
                                    placeholder="Select R"
                                >
                                </Dropdown>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                </div>
                <div className={classes.buttonContainer}>
                    <div style={{width: '50%'}}>
                        <Button
                            type='submit'
                            className={`p-button-text text-center ${classes.mainButton}`}
                            rounded
                            label="Check result">
                        </Button>
                    </div>
                    <div style={{width: '50%'}}>
                        <Button
                            type='button'
                            className={`p-button-text text-center ${classes.mainButton}`}
                            rounded
                            label="Clear"
                        onClick={onDelete}>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CoordinatesForm;