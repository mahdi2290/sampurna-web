import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableComp from "../../components/standard/DataTable/DataTableComp";
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import * as ListService from '../../service/Customer/CustomerService';

const CustomerList = (props) => {
    const history = useHistory();
    const [waiting, setWaiting] = useState(false);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");

    let localModeStorage = localStorage.getItem("layoutMode");

    const title = "Customer";
    let columnsTable = "";
    columnsTable = [
        { field: 'code', header: 'Kode', sortable: false, style: "percentage", width: 5 },
        { field: 'name', header: 'Nama', sortable: false, style: "percentage", width: 15 },
        { field: 'email', header: 'Email', sortable: false, style: "percentage", width: 10 },
        { field: 'phone', header: 'Telp', sortable: false, style: "percentage", width: 10 },
        { field: 'terms', header: 'Terms', sortable: false, body:"currency", style: "percentage", width: 10 },
        { field: 'credit', header: 'Limit', sortable: false, body:"currency", style: "percentage", width: 10 },
        { field: 'teritory', header: 'Kec/Kel', sortable: false, style: "percentage", width: 20 },
        { field: 'is_po', header: 'Po', sortable: false, body:"boolean", style: "percentage", width: 5 },
        { field: 'status', header: 'Status', sortable: false, body:"boolean", style: "percentage", width: 5 },
        { field: 'action', header: '' },
    ];

    useEffect(() => {
        // console.log(props.match, props.location);
        setPerPage(10);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const QueryData = async (page, pageSize, keyword) => {
        setWaiting(true);

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
            pathname: "/customer/create",
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

    const columnsTablePlant = [
        { field: 'id', header: 'No', sortable: false, style: "percent", width: 0.1},
        { field: 'name', header: 'Nama', sortable: false, style: "percent", width: 5},
    ];

    const onRowExpansionTemplate = (data) => {
        if (data.plant === null) {
            return (
                <div>No data found</div>
            )
        } else {
            return (
                <div className="orders-subtable">
                    <DataTableComp api={false} title={data.name} search={true} models={data.plant} rows={10} columnsTable={columnsTablePlant} children={true} responsiveLayout="scroll"/>
                </div>
                
            );
        }
    }

    return (
        <Fragment>
            <div className="card">
                <DataTableListComp api={true} toolbar={true} toolbarAction="list" title={title} search={true}  setGlobal={(e) => setGlobalFilter(e)}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                    tableType="expand" rowExpansion={onRowExpansionTemplate} actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} />
                <PostPutValidationComp waitingDialog={waiting}/>
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CustomerList, comparisonFn);
