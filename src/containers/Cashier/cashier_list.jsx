import React, { Fragment, useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { APICompany, APIPool } from "../../components/api/APIMaster";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import { Toast } from "primereact/toast";
import * as HeaderService from '../../service/Bank/CashierService';
import * as EmployeeService from "../../service/Employee/EmployeeService";
import * as PoolService from '../../service/Master/PoolService';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { formatCurrency, formatDateString, formatDateTimeString } from "../../helpers/FormatHelpers";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import { Image } from "primereact/image";
import DataViewComp from "../../components/standard/Dataview/DataViewComp";
import EditButtonComp from "../../components/standard/Button/EditButtonComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import * as CookieConfig from './../../config/CookieConfig';
import asm from './../../assets/images/asm.png';
import sms from './../../assets/images/sms.png';
import nca from './../../assets/images/nca.png';

const CashierList = () => {
    const [refresh, setRefresh] = useState(false);
    const toast = useRef();
    const rows = useRef(9);
    const currentDate = useRef();
    const [models, setModels] = useState([]);
    const [model, setModel] = useState({reference_no:""});
    const [totalRecords, setTotalRecords] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isVisibleDialog, setIsVisibleDialog] = useState(false);
    const [companyData, setCompanyData] = useState([]);
    const [companyValue, setCompanyValue] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const logo = useRef();
    const account_no = useRef();
    const company_name = useRef();
    const page = useRef(1);
    const [totalPage, setTotalPage] = useState(0);

    const [poolData, setPoolData] = useState([]);
    const [poolSelect, setPoolSelect] = useState([]);
    const [counterSelect, setCounterSelect] = useState(null);
    const [shiftSelect, setShiftSelect] = useState(null);

    const delay = 5;

    let emptyModel = {
        employee_id: 0,
        order_id: 0,
        issue_date: formatDateString(new Date()),
        counter: "A",
        shift: 1,
        pool_id: { id:CookieConfig.get('pool_id'), name: '' },
        ujt: 0,
        ujt_var: 0,
        bonus_claim: 0,
        ujt_void: 0,
        sub_total: 0,
        loan: 0,
        total: 0,
    }

    const shiftData = [
        { name: 1 },
        { name: 2 },
        { name: 3 }
    ];

    const counterData = [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" }
    ];

    const getCompany = async() => {
        const res = await APICompany("");

        setCompanyData(res);
    }

    const getPool = async(keyword) => {
        const res = await APIPool(keyword);

        setPoolData(res);

        return res;
    }

    const getRekening = async(id) => {
        const res = await EmployeeService.GetByID(id);

        account_no.current = ""
        if (res.status === 200) {
            account_no.current = res.data.bank_no + " - " + res.data.bank_account_name;
        }
    }

    const QueryData = async() => {
        const params = { page: page.current, pagesize: rows.current, keyword: globalFilter };

        const res = await HeaderService.GetAll(companyValue, params);

        if (res.status === 200) {
            if (res.data.list) {
                const data = res.data.list;
                setModels(data);
                setTotalRecords(res.data.total);
                setTotalPage(res.data.page);
            }
        } else {
            setModels([]);
            setTotalRecords(0);
            setTotalPage(0);
        }

        setRefresh(false);
    }

    const getAll = (num, value) => {
        page.current = num;
        setGlobalFilter(value);

        setRefresh(true);
    }

    const onChange = (e) => {
        setCompanyValue(e.value);
        setRefresh(true);
    }

    const actionRefresh = () => {
        if (companyValue) {
            QueryData();
        }
    }

    const getPoolID = async(id) => {
        getPool();

        const result = await PoolService.GetByID(CookieConfig.get('pool_id'));

        if (result.status === 200) {
            setPoolSelect(result.data);
        }
    }

    const actionEdit = async(data) => {
        setWaiting(true);
        setModel(data);

        getPoolID();

        currentDate.current = formatDateTimeString(new Date(await HeaderService.GetDate()));

        const companyFilter = companyData.filter(val => val.id === companyValue);

        if (companyFilter.length > 0) {
            company_name.current = companyFilter[0].name;
        }

        const company_id = companyValue;

        const company = companyData.filter(val => val.id === company_id);

        if (company.length === 1) {
            logo.current = company[0].code;
        }

        setCounterSelect(counterData[0].name);
        setShiftSelect(shiftData[0].name);
        setPoolData(null);

        getRekening(data.employee_id);

        emptyModel = {
            employee_id: data.employee_id,
            order_id: data.id,
            issue_date: currentDate.current,
            counter: "A",
            shift: 1,
            pool_id: { id:CookieConfig.get('pool_id'), name: '' },
            ujt: data.ujt,
            ujt_var: data.ujt_var,
            bonus_claim: data.bonus_claim,
            ujt_void: data.ujt_void,
            sub_total: data.sub_total,
            loan: data.loan,
            total: data.total,
        }

        setValues(emptyModel);

        setWaiting(false);
        setIsVisibleDialog(true);
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "export":
                break;

            case "refresh":
                actionRefresh();
                break;

            case "save":
                // actionSave();
                break;

            default:
                break;
        }
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = new FormData();

        Object.keys(emptyModel).map(key => {
            if (emptyModel[key].hasOwnProperty('id')) {
                form.append(key, values[key]["id"]);
            } else {
                form.append(key, values[key]);
            }
            return form;
        });

        const result = await HeaderService.PostData(form);
        if (result.status === 200) {
            QueryData();
            setRefresh(true);
            toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });
            setIsVisibleDialog(false);
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });

            setWaiting(false);
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401) {
            setWaiting(false);
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        } else if (result.status === 402) {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }

        setWaiting(false);
    }

    const { values, errors, touched, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited
    });

    const hideDialog = () => {
        setIsVisibleDialog(false);
    }

    const dialogFooter = (
        <>
            <Button label="Save" icon="pi pi-check" className="p-button-text p-button-sm" onClick={handleSubmit} />
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
        </>
    );

    useEffect(() => {
        getCompany();
        setRefresh(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const getData = async() => {
            const params = { page: page.current, pagesize: rows.current, keyword: globalFilter };

            const res = await HeaderService.GetAll(companyValue, params);

            if (res.status === 200) {
                if (res.data.list) {
                    console.log(formatDateTimeString(new Date()), res.data.list)
                    const data = res.data.list;

                    setModels(data);
                    setTotalRecords(res.data.total);
                    setTotalPage(res.data.page);
                }
            } else {
                if (page.current > 1) {
                    page.current = 1;
                }

                setModels([]);
                setTotalRecords(0);
                setTotalPage(0);
            }
            setRefresh(false);
        }

        if (companyValue && refresh) {
            getData();
        }
        return () => clearTimeout(timer);
    }, [companyValue, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

    let timer = setTimeout(() => setRefresh(true), delay * 1000);

    const changePrice = (laka) => {
        values.loan = laka;

        // values.sub_total = values.ujt + values.ujt_var + values.ujt_void + values.bonus_claim + laka;
        values.total = values.ujt + values.ujt_var + values.ujt_void + values.bonus_claim + laka;
    }

    const renderListItem = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column align-items-center p-3 w-full md:flex-row">
                    <div className="md:w-20rem">
                        <div className="text-1xl font-semibold mb-2">{data.reference_no}</div>
                        <div className="text-1xl font-semibold mb-2">{data.issue_date === "" ? "\u00a0" : data.issue_date}</div>
                        <div className="text-1xl font-semibold">{data.employee_name}</div>
                    </div>
                    <div className="flex flex-column justify-content-center align-items-center md:flex-1">
                        <EditButtonComp label="" onClick={() => actionEdit(data)} />
                        <div className="text-1xl font-bold mt-2 mb-2">UJT {formatCurrency(data.ujt, 0)}</div>
                        <div className="text-1xl font-bold mb-2">Sub Total {formatCurrency(data.sub_total, 0)}</div>
                        <div className="text-3xl font-bold">Total {formatCurrency(data.total, 0)}</div>
                    </div>
                    <div className="flex flex-column justify-content-between align-items-center md:w-auto w-full">
                        <div className="text-1xl mb-2">UJT Var {formatCurrency(data.ujt_var, 0)}</div>
                        <div className="text-1xl mb-2">Loan {formatCurrency(data.loan, 0)}</div>
                        <div className="text-1xl mb-2">Bonus / Klaim {formatCurrency(data.bonus_claim, 0)}</div>
                        <div className="text-1xl">UJT Void {formatCurrency(data.ujt_void, 0)}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItem = (data) => {
        return (
            <div className="col-12 md:col-4 my-2">
                <div className="m-2 border-1 surface-border card h-full">
                    <div className="text-center mt-2">
                        <EditButtonComp label="" onClick={() => actionEdit(data)} />
                        <div className="text-2xl font-semibold vertical-align-middle mt-2 mb-2">{data.reference_no}</div>
                        <div className="text-2xl font-semibold vertical-align-middle mb-2">{data.issue_date === "" ? "\u00a0" : data.issue_date}</div>
                        <div className="text-2xl font-bold mb-5">{data.employee_name}</div>
                        <div className="text-4xl font-bold md:align-self-end">{formatCurrency(data.total, 0)}</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <MenubarComp field="toolbar-list" action="refresh" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>
                    <Toast ref={toast} />

                    <div className="col-12">
                        <div className="grid p-fluid">
                            <DropDownComp className="field col-12 md:col-6 sm:col-6" validate={false} field="company_id" title="Grup Perusahaan" optionLabel="name" optionValue="id" options={companyData} value={companyValue}
                                onChange={onChange} />
                        </div>

                        <DataViewComp title="Cashier" search={true} api={true} models={models} paginator={true} renderGridItem={renderGridItem} renderListItem={renderListItem} rows={rows.current} totalRecords={totalRecords} totalPage={totalPage} queryData={getAll} setGlobal={(e) => setGlobalFilter(e)}/>
                    </div>
                </div>
            </div>

            <Dialog visible={isVisibleDialog} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '75vw'}} header="Transfer UJT" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="text-center mb-3">
                        {
                            logo.current === 'ASM' ? <Image src={asm} alt="Logo" width="200px" height="200px"/> : ""
                        }
                        {
                            logo.current === 'SMS' ? <Image src={sms} alt="Logo" width="200px" height="200px"/> : ""
                        }
                        {
                            logo.current === 'NCA' ? <Image src={nca} alt="Logo" width="200px" height="200px"/> : ""
                        }
                        <div>
                            <h1><b>{company_name.current} </b></h1>
                            <h2><b>{model.reference_no} </b></h2>
                        </div>
                    </div>
                    <div className="grid p-fluid">
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="issue_date" title="Tgl Transfer" value={values.issue_date} disabled={true} />
                        <DropDownComp className="field col-12 md:col-2" validate={true} field="counter" title="Loket" optionLabel="name" optionValue="name" options={counterData} value={counterSelect}
                            errors={errors} touched={touched} onBlur={handleBlur} onChange={(e) => { setCounterSelect(e.value); values.counter = e.value; }} />
                        <DropDownComp className="field col-12 md:col-2" validate={true} field="shift" title="Shift" optionLabel="name" optionValue="name" options={shiftData} value={shiftSelect} errors={errors} touched={touched}
                            onBlur={handleBlur} onChange={(e) => { setShiftSelect(e.value); values.shift = e.value; }} />
                        <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} disabled={true} field="pool_id" title="Pool" showField="name" errors={errors} touched={touched} models={poolData}
                            queryData={(e) => getPool(e)} value={poolSelect} setSelectValue={(e) => setPoolSelect(e)} onChange={(e) => { setPoolSelect(e.value); values.pool_id.id = e.value.id; }} />
                        <InputNumberComp disabled={true} className="field col-12 md:col-2" field="ujt" title="UJT" value={values.ujt} onChange={(e) => values.ujt = e.value } onBlur={handleBlur}/>
                        <InputNumberComp disabled={true} className="field col-12 md:col-2" field="ujt_var" title="UJT Var" value={values.ujt_var} onChange={(e) => values.ujt_var = e.value } onBlur={handleBlur}/>
                        <InputNumberComp disabled={true} className="field col-12 md:col-2" field="bonus_claim" title="Bonus" value={values.bonus_claim} onChange={(e) => values.bonus_claim = e.value } onBlur={handleBlur}/>
                        <InputNumberComp disabled={true} className="field col-12 md:col-2" field="ujt_void" title="UJT Void" value={values.ujt_void} onChange={(e) => values.ujt_void = e.value } onBlur={handleBlur}/>
                        <InputNumberComp disabled={true} className="field col-12 md:col-2" field="total" title="Total" value={values.sub_total} onChange={(e) => values.sub_total = e.value } onBlur={handleBlur}/>
                        <InputNumberComp className="field col-12 md:col-2" field="loan" title="Laka" value={values.loan} onChange={(e) => changePrice(e.value) } onBlur={handleBlur}/>
                    </div>
                    <div className="grid p-fluid">
                        <div className="col-6 text-center">
                            <label>Nomor Rekening</label>
                            <h1><b>{account_no.current}</b></h1>
                        </div>
                        <div className="col-6 text-center">
                            <label>Nilai Transfer</label>
                            <h1><b>{formatCurrency(values.total, 0)}</b></h1>
                        </div>
                    </div>
                </form>
            </Dialog>

            <PostPutValidationComp waitingDialog={waiting} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage}/>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CashierList, comparisonFn);
