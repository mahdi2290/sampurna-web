import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import * as ListService from '../../service/Payroll/PayrollService';

const PayrollList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");

    const title = "Payroll";
    const columnsTable = [
        { field: 'reference_no', header: 'No Referensi', sortable: false, style: "percent", width: 0.7, frozen: true},
        { field: 'company_id.name', header: 'Grup Perusahaan', sortable: false, style: "percent", width: 1, frozen: true},
        { field: 'sales_type_id.name', header: 'Bisnis Unit', sortable: false, style: "percent", width: 0.5, frozen: true},
        { field: 'issue_date', header: 'Issue Date', sortable: false, style: "percent", width: 0.7},
        { field: 'period1', header: 'Period From', sortable: false, style: "percent", width: 0.4},
        { field: 'period2', header: 'Period To', sortable: false, style: "percent", width: 0.4},
        { field: 'formation_date', header: 'Tgl Formasi', sortable: false, style: "percent", width: 0.4},
        { field: 'zero_do', header: 'SJ Nol', sortable: false, style: "percent", width: 0.4, body: "currency"},
        { field: 'total_do', header: 'SJ', sortable: false, style: "percent", width: 0.4, body: "currency"},
        { field: 'ritase', header: 'Ritase', sortable: false, style: "percent", width: 0.4, body: "currency2"},
        { field: 'salary', header: 'Salary', sortable: false, style: "percent", width: 0.4, body: "currency2"},
        { field: 'transfer', header: 'Transfer', sortable: false, style: "percent", width: 0.4, body: "currency2"},
        { field: 'action', header: '' },
    ];

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryData = async(page, pageSize, keyword) => {
        setIsLoading(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword };

        const res = await ListService.GetAll(params);

        setModels([]);
        setTotalRecords(0);
        if (res.status === 200) {
            if (res.data) {
                setModels(res.data.list);
                setTotalRecords(res.data.total);
            }
        }

        setIsLoading(false);
    }

    const onSetPerPage = (e) => {
        setPerPage(e);
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData(1, perPage, globalFilter);
        }, 250);
    }

    const actionNew = () => {
        return history.push({
            pathname:  "/payroll/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname:  "/payroll/edit/" + data.id,
            state: {}
        });
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "export":
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

    return (
        <Fragment>
            <div className="card">
                <DataTableListComp api={true} history={history} toolbar={true} toolbarAction="list" loading={isLoading} title={title}  search={true} setGlobal={(e) => setGlobalFilter(e)}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                    actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} />
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(PayrollList, comparisonFn);
