import React from 'react';
import classes from "../styles/header.module.css"

const Header = () => {

    return (
        <div className={classes.header}>
            <div className={classes.centered}>
                <h2>Лабораторная №4 Ефимов Арслан P3232</h2>
            </div>
        </div>
    );
};

export default Header;