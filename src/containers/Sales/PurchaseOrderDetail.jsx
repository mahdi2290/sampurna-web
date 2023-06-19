import React, { Fragment, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";

import * as HeaderService from '../../service/Sales/PurchaseOrder';

// Get Master From Backend
import * as PriceMaster from '../../service/Sales/SalesPrice';

// Get Global State
import { GlobalConsumer } from "../../config/Context";

// Component
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import { formatDateString } from "../../helpers/FormatHelpers";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
// get API Master
import { APIBisnisUnit, APIOrderType, APIFleetType, APIOriginParent, APIPlant, APIProduct } from "../../components/api/APIMaster";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const PoSalesDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef(null);
    const effectiveRef = useRef();
    const orderRef = useRef();
    const originRef = useRef();
    const plantRef = useRef();
    const productRef = useRef();
    const fleetRef = useRef();
    const unitRef = useRef();

    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [orderTypeData, setOrderTypeData] = useState([]);
    const [orderTypeSelect, setOrderTypeSelect] = useState(null);
    const [fleetTypeData, setFleetTypeData] = useState([]);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);
    const [unitData, setUnitData] = useState([]);
    const [unitSelect, setUnitSelect] = useState(null);
    const [originData, setOriginData] = useState([]);
    const [originSelect, setOriginSelect] = useState(null);
    const [plantData, setPlantData] = useState([]);
    const [plantSelect, setPlantSelect] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productSelect, setProductSelect] = useState(null);

    const [statusNew, setStatusNew] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [price, setPrice] = useState(0);

    const uomList = [
        { name: "Tonase" },
        { name: "Kubikasi" },
        { name: "Rit" },
    ];

    let emptyModel = {
        id: 0,
        reference_no: "",
        effective_date: formatDateString(new Date()),
        expired_date: "",
        qty: 0,
        uom: uomList[0].name,
        origin_id: { id: 0 },
        plant_id: { id: 0 },
        product_id: { id: 0 },
        sales_type_id: { id: 0 },
        order_type_id: { id: 0 },
        fleet_type_id: { id: 0 },
        price: 0,
        balance: 0,
        status: 0,
        delivery: 0
    };

    const getCompany = async (keyword) => {
        const res = await APIBisnisUnit(keyword);

        setCompanyData(null);

        return res;
    }

    const getOrderType = async (keyword) => {
        if (companySelect) {
            const res = await APIOrderType(companySelect.id, keyword);

            setOrderTypeData(null);

            return res;
        }

        return null;
    }

    const getOrigin = async (keyword) => {
        const res = await APIOriginParent(keyword);

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
        if (companySelect) {
            const res = await APIFleetType(companySelect.id, keyword);

            setFleetTypeData(null);

            return res;
        }
    }

    const getUnit = async () => {
        setUnitData(uomList);
    }

    const onChangeCompany = (e) => {
        if (companySelect) {
            if (companySelect.id === e.value.id) {
            } else {
                setOrderTypeData(null); 
                setOrderTypeSelect(null);
                setFleetTypeData(null); 
                setFleetTypeSelect(null);
            }
        }

        setCompanySelect(e.value); 
        setChangeStatus(true);                 
    }

    const getPrice = async (issueDate, origin, plant, product, orderType, fleetType, uom, method) => {
        const res = await PriceMaster.GetPrice(issueDate, origin, plant, product, orderType, fleetType, uom, method);

        if ( res.status === 200 ) {
            return res.data.price;
        } 

        return 0;
    }

    const QueryData = async () => {
        if (id) {
            const res = await HeaderService.GetByID(id);
            
            if (res.status === 200) {
                const querydata = res.data;

                effectiveRef.current = querydata.effective_date;
                orderRef.current = querydata.order_type_id.id;
                originRef.current = querydata.origin_id.id;
                plantRef.current = querydata.plant_id.id;
                productRef.current = querydata.product_id.id;
                fleetRef.current = querydata.fleet_type_id.id;
                unitRef.current = querydata.uom;

                setPrice(querydata.price);

                setValues(querydata);

                setCompanySelect(querydata.sales_type_id);
                setOrderTypeSelect(querydata.order_type_id);
                setOriginSelect(querydata.origin_id);
                setPlantSelect(querydata.plant_id);
                setProductSelect(querydata.product_id);
                setFleetTypeSelect(querydata.fleet_type_id);
                setUnitSelect(querydata.uom);

                setStatusNew(false);
            } else {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data tidak ditemukan", life: 3000 });
            }
        } else {
            setValues(emptyModel);

            effectiveRef.current = formatDateString(new Date());
            unitRef.current = uomList[0].name;

            setCompanySelect(null);
            setOrderTypeSelect(null);
            setOriginSelect(null);
            setPlantSelect(null);
            setProductSelect(null);
            setFleetTypeSelect(null);
            setUnitSelect(uomList[0].name);
            setChangeStatus(false);

            setStatusNew(true);
        }
        
        setCompanyData(null);
        setOrderTypeData(null);
        setOriginData(null);
        setPlantData(null);
        setProductData(null);
        setFleetTypeData(null);
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
                    pathname: "/po/sales/edit/" + data_id,
                    state: {}
                });
            }
        }, 1000);
    }

    const setDataAutoComplete = () => {
        if (companySelect) {
            values.sales_type_id.id = companySelect.id;
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

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/po/sales/list",
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

    const onChangePrice = async() => {
        let effective = effectiveRef.current;
        let order_type = orderRef.current;
        let origin = originRef.current;
        let plant = plantRef.current;
        let product = productRef.current;
        let fleet_type = fleetRef.current;
        let uom = unitRef.current;
        
        // if ( isNaN(order_type) || isNaN(origin) || isNaN(plant) || isNaN(product) || isNaN(fleet_type) ) {
        //     return;
        // }

        let harga = await getPrice(
            effective,
            origin,
            plant,
            product,
            order_type,
            fleet_type,
            uom, 
            0
        );

        setPrice(harga);
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
                    break;
                } else {
                    return history.push({
                        pathname: "/po/sales/create",
                    });
                }

            default:
                break;
        }
    }

    useEffect(() => {
        setVisible(false);
        getUnit();

        QueryData();
        
        // document.addEventListener("blur", onChangePrice, true);
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
                            <div className="col-12 md:col-12 lg:col12">
                                <Panel header="Input PO" className="mb-3"> 
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="sales_type_id" title="Bisnis Unit" showField="name" errors={errors} touched={touched} models={companyData}
                                                    queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => setCompanySelect(e)} onChange={(e) => { onChangeCompany(e) }} />
                                            </div>
                                            <div className="grid">
                                                <InputTextComp className="field col-12 md:col-4" validate={true} field="reference_no" title="No Po" value={values.reference_no} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                
                                                <DatePickerComp className="field col-12 md:col-3" validate={true} field="effective_date" title="Tgl Efektif" value={values.effective_date} onChange={(e) => { values.effective_date = e; effectiveRef.current = e; console.log(e); onChangePrice(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <DatePickerComp className="field col-12 md:col-3" validate={true} field="expired_date" title="Tgl Berakhir" value={values.expired_date} onChange={(e) => { values.expired_date = e; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            </div>
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="order_type_id" title="Jenis Transaksi" showField="name" errors={errors} touched={touched} models={orderTypeData}
                                                    queryData={(e) => getOrderType(e)} value={orderTypeSelect} setSelectValue={(e) => setOrderTypeSelect(e)} onChange={(e) => { setOrderTypeSelect(e.value); orderRef.current = e.value.id; onChangePrice(); setChangeStatus(true) }} />
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="origin_id" title="Asal" showField="name" errors={errors} touched={touched} models={originData}
                                                    queryData={(e) => getOrigin(e)} value={originSelect} setSelectValue={(e) => setOriginSelect(e)} onChange={(e) => { setOriginSelect(e.value); originRef.current = e.value.id; onChangePrice(); setChangeStatus(true) }} />
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Tujuan" showField="full_name" errors={errors} touched={touched} models={plantData}
                                                    queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => setPlantSelect(e)} onChange={(e) => { setPlantSelect(e.value); plantRef.current = e.value.id; onChangePrice(); setChangeStatus(true) }} />
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="product_id" title="Produk" showField="name" errors={errors} touched={touched} models={productData}
                                                    queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => setProductSelect(e)} onChange={(e) => { setProductSelect(e.value); productRef.current = e.value.id; onChangePrice(); setChangeStatus(true) }} />
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Jenis Truck" showField="name" errors={errors} touched={touched} models={fleetTypeData}
                                                    queryData={(e) => getFleetType(e)} value={fleetTypeSelect} setSelectValue={(e) => setFleetTypeSelect(e)} onChange={(e) => { setFleetTypeSelect(e.value); fleetRef.current = e.value.id; onChangePrice(); setChangeStatus(true) }} />
                                            </div>
                                            <div className="grid">
                                                <DropDownComp className="field col-12 md:col-2" validate={true} field="uom" title="Satuan" optionLabel="name" optionValue="name" options={unitData} value={unitSelect} errors={errors} touched={touched} onBlur={handleBlur}
                                                    onChange={(e) => { setUnitSelect(e.value); values.uom = e.value; unitRef.current = e.value; onChangePrice(); setChangeStatus(true) }} />
                                                <InputNumberComp className="field col-12 md:col-2" field="qty" title="Qty" value={values.qty} onChange={(e) => { values.qty = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="delivery" title="Kirim" disabled={true} value={values.delivery} onChange={(e) => { values.delivery = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="balance" title="Sisa" disabled={true} value={values.balance} onChange={(e) => { values.balance = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />                                                      
                                                <InputNumberComp className="field col-12 md:col-2" validate={true} field="price" title="Harga" disabled={true} value={price} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <div className="field col-12 md:col-2">
                                                    <Button label="Get Price" type="button" icon="pi pi-money-bill" className="p-button-outlined p-button-sm mt-5" onClick={() => onChangePrice()} />
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

export default React.memo(GlobalConsumer(PoSalesDetail), comparisonFn);
