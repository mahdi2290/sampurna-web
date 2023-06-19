import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { Panel } from 'primereact/panel';
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

const OrderCargoDetailNonUJT = () => {
    const history = useHistory();

    const [jenisOrders, setjenisOrders] = useState([]);
    const [jenisOrder, setjenisOrder] = useState(null);
    const [filteredJenisOrder, setfilteredJenisOrder] = useState(null);

    const [namaSTNKs, setnamaSTNKs] = useState([]);
    const [namaSTNK, setnamaSTNK] = useState(null);
    const [filterednamaSTNK, setfilterednamaSTNK] = useState(null);

    const [driver, setDriver] = useState([]);
    const [drivers, setDrivers] = useState(null);
    const [filtereddriver, setfilteredDriver] = useState(null);

    const [namaRekenings, setnamaRekenings] = useState([]);
    const [namaRekening, setnamaRekening] = useState(null);
    const [filterednamaRekening, setfilterednamaRekening] = useState(null);
    
    const [NoSchedule, setNoSchedule] = useState("");
    const [TglSchedule, setTglSchedule] = useState("");
    const [ExpSchedule, setExpSchedule] = useState("");

    const [TglGPS, setTglGPS] = useState("");
    const [UpdateGPS, setUpdateGPS] = useState("");
    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownShift, setDropdownShift] = useState(null);
    
    const [dropdownStatus, setDropdownStatus] = useState(null);
    const dt = useRef(null);
    
    const dropdownValues = [
        { name: "A", code: "A" },
        { name: "B", code: "B" },
        { name: "C", code: "C" },
        { name: "D", code: "D" },
        { name: "E", code: "E" },
    ];

    const dropdownValuesShifts = [
        { name: "1", code: "1" },
        { name: "2", code: "2" },
        { name: "3", code: "3" },
    ];

    const dropdownValuesStatus = [
        { name: "Utama", code: "1" },
        { name: "Serep", code: "2" },
    ];


    const searchJenisOrder = (event) => {
        const filtered = [];
        const query = event.query;
        for (let i = 0; i < jenisOrders.length; i++) {
            const data = jenisOrders[i];
            if (data.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(data);
            }
        }
        setfilteredJenisOrder(filtered);
    };

    const searchNamaSTNK = (event) => {
        const filtered = [];
        const query = event.query;
        for (let i = 0; i < namaSTNKs.length; i++) {
            const data = namaSTNKs[i];
            if (data.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(data);
            }
        }
        setfilterednamaSTNK(filtered);
    };

    const searchDriver = (event) => {
        const filtered = [];
        const query = event.query;
        for (let i = 0; i < drivers.length; i++) {
            const data = drivers[i];
            if (data.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(data);
            }
        }
        setfilteredDriver(filtered);
    };

    const searchNamaRekening = (event) => {
        const filtered = [];
        const query = event.query;
        for (let i = 0; i < namaRekenings.length; i++) {
            const data = namaRekenings[i];
            if (data.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(data);
            }
        }
        setfilterednamaRekening(filtered);
    };

    const backURL = () => {
        return history.push({
            pathname: "/sales/cargo/order-nonujt/list",
        });
    };

    const openNew = () => {
        return history.push({
            pathname: "/sales/cargo/order-nonujt/list",
        });
    };

    const leftContents = (
        <React.Fragment>
            <Button label="Back" icon="pi pi-angle-left" className="p-button-secondary p-button-text mr-2" onClick={backURL} />
            <Button label="New" icon="pi pi-plus" className="p-button-secondary p-button-text" onClick={openNew}/>
            <Button label="Save" icon="pi pi-save" className="p-button-secondary p-button-text" />
            <Button label="Print" icon="pi pi-print" className="p-button-secondary p-button-text mr-2" />
            <Button label="Refresh" icon="pi pi-refresh" className="p-button-secondary p-button-text" />
        </React.Fragment>
    );

    return (
        <div>
            <div className="card p-fluid">
                <Toolbar left={leftContents} />
                <Panel header="Input Surat Jalan" className="mb-3"> 
                    <div className="field grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name2">No. Schedule</label>
                            <InputText id="NoSchedule" value={NoSchedule} onChange={(e) => setNoSchedule(e.value)} type="text" />
                        </div>
                    </div>

                    <div className="field grid">
                        <div className= " field col-12 md:col-3 ">
                            <label htmlFor= "calendar">Tanggal Schedule</label>
                            <Calendar inputId= "calendar" value={TglSchedule} onChange={(e) => setTglSchedule(e.value)} showIcon />
                        </div>
                        <div className= " field col-12 md:col-3 ">
                            <label htmlFor="calendar">Masa Berakhir Schedule</label>
                            <Calendar inputId="calendar" value={ExpSchedule} onChange={(e) => setExpSchedule(e.value)} showIcon />
                        </div>
                    </div>

                    <div className="field grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="loket">Loket</label>
                            <Dropdown id="Loket" dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="A/B/C/D/E" />
                        </div>
                    </div>

                    <div className="field grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="shift">Shift</label>
                            <Dropdown id="Shift" dropdown value={dropdownShift} onChange={(e) => setDropdownShift(e.value)} options={dropdownValuesShifts} optionLabel="name" placeholder="1/2/3" />
                        </div>
                    </div>

                    <div className="field grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="jenisorder">Jenis Order</label>
                            <AutoComplete id="autocomplete" dropdown value={jenisOrder} onChange={(e) => setjenisOrder(e.value)} suggestions={filteredJenisOrder} completeMethod={searchJenisOrder} field="name"></AutoComplete>
                        </div>
                    </div>

                    <div className="field grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="loket">Driver</label>
                            <AutoComplete id="autocomplete" dropdown value={driver} onChange={(e) => setDriver(e.value)} suggestions={filtereddriver} completeMethod={searchDriver} field="name"></AutoComplete>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="Status" dropdown value={dropdownStatus} onChange={(e) => setDropdownStatus(e.value)} options={dropdownValuesStatus} optionLabel="name" placeholder="Utama/Serep" />
                        </div>
                    </div>

                    <div className="field grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="name3">Nama Pemilik STNK</label>
                            <AutoComplete id="autocomplete" dropdown value={namaSTNK} onChange={(e) => setnamaSTNK(e.value)} suggestions={filterednamaSTNK} completeMethod={searchNamaSTNK} field="name"></AutoComplete>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label>Nomor Plat</label>
                            <InputText id="Plat No" type="text" />
                        </div>
                    </div>

                    <div className="field grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="calendar">Tanggal GPS</label>
                            <Calendar inputId="calendar" value={TglGPS} onChange={(e) => setTglGPS(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="calendar">Pembaharuan GPS</label>
                            <Calendar inputId="calendar" value={UpdateGPS} onChange={(e) => setUpdateGPS(e.value)} showIcon />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(OrderCargoDetailNonUJT, comparisonFn);
