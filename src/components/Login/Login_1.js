import React, { useState, useEffect, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import * as AuthService from '../../service/AuthService';

const Login = () => {    
    const [model, setModel] = useState([]) 
    const [remember, setRemember] = useState(false);
    const toast = useRef(null);

    let data = {
        username: '',
        password: '',
        remember_me: false
    }

    useEffect(() => {
        setModel(data);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFormSubmit = async(event) => {
        event.preventDefault();

        console.log(model.remember_me);

        const response = await AuthService.doUserLogin(model);
        
        if (response.status === true) {      
            AuthService.handleLoginSuccess(response.data, model.remember_me);            
            window.location.reload();
        } else {
            toast.current.show({ severity: 'error', summary: 'Errors', detail: response, life: 3000 });
        }
    }

    const onInputChange = (e) => {        
        e.preventDefault();
        const title = e.target.id;
        const val = (e.target && e.target.value) || '';
        let _model = { ...model };
        _model[`${title}`] = val;

        setModel(_model);
    }

    const onSwitchChange = (e) => {        
        e.preventDefault();
        const title = e.target.id;
        const val = (e.target && e.target.value) || '';
        let _model = { ...model };
        _model[`${title}`] = val;

        setModel(_model);
    }

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className='col-4'>
                    <div className="card">
                        <h3 className="text-center">Login</h3>
                        <Toast ref={toast} />

                        <form onSubmit={event => handleFormSubmit(event)} className="p-fluid">
                            <div className="field mt-5">
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-user"></i>
                                    </span>
                                    <span className="p-float-label">
                                        <InputText id="username" type="text" onChange={(e) => onInputChange(e)}/>
                                        <label htmlFor="inputgroup">Username</label>
                                    </span>
                                </div>
                            </div>
                            <div className="field mt-5">
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-key"></i>
                                    </span>
                                    <span className="p-float-label">
                                        <InputText id="password" type="password" onChange={(e) => onInputChange(e)} />
                                        <label htmlFor="inputgroup">Password</label>
                                    </span>
                                </div>
                            </div>
                            <div className="field-checkbox">
                                <InputSwitch id="remember_me" checked={remember} onChange={(e) => { setRemember(e.value); onSwitchChange(e) }} />
                                <label htmlFor="remember_me">Remember Me</label>
                            </div>
                            <Button type="submit" label="Login" className="mt-2" />
                            <Button label="Forget Password" className="p-button-text mr-2 mt-2" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);