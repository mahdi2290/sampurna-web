import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import * as ListService from '../../service/Fleet/FleetService';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";

const FleetList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");

    const QueryData = async(page, pageSize, keyword) => {
        setIsLoading(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword }

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

    const actionNew = () => {
        return history.push({
            pathname: "/fleet/create",
            state: {}
        });
    }

    const actionEdit = async (data) => {
        return history.push({
            pathname: "/fleet/edit/" + data.id,
            state: {}
        });
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData(1, perPage, globalFilter);
        }, 250);
    }

    const title = "Fleet";
    let localModeStorage = localStorage.getItem("layoutMode");
    let columnsTable = "";
    if (localModeStorage === "static" ) {
        columnsTable = [
            { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 0.5 },
            { field: 'fleet_type_id.name', header: 'Jenis Kendaraan', sortable: false, style: "percent", width: 0.5},
            { field: 'company_id.name', header: 'Bisnis Unit', sortable: false, style: "percent", width: 1},
            { field: 'volume', header: 'Volume', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'length', header: 'Length', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'width', header: 'Width', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'height', header: 'Height', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'action', header: '' },
        ];
    } else {
        columnsTable = [
            { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 0.5 },
            { field: 'fleet_type_id.name', header: 'Jenis Kendaraan', sortable: false, style: "percent", width: 0.5},
            { field: 'company_id.name', header: 'Bisnis Unit', sortable: false, style: "percent", width: 1},
            { field: 'volume', header: 'Volume', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'length', header: 'Length', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'width', header: 'Width', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'height', header: 'Height', sortable: false, style: "percent", width: 0.5, body: "currency4"},
            { field: 'action', header: '' },
        ];
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

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


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

export default React.memo(FleetList, comparisonFn);
