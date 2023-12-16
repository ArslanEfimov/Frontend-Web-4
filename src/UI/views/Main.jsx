import React, {useEffect, useRef, useState} from 'react';
import Header from "./Header";
import classes from "../styles/Main.module.css"
import {toast, ToastContainer} from 'react-toastify';
import CoordinatesForm from "../forms/CoordinatesForm";
import Desmos from 'desmos';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import 'primeflex/primeflex.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {request} from "../../actions/request";

const Main = () => {
    const [r, setR] = useState(null);
    const calculatorRef = useRef(null);
    const [tableResults, setResults] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get("http://localhost:8080/web-programming4/api/main/getDots", {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache',
            }
        }).then(response =>{
            if(response.data.length!=0) {
                response.data.forEach(result =>{
                    if(result.result){
                        result.result = "Попал"
                    }else{
                        result.result = "Промах"
                    }
                })
                setResults(response.data)
            }
        })
            .catch(error=>{
                if(error.response.status === 401){
                    navigate("/auth")
                }
            })
    }, []);

    useEffect(() => {
        const elt = document.getElementById('calculator');
        const calculator = Desmos.GraphingCalculator(elt, {
            keypad: false,
            expressions: false,
            settingsMenu: false,
            invertedColors: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y',
            xAxisStep: 1,
            yAxisStep: 1,
            lockViewport: true,
            xAxisArrowMode: Desmos.AxisArrowModes.POSITIVE,
            yAxisArrowMode: Desmos.AxisArrowModes.POSITIVE,
        });

        calculator.setMathBounds({
            left: -5,
            right: 5,
            bottom: -5,
            top: 5
        });
        calculatorRef.current = calculator;
        function drawGraph() {
            calculatorRef.current.setExpression({
                id: '1',
                latex: 'y\\ \\le\\ ' + r + '\\ +x\\ \\left\\{' + -r + '\\le x\\le0\\ \\left\\{0\\le y\\le ' + r + '\\right\\}\\right\\}',
                color: '#1ea2a8',

            });
            calculatorRef.current.setExpression({
                id: '2',
                latex: 'x\\le ' + r + '\\left\\{-\\frac{' + r + '}{2}\\le y\\le0\\left\\{0\\le x\\right\\}\\right\\}',
                color: '#1ea2a8',
            });

            calculatorRef.current.setExpression({
                id: '3',
                latex: '\\sqrt{\\left(\\frac{' + r + '}{2}\\right)^{2}-x^{2}}\\ \\ge-y\\ \\left\\{' + -r + '\\le x\\le0\\left\\{y\\le0\\right\\}\\right\\}',
                color: '#1ea2a8',
            });

        }
        function drawDots(x, y, color) {
            if (x !== null && y !== null) {
                calculatorRef.current.setExpression({
                    id: x + '' + y,
                    color: color,
                    latex: '\\left(' + x + ',' + y + '\\right)',
                })
            }
        }
        function calculateCordinatesByGraphClick(e) {
            const calc = elt.getBoundingClientRect();
            const x = e.clientX - calc.left;
            const y = e.clientY - calc.top;
            const mathCoordinate = calculatorRef.current.pixelsToMath({x: x, y: y});
            return mathCoordinate;
        }

            tableResults.forEach(value => {
                if (value.result) {
                    drawDots(value.x, value.y, '#910fe7')
                } else {
                    drawDots(value.x, value.y, '#1ea2a8')
                }
            })

        function renderAllDots(){

            tableResults.forEach(value => {
                if(r<=0){
                    drawDots(value.x, value.y, '#1ea2a8')
                }
                else {
                    if (checkAreaResult(value.x, value.y, r)) {
                        drawDots(value.x, value.y, '#910fe7')
                    } else {
                        drawDots(value.x, value.y, '#1ea2a8')
                    }
                }
            })

        }

        function checkR(){
            if(r===null){
                toast.error("Выберете значение R")
                return false;
            }
            if(r<=0){
                toast.error("Радиус должен быть положительным")
                return false;
            }
            return true;
        }


        renderAllDots();

        function handleGraphClick(e){
            const mathCoordinate = calculateCordinatesByGraphClick(e)
            const x = mathCoordinate.x;
            const y = mathCoordinate.y
            const dots = {x, y, r}
            if(checkR()) {
                axios.post("http://localhost:8080/web-programming4/api/main/addDot", dots, {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache',
                    }
                }).then(async response => {
                    const newResult = {
                        x: response.data.x,
                        y: response.data.y,
                        r: response.data.r,
                        currentTime: response.data.currentTime,
                        executionTime: response.data.executionTime,
                        result: response.data.result ? "Попал" : "Промах"
                    }
                    setResults(tableResults => [...tableResults, newResult])
                }).catch(error => {
                    if (error.response.status === 401) {
                        navigate("/auth")
                    }
                    if(error.response.status === 400){
                        toast.error("Значение не валидны или выходят за пределы")
                    }
                })
            }

        }
        if(r>=0) {
            drawGraph()
        }

        elt.addEventListener("click", handleGraphClick)
        // Очистка ресурсов, когда компонент размонтируется
        return () => {
            calculatorRef.current.destroy();
            elt.removeEventListener('click', handleGraphClick); //после размонтирования удаляем слушатель
        };
    }, [r, tableResults]); // Пустой массив зависимостей означает, что эффект будет выполнен только при монтировании/размонтировании компонента

    function handleLogout(){
        if(window.confirm("Вы уверены, что хотите выйти?")) {
            axios.post("http://localhost:8080/web-programming4/api/auth/logout", {}, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache',
                }
            })
                .then(response => {
                    dispatch(request(response.data))
                    navigate("/auth")
                })
                .catch(error => {
                    if(error.response.status === 401){
                        navigate("/main")
                    }
                })
        }
    }
    function checkAreaResult(x, y, r){
        return checkTriangle(x, y, r) || checkSquare(x, y, r) || checkCircle(x, y, r)
    }
    function checkSquare(x, y, r){
        return ( (x>=0 && y<=0) && (x<=r) && (y>=(-r/2)) );
    }

    function checkTriangle(x, y, r){
        return ((x<=0 && y>=0) && r>=Math.abs(x) + Math.abs(y));
    }

    function checkCircle(x, y, r){
        return ((x<=0 && y<=0) && (Math.pow(x,2) + Math.pow(y, 2) <= Math.pow(r/2, 2)));
    }

    return (
        <div className={classes.mainContainer}>
            <div className={classes.headContainer}>
                <Header/>
                <div className={classes.logOut}>
                   <span><h3 onClick={handleLogout}>Logout</h3></span>
                </div>
            </div>
            <div className={classes.middleContainer}>
                <div className={classes.graphContainer} id = "image-graph">
                      <div id="calculator" style={{height: "24.5em"}}></div>

                </div>
                <div className={classes.formContainer}>
                    <div>
                        <h2>Enter Values</h2>
                    </div>
                    <CoordinatesForm setRValue={setR} setResults = {setResults} tableResults = {tableResults}/>
                </div>
                <div className={classes.tableContainer}>
                    <DataTable paginator rows={2} rowsPerPageOptions={[2, 3]}
                               tableStyle={{minWidth: '20%'}} className={classes.resultTable}
                        value={tableResults}>
                        <Column field="x" header="X" style={{width: '25%'}}></Column>
                        <Column  field="y" header="Y" style={{width: '25%'}}></Column>
                        <Column  field="r" header="R" style={{width: '25%'}}></Column>
                        <Column  field="currentTime" header="CurrentTime" style={{width: '25%'}}></Column>
                        <Column   field="executionTime" header="ExecutionTime" style={{width: '25%'}}></Column>
                        <Column  field="result" header="Result" body={(rowData) => (
                            <span style={{ color: rowData.result === "Попал" ? "green" : "red" }}>
                                {rowData.result}
                            </span>
                        )}style={{width: '25%'}}>

                        </Column>
                    </DataTable>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};
export default Main;