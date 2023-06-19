import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import DataTableComp from "../../components/standard/DataTable/DataTableComp";
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import { DatePicker } from "../../components/standard/DateSlider/DatePicker";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import { GlobalConsumer } from "../../config/Context";
import { formatDateString } from "../../helpers/FormatHelpers";
import * as ListService from '../../service/Fleet/FleetFormationService';
import { TabPanel, TabView } from "primereact/tabview";
import { createFormationListExcel } from "../Excel/formation_list_excel";

const FleetFormationList = (props) => {
    const history = useHistory();
    const [waiting, setWaiting] = useState(false);
    const [modelsActive, setModelsActive] = useState([]);
    const [totalRecordsActive, setTotalRecordsActive] = useState(10);
    const [perPageActive, setPerPageActive] = useState(10);
    const [modelsHistory, setModelsHistory] = useState([]);
    const [totalRecordsHistory, setTotalRecordsHistory] = useState(10);
    const [perPageHistory, setPerPageHistory] = useState(10);
    const [activeIndex, setActiveIndex] = useState(0);
    const [globalFilterActive, setGlobalFilterActive] = useState("");
    const [globalFilterHistory, setGlobalFilterHistory] = useState("");

    const [date, setDate] = useState();
    const startDate = new Date('2023-03-01');
    const issueDateRef = useRef();

    const selectedDay = (val) => {
        issueDateRef.current = val;
        setDate(val);

        if (activeIndex === 0) {
            QueryDataActive(1, perPageActive, globalFilterActive);
        } else if (activeIndex === 1){
            QueryDataHistory(1, perPageHistory, globalFilterHistory);
        }
    };

    let columnsTableActive = "";
    columnsTableActive = [
        { field: 'formation_grup_id.name', header: 'Bisnis Unit', sortable: false, style: "percent", width: 1 },
        { field: 'issue_date', header: 'Tgl Formasi', sortable: false, style: "percent", width: 1 },
        { field: 'expired_date', header: 'Tgl Expired', sortable: false, style: "percent", width: 1 },
        { field: 'coor_id.name', header: 'Staff Transport', sortable: false, style: "percent", width: 1 },
        { field: 'formation_id.name', header: 'Formation', sortable: false, style: "percent", width: 1 },
    ];

    let columnsTableHistory = "";
    columnsTableHistory = [
        { field: 'reference_no', header: 'No Formasi', sortable: false, style: "percent", width: 1 },
        { field: 'formation_grup_id.name', header: 'Bisnis Unit', sortable: false, style: "percent", width: 1
     },
        { field: 'issue_date', header: 'Tgl Formasi', sortable: false, style: "percent", width: 1 },
        { field: 'expired_date', header: 'Tgl Expired', sortable: false, style: "percent", width: 1 },
        { field: 'coor_id.name', header: 'Staff Transport', sortable: false, style: "percent", width: 1 },
        { field: 'formation_id.name', header: 'Formation', sortable: false, style: "percent", width: 1 },
        { field: 'action', header: '' },
    ];

    useEffect(() => {
        setDate(new Date());
        issueDateRef.current = new Date();
        setPerPageActive(10);
        setPerPageHistory(10);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (activeIndex === 0) {
            QueryDataActive(1, perPageActive, globalFilterActive);
        } else if (activeIndex === 1){
            QueryDataHistory(1, perPageHistory, globalFilterHistory);
        }
    }, [activeIndex, setActiveIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryDataHistory = async (page, pageSize, keyword) => {
        setWaiting(true);
        let issueDate = issueDateRef.current;

        const params = { issue_date: formatDateString(issueDate), page: page, pagesize: pageSize, keyword: keyword };

        const res = await ListService.GetAll(params);

        setModelsHistory([]);
        setTotalRecordsHistory(0);
        if (res.status === 200) {
            if (res.data) {
                setModelsHistory(res.data.list);
                setTotalRecordsHistory(res.data.total);
            }
        }

        setWaiting(false);
    }

    const QueryDataActive = async (page, pageSize, keyword) => {
        setWaiting(true);
        let issueDate = issueDateRef.current;

        const params = { issue_date: formatDateString(issueDate), page: page, pagesize: pageSize, keyword: keyword };

        const res = await ListService.GetAllActive(params);

        setModelsActive([]);
        setTotalRecordsActive(0);
        if (res.status === 200) {
            if (res.data) {
                setModelsActive(res.data.list);
                setTotalRecordsActive(res.data.total);
            }
        }

        setWaiting(false);
    }

    const onSetPerPageHistory = (e) => {
        setPerPageHistory(e);
    }

    const onSetPerPageActive = (e) => {
        setPerPageActive(e);
    }

    const actionRefresh = () => {
        if (activeIndex === 0) {
            QueryDataActive(1, perPageActive, "");
        } else if (activeIndex === 1){
            QueryDataHistory(1, perPageHistory, "");
        }
    }

    const actionNew = () => {
        props.dispatch({ type: "add-data", id:'date-formation', data: issueDateRef.current });

        return history.push({
            pathname: "/fleet-formation/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname: "/fleet-formation/edit/" + data.id,
            state: {}
        });
    }

    const exportExcel = async() => {
        setWaiting(true);
        let issueDate = issueDateRef.current;

        const params = { issue_date: formatDateString(issueDate), pagesize: 100 };

        const res = await ListService.GetAllActive(params);

        if (res.status === 200) {
            if (res.data) {
                createFormationListExcel(res.data.list);
            }
        }

        setWaiting(false);
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "export":
                exportExcel();
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

    const columnsTableDetailHistory = [
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 1},
        { field: 'driver_nik', header: 'Batang NIK', sortable: false, style: "percent", width: 1},
        { field: 'driver_name', header: 'Batang Nama', sortable: false, style: "percent", width: 1},
        { field: 'driver_phone', header: 'Batang No Telp', sortable: false, style: "percent", width: 1},
        { field: 'back_up_nik', header: 'Serep NIK', sortable: false, style: "percent", width: 1},
        { field: 'back_up_name', header: 'Serep Nama', sortable: false, style: "percent", width: 1},
        { field: 'back_up_phone', header: 'Serep No Telp', sortable: false, style: "percent", width: 1},
    ];

    const columnsTableDetailActive = [
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 1},
        { field: 'driver_nik', header: 'Batang NIK', sortable: false, style: "percent", width: 1},
        { field: 'driver_name', header: 'Batang Nama', sortable: false, style: "percent", width: 1},
        { field: 'driver_phone', header: 'Batang No Telp', sortable: false, style: "percent", width: 1},
        { field: 'back_up_nik', header: 'Serep NIK', sortable: false, style: "percent", width: 1},
        { field: 'back_up_name', header: 'Serep Nama', sortable: false, style: "percent", width: 1},
        { field: 'back_up_phone', header: 'Serep No Telp', sortable: false, style: "percent", width: 1},
    ];

    const onRowExpansionTemplateHistory = (data) => {
        if (data.lists === null) {
            return (
                <div>No data found</div>
            )
        } else {
            return (
                <div className="flex flex-wrap justify-content-end">
                    <DataTableComp api={false} title={data.name} search={true} models={data.lists} rows={10} columnsTable={columnsTableDetailHistory} children={true} />
                </div>
            );
        }
    }

    const onRowExpansionTemplateActive = (data) => {
        if (data.lists === null) {
            return (
                <div>No data found</div>
            )
        } else {
            return (
                <div className="flex flex-wrap justify-content-end">
                    <DataTableComp api={false} title={data.name} search={true} models={data.lists} rows={10} columnsTable={columnsTableDetailActive} children={true} />
                </div>
            );
        }
    }

    return (
        <Fragment>
            <div className="card">
                <DatePicker
                    startDate={startDate}
                    days={365 * 25}
                    type="day"
                    selectDate={date}
                    getSelectedDay={selectedDay}
                    labelFormat={"MMMM yyyy"}
                    color={"#374e8c"} />

                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="mt-3">
                    <TabPanel header="Active">
                        <DataTableListComp api={true} toolbar={true} toolbarAction="list" title="Active" search={true} excel={true} actionExport={exportExcel} setGlobal={(e) => setGlobalFilterActive(e)}
                            models={modelsActive} columns={columnsTableActive} totalRecords={totalRecordsActive} perPage={perPageActive} setPerPage={onSetPerPageActive} getAll={QueryDataActive}
                            tableType="expand" rowExpansion={onRowExpansionTemplateActive} actionButtonToolbar={(e) => actionButtonToolbar(e)} />
                    </TabPanel>
                    <TabPanel header="History">
                        <DataTableListComp api={true} toolbar={true} toolbarAction="list" title="History" search={true} setGlobal={(e) => setGlobalFilterHistory(e)}
                            models={modelsHistory} columns={columnsTableHistory} totalRecords={totalRecordsHistory} perPage={perPageHistory} setPerPage={onSetPerPageHistory} getAll={QueryDataHistory}
                            tableType="expand" rowExpansion={onRowExpansionTemplateHistory} actionButtonToolbar={(e) => actionButtonToolbar(e)}  actionEdit={(data) => actionEdit(data)} />
                    </TabPanel>
                </TabView>
                <PostPutValidationComp waitingDialog={waiting}/>
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(FleetFormationList), comparisonFn);
