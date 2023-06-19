import React, { useEffect, useState, useRef, Fragment } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";

// Crud To Backend
import * as CrudBank from '../../service/Bank/BankService';
import * as CrudPIC from '../../service/Bank/BankPicService';

// Get Master From Backend
import * as CityMasterService from '../../service/Master/CityService';
import * as BusinessMasterService from '../../service/Master/BusinessService';

// Get Global State
import { GlobalConsumer } from "../../config/Context";

// Component
import BankPIC from "./PIC";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import MultiSelectComp from "../../components/standard/Form/MultiSelectComp";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const BankDetail = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const toast = useRef(null);

    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [businessData, setBusinessData] = useState([]);
    const [businessSelect, setBusinessSelect] = useState(null);
    const [cityData, setCityData] = useState(null);
    const [citySelect, setCitySelect] = useState(null);
    const [statusNew, setStatusNew] = useState(false);
    const [errorList, setErrorList] = useState(false);

    const [changeStatus, setChangeStatus] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [storePost, setStorePost] = useState([]);
    const [storePut, setStorePut] = useState([]);
    const [storeDelete, setStoreDelete] = useState([]);

    let emptyModel = {
        id: 0,
        name: "",
        swift: "",
        bi: "",
        city_id: { id: 0 },
        bank_company: []
    };

    let emptyDetailModel = {
        id: 0,
        name: "",
        phone: "",
        branch: ""
    };

    useEffect(() => {
        setVisible(false);
        getMaster();

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getMaster = () => {
        getBusiness();
    }

    const getCity = async (keyword) => {
        const res = await CityMasterService.GetAll(keyword);

        setCityData(null);

        return res.data;
    }

    console.log(getBusiness)
    
    const getBusiness = () => {
        BusinessMasterService.GetAll().then(res => {
            const result = res.data.list;

            let _before = [...businessData];

            for (let index = 0; index < result.length; index++) {
                const row = result[index];

                const data = {
                    id: row.id,
                    code: row.code,
                    name: row.name
                };

                _before.push(data);

                setBusinessData(_before);
            }
        });
    }

    const QueryData = async () => {
        if (id) {
            const res = await CrudBank.GetByID(id);

            const bank = res.data;
            setValues(bank);

            setCitySelect(bank.city_id);

            if (res.data.bank_pic !== null) {
                setStoreList(res.data.bank_pic);
            }

            if (res.data.bank_company !== null) {
                setBusinessSelect(res.data.bank_company);
            }

            setStatusNew(false);
        } else {
            setValues(emptyModel);
            setCitySelect(null);
            setBusinessSelect(null);
            setChangeStatus(false);

            setStatusNew(true);
        }

        setCityData(null);
    }

    const actionFinal = (count, bank_id, message) => {
        if (count === 0) {
            setTimeout(() => {
                setWaiting(false);

                setStoreList([]);
                setStorePost([]);
                setStorePut([]);
                setStoreDelete([]);
                setChangeStatus(false);
                setVisible(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });

                if (statusNew === false) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/bank/edit/" + bank_id,
                        state: {}
                    });
                }
            }, 1000);
        } else {
            setWaiting(false);
        }
    }

    const setDataAutoComplete = () => {
        if (citySelect) {
            values.city_id.id = citySelect.id;
        }
    }

    const pushDataDetail = async(bank_id) => {
        let error = parseInt(0);
        if (storePost) {
            for (var i = 0; i < storePost.length; i++) {
                const form = new FormData();
                const row = storePost[i];
                let status = false;

                form.append("bank_id", bank_id);
                Object.keys(emptyDetailModel).map(key => {
                    if (emptyDetailModel[key]["id"] === 0) {
                        form.append(key, row[key]["id"]);
                    } else {
                        form.append(key, row[key]);
                    }
                    return form;
                });

                let result = await CrudPIC.PostData(form);
                if (result.status === 200) {
                    status = false;
                } else if (result.status === 400) {
                    status = true;
                    setErrorPIC(row.id);

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
                }

                if (status === true) {
                    error = error + 1;
                }
            }
        }
        if (storePut) {
            for (var k = 0; k < storePut.length; k++) {
                const form = new FormData();
                const row = storePut[k];
                let status = false;

                form.append("bank_id", bank_id);
                Object.keys(emptyDetailModel).map(key => {
                    if (emptyDetailModel[key]["id"] === 0) {
                        form.append(key, row[key]["id"]);
                    } else {
                        form.append(key, row[key]);
                    }
                    return form;
                });

                let result = await CrudPIC.PutData(row.id, form);
                if (result.status === 200) {
                    status = false;
                } else if (result.status === 400) {
                    status = true;
                    setErrorPIC(row.id);

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
        }
        if (storeDelete) {
            storeDelete.map(async (row) => {
                let id = row.id.toString();

                const form = JSON.stringify({
                    "id": id
                });

                let result = await CrudPIC.DeleteData(bank_id, form);

                return result.status;
            })
            setStoreDelete([]);
        }
        return error;
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        // validasi untuk table PIC
        setErrorList([]);

        let form = null;
        let result = null;

        setDataAutoComplete();

        form = new FormData();

        let company_id = "";
        if (businessSelect) {
            let businessLen = businessSelect.length;

            for (var i = 0; i < businessLen; i++) {
                const row = businessSelect[i];

                company_id = company_id + row.id;

                if (i < (businessLen - 1)) {
                    company_id = company_id + ",";
                }
            };
        }
        form.append("bank_company", company_id);

        Object.keys(emptyModel).map(key => {
            if (emptyModel[key]["id"] === 0) {
                form.append(key, values[key]["id"]);
            } else {
                form.append(key, values[key]);
            }
            return form;
        });

        if (values.id > 0) {
            result = await CrudBank.PutData(values.id, form);
        } else {
            result = await CrudBank.PostData(form);
        }

        if (result.status === 200) {
            let bank_id = 0;
            if (id) {
                bank_id = id;
            } else {
                bank_id = result.data.id;
            }

            let errorCount = parseInt(0);

            errorCount = await pushDataDetail(bank_id);

            actionFinal(errorCount, bank_id, result.message);
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
    };

    const setErrorPIC = (id) => {
        setErrorList(prevState => [...prevState, { id: id }]);
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/bank/list",
        });
    }

    const backDialog = () => {
        setDataAutoComplete();

        if (changeStatus === false) {
            backURL();
        } else {
            setVisible(true);
        }
    };

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
                        _before[index] = data;

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

    const rowClassNameTemplate = (data) => {
        return {
            'd-error': findIndexError(data.id) > -1
        }
    }

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
                        pathname: "/bank/create",
                    });
                }
                window.location.reload();
                break;

            default:
                break;
        }
    }

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
                                <Panel header="Bank" className="h-full">
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">
                                            <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="name" title="Nama" value={values.name}  onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="swift" title="Swift" value={values.swift}  onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="bi" title="BI" value={values.bi}  onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            <AutoCompleteComp className="field col-12 md:col-12 mb-0" api={true} validate={true} field="city_id" title="Kota" showField="name" errors={errors} touched={touched} models={cityData}
                                                queryData={(e) => getCity(e)} value={citySelect} setSelectValue={(e) => setCitySelect(e)} onChange={(e) => { setCitySelect(e.value); setChangeStatus(true) }} />
                                            <MultiSelectComp className="field col-12 md:col-12 mb-0" validate={true} title="Internal" field="bank_company" optionLabel="code" showField="name" options={businessData} value={businessSelect} onChange={(e) => { setBusinessSelect(e.value); }} errors={errors} touched={touched} />
                                        </div>
                                    </form>
                                </Panel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-8">
                                <Panel header="PIC" className="h-full">
                                    <BankPIC id={id} models={storeList} setModels={onSetModels} empty={emptyDetailModel} rowClassName={(e) => rowClassNameTemplate(e)} setChangeStatus={() => setChangeStatus(true)} toast={toast} />
                                </Panel>
                            </div>
                        </div>

                        <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(BankDetail), comparisonFn);
