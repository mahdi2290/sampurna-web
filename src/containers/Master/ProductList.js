import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import InputSwitchComp from "../../components/standard/Form/InputSwitchComp";
import * as CrudService from '../../service/Master/ProductService';
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const ProductList = () => {
    const toast = useRef(null);

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);

    const [visibleDialog, setVisibleDialog] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [statusFlag, setStatusFlag] = useState(false);
    const [doFlag, setDOFlag] = useState(false);

    let emptyModel = {
        id: 0,
        name: "",
        status: 0,
        is_do: 0,
    };

    const QueryData = async (page, pageSize, keyword) => {
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
        setVisibleDialog(true);
    }

    const actionEdit = async (data) => {
        let id = data.id;

        const res = await CrudService.GetByID(id);

        if (res.status === 200) {
            const data = res.data;

            setStatusFlag(false);
            if (data.status === 1) {
                setStatusFlag(true);
            }

            setDOFlag(false);
            if (data.is_do === 1) {
                setDOFlag(true);
            }

            setValues(data);
            setVisibleDialog(true);
        }
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData(1, perPage, "");
        }, 250);
    }

    const onSetModel = (data) => {
        setValues(data);
    }

    const setValueData = () => {
        values.status = 0;
        if (statusFlag) {
            values.status = 1;
        }

        values.is_do = 0;
        if (doFlag) {
            values.is_do = 1;
        }
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = null;
        let result = null;

        form = new FormData();

        setValueData();

        Object.keys(emptyModel).map(key => {
            if (emptyModel[key]["id"] === 0) {
                form.append(key, values[key]["id"]);
            } else {
                form.append(key, values[key]);
            }
            return form;
        });

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

    const title = "Product";
    let localModeStorage = localStorage.getItem("layoutMode");
    let columnsTable = "";
    // if (localModeStorage === "static" ) {
    //     columnsTable = [
    //         { field: 'name', header: 'Nama Product', sortable: false, style: "percent", width: 6 },
    //         { field: 'status', header: 'Status', sortable: false, style: "percent", width: 0.25, body: "boolean" },
    //         { field: 'is_do', header: 'DO', sortable: false, style: "percent", width: 0.20, body: "boolean" },
    //         { field: 'action', header: '' },
    //     ];
    // } else {
        columnsTable = [
            { field: 'name', header: 'Nama Product', sortable: false, style: "percentage", width: 50 },
            { field: 'status', header: 'Status', sortable: false, style: "percentage", width: 20, body: "boolean" },
            { field: 'is_do', header: 'DO', sortable: false, style: "percentage", width: 20, body: "boolean" },
            { field: 'action', header: '' },
        ];
    // }

    const dynamicForm = (
        <Fragment>
            <form onSubmit={handleSubmit} autoComplete="off">
                <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="name" title="Nama" value={values.name} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <InputSwitchComp className="field col-12 md:col-12" validate={true} field="is_do" title="DO" checked={doFlag} onChange={(e) => setDOFlag(e.value)} onBlur={handleBlur} errors={errors} touched={touched} />
                <InputSwitchComp className="field col-12 md:col-12" validate={true} field="status" title="Status" checked={statusFlag} onChange={(e) => setStatusFlag(e.value)} onBlur={handleBlur} errors={errors} touched={touched} />
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

    // useEffect(() => {
    //     let isMounted = true;
    //     const controller = new AbortController();

    //     const getUsers = async () => {
    //         try {
    //             const response = await axiosPrivate.get('/v1/product', {
    //                 signal: controller.signal
    //             });
    //             console.log(response.data);
    //             isMounted && setModels(response.data.list);
    //         } catch (err) {
    //             console.error(err);
    //             // navigate('/login', { state: { from: location }, replace: true });
    //         }
    //     }

    //     getUsers();

    //     return () => {
    //         isMounted = false;
    //         controller.abort();
    //     }
    // }, [])

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <Toast ref={toast} />
            <div className="card">
                <DataTableListComp api={true} history={history} toolbar={true} toolbarAction="list" loading={isLoading} title={title}  search={true}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                    actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} actionSave={handleSubmit}
                    visibleDialog={visibleDialog} setVisibleDialog={() => setVisibleDialog(false)} dialogStyle={{ width: "500px" }}
                    dynamicForm={dynamicForm} setModel={onSetModel} />
            </div>

            <PostPutValidationComp waitingDialog={waiting} errorVisible={errorVisible} message={errorMessage} />
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ProductList, comparisonFn);
