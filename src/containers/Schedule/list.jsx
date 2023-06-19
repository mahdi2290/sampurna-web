import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import * as ListService from '../../service/Sales/Schedule';
import { formatDateString } from "../../helpers/FormatHelpers";
import { DatePicker } from "../../components/standard/DateSlider/DatePicker";
import DataViewComp from "../../components/standard/Dataview/DataViewComp";
import EditButtonComp from "../../components/standard/Button/EditButtonComp";
import { Button } from "primereact/button";
import { GlobalConsumer } from "../../config/Context";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import { Dialog } from "primereact/dialog";
import DataTableComp from "../../components/standard/DataTable/DataTableComp";

const ScheduleList = (props) => {
    const history = useHistory();
    const [waiting, setWaiting] = useState(false);
    const [models, setModels] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [date, setDate] = useState();
    const issueDateRef = useRef();
    const rows = useRef(9);
    const [model, setModel] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const startDate = new Date('2023-03-01');

    useEffect(() => {
        setDate(new Date());
        issueDateRef.current = new Date();

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryData = async(page, keyword) => {
        setWaiting(true);
        let issueDate = issueDateRef.current;

        const params = { issue_date: formatDateString(issueDate), page: page, pagesize: rows.current, keyword: keyword };

        const res = await ListService.GetAll(params);

        setModels([]);
        setTotalRecords(0);
        setTotalPage(0);
        if (res.status === 200) {
            if (res.data) {
                setModels(res.data.list);
                setTotalRecords(res.data.total);
                setTotalPage(res.data.page);
            }
        }

        setWaiting(false);
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData(1, "");
        }, 250);
    }

    const actionNew = () => {
        props.dispatch({ type: "add-data", id:'date-schedule', data: issueDateRef.current });

        return history.push({
            pathname:  "/sales/schedule/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname:  "/sales/schedule/edit/" + data.id,
            state: {}
        });
    }

    const selectedDay = (val) => {
        issueDateRef.current = val;
        setDate(val);
        QueryData(1, "");
    };

    const actionShowSchedule = (value) => {
        setModel(value.order_lists);
        setIsVisible(true);
    }

    const hideDialog = () => {
        setIsVisible(false);
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
        </>
    );

    const columnsTable = [
        { field: 'company_code', header: 'Grup PT', sortable: false, style: "percent", width: 5 },
        { field: 'coor_name', header: 'Koordinator', sortable: false, style: "percent", width: 15},
        { field: 'employee_name', header: 'Supir', sortable: false, style: "percent", width: 15},
        { field: 'fleet_type_name', header: 'Jenis Armada', sortable: false, style: "percent", width: 15},
        { field: 'formation_grup_name', header: 'Grup Formasi', sortable: false, style: "percent", width: 10},
        { field: 'formation_name', header: 'Formasi', sortable: false, style: "percent", width: 10},
        { field: 'issue_date', header: 'Tgl SJ', sortable: false, style: "percent", width: 10},
        { field: 'reference_no', header: 'No SJ', sortable: false, style: "percent", width: 10},
        { field: 'schedule_no', header: 'No Jadwal', sortable: false, style: "percent", width: 10},
    ];

    const renderListItem = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column align-items-center p-3 w-full md:flex-row">
                    <div className="md:w-20rem">
                        <div className="text-1xl font-bold mb-2">{data.schedule_no} - {data.issue_date}</div>
                        <div className="align-self-center text-1xl font-semibold mb-2 md:align-self-end">{data.origin_id.name}</div>
                        <div className="align-self-center text-1xl font-semibold mb-2 md:align-self-end">{data.customer_id.code} - {data.plant_id.name}</div>
                        <div className="text-1xl font-semibold md:align-self-end">{data.multi_product === 0 ? data.product_id.name : ""}</div>
                    </div>
                    <div className="flex flex-column justify-content-center align-items-center md:flex-1">
                        <div className="text-2xl font-bold">{data.balance}</div>
                        <div className="flex flex-row">
                            { data.urgent === 1 ?
                                <Button type="button" className="p-button-danger justify-content-center mr-3" style={{width: '80px'}}>
                                    {data.urgent === 1 ? "Urgent" : "Reguler"}
                                </Button>
                                :
                                <Button type="button" className="p-button-info justify-content-center mr-3" style={{width: '80px'}}>
                                    {data.urgent === 1 ? "Urgent" : "Reguler"}
                                </Button>
                            }
                            {
                                data.total_do === data.actual ?
                                    <Button type="button" className="p-button-success justify-content-center" style={{width: '80px'}} onClick={() => actionShowSchedule(data)} >
                                        {data.actual} / {data.total_do}
                                    </Button>
                                :
                                    <Button type="button" className="p-button-warning justify-content-center" style={{width: '80px'}} onClick={() => actionShowSchedule(data)} >
                                        {data.actual < 0 ? -1 * data.actual : data.actual} / {data.total_do}
                                    </Button>
                            }
                        </div>
                    </div>
                    <div className="flex flex-column mt-5 justify-content-between align-items-center md:w-auto w-full">
                        <EditButtonComp label="" onClick={() => actionEdit(data)} />
                        <div>
                            <i className="pi pi-calendar-plus vertical-align-middle mr-2"></i>
                            <span className="vertical-align-middle font-semibold">{data.sales_type_id.name} - {data.order_type_id.name}</span>
                        </div>
                        <div className="ml-4 mb-2">{data.fleet_type_id.name}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItem = (data) => {
        return (
            <div className="col-12 md:col-4 my-2">
                <div className="m-2 border-1 surface-border card h-full">
                    <div className="flex align-items-center justify-content-between">
                        <div>
                            <i className="pi pi-calendar-plus vertical-align-middle mr-2"></i>
                            <span className="font-semibold vertical-align-middle">{data.sales_type_id.name} - {data.order_type_id.name}</span>
                        </div>
                        <EditButtonComp label="" onClick={() => actionEdit(data)} />
                    </div>
                    <div className="text-center mt-2">
                        <div className="text-2xl font-bold">{data.schedule_no}</div>
                        <div className="ml-4 mb-1">{data.issue_date} - {data.fleet_type_id.name}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">{data.origin_id.name}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">{data.customer_id.code} - {data.plant_id.name}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-1xl font-semibold md:align-self-end">{data.multi_product === 0 ? data.product_id.name : "\u00a0"}</span>
                    </div>
                    <div className="flex align-items-center justify-content-center mt-2">
                        <span className="text-2xl font-bold md:align-self-end">{data.balance}</span>
                    </div>
                    <div className="flex flex-row align-items-center justify-content-center mt-2">
                        { data.urgent === 1 ?
                            <Button type="button" className="p-button-danger justify-content-center mr-3" style={{width: '80px'}}>
                                {data.urgent === 1 ? "Urgent" : "Reguler"}
                            </Button>
                            :
                            <Button type="button" className="p-button-info justify-content-center mr-3" style={{width: '80px'}}>
                                {data.urgent === 1 ? "Urgent" : "Reguler"}
                            </Button>
                        }
                        {
                            data.total_do === data.actual ?
                                <Button type="button" className="p-button-success justify-content-center" style={{width: '80px'}} onClick={() => actionShowSchedule(data)} >
                                    {data.actual < 0 ? -1 * data.actual : data.actual} / {data.total_do}
                                </Button>
                            :
                                <Button type="button" className="p-button-warning justify-content-center" style={{width: '80px'}} onClick={() => actionShowSchedule(data)} >
                                    {data.actual < 0 ? -1 * data.actual : data.actual} / {data.total_do}
                                </Button>
                        }
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <DatePicker
                            startDate={startDate}
                            days={365 * 25}
                            type="day"
                            selectDate={date}
                            getSelectedDay={selectedDay}
                            labelFormat={"MMMM yyyy"}
                            color={"#374e8c"} />

                        <DataViewComp title="Schedule" api={true} models={models} paginator={true} renderGridItem={renderGridItem} add={true} actionNew={actionNew} renderListItem={renderListItem} rows={rows.current} totalRecords={totalRecords} totalPage={totalPage} queryData={QueryData} search={true} />
                    </div>
                </div>
            </div>

            <Dialog visible={isVisible} breakpoints={{'960px': '100vw', '640px': '100vw'}} style={{width: '80vw'}} header=" Surat Jalan" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <DataTableComp api={false} scrollable={false} scrollHeight="flex" title="" models={model} search={true} columnsTable={columnsTable} paginator={false} />
            </Dialog>
            <PostPutValidationComp waitingDialog={waiting}/>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(ScheduleList), comparisonFn);
