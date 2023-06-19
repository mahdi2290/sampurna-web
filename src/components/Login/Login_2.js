import React, { useRef, useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import * as AuthService from '../../service/AuthService';
import axios, { axiosPrivate } from './../../api/axios';
// import useAuth from './../../hooks/useAuth';
import useRefreshToken from './../../hooks/useRefreshToken';
import { Dialog } from 'primereact/dialog';
import DataTableComp from '../standard/DataTable/DataTableComp';
import { APIPoolWithToken } from '../api/APIMaster';
// import * as CookieConfig from './../../config/CookieConfig';

const Login = () => {
    // const { setAuth } = useAuth();

    const refresh = useRefreshToken();
    const toast = useRef();
    const token = useRef();
    const data = useRef();
    // const [waiting, setWaiting] = useState(false);
    // const [visible, setVisible] = useState(false);
    // const [errorVisible, setErrorVisible] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [isVisibleDialog, setIsVisibleDialog] = useState(false);
    const [models, setModels] = useState([]);
    const [radioSelect, setRadioSelect] = useState(1);

    const onSubmited = async (values, actions) => {
        const form = new FormData();
        const email = values.email;
        const password = values.password;

        form.append('email', email);
        form.append('password', password);

        try {
            const response = await axios.post('v2/users/login',
                form,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            // CookieConfig.set("beegoSessionIDDDD", response.data.sessionID);
            console.log(JSON.stringify(response?.data));
            // const accessToken = response?.data?.data.token;
            // console.log(accessToken)
            // setAuth({ email, password, accessToken });
        } catch (err) {
            console.log("err", err);
        }
    }

    const getData = async() => {
        const res = await axiosPrivate.get("v1/product")

        console.log(res);
    }

    const handleLogin = (model) => {
        AuthService.handleLoginSuccess(data.current, model);

        window.location.reload();
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: "firman@sampurna-group.com",
            password: "123456789",
        },
        onSubmit: onSubmited,
    })

    const getPool = async (page, rows, keyword) => {
        const res = await APIPoolWithToken(token.current, keyword);

        setModels(res);

        return res;
    }

    const hideDialog = () => {
        setIsVisibleDialog(false);
    }

    const clickOK = () => {
        AuthService.handleLoginSuccess(data.current, radioSelect);

        window.location.reload();
    }

    const dialogFooter = (
        <>
            <Button label="Ok" icon="pi pi-check" className="p-button-text p-button-sm" onClick={clickOK} />
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
        </>
    );

    const columnsTable = [
        { field: 'name', header: 'Pool', sortable: false, style: "fix", width: { width: "262px" }, widthClass: "text-right" },
        { field: 'action', header: 'Action' },
    ];

    const onKeyDownSearch = async () => {
        if (models) {
            if (models.length > 0) {
                handleLogin(models[0]);
                setIsVisibleDialog(false);
            }
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <div className='flex align-items-center justify-content-center overflow-hidden mt-5'>
                <div className="flex flex-column align-items-center justify-content-center">
                    <img src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"} alt="SG logo" className="w-30rem flex-shrink-0" />
                    <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, #DB9600 10%, rgba(0, 0, 0, 0) 40%)' }}>
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">Welcome, <b>Sampurna Group</b></div>
                                <span className="text-500 text-2xl">Sign in to continue</span>
                            </div>
                            <form onSubmit={handleSubmit} autoComplete='off'>
                                <div>
                                    <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                        Email
                                    </label>
                                    <InputText id="email" type="text" placeholder="Email address" value={values.email} onChange={handleChange} onBlur={handleBlur} className={errors.email && touched.email ? "w-full md:w-30rem mb-1 p-invalid" : "w-full md:w-30rem mb-3"} style={{ padding: '1rem' }} />
                                    <div className='mb-3'>{errors.email && touched.email && <small id="email-help" className="p-error">{errors.email}</small>}</div>

                                    <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                        Password
                                    </label>
                                    <InputText id="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} className={errors.password && touched.password ? "w-full md:w-30rem mb-1 p-invalid" : "w-full md:w-30rem mb-3"} style={{ padding: '1rem' }} />
                                    <div className='mb-3'>{errors.password && touched.password && <small id="password-help" className="p-error">{errors.password}</small>}</div>

                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme1">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <Button type='submit' label="Sign In" className="w-full p-3 text-xl" style={{backgroundColor: "#DB9600", borderColor: "#DB9600"}}></Button>
                                    <Button type='button' onClick={() => refresh()} label="Refresh Token" className="w-full p-3 text-xl mt-3"></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog visible={isVisibleDialog} style={{ width: '350px' }} header="Pool" modal className="p-fluid" footer={dialogFooter} resizable={false} onHide={hideDialog}>
                <DataTableComp tableType="list" api={true} toolbar={false} title="Pool" search={true} paginator={false} onKeyDownSearch={onKeyDownSearch}
                    models={models} columnsTable={columnsTable} stripedRows={true} GetAll={getPool} actionStatus="radio" radioSelect={radioSelect} setRadioSelect={(e) => setRadioSelect(e)}
                />
            </Dialog>
        </>
    )
}
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);
