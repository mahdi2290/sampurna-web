import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import * as EmployeeService from '../../service/Employee/EmployeeService';
// import * as DepartmentService from "../../service/Master/DepartmentService";

const EmployeeList = () => {
    const history = useHistory();
    const [models, setModels] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(10);
    const [waiting, setWaiting] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // const [departmentData, setDepartmentData] = useState(null);
    // const [departmentSelect, setDepartmentSelect] = useState();
    // const allList = {
    //     id: 0,
    //     name: "All"
    // }

    const title = "Employee";
    const columnsTable = [
        { field: 'nik', header: 'NIK', sortable: false, style: "percent", width: 2},
        { field: 'name', header: 'Nama', sortable: false, style: "percent", width: 2},
        { field: 'company_id.name', header: 'Grup Perusahaan', sortable: false, style: "percent", width: 2},
        { field: 'occupation_id.name', header: 'Jabatan', sortable: false, style: "percent", width: 2},
        { field: 'division_id.name', header: 'Divisi', sortable: false, style: "percent", width: 2},
        { field: 'join_date', header: 'Tgl Mulai', sortable: false,style: "percent", width: 2},
        { field: 'action', header: '' },
    ];

    useEffect(() => {
        setPerPage(10);
        // setDepartmentSelect(allList);

        actionRefresh();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // const getDepartment = async(keyword) => {
    //     const res = await DepartmentService.GetList(keyword);

    //     setDepartmentData(null);
    //     let data = res.data;

    //     data.push(allList);

    //     return data;
    // }

    const QueryData = async(page, pageSize, keyword) => {
        setWaiting(true);

        const params = { page: page, pagesize: pageSize, keyword: keyword }

        const res = await EmployeeService.GetAll(params);

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

        QueryData(1, perPage, globalFilter);
    }

    const actionNew = () => {
        return history.push({
            pathname:  "/employee/create",
            state: {}
        });
    }

    const actionEdit = (data) => {
        return history.push({
            pathname:  "/employee/edit/" + data.id,
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

    const calculateTotal = (name) => {
        let total = 0;

        if (models) {
            for (let row of models) {
                const data = row['department_id']['name']
                if (data === name) {
                    total++;
                }
            }
        }

        return total;
    }

    const onRowGroupFooterTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="4" style={{ textAlign: 'right' }}><b>Total Data</b></td>
                <td><b>{calculateTotal(data['department_id']['name'])}</b></td>
            </React.Fragment>
        );
    }

    // const filterDynamic = (
    //     <div className="p-fluid grid">
    //         <AutoCompleteComp className="field col-12 md:col-4 sm:col-4 mb-0" api={true} validate={false} field="department_id" title="Department" showField="name" models={departmentData} queryData={(e) => getDepartment(e)}
    //             value={departmentSelect} setSelectValue={(e) => setDepartmentSelect(e)} onChange={(e) => { setDepartmentSelect(e.value);  }} forceSelection={true}/>
    //     </div>
    // ) filterStatus={true} filterDynamic={filterDynamic}

    return (
        <Fragment>
            <div className="card">
                <DataTableListComp api={true} history={history} toolbar={true} toolbarAction="list" title={title}  search={true} setGlobal={(e) => setGlobalFilter(e)}
                    models={models} columns={columnsTable} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={QueryData}
                    actionButtonToolbar={(e) => actionButtonToolbar(e)} actionEdit={(data) => actionEdit(data)}
                    tableType="rowgroup" rowGroupField="department_id.name" onRowGroupFooterTemplate={onRowGroupFooterTemplate} />
            </div>
            <PostPutValidationComp waitingDialog={waiting}/>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(EmployeeList, comparisonFn);
