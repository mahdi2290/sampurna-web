import styled from "styled-components";
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import * as AuthService from "../../service/AuthService";
import PostPutValidationComp from "../standard/Validation/PostPutValidationComp";
import { Dialog } from "primereact/dialog";
import DataTableComp from "../standard/DataTable/DataTableComp";
import { APIPoolWithToken } from "../api/APIMaster";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
    const toast = useRef();
    const token = useRef();
    const data = useRef();
    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [isVisibleDialog, setIsVisibleDialog] = useState(false);
    const [models, setModels] = useState([]);
    const [radioSelect, setRadioSelect] = useState(1);
    const history = useHistory();
    const [background, setBackground] = useState("");

    const onSubmited = async (values, actions) => {
        const form = new FormData();
        const email = values.email;
        const password = values.password;

        form.append("email", email);
        form.append("password", password);

        const result = await AuthService.doUserLogin(form);

        if (result.status === 200) {
            token.current = result.data.token;

            data.current = result.data;

            setWaiting(true);

            getPool();
            setIsVisibleDialog(true);

            setWaiting(false);
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401 || result.status === 403) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        } else if (result.status === 402) {
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setErrorVisible(true);
            setErrorMessage(result.message);
        }
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: onSubmited,
    });

    const getPool = async (page, rows, keyword) => {
        const res = await APIPoolWithToken(token.current, keyword);

        setModels(res);

        return res;
    };

    const hideDialog = () => {
        setIsVisibleDialog(false);
    };

    const clickOK = () => {
        AuthService.handleLoginSuccess(data.current, radioSelect);

        history.push("/");
    };

    const dialogFooter = (
        <>
            <Button label="Ok" icon="pi pi-check" className="p-button-text p-button-sm" onClick={clickOK} />
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
        </>
    );

    const columnsTable = [
        { field: "name", header: "Pool", sortable: false, style: "fix", width: { width: "262px" }, widthClass: "text-right" },
        { field: "action", header: "Action" },
    ];

    // useEffect(() => {
    //     if (refresh) {
    //         const rand =  Math.floor(Math.random() * (max - min + 1)) + min;
    //         console.log(formatDateTimeString(new Date()), rand.toString())
    //         background = "background-" + rand.toString();
    //         setRefresh(false);
    //     }
    //     return () => clearTimeout(timer);
    // }, [refresh]);

    // let timer = setTimeout(() => setRefresh(true), delay * 1000);

    useEffect(() => {
        const min = 1;
        const max = 5;
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        setBackground("background-" + rand.toString());
    }, [background]);

    return (
        <>
            <div className={background}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <MainContainer>
                        <WelcomeText>Welcome</WelcomeText>
                        <SampurnaGroupText>Sampurna Group</SampurnaGroupText>
                        <InputContainer>
                            <InputText
                                id="email"
                                type="text"
                                placeholder="Email address"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.email && touched.email ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"}
                                style={{ padding: "1rem" }}
                            />
                            <div className="mb-3">
                                {errors.email && touched.email && (
                                    <small id="email-help" className="p-error">
                                        {errors.email}
                                    </small>
                                )}
                            </div>

                            <InputText
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.password && touched.password ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"}
                                style={{ padding: "1rem" }}
                            />
                            <div className="mb-3">
                                {errors.password && touched.password && (
                                    <small id="password-help" className="p-error">
                                        {errors.password}
                                    </small>
                                )}
                            </div>
                        </InputContainer>
                        <ButtonContainer>
                            <Button type="submit" label="Sign In" className="w-full p-3 text-5xl" style={{ backgroundColor: "#03217b", borderColor: "#03217b" }}></Button>
                        </ButtonContainer>
                        <HorizontalRule />
                        <ForgotPassword>Forgot Password?</ForgotPassword>
                    </MainContainer>
                </form>
                <Toast ref={toast} />
                <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} />

                <Dialog visible={isVisibleDialog} style={{ width: "350px" }} header="Pool" modal className="p-fluid" footer={dialogFooter} resizable={false} onHide={hideDialog}>
                    <DataTableComp tableType="list" api={true} toolbar={false} title="Pool" search={true} paginator={false} models={models} columnsTable={columnsTable} stripedRows={true} GetAll={getPool} actionStatus="radio" radioSelect={radioSelect} setRadioSelect={(e) => setRadioSelect(e)} />
                </Dialog>
            </div>
        </>
    );
};
const MainContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 80vh;
    width: 30vw;
    max-width: 500px;
    background: rgba(209, 209, 209, 0.42);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);
    border-radius: 10px;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.3rem;
    padding: 1rem;

    @media only screen and (max-width: 320px) {
        width: 100%;
        height: 150%;
        hr {
            margin-bottom: 0.3rem;
        }
        h4 {
            font-size: medium;
        }
        margin-left: 10px;
    }
    @media only screen and (min-width: 360px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120%;
        height: 100%;
        h4 {
            font-size: medium;
        }
        margin-left: 8px;
    }
    @media only screen and (min-width: 411px) {
        width: 120%;
        height: 150%;
        margin-left: 20px;
    }

    @media only screen and (min-width: 768px) {
        height: 50vh;
        width: 100%;
        margin-left: 100px;
        margin-right: auto;
    }

    @media only screen and (min-width: 1024px) {
        height: 50%;
        width: 120%;
    }
`;

const WelcomeText = styled.h1`
    margin: 3rem 0 0rem 0;
    font-size: 4rem;
    font-weight: bold;

    @media only screen and (max-width: 768px) {
        font-size: 3rem;
    }
`;

const SampurnaGroupText = styled.h2`
    margin: 1rem 0 2rem 0;
    letter-spacing: 0.1rem;
    color: #000000;
    font-size: 3rem;

    @media only screen and (max-width: 768px) {
        font-size: 2rem;
    }
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 25%;
    width: 100%;
`;

const InputTextStyle = styled.input`
    font-size: 2rem;
    width: 100%;
    margin-bottom: 1rem;
    padding: 1rem;

    &.p-invalid {
        border-color: #f44336;
        background-color: #f2dede;
        color: #a94442;
    }
`;

const ButtonContainer = styled.div`
    margin: 1rem 0 1rem 0;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const ButtonStyle = styled.button`
    width: 100%;
    padding: 1rem;
    font-size: 2.5rem;
    background-color: #03217b;
    border-color: #03217b;
    color: #ffffff;
`;

const HorizontalRule = styled.hr`
    width: 80%;
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const ForgotPassword = styled.a`
    font-size: 2rem;
    color: #000000;
    text-align: center;
    margin-top: 1rem;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);
