import React, { useEffect, useState, useRef, Fragment } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { Panel } from "primereact/panel";

// Crud To Backend
import * as HeaderService from '../../service/Sales/SalesPrice';

// Get Global State
import { GlobalConsumer } from "../../config/Context";

// Component
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import { formatDateString } from "../../helpers/FormatHelpers";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";

// get API Master
import { APIBisnisUnit, APIOrderType, APIFleetType, APIOriginChild, APIPlant, APIProduct } from "../../components/api/APIMaster";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const PriceDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef(null);

    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [businessData, setBusinessData] = useState([]);
    const [businessSelect, setBusinessSelect] = useState(null);
    const [orderTypeData, setOrderTypeData] = useState([]);
    const [orderTypeSelect, setOrderTypeSelect] = useState(null);
    const [fleetTypeData, setFleetTypeData] = useState([]);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);
    const [unitData, setUnitData] = useState([]);
    const [unitSelect, setUnitSelect] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productSelect, setProductSelect] = useState(null);
    const [originData, setOriginData] = useState([]);
    const [originSelect, setOriginSelect] = useState(null);
    const [plantData, setPlantData] = useState([]);
    const [plantSelect, setPlantSelect] = useState(null);
    const [statusNew, setStatusNew] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);

    // input switch
    const [statusFlag, setStatusFlag] = useState(false);

    const uomList = [
        { name: "Tonase" },
        { name: "Kubikasi" },
        { name: "Rit" },
    ];

    let emptyModel = {
        id: 0,
        effective_date: formatDateString(new Date()),
        expired_date: "",
        price: 0,
        uom: "Kubikasi",
        origin_id: { id: 0 },
        plant_id: { id: 0 },
        product_id: { id: 0 },
        order_type_id: { id: 0 },
        fleet_type_id: { id: 0 },
        sales_type_id: { id: 0 },
        status: 0,
    };

    useEffect(() => {
        setVisible(false);

        getUnit();

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getBusiness = async(keyword) => {
        const res = await APIBisnisUnit(keyword);

        setBusinessData(null);

        return res;
    }

    const getOrderType = async(keyword) => {
        if (businessSelect) {
            const res = await APIOrderType(businessSelect.id, keyword);

            setOrderTypeData(null);

            return res;
        }
    }

    const getOrigin = async (keyword) => {
        const res = await APIOriginChild(keyword);

        setOriginData(null);

        return res;
    }

    const getPlant = async (keyword) => {
        const res = await APIPlant(keyword);

        setPlantData(null);

        return res;
    }

    const getProduct = async (keyword) => {
        const res = await APIProduct(keyword);

        setProductData(null);

        return res;
    }

    const getFleetType = async (keyword) => {
        if (businessSelect) {
            const res = await APIFleetType(businessSelect.id, keyword);

            setFleetTypeData(null);

            return res;
        }
    }

    const getUnit = async () => {
        setUnitData(uomList);
    }

    const onChangeBusiness = (e) => {
        if (businessSelect.id === e.value.id) {
        } else {
            setOrderTypeData(null);
            setOrderTypeSelect(null);
            setFleetTypeData(null);
            setFleetTypeSelect(null);
        }

        setBusinessSelect(e.value);
        setChangeStatus(true);
    }

    const QueryData = async () => {
        if (id) {
            const res = await HeaderService.GetByID(id);

            if (res.status === 200) {
                const querydata = res.data;

                setValues(querydata);

                setBusinessSelect(querydata.sales_type_id);
                setOrderTypeSelect(querydata.order_type_id);
                setProductSelect(querydata.product_id);
                setOriginSelect(querydata.origin_id);
                setPlantSelect(querydata.plant_id);
                setFleetTypeSelect(querydata.fleet_type_id);
                setUnitSelect(querydata.uom);

                // input switch
                setStatusFlag(false);
                if (querydata.status === 1) {
                    setStatusFlag(true);
                }

                setStatusNew(false);
            } else {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data tidak ditemukan", life: 3000 });
            }
        } else {
            setValues(emptyModel);
            setBusinessSelect(null);
            setOrderTypeSelect(null);
            setProductSelect(null);
            setOriginSelect(null);
            setPlantSelect(null);
            setFleetTypeSelect(null);
            setUnitSelect(uomList[0].name);
            setChangeStatus(false);
            setStatusNew(true);
        }

        setOrderTypeData(null);
        setBusinessData(null);
        setFleetTypeData(null);
        setOriginData(null);
        setPlantData(null);
        setProductData(null);
    }

    // jika tidak validasi table
    const actionFinal = (data_id, message) => {
        // jika  validasi table
        // const actionFinal = (count, data_id, message) => {
        setTimeout(() => {
            setWaiting(false);

            setChangeStatus(false);
            setVisible(false);

            toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });

            if (statusNew === false) {
                QueryData();
            } else {
                history.push({
                    pathname: "/price/edit/" + data_id,
                    state: {}
                });
            }
        }, 1000);
    }

    const setDataAutoComplete = () => {
        if (businessSelect) {
            values.sales_type_id.id = businessSelect.id;
        }

        if (orderTypeSelect) {
            values.order_type_id.id = orderTypeSelect.id;
        }

        if (originSelect) {
            values.origin_id.id = originSelect.id;
        }

        if (plantSelect) {
            values.plant_id.id = plantSelect.id;
        }

        if (productSelect) {
            values.product_id.id = productSelect.id;
        }

        if (fleetTypeSelect) {
            values.fleet_type_id.id = fleetTypeSelect.id;
        }

        if (statusFlag) {
            values.status = statusFlag ? 1 : 0;
        }

        if (values.expired_date === "1970-01-01" || values.expired_date === null) {
            values.expired_date = "";
        } else {
            let effective = new Date(values.effective_date);
            let expired = new Date(values.expired_date);
            if (effective > expired) {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Tgl berakhir harus lebih besar dari tgl efektif", life: 3000 });
                return false;
            }
        }

        return true;
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);
        let form = null;
        let result = null;

        const res = setDataAutoComplete();

        if (!res) return;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            if (key === "expired_date") {
                let parseDate = new Date(values.expired_date);
                if (parseDate === "Invalid Date" || isNaN(parseDate)) {
                } else {
                    values.expired_date = formatDateString(parseDate);
                }
            } else {
                if (emptyModel[key]["id"] === 0) {
                    form.append(key, values[key]["id"]);
                } else {
                    form.append(key, values[key]);
                }
            }
            return form;
        });

        if (values.id > 0) {
            result = await HeaderService.PutData(values.id, form);
        } else {
            result = await HeaderService.PostData(form);
        }

        if (result.status === 200) {
            setWaiting(true);
            let data_id = 0;
            if (id > 0) {
                data_id = id
            } else {
                data_id = result.data.id;
            }

            actionFinal(data_id, result.message);
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

    const { values, errors, touched, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/price/list",
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
                        pathname: "/price/create",
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
                            <div className="col-12 md:col-12 lg:col-12">
                                <Panel header="Input Price" className="mb-3">
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="sales_type_id" title="Bisnis Unit" showField="name" errors={errors} touched={touched} models={businessData}
                                                    queryData={(e) => getBusiness(e)} value={businessSelect} setSelectValue={(e) => setBusinessSelect(e)} onChange={(e) => { onChangeBusiness(e) }} />
                                            </div>
                                            <div className="grid">
                                                <DatePickerComp className="field col-12 md:col-3" validate={true} field="effective_date" title="Tgl Efektif" value={values.effective_date} onChange={(e) => { values.effective_date = e; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <DatePickerComp className="field col-12 md:col-3" validate={true} field="expired_date" title="Tgl Berakhir" value={values.expired_date} onChange={(e) => { values.expired_date = e; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            </div>
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="order_type_id" title="Jenis Transaksi" showField="name" errors={errors} touched={touched} models={orderTypeData}
                                                    queryData={(e) => getOrderType(e)} value={orderTypeSelect} setSelectValue={(e) => setOrderTypeSelect(e)} onChange={(e) => { setOrderTypeSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="origin_id" title="Asal" showField="name" errors={errors} touched={touched} models={originData}
                                                    queryData={(e) => getOrigin(e)} value={originSelect} setSelectValue={(e) => setOriginSelect(e)} onChange={(e) => { setOriginSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Tujuan" showField="full_name" errors={errors} touched={touched} models={plantData}
                                                    queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => setPlantSelect(e)} onChange={(e) => { setPlantSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="product_id" title="Produk" showField="name" errors={errors} touched={touched} models={productData}
                                                    queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => setProductSelect(e)} onChange={(e) => { setProductSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Jenis Truck" showField="name" errors={errors} touched={touched} models={fleetTypeData}
                                                    queryData={(e) => getFleetType(e)} value={fleetTypeSelect} setSelectValue={(e) => setFleetTypeSelect(e)} onChange={(e) => { setFleetTypeSelect(e.value); setChangeStatus(true) }} />
                                            </div>
                                            <div className="grid">
                                                <InputNumberComp className="field col-12 md:col-2" field="price" title="Harga" value={values.price} onChange={(e) => { values.price = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <DropDownComp className="field col-12 md:col-2" validate={true} field="uom" title="Satuan" optionLabel="name" optionValue="name" options={unitData} value={unitSelect} errors={errors} touched={touched} onBlur={handleBlur}
                                                    onChange={(e) => { setUnitSelect(e.value); values.uom = e.value; setChangeStatus(true) }} />
                                                <div className="col-12 md:col-6 lg:col-2">
                                                    <h6>Status</h6>
                                                    <InputSwitch id="status" name="status" checked={statusFlag} onChange={(e) => { setStatusFlag(e.value); setChangeStatus(true); }} onBlur={handleBlur} />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Panel>
                            </div>
                        </div>

                        <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
                    </div>
                </div >
            </div >
        </Fragment >
    );

};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(PriceDetail), comparisonFn);
