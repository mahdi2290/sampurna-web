import React, { useEffect, useState, useRef, Fragment } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { Panel } from 'primereact/panel';

// Crud To Backend
import * as CrudCustomer from '../../service/Customer/CustomerService';
import * as CrudPlant from '../../service/Customer/PlantService';

// Get Master From Backend
import * as CityMaster from '../../service/Master/CityService';
import * as CTypeMaster from '../../service/Master/CompanyTypeService';

// Get Global State
import { GlobalConsumer } from "../../config/Context";

// Component
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import LoadingDialogComp from "../../components/standard/Dialog/LoadingDialogComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import MultiSelectComp from "../../components/standard/Form/MultiSelectComp";
import Plant from "../../containers/Customer/Plant";

const TransportDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef(null);

    const [cTypeData, setCTypeData] = useState([]);
    const [cTypeSelect, setCTypeSelect] = useState(null);
    const [cityData, setCityData] = useState(null);
    const [citySelect, setCitySelect] = useState(null);
    const [visible, setVisible] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [waiting, setWaiting] = useState(false);

    const [changeStatus, setChangeStatus] = useState(false);
    const [statusFlag, setStatusFlag] = useState(false);
    const [cashFlag, setCashFlag] = useState(false);
    const [poFlag, setPOFlag] = useState(false);

    //plant
    const [errorList, setErrorList] = useState(false);
    const [plantList, setPlantList] = useState([]);
    const [plantPost, setPlantPost] = useState([]);
    const [plantPut, setPlantPut] = useState([]);
    const [plantDelete, setPlantDelete] = useState([]);

    let emptyModel = {
        id: 0,
        parent_id: 0,
        code: "",
        name: "",
        email: "",
        phone: "",
        fax: "",
        npwp: "",
        npwp_name: "",
        npwp_address: "",
        terms: 0,
        credit: 0,
        is_cash: 0,
        is_po: 0,
        is_tax: 0,
        address: "",
        city_id: { id: 0 },
        zip: "",
        status: 0,
        company_type: []
    };

    let emptyPlantModel = {
        id: 0,
        name: "",
        pic: "",
        address: "",
        is_do: 0,
        is_po: 0,
        status: 0,
    }

    useEffect(() => {
        setVisible(false);
        getMaster();

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getMaster = () => {
        getCompanyType();
    }

    const getCity = async (keyword) => {
        const res = await CityMaster.GetAll(keyword);

        setCityData(null);

        return res.data;
    }

    const getCompanyType = async () => {
        await CTypeMaster.GetAll().then(res => {
            const result = res.data.list;

            let _before = [...cTypeData];

            for (let index = 0; index < result.length; index++) {
                const row = result[index];

                const data = {
                    id: row.id,
                    name: row.name
                };

                _before.push(data);

                setCTypeData(_before);
            }
        });
    }

    const QueryData = async () => {
        if (id) {
            const res = await CrudCustomer.GetByID(id);
            const querydata = res.data;
            setValues(querydata);

            setCitySelect(querydata.city_id);

            setCashFlag(false);
            if (querydata.is_cash === 1) {
                setCashFlag(true);
            }
            setPOFlag(false);
            if (querydata.is_po === 1) {
                setPOFlag(true);
            }
            setStatusFlag(false);
            if (querydata.status === 1) {
                setStatusFlag(true);
            }

            if (res.data.company_type !== null) {
                setCTypeSelect(res.data.company_type);
            }

            //plant
            if (res.data.plant !== null) {
                setPlantList(res.data.plant);
            }

            setStatusNew(false);
        } else {
            setStatusNew(true);
        }

        setCityData(null);
    }

    // jika tidak validasi table
    // const actionFinal = (count,data_id, message)

    // jika  validasi table
    const actionFinal = (count, data_id, message) => {
        if (count === 0) {
            setTimeout(() => {
                setWaiting(false);
                // Plant
                setPlantPost([]);
                setPlantPut([]);
                // Plant


                setChangeStatus(false);
                setVisible(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });

                if (statusNew === false) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/customer/edit/" + data_id,
                        state: {}
                    });
                }
            }, 1000);
        }
        setWaiting(false);
    }

    const onSubmited = async (values, actions) => {
    // validasi untuk table Plant
        setWaiting(true);
        setErrorList([]);
    // validasi untuk table Plant

        let form = null;
        let result = null;

        setDataAutoComplete();

        form = new FormData();

        let company_id = "";
        if (cTypeSelect) {
            let ctypeLen = cTypeSelect.length;

            for (var i = 0; i < ctypeLen; i++) {
                const row = cTypeSelect[i];

                company_id = company_id + row.id;

                if (i < (ctypeLen - 1)) {
                    company_id = company_id + ",";
                }
            };
        }

        form.append("company_type", company_id);

        Object.keys(emptyModel).map(key => {
            if (emptyModel[key]["id"] === 0) {
                form.append(key, values[key]["id"]);
            } else {
                form.append(key, values[key]);
            }
            return form;
        });

        if (values.id > 0) {
            result = await CrudCustomer.PutData(values.id, form);
        } else {
            result = await CrudCustomer.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id;
            } else {
                data_id = result.data.id;
            }

            let errorCount = parseInt(0);

            const errorPost = await postPlant(data_id);
            const errorPut = await putPlant(data_id);

            errorCount = errorPost + errorPut;

            deletePlant(data_id);
            // Plant

            actionFinal(errorCount, data_id, result.message);
            //actionFinal(data_id, result.message);
            setWaiting(false);

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
        }
    };

    // plant
    const setErrorPlant = (id) => {
        setErrorList(prevState => [...prevState, { id: id }]);
    }

    const postPlant = async (data_id) => {
        let error = parseInt(0);

        if (plantPost) {
            for (var i = 0; i < plantPost.length; i++) {
                const form = new FormData();
                const row = plantPost[i];
                let status = false;

                form.append("company_id", data_id);
                Object.keys(emptyPlantModel).map(key => {
                    if (emptyPlantModel[key]["id"] === 0) {
                        form.append(key, row[key]["id"]);
                    } else {
                        form.append(key, row[key]);
                    }
                    return form;
                });

                let result = await CrudPlant.PostData(form);

                if (result.status === 200) {
                    props.dispatch({ type: "error-false" });
                } else if (result.status === 400) {
                    status = props.dispatch({ type: "error-true" });
                    setErrorPlant(row.id);

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

        return error;
    }

    const putPlant = async (data_id) => {
        let error = parseInt(0);
        if (plantPut) {
            for (var i = 0; i < plantPut.length; i++) {
                const form = new FormData();
                const row = plantPut[i];
                let status = false;

                form.append("company_id", data_id);
                Object.keys(emptyPlantModel).map(key => {
                    if (emptyPlantModel[key]["id"] === 0) {
                        form.append(key, row[key]["id"]);
                    } else {
                        form.append(key, row[key]);
                    }
                    return form;
                });

                let result = await CrudPlant.PutData(row.id, form);
                if (result.status === 200) {
                    props.dispatch({ type: "error-false" });
                } else if (result.status === 400) {
                    status = props.dispatch({ type: "error-true" });
                    setErrorPlant(row.id);

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

        return error;
    }

    const deletePlant = (data_id) => {
        if (plantDelete) {
            plantDelete.map(async (row) => {
                let id = row.id.toString();

                const form = JSON.stringify({
                    "id": id
                });

                let result = await CrudPlant.DeleteData(data_id, form);

                return result.status;
            })
            setPlantDelete([]);
        }
    }
    // plant

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/purchase/master/origin/list",
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

    const setDataAutoComplete = () => {
        if (citySelect) {
            values.city_id.id = citySelect.id;
        }

        if (cashFlag) {
            values.is_cash = cashFlag ? 1 : 0;
        }

        if (statusFlag) {
            values.status = statusFlag ? 1 : 0;
        }

        if (poFlag) {
            values.is_po = poFlag ? 1 : 0;
        }
    }

    // plant
    const findIndexList = (id) => {
        let index = -1;
        for (let i = 0; i < plantList.length; i++) {
            if (plantList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexPost = (id) => {
        let index = -1;
        for (let i = 0; i < plantPost.length; i++) {
            if (plantPost[i].id === id) {
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
                setPlantPost(prevState => [...prevState, data]);
                break;
            case "U":
                if (!isNaN(data.id)) {
                    let _before = [...plantList];
                    index = findIndexList(data.id);

                    _before[index] = data;
                    setPlantPut(prevState => [...prevState, data]);
                } else {
                    let _before = [...plantPost];
                    index = findIndexPost(data.id);

                    if (index >= 0) {
                        _before[index] = data;

                        setPlantPost(_before);
                    }
                }

                break;
            case "D":
                if (!isNaN(data.id)) {
                    setPlantDelete(prevState => [...prevState, data]);
                }

                if (plantPost) {
                    let _post = plantPost.filter(val => val.id !== data.id);
                    setPlantPost(_post);
                }

                if (plantPut) {
                    let _put = plantPut.filter(val => val.id !== data.id);
                    setPlantPut(_put);
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

    const modelDialogFooter = (
        <>
            <Button label="Back" icon="pi pi-chevron-left" className="p-button-text p-button-sm" onClick={backURL} />
            <Button label="Close" icon="pi pi-times" className="p-button-text p-button-sm" onClick={() => setVisible(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text p-button-sm" onClick={handleSubmit} />
        </>
    );

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "save":
                handleSubmit();
                break;

            case "new":
                return history.push({
                    pathname: "/customer/create",
                });

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
                            <div className="col-12 md:col-6 lg:col-6">
                                <Panel header="Pelanggan" className="h-full">
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">                                            
                                            <div className="grid">
                                                <MultiSelectComp className="field col-12 md:col-12 mb-0" validate={true} field="company_type" title="Internal" optionLabel="code" showField="name" options={cTypeData} value={cTypeSelect} onChange={(e) => { setCTypeSelect(e.value); }} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-4 mb-0" validate={true} field="code" title="Kode" value={values.code} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-8 mb-0" validate={true} field="name" title="Nama" value={values.name} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />                                                
                                                <InputNumberComp className="field col-12 md:col-6 mb-0" field="terms" title="Terms (hari)" value={values.terms} onChange={(e) => { values.terms = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-6 mb-0" field="credit" title="Credit (Rp)" value={values.credit} onChange={(e) => { values.credit = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-6 mb-0" validate={true} field="phone" title="Telp" value={values.phone} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-6 mb-0" validate={true} field="fax" title="Fax" value={values.fax} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />                                                
                                                <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="email" title="Email" value={values.email} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-6 mb-0" validate={true} field="npwp" title="Npwp" value={values.npwp} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-6 mb-0" validate={true} field="npwp_name" title="Nama" value={values.npwp_name} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="npwp_address" title="Alamat NPWP" value={values.npwp_address} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-12 mb-0" validate={true} field="address" title="Alamat" value={values.address} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <AutoCompleteComp className="field col-12 md:col-12 mb-0" api={true} validate={true} field="city_id" title="Kota" showField="name" errors={errors} touched={touched} models={cityData}
                                                    queryData={(e) => getCity(e)} value={citySelect} setSelectValue={(e) => setCitySelect(e)} onChange={(e) => { setCitySelect(e.value); setChangeStatus(true) }} />
                                                <InputTextComp className="field col-12 md:col-4 mb-0" validate={true} field="zip" title="Kode Pos" value={values.zip} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            
                                                <div className="col-12 md:col-6 lg:col-2">
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <h6>Cash</h6>
                                                        <InputSwitch id="is_cash" name="is_cash" checked={cashFlag} onChange={(e) => { setCashFlag(e.value); setChangeStatus(true); }} onBlur={handleBlur} />
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-2">
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <h6>PO</h6>
                                                        <InputSwitch id="is_po" name="is_po" checked={poFlag} onChange={(e) => { setPOFlag(e.value); setChangeStatus(true); }} onBlur={handleBlur} />
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-2">
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <h6>Status</h6>
                                                        <InputSwitch id="status" name="status" checked={statusFlag} onChange={(e) => { setStatusFlag(e.value); setChangeStatus(true); }} onBlur={handleBlur} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Panel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6">
                                <Panel header="Plant" className="h-full">
                                    <Plant plant={id} models={plantList} setModels={onSetModels} empty={emptyPlantModel} rowClassName={(e) => rowClassNameTemplate(e)} setChangeStatus={() => setChangeStatus(true)} toast={toast} />                                
                                </Panel>
                            </div>
                        </div>

                        <Dialog visible={visible} style={{ width: "600px" }} header="Konfirmasi" modal className="p-fluid" footer={modelDialogFooter} onHide={() => setVisible(false)}>
                            <p><b>Apakah Anda yakin, Anda akan keluar dari halaman ini?</b></p>
                        </Dialog>

                        <LoadingDialogComp visible={waiting} />
                    </div>
                </div >
            </div >
        </Fragment >
    );

};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(TransportDetail), comparisonFn);
