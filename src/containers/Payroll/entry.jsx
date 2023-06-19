import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from "primereact/dialog";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
import DateTimePickerComp from "../../components/standard/Form/DateTimePickerComp";
import { formatCurrency, formatDateFrom, formatDateString, formatDateTimeString, formatDateTo } from "../../helpers/FormatHelpers";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import { APIBisnisUnit, APICompany } from "../../components/api/APIMaster";
import DataTableComp from "../../components/standard/DataTable/DataTableComp";
import * as ExportHelper from "../../helpers/ExportHelper";
import * as HeaderService from '../../service/Payroll/PayrollService';
import * as TempService from '../../service/Payroll/PayrollTempService';
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import DataTableListComp from "../../components/standard/DataTable/DataTableListComp";
import SlipPage from './slip';

const PayrollEntry = () => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef();
    const dateFromRef = useRef();
    const dateToRef = useRef();
    const formationDateRef = useRef();
    const returnedAtRef = useRef();
    const userID = 1;

    const [waiting, setWaiting] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisibleDialog, setIsVisibleDialog] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modelHistory, setModelHistory] = useState([{order_lists: null, loan_lists: null}]);
    const [actionWindow, setActionWindow] = useState(null);

    let emptyModel = {
        id: 0,
        company_id: { id: 0 },
        sales_type_id: { id: 0 },
        reference_no: "",
        date_from: formatDateFrom(new Date()),
        date_to: formatDateTo(new Date()),
        issue_date: formatDateTimeString(new Date()),
        formation_date: formatDateString(new Date()),
    };

    const [models, setModels] = useState([]);
    const [orderModels, setOrderModels] = useState([]);
    const [loanModels, setLoanModels] = useState([]);
    const [model, setModel] = useState(emptyModel);
    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [businessData, setBusinessData] = useState([]);
    const [businessSelect, setBusinessSelect] = useState(null);
    const [perPage, setPerPage] = useState(100);
    const [totalRecords, setTotalRecords] = useState(0);
    const [employee, setEmployee] = useState([]);
    const [isVisiblePrint, setIsVisiblePrint] = useState(false);

    const columnsTable = [
        { field: 'rn', header: 'No', sortable: false, style: "fix", width: { width: '50px' }, frozen:true },
        { field: 'rn2', header: 'Unit', sortable: false, style: "fix", width: { width: '50px' }, frozen:true },
        { field: 'employee_name', header: 'Nama Supir', sortable: false, style: "fix", width: { width: '300px' }, frozen:true },
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "fix", width: { width: '100px' }, frozen:true },
        { field: 'fleet_type_name', header: 'Grup Mobil', sortable: false, style: "fix", width: { width: '200px' } },
        { field: 'formation_name', header: 'Koordinator', sortable: false, style: "fix", width: { width: '200px' } },
        { field: 'rit', header: 'Rit', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'sj_nol', header: 'SJ Nol', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'sj', header: 'Total SJ', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'sj_nol_', header: 'SJ Nol (%)', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'ritase', header: 'Ritase', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2", },
        { field: 'monthly_bonus', header: 'Bonus Bulanan', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'tire_bonus', header: 'Bonus Ban', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'tire_claim', header: 'Lain Ban', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'pinalty_mat', header: 'Pinalti', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'cash', header: 'Kas', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'sparepart', header: 'Sparepart', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'bpjs', header: 'BPJS', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'laka_finance', header: 'Laka Finance', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'laka_sparepart', header: 'Laka Sparepart', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'laka_payment', header: 'Laka Payment', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'others_', header: 'Other', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'gross_salary', header: 'Gross Salary', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'opening_balance', header: 'Opening Balance', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'balance', header: 'Balance', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'salary', header: 'Salary', sortable: false, style: "fix", width: { width: '180px' }, body: "currency2", editor: true, },
        { field: 'memo', header: 'Memo', sortable: false, style: "fix", width: { width: '250px' }, editor: true, },
        { field: 'closing_balance', header: 'Closing Balance', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'cashier', header: 'Cashier', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'laka', header: 'Laka', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'ujt', header: 'UJT', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'transfer', header: 'Transfer', sortable: false, style: "fix", width: { width: '130px' }, body: "currency2" },
        { field: 'bank_account_name', header: 'Nama Rekening', sortable: false, style: "fix", width: { width: '250px' } },
        { field: 'bank_no', header: 'No Rekening', sortable: false, style: "fix", width: { width: '150px' } },
        { field: 'bank_name', header: 'Bank', sortable: false, style: "fix", width: { width: '150px' } },
        { field: 'nik', header: 'NIK', sortable: false, style: "fix", width: { width: '150px' } },
    ];

    const columnsTableOrder = [
        { field: 'reference_no', header: 'No Referensi', sortable: false, style: "fix", width: { width:'100px' }},
        { field: 'returned_at', header: 'Tgl Kembali', sortable: false, style: "fix", width: { width:'150px' }},
        { field: 'returned_by', header: 'User', sortable: false, style: "fix", width: { width:'100px' }},
        { field: 'final_transporter_name', header: 'Grup Perusahaan', sortable: false, style: "fix", width: { width:'250px' }},
        { field: 'final_plate_no', header: 'No Polisi', sortable: false, style: "fix", width: { width:'100px' }},
        { field: 'final_order_type_name', header: 'Jenis Transaksi', sortable: false, style: "fix", width: { width:'150px' }},
        { field: 'final_product_name', header: 'Final Product', sortable: false, style: "fix", width: { width:'150px' }},
        { field: 'final_customer_name', header: 'Final Customer', sortable: false, style: "fix", width: { width:'250px' }},
        { field: 'final_plant_name', header: 'Final Plant', sortable: false, style: "fix", width: { width:'300px' }},
        { field: 'height', header: 'Height', sortable: false, style: "fix", width: { width:'120px' }, body: "currency4"},
        { field: 'final_height', header: 'Final Height', sortable: false, style: "fix", width: { width:'120px' }, body: "currency4"},
        { field: 'volume_origin', header: 'Volume Origin', sortable: false, style: "fix", width: { width:'120px' }, body: "currency4"},
        { field: 'volume_plant', header: 'Volume Plant', sortable: false, style: "fix", width: { width:'120px' }, body: "currency4"},
        { field: 'volume_netto', header: 'Volume Netto', sortable: false, style: "fix", width: { width:'120px' }, body: "currency4"},
        { field: 'final_volume', header: 'Final Volume', sortable: false, style: "fix", width: { width:'120px' }, body: "currency4"},
        { field: 'final_uom', header: 'Final Unit', sortable: false, style: "fix", width: { width:'120px' }},
        { field: 'ritase', header: 'Ritase', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2"},
        { field: 'ritase_payroll', header: 'Ritase Payroll', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2", editor: true, },
        { field: 'bonus_claim', header: 'Bonus Claim', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2"},
        { field: 'var_mat', header: 'Var Mat', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2"},
        { field: 'origin_price', header: 'Harga Origin', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2"},
        { field: 'subtotal', header: 'Sub Total', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2"},
        { field: 'rit', header: 'Rit', sortable: false, style: "fix", width: { width:'120px' }, body: "currency2"},
    ];

    const columnsTableLoan = [
        { field: 'employee_name', header: 'Nama Supir', sortable: false, style: "percent", width: 24.2 },
        { field: 'cash', header: 'Cash', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'sparepart', header: 'Sparepart', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'bpjs', header: 'BPJS', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'laka_finance', header: 'Laka Finance', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'laka_sparepart', header: 'Laka Sparepart', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'payment', header: 'Payment', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'adjustment', header: 'Adjustment', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'others_', header: 'Other', sortable: false, style: "percent", width: 8, body: "currency2"},
        { field: 'bonus_claim_ban', header: 'Bonus Klaim Ban', sortable: false, style: "percent", width: 8, body: "currency2"},
    ];

    const onSetPerPage = (e) => {
        setPerPage(e);
    }

    const getCompany = async (keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

    const getBusiness = async (keyword) => {
        const res = await APIBisnisUnit(keyword);

        setBusinessData(null);

        return res;
    }

    const LoadPayroll = async() => {
        if (id) {
            setWaiting(true);

            const res = await HeaderService.GetByID(id);

            const data = res.data;

            setCompanySelect(data.company_id);
            setBusinessSelect(data.sales_type_id);

            emptyModel = {
                id: 0,
                company_id: data.company_id,
                sales_type_id: data.sales_type_id,
                reference_no: data.reference_no,
                date_from: data.period1,
                date_to: data.period2,
                issue_date: formatDateTimeString(new Date(data.issue_date)),
                formation_date: data.formation_date,
            };

            setModel(emptyModel);

            dateFromRef.current = data.period1;
            dateToRef.current = data.period2;
            formationDateRef.current = data.formation_date;
            returnedAtRef.current = data.issue_date;

            setModels(data.formation_lists);

            LoadOrder(1, perPage, "");
            LoadLoan(data.company_id.id, data.period2);
            summaryTable();
            setWaiting(false);
        } else {
            setModel(emptyModel);

            dateFromRef.current = formatDateFrom(new Date());
            dateToRef.current = formatDateTo(new Date());
            formationDateRef.current = formatDateTo(new Date());
            returnedAtRef.current = formatDateTimeString(new Date());

            setStatusNew(true);
        }

        setCompanyData(null);
        setBusinessData(null);
    }

    const LoadOrder = async(page, pageSize, keyword) => {
        console.log("order")
        const params = { username: userID, page: page, pagesize: pageSize, keyword: keyword };

        const res = await HeaderService.GetOrder(params);

        if (res.status === 200) {
            setOrderModels(res.data.list);
            setTotalRecords(res.data.total);
        } else {
            setOrderModels([]);
            setTotalRecords(0);
        }
    }

    const LoadLoan = async(company_id, date) => {
        console.log("loan")
        const params = {
            company_id: company_id,
            payroll_id: id ? id : 0,
            the_date2: date,
            username: userID
        };

        const res = await HeaderService.GetLoan(params);

        if (res.status === 200) {
            setLoanModels(res.data);
        }
    }

    const QueryData = async() => {
        setPerPage(100);

        await LoadPayroll();
    }

    const RefreshData = async() => {
        setWaiting(true);
        setIsLoading(true);

        const params = {
            company_id: companySelect.id,
            sales_type_id: businessSelect.id,
            the_date1: dateFromRef.current,
            the_date2: dateToRef.current,
            formation_date: formationDateRef.current,
            reference_id: 0,
            username: userID,
            employee_id: 0
        };

        const res = await TempService.Get(params);

        if (res.status === 200) {
            setModels([]);
            if (res.data !== null) {
                setModels(res.data);
                summaryTable();

                LoadOrder(1, perPage, "");
                LoadLoan(companySelect.id, dateToRef.current);
            }
        } else {
            setErrorVisible(true);
            setErrorMessage(res.message);
        }
        setWaiting(false);
        setIsLoading(false);
    };

    const LoadData = async() => {
        setWaiting(true);
        setIsLoading(true);

        const form = new FormData();
        form.append("company_id", companySelect.id);
        form.append("sales_type_id", businessSelect.id);
        form.append("the_date1", dateFromRef.current);
        form.append("the_date2", dateToRef.current);
        form.append("returned_at", returnedAtRef.current);
        form.append("formation_date", formationDateRef.current);
        form.append("reference_id", 0);

        const res = await TempService.PostData(form);

        if (res.status === 200) {
            setModels([]);
            if (res.data !== null) {
                setModels(res.data);

                LoadOrder(1, perPage, "");
                LoadLoan(companySelect.id, dateToRef.current);
            }
        } else {
            setErrorVisible(true);
            setErrorMessage(res.message);
        }
        setWaiting(false);
        setIsLoading(false);
    };

    const isPositiveInteger = (val) => {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, "") || "0";
        let n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    }

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="decimal" />
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} className="col-12"/>;
    }

    const cellEditor = (options) => {
        if (options.field === 'salary')
            return priceEditor(options);
        else if (options.field === 'memo')
            return textEditor(options);
        else
            return options.value;
    }

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'quantity':
            case 'ritase':
            case 'salary':
                if (isPositiveInteger(newValue)) {
                    if (rowData[field] !== newValue) {
                        rowData[field] = newValue;

                        const closing = rowData['balance'] - newValue;
                        rowData['closing_balance'] = closing;

                        const transfer = newValue + rowData['cashier'] + rowData['laka'] + rowData['ujt'];
                        rowData['transfer'] = transfer < 0 ? 0 : transfer;

                        updateTemp(rowData['employee_id'], newValue, rowData['memo']);
                    }
                } else
                    event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0)
                    if (rowData[field] !== newValue) {
                        rowData[field] = newValue;

                        updateTemp(rowData['employee_id'], rowData['salary'], newValue);
                    }
                else
                    event.preventDefault();
                break;
        }
    }

    const updateTemp = async(employee_id, salary, memo) => {
        setWaiting(true);

        const form = new FormData();
        form.append("employee_id", employee_id);
        form.append("salary", salary);
        form.append("memo", memo);
        form.append("ritase", 0);
        form.append("reference_id", 0);

        const res = await TempService.PutData(userID, form);

        if (res.status === 200) {
            // RefreshData();
        } else {
            setErrorVisible(true);
            setErrorMessage("Internal server error!!!");
        }
        setWaiting(false);
    }

    const cellEditorRitase = (options) => {
        if (options.field === 'ritase_payroll')
            return priceEditor(options);
        else
            return options.value;
    }

    const onCellEditRitaseComplete = async(e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'ritase_payroll':
                if (isPositiveInteger(newValue)) {
                    if (rowData[field] !== newValue) {
                        rowData[field] = newValue;

                        setWaiting(true);
                        const form = new FormData();
                        form.append("employee_id", modelHistory.employee_id);
                        form.append("salary", modelHistory.salary);
                        form.append("memo", modelHistory.memo);
                        form.append("ritase", newValue);
                        form.append("reference_id", rowData["id"]);

                        const res = await TempService.PutData(userID, form);

                        if (res.status === 200) {

                        } else {
                            setErrorVisible(true);
                            setErrorMessage("Internal server error!!!");
                        }

                        setWaiting(false);
                    }
                } else
                    event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0)
                    if (rowData[field] !== newValue) {
                        rowData[field] = newValue;
                    } else {
                        rowData[field] = newValue;
                    }
                else
                    event.preventDefault();
                break;
        }
    }

    const actionExport = () => {
        if (models.length > 0) {
            ExportHelper.exportExcelPayroll(models, "Payroll");
        } else {
            setErrorVisible(true);
            setErrorMessage("Data not found!!!");
        }
    }

    const openHistory = (e) => {
        setModelHistory(e.data);
        setIsVisibleDialog(true);
    }

    const hideDialog = () => {
        setIsVisibleDialog(false);
    }

    const hideDialogPrint = () => {
        setIsVisiblePrint(false);
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
        </>
    );

    const dialogFooterPrint = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialogPrint} />
        </>
    );

    const backURL = () => {
        return history.push({
            pathname: "/payroll/list",
        });
    };

    const backDialog = () => {
        if (changeStatus === false) {
            backURL();
        } else {

        }
    };

    const actionSave = async() => {
        // await RefreshData();

        setWaiting(true);

        let monthly_rit = 0;
        let zero_do = 0;
        let total_do = 0;
        let ritase = 0;
        let salary = 0;
        let transfer = 0;

        for (let index = 0; index < models.length; index++) {
            const row = models[index];

            monthly_rit += row.rit;
            zero_do += row.sj_nol;
            total_do += row.sj;
            salary += row.salary;
            transfer += row.transfer;

            let total = 0;
            if (row.order_lists !== null) {
                row.order_lists.map((x) => {
                    return total += x.ritase_payroll;
                });
            }

            ritase += total;
        }

        const form = new FormData();
        form.append("company_id", companySelect.id);
        form.append("sales_type_id", businessSelect.id);
        form.append("the_date1", dateFromRef.current);
        form.append("the_date2", dateToRef.current);
        form.append("returned_at", returnedAtRef.current);
        form.append("formation_date", formationDateRef.current);
        form.append("monthly_rit", monthly_rit);
        form.append("zero_do", zero_do);
        form.append("total_do", total_do);
        form.append("ritase", ritase);
        form.append("salary", salary);
        form.append("transfer", transfer);

        // console.log([...form])

        let result = null;
        if (id) {
            result = await HeaderService.PutData(id, form);
        }
        else {
            result = await HeaderService.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id
            } else {
                data_id = result.data.id;
            }

            await updateLoan(data_id);

            setTimeout(() => {
                setWaiting(false);

                setChangeStatus(false);
                setIsVisibleDialog(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });

                if (statusNew === false) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/payroll/edit/" + data_id,
                        state: {}
                    });
                }
            }, 1000);
        } else if (result.status === 400) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        } else if (result.status === 402) {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }

        setWaiting(false);
    }

    const updateLoan = async(data_id) => {
        let update_id = "";
        const count = loanModels.length;

        for (let index = 0; index < count; index++) {
            const row = loanModels[index];

            if (index === (count - 1)) {
                update_id += row.id;
            } else {
                update_id += row.id + ",";
            }
        }

        const form = new FormData();
        form.append("payroll_id", data_id);
        form.append("id", update_id);

        const result = await HeaderService.PostDataLoan(form);
        if (result.status === 200) {
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }
    }

    const printSlip = () => {
        if (employee.length > 0 ) {
            setIsVisiblePrint(true);
        }
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "save":
                actionSave();
                break;

            case "new":
                if (statusNew) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/payroll/create",
                    });
                }
                window.location.reload();
                break;
            case 'refresh':
                RefreshData();
                break;

            case "load":
                LoadData();
                break;

            case "print":
                printSlip();
                break;

            default:
                break;
        }
    };

    const summaryTable = (field) => {
        let total = 0;
        if (models) {
            models.map((data) => {
                total += data[field];

                return data;
            });
        }

        return formatCurrency(total, 2);
    }

    let footerGroup = <ColumnGroup>
                        <Row>
                            <Column style={{width:"460px", minWidth: '10rem'}} footer="Totals:" colSpan={6} footerStyle={{textAlign: 'right'}} frozen={true}/>
                            <Column style={{width:"330px", minWidth: '10rem'}} footer="" colSpan={6} footerStyle={{textAlign: 'right'}} />
                            <Column style={{width:"120px", minWidth: '10rem'}} footer={summaryTable('rit') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"100px", minWidth: '10rem'}} footer={summaryTable('sj_nol') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"100px", minWidth: '10rem'}} footer={summaryTable('sj') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"110px", minWidth: '10rem'}} footer={summaryTable('sj_nol_') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"120px", minWidth: '10rem'}} footer={summaryTable('ritase') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('monthly_bonus') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('tire_bonus') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('tire_claim') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('pinalty_mat') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('cash') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('sparepart') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('bpjs') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('laka_finance') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('laka_sparepart') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('laka_payment') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('others_') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('gross_salary') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('opening_balance') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('balance') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"180px", minWidth: '10rem'}} footer={summaryTable('salary') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"250px", minWidth: '10rem'}} footer="&nbsp;"/>
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('closing_balance') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('cashier') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('laka') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('ujt') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"130px", minWidth: '10rem'}} footer={summaryTable('transfer') } footerStyle={{textAlign: 'left'}} />
                            <Column style={{width:"150px", minWidth: '10rem'}} footer="&nbsp;"/>
                        </Row>
                    </ColumnGroup>;

    useEffect(() => {
        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (models) {
            if (models.length === 0) {
                setActionWindow("crud-payroll-load");
            } else {
                setActionWindow("crud-payroll-refresh");
            }
        } else {

            setActionWindow("crud-payroll-load");
        }
    }, [models, setModels]);

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <MenubarComp field="toolbar-detail" action={actionWindow} actionButton={(e) => actionButtonToolbar(e)} actionExport={actionExport} />
                    </div>

                    <div className="col-12">
                        <div className="p-fluid">
                            <div className="grid">
                                <AutoCompleteComp className="field col-12 md:col-2" api={true} validate={false} field="company_id" title="Grup Perusahaan" showField="name" models={companyData}
                                    queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => setCompanySelect(e)} onChange={(e) => { setCompanySelect(e.value); model.company_id = e.value.id; }} />
                                <AutoCompleteComp className="field col-12 md:col-2" api={true} validate={false} field="sales_type_id" title="Unit Bisnis" showField="name" models={businessData}
                                    queryData={(e) => getBusiness(e)} value={businessSelect} setSelectValue={(e) => setBusinessSelect(e)} onChange={(e) => { setBusinessSelect(e.value); model.sales_type_id = e.value.id; }} />
                                <DatePickerComp className="field col-12 md:col-2" validate={false} field="date_from" title="Period" value={model.date_from} onChange={(e) => { model.date_from = e; dateFromRef.current = e }} />
                                <DatePickerComp className="field col-12 md:col-2" validate={false} field="date_to" title="&nbsp;" value={model.date_to} onChange={(e) => { model.date_to = e; dateToRef.current = e }} />
                                <DateTimePickerComp className="field col-12 md:col-2" validate={false} field="issue_date" title="Tgl SJ" value={model.issue_date} onChange={(e) => { model.issue_date = e; returnedAtRef.current = e; }} />
                                <DatePickerComp className="field col-12 md:col-2" validate={false} field="formation_date" title="Tgl Formasi" value={model.formation_date} onChange={(e) => { model.formation_date = e; formationDateRef.current = e }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <TabView>
                        <TabPanel header="Summary">
                            <div className="d-error">
                                <DataTableComp tableType="list" api={false} toolbar={false} loading={isLoading} title="Summary" search={true} paginator={false} actionStatus="edit" editor={(data) => cellEditor(data)} onCellEditComplete={(e) => onCellEditComplete(e)}
                                    models={models} columnsTable={columnsTable} onRowDoubleClick={openHistory} stripedRows={false} footerColumnGroup={footerGroup} checkbox={true} selection={employee} setSelectionChange={(e) => setEmployee(e.value)}
                                    onCustomSaveState={(state) => sessionStorage.setItem("payroll-summary", JSON.stringify(state)) }  onCustomRestoreState={() => JSON.parse(sessionStorage.getItem("payroll-summary"))}  />
                            </div>
                        </TabPanel>
                        <TabPanel header="Order">
                            <DataTableListComp api={true} history={history} toolbar={false} toolbarAction="list" loading={isLoading} title="Order"  search={true}
                                models={orderModels} columns={columnsTableOrder} totalRecords={totalRecords} perPage={perPage} setPerPage={onSetPerPage} getAll={LoadOrder} />
                        </TabPanel>
                        <TabPanel header="Loan">
                            <DataTableComp tableType="list" api={false} toolbar={false} loading={isLoading} title="Loan" search={true} paginator={false} rows={10} actionStatus="edit"
                                models={loanModels} columnsTable={columnsTableLoan} stripedRows={true} onCustomSaveState={(state) => sessionStorage.setItem("payroll-loan", JSON.stringify(state)) }  onCustomRestoreState={() => JSON.parse(sessionStorage.getItem("payroll-loan"))} />
                        </TabPanel>
                    </TabView>
                </div>
            </div>

            <Dialog visible={isVisibleDialog} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '90vw'}} header="Histori" maximizable modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <TabView>
                    <TabPanel header="List Order">
                        <div style={{ height: 'calc(100vh - 143px)' }}>
                            <DataTableComp api={false} scrollable={false} scrollHeight="flex" title={modelHistory.employee_name} models={modelHistory.order_lists} search={true} columnsTable={columnsTableOrder} paginator={false} editor={(data) => cellEditorRitase(data)} onCellEditComplete={(e) => onCellEditRitaseComplete(e)} />
                        </div>
                    </TabPanel>
                    <TabPanel header="List Loan">
                        <DataTableComp api={false} scrollable={false} scrollHeight="flex" title={modelHistory.employee_name} models={modelHistory.loan_lists} search={true} columnsTable={columnsTableLoan} paginator={false} />
                    </TabPanel>
                </TabView>
            </Dialog>

            <Dialog visible={isVisiblePrint} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '75vw'}} header="Print Slip" maximizable modal className="p-fluid" footer={dialogFooterPrint} onHide={hideDialogPrint}>
                <SlipPage payroll_id={id} employee={employee} />
            </Dialog>
            <PostPutValidationComp waitingDialog={waiting} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(false)} message={errorMessage} backURL={backURL}/>
        </Fragment>
    );
};

export default PayrollEntry;
