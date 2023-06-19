import { Toast } from 'primereact/toast';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import MenubarComp from '../../../components/standard/Menu/MenubarComp';
import AutoCompleteComp from '../../../components/standard/Form/AutoCompleteComp';
import { useFormik } from 'formik';
import { APICompany, APICustomer, APIPlant, APIProduct } from '../../../components/api/APIMaster';
import InputTextComp from '../../../components/standard/Form/InputTextComp';
import DatePickerComp from '../../../components/standard/Form/DatePickerComp';
import InputSwitchComp from '../../../components/standard/Form/InputSwitchComp';
import InputTextAreaComp from '../../../components/standard/Form/InputTextAreaComp';
import { formatDateString } from '../../../helpers/FormatHelpers';
import DropDownComp from '../../../components/standard/Form/DropDownComp';
import { TabPanel, TabView } from 'primereact/tabview';
import DataTableComp from '../../../components/standard/DataTable/DataTableComp';
import { Panel } from 'primereact/panel';
import { RadioButton } from 'primereact/radiobutton';
import InputNumberComp from '../../../components/standard/Form/InputNumberComp';

const InvoiceCreate = () => {
    const toast = useRef();
    const emptyModel = {
        reference_no: "",
        company_id: { id: 0 },
        issue_date: formatDateString(new Date()),
        invoice_date: null,
        customer_id: { id: 0 },
    };

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [customerData, setCustomerData] = useState([]);
    const [customerSelect, setCustomerSelect] = useState(null);
    const [plantData, setPlantData] = useState([]);
    const [plantSelect, setPlantSelect] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productSelect, setProductSelect] = useState(null);
    const [fleetTypeData, setFleetTypeData] = useState([]);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);
    const [fleetData, setFleetData] = useState([]);
    const [fleetSelect, setFleetSelect] = useState(null);
    const [reportTypeSelect, setReportTypeSelect] = useState(null);
    const [detailModels, setDetailModel] = useState([]);
    const [roundSelect, setRoundSelect] = useState(null);
    const [kubikasiAkhirSelected, setKubikasiAkhirSelect] = useState(null);
    const [ppn, setPPN] = useState(false);
    const [formatInvoice, setFormatInvoice] = useState("FAC");
    const [metodePerhitungan, setMetodePerhitungan] = useState("Kubikasi");

    const emptyModelDetail = {
        plate_no: "",
        remarks: "",
        qty: 0,
        price: 0,
        total: 0,
    };

    const columnsTable = [
        { field: 'reference_no', header: 'No SJ', sortable: false, style: "percent", width: 10},
        { field: 'issue_date', header: 'Tgl Plant', sortable: false, style: "percent", width: 8},
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 10},
        { field: 'order_type_name', header: 'Transaksi', sortable: false, style: "percent", width: 8},
        { field: 'product_name', header: 'Produk', sortable: false, style: "percent", width: 8},
        { field: 'plant_name', header: 'Plant', sortable: false, style: "percent", width: 10},
        { field: 'no_do', header: 'No DO', sortable: false, style: "percent", width: 6},
        { field: 'volume', header: 'Volume', sortable: false, style: "percent", width: 8},
        { field: 'sj_customer', header: 'SJ Customer', sortable: false, style: "percent", width: 8},
        { field: 'grr', header: 'GRR', sortable: false, style: "percent", width: 8},
        { field: 'quarry', header: 'Quarry', sortable: false, style: "percent", width: 8},
        { field: 'price', header: 'Price', sortable: false, style: "percent", width: 8},
    ];

    const columnsTargetTable = [
        { field: 'reference_no', header: 'No SJ', sortable: false, style: "percent", width: 10},
        { field: 'issue_date', header: 'Tgl Plant', sortable: false, style: "percent", width: 8},
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 10},
        { field: 'order_type_name', header: 'Transaksi', sortable: false, style: "percent", width: 8},
        { field: 'product_name', header: 'Produk', sortable: false, style: "percent", width: 8},
        { field: 'plant_name', header: 'Plant', sortable: false, style: "percent", width: 10},
        { field: 'no_do', header: 'No DO', sortable: false, style: "percent", width: 7},
        { field: 'no_po', header: 'No PO', sortable: false, style: "percent", width: 8},
        { field: 'length', header: 'P', sortable: false, style: "percent", width: 5},
        { field: 'width', header: 'L', sortable: false, style: "percent", width: 5},
        { field: 'height', header: 'T', sortable: false, style: "percent", width: 5},
        { field: 'volume', header: 'Volume', sortable: false, style: "percent", width: 8},
        { field: 'round', header: 'Round', sortable: false, style: "percent", width: 8},
    ];

    const roundData = [
        { name: "-" },
        { name: "Umum" }
    ];

    const kubikasiAkhirData = [
        { id: 1, name: "1 Digit" },
        { id: 2, name: "2 Digit" },
        { id: 3, name: "3 Digit" }
    ];

    const getCompany = async(keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

    const getCustomer = async (keyword) => {
        const res = await APICustomer(keyword);

        setCustomerData(null);

        return res;
    }

    const getPlant = async (keyword) => {
        const res = await APIPlant(keyword);

        setPlantData(null);

        return res;
    }

    const getProduct = async (keyword) => {
        const res = await APIProduct(keyword);

        setProductData(null);

        return res;
    }

    const onSubmited = async(values, actions) => {

    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited
    });

    const actionButtonToolbar = (e) => {
    }

    const actionButtonToolbarDetail = (e) => {
        switch (e) {
            case "new":
                setDetailModel(prevState => [...prevState, emptyModelDetail]);
                break;

            default:
                break;
        }
    };

    const cellEditor = (options) => {
        if (options.field === 'ritase_payroll')
            return options.value;
        else
            return options.value;
    }

    const onCellEditComplete = async(e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'ritase_payroll':

                break;

            default:
                break;
        }
    }

    useEffect(() => {
        setCompanyData(null);
        setCustomerData(null);
        setPlantData(null);
        setProductData(null);
    }, []);

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>

                    <div className="col-12">
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-6">
                                <Panel header="Invoice">
                                    <div className="p-fluid">
                                        <div className='grid'>
                                            <InputTextComp className="field col-12 md:col-3" validate={false} field="reference_no" title="Nomor SJ" value={values.reference_no} onChange={handleChange} disabled={true} />
                                            <DatePickerComp className="field col-12 md:col-3" validate={true} field="issue_date" title="Tanggal" value={values.issue_date} onChange={(e) => values.issue_date = e} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <DatePickerComp className="field col-12 md:col-3" validate={true} field="invoice_date" title="Tgl TT Invoice" value={values.invoice_date} onChange={(e) => values.invoice_date = e} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <InputTextComp className="field col-12 md:col-3" validate={false} field="no_ref" title="Nomor Ref" value={values.no_ref} onChange={handleChange} disabled={false} errors={errors} touched={touched} />
                                        </div>
                                        <div className='grid'>
                                            <AutoCompleteComp className="field col-12 md:col-6" api={true} validate={true} field="customer_id" title="Nama Pelanggan"  showField="name" errors={errors} touched={touched}
                                                models={customerData} queryData={(e) => getCustomer(e)} value={customerSelect} setSelectValue={(e) => { setCustomerSelect(e); values.customer_id.id = e.id; }} onChange={(e) => { setCustomerSelect(e.value); values.customer_id.id = e.value.id; }} />
                                            <AutoCompleteComp className="field col-12 md:col-6" api={true} validate={true} field="fleet_id" title="Quarry"  showField="name" errors={errors} touched={touched}
                                                models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setFleetSelect(e); values.fleet_id.id = e.id; }} onChange={(e) => { setFleetSelect(e.value); values.fleet_id.id = e.value.id; }} />
                                        </div>
                                        <div className='grid'>
                                            <InputTextComp className="field col-12 md:col-4" validate={false} field="no_ref" title="GRR" value={values.no_ref} onChange={handleChange} disabled={false} errors={errors} touched={touched} />
                                            <InputNumberComp className="field col-12 md:col-4" field="tonase" title="Kubikasi/Tonase" value={values.tonase} onChange={(e) => values.tonase = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <InputTextComp className="field col-12 md:col-4" validate={false} field="po_no" title="PO No" value={values.po_no} onChange={handleChange} disabled={false} errors={errors} touched={touched} />
                                        </div>
                                        <div className='grid'>
                                            <AutoCompleteComp className="field col-12 md:col-6" api={true} validate={true} field="company_id" title="Grup Perusahaan"  showField="name" errors={errors} touched={touched}
                                                models={companyData} queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => { setCompanySelect(e); values.company_id.id = e.id; }} onChange={(e) => { setCompanySelect(e.value); values.company_id.id = e.value.id; }} />
                                            <AutoCompleteComp className="field col-12 md:col-6" api={true} validate={true} field="plant_id" title="Nama Tujuan"  showField="name" errors={errors} touched={touched}
                                                models={plantData} queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => { setPlantSelect(e); values.plant_id.id = e.id; }} onChange={(e) => { setPlantSelect(e.value); values.plant_id.id = e.value.id; }} />
                                        </div>
                                        <div className='grid'>
                                            <AutoCompleteComp className="field col-12 md:col-6" api={true} validate={true} field="product_id" title="Nama Produk"  showField="name" errors={errors} touched={touched}
                                                models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setProductSelect(e); values.product_id.id = e.id; }} onChange={(e) => { setProductSelect(e.value); values.product_id.id = e.value.id; }} />
                                            <AutoCompleteComp className="field col-12 md:col-6" api={true} validate={true} field="fleet_type_id" title="Jenis Armada"  showField="name" errors={errors} touched={touched}
                                                models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setFleetTypeSelect(e); values.fleet_type_id.id = e.id; }} onChange={(e) => { setFleetTypeSelect(e.value); values.fleet_type_id.id = e.value.id; }} />
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                            <div className="col-12 md:col-3 lg:col-3">
                                <Panel header="Format">
                                    <div className='p-fluid'>
                                        <div className='grid'>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="FAC" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'FAC'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv ADH (Fac)</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="RIT" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'RIT'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv Rit</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="GRR" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'GRR'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv GRR</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="SJ" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'SJ'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv PBI (SJ)</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="PBI" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'PBI'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv PBI/Umum</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="BOX" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'BOX'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv Trailer/Box</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="ADH" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'ADH'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv ADH</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="formatInvoice" name="formatInvoice" value="NON" onChange={(e) => setFormatInvoice(e.value)} checked={formatInvoice === 'NON'} />
                                                    <label htmlFor="formatInvoice" className="pt-2">Format Inv Non</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                                <Panel header="Perhitungan" className='mt-2'>
                                    <div className='p-fluid'>
                                        <div className='grid'>
                                            <div className='col-4'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="metodePerhitungan" name="metodePerhitungan" value="Kubikasi" onChange={(e) => setMetodePerhitungan(e.value)} checked={metodePerhitungan === 'Kubikasi'} />
                                                    <label htmlFor="metodePerhitungan" className="pt-2">Kubikasi</label>
                                                </div>
                                            </div>
                                            <div className='col-4'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="metodePerhitungan" name="metodePerhitungan" value="Ritase" onChange={(e) => setMetodePerhitungan(e.value)} checked={metodePerhitungan === 'Ritase'} />
                                                    <label htmlFor="metodePerhitungan" className="pt-2">Ritase</label>
                                                </div>
                                            </div>
                                            <div className='col-4'>
                                                <div className="field flex align-items-center gap-5">
                                                    <RadioButton inputId="metodePerhitungan" name="metodePerhitungan" value="Jarak" onChange={(e) => setMetodePerhitungan(e.value)} checked={metodePerhitungan === 'Jarak'} />
                                                    <label htmlFor="metodePerhitungan" className="pt-2">Jarak (Km)</label>
                                                </div>
                                            </div>
                                        </div>
                                        <DropDownComp className="field col-12 md:col-12" validate={true} field="kubikasi_akhir" title="Set kubikasi akhir" optionLabel="name" optionValue="id" options={kubikasiAkhirData} value={kubikasiAkhirSelected} errors={errors} touched={touched}
                                            onBlur={handleBlur} onChange={(e) => { setKubikasiAkhirSelect(e.value); values.kubikasi_akhir = e.value; }} />
                                    </div>
                                </Panel>
                            </div>
                            <div className="col-12 md:col-3 lg:col-3">
                                <Panel header="Summary">
                                    <div className='p-fluid'>
                                        <div className='grid'>
                                            <InputNumberComp className="field col-12 md:col-6" field="qty" title="Qty" value={values.qty} onChange={(e) => values.qty = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <InputNumberComp className="field col-12 md:col-6" field="price" title="Harga" value={values.price} onChange={(e) => values.price = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                        </div>
                                        <div className='grid'>
                                            <InputNumberComp className="field col-12 md:col-6" field="sub_total" title="SubTotal" disabled={true} value={values.sub_total} onChange={(e) => values.sub_total = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <DropDownComp className="field col-12 md:col-6" validate={true} field="round" title="Pembulatan" optionLabel="name" optionValue="name" options={roundData} value={roundSelect} errors={errors} touched={touched}
                                                onBlur={handleBlur} onChange={(e) => { setRoundSelect(e.value); values.round = e.value; }} />
                                        </div>
                                        <div className='grid'>
                                            <InputNumberComp className="field col-12 md:col-6" field="disc" title="Diskon" value={values.disc} onChange={(e) => values.disc = e.value } minFractionDigits={2} maxFractionDigits={2} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <InputNumberComp className="field col-12 md:col-6" field="dpp" title="DPP" disabled={true} value={values.dpp} onChange={(e) => values.dpp = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                        </div>
                                        <div className='grid'>
                                            <InputSwitchComp className="field col-12 md:col-6" validate={true} field="ppn" title="PPN" checked={ppn} onChange={(e) => { setPPN(e.value); values.ppn = e.value ? 1 : 0; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                            <InputNumberComp className="field col-12 md:col-6" field="total" title="Total" disabled={true} value={values.total} onChange={(e) => values.total = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        </div>
                    </div>

                    <div className='col-12'>
                        <div className="p-fluid">
                            <TabView>
                                <TabPanel header="Source">
                                    <div className="col-12">
                                        <DataTableComp api={false} scrollable={false} scrollHeight="flex" title="" models={detailModels} search={true} columnsTable={columnsTable} paginator={false} editor={(data) => cellEditor(data)} onCellEditComplete={(e) => onCellEditComplete(e)} />
                                    </div>
                                </TabPanel>
                                <TabPanel header="Target">
                                    <div className="col-12">
                                        <DataTableComp api={false} scrollable={false} scrollHeight="flex" title="" models={detailModels} search={true} columnsTable={columnsTargetTable} paginator={false} editor={(data) => cellEditor(data)} onCellEditComplete={(e) => onCellEditComplete(e)} />
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(InvoiceCreate, comparisonFn);
