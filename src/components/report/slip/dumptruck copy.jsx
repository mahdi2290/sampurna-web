import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDateFullString, formatDateTimeFullString } from '../../../helpers/FormatHelpers';
import * as HeaderService from '../../../service/Payroll/PayrollService';

// import "./../../../assets/css/slip.scss";

const DumpTruckSlip = (props) => {
    const emptyModel = {
        id: 0,
        reference_id: 0,
        reference_no: "",
        period1: "",
        period2: "",
        company_id: 0,
        company_code: "",
        company_name: "",
        sales_type_id: 0,
        sales_type_name: "",
        formation_id: 0,
        formation_name: "",
        employee_id: 0,
        nik: "",
        employee_name: "",
        fleet_id: 0,
        plate_no: "",
        bank_id: 0,
        bank_no: "",
        bank_account_name: "",
        bank_name: "",
        join_date: null,
        monthly_rit: 0,
        zero_do: 0,
        monthly_do: 0,
        ritase: 0,
        monthly_bonus: 0,
        tire_bonus: 0,
        total_income: 0,
        total_deduction: 0,
        opening_balance: 0,
        gross_salary: 0,
        salary: 0,
        cashier: 0,
        laka: 0,
        ujt: 0,
        transfer: 0,
        closing_balance: 0,
        order_lists: null,
        loan_lists: [
            {
                tire_claim: 0,
                var_mat: 0,
                cash: 0,
                sparepart: 0,
                bpjs_tk: 0,
                others_: 0,
                laka_finance: 0,
                laka_sparepart: 0,
                laka_payment: 0
            }
        ]
    }

    const [model, setModel] = useState(emptyModel);
    const [date, setDate] = useState(null);
    const [totalSJ, setTotalSJ] = useState(0);

    const QueryData = async() => {
        const params = {employee_id : props.employee_id};

        const res = await HeaderService.GetSlip(props.payroll_id, params);

        if (res.status === 200) {
            const data = res.data[0];
            setModel(data);

            if (data.order_lists !== null) {
                let sj = 0;
                data.order_lists.map((row) => {
                    sj += row.total_do;
                    return row;
                });

                setTotalSJ(sj);
            }
        }
    }

    useEffect(() => {
        setDate(formatDateTimeFullString(new Date()));

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="page-slip">
            <div className="header">

            </div>
            <table className="table-template">
                <thead>
                    <tr>
                        <td>
                            <div className="title">
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="content"> 
                                <div className="row-slip">
                                    <div className="column-slip column-50">
                                        <div className=''>
                                            {date}
                                        </div>
                                        <div className=''>
                                            Periode {formatDateFullString(model.period1)} s.d. {formatDateFullString(model.period2)}
                                        </div>
                                        <div className="break-5"></div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">NIK</span>
                                            <span>{model.nik}</span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Nama Lengkap</span>
                                            <span>{model.employee_name}</span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Nomor Polisi</span>
                                            <span>{model.plate_no}</span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Nama Formasi</span>
                                            <span>{model.formation_name}</span>
                                        </div>
                                        <div className="break-10"></div>
                                        <table className='table-slip'>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Ritase</th>
                                                    <th>SJ</th>
                                                    <th>Rit</th>
                                                    <th>Sub Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {                                
                                                    model.order_lists !== null ? model.order_lists.map((row, i) => {
                                                        return <tr>
                                                            <td style={{textAlign:"center"}}>{i + 1}</td>
                                                            <td style={{textAlign:"center"}}>{formatCurrency(row.ritase, 0)}</td>
                                                            <td style={{textAlign:"center"}}>{formatCurrency(row.total_do, 0)}</td>
                                                            <td style={{textAlign:"center"}}>{formatCurrency(row.total_rit, 2)}</td>
                                                            <td style={{textAlign:"right"}}>{formatCurrency(row.total_ritase, 0)}</td>
                                                        </tr>
                                                    }) : <tr><td>Data is empty</td></tr>
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2} className="borderTop">Total SJ</td>
                                                    <td style={{textAlign:"center"}} className="borderTop">{formatCurrency(totalSJ, 0)}</td>
                                                    <td style={{textAlign:"center"}} className="borderTop">{formatCurrency(model.monthly_rit, 2)}</td>
                                                    <td style={{textAlign:"right"}} className="borderTop">{formatCurrency(model.ritase, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2}>SJ Nol</td>
                                                    <td style={{textAlign:"center"}}>{formatCurrency(model.zero_do, 0)}</td>
                                                    <td style={{textAlign:"right"}}></td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.zero_do > 0 ? model.zero_do / totalSJ * 100 : 0, 2)} %</td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2}>Bonus Claim Ban</td>
                                                    <td style={{textAlign:"right"}}></td>
                                                    <td style={{textAlign:"right"}}></td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.tire_bonus, 0)} </td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2}>Bonus Bulanan (Rit)</td>
                                                    <td style={{textAlign:"right"}}></td>
                                                    <td style={{textAlign:"right"}}></td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.monthly_bonus, 0)} </td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2} className="borderTopBottom"><b>Total</b></td>
                                                    <td style={{textAlign:"right"}} className="borderTopBottom"></td>
                                                    <td style={{textAlign:"right"}} className="borderTopBottom"></td>
                                                    <td style={{textAlign:"right"}} className="borderTopBottom"><b>{formatCurrency(model.total_income, 0)}</b></td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2} ><b>Total Gaji Kotor</b></td>
                                                    <td style={{textAlign:"right"}} ></td>
                                                    <td style={{textAlign:"right"}} ></td>
                                                    <td style={{textAlign:"right"}} ><b>{formatCurrency(model.gross_salary, 0)}</b></td>
                                                </tr>
                                                <tr>
                                                    <td className='break-25' colSpan={4}></td>                            
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2} className="borderBottom"><b>HRD</b></td>
                                                    <td style={{textAlign:"right"}} className="borderBottom"></td>
                                                    <td style={{textAlign:"right"}} className="borderBottom"></td>
                                                    <td style={{textAlign:"right"}} className="borderBottom"><b>{formatCurrency(model.transfer, 0)}</b></td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} colSpan={2} >THR</td>
                                                    <td style={{textAlign:"right"}} ></td>
                                                    <td style={{textAlign:"right"}} ></td>
                                                    <td style={{textAlign:"right"}} >{formatCurrency(0, 0)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="column-slip column-10">
                                        &nbsp;
                                    </div>
                                    <div className="column-slip column-50">
                                        <div className='company'>
                                            SAMPURNA GROUP - {model.company_name}
                                        </div>
                                        <div className="report-title">
                                            SLIP GAJI
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Bisnis Unit</span>
                                            <span>{model.sales_type_name}</span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Rekening</span>
                                            <span>{model.bank_no}</span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Nama Rekening</span>
                                            <span>{model.bank_account_name}</span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span className="font-semibold mr-6">Bank</span>
                                            <span>{model.bank_name}</span>
                                        </div>
                                        <div className="break-25"></div>
                                        <table className='table-slip borderTop'>
                                            <tbody>
                                                <tr>
                                                    <td>Pot. Claim Ban</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].tire_claim, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Pot. Material</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].var_mat, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kasbon Uang</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].cash, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Pot. Claim Sparepart</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].sparepart, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>BPJS-TK</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].bpjs_tk, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kasbon Lain-lain</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].others_, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Laka Finance</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].laka_finance, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Laka Sparepart</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].laka_sparepart, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Laka Payment</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.loan_lists[0].laka_payment, 0)}</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td style={{textAlign:"left"}} className="borderTop"></td>
                                                    <td style={{textAlign:"right"}} className="borderTop">{formatCurrency(model.loan_lists[0].tire_claim + model.loan_lists[0].sparepart + model.loan_lists[0].cash + model.loan_lists[0].var_mat +
                                                        model.loan_lists[0].others_ + model.loan_lists[0].laka_finance + model.loan_lists[0].laka_sparepart + model.loan_lists[0].bpjs_tk + model.loan_lists[0].laka_payment, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='break-kasbon' colSpan={4}></td>                            
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}}>Kasbon Lalu</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.opening_balance, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} className="borderTopBottom"><b>Total</b></td>
                                                    <td style={{textAlign:"right"}} className="borderTopBottom"><b>{formatCurrency(model.total_deduction, 0)}</b></td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} >Gantungan Kasir</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.cashier, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} >Pot. Laka</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.laka, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} >Balik Kas</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.ujt, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} className="borderBottom"><b>Transfer</b></td>
                                                    <td style={{textAlign:"right"}} className="borderBottom"><b>{formatCurrency(model.transfer, 0)}</b></td>
                                                </tr>
                                                <tr>
                                                    <td style={{textAlign:"left"}} >Sisa Gaji (Kasbon)</td>
                                                    <td style={{textAlign:"right"}}>{formatCurrency(model.opening_balance, 0)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="footer">

            </div>
        </div>
    )
}

export default DumpTruckSlip;