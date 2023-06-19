import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import * as ListService from "../../../service/Sales/OrderCargoDetailService";
import * as ScheduleService from "../../../service/Sales/Schedule";
import { TabView, TabPanel } from "primereact/tabview";
import { GlobalConsumer } from "../../../config/Context";
import { DatePicker } from "../../../components/standard/DateSlider/DatePicker";
import { formatCurrency, formatDate, formatDateString } from "../../../helpers/FormatHelpers";
import DataViewComp from "../../../components/standard/Dataview/DataViewComp";
import { Button } from "primereact/button";
import EditButtonComp from "../../../components/standard/Button/EditButtonComp";
import { Image } from "primereact/image";
import PostPutValidationComp from "../../../components/standard/Validation/PostPutValidationComp";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { APIBisnisUnit, APICustomer, APIFleetType, APIFormation, APIOrderType, APIOriginChild, APIPlant, APIProduct } from "../../../components/api/APIMaster";
import AutoCompleteComp from "../../../components/standard/Form/AutoCompleteComp";
import MultiSelectComp from "../../../components/standard/Form/MultiSelectComp";
import { Chip } from "primereact/chip";
import DataTableComp from "../../../components/standard/DataTable/DataTableComp";
import DOModify from "./DOModify";
import Example from "./Edit";

const CargoList = (props) => {
    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const issueDateRef = useRef();
    const [date, setDate] = useState();
    const rows = useRef(18);
    const toast = useRef();
    const page_schedule = useRef(1);
    const page_delivery = useRef(1);
    const [globalSchedule, setGlobalSchedule] = useState("");
    const [globalDelivery, setGlobalDelivery] = useState("");
    const [totalPageSchedule, setTotalPageSchedule] = useState(10);
    const [totalPageDelivery, setTotalPageDelivery] = useState(10);

    const [modelsSchedule, setModelsSchedule] = useState([]);
    const [modelsDelivery, setModelsDelivery] = useState([]);
    const [totalRecordsSchedule, setTotalRecordsSchedule] = useState(10);
    const [totalRecordsDelivery, setTotalRecordsDelivery] = useState(0);

    const [isVisibleFilterDelivery, setIsVisibleFilterDelivery] = useState(false);

    const [businessData, setBusinessData] = useState([]);
    const [businessSelect, setBusinessSelect] = useState(null);
    const [orderTypeData, setOrderTypeData] = useState([]);
    const [orderTypeSelect, setOrderTypeSelect] = useState(null);
    const [fleetTypeData, setFleetTypeData] = useState([]);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);
    const [formationData, setFormationData] = useState([]);
    const [formationSelect, setFormationSelect] = useState(null);
    const [statusData, setStatusData] = useState([]);
    const [statusSelect, setStatusSelect] = useState(null);
    const [originData, setOriginData] = useState([]);
    const [originSelect, setOriginSelect] = useState(null);
    const [plantData, setPlantData] = useState([]);
    const [plantSelect, setPlantSelect] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productSelect, setProductSelect] = useState(null);
    const [customerData, setCustomerData] = useState([]);
    const [customerSelect, setCustomerSelect] = useState(null);
    const [opened, setOpened] = useState(true);

    const [modelHistory, setModelHistory] = useState([]);
    const [isVisibleHistory, setIsVisibleHistory] = useState(false);

    const [edit, setEdit] = useState(false);

    const getBusiness = async (keyword) => {
        const res = await APIBisnisUnit(keyword);

        setBusinessData(null);

        return res;
    };

    const getOrderType = async (keyword) => {
        if (businessSelect) {
            const res = await APIOrderType(businessSelect.id, keyword);

            setOrderTypeData(null);

            return res;
        }
    };

    const getFleetType = async (id) => {
        const res = await APIFleetType(id, "");

        setFleetTypeData(res);
    };

    const getFormation = async (id) => {
        const res = await APIFormation(id, "");

        setFormationData(res);
    };

    const getOrigin = async (keyword) => {
        const res = await APIOriginChild(keyword);

        setOriginData(null);

        return res;
    };

    const getPlant = async (keyword) => {
        const res = await APIPlant(keyword);

        setPlantData(null);

        return res;
    };

    const getProduct = async (keyword) => {
        const res = await APIProduct(keyword);

        setProductData(null);

        return res;
    };

    const getCustomer = async (keyword) => {
        const res = await APICustomer(keyword);

        setCustomerData(null);

        return res;
    };

    const getStatus = async () => {
        const res = await ListService.GetStatus();

        setStatusData(null);

        if (res.status === 200) {
            return res.data;
        }

        return null;
    };

    const confirmSJ = async (id, value) => {
        const form = new FormData();

        form.append("status", value);

        const result = await ListService.Confirm(id, form);

        if (result.status === 200) {
            if (activeIndex === 0) {
                QueryDataJadwal(1, globalSchedule);
            } else if (activeIndex === 1) {
                QueryDataSuratJalan(1, globalDelivery);
            }
            toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });
        } else {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        }
    };

    const QueryDataJadwal = async (page, keyword) => {
        setWaiting(true);
        let business_id = 0;
        let order_type_id = 0;
        let fleet_type_id = "";
        let formation_id = "";
        let customer_id = 0;
        let origin_id = 0;
        let plant_id = 0;
        let product_id = 0;
        let status_id = 0;

        if (businessSelect) {
            business_id = businessSelect.id;
        } else {
            business_id = 0;
        }

        if (fleetTypeSelect) {
            fleetTypeSelect.map((row, index) => {
                if (index === 0) {
                    fleet_type_id = fleet_type_id + row.id;
                } else {
                    fleet_type_id = fleet_type_id + "," + row.id;
                }
            });
        }

        if (formationSelect) {
            formationSelect.map((row, index) => {
                if (index === 0) {
                    formation_id = formation_id + row.id;
                } else {
                    formation_id = formation_id + "," + row.id;
                }
            });
        }

        if (orderTypeSelect) {
            order_type_id = orderTypeSelect.id;
        } else {
            order_type_id = 0;
        }

        if (customerSelect) {
            customer_id = customerSelect.id;
        } else {
            customer_id = 0;
        }

        if (originSelect) {
            origin_id = originSelect.id;
        } else {
            origin_id = 0;
        }

        if (plantSelect) {
            plant_id = plantSelect.id;
        } else {
            plant_id = 0;
        }

        if (productSelect) {
            product_id = productSelect.id;
        } else {
            product_id = 0;
        }

        let params = {};

        if (statusSelect) {
            status_id = statusSelect.data_id;

            params = {
                issue_date: formatDateString(issueDateRef.current),
                page: page,
                pagesize: rows.current,
                keyword: keyword,
                sales_type_id: business_id,
                order_type_id: order_type_id,
                fleet_type_id: fleet_type_id,
                formation_id: formation_id,
                customer_id: customer_id,
                origin_id: origin_id,
                plant_id: plant_id,
                product_id: product_id,
                status_id: status_id,
            };
        } else {
            params = {
                issue_date: formatDateString(issueDateRef.current),
                page: page,
                pagesize: rows.current,
                keyword: keyword,
                sales_type_id: business_id,
                order_type_id: order_type_id,
                fleet_type_id: fleet_type_id,
                formation_id: formation_id,
                customer_id: customer_id,
                origin_id: origin_id,
                plant_id: plant_id,
                product_id: product_id,
            };
        }

        // console.log(params)

        const res = await ScheduleService.GetAll(params);

        setModelsSchedule([]);
        setTotalRecordsSchedule(0);
        setTotalPageSchedule(0);
        if (res.status === 200) {
            if (res.data) {
                setModelsSchedule(res.data.list);
                setTotalRecordsSchedule(res.data.total);
                setTotalPageSchedule(res.data.page);
            }
        }

        setWaiting(false);
    };

    const QueryDataSuratJalan = async (page, keyword) => {
        setWaiting(true);

        let business_id = 0;
        let order_type_id = 0;
        let fleet_type_id = "";
        let formation_id = "";
        let customer_id = 0;
        let origin_id = 0;
        let plant_id = 0;
        let product_id = 0;
        let status_id = 0;

        if (businessSelect) {
            business_id = businessSelect.id;
        } else {
            business_id = 0;
        }

        if (fleetTypeSelect) {
            fleetTypeSelect.map((row, index) => {
                if (index === 0) {
                    fleet_type_id = fleet_type_id + row.id;
                } else {
                    fleet_type_id = fleet_type_id + "," + row.id;
                }
            });
        }

        if (formationSelect) {
            formationSelect.map((row, index) => {
                if (index === 0) {
                    formation_id = formation_id + row.id;
                } else {
                    formation_id = formation_id + "," + row.id;
                }
            });
        }

        if (orderTypeSelect) {
            order_type_id = orderTypeSelect.id;
        } else {
            order_type_id = 0;
        }

        if (customerSelect) {
            customer_id = customerSelect.id;
        } else {
            customer_id = 0;
        }

        if (originSelect) {
            origin_id = originSelect.id;
        } else {
            origin_id = 0;
        }

        if (plantSelect) {
            plant_id = plantSelect.id;
        } else {
            plant_id = 0;
        }

        if (productSelect) {
            product_id = productSelect.id;
        } else {
            product_id = 0;
        }

        let params = {};

        if (statusSelect) {
            status_id = statusSelect.data_id;

            params = {
                issue_date: formatDateString(issueDateRef.current),
                page: page,
                pagesize: rows.current,
                keyword: keyword,
                sales_type_id: business_id,
                order_type_id: order_type_id,
                fleet_type_id: fleet_type_id,
                formation_id: formation_id,
                customer_id: customer_id,
                origin_id: origin_id,
                plant_id: plant_id,
                product_id: product_id,
                status_id: status_id,
            };
        } else {
            params = {
                issue_date: formatDateString(issueDateRef.current),
                page: page,
                pagesize: rows.current,
                keyword: keyword,
                sales_type_id: business_id,
                order_type_id: order_type_id,
                fleet_type_id: fleet_type_id,
                formation_id: formation_id,
                customer_id: customer_id,
                origin_id: origin_id,
                plant_id: plant_id,
                product_id: product_id,
            };
        }

        // console.log(params)

        const res = await ListService.GetAll(params);

        setModelsDelivery([]);
        setTotalRecordsDelivery(0);
        setTotalPageDelivery(0);
        if (res.status === 200) {
            if (res.data) {
                setModelsDelivery(res.data.list);
                setTotalRecordsDelivery(res.data.total);
                setTotalPageDelivery(res.data.page);
            }
        }

        setWaiting(false);
    };

    const actionNew = () => {
        return history.push({
            pathname: "/sales/cargo/order/create",
            state: {},
        });
    };

    const actionEdit = (data) => {
        return history.push({
            pathname: "/sales/cargo/order/edit/" + data.id,
            state: {},
        });
    };

    const actionEditSchedule = (data) => {
        setEdit(true);
        props.dispatch({ type: "add-data", id: "schedule", data: data.id, edit: true });

        // return history.push({
        //     pathname: "/sales/cargo/order/create",
        //     state: {},
        // });

        // return <Example></Example>;
    };

    const selectedDay = (val) => {
        issueDateRef.current = val;
        setDate(val);

        if (activeIndex === 0) {
            QueryDataJadwal(page_schedule.current, globalSchedule);
        } else if (activeIndex === 1) {
            QueryDataSuratJalan(page_delivery.current, globalDelivery);
        }
    };

    const actionShowSchedule = (value) => {
        setModelHistory(value.order_lists);
        setIsVisibleHistory(true);
    };

    const renderListItemJadwal = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column align-items-center p-3 w-full md:flex-row">
                    <div className="md:w-20rem">
                        <div className="text-1xl font-bold mb-2">
                            {data.schedule_no} - {data.issue_date}
                        </div>
                        <div className="align-self-center text-1xl font-semibold mb-2 md:align-self-end">{data.origin_id.name}</div>
                        <div className="align-self-center text-1xl font-semibold mb-2 md:align-self-end">
                            {data.customer_id.code} - {data.plant_id.name}
                        </div>
                        <div className="text-1xl font-semibold md:align-self-end">{data.multi_product === 0 ? data.product_id.name : "Multi Produk"}</div>
                    </div>
                    <div className="flex flex-column justify-content-center align-items-center md:flex-1">
                        <div className="text-2xl font-bold">{data.balance}</div>
                        <div className="flex flex-row">
                            {data.urgent === 1 ? (
                                <Button type="button" className="p-button-danger justify-content-center mr-3" style={{ width: "80px" }}>
                                    {data.urgent === 1 ? "Urgent" : "Reguler"}
                                </Button>
                            ) : (
                                <Button type="button" className="p-button-info justify-content-center mr-3" style={{ width: "80px" }}>
                                    {data.urgent === 1 ? "Urgent" : "Reguler"}
                                </Button>
                            )}
                            {data.total_do === data.actual ? (
                                <Button type="button" className="p-button-success justify-content-center" style={{ width: "80px" }}>
                                    {data.actual} / {data.total_do}
                                </Button>
                            ) : (
                                <Button type="button" className="p-button-warning justify-content-center" style={{ width: "80px" }}>
                                    {data.actual < 0 ? -1 * data.actual : data.actual} / {data.total_do}
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-column mt-5 justify-content-between align-items-center md:w-auto w-full">
                        {data.balance > 0 && <EditButtonComp label="" onClick={() => actionEditSchedule(data)} />}
                        <div>
                            <i className="pi pi-calendar-plus vertical-align-middle mr-2"></i>
                            <span className="vertical-align-middle font-semibold">
                                {data.sales_type_id.name} - {data.order_type_id.name}
                            </span>
                        </div>
                        <div className="ml-4 mb-2">{data.fleet_type_id.name}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItemJadwal = (data) => {
        return (
            <div className="col-12 md:col-4 my-2">
                <div className="m-2 border-1 surface-border card h-full">
                    <div className="flex align-items-center justify-content-between">
                        <div>
                            <i className="pi pi-calendar-plus vertical-align-middle mr-2"></i>
                            <span className="font-semibold vertical-align-middle">
                                {data.sales_type_id.name} - {data.order_type_id.name}
                            </span>
                        </div>
                        {data.balance > 0 && (
                            <EditButtonComp
                                label=""
                                onClick={() => {
                                    actionEditSchedule(data);
                                }}
                            />
                        )}
                        {/* {data.balance > 0 && <EditButtonComp label="" onClick={() => setEdit(true)} />} */}
                    </div>
                    <div className="text-center mt-2">
                        <div className="text-2xl font-bold">{data.schedule_no}</div>
                        <div className="ml-4 mb-1">
                            {data.issue_date} - {data.fleet_type_id.name}
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">{data.origin_id.name}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">
                            {data.customer_id.code} - {data.plant_id.name}
                        </span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">{data.multi_product === 0 ? data.product_id.name : "\u00a0"}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-2xl font-bold md:align-self-end">{data.balance}</span>
                    </div>
                    <div className="flex flex-row align-items-center justify-content-center mt-2">
                        {data.urgent === 1 ? (
                            <Button type="button" className="p-button-danger justify-content-center mr-3" style={{ width: "80px" }}>
                                {data.urgent === 1 ? "Urgent" : "Reguler"}
                            </Button>
                        ) : (
                            <Button type="button" className="p-button-info justify-content-center mr-3" style={{ width: "80px" }}>
                                {data.urgent === 1 ? "Urgent" : "Reguler"}
                            </Button>
                        )}
                        <Button type="button" className="p-button-warning justify-content-center" style={{ width: "80px" }} onClick={() => actionShowSchedule(data)}>
                            {data.actual < 0 ? -1 * data.actual : data.actual} / {data.total_do}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const selectButton = (status_id) => {
        let className = "";

        switch (status_id) {
            case 0:
                className = "p-button-secondary p-button-outlined justify-content-center mr-3";
                break;
            case 1:
                className = "p-button-danger p-button-outlined justify-content-center mr-3";
                break;
            case 2:
                className = "p-button-warning p-button-outlined justify-content-center mr-3";
                break;
            case 3:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 4:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 5:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 6:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 7:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 8:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 9:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 10:
                className = "p-button-success p-button-outlined justify-content-center mr-3";
                break;
            case 11:
                className = "p-button-success justify-content-center mr-3";
                break;
            case 12:
                className = "p-button-success justify-content-center mr-3";
                break;
            case 13:
                className = "p-button-danger justify-content-center mr-3";
                break;
            case 14:
                className = "p-button-danger justify-content-center mr-3";
                break;

            default:
                break;
        }
        return className;
    };

    const renderListItemSJ = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column align-items-center p-3 w-full md:flex-row">
                    <div className="flex align-items-center justify-content-between">
                        <div>
                            <div className="round-list">{data.employee_id.image_data ? <Image src={data.employee_id.image_data} alt="Image" preview className="round-image-list" /> : <Image src={"/images/user.png"} alt="Image" preview className="round-image-list" />}</div>
                        </div>
                        <div className="ml-3">
                            <div className="font-semibold vertical-align-middle mb-2">
                                {data.schedule_id.schedule_no} - {data.schedule_id.issue_date}
                            </div>
                            <div className="font-semibold vertical-align-middle mb-2">{data.company_id.name}</div>
                            <div className="text-1xl font-semibold md:align-self-center mb-2">{data.employee_id.name}</div>
                            <div className="text-1xl font-semibold md:align-self-center mb-2">{data.employee_id.bank_id.name}</div>
                            <div className="text-1xl font-semibold md:align-self-center mb-2">{data.employee_id.bank_no}</div>
                            <div className="text-1xl font-semibold md:align-self-center mb-2">{data.fleet_id.plate_no}</div>

                            <Button type="button" className={selectButton(data.status_id)}>
                                {data.status}
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-column justify-content-center align-items-center md:flex-1">
                        <div className="mb-2">{data.origin_id.name}</div>
                        <div className="mb-2">
                            {data.customer_id.code} - {data.plant_id.name}
                        </div>
                        <span className="text-2xl font-bold mb-2">{formatCurrency(data.ujt, 0)}</span>
                        <EditButtonComp label="" onClick={() => actionEdit(data)} />
                    </div>
                    <div className="flex flex-column justify-content-between align-items-end md:w-auto w-full">
                        <div className="vertical-align-middle mb-2">{data.sales_type_id.name}</div>
                        <div className="vertical-align-middle mb-2">{data.order_type_id.name}</div>
                        <div className="text-1xl font-bold mb-2">{data.reference_no}</div>
                        <div className="mb-2">{data.issue_date}</div>
                        <div className="mb-2">{data.order_type_id.name}</div>
                        <div className="mb-2">{data.fleet_type_id.name}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItemSJ = (data) => {
        return (
            <div className="col-12 md:col-4 my-2">
                <div className="m-2 border-1 surface-border card h-full">
                    <div className="flex align-items-center justify-content-between">
                        <div className="font-semibold vertical-align-middle">
                            {data.schedule_id.schedule_no} - {data.schedule_id.issue_date}
                        </div>
                        {/* <EditButtonComp label="" onClick={() => actionEdit(data)} /> */}
                        <EditButtonComp label="" onClick={() => setEdit(true)} />
                    </div>
                    <div className="flex flex-row align-items-center justify-content-start">
                        <div className="round-list">{data.employee_id.image_data ? <Image src={data.employee_id.image_data} alt="Image" preview className="round-image-list" /> : <Image src={"/images/user.png"} alt="Image" preview className="round-image-list" />}</div>
                        <div className="ml-3">
                            <div className="text-1xl mb-2">{data.company_id.name}</div>
                            <div className="text-1xl mb-2">{data.employee_id.name}</div>
                            <div className="text-1xl mb-2">{data.reference_no}</div>
                            <div className="mb-2">{data.issue_date}</div>
                            <div className="mb-2">{data.order_type_id.name}</div>
                            <div className="mb-2">{data.fleet_type_id.name}</div>
                            <div>{data.fleet_id.plate_no}</div>
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-5">
                        <span className="text-1xl font-semibold md:align-self-end">{data.origin_id.name}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">
                            {data.customer_id.code} - {data.plant_id.name}
                        </span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">{data.multi_product === 0 ? data.product_id.name : "\u00a0"}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-2xl font-bold md:align-self-end">{formatCurrency(data.ujt, 0)}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <Button type="button" className={selectButton(data.status_id)}>
                            {data.status}
                        </Button>
                        {data.status_id === 0 || data.status_id === 1 ? (
                            <Button type="button" className="p-button-primary justify-content-center" onClick={() => confirmSJ(data.id, 1)}>
                                Assign
                            </Button>
                        ) : (
                            data.status_id === 2 && (
                                <Button type="button" className="p-button-danger justify-content-center" onClick={() => confirmSJ(data.id, 0)}>
                                    Cancel
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const actionFilterDelivery = () => {
        setBusinessData(null);
        setOrderTypeData(null);
        setFleetTypeData(null);
        setFormationData(null);
        setCustomerData(null);
        setOriginData(null);
        setPlantData(null);
        setProductData(null);
        setStatusData(null);

        if (businessSelect) {
            getFormation(businessSelect.id);
            getFleetType(businessSelect.id);
        }

        setIsVisibleFilterDelivery(true);
    };

    const hideDialogDelivery = () => {
        setIsVisibleFilterDelivery(false);
    };

    const filterDelivery = () => {
        if (activeIndex === 0) {
            QueryDataJadwal(1, "");
        } else if (activeIndex === 1) {
            QueryDataSuratJalan(1, "");
        }

        setIsVisibleFilterDelivery(false);
    };

    const clearFilter = () => {
        setOpened(false);

        setBusinessSelect(null);
        setOrderTypeSelect(null);
        setFleetTypeSelect(null);
        setFormationSelect(null);
        setCustomerSelect(null);
        setOriginSelect(null);
        setPlantSelect(null);
        setProductSelect(null);
        setStatusSelect(null);
    };

    const dialogFooterDelivery = (
        <>
            <Button label="Ok" icon="pi pi-check" className="p-button-text p-button-sm" onClick={filterDelivery} />
            <Button label="Clear" icon="pi pi-refresh" className="p-button-text p-button-sm" onClick={clearFilter} />
            {/* <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialogDelivery} /> */}
        </>
    );

    const hideDialogHistory = () => {
        setIsVisibleHistory(false);
    };

    const dialogFooterHistory = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialogHistory} />
        </>
    );

    const columnsTableHistory = [
        { field: "company_code", header: "Grup PT", sortable: false, style: "percent", width: 5 },
        { field: "coor_name", header: "Koordinator", sortable: false, style: "percent", width: 15 },
        { field: "employee_name", header: "Supir", sortable: false, style: "percent", width: 15 },
        { field: "fleet_type_name", header: "Jenis Armada", sortable: false, style: "percent", width: 15 },
        { field: "formation_grup_name", header: "Grup Formasi", sortable: false, style: "percent", width: 10 },
        { field: "formation_name", header: "Formasi", sortable: false, style: "percent", width: 10 },
        { field: "issue_date", header: "Tgl SJ", sortable: false, style: "percent", width: 10 },
        { field: "reference_no", header: "No SJ", sortable: false, style: "percent", width: 10 },
        { field: "schedule_no", header: "No Jadwal", sortable: false, style: "percent", width: 10 },
    ];

    const getAllSchedule = (num, value) => {
        page_schedule.current = num;

        QueryDataJadwal(num, value);
    };

    const getAllDelivery = (num, value) => {
        page_delivery.current = num;

        QueryDataSuratJalan(num, value);
    };

    const onChangeBusiness = (value) => {
        setBusinessSelect(value);
        if (value) {
            getFormation(value.id);
            getFleetType(value.id);
        }
        setOpened(false);
    };

    useEffect(() => {
        props.dispatch({ type: "add-data", id: "schedule", data: 0 });

        setDate(new Date());
        issueDateRef.current = new Date();
    }, []);

    useEffect(() => {
        if (activeIndex === 0) {
            QueryDataJadwal(1, "");
        } else if (activeIndex === 1) {
            QueryDataSuratJalan(1, "");
        }
    }, [activeIndex, setActiveIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleBackClick = () => {
        setEdit(false);
      };

    return (
        <Fragment>
            <Toast ref={toast} />
            {edit ? (
                <div>
                    {/* <Button className="p-button-text p-button-sm" onClick={() => setEdit(false)}>
                        <i className="pi pi-chevron-left"></i>
                        <span className="px-1" style={{ marginTop: "3px" }}>
                            Back lahhh
                        </span>
                    </Button> */}
                    <Example onBackClick={handleBackClick}/>
                </div>
            ) : (
                <div>
                    <div className="grid">
                        <div className="col-12">
                            <div className="card">
                                <DatePicker startDate={new Date("2023-03-01")} days={365 * 3} type="day" selectDate={date} getSelectedDay={selectedDay} labelFormat={"MMMM yyyy"} color={"#374e8c"} />

                                <div className="col-12 mt-2">
                                    <Button type="button" key="filterButton" className="p-button-text" onClick={() => actionFilterDelivery()}>
                                        <i className="pi pi-filter"></i>
                                        <span className="px-1" style={{ marginTop: "3px" }}>
                                            Filter
                                        </span>
                                    </Button>
                                    {businessSelect ? <Chip label={businessSelect.name} className="mb-2 mr-2" /> : null}
                                    {orderTypeSelect ? <Chip label={orderTypeSelect.name} className="mb-2 mr-2" /> : null}
                                    {fleetTypeSelect
                                        ? fleetTypeSelect.map((row) => {
                                              return <Chip label={row.name} className="mb-2 mr-2" />;
                                          })
                                        : null}
                                    {formationSelect
                                        ? formationSelect.map((row) => {
                                              return <Chip label={row.name} className="mb-2 mr-2" />;
                                          })
                                        : null}
                                    {customerSelect ? <Chip label={customerSelect.name} className="mb-2 mr-2" /> : null}
                                    {originSelect ? <Chip label={originSelect.name} className="mb-2 mr-2" /> : null}
                                    {plantSelect ? <Chip label={plantSelect.name} className="mb-2 mr-2" /> : null}
                                    {productSelect ? <Chip label={productSelect.name} className="mb-2 mr-2" /> : null}
                                    {statusSelect ? <Chip label={statusSelect.data_name} className="mb-2 mr-2" /> : null}
                                </div>

                                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="mt-3">
                                    <TabPanel header="Jadwal">

                                        <DataViewComp
                                            title="Schedule"
                                            api={true}
                                            models={modelsSchedule}
                                            paginator={true}
                                            renderGridItem={renderGridItemJadwal}
                                            renderListItem={renderListItemJadwal}
                                            rows={rows.current}
                                            totalRecords={totalRecordsSchedule}
                                            totalPage={totalPageSchedule}
                                            queryData={getAllSchedule}
                                            search={true}
                                            globalStatus={true}
                                            setGlobal={(e) => setGlobalSchedule(e)}
                                        />
                                    </TabPanel>
                                    <TabPanel header="Surat Jalan">
                                        <DataViewComp
                                            title="Surat Jalan"
                                            api={true}
                                            models={modelsDelivery}
                                            paginator={true}
                                            add={true}
                                            actionNew={actionNew}
                                            renderGridItem={renderGridItemSJ}
                                            renderListItem={renderListItemSJ}
                                            rows={rows.current}
                                            totalRecords={totalRecordsDelivery}
                                            totalPage={totalPageDelivery}
                                            queryData={getAllDelivery}
                                            search={true}
                                            globalStatus={true}
                                            setGlobal={(e) => setGlobalDelivery(e)}
                                            filter={false}
                                            actionFilter={actionFilterDelivery}
                                        />
                                    </TabPanel>
                                </TabView>
                            </div>
                        </div>
                    </div>
                    <Dialog visible={isVisibleFilterDelivery} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "30vw" }} header="Filter Surat Jalan" modal className="p-fluid" footer={dialogFooterDelivery} onHide={hideDialogDelivery}>
                        <div className="grid">
                            <AutoCompleteComp
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="business_id"
                                title="Bisnis Unit"
                                showField="name"
                                models={businessData}
                                queryData={(e) => getBusiness(e)}
                                value={businessSelect}
                                setSelectValue={(e) => setBusinessSelect(e)}
                                onChange={(e) => {
                                    onChangeBusiness(e.value);
                                }}
                            />
                            <AutoCompleteComp
                                disabled={opened}
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="order_type_id"
                                title="Jenis Transaksi"
                                showField="name"
                                models={orderTypeData}
                                queryData={(e) => getOrderType(e)}
                                value={orderTypeSelect}
                                setSelectValue={(e) => setOrderTypeSelect(e)}
                                onChange={(e) => {
                                    setOrderTypeSelect(e.value);
                                }}
                            />
                            <MultiSelectComp
                                disabled={opened}
                                className="field col-12 md:col-12"
                                validate={false}
                                field="fleet_type_id"
                                title="Jenis Armada"
                                optionLabel="code"
                                showField="name"
                                options={fleetTypeData}
                                value={fleetTypeSelect}
                                onChange={(e) => {
                                    setFleetTypeSelect(e.value);
                                }}
                            />
                            <MultiSelectComp
                                disabled={opened}
                                className="field col-12 md:col-12"
                                validate={false}
                                field="formation_id"
                                title="Formasi"
                                optionLabel="code"
                                showField="name"
                                options={formationData}
                                value={formationSelect}
                                onChange={(e) => {
                                    setFormationSelect(e.value);
                                }}
                            />
                            <AutoCompleteComp
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="customer_id"
                                title="Pelanggan"
                                showField="name"
                                models={customerData}
                                queryData={(e) => getCustomer(e)}
                                value={customerSelect}
                                setSelectValue={(e) => setCustomerSelect(e)}
                                onChange={(e) => {
                                    setCustomerSelect(e.value);
                                }}
                            />
                            <AutoCompleteComp
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="origin_id"
                                title="Asal"
                                showField="name"
                                models={originData}
                                queryData={(e) => getOrigin(e)}
                                value={originSelect}
                                setSelectValue={(e) => setOriginSelect(e)}
                                onChange={(e) => {
                                    setOriginSelect(e.value);
                                }}
                            />
                            <AutoCompleteComp
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="plant_id"
                                title="Tujuan"
                                showField="name"
                                models={plantData}
                                queryData={(e) => getPlant(e)}
                                value={plantSelect}
                                setSelectValue={(e) => setPlantSelect(e)}
                                onChange={(e) => {
                                    setPlantSelect(e.value);
                                }}
                            />
                            <AutoCompleteComp
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="product_id"
                                title="Produk"
                                showField="name"
                                models={productData}
                                queryData={(e) => getProduct(e)}
                                value={productSelect}
                                setSelectValue={(e) => setProductSelect(e)}
                                onChange={(e) => {
                                    setProductSelect(e.value);
                                }}
                            />
                            <AutoCompleteComp
                                className="field col-12 md:col-12"
                                api={true}
                                validate={false}
                                field="status_id"
                                title="Status"
                                showField="data_name"
                                models={statusData}
                                queryData={(e) => getStatus(e)}
                                value={statusSelect}
                                setSelectValue={(e) => setStatusSelect(e)}
                                onChange={(e) => {
                                    setStatusSelect(e.value);
                                }}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={isVisibleHistory} breakpoints={{ "960px": "100vw", "640px": "100vw" }} style={{ width: "80vw" }} header="History Surat Jalan" modal className="p-fluid" footer={dialogFooterHistory} onHide={hideDialogHistory}>
                        <DataTableComp api={false} scrollable={false} scrollHeight="flex" title="History" models={modelHistory} search={true} columnsTable={columnsTableHistory} paginator={false} />
                    </Dialog>
                    <PostPutValidationComp waitingDialog={waiting} />
                </div>
            )}
        </Fragment>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(CargoList), comparisonFn);
