import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import * as ListService from '../../service/Employee/LoanService';

const LoanList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);

    const title = "Loan List";
    const columnsTable = [
        { field: 'reference_no', header: 'No Kasbon', sortable: false, style: "percent", width: 15 },
        { field: 'issue_date', header: 'Tgl Kasbon', sortable: false, style: "percent", width: 10 },
        { field: 'cashier_type_id.name', header: 'Jenis Kasbon', sortable: false, style: "percent", width: 40 },
        { field: 'transaction', header: 'Transaksi', sortable: false, style: "percent", width: 10 },
        { field: 'amount', header: 'Nominal', sortable: false, style: "percent", width: 20, body:"number"},
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
            QueryData(1, perPage, "");
        }, 250);
    }

    const actionNew = () => {
        return history.push({            
            pathname:  "/loan/create",
            state: {} 
        });
    }

    const actionEdit = (data) => {
        return history.push({            
            pathname:  "/loan/edit/" + data.id,
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

export default React.memo(LoanList, comparisonFn);