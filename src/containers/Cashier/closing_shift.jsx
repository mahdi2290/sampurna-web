import React, { Fragment, useState, useEffect, useRef } from 'react'
import { APICompany, APIPool } from '../../components/api/APIMaster';
import MenubarComp from '../../components/standard/Menu/MenubarComp';
import DropDownComp from "../../components/standard/Form/DropDownComp";
import { formatCurrency, formatDateString, formatDateTimeString } from '../../helpers/FormatHelpers';
import DateTimePickerComp from '../../components/standard/Form/DateTimePickerComp';
import DatePickerComp from '../../components/standard/Form/DatePickerComp';
import * as HeaderService from '../../service/Bank/ClosingShiftService';
import { Toast } from 'primereact/toast';
import PostPutValidationComp from '../../components/standard/Validation/PostPutValidationComp';
import DataViewComp from '../../components/standard/Dataview/DataViewComp';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import * as CookieConfig from './../../config/CookieConfig';
import asm from './../../assets/images/asm.png';
import sms from './../../assets/images/sms.png';
import nca from './../../assets/images/nca.png';
import AutoCompleteComp from '../../components/standard/Form/AutoCompleteComp';
import * as PoolService from '../../service/Master/PoolService';

const ClosingShift = () => {
    const toast = useRef();
    const rows = useRef(9);
    const page = useRef(1);
    const company_id = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modelsCashier, setModelsCashier] = useState([]);
    const [modelsDrop, setModelsDrop] = useState([]);
    const [totalRecordsCashier, setTotalRecordsCashier] = useState(10);
    const [totalRecordsDrop, setTotalRecordsDrop] = useState(10);
    const [totalPageCashier, setTotalPageCashier] = useState(0);
    const [poolData, setPoolData] = useState([]);
    const [poolSelect, setPoolSelect] = useState([]);

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [counterSelect, setCounterSelect] = useState(null);
    const [shiftSelect, setShiftSelect] = useState(null);
    const [cutOff, setCutOff] = useState(formatDateTimeString(new Date()));
    const [issueDate, setIssueDate] = useState(formatDateString(new Date()));

    const shiftData = [
        { name: 1 },
        { name: 2 },
        { name: 3 }
    ];

    const counterData = [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" }
    ];

    const getCompany = async(keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

    const getPool = async(keyword) => {
        const res = await APIPool(keyword);

        setPoolData(null);

        return res;
    }

    const getPoolID = async(id) => {
        const result = await PoolService.GetByID(CookieConfig.get('pool_id'));

        if (result.status === 200) {
            setPoolSelect(result.data);
        }
    }

    const QueryData = async() => {
        const pool_id = CookieConfig.get('pool_id');
        const company = company_id.current === undefined ? 0 : company_id.current;

        if (pool_id > 0 && company > 0) {
            setWaiting(true);

            const params = { page: page.current, pagesize: rows.current, keyword: globalFilter, issue_date: issueDate, cut_off_date: cutOff, pool_id: pool_id, shift: shiftSelect, counter: counterSelect };

            const res = await HeaderService.GetAll(company, params);
            setModelsCashier([]);
            setTotalRecordsCashier(0);
            setTotalPageCashier(0);
            setModelsDrop([]);
            setTotalRecordsDrop(0);

            if (res.status === 200) {
                if (res.data.order_list) {
                    setModelsCashier(res.data.order_list.list);
                    setTotalRecordsCashier(res.data.order_list.total);
                    setTotalPageCashier(res.data.order_list.page);
                }
                if (res.data.drop_list) {
                    setModelsDrop(res.data.drop_list);
                    setTotalRecordsDrop(res.data.drop_list.length);
                }
            }

            setWaiting(false);
        }
        setCompanyData(null);
    }

    const getAll = (num) => {
        page.current = num;

        QueryData();
    }

    const actionSave = async() => {
        setWaiting(true);

        let receipt_id = "";
        let drop_id = "";

        if (modelsCashier) {
            for (let index = 0; index < modelsCashier.length; index++) {
                const row = modelsCashier[index];

                if (index === 0) {
                    receipt_id = row.receipt_id;
                } else {
                    receipt_id = receipt_id + "," + row.receipt_id;
                }
            }
        }

        if (modelsDrop) {
            for (let index = 0; index < modelsDrop.length; index++) {
                const row = modelsDrop[index];

                if (index === 0) {
                    drop_id = row.id;
                } else {
                    drop_id = drop_id + "," + row.id;
                }
            }
        }

        let form = new FormData();

        form.append('issue_date', issueDate);
        form.append('cut_off_date', cutOff);
        form.append('pool_id', CookieConfig.get('pool_id'));
        form.append('counter', counterSelect);
        form.append('shift', shiftSelect);
        form.append('receipt_id', receipt_id);
        form.append('drop_id', drop_id);

        const result = await HeaderService.PostData(companySelect.id, form);
        if (result.status === 200) {
            QueryData();
            toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });
        } else if (result.status === 400) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        } else if (result.status === 402) {
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setErrorVisible(true);
            setErrorMessage(result.message);
        }

        setWaiting(false);
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData(1, "");
        }, 250);
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "export":
                break;

            case "refresh":
                actionRefresh();
                break;

            case "save":
                actionSave();
                break;

            default:
                break;
        }
    }

    const getSeverity = (data) => {
        switch (data.status_id) {
            case 0:
                return "p-button-secondary p-button-outlined justify-content-center"
            case 1:
                return "p-button-danger p-button-outlined justify-content-center"
            case 2:
                return "p-button-warning p-button-outlined justify-content-center"
            case 3:
                return "p-button-success p-button-outlined justify-content-center"
            case 4:
                return "p-button-success p-button-outlined justify-content-center"
            case 5:
                return "p-button-success p-button-outlined justify-content-center"
            case 6:
                return "p-button-success p-button-outlined justify-content-center"
            case 7:
                return "p-button-success p-button-outlined justify-content-center"
            case 8:
                return "p-button-success p-button-outlined justify-content-center"
            case 9:
                return "p-button-success p-button-outlined justify-content-center"
            case 10:
                return "p-button-success p-button-outlined justify-content-center"
            case 11:
                return "p-button-success justify-content-center"
            case 12:
                return "p-button-success justify-content-center"
            case 13:
                return "p-button-danger justify-content-center"
            case 14:
                return "p-button-danger justify-content-center"

            default:
                break;
        }
    };

    const renderListItemCashier = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    {
                        data.company_code === "ASM" ? <img className="w-3 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={asm} alt={data.company_code} /> : ""
                    }
                    {
                        data.company_code === "SMS" ? <img className="w-3 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={sms} alt={data.company_code} /> : ""
                    }
                    {
                        data.company_code === "NCA" ? <img className="w-3 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={nca} alt={data.company_code} /> : ""
                    }
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{data.employee_name}</div>
                            <div className="text-1xl font-bold text-900">{data.issue_date}</div>
                            <div className="text-1xl font-bold text-900">{data.confirm_ujt_date}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="text-2xl font-semibold">{formatCurrency(data.receipt_amount, 0)}</span>
                                </span>
                                <Button type="button" className={getSeverity(data)}>
                                    {data.status}
                                </Button>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-1xl font-semibold">{data.receipt_no !== "" ? data.receipt_no : "\u00a0"}</span>
                            <div className="text-1xl font-bold">{data.receipt_date !== "" ? data.receipt_date : "\u00a0"}</div>
                            <div className="text-1xl font-bold">{data.pool_name}</div>
                            <div className="text-1xl font-bold">{data.shift}</div>
                            <div className="text-1xl font-bold">{data.counter}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItemCashier = (data) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{data.reference_no} | {data.confirm_ujt_date}</span>
                        </div>
                        <Button type="button" className={getSeverity(data)}>
                            {data.status}
                        </Button>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        {
                            data.company_code === "ASM" ? <img className="w-3 shadow-2 border-round" src={asm} alt={data.company_code} /> : ""
                        }
                        {
                            data.company_code === "SMS" ? <img className="w-3 shadow-2 border-round" src={sms} alt={data.company_code} /> : ""
                        }
                        {
                            data.company_code === "NCA" ? <img className="w-3 shadow-2 border-round" src={nca} alt={data.company_code} /> : ""
                        }
                        <div className="text-1xl font-bold">{data.employee_name}</div>
                        <div className="text-2xl font-bold">{formatCurrency(data.receipt_amount, 0)}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-1xl font-semibold">{data.receipt_no !== "" ? data.receipt_no : "\u00a0"}</span>
                        <div className="text-1xl font-bold">{data.receipt_date !== "" ? data.receipt_date : "\u00a0"}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderListItemDrop = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-3 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={process.env.PUBLIC_URL + `/assets/images/logo/${data.company_id.code}.png`} alt={data.company_id.code} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{data.pool_id.name}</div>
                            <div className="text-1xl font-bold text-900">{data.issue_date}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="text-2xl font-semibold">{formatCurrency(data.amount, 0)}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-1xl font-semibold">{data.reference_no !== "" ? data.reference_no : "\u00a0"}</span>
                            <div className="text-1xl font-bold text-900">{data.account_name}</div>
                            <div className="text-1xl font-bold">{data.memo !== "" ? data.memo : "\u00a0"}</div>
                            <div className="text-1xl font-bold">Shift {data.shift}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItemDrop = (data) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{data.issue_date} - Shift {data.shift}</span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-3 shadow-2 border-round" src={process.env.PUBLIC_URL + `/assets/images/logo/${data.company_id.code}.png`} alt={data.company_id.code} />
                        <div className="text-1xl font-bold">{data.pool_id.name}</div>
                        <div className="text-2xl font-bold">{formatCurrency(data.amount, 0)}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-1xl font-semibold">{data.reference_no !== "" ? data.reference_no : "\u00a0"}</span>
                        <div className="text-1xl font-bold">{data.memo !== "" ? data.memo : "\u00a0"}</div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        setPoolData(null);
        getPoolID();

        setCounterSelect(counterData[0].name);
        setShiftSelect(shiftData[0].name);

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        QueryData();
    }, [company_id.current]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <MenubarComp field="toolbar-list" action="refresh-save" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>
                    <Toast ref={toast} />
                    <div className="col-12">
                        <div className="grid p-fluid">
                            <AutoCompleteComp className="field col-12 md:col-2" api={true} validate={false} field="company_id" title="Grup Perusahaan" showField="name" models={companyData}
                                queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => { setCompanySelect(e); company_id.current = e.id; }} onChange={(e) => { setCompanySelect(e.value); company_id.current = e.value.id; }} />
                            <DatePickerComp className="field col-12 md:col-2" validate={false} field="issue_date" title="Tgl Issue" value={issueDate} onChange={(e) => { setIssueDate(e) }} />
                            <DateTimePickerComp className="field col-12 md:col-2" validate={false} field="cut_off_date" title="Tgl SJ" value={cutOff} onChange={(e) => { setCutOff(e) }} />
                            <DropDownComp className="field col-12 md:col-2" validate={false} field="counter" title="Loket" optionLabel="name" optionValue="name" options={counterData} value={counterSelect}
                                onChange={(e) => { setCounterSelect(e.value); }} />
                            <DropDownComp className="field col-12 md:col-2" validate={false} field="shift" title="Shift" optionLabel="name" optionValue="name" options={shiftData} value={shiftSelect}
                                onChange={(e) => { setShiftSelect(e.value); }} />
                            <AutoCompleteComp className="field col-12 md:col-2" api={true} validate={false} field="pool_id" title="Pool" showField="name" models={poolData}
                                queryData={(e) => getPool(e)} value={poolSelect} setSelectValue={(e) => setPoolSelect(e)} onChange={(e) => { setPoolSelect(e.value);  }} />
                        </div>
                    </div>

                    <div className="col-12">
                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="mt-3">
                            <TabPanel header="Close Cashier">
                                <DataViewComp title="Close Cashier" search={true} api={true} models={modelsCashier} paginator={true} renderGridItem={renderGridItemCashier} renderListItem={renderListItemCashier} rows={rows.current} totalRecords={totalRecordsCashier} totalPage={totalPageCashier} queryData={getAll} setGlobal={(e) => setGlobalFilter(e)}/>
                            </TabPanel>
                            <TabPanel header="Close Cashier Drop">
                                <DataViewComp title="Close Cashier Drop" search={true} api={true} models={modelsDrop} paginator={true} renderGridItem={renderGridItemDrop} renderListItem={renderListItemDrop} rows={rows.current} totalRecords={totalRecordsDrop} totalPage={1} queryData={getAll} setGlobal={(e) => setGlobalFilter(e)}/>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>

            <PostPutValidationComp waitingDialog={waiting} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage}/>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ClosingShift, comparisonFn);
