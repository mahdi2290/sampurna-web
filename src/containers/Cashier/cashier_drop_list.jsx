import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import * as CrudService from '../../service/Bank/CashierDropService';
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import * as CookieConfig from './../../config/CookieConfig';
import { formatDateString } from "../../helpers/FormatHelpers";
import { APICompany } from "../../components/api/APIMaster";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";

const CashierDropList = () => {
    const toast = useRef(null);

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [model, setModel] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);

    const [visibleDialog, setVisibleDialog] = useState(false);
    const [waiting, setWaiting] = useState(false);

    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [shiftSelect, setShiftSelect] = useState(null);

    let emptyModel = {
        id: 0,
        issue_date: formatDateString(new Date()),
        company_id: {id: 0},
        shift: 1,
        account_id: 0,
        account_code: "",
        account_name: "",
        amount: 0,
        pool_id: {id: CookieConfig.get('pool_id'), name: "", status: 0},
        memo: ""
    };

    const shiftData = [
        { name: 1 },
        { name: 2 },
        { name: 3 }
    ];

    const getCompany = async(keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

    const QueryData = async(page, pageSize, keyword) => {
        setIsLoading(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword };

        const res = await CrudService.GetAll(params);

        setModels([]);
        setTotalRecords(0);
        if (res.status === 200) {
            if (res.data) {
                setModels(res.data.list);
                setTotalRecords(res.data.total);
            }
        }

        setIsLoading(false);
    }

    const onSetPerPage = (e) => {
        setPerPage(e);
    }

    const actionNew = () => {
        setValues(emptyModel);
        setCompanyData(null);
        setShiftSelect(shiftData[0].name);
        setVisibleDialog(true);
    }

    const actionEdit = async (rowData) => {
        let id = rowData.id;
        setCompanyData(null);

        const res = await CrudService.GetByID(id);

        if (res.status === 200) {
            const data = res.data;

            setCompanySelect(data.company_id);
            setShiftSelect(data.shift);

            setValues(data);
            setVisibleDialog(true);
        }
    }

    const actionDelete = async () => {
        const res = await CrudService.DeleteData(model.id);

        if (res.status === 200) {
            QueryData();
            return true
        }

        return false;
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData(1, perPage, "");
        }, 250);
    }

    const onSetModel = (data) => {
        setValues(data);
        setModel(data);
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = null;
        let result = null;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            if (key === "pool_id") {
                form.append(key, values[key]["id"]);
            } else {
                if (emptyModel[key]["id"] === 0) {
                    form.append(key, values[key]["id"]);
                } else {
                    form.append(key, values[key]);
                }
            }
            return form;
        });

        // console.log(values, [...form])

        if (values.id > 0) {
            result = await CrudService.PutData(values.id, form);
        } else {
            result = await CrudService.PostData(form);
        }

        if (result.status === 200) {
            setTimeout(() => {
                setWaiting(false);

                actionRefresh();
                setVisibleDialog(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });

            }, 1000);
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
        } else if (result.status === 402) {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const title = "Cashier Drop";
    const columnsTable = [
        { field: 'issue_date', header: 'Tgl Issue', sortable: false, style: "percent", width: 0.7},
        { field: 'company_id.name', header: 'Grup Perusahaan', sortable: false, style: "percent", width: 1},
        { field: 'pool_id.name', header: 'Gudang', sortable: false, style: "percent", width: 1},
        { field: 'shift', header: 'Shift', sortable: false, style: "percent", width: 0.82},
        { field: 'account_code', header: 'Account Code', sortable: false, style: "percent", width: 0.82},
        { field: 'amount', header: 'Jumlah', sortable: false, style: "percent", width: 0.82, body:"currency"},
        { field: 'memo', header: 'Memo', sortable: false, style: "percent", width: 0.82},
        { field: 'action', header: '' },
    ];

    const dynamicForm = (
        <Fragment>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="grid">
                    <div className="col-4"></div>
                    <DatePickerComp className="field col-12 md:col-4" validate={true} field="issue_date" title="Tgl Issue" value={values.issue_date} onChange={(e) => { values.issue_date = e; }} onBlur={handleBlur} errors={errors} touched={touched} />
                </div>
                <div className="grid">
                    <AutoCompleteComp className="field col-12 md:col-8" api={true} validate={true} field="company_id" title="Grup Perusahaan"  showField="name" errors={errors} touched={touched}
                        models={companyData} queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => { setCompanySelect(e); values.company_id.id = e.id; }} onChange={(e) => { setCompanySelect(e.value); values.company_id.id = e.value.id; }}
                    />
                    <DropDownComp className="field col-12 md:col-4" validate={true} field="shift" title="Shift" optionLabel="name" optionValue="name" options={shiftData} value={shiftSelect}
                        onChange={(e) => { setShiftSelect(e.value); values.shift = e.value;  }} errors={errors} touched={touched} onBlur={handleBlur} />
                    <InputTextComp className="field col-12 md:col-6" validate={true} field="account_id" title="Account ID" value={values.account_id} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                    <InputTextComp className="field col-12 md:col-6" validate={true} field="account_code" title="Account Code" value={values.account_code} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                    <InputTextComp className="field col-12 md:col-6" validate={true} field="account_name" title="Account Name" value={values.account_name} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                    <InputNumberComp className="field col-12 md:col-6" field="amount" title="Jumlah" value={values.amount} onChange={(e) => values.amount = e.value } minFractionDigits={2} maxFractionDigits={2} onBlur={handleBlur} errors={errors} touched={touched} />
                    <InputTextComp className="field col-12 md:col-12" validate={true} field="memo" title="Memo" value={values.memo} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                </div>
            </form>
        </Fragment>
    )

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "export":
                break;

            case "refresh":
                actionRefresh();
                break;

            case "new":
                actionNew();
                break;

            case "print":

                break;

            default:
                break;
        }
    }

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <Toast ref={toast} />
            <div className="card">
                <DataTableListComp api={true} history={history} toolbar={true} toolbarAction="list" actionStatus="crud" loading={isLoading} title={title}  search={true}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData} actionDelete={(data) => actionDelete(data)}
                    actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} actionSave={handleSubmit}
                    visibleDialog={visibleDialog} setVisibleDialog={() => setVisibleDialog(false)} dialogStyle={{ width: "600px" }}
                    dynamicForm={dynamicForm} setModel={onSetModel} />
            </div>

            <PostPutValidationComp waitingDialog={waiting} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} />
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CashierDropList, comparisonFn);
