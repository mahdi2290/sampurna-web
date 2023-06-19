import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";

const OrderList = () => {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;

    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);

    let maxDate = new Date();
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getToken = async() => {            
        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/auth/token/create";
        
        const form = new FormData();
                    
        form.append("domain_name", "alamsampurnamakmur")
        form.append("username", "administrator@tms.co.id")
        form.append("password", "administrator")

        const res = await axios({
            method:"POST",
            url:baseUrl, 
            data: form,
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        if (res.status === 200) {
            return res.data.data.token;
        }

        return "";
    }

    const QueryData = async() => {        
        const token = await getToken();

        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/order";

        try {
            const result = await axios({
                method:"GET",
                url:baseUrl, 
                data: {},
                headers: {
                    'Content-Type': 'application/json',   
                    'Authorization': "Bearer " + token,
                },
                params: {
                    start_date: '2022-09-01', 
                    end_date: '2022-12-31'
                }
            });

            if (result.status === 200) {
                setModels(result.data.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("error", error.response.data)
        }
    }

    const title = "Order List";
    const columnsTable = [
        { field: 'customer_name', header: 'Nama Pelanggan', sortable: false, style: "percent", width: 25},
        { field: 'departure_date', header: 'Tgl Keberangkatan', sortable: false, style: "percent", width: 10},
        { field: 'fleet_category', header: 'Kategori Kendaraan', sortable: false, style: "percent", width: 10},
        { field: 'driver_name', header: 'Nama Supir', sortable: false, style: "percent", width: 10},
        { field: 'order_number', header: 'No Order', sortable: false, style: "percent", width: 10},
        { field: 'origins', header: 'Asal', sortable: false, style: "percent", width: 15},
        { field: 'destinations', header: 'Tujuan', sortable: false, style: "percent", width: 15},
        { field: 'action', header: '' },
    ];

    useEffect(() => {
        setPerPage(10);

        actionRefresh();        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onSetPerPage = (e) => {
        setPerPage(e);
    }

    const actionRefresh = () => {
        setTimeout(() => {
            QueryData();
        }, 250);
    }

    const actionNew = () => {
        return history.push({            
            pathname:  "/order/create",
            state: {} 
        });
    }

    const actionEdit = (data) => {
        return history.push({            
            pathname:  "/order/edit/" + data.order_number,
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
            <div className="grid">
                <div className="card">
                    <DataTableListComp api={false} history={history} toolbar={true} toolbarAction="list" loading={isLoading} title={title}  search={true}
                        models={models} columns={columnsTable} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                        actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)} />
                </div>
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(OrderList, comparisonFn);