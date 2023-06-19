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
import InputNumberComp from '../../../components/standard/Form/InputNumberComp';
import { RadioButton } from 'primereact/radiobutton';
import { Panel } from 'primereact/panel';

const InvoiceManualCreate = () => {
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
    const [roundSelect, setRoundSelect] = useState(null);
    const [nonSales, setNonSales] = useState(false);
    const [ppn, setPPN] = useState(false);
    const [detailModels, setDetailModel] = useState([]);
    const [payment, setPayment] = useState('Box');

    const emptyModelDetail = {
        plate_no: "",
        remarks: "",
        qty: 0,
        price: 0,
        total: 0,
    };

    const columnsTable = [
        { field: 'plate_no', header: 'No Polisi', sortable: false, style: "percent", width: 10},
        { field: 'remarks', header: 'Keterangan', sortable: false, style: "percent", width: 60},
        { field: 'qty', header: 'Qty', sortable: false, style: "percent", width: 10},
        { field: 'price', header: 'Harga', sortable: false, style: "percent", width: 10},
        { field: 'total', header: 'Total', sortable: false, style: "percent", width: 10},
    ];

    const reportTypeData = [
        { name: "Excavator" },
        { name: "Umum" }
    ];

    const roundData = [
        { name: "-" },
        { name: "Umum" }
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
        <div className="card">
            <div className="grid crud-demo">
                <div className="col-12">
                    <Toast ref={toast} />
                    <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
                </div>

                <div className="col-12">
                    <div className="grid">
                        <div className="col-12 md:col-8 lg:col-8">
                            <Panel header="Invoice">
                                <div className="p-fluid">
                                    <div className='grid'>
                                        <InputTextComp className="field col-12 md:col-2" validate={false} field="reference_no" title="Nomor SJ" value={values.reference_no} onChange={handleChange} disabled={true} />
                                        <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={true} field="company_id" title="Grup Perusahaan"  showField="name" errors={errors} touched={touched}
                                            models={companyData} queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => { setCompanySelect(e); values.company_id.id = e.id; }} onChange={(e) => { setCompanySelect(e.value); values.company_id.id = e.value.id; }} />
                                        <DatePickerComp className="field col-12 md:col-2" validate={true} field="issue_date" title="Tanggal" value={values.issue_date} onChange={(e) => values.issue_date = e} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <DatePickerComp className="field col-12 md:col-2" validate={true} field="invoice_date" title="Tgl TT Invoice" value={values.invoice_date} onChange={(e) => values.invoice_date = e} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={true} field="customer_id" title="Nama Pelanggan"  showField="name" errors={errors} touched={touched}
                                            models={customerData} queryData={(e) => getCustomer(e)} value={customerSelect} setSelectValue={(e) => { setCustomerSelect(e); values.customer_id.id = e.id; }} onChange={(e) => { setCustomerSelect(e.value); values.customer_id.id = e.value.id; }} />
                                    </div>
                                    <div className='grid'>
                                        <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={true} field="plant_id" title="Nama Tujuan"  showField="name" errors={errors} touched={touched}
                                            models={plantData} queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => { setPlantSelect(e); values.plant_id.id = e.id; }} onChange={(e) => { setPlantSelect(e.value); values.plant_id.id = e.value.id; }} />
                                        <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={true} field="product_id" title="Nama Produk"  showField="name" errors={errors} touched={touched}
                                            models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setProductSelect(e); values.product_id.id = e.id; }} onChange={(e) => { setProductSelect(e.value); values.product_id.id = e.value.id; }} />
                                        <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={true} field="fleet_type_id" title="Jenis Armada"  showField="name" errors={errors} touched={touched}
                                            models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setFleetTypeSelect(e); values.fleet_type_id.id = e.id; }} onChange={(e) => { setFleetTypeSelect(e.value); values.fleet_type_id.id = e.value.id; }} />
                                        <AutoCompleteComp className="field col-12 md:col-3" api={true} validate={true} field="fleet_id" title="No Armada"  showField="name" errors={errors} touched={touched}
                                            models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => { setFleetSelect(e); values.fleet_id.id = e.id; }} onChange={(e) => { setFleetSelect(e.value); values.fleet_id.id = e.value.id; }} />
                                    </div>
                                    <div className='grid'>
                                        <DropDownComp className="field col-12 md:col-2" validate={true} field="report_type" title="Jenis Laporan" optionLabel="name" optionValue="name" options={reportTypeData} value={reportTypeSelect} errors={errors} touched={touched}
                                            onBlur={handleBlur} onChange={(e) => { setReportTypeSelect(e.value); values.report_type = e.value; }} />
                                        <InputSwitchComp className="field col-12 md:col-1" validate={true} field="non_sales" title="Non Sales" checked={nonSales} onChange={(e) => { setNonSales(e.value); values.non_sales = e.value ? 1 : 0; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <InputTextAreaComp className="field col-12 md:col-9" validate={false} field="memo" title="Memo" value={values.memo} rows={1} onChange={handleChange} disabled={true} />
                                    </div>
                                </div>
                            </Panel>
                        </div>
                        <div className="col-12 md:col-4 lg:col-4">
                            <Panel header="Summary">
                                <div className='p-fluid'>
                                    <div className='grid'>
                                        <div className='col-4'>
                                            <div className="field flex align-items-center gap-5">
                                                <RadioButton inputId="payment" name="payment" value="Box" onChange={(e) => setPayment(e.value)} checked={payment === 'Box'} />
                                                <label htmlFor="payment" className="pt-2">Box</label>
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            <div className="field flex align-items-center gap-5">
                                                <RadioButton inputId="payment" name="payment" value="Grid" onChange={(e) => setPayment(e.value)} checked={payment === 'Grid'} />
                                                <label htmlFor="payment" className="pt-2">Grid</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <InputNumberComp className="field col-12 md:col-4" field="qty" title="Qty" value={values.qty} onChange={(e) => values.qty = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <InputNumberComp className="field col-12 md:col-4" field="price" title="Harga" value={values.price} onChange={(e) => values.price = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <InputNumberComp className="field col-12 md:col-4" field="sub_total" title="SubTotal" disabled={true} value={values.sub_total} onChange={(e) => values.sub_total = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                    </div>
                                    <div className='grid'>
                                        <DropDownComp className="field col-12 md:col-4" validate={true} field="round" title="Pembulatan" optionLabel="name" optionValue="name" options={roundData} value={roundSelect} errors={errors} touched={touched}
                                            onBlur={handleBlur} onChange={(e) => { setRoundSelect(e.value); values.round = e.value; }} />
                                        <InputNumberComp className="field col-12 md:col-4" field="disc" title="Diskon" value={values.disc} onChange={(e) => values.disc = e.value } minFractionDigits={2} maxFractionDigits={2} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <InputNumberComp className="field col-12 md:col-4" field="dpp" title="DPP" disabled={true} value={values.dpp} onChange={(e) => values.dpp = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                    </div>
                                    <div className='grid'>
                                        <InputSwitchComp className="field col-12 md:col-4" validate={true} field="ppn" title="PPN" checked={ppn} onChange={(e) => { setPPN(e.value); values.ppn = e.value ? 1 : 0; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                        <InputNumberComp className="field col-12 md:col-4" field="total" title="Total" disabled={true} value={values.total} onChange={(e) => values.total = e.value } minFractionDigits={3} maxFractionDigits={3} onBlur={handleBlur} errors={errors} touched={touched} />
                                    </div>
                                </div>
                            </Panel>
                        </div>
                    </div>
                </div>

                <div className='col-12'>
                    <div className="p-fluid">
                        <TabView>
                            <TabPanel header="Ringkasan">
                                <div className="p-fluid">
                                    <InputTextAreaComp className="field col-12 md:col-12" validate={false} field="memo" title="Memo" value={values.memo} rows={20} onChange={handleChange} disabled={true} />
                                </div>
                            </TabPanel>
                            <TabPanel header="Detail">
                                <MenubarComp className="mb-2" field="toolbar-new" action="add" actionButton={(e) => actionButtonToolbarDetail(e)} />

                                <DataTableComp api={false} scrollable={false} scrollHeight="flex" title="" models={detailModels} search={true} columnsTable={columnsTable} paginator={false} editor={(data) => cellEditor(data)} onCellEditComplete={(e) => onCellEditComplete(e)} />
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(InvoiceManualCreate, comparisonFn);
