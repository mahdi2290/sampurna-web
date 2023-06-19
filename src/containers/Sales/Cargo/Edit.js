import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { BlockUI } from "primereact/blockui";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { RadioButton } from "primereact/radiobutton";
import { Galleria } from "primereact/galleria";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from 'primereact/tabview';
import { formatDateString, formatDateTimeString } from "../../../helpers/FormatHelpers";
import MenubarComp from "../../../components/standard/Menu/MenubarComp";
import AutoCompleteComp from "../../../components/standard/Form/AutoCompleteComp";
import DatePickerComp from "../../../components/standard/Form/DatePickerComp";
import DateTimePickerComp from "../../../components/standard/Form/DateTimePickerComp";
import DropDownComp from "../../../components/standard/Form/DropDownComp";
import InputTextComp from "../../../components/standard/Form/InputTextComp";
import InputSwitchComp from "../../../components/standard/Form/InputSwitchComp";
import InputNumberComp from "../../../components/standard/Form/InputNumberComp";
import DOProduct from "./Product";

import { APIBisnisUnit, APICompany, APIDriverFormation, APIFleet, APIFleetType, APIOrderType, APIOriginChild, APIPlant, APIProduct } from "../../../components/api/APIMaster";
import * as HeaderService from '../../../service/Sales/OrderCargoDetailService';
import * as ProductService from '../../../service/Sales/OrderCargoProductService';
import * as ScheduleService from '../../../service/Sales/Schedule';
import * as UjtService from '../../../service/Ujt/UjtService';
import { GlobalConsumer } from "../../../config/Context";
import PostPutValidationComp from "../../../components/standard/Validation/PostPutValidationComp";
import CargoMemo from "./Memo";
import FileUploadComp from "../../../components/standard/Form/FileUploadComp";
import { Dialog } from "primereact/dialog";
import DataTableComp from "../../../components/standard/DataTable/DataTableComp";
import * as CookieConfig from './../../../config/CookieConfig';
import DeliveryReportPage from "./DeliveryReport";
import { Image } from "primereact/image";

const Example = (props) => {
//     const { onBackClick } = props;

//   return (
//     <div>
//       <div>
//         <Button
//           className="p-button-text p-button-sm"
//           onClick={onBackClick}
//         >
//           <i className="pi pi-chevron-left"></i>
//           <span className="px-1" style={{ marginTop: "3px" }}>
//             Back to Cargo List
//           </span>
//         </Button>
//         <p>INI EDIT yaahhh</p>
//       </div>
//     </div>
//   );
    const { id } = useParams();
    const toast = useRef();
    const history = useHistory();
    const [statusNew, setStatusNew] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState([0]);
    const [disabledEdit, setDisabledEdit] = useState(false);
    const [disabledOpen, setDisabledOpen] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionWindow, setActionWindow] = useState("crud");
    const [isVisibleDialog, setIsVisibleDialog] = useState(false);

    const issueDateRef = useRef();
    const originRef = useRef();
    const plantRef = useRef();
    const productRef = useRef();
    const fleetTypeRef = useRef();
    const fleetRef = useRef();
    const { onBackClick } = props;

    const emptyModel = {
        company_id: {id:0},
        schedule_id: {id:0},
        issue_date: formatDateString(new Date()),
        counter: "A",
        shift: 1,
        pool_id: { id:CookieConfig.get('pool_id') },
        sales_type_id: { id:0 },
        order_type_id: { id:0 },
        fleet_type_id: { id:0 },
        origin_id: { id:0 },
        plant_id: { id:0 },
        product_id: { id:0 },
        fleet_id: {id:0},
        po_id: { id:1 },
        employee_id: { id:0 },
        do_id: 1,
        do_no: "",
        ujt_id: 0,
        ujt: 0,
        multi_product: 0,
        primary_status: 0,
        secondary_status: 0,
        note: "",
        no_container: "",
        no_pto: "",
        no_di: "",
        sj_customer: "",
        sj_supplier: "",
        by_lift_off: 0,
        by_kawal: 0,
        by_loading: 0,
        by_additional: 0,
        memo_additional: "",
        returned: 0,
        receive_date: null,
        volume_origin: 0,
        volume_plant: 0,
        volume_netto: 0,
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        volume: 0,
        final_shift: 1,
        qty: 0,
        uom: "Kubikasi"
    }

    const emptyKasbonModel = {
        schedule_id: 0,
        id: 0,
        issue_date: formatDateString(new Date()),
        cashier_type_id: { id: 0, name: "" },
        amount: 0,
        memo: "",
        counter: "A",
        shift: "1",
    }

    const [onGoindModels, setOnGoindModels] = useState([]);
    const [gantunganModels, setGantunganModels] = useState([]);
    const [primaryModels, setPrimaryModels] = useState([]);
    const [secondaryModels, setSecondaryModels] = useState([]);

    const shiftData = [
        { name: 1 },
        { name: 2 },
        { name: 3 }
    ];

    const uomList = [
        { name: "Tonase" },
        { name: "Kubikasi" },
        { name: "Rit" },
    ];

    const driverModel = {
        id: 0,
        name: "",
        license_no: "",
        license_type: "",
        license_exp_date: "",
        join_date: "",
        bank_no: "",
        phone: "",
        image: "",
    }

    let ujtModel = { id: 0, ujt: 0, ritase: 0};

    const [scheduleData, setScheduleData] = useState([]);
    const [scheduleSelect, setScheduleSelect] = useState(null);
    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [businessData, setBusinessData] = useState([]);
    const [businessSelect, setBusinessSelect] = useState(null);
    const [orderTypeData, setOrderTypeData] = useState([]);
    const [orderTypeSelect, setOrderTypeSelect] = useState(null);
    const [originData, setOriginData] = useState([]);
    const [originSelect, setOriginSelect] = useState(null);
    const [plantData, setPlantData] = useState([]);
    const [plantSelect, setPlantSelect] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productSelect, setProductSelect] = useState(null);
    const [fleetData, setFleetData] = useState([]);
    const [fleetSelect, setFleetSelect] = useState({
        id: 0, plate_no: "Pilih kendaraan"
    });
    const [fleetTypeData, setFleetTypeData] = useState([]);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);

    const [driverBatang, setDriverBatang] = useState(driverModel);
    const [driverSerep, setDriverSerep] = useState(driverModel);

    const [finalShiftSelect, setFinalShiftSelect] = useState(null);
    // const [shiftSelect, setShiftSelect] = useState(null);
    const [unitSelect, setUnitSelect] = useState(null);

    const [returnedFlag, setReturnedFlag] = useState(false);
    const [multiProduct, setMultiProductFlag] = useState(false);
    const [ujtData, setUjtData] = useState(ujtModel);
    const [running, setRunning] = useState('1');

    const [errorList, setErrorList] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [storePost, setStorePost] = useState([]);
    const [storePut, setStorePut] = useState([]);
    const [storeDelete, setStoreDelete] = useState([]);

    const [images, setImages] = useState(null);

    const [volume, setVolume] = useState(0);
    const [isVisiblePrint, setIsVisiblePrint] = useState(false);

    let emptyDetailModel = {
        id: 0,
        product_name: "",
        qty: 0,
        uom: "",
        delivery_address: ""
    };

    const getCompany = async(keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

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

    const getFleetType = async (keyword) => {
        if (businessSelect) {
            const res = await APIFleetType(businessSelect.id, keyword);

            setFleetTypeData(null);

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

    const getSchedule = async () => {
        if (businessSelect) {
            const currentDate = issueDateRef.current === 'undefined' ? formatDateString(new Date()) : issueDateRef.current;

            const res = await ScheduleService.GetList(businessSelect.id, { issue_date: currentDate, order_id: id });

            setScheduleData(null);

            if (res.status === 200) {
                return res.data;
            }
        } else {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: "Silakan pilih dahulu bisnis unit!!!", life: 3000 });
        }
    }

    const getScheduleData = async (id) => {
        const result = await ScheduleService.GetByID(id);

        if (result.status === 200) {
            setBusinessSelect(result.data.sales_type_id);
            setOrderTypeSelect(result.data.order_type_id);
            setOriginSelect(result.data.origin_id);
            setPlantSelect(result.data.plant_id);
            setOriginSelect(result.data.origin_id);
            setFleetTypeSelect(result.data.fleet_type_id);
            setMultiProductFlag(false);

            if (result.data.multi_product === 1) {
                setMultiProductFlag(true);
            } else {
                setProductSelect(result.data.product_id);
            }

            values.company_id.id = result.data.company_id.id;
            values.sales_type_id.id = result.data.sales_type_id.id;
            values.schedule_id.id = result.data.id;
            values.fleet_type_id.id = result.data.fleet_type_id.id;
            // values.customer_id.id = result.data.customer_id.id;
            values.order_type_id.id = result.data.order_type_id.id;
            values.origin_id.id = result.data.origin_id.id;
            values.plant_id.id = result.data.plant_id.id;
            values.product_id.id = result.data.product_id.id;
            values.multi_product = result.data.multi_product;

            originRef.current = result.data.origin_id.id;
            plantRef.current = result.data.plant_id.id;
            productRef.current = result.data.product_id.id;
            fleetTypeRef.current = result.data.fleet_type_id.id;

            onChangePrice();
        } else {
            setOrderTypeSelect(null);
            setOriginSelect(null);
            setPlantSelect(null);
            setFleetTypeSelect(null);
            setMultiProductFlag(false);

            values.order_type_id.id = 0;
            values.origin_id.id = 0;
            values.plant_id.id = 0;
            values.product_id.id = 0;
            values.multi_product = 0;

            originRef.current = 0;
            plantRef.current = 0;
            productRef.current = 0;
            fleetTypeRef.current = 0;
        }

        setDisabledEdit(true);
    }

    const getScheduleAdd = async (id) => {
        const result = await ScheduleService.GetByID(id);

        if (result.status === 200) {
            setChangeStatus(true);
            emptyModel.issue_date = result.data.issue_date;
            emptyModel.company_id.id = result.data.company_id.id;
            emptyModel.schedule_id.id = result.data.id;

            setValues(emptyModel);
            issueDateRef.current = result.data.issue_date;
            setCompanySelect(result.data.company_id);
            setBusinessSelect(result.data.sales_type_id);
            setScheduleSelect(result.data);
            setOrderTypeSelect(result.data.order_type_id);
            setOriginSelect(result.data.origin_id);
            setPlantSelect(result.data.plant_id);
            setOriginSelect(result.data.origin_id);
            setFleetTypeSelect(result.data.fleet_type_id);
            setMultiProductFlag(false);
            if (result.data.multi_product === 1) {
                setMultiProductFlag(true);
            } else {
                setProductSelect(result.data.product_id);
            }

            values.sales_type_id.id = result.data.sales_type_id.id;
            values.order_type_id.id = result.data.order_type_id.id;
            values.origin_id.id = result.data.origin_id.id;
            values.plant_id.id = result.data.plant_id.id;
            values.product_id.id = result.data.product_id.id;
            values.multi_product = result.data.multi_product;

            originRef.current = result.data.origin_id.id;
            plantRef.current = result.data.plant_id.id;
            productRef.current = result.data.product_id.id;
            fleetTypeRef.current = result.data.fleet_type_id.id;

            setDisabledEdit(true);
            setStatusNew(true);
            onChangePrice();
        } else {
            setBusinessSelect(null);
            setOrderTypeSelect(null);
            setOriginSelect(null);
            setPlantSelect(null);
            setOriginSelect(null);
            setMultiProductFlag(false);

            values.order_type_id.id = 0;
            values.origin_id.id = 0;
            values.plant_id.id = 0;
            values.product_id.id = 0;
            values.multi_product = 0;

            originRef.current = 0;
            plantRef.current = 0;
            productRef.current = 0;
            fleetTypeRef.current = 0;

            setDisabledEdit(false);
            setStatusNew(false);
        }

        setCompanyData(null);
        setBusinessData(null);
        setScheduleData(null);
        setOrderTypeData(null);
        setOriginData(null);
        setPlantData(null);
        setProductData(null);
        setFleetData(null);
        setFleetTypeData(null);
    }

    const getFleet = async(page, rows, keyword) => {
        const params = {
            fleet_type_id: fleetTypeRef.current,
            keyword: keyword,
        }

        const res = await APIFleet(businessSelect.id, params);

        setFleetData(res);

        return res;
    }

    const getDriver = async(fleet) => {
        const issue_date = issueDateRef.current;

        if (fleet === undefined) return
        setWaiting(true);

        const order_id = id === undefined ? 0 : id;

        const data = await APIDriverFormation(issue_date, order_id, fleet);

        setPrimaryModels([]);
        setSecondaryModels([]);
        setOnGoindModels([]);
        setGantunganModels([]);

        if (data) {
            if (data.primary_driver) {
                const employeeModel = {
                    id: data.primary_driver.id,
                    name: data.primary_driver.name,
                    license_no: data.primary_driver.license_no,
                    license_type: data.primary_driver.license_type,
                    license_exp_date: data.primary_driver.license_exp_date === null ? "" : data.primary_driver.license_exp_date,
                    join_date: data.primary_driver.join_date === null ? "" : data.primary_driver.join_date,
                    bank_no: data.primary_driver.bank_no,
                    phone: data.primary_driver.phone,
                    image: data.primary_driver.image_data,
                }

                if (data.primary_driver.employee_memo_pot_current !== null) {
                    setOnGoindModels(data.primary_driver.employee_memo_pot_current);
                }

                if (data.primary_driver.employee_memo_pot !== null) {
                    setGantunganModels(data.primary_driver.employee_memo_pot);
                }

                setPrimaryModels(data.primary_driver);

                setDriverBatang(employeeModel);
                values.employee_id.id = data.id;
            } else {
                const employeeModel = {
                    id: 0,
                    name: "",
                    license_no: "",
                    license_type: "",
                    license_exp_date: "",
                    join_date: "",
                    bank_no: "",
                    phone: "",
                    image: "",
                }
                setDriverBatang(employeeModel);
                values.employee_id.id = 0;
            }

            if (data.secondary_driver) {
                const employeeModel = {
                    id: data.secondary_driver.id,
                    name: data.secondary_driver.name,
                    license_no: data.secondary_driver.license_no,
                    license_type: data.secondary_driver.license_type,
                    license_exp_date: data.secondary_driver.license_exp_date === null ? "" : data.secondary_driver.license_exp_date,
                    join_date: data.secondary_driver.join_date === null ? "" : data.secondary_driver.join_date,
                    bank_no: data.secondary_driver.bank_no,
                    phone: data.secondary_driver.phone,
                    image: data.secondary_driver.image_data,
                }

                if (data.secondary_driver.employee_memo_pot_current !== null) {
                    setOnGoindModels(data.secondary_driver.employee_memo_pot_current);
                }

                if (data.secondary_driver.employee_memo_pot !== null) {
                    setGantunganModels(data.secondary_driver.employee_memo_pot);
                }

                setSecondaryModels(data.secondary_driver);

                setDriverSerep(employeeModel);
                values.employee_id.id = data.id;
            } else {
                const employeeModel = {
                    id: 0,
                    name: "",
                    license_no: "",
                    license_type: "",
                    license_exp_date: "",
                    join_date: "",
                    bank_no: "",
                    phone: "",
                    image: "",
                }
                setDriverSerep(employeeModel);
                values.employee_id.id = 0;
            }

            setWaiting(false);
            return true;
        }

        setWaiting(false);
        return false
    }

    const getUjt = async (issueDate, origin, plant, product, fleetType) => {
        const res = await UjtService.GetPrice(issueDate, origin, plant, product, fleetType);

        if ( res.status === 200 ) {
            return res.data;
        }

        return ujtModel;
    }

    const onChangeMultiProduct = (e) => {
        setMultiProductFlag(e.value);
        values.multi_product = e.value ? 1 : 0;

        if (e) {
            setProductSelect(null);
            productRef.current = 0;
            values.product_id.id = 0;

            onChangePrice();
        }
    }

    const QueryData = async () => {
        setWaiting(true);

        props.dispatch({ type: "add-data", id:'kasbon', data: [] });
        props.dispatch({ type: "add-data", id:'product', data: [] });

        if (id) {
            const res = await HeaderService.GetByID(id);

            if (res.status === 200) {
                const data = res.data;

                if (data.status_id === 0 || data.status_id === 1) {
                    setDisabledOpen(false);
                    setActionWindow("crud-sj-assign");
                } else if (data.status_id === 2) {
                    setDisabledOpen(true);
                    setActionWindow("crud-sj-cancel");
                } else if (data.status_id === 10) {
                    setDisabledOpen(true);
                    setActionWindow("crud-sj-update-close");
                } else if (data.status_id < 10) {
                    setDisabledOpen(true);
                    setActionWindow("crud-update");
                } else {
                    setDisabledOpen(true);
                    setActionWindow("back-new");
                }

                setValues(data);

                setDisabledEdit(true);

                setVolume(data.length * data.width * data.height);

                setScheduleSelect(data.schedule_id);
                setBusinessSelect(data.sales_type_id);
                setCompanySelect(data.company_id);
                setOrderTypeSelect(data.order_type_id);
                setOriginSelect(data.origin_id);
                setPlantSelect(data.plant_id);
                setFleetTypeSelect(data.fleet_type_id);
                setProductSelect(data.product_id);
                // setShiftSelect(data.shift);
                setFleetSelect(data.fleet_id);
                setMultiProductFlag(data.multi_product === 1 ? true : false);
                setReturnedFlag(data.returned === 1 ? true : false);
                setUnitSelect(data.uom);

                setFinalShiftSelect(data.final_shift);

                if (data.image_data !== null) {
                    setImages(data.image_data);
                }

                ujtModel = { id: data.ujt_id, ujt: data.ujt, ritase: 0};

                setUjtData(ujtModel);

                if (data.product_list != null) {
                    setStoreList(data.product_list);
                }

                issueDateRef.current = data.issue_date;
                originRef.current = data.origin_id.id;
                plantRef.current = data.plant_id.id;
                productRef.current = data.product_id.id;
                fleetTypeRef.current = data.fleet_type_id.id;
                fleetRef.current = data.fleet_id.plate_no;

                setPrimaryModels([]);
                setSecondaryModels([]);
                setOnGoindModels([]);
                setGantunganModels([]);
                if (data.primary_driver !== null) {
                    const employeeModel = {
                        id: data.primary_driver.id,
                        name: data.primary_driver.name,
                        license_no: data.primary_driver.license_no,
                        license_type: data.primary_driver.license_type,
                        license_exp_date: data.primary_driver.license_exp_date === null ? "" : data.primary_driver.license_exp_date,
                        join_date: data.primary_driver.join_date === null ? "" : data.primary_driver.join_date,
                        bank_no: data.primary_driver.bank_no,
                        phone: data.primary_driver.phone,
                        image: data.primary_driver.image_data,
                    }

                    if (data.primary_driver.employee_memo_pot_current !== null) {
                        setOnGoindModels(data.primary_driver.employee_memo_pot_current);
                    }

                    if (data.primary_driver.employee_memo_pot !== null) {
                        setGantunganModels(data.primary_driver.employee_memo_pot);
                    }

                    setPrimaryModels(data.primary_driver);

                    setDriverBatang(employeeModel);
                    values.employee_id.id = data.id;
                } else {
                    const employeeModel = {
                        id: 0,
                        name: "",
                        license_no: "",
                        license_type: "",
                        license_exp_date: "",
                        join_date: "",
                        bank_no: "",
                        phone: "",
                        image: "",
                    }
                    setDriverBatang(employeeModel);
                    values.employee_id.id = 0;
                }

                if (data.secondary_driver !== null) {
                    const employeeModel = {
                        id: data.secondary_driver.id,
                        name: data.secondary_driver.name,
                        license_no: data.secondary_driver.license_no,
                        license_type: data.secondary_driver.license_type,
                        license_exp_date: data.secondary_driver.license_exp_date === null ? "" : data.secondary_driver.license_exp_date,
                        join_date: data.secondary_driver.join_date === null ? "" : data.secondary_driver.join_date,
                        bank_no: data.secondary_driver.bank_no,
                        phone: data.secondary_driver.phone,
                        image: data.secondary_driver.image_data,
                    }

                    if (data.secondary_driver.employee_memo_pot_current !== null) {
                        setOnGoindModels(data.secondary_driver.employee_memo_pot_current);
                    }

                    if (data.secondary_driver.employee_memo_pot !== null) {
                        setGantunganModels(data.secondary_driver.employee_memo_pot);
                    }

                    setSecondaryModels(data.secondary_driver);

                    setDriverSerep(employeeModel);
                    values.employee_id.id = data.id;
                } else {
                    const employeeModel = {
                        id: 0,
                        name: "",
                        license_no: "",
                        license_type: "",
                        license_exp_date: "",
                        join_date: "",
                        bank_no: "",
                        phone: "",
                        image: "",
                    }
                    setDriverSerep(employeeModel);
                    values.employee_id.id = 0;
                }

                if (data.primary_status === 1){
                    setRunning('1')
                } else if (data.secondary_status === 1) {
                    setRunning('2')
                }

                setStatusNew(false);
            }
        } else {
            setActionWindow('crud');

            setValues(emptyModel);
            setStatusNew(true);

            setScheduleSelect(null);
            setCompanySelect(null);
            setBusinessSelect(null);
            setBusinessSelect(null);
            setOriginSelect(null);
            setPlantSelect(null);
            setProductSelect(null);
            setUnitSelect(uomList[0].name);

            issueDateRef.current = formatDateString(new Date());
        }

        setChangeStatus(false);

        setCompanyData(null);
        setBusinessData(null);
        setScheduleData(null);
        setOrderTypeData(null);
        setOriginData(null);
        setPlantData(null);
        setProductData(null);
        setFleetData(null);
        setFleetTypeData(null);
        setWaiting(false);
    }

    const setErrorData = (id) => {
        setErrorList(prevState => [...prevState, { id: id }]);
    }

    const pushDataDetail = async(data_id) => {
        let error = parseInt(0);
        if (storePost) {
            for (var i = 0; i < storePost.length; i++) {
                const form = new FormData();
                const row = storePost[i];
                let status = false;

                form.append("order_id", data_id);
                Object.keys(emptyDetailModel).map(key => {
                    if (emptyDetailModel[key]["id"] === 0) {
                        form.append(key, row[key]["id"]);
                    } else {
                        form.append(key, row[key]);
                    }
                    return form;
                });

                let result = await ProductService.PostData(form);
                if (result.status === 200) {
                    props.dispatch({ type: "error-false" });
                } else if (result.status === 400) {
                    status = props.dispatch({ type: "error-true" });
                    setErrorData(row.id);

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
        if (storePut) {
            for (var k = 0; k < storePut.length; k++) {
                const form = new FormData();
                const row = storePut[k];
                let status = false;

                form.append("order_id", data_id);
                Object.keys(emptyDetailModel).map(key => {
                    if (emptyDetailModel[key]["id"] === 0) {
                        form.append(key, row[key]["id"]);
                    } else {
                        form.append(key, row[key]);
                    }
                    return form;
                });

                let result = await ProductService.PutData(row.id, form);
                if (result.status === 200) {
                    props.dispatch({ type: "error-false" });
                } else if (result.status === 400) {
                    status = props.dispatch({ type: "error-true" });
                    setErrorData(row.id);

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

                let result = await ProductService.DeleteData(data_id, form);

                return result.status;
            })
            setStoreDelete([]);
        }
        return error;
    }

    const actionFinal = (count, data_id, message) => {
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
                        pathname: "/sales/cargo/order/edit/" + data_id,
                        state: {}
                    });
                }
                window.location.reload();
            }, 1000);
        } else {
            setWaiting(false);
        }
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);
        setBlocked(true);
        setErrorList([]);

        let form = null;
        let result = null;

        form = new FormData();

        values.volume = volume;

        Object.keys(emptyModel).map(key => {
            if (key === "receive_date") {
                if (values.receive_date === null) {
                    values.receive_date = ""
                } else {
                    let parseDate = new Date(values.receive_date);
                    if (parseDate === "Invalid Date" || isNaN(parseDate)) {
                        values.receive_date = ""
                    } else {
                        values.receive_date = formatDateTimeString(parseDate);
                    }
                }
                form.append(key, values[key]);
            } else if (key === 'employee_id') {
                if (running === '1') {
                    form.append('employee_id', driverBatang.id)
                } else if ( running === '2') {
                    form.append('employee_id', driverSerep.id)
                } else {
                    form.append('employee_id', values.employee_id.id)
                }
            } else if (key === 'primary_status') {
                if (running === '1') {
                    form.append('primary_status', 1)
                } else {
                    form.append('primary_status', 0)
                }
            } else if (key === 'secondary_status') {
                if (running === '2') {
                    form.append('secondary_status', 1)
                } else {
                    form.append('secondary_status', 0)
                }
            } else {
                if (emptyModel[key].hasOwnProperty('id')) {
                    form.append(key, values[key]["id"]);
                } else {
                    form.append(key, values[key]);
                }
            }
            return form;
        });

        let memo = "";
        if (onGoindModels) {
            let count = onGoindModels.length;

            for (var i = 0; i < count; i++) {
                const row = onGoindModels[i];

                memo = memo + row.id;

                if (i < (count - 1)) {
                    memo = memo + ",";
                }
            };
        }

        form.append('memo_ids', memo);

        // console.log([...form])

        if (id > 0) {
            result = await HeaderService.PutData(id, form);
        } else {
            result = await HeaderService.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id;
            } else {
                data_id = result.data.id;
            }

            let errorCount = parseInt(0);

            errorCount = await pushDataDetail(data_id);

            actionFinal(errorCount, data_id, result.message);
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
        setBlocked(false);
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited
    });

    const backDialog = () => {
        if (changeStatus === false) {
            backURL();
        } else {
            setVisible(true);
        }
    };

    const backURL = () => {
        onBackClick()
        // history.push({
        //     pathname: "/sales/cargo/order/list",
        // });
    };

    const actionNew = () => {
        if (statusNew) {
            window.location.reload();
        } else {
            history.push({
                pathname: "/sales/cargo/order/create",
                state: {},
            });
            window.location.reload();
        }
    };

    const confirmSJ = async(value) => {
        setWaiting(true);
        setBlocked(true);

        const form = new FormData();

        let memo = "";
        if (onGoindModels) {
            let count = onGoindModels.length;

            for (var i = 0; i < count; i++) {
                const row = onGoindModels[i];

                memo = memo + row.id;

                if (i < (count - 1)) {
                    memo = memo + ",";
                }
            };
        }

        form.append('status', value);
        form.append('memo_ids', memo);

        // console.log([...form])

        const result = await HeaderService.Confirm(id, form);

        if (result.status === 200 ) {
            QueryData();
            toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });
        } else {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        }
        setWaiting(false);
        setBlocked(false);
    }

    const closeSJ = async() => {
        setWaiting(true);
        setBlocked(true);
        const result = await HeaderService.Close(id);

        if (result.status === 200 ) {
            QueryData();
            toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });
        } else {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        }
        setWaiting(false);
        setBlocked(false);
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "new":
                actionNew();
                break;

            case "save":
                handleSubmit();
                break;

            case "assign":
                confirmSJ(1);
                break;

            case "cancel":
                confirmSJ(0);
                break;

            case "close":
                closeSJ();
                break;

            case "print":
                setIsVisiblePrint(true);
                break;

            default:
                break;
        }
    };

    const onChangePrice = async() => {
        let effective = issueDateRef.current;
        let origin = originRef.current === undefined ? 0 : originRef.current;
        let plant = plantRef.current === undefined ? 0 : plantRef.current;
        let product = productRef.current === undefined ? 0 : productRef.current;
        let fleet_type = fleetTypeRef.current === undefined ? 0 : fleetTypeRef.current;

        if (origin > 0 && plant > 0 && fleet_type > 0) {
            let data = await getUjt(
                effective,
                origin,
                plant,
                product,
                fleet_type,
            );

            setUjtData(data);
            values.ujt_id = data.id;
            values.ujt = data.ujt;
        }
    }

    const onChangeDate = (e) => {
        values.issue_date = e;
        issueDateRef.current = e;
        setChangeStatus(true);
    }

    const onChangeSchedule = (e) => {
        setCompanySelect(e.value.company_id);
        setScheduleSelect(e.value);
        getScheduleData(e.value.id);
        onChangePrice();
        setChangeStatus(true);
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

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap justify-content-left card-container blue-container">
                <div className="text-black flex align-items-left justify-content-left">
                    {item.schedule_no}
                    <br/>
                    {item.customer_id.name}
                    <br/>
                    {item.origin_id.name}
                    <br/>
                    {item.plant_id.full_name}
                </div>
                <Divider />
            </div>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    const imageTemplate = (item) => {
        return <img src={item.image_data} alt={item.id} style={{ width: '100%' }} />
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.image_data} alt={item.id} width="150" />
    }

    const onImageUpload = async({files}) => {
        const form = new FormData();

        files.forEach(file=>{
            form.append("file", file);
        });

        await HeaderService.PostImage(id, form);

        QueryData();
    }

    useEffect(() => {
        setActionWindow('crud');
        setOnGoindModels([]);
        setGantunganModels([]);
        const schedule = props.dispatch({ type: "get-data", id: 'schedule'});

        if (schedule) {
            if (schedule.data > 0) {
                getScheduleAdd(schedule.data);
                onChangePrice();
            } else {
                QueryData();
            }
        } else {
            QueryData();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const columnsTable = [
        { field: 'sales_type_id.name', header: 'Bisnis Unit', sortable: false, style: "precent", width: { width: '245px' }, frozen:false },
        { field: 'fleet_type_id.name', header: 'Jenis Kendaraan', sortable: false, style: "fix", width: { width: '200px' }, frozen:false },
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "fix", width: { width: '110px' }, frozen:false },
        { field: 'action', header: '', },
    ];

    const hideDialog = () => {
        setIsVisibleDialog(false);
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
        </>
    );

    const hideDialogPrint = () => {
        setIsVisiblePrint(false);
    }

    const dialogFooterPrint = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialogPrint} />
        </>
    );

    const onClick = async() => {
        setWaiting(true);
        await getFleet(1, 10, "");
        setWaiting(false);
        setIsVisibleDialog(true);
    }

    const onRowDoubleClick = async(e) => {
        setFleetSelect(e.data);
        const res = await getDriver(e.data.plate_no);
        if (res) {
            values.fleet_id = e.data;
            setIsVisibleDialog(false);
        }
    }

    const actionEdit = async(data) => {
        setFleetSelect(data);
        const res = await getDriver(data.plate_no);
        if (res) {
            values.fleet_id = data;
            setIsVisibleDialog(false);
        }
    }

    const onKeyDownSearch = async() => {
        if (fleetData) {
            if (fleetData.length > 0) {
                const plate_no = fleetData[0].plate_no;

                const res = await getDriver(plate_no);
                if (res) {
                    setFleetSelect(fleetData[0]);
                    values.fleet_id = fleetData[0];
                    setIsVisibleDialog(false);
                }
            }
        }
    }

    const selectButton = (status_id) => {
        let className = ""

        switch (status_id) {
            case 0:
                className = "p-button-secondary p-button-outlined justify-content-center mb-3"
                break;
            case 1:
                className = "p-button-danger p-button-outlined justify-content-center mb-3"
                break;
            case 2:
                className = "p-button-warning p-button-outlined justify-content-center mb-3"
                break;
            case 3:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 4:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 5:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 6:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 7:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 8:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 9:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 10:
                className = "p-button-success p-button-outlined justify-content-center mb-3"
                break;
            case 11:
                className = "p-button-success justify-content-center mb-3"
                break;
            case 12:
                className = "p-button-success justify-content-center mb-3"
                break;
            case 13:
                className = "p-button-danger justify-content-center mb-3"
                break;
            case 14:
                className = "p-button-danger justify-content-center mb-3"
                break;

            default:
                className = "p-button-secondary p-button-outlined justify-content-center mb-3"

                break;
        }
        return className;
    }

    useEffect(()=> {
        if (running === '1') {
            setOnGoindModels([]);
            setGantunganModels([]);
            if (primaryModels.employee_memo_pot_current !== null) {
                setOnGoindModels(primaryModels.employee_memo_pot_current);
            }
            if (primaryModels.employee_memo_pot !== null) {
                setGantunganModels(primaryModels.employee_memo_pot);
            }
        } else if (running === '2') {
            setOnGoindModels([]);
            setGantunganModels([]);
            if (secondaryModels.employee_memo_pot_current !== null) {
                setOnGoindModels(secondaryModels.employee_memo_pot_current);
            }
            if (secondaryModels.employee_memo_pot !== null) {
                setGantunganModels(secondaryModels.employee_memo_pot);
            }
        }
    }, [running]);

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <MenubarComp field="toolbar-detail" action={actionWindow} actionButton={(e) => actionButtonToolbar(e)} />
                    </div>

                    <div className="col-12">
                        <TabView>
                            <TabPanel header="Surat Jalan">
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <Accordion  activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} multiple>
                                        <AccordionTab header="Input Jadwal">
                                            <div className="p-fluid">
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <Panel header="Input" className="h-full">
                                                            <div className="grid">
                                                                <div className="col-8">
                                                                    <Button type="button" disabled={disabledOpen} label={fleetSelect.plate_no} className="btn-p-button-secondary p-button-outlined mb-3" onClick={onClick} />
                                                                </div>
                                                                <div className="col-4">
                                                                    <Button type="button" className={selectButton(values.status_id)}>
                                                                        {values.status ?? 'Draft'}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="grid">
                                                                <div className="col-12 md:col-6 lg:col-6">
                                                                    <Panel header="Batang">
                                                                        <div className="circle mb-3">
                                                                            <Image src={driverBatang.image} alt="Image" preview className="circle-img" />
                                                                        </div>
                                                                        <div className="field flex align-items-center">
                                                                            <RadioButton inputId="running1" name="running" value="1" disabled={disabledOpen} onChange={(e) => setRunning(e.value)} checked={running === '1'} />
                                                                            <label htmlFor="running1" className="ml-2">Batang</label>
                                                                        </div>
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="employee_id" title="Nama" value={driverBatang.name} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="phone" title="Telepon" value={driverBatang.phone} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="bank_no" title="No Rekening" value={driverBatang.bank_no} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="license_type" title="Jenis SIM" value={driverBatang.license_type} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="license_no" title="No SIM" value={driverBatang.license_no} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="license_exp_date" title="Tgl Expired" value={driverBatang.license_exp_date} onChange={handleChange} disabled={true} />
                                                                    </Panel>
                                                                </div>
                                                                <div className="col-12 md:col-6 lg:col-6">
                                                                    <Panel header="Serep">
                                                                        <div className="circle mb-3">
                                                                            <Image src={driverSerep.image} alt="Image" preview className="circle-img" />
                                                                        </div>
                                                                        <div className="field flex align-items-center">
                                                                            <RadioButton inputId="running2" name="running" value="2" disabled={disabledOpen} onChange={(e) => setRunning(e.value)} checked={running === '2'} />
                                                                            <label htmlFor="running2" className="ml-2">Serep</label>
                                                                        </div>
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="employee_id" title="Nama" value={driverSerep.name} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="phone" title="Telepon" value={driverSerep.phone} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="bank_no" title="No Rekening" value={driverSerep.bank_no} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="license_type" title="Jenis SIM" value={driverSerep.license_type} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="license_no" title="No SIM" value={driverSerep.license_no} onChange={handleChange} disabled={true} />
                                                                        <InputTextComp className="field col-12 md:col-12" validate={false} field="license_exp_date" title="Tgl Expired" value={driverSerep.license_exp_date} onChange={handleChange} disabled={true} />
                                                                    </Panel>
                                                                </div>
                                                            </div>
                                                        </Panel>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <Panel header="Informasi" className="h-full">
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="company_id" title="Grup Perusahaan"  showField="name" errors={errors} touched={touched}
                                                                models={companyData} queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => { setCompanySelect(e); values.company_id.id = e.id; }} onChange={(e) => { setCompanySelect(e.value); values.company_id.id = e.value.id; }}
                                                                disabled={true} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="sales_type_id" title="Bisnis Unit"  showField="name" errors={errors} touched={touched}
                                                                models={businessData} queryData={(e) => getBusiness(e)} value={businessSelect} setSelectValue={(e) => { setBusinessSelect(e); values.sales_type_id.id = e.id; }} onChange={(e) => { setBusinessSelect(e.value); values.sales_type_id.id = e.value.id; }}
                                                                disabled={disabledEdit} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="schedule_id" title="No Jadwal"  showField="schedule_no" errors={errors} touched={touched}
                                                                disabled={disabledOpen} models={scheduleData} itemTemplate={itemTemplate} queryData={(e) => getSchedule(e)} value={scheduleSelect} setSelectValue={(e) => setScheduleSelect(e)} onChange={(e) => { onChangeSchedule(e); }} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="fleet_type_id" title="Jenis Truk" showField="name" errors={errors} touched={touched} models={fleetTypeData}
                                                                disabled={disabledEdit} queryData={(e) => getFleetType(e)} value={fleetTypeSelect} setSelectValue={(e) => { setFleetTypeSelect(e); e ? values.fleet_type_id.id = e.id : values.fleet_type_id.id = 0; setFleetSelect({id:0, plate_no:""}) }} onChange={(e) => { setFleetTypeSelect(e.value); fleetTypeRef.current = e.value.id; setFleetSelect({id:0, plate_no:""}); setChangeStatus(true) }} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="order_type_id" title="Jenis Transaksi" showField="name" errors={errors} touched={touched} models={orderTypeData}
                                                                disabled={!returnedFlag} queryData={(e) => getOrderType(e)} value={orderTypeSelect} setSelectValue={(e) => { setOrderTypeSelect(e); values.order_type_id.id = e.id; }} onChange={(e) => { setOrderTypeSelect(e.value); values.order_type_id.id = e.value.id; onChangePrice(); setChangeStatus(true) }} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="origin_id" title="Asal" showField="name" errors={errors} touched={touched} models={originData}
                                                                disabled={!returnedFlag} queryData={(e) => getOrigin(e)} value={originSelect} setSelectValue={(e) => { setOriginSelect(e); originRef.current = e.id; values.origin_id.id = e.id; }} onChange={(e) => { setOriginSelect(e.value); originRef.current = e.value.id; onChangePrice(); values.origin_id.id = e.value.id; setChangeStatus(true) }} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="plant_id" title="Tujuan" showField="full_name" errors={errors} touched={touched} models={plantData}
                                                                disabled={!returnedFlag} queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => { setPlantSelect(e); plantRef.current = e.id;  values.plant_id.id = e.id; }} onChange={(e) => { setPlantSelect(e.value); plantRef.current = e.value.id; onChangePrice(); values.plant_id.id = e.value.id; setChangeStatus(true) }} />
                                                            <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="product_id" title="Produk" showField="name" errors={errors} touched={touched} models={productData}
                                                                disabled={!returnedFlag} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setProductSelect(e); onChangePrice(); }} onChange={(e) => { setProductSelect(e.value); productRef.current = e.value.id; values.product_id.id = e.value.id; setChangeStatus(true) }} />
                                                        </Panel>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <Panel header="Cost">
                                                            <InputTextComp className="field col-12 md:col-12" validate={false} field="reference_no" title="Nomor SJ" value={values.reference_no} onChange={handleChange} disabled={true} />
                                                            <DatePickerComp disabled={disabledEdit} className="field col-12 md:col-12" validate={true} field="issue_date" title="Tgl Surat Jalan" value={values.issue_date} onChange={(e) => { onChangeDate(e) }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                            <div className="grid ml-1 mr-1">
                                                                <InputNumberComp className="field col-12 md:col-6" validate={true} field="ujt_id" title="UJT" disabled={true} value={ujtData.ujt} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                <div className="field col-12 md:col-6">
                                                                    <Button label="Get UJT" type="button" disabled={returnedFlag ? false : disabledOpen} icon="pi pi-money-bill" className="p-button-outlined p-button-sm mt-5" onClick={() => onChangePrice()} />
                                                                </div>
                                                            </div>
                                                            <div className="p-fluid grid">
                                                                <InputNumberComp className="field col-12 md:col-6" field="by_lift_off" title="Biaya Lift Off" value={values.by_lift_off} onBlur={handleBlur} onChange={(e) => { values.by_lift_off = e.value; }} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                <InputNumberComp className="field col-12 md:col-6" field="by_kawal" title="Biaya Kawal" value={values.by_kawal} onBlur={handleBlur} onChange={(e) => { values.by_kawal = e.value; }} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                <InputNumberComp className="field col-12 md:col-6" field="by_loading" title="Biaya Loading" value={values.by_loading} onBlur={handleBlur} onChange={(e) => { values.by_loading = e.value; }} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                <InputNumberComp className="field col-12 md:col-6" field="by_additional" title="Biaya Tambahan" value={values.by_additional} onBlur={handleBlur} onChange={(e) => { values.by_additional = e.value; }} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            </div>
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="memo_additional" title="Memo Tambahan" value={values.memo_additional} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                        </Panel>
                                                        <Panel header="SJ Kembali" className="mt-3">
                                                            <div className="p-fluid grid">
                                                                <InputSwitchComp className="field col-12 md:col-3" validate={true} field="returned" title="SJ Kembali" checked={returnedFlag} onChange={(e) => { setReturnedFlag(e.value); values.returned = e.value ? 1 : 0; values.receive_date = e.value ? formatDateTimeString(new Date()) : null; setFinalShiftSelect(shiftData[0].name); }}
                                                                    onBlur={handleBlur} errors={errors} touched={touched} />
                                                                <DropDownComp className="field col-12 md:col-3" validate={true} field="shift" title="Shift Kembali" disabled={!returnedFlag} optionLabel="name" optionValue="name" options={shiftData} value={finalShiftSelect} errors={errors} touched={touched}
                                                                    onBlur={handleBlur} onChange={(e) => { setFinalShiftSelect(e.value); values.final_shift = e.value; setChangeStatus(true); }} />
                                                                <DateTimePickerComp className="field col-12 md:col-6" validate={true} field="receive_date" title="Tgl Terima" disabled={!returnedFlag} value={values.receive_date} onChange={(e) => { values.receive_date = e; setChangeStatus(true); }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                            </div>
                                                        </Panel>
                                                    </div>
                                                    <div className="col-12 md:col-2">
                                                        <Panel header="Quantity" className="h-full">
                                                            <InputNumberComp className="field col-12 md:col-12" field="volume_origin" title="Volume Asal" value={values.volume_origin} onChange={(e) => values.volume_origin = e.value } minFractionDigits={4} maxFractionDigits={4} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputNumberComp className="field col-12 md:col-12" field="volume_plant" title="Volume Tujuan" value={values.volume_plant} onChange={(e) => values.volume_plant = e.value } minFractionDigits={4} maxFractionDigits={4} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputNumberComp className="field col-12 md:col-12" field="volume_netto" title="Volume Netto" value={values.volume_netto} onChange={(e) => values.volume_netto = e.value } minFractionDigits={4} maxFractionDigits={4} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <DropDownComp className="field col-12 md:col-12" validate={true} field="uom" title="Satuan" optionLabel="name" optionValue="name" options={uomList} value={unitSelect} errors={errors} touched={touched} onBlur={handleBlur}
                                                                onChange={(e) => { setUnitSelect(e.value); values.uom = e.value; setChangeStatus(true) }} />
                                                            {
                                                                unitSelect === "Rit" && <InputNumberComp className="field col-12 md:col-12" field="qty" title="Qty" value={values.qty} onChange={(e) => values.qty = e.value } onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            }

                                                            {
                                                                unitSelect === "Kubikasi" && <>
                                                                    <InputNumberComp className="field col-12 md:col-12" field="length" title="Length" value={values.length} minFractionDigits={4} maxFractionDigits={4} onChange={(e) => { values.length = e.value; setVolume(e.value * values.width * values.height) } } onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                    <InputNumberComp className="field col-12 md:col-12" field="width" title="Width" value={values.width} minFractionDigits={4} maxFractionDigits={4} onChange={(e) => { values.width = e.value; setVolume(e.value * values.length * values.height) } } onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                    <InputNumberComp className="field col-12 md:col-12" field="height" title="Height" value={values.height} minFractionDigits={4} maxFractionDigits={4} onChange={(e) => { values.height = e.value; setVolume(e.value * values.width * values.length) } } onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                    <InputNumberComp disabled={true} className="field col-12 md:col-12" field="volume" title="Volume" value={volume} minFractionDigits={4} maxFractionDigits={4} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                                </>
                                                            }
                                                            {
                                                                unitSelect === "Tonase" && <InputNumberComp className="field col-12 md:col-12" field="weight" title="Weight" value={values.weight} onChange={(e) => values.weight = e.value } minFractionDigits={4} maxFractionDigits={4} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            }
                                                        </Panel>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTab>
                                        <AccordionTab header="Informasi">
                                            <div className="grid">
                                                <div className="col-12 md:col-4">
                                                    <Panel header="Dokumen" className="h-full">
                                                        <div className="p-fluid grid">
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="do_no" title="No DO" value={values.do_no} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="no_container" title="No Container" value={values.no_container} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="no_pto" title="No PTO" value={values.no_pto} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="no_di" title="No DI" value={values.no_di} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                        </div>
                                                    </Panel>
                                                </div>
                                                <div className="col-12 md:col-4">
                                                    <Panel header="Dokumen" className="h-full">
                                                        <div className="p-fluid grid">
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="sj_customer" title="SJ Customer" value={values.sj_customer} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="sj_supplier" title="SJ Supplier" value={values.sj_supplier} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                            <InputTextComp className="field col-12 md:col-12" validate={true} field="note" title="Note" value={values.note} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                        </div>
                                                    </Panel>
                                                </div>
                                                <div className="col-12 md:col-4">
                                                </div>
                                            </div>
                                        </AccordionTab>
                                        {
                                            multiProduct &&
                                            <AccordionTab header="Produk">
                                                <InputSwitchComp disabled={true} className="field col-12 md:col-1" validate={true} field="multi_product" title="Multi Produk" checked={multiProduct} onChange={(e) => { onChangeMultiProduct(e); }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <DOProduct id={id} models={storeList} setModels={onSetModels} empty={emptyDetailModel} rowClassName={(e) => rowClassNameTemplate(e)} setChangeStatus={() => setChangeStatus(true)} toast={toast} />
                                            </AccordionTab>
                                        }
                                    </Accordion>
                                </form>
                            </TabPanel>
                            <TabPanel header="Memo Potongan">
                                <TabView>
                                    <TabPanel header="On Going">
                                        <CargoMemo id={id} title="On Going" models={onGoindModels} empty={emptyKasbonModel} setChangeStatus={() => setChangeStatus(true)} toast={toast} />
                                    </TabPanel>
                                    <TabPanel header="Gantungan">
                                        <CargoMemo id={id} title="Gantungan" models={gantunganModels} empty={emptyKasbonModel} setChangeStatus={() => setChangeStatus(true)} toast={toast} />
                                    </TabPanel>
                                </TabView>
                            </TabPanel>
                            <TabPanel header="Foto">
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <Galleria className="mb-2" value={images} responsiveOptions={responsiveOptions} numVisible={3} style={{ maxWidth: '640px' }}
                                            item={imageTemplate} thumbnail={thumbnailTemplate} />
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <FileUploadComp multiple={true} advanced={true} onUpload={onImageUpload} />
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>

            <Dialog visible={isVisibleDialog} style={{width: '650px'}} header="Nomor Kendaraan" modal className="p-fluid" footer={dialogFooter} resizable={false} onHide={hideDialog}>
                <DataTableComp tableType="list" api={true} toolbar={false} title="Fleet" search={true} paginator={false} actionStatus="edit" actionEdit={actionEdit} onKeyDownSearch={onKeyDownSearch} keydown={true}
                    models={fleetData} columnsTable={columnsTable} onRowDoubleClick={(e) => onRowDoubleClick(e)} stripedRows={true} GetAll={getFleet}
                />
            </Dialog>

            <Dialog visible={isVisiblePrint} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '75vw'}} header="Print Surat Jalan" maximizable modal className="p-fluid" footer={dialogFooterPrint} onHide={hideDialogPrint}>
                <DeliveryReportPage id={id} />
            </Dialog>

            <BlockUI blocked={blocked} fullScreen />
            <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
        </Fragment>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(Example), comparisonFn);
// export default Example
