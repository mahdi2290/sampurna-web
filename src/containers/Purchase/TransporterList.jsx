import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import * as CustomerService from '../../service/Customer/CustomerService';

const TransporterList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);

    const title = "Transporter";
    const columnsTable = [
        { field: 'code', header: 'Kode', sortable: false, style: "percent", width: 0.3 },
        { field: 'name', header: 'Nama', sortable: false, style: "percent", width: 1.2},
        { field: 'emaii', header: 'Email', sortable: false, style: "percent", width: 1 },
        { field: 'phone', header: 'Telp', sortable: false, style: "percent", width: 0.7 },
        { field: 'terms', header: 'Terms', sortable: false, style: "percent", width: 0.3 },
        { field: 'credit', header: 'Limit', sortable: false, style: "percent", width: 0.3 },
        { field: 'teritory', header: 'Kec/Kel', sortable: false, style: "percent", width: 1 },
        { field: 'is_po', header: 'PO', sortable: false, style: "percent", width: 0.2, body: "boolean" },
        { field: 'status', header: 'Status', sortable: false, style: "percent", width: 0.2, body: "boolean" },
        { field: 'action', header: '' },
    ];
    // const exportColumns = columnsTable.map(col => ({ title: col.header, dataKey: col.field }));

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryData = async(page, pageSize, keyword) => {
        setIsLoading(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword };

        const res = await CustomerService.GetAll(params);

        if (res.status === 200) {
            if (res.data) {
                setModels(res.data.list);
                setTotalRecords(res.data.total);
            } else {
                setModels([]);
                setTotalRecords(0);
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
            pathname: "/purchase/master/transporter/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname: "/customer/edit/" + data.id,
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

export default React.memo(TransporterList, comparisonFn);
