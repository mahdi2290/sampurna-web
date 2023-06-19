import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import * as ListService from '../../service/Ujt/UjtService';

const UjtList = () => {
    const history = useHistory();
    const [waiting, setWaiting] = useState(false);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");

    const title = "UJT";
    let localModeStorage = localStorage.getItem("layoutMode");
    let columnsTable = "";
    if (localModeStorage === "static" ) {
        columnsTable = [
            { field: 'effective_date', header: 'Tgl Efektif', sortable: false, style: "percentage", width: 8 },
            { field: 'sales_type_id.name', header: 'Bisnis Unit', sortable: false, style: "percentage", width: 7 },
            { field: 'customer_id.name', header: 'Customer', sortable: false, style: "percentage", width: 13 },
            { field: 'origin_id.code', header: 'Asal', sortable: false, style: "percentage", width: 7 },
            { field: 'plant_id.full_name', header: 'Plant', sortable: false, style: "percentage", width: 18 },
            { field: 'product_id.name', header: 'Produk', sortable: false, style: "percentage", width: 8 },
            { field: 'fleet_type_id.name', header: 'Jenis Truk', sortable: false, style: "percentage", width: 10 },
            { field: 'distance', header: 'Jarak', sortable: false, style: "percentage", width: 7, body: "currency" },
            { field: 'ujt', header: 'UJT', sortable: false, style: "percentage", width: 8, body: "currency" },
            { field: 'total_cost', header: 'Total', sortable: false, style: "percentage", width: 8, body: "currency" },
            { field: 'action', header: '' },
        ];
    } else {
        columnsTable = [
            { field: 'effective_date', header: 'Tgl Efektif', sortable: false, style: "percent", width: 8 },
            { field: 'sales_type_id.name', header: 'Bisnis Unit', sortable: false, style: "percent", width: 7 },
            { field: 'customer_id.name', header: 'Customer', sortable: false, style: "percent", width: 13 },
            { field: 'origin_id.code', header: 'Asal', sortable: false, style: "percent", width: 7 },
            { field: 'plant_id.full_name', header: 'Plant', sortable: false, style: "percent", width: 18 },
            { field: 'product_id.name', header: 'Produk', sortable: false, style: "percent", width: 8 },
            { field: 'fleet_type_id.name', header: 'Jenis Truk', sortable: false, style: "percent", width: 10 },
            { field: 'distance', header: 'Jarak', sortable: false, style: "percent", width: 7, body: "currency" },
            { field: 'ujt', header: 'UJT', sortable: false, style: "percent", width: 8, body: "currency" },
            { field: 'total_cost', header: 'Total', sortable: false, style: "percent", width: 8, body: "currency" },
            { field: 'action', header: '' },
        ];
    }

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryData = async (page, pageSize, keyword) => {
        setWaiting(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword };

        const result = await ListService.GetAll(params);

        setModels([]);
        setTotalRecords(0);
        if (result.status === 200) {
            if (result.data) {
                setModels(result.data.list);
                setTotalRecords(result.data.total);
            }
        }

        setWaiting(false);
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
            pathname: "/ujt/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname: "/ujt/edit/" + data.id,
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
                <DataTableListComp api={true} history={history} toolbar={true} toolbarAction="list" title={title}  search={true} setGlobal={(e) => setGlobalFilter(e)}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                    actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} />
            </div>
            <PostPutValidationComp waitingDialog={waiting}/>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(UjtList, comparisonFn);
