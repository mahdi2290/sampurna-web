import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import * as ListService from '../../service/Sales/SalesPrice';

const PriceList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);

    const title = "Price";
    const columnsTable = [
        { field: 'effective_date', header: 'Tgl Efektif', sortable: false, style: "percentage", width:8 },
        { field: 'expired_date', header: 'Tgl Exp', sortable: false, style: "percentage", width: 8 },
        { field: 'origin_id.code', header: 'Origin', sortable: false, style: "percentage", width: 5 },
        { field: 'customer_id.name', header: 'Customer', sortable: false, style: "percentage", width: 15 },
        { field: 'plant_id.full_name', header: 'Plant', sortable: false, style: "percentage", width: 20 },
        { field: 'product_id.name', header: 'Produk', sortable: false, style: "percentage", width: 10 },
        { field: 'order_type_id.name', header: 'Transaksi', sortable: false, style: "percentage", width: 10 },
        { field: 'fleet_type_id.name', header: 'Jenis', sortable: false, style: "percentage", width: 7 },
        { field: 'price', header: 'Harga', sortable: false, style: "percentage", width: 7, body: "currency" },
        { field: 'uom', header: 'Uom', sortable: false, style: "percentage", width: 6 },
        { field: 'action', header: '' },
    ];
    // const exportColumns = columnsTable.map(col => ({ title: col.header, dataKey: col.field }));

    useEffect(() => {
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const QueryData = async (page, pageSize, keyword) => {
        setIsLoading(true);

        const res = await ListService.GetAll(page, pageSize, keyword);

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
            pathname: "/price/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname: "/price/edit/" + data.id,
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

export default React.memo(PriceList, comparisonFn);
