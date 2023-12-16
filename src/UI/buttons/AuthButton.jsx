import React from 'react';
import {Button} from "primereact/button";
import classes from "../styles/Form.module.css";

const AuthButton = ({children}) => {
    return (
        <Button
            type='submit'
            className={classes.authButton}
            rounded>
            {children}
        </Button>
    );
};

export default AuthButton;