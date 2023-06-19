import React, { useEffect, useState, useRef, Fragment } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { Panel } from "primereact/panel";

// Crud To Backend
import * as CrudTrx from '../../service/Sales/SalesPrice';

// Get Master From Backend
import * as OriginMaster from '../../service/Origin/OriginService';
import * as PlantMaster from '../../service/Customer/PlantService';
import * as ProductMaster from '../../service/Master/ProductService';
import * as FleetTypeMaster from '../../service/Fleet/FleetTypeService';
import * as SalesTypeMaster from '../../service/Sales/SalesType';
import * as OrderTypeMaster from '../../service/Sales/OrderTypeService';

// Get Global State
import { GlobalConsumer } from "../../config/Context";

// Component
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import LoadingDialogComp from "../../components/standard/Dialog/LoadingDialogComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import { formatDateString } from "../../helpers/FormatHelpers";
import InputDatePicker from "../../components/standard/Form/InputDatePicker";


const CostListDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef(null);

    const [salesTypeData, setSalesTypeData] = useState([]);
    const [salesTypeSelect, setSalesTypeSelect] = useState(null);
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
    const [visible, setVisible] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [waiting, setWaiting] = useState(false);
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
        effective_date: "",
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

    const getOrigin = async (keyword) => {
        const res = await OriginMaster.GetParentList(keyword);

        setOriginData(null);

        return res.data;
    }

    const getPlant = async (keyword) => {
        const res = await PlantMaster.GetAll(keyword);

        setPlantData(null);

        return res.data;
    }

    const getProduct = async (keyword) => {
        const res = await ProductMaster.GetList(keyword);

        setProductData(null);

        return res.data;
    }

    const getSalesType = async (keyword) => {
        const res = await SalesTypeMaster.GetList(keyword);

        setSalesTypeData(null);

        return res.data;
    }

    const getOrderType = async (keyword) => {
        if (salesTypeSelect) {
            const salesType = salesTypeSelect.name.toLowerCase().replace(" ", "");

            const res = await OrderTypeMaster.GetList(salesType, keyword);

            setOrderTypeData(null);

            return res.data;
        }
    }

    const getUnit = async () => {
        setUnitData(uomList);
    }

    const getFleetType = async (keyword) => {
        const res = await FleetTypeMaster.GetList(keyword);

        setFleetTypeData(null);

        return res.data;
    }

    const QueryData = async () => {
        if (id) {
            const res = await CrudTrx.GetByID(id);
            const querydata = res.data;
            setValues(querydata);

            setSalesTypeSelect(querydata.sales_type_id);

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
            setStatusNew(true);
        }

        setOrderTypeData(null);
        setSalesTypeData(null);
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
        if (salesTypeSelect) {
            values.sales_type_id.id = salesTypeSelect.id;
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
            result = await CrudTrx.PutData(values.id, form);
        } else {
            result = await CrudTrx.PostData(form);
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

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401) {

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        }
    };

    const { values, errors, touched, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/purchase/master/cost/list",
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
                    pathname: "/price/create",
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
                            <div className="col-12 md:col-12 lg:col-12">
                                <Panel header="Input Price" className="mb-3"> 

                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="sales_type_id" title="Bisnis Unit" placeholder="Enter sales type" showField="name" errors={errors} touched={touched} models={salesTypeData}
                                                    queryData={(e) => getSalesType(e)} value={salesTypeSelect} setSelectValue={(e) => setSalesTypeSelect(e)} onChange={(e) => { setSalesTypeSelect(e.value); setChangeStatus(true); setOrderTypeData(null); setOrderTypeSelect(null); }} />
                                            </div>
                                            <div className="grid">
                                                <InputDatePicker className="field col-12 md:col-2" validate={true} field="effective_date" title="Tgl Efektif" value={values.effective_date} onChange={(e) => values.effective_date = e.target.value} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputDatePicker className="field col-12 md:col-2" validate={true} field="expired_date" title="Tgl Berakhir" value={values.expired_date} onChange={(e) => values.expired_date = e.target.value} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            </div>
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="order_type_id" title="Jenis Transaksi" placeholder="Enter order type" showField="name" errors={errors} touched={touched} models={orderTypeData}
                                                    queryData={(e) => getOrderType(e)} value={orderTypeSelect} setSelectValue={(e) => setOrderTypeSelect(e)} onChange={(e) => { setOrderTypeSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="origin_id" title="Asal" placeholder="Enter origin" showField="name" errors={errors} touched={touched} models={originData}
                                                    queryData={(e) => getOrigin(e)} value={originSelect} setSelectValue={(e) => setOriginSelect(e)} onChange={(e) => { setOriginSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Plant" placeholder="Enter plant" showField="full_name" errors={errors} touched={touched} models={plantData}
                                                    queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => setPlantSelect(e)} onChange={(e) => { setPlantSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="product_id" title="Produk" placeholder="Enter product" showField="name" errors={errors} touched={touched} models={productData}
                                                    queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => setProductSelect(e)} onChange={(e) => { setProductSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Jenis Truck" placeholder="Enter fleet type" showField="name" errors={errors} touched={touched} models={fleetTypeData}
                                                    queryData={(e) => getFleetType(e)} value={fleetTypeSelect} setSelectValue={(e) => setFleetTypeSelect(e)} onChange={(e) => { setFleetTypeSelect(e.value); setChangeStatus(true) }} />
                                            </div>
                                            <div className="grid">
                                                <InputNumberComp className="field col-12 md:col-2" field="price" title="Harga" value={values.price} onChange={(e) => { values.price = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <DropDownComp className="field col-12 md:col-2" validate={true} field="uom" title="Satuan" placeholder="Enter uom" optionLabel="name" optionValue="name" options={unitData} value={unitSelect} errors={errors} touched={touched} onBlur={handleBlur}
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

export default React.memo(GlobalConsumer(CostListDetail), comparisonFn);
