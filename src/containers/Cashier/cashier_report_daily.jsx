import React, { Fragment, useEffect, useState } from 'react'
import { useRef } from 'react';
import { APICompany, APIPool } from '../../components/api/APIMaster';
import DailyUJTPage from '../../components/report/ujt/daily';
import AutoCompleteComp from '../../components/standard/Form/AutoCompleteComp';
import DatePickerComp from '../../components/standard/Form/DatePickerComp';
import DropDownComp from '../../components/standard/Form/DropDownComp'
import MenubarComp from '../../components/standard/Menu/MenubarComp'
import { formatDateString } from '../../helpers/FormatHelpers';
import * as HeaderService from '../../service/Bank/CashierService';
import * as PoolService from '../../service/Master/PoolService';
import { createUJTExcel } from '../Excel/ujt_daily_excel';
import * as CookieConfig from './../../config/CookieConfig';
import { Toast } from 'primereact/toast';

const CashierDailyReport = () => {
    const toast = useRef();
    const issue_date_ref = useRef(formatDateString(new Date()));
    const [models, setModels] = useState(null);
    const [companyData, setCompanyData] = useState([]);
    const [companyValue, setCompanyValue] = useState(null);
    const [poolData, setPoolData] = useState([]);
    const [poolSelect, setPoolSelect] = useState([]);
    const [counterSelect, setCounterSelect] = useState(null);
    const [shiftSelect, setShiftSelect] = useState(null);

    const ujt = {
        "company_id": 0,
        "company_code": "",
        "company_name": "",
        "pool_id": 0,
        "pool_name": "",
        "shift": 0,
        "counter": "",
        "issue_date": "",
        "opening_balance": 0,
        "dropping": 0,
        "cash_out": {
            "ujt_out": 0,
            "selisih": 0,
            "bonus": 0,
            "adjustment": 0
        },
        "total_cash_out": 0,
        "cash_in": {
            "ujt_void": 0,
            "operan": 0,
            "claim": 0,
            "reimburse_finance": 0
        },
        "total_cash_int": 0,
        "closing_balance": 0,
        "cash_on_hand": {
            "void_on_hand": 0,
            "ujt_on_hand": 0,
            "selisih_on_hand": 0,
            "over_reimburse_on_hand": 0,
            "additional_on_hand": 0,
            "loan_on_hand": 0
        },
        "total_on_hand": 0,
        "cash_ho": {
            "unposted_ho": 0,
            "over_reimburse_ho": 0
        },
        "subtotal": 0,
        "operan_on_hand": 0,
        "total": 0,
        "modal": 0,
        "variance": 0,
        "cash_prepaid": {
            "claim_prepaid": 0,
            "adjustment_prepaid": 0
        },
        "total_prepaid": 0,
        "order_lists": [
        ]
    }

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

    const getCompany = async() => {
        const res = await APICompany("");

        setCompanyData(res);
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
        if (!poolSelect) return;

        const params = {
            issue_date: issue_date_ref.current,
            company_id: companyValue,
            pool_id: poolSelect.id,
            shift: shiftSelect,
            counter: counterSelect,
        };

        const res = await HeaderService.GetUJTDaily(params);

        if (res.status === 200) {
            console.log(res.data)
            if (res.data)
            {
                setModels(res.data);
            } else {
                setModels(null);
            }
        } else {
            setModels(null);
        }
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "refresh":
                QueryData();
                break;
            case "download":
                if (models.order_lists) {
                    createUJTExcel(models);
                } else {
                    toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data kosong!!!", life: 3000 });
                }

            default:
                break;
        }
    }

    useEffect(() => {
        setPoolData(null);
        getCompany();
        setCounterSelect(counterData[0].name);
        setShiftSelect(shiftData[0].name);
        getPoolID();

        if (companyData.length > 0) {
            setCompanyValue(companyData[0].id);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <Toast ref={toast} />
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <MenubarComp field="toolbar-list" action="refresh-download" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>

                    <div className="col-12">
                        <div className="grid p-fluid">
                            <DropDownComp className="field col-12 md:col-3" validate={false} field="company_id" title="Grup Perusahaan" optionLabel="name" optionValue="id" options={companyData} value={companyValue}
                                onChange={(e) => setCompanyValue(e.value)} />
                            <DatePickerComp className="field col-12 md:col-2" validate={false} field="issue_date" title="Tgl Cashier" value={issue_date_ref.current} onChange={(e) => { issue_date_ref.current = e }} />
                            <DropDownComp className="field col-12 md:col-2" validate={false} field="counter" title="Loket" optionLabel="name" optionValue="name" options={counterData} value={counterSelect}
                               onChange={(e) => { setCounterSelect(e.value);  }} />
                            <DropDownComp className="field col-12 md:col-2" validate={false} field="shift" title="Shift" optionLabel="name" optionValue="name" options={shiftData} value={shiftSelect}
                                onChange={(e) => { setShiftSelect(e.value); }} />
                            <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={false} field="pool_id" title="Pool" showField="name"models={poolData}
                                queryData={(e) => getPool(e)} value={poolSelect} setSelectValue={(e) => setPoolSelect(e)} onChange={(e) => { setPoolSelect(e.value);  }} />
                        </div>

                        <DailyUJTPage header={models ? models : ujt} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CashierDailyReport, comparisonFn);
