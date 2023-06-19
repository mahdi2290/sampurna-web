// import React, { Fragment, useState, useEffect, useRef } from "react";
// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
// import { Dropdown } from "primereact/dropdown";
// import { Calendar } from "primereact/calendar";
// import axios from "axios";
// import { APICompanies, APIPools } from "../../components/api/APIMaster";
// import * as CookieConfig from "./../../config/CookieConfig";
// import * as PoolService from "../../service/Master/PoolService";
// import * as FinanceChasier from "../../service/Finance/FinanceCashier"
// import DropDownComp from "../../components/standard/Form/DropDownComp";
// import AutoCompleteComp from "../../components/standard/Form/DropDownComp";
// import * as HeaderService from "../../service/Bank/CashierService";
// import { Toast } from "primereact/toast";
// const FinanceCashierList = () => {
//     const toast = useRef();
//     const [showDialog, setShowDialog] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedLoket, setSelectedLoket] = useState(null);
//     const [selectedShift, setSelectedShift] = useState(null);
//     const [companies, setCompanies] = useState([]);
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [pool, setPool] = useState([]);
//     const [selectedPool, setSelectedPool] = useState([]);
//     const [models, setModels] = useState(null);

//     const loketOptions = [
//         { label: "A", value: "A" },
//         { label: "B", value: "B" },
//         { label: "C", value: "C" },
//         { label: "D", value: "D" },
//         { label: "E", value: "E" },
//         { label: "F", value: "F" },
//     ];

//     const shiftOptions = [
//         { label: "1", value: 1 },
//         { label: "2", value: 2 },
//         { label: "3", value: 3 },
//     ];

//     // const getCompanies = async (keyword) => {
//     //     const res = await APICompanies("");
//     //     setCompanies(res);
//     // };

//     // const getPools = async (keyword) => {
//     //     const res = await APIPools(keyword);

//     //     setPool(res);

//     //     return res;
//     // };

//     // const getPoolID = async (id) => {
//     //     const result = await PoolService.GetByID(CookieConfig.get("pool_id"));

//     //     if (result.status === 200) {
//     //         setSelectedPool(result.data);
//     //     }
//     // };

//     // const QueryData = async () => {
//     //     if (!selectedPool) return;

//     //     const params = {
//     //         issue_date: selectedDate,
//     //         company_id: selectedCompany,
//     //         pool_id: selectedPool.id,
//     //         shift: selectedShift,
//     //         counter: selectedLoket,
//     //     };

//     //     const res = await HeaderService.GetUJTDaily(params);

//     //     if (res.status === 200) {
//     //         console.log(res.data);
//     //         if (res.data) {
//     //             setModels(res.data);
//     //         } else {
//     //             setModels(null);
//     //         }
//     //     } else {
//     //         setModels(null);
//     //     }
//     // };

//     const getCompany = async() => {
//         const res = await APICompanies("");

//         setCompanies(res);
//     }

//     const getPool = async(keyword) => {
//         const res = await APIPools(keyword);

//         setPool(null);

//         return res;
//     }

//     const getPoolID = async(id) => {
//         const result = await PoolService.GetByID(CookieConfig.get('pool_id'));

//         if (result.status === 200) {
//             setSelectedPool(result.data);
//         }
//     }

//     const QueryData = async () => {
//         if (!selectedPool) return;

//         const params = {
//             // issue_date: selectedDate,
//             company_id: selectedCompany,
//             pool_id: selectedPool.id,
//             // shift: selectedShift,
//             // counter: selectedLoket,
//         };

//         const res = await FinanceChasier.GetReport(params)

//         if (res.status === 200) {
//             console.log(res.data);
//             if (res.data) {
//                 setModels(res.data);
//             } else {
//                 setModels(null);
//             }
//         } else {
//             setModels(null);
//         }
//     };

//     // const handleSubmit = () => {
//     //     // Do something with selectedDate, selectedLoket, and selectedShift
//     //     console.log(selectedCompany, selectedDate, selectedLoket, selectedShift);
//     //     setShowDialog(false);
//     // };

//     useEffect(() => {
//         setPool(null);
//         setCompanies();
//         setSelectedLoket(loketOptions[0].name);
//         setSelectedShift(shiftOptions[0].name);
//         getPoolID();

//         if (companies.length > 0) {
//             setSelectedCompany(companies[0].id);
//         }
//     }, []);

//     // const footer = (
//     //     <div>
//     //         <Button label="Submit" onClick={handleSubmit} />
//     //         <Button label="Cancel" onClick={() => setShowDialog(false)} className="p-button-secondary" />
//     //     </div>
//     // );

//     return (
//         <Fragment>
//             <Toast ref={toast} />
//             <div className="card">
//                 <div className="grid crud-demo">
//                     {/* <div className="col-12">
//                         <MenubarComp field="toolbar-list" action="refresh-download" actionButton={(e) => actionButtonToolbar(e)} />
//                     </div> */}

//                     <div className="col-12">
//                         <div className="grid p-fluid">
//                             <DropDownComp className="field col-12 md:col-3" validate={false} field="company_id" title="Grup Perusahaan" optionLabel="name" optionValue="id" options={companies} value={selectedCompany} onChange={(e) => setSelectedCompany(e.value)} />
//                             {/* <DatePickerComp className="field col-12 md:col-2" validate={false} field="issue_date" title="Tgl Cashier" value={issue_date_ref.current} onChange={(e) => { issue_date_ref.current = e }} />
//                             <DropDownComp className="field col-12 md:col-2" validate={false} field="counter" title="Loket" optionLabel="name" optionValue="name" options={counterData} value={counterSelect}
//                                onChange={(e) => { setCounterSelect(e.value);  }} />
//                             <DropDownComp className="field col-12 md:col-2" validate={false} field="shift" title="Shift" optionLabel="name" optionValue="name" options={shiftData} value={shiftSelect}
//                                 onChange={(e) => { setShiftSelect(e.value); }} /> */}
//                             <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={false} field="pool_id" title="Pool" showField="name"models={pool} queryData={(e) => getPool(e)} value={selectedPool} setSelectValue={(e) => setSelectedPool(e)} onChange={(e) => { setSelectedPool(e.value);  }} />
//                         </div>

//                         {/* <DailyUJTPage header={models ? models : ujt} /> */}
//                     </div>
//                 </div>
//             </div>
//         </Fragment>
//     )

//     // return (
//     //     <div>
//     //         <div className="card">
//     //             <>
//     //                 <Button label="Filter" onClick={() => setShowDialog(true)} />
//     //                 <Dialog breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "30vw" }} header="Filter Data" visible={showDialog} footer={footer} onHide={() => setShowDialog(false)}>
//     //                     <div className="p-fluid">
//     //                         <div className="p-field pt-3 pb-3">
//     //                         {/* <AutoCompleteComp
//     //                             className="field col-12 md:col-12"
//     //                             api={true}
//     //                             validate={false}
//     //                             field="business_id"
//     //                             title="Bisnis Unit"
//     //                             showField="name"
//     //                             models={companies}
//     //                             queryData={(e) => getCompanies(e)}
//     //                             value={selectedCompany}
//     //                             setSelectValue={(e) => setSelectedCompany(e)}
//     //                             onChange={(e) => {
//     //                                 setSelectedCompany(e.value);
//     //                             }}
//     //                         /> */}
//     //                             <DropDownComp validate={false} field="company_id" title="Grup Perusahaan" optionLabel="name" optionValue="id" options={companies} value={selectedCompany} onChange={(e) => setSelectedCompany(e.value)} />
//     //                         </div>
//     //                         <div className="p-field pt-3 pb-3">
//     //                         <label htmlFor="date">Tanggal</label>
//     //                             <Calendar id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} />
//     //                         </div>
//     //                         <div className="p-field pt-3 pb-3">
//     //                             <label htmlFor="loket">Loket</label>
//     //                             <Dropdown id="loket" value={selectedLoket} options={loketOptions} onChange={(e) => setSelectedLoket(e.value)} placeholder="Pilih loket" />
//     //                         </div>
//     //                         <div className="p-field pt-3 pb-3">
//     //                             <label htmlFor="shift">Shift</label>
//     //                             <Dropdown id="shift" value={selectedShift} options={shiftOptions} onChange={(e) => setSelectedShift(e.value)} placeholder="Pilih shift" />
//     //                         </div>
//     //                         <div className="p-field pt-3 pb-3">
//     //                             <DropDownComp validate={false} field="company_id" title="Grup Perusahaan" optionLabel="name" optionValue="id" options={companies} value={selectedCompany} onChange={(e) => setSelectedCompany(e.value)} />
//     //                         </div>
//     //                     </div>
//     //                 </Dialog>
//     //             </>
//     //         </div>
//     //     </div>
//     // );
// };

// export default FinanceCashierList;

import React, { useEffect, useState, useRef } from "react";
import { APICompany, APIPool } from "../../components/api/APIMaster";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Chip } from "primereact/chip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import * as FinananceCashier from "../../service/Finance/FinanceCashier";
import { IconUtils } from "primereact/utils";

const FinanceCashierList = () => {
    const [models, setModels] = useState(null);
    const [companyValue, setCompanyValue] = useState(null);
    const [poolValue, setPoolValue] = useState(null);
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [poolSuggestions, setPoolSuggestions] = useState([]);
    const [shiftValue, setShiftValue] = useState(null);
    const [counterValue, setCounterValue] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(null);
    const [visibleChip, setVisibleChip] = useState(false);
    const autoCompleteRef = useRef(null);

    const shiftData = [{ name: 1 }, { name: 2 }, { name: 3 }];

    const counterData = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }, { name: "E" }];

    const onCompanyInputChange = async (event) => {
        const res = await APICompany(event.query);
        setCompanySuggestions(res);
    };

    // const handleAutoCompleteKeyDown = (event) => {
    //     if (event.keyCode === 9 || event.keyCode === 13) {
    //       event.preventDefault();
    //       const firstOption = companySuggestions[0];
    //       if (firstOption) {
    //         setCompanyValue(firstOption);
    //         if (autoCompleteRef.current.selectValue) {
    //           autoCompleteRef.current.selectValue(firstOption);
    //         } else {
    //           autoCompleteRef.current.inputEL = firstOption.name;
    //         }
    //       }
    //     }
    //   };

    const handleAutoCompleteKeyDown = (event, suggestions, setValue) => {
        if (event.keyCode === 9 || event.keyCode === 13) {
            event.preventDefault();
            const firstOption = suggestions[0];
            if (firstOption) {
                setValue(firstOption);
                if (autoCompleteRef.current.selectValue) {
                    autoCompleteRef.current.selectValue(firstOption);
                } else {
                    autoCompleteRef.current.inputEL = firstOption.name;
                }
            }
        }
    };

    const handleCompanyAutoCompleteKeyDown = (event) => {
        handleAutoCompleteKeyDown(event, companySuggestions, setCompanyValue);
    };

    const handleShiftAutoCompleteKeyDown = (event) => {
        handleAutoCompleteKeyDown(event, shiftData, setShiftValue);
    };

    const handleCounterAutoCompleteKeyDown = (event) => {
        handleAutoCompleteKeyDown(event, counterData, setCounterValue);
    };

    const handlePoolAutoCompleteKeyDown = (event) => {
        handleAutoCompleteKeyDown(event, poolSuggestions, setPoolValue);
    };

    const handleCompanyAutoCompleteBlur = (event) => {
        if (!companySuggestions.some((option) => option.name === event.target.value)) {
          setCompanyValue(null);
        }
      };

      const handlePoolAutoCompleteBlur = (event) => {
        if (!poolSuggestions.some((option) => option.name === event.target.value)) {
          setPoolValue(null);
        }
      };

    const onPoolInputChange = async (event) => {
        const res = await APIPool(event.query);
        setPoolSuggestions(res);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    };

    const handleRemove = (chip) => {
        if (chip === "company") {
            setCompanyValue(null);
            setVisibleChip(false);
        } else if (chip === "date") {
            setSelectedDate(null);
            setVisibleChip(false);
        } else if (chip === "shift") {
            setShiftValue(null);
            setVisibleChip(false);
        } else if (chip === "counter") {
            setCounterValue(null);
            setVisibleChip(false);
        } else if (chip === "pool") {
            setPoolValue(null);
            setVisibleChip(false);
        }
    };

    const getData = async () => {
        let params = {
            issue_date: formatDate(selectedDate),
            company_id: companyValue.id,
            pool_id: poolValue.id,
            shift: shiftValue.name,
            counter: counterValue.name,
        };
        console.log(params);

        const res = await FinananceCashier.GetAll(params);
        console.log(res.data.modal);

        setModels(res.data.order_lists);
    };

    const deleteData = async () => {};

    const confirmDeleteSelected = () => {
        // setDeleteProductsDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        // setProduct(product);
        // setDeleteProductDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return <Button className="p-button-rounded p-button-danger mr-2" style={{ backgroundColor: "transparent", color: "red" }} icon="pi pi-trash" onClick={() => confirmDeleteProduct(rowData)} />;
    };

    const handleCancel = () => {
        setCompanyValue(null);
        setSelectedDate(null);
        setShiftValue(null);
        setCounterValue(null);
        setPoolValue(null);
        setShowDialog(false);
        setModels([]);
    };

    const handleClickChip = () => {
        setVisibleChip(false);
        setShowDialog(true);
    };

    const handleHide = () => {
        if (companyValue && selectedDate && shiftValue && counterValue && poolValue !== null) {
            setShowDialog(false);
        } else {
            handleCancel();
        }
    };

    const handleSubmit = () => {
        setShowDialog(false);
        setVisibleChip(true);
        getData();
    };

    const isFormFilled = companyValue && selectedDate && shiftValue && counterValue && poolValue;

    const footer = (
        <>
            <Button label="Ok" icon="pi pi-check" className="p-button-text p-button-sm" onClick={handleSubmit} disabled={!isFormFilled} />
            <Button label="Cancel" icon="pi pi-refresh" className="p-button-text p-button-sm" onClick={handleCancel} />
        </>
    );

    const filterData = (value) => {
        if (models !== null) {
            const filtered = models.filter((item) => Object.values(item).some((fieldValue) => fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase())));
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    };

    const onGlobalFilterChange = (event) => {
        setGlobalFilterValue(event.target.value);
        filterData(event.target.value);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-2">
                        <div>
                            <Button type="button" key="filterButton" className="p-button-text" onClick={() => setShowDialog(true)}>
                                <i className="pi pi-filter"></i>
                                <span className="px-1" style={{ marginTop: "3px" }}>
                                    Filter
                                </span>
                            </Button>
                            {visibleChip ? (
                                <span>
                                    {companyValue ? <Chip label={companyValue.name} onClick={() => handleClickChip()} className="mb-2 mr-2" removable onRemove={() => handleRemove("company")} /> : null}
                                    {selectedDate ? <Chip label={formatDate(selectedDate)} onClick={() => handleClickChip()} className="mb-2 mr-2" removable onRemove={() => handleRemove("date")} /> : null}
                                    {shiftValue ? <Chip label={shiftValue.name} onClick={() => handleClickChip()} className="mb-2 mr-2" removable onRemove={() => handleRemove("shift")} /> : null}
                                    {counterValue ? <Chip label={counterValue.name} onClick={() => handleClickChip()} className="mb-2 mr-2" removable onRemove={() => handleRemove("counter")} /> : null}
                                    {poolValue ? <Chip label={poolValue.name} onClick={() => handleClickChip()} className="mb-2 mr-2" removable onRemove={() => handleRemove("pool")} /> : null}
                                </span>
                            ) : null}
                        </div>
                        <div className="flex justify-content-end">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Cari / Search" />
                            </span>
                        </div>
                    </div>
                    <DataTable value={filteredData || models}>
                        <Column field="issue_date" header="Tgl Transfer" />
                        <Column field="reference_no" header="No Reference" />
                        <Column field="company_code" header="Kode Perusahaan" />
                        <Column field="origin_name" header="Kode Origin" />
                        <Column field="plant_name" header="Plant" />
                        <Column field="employee_name" header="Nama Karyawan" />
                        <Column field="plate_no" header="No Plat" />
                        <Column field="total" header="Total" />
                        <Column field={actionBodyTemplate} header="" />
                    </DataTable>
                </div>
            </div>
            <Dialog breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "30%" }} header="Filter Data" visible={showDialog} footer={footer} onHide={handleHide}>
                <div className="grid">
                    <label className="col-12" htmlFor="company">
                        Nama Perusahaan
                    </label>
                    <AutoComplete
                        ref={autoCompleteRef}
                        className="col-12"
                        id="company"
                        value={companyValue}
                        onChange={(e) => setCompanyValue(e.value)}
                        suggestions={companySuggestions}
                        completeMethod={onCompanyInputChange}
                        field="name"
                        placeholder="Nama Perusahaan"
                        dropdown
                        onKeyDown={handleCompanyAutoCompleteKeyDown}
                        onBlur={handleCompanyAutoCompleteBlur}
                    />
                    <label className="col-12" htmlFor="company">
                        Date
                    </label>
                    <Calendar className="col-12" id="date" dateFormat="yy/mm/dd" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} showIcon placeholder="yyyy/mm/dd" />
                    <label className="col-12" htmlFor="company">
                        Shift
                    </label>
                    <Dropdown ref={autoCompleteRef} className="col-12" id="shift" value={shiftValue} onChange={(e) => setShiftValue(e.value)} options={shiftData} optionLabel="name" placeholder="Shift" onKeyDown={handleShiftAutoCompleteKeyDown} />
                    <label className="col-12" htmlFor="company">
                        Loket
                    </label>
                    <Dropdown ref={autoCompleteRef} className="col-12" id="counter" value={counterValue} onChange={(e) => setCounterValue(e.value)} options={counterData} optionLabel="name" placeholder="Loket" onKeyDown={handleCounterAutoCompleteKeyDown} />
                    <label className="col-12" htmlFor="company">
                        Pool
                    </label>
                    <AutoComplete ref={autoCompleteRef} className="col-12" id="pool" value={poolValue} onChange={(e) => setPoolValue(e.value)} suggestions={poolSuggestions} completeMethod={onPoolInputChange} field="name" placeholder="Pool" dropdown onKeyDown={handlePoolAutoCompleteKeyDown} onBlur={handlePoolAutoCompleteBlur}/>
                </div>
            </Dialog>
        </div>
    );
};

export default FinanceCashierList;
