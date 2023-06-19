import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import * as BankService from '../../../service/Bank/BankService';
import DataTableListComp from "../../../components/standard/DataTable/DataTableListComp";

const InvoiceList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);

    const title = "Bank";
    let localModeStorage = localStorage.getItem("layoutMode");
    let columnsTable = "";
    if (localModeStorage === "static" ) {
        columnsTable = [
            { field: 'name', header: 'Nama Bank', sortable: false, style: "percent", width: 1},
            { field: 'swift', header: 'Swift', sortable: false, style: "percent", width: 1},
            { field: 'bi', header: 'BI', sortable: false, style: "percent", width: 1},
            { field: 'city_id.name', header: 'Kota', sortable: false, style: "percent", width: 1},
            { field: 'action', header: '' },
        ];
    } else {
        columnsTable = [
            { field: 'name', header: 'Nama Bank', sortable: false, style: "percent", width: 2},
            { field: 'swift', header: 'Swift', sortable: false, style: "percent", width: 1},
            { field: 'bi', header: 'BI', sortable: false, style: "percent", width: 1},
            { field: 'city_id.name', header: 'Kota', sortable: false, style: "percent", width: 1},
            { field: 'action', header: '' },
        ];
    }

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryData = async(page, pageSize, keyword) => {
        setIsLoading(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword };

        const res = await BankService.GetAll(params);

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
            QueryData(1, perPage, "");
        }, 250);
    }

    const actionNew = () => {
        return history.push({
            pathname:  "/sales/office/invoice/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname:  "/sales/office/invoice/edit/" + data.id,
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
                <DataTableListComp api={true} history={history} toolbar={true} toolbarAction="list" loading={isLoading} title={title}  search={true}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                    actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} />
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(InvoiceList, comparisonFn);
