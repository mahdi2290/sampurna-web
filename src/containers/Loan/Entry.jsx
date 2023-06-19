import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { useHistory, useParams } from 'react-router-dom';

import MenubarComp from '../../components/standard/Menu/MenubarComp';
import InputTextComp from '../../components/standard/Form/InputTextComp';
import AutoCompleteComp from '../../components/standard/Form/AutoCompleteComp';
import DatePickerComp from '../../components/standard/Form/DatePickerComp';
import DropDownComp from '../../components/standard/Form/DropDownComp';
import LoanDetail from "./Detail";

import { formatDateString } from '../../helpers/FormatHelpers';
import { GlobalConsumer } from '../../config/Context';

import * as HeaderService from '../../service/Employee/LoanService';
import * as DetailService from '../../service/Employee/LoanDetailService';
import { APICashierTypeLoan, APICompany } from '../../components/api/APIMaster';
import PostPutValidationComp from '../../components/standard/Validation/PostPutValidationComp';

const LoanEntry = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef();

    const [changeStatus, setChangeStatus] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [errorList, setErrorList] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [storePost, setStorePost] = useState([]);
    const [storePut, setStorePut] = useState([]);
    const [storeDelete, setStoreDelete] = useState([]);

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [kasbonData, setKasbonData] = useState([]);
    const [kasbonSelect, setKasbonSelect] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [transactionSelect, setTransactionSelect] = useState(null);

    let emptyModel = {
        id: 0,
        company_id: { id: 0 },
        reference_no: "",
        issue_date: formatDateString(new Date()),
        transaction: "",
        cashier_type_id: { id: 0 },
        coa_id: 0
    }

    let emptyDetailModel = {
        id: 0,
        document_no: "",
        employee_id: { id: 0 },
        amount: 0,
        memo: ""
    };

    const transactionList = [
        { name: "In" },
        { name: "Out" },
    ];

    const getCompany = async (keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

    const getCashierType = async(keyword) => {
        const res = await APICashierTypeLoan(keyword);

        setKasbonData(null);

        return res;
    }

    const pushDataDetail = async(data_id) => {
        let error = parseInt(0);

        for (let index = 0; index < storePost.length; index++) {
            const row = storePost[index];
            let status = false;

            const form = new FormData();
            Object.keys(row).map(key => {
                if (row[key].hasOwnProperty('id')) {
                    form.append(key, row[key].id);
                } else {
                    form.append(key, row[key]);
                }

                return form;
            });
            form.append('reference_id', data_id);
            form.append('laka_id', 0);

            let result = await DetailService.PostData(form);

            if (result.status === 200) {
                props.dispatch({ type: "error-false" });
            } else if (result.status === 400) {
                status = props.dispatch({ type: "error-true" });
                setErrorList(row.id);

                result.message.map((det) => {
                    const field = det.field;
                    const value = det.message;

                    const pesan = field + " " + value;

                    toast.current.show({ severity: "error", summary: "Error!!!", detail: pesan, life: 3000 });
                    return det;
                });
            } else if (result.status === 401) {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
                status = true;
            }

            if (status === true) {
                error = error + 1;
            }
        }

        for (let index = 0; index < storePut.length; index++) {
            const row = storePut[index];
            let status = false;

            const form = new FormData();
            Object.keys(row).map(key => {
                if (row[key].hasOwnProperty('id')) {
                    form.append(key, row[key].id);
                } else {
                    form.append(key, row[key]);
                }

                return form;
            });
            form.append('reference_id', data_id);
            form.append('laka_id', 0);

            let result = await DetailService.PutData(row.id, form);

            if (result.status === 200) {
                props.dispatch({ type: "error-false" });
            } else if (result.status === 400) {
                status = props.dispatch({ type: "error-true" });
                setErrorList(row.id);

                result.message.map((det) => {
                    const field = det.field;
                    const value = det.message;

                    const pesan = field + " " + value;

                    toast.current.show({ severity: "error", summary: "Error!!!", detail: pesan, life: 3000 });
                    return det;
                });
            } else if (result.status === 401) {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
                status = true;
            } else if (result.status === 402) {
                setWaiting(false);
                setErrorVisible(true);
                setErrorMessage(result.message);
            } else {
                setWaiting(false);
                setErrorVisible(true);
                setErrorMessage(result.message);
            }

            if (status === true) {
                error = error + 1;
            }
        }

        for (let index = 0; index < storeDelete.length; index++) {
            const row = storeDelete[index];
            let detail_id = row.id.toString();

            await DetailService.DeleteData(detail_id);
        }
        return error;
    }

    const actionFinal = (count, data_id, message) => {
        if (count === 0) {
            setTimeout(() => {
                setStoreList([]);
                setStorePost([]);
                setStorePut([]);
                setStoreDelete([]);

                setWaiting(false);
                setChangeStatus(false);
                setVisible(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });

                if (statusNew === false) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/loan/edit/" + data_id,
                        state: {}
                    });
                }
            }, 1000);
        } else {
            setWaiting(false);
        }
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = null;
        let result = null;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            let valueData = "";
            if (values.hasOwnProperty(key)) {
                if (values[key] === null ) {
                    valueData = "";
                } else {
                    if (key.includes("date")) {
                        if (!statusNew) {
                            valueData = formatDateString(new Date(values[key]));
                        } else {
                            valueData = values[key];
                        }
                    } else {
                        valueData = values[key];
                    }
                }
            }

            if (key !== "id") {
                if (valueData.hasOwnProperty('id')) {
                    form.append(key, valueData.id);
                } else {
                    form.append(key, valueData);
                }
            }

            return key;
        });

        // console.log([...form])

        if (id) {
            result = await HeaderService.PutData(id, form);
        } else {
            result = await HeaderService.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id
            } else {
                data_id = result.data.id;
            }

            const errorCount = await pushDataDetail(data_id);

            actionFinal(errorCount, data_id, result.message);
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
            setWaiting(false);
        } else if (result.status === 401) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
            setWaiting(false);
        }
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const findIndexList = (id) => {
        let index = -1;
        for (let i = 0; i < storeList.length; i++) {
            if (storeList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexPost = (id) => {
        let index = -1;
        for (let i = 0; i < storePost.length; i++) {
            if (storePost[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexError = (id) => {
        let index = -1;
        for (let i = 0; i < errorList.length; i++) {
            if (errorList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onSetModels = (method, data) => {
        let index;
        switch (method) {
            case "C":
                setStorePost(prevState => [...prevState, data]);
                break;
            case "U":
                if (!isNaN(data.id)) {
                    let _before = [...storeList];
                    index = findIndexList(data.id);

                    _before[index] = data;
                    setStorePut(prevState => [...prevState, data]);
                } else {
                    let _before = [...storePost];
                    index = findIndexPost(data.id);

                    if (index >= 0) {
                        _before[index] = data

                        setStorePost(_before);
                    }
                }

                break;
            case "D":
                if (!isNaN(data.id)) {
                    setStoreDelete(prevState => [...prevState, data]);
                }

                if (storePost) {
                    let _post = storePost.filter(val => val.id !== data.id);
                    setStorePost(_post);
                }

                if (storePut) {
                    let _put = storePut.filter(val => val.id !== data.id);
                    setStorePut(_put);
                }

                break;
            default:
                break;
        }
    }

    const rowClassNameTemplate = (data) => {
        return {
            'd-error': findIndexError(data.id) > -1
        }
    }

    const backURL = () => {
        return history.push({
            pathname: "/loan/list",
        });
    }

    const backDialog = () => {
        if (changeStatus === false) {
            backURL();
        } else {
            setVisible(true);
        }
    };

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "save":
                handleSubmit();
                break;

            case "new":
                if (statusNew) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/loan/create",
                    });
                }
                window.location.reload();
                break;
            default:
                break;
        }
    }

    const QueryData = async () => {
        setTransactionData(transactionList);

        if (id) {
            const res = await HeaderService.GetByID(id);

            if (res.status === 200) {
                const querydata = res.data;

                setValues(querydata);

                if (querydata.lists !== null) {
                    setStoreList(querydata.lists);
                }

                setCompanySelect(querydata.company_id);
                setKasbonSelect(querydata.cashier_type_id);
                setTransactionSelect(querydata.transaction);

                setStatusNew(false);
            } else {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data tidak ditemukan", life: 3000 });
            }
        } else {
            setValues(emptyModel);

            setCompanySelect(null);
            setKasbonSelect(null);
            setTransactionSelect(transactionList[0].name);

            setChangeStatus(false);
            setStatusNew(true);
        }

        setCompanyData(null);
        setKasbonData(null);
    }

    useEffect(() => {
        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>

            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>

                    <div className="col-12">
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-4">
                                <Panel header="Kasbon" className="h-full">
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">
                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="company_id" title="Grup Perusahaan" showField="name" errors={errors} touched={touched} models={companyData}
                                                queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => setCompanySelect(e)} onChange={(e) => { setCompanySelect(e.value); values.company_id = e.value.id; }} />
                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="reference_no" title="Bukti Kasbon" disabled={true} value={values.reference_no} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            <DatePickerComp className="field col-12 md:col-6" validate={true} field="issue_date" title="Tgl Kasbon" value={values.issue_date} onChange={(e) => { values.issue_date = e.target.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            <DropDownComp className="field col-12 md:col-12" validate={true} field="transaction" title="Transaksi" optionLabel="name" optionValue="name" options={transactionData} value={transactionSelect} errors={errors} touched={touched} onBlur={handleBlur}
                                                onChange={(e) => { setTransactionSelect(e.value); values.transaction = e.value; setChangeStatus(true) }} />
                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="cashier_type_id" title="Jenis Kasbon" showField="name" errors={errors} touched={touched} models={kasbonData}
                                                queryData={(e) => getCashierType(e)} value={kasbonSelect} setSelectValue={(e) => setKasbonSelect(e)} onChange={(e) => { setKasbonSelect(e.value); values.cashier_type_id = e.value.id; setChangeStatus(true) }} />
                                        </div>
                                    </form>
                                </Panel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-8">
                                <Panel header="Detail" className="h-full">
                                    <LoanDetail id={id} models={storeList} setModels={onSetModels} empty={emptyDetailModel} rowClassName={(e) => rowClassNameTemplate(e)} setChangeStatus={() => setChangeStatus(true)} toast={toast} />
                                </Panel>
                            </div>
                        </div>
                    </div>

                    <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
                </div>
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(LoanEntry), comparisonFn);
