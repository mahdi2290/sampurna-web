import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDateFullString, formatDateTimeFullString } from '../../../helpers/FormatHelpers';
import * as HeaderService from '../../../service/Payroll/PayrollService';

// import "./../../../assets/css/report-invoice.scss";

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
    const [page, setPage] = useState([]);
    const [date, setDate] = useState(null);
    const [totalSJ, setTotalSJ] = useState(0);
    const [chunk, setChunk] = useState(11);
    const [rowEmpty, setRowEmpty] = useState([]);
    const [nextPage, setNextPage] = useState(false);

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

                if (data.order_lists.length <= 11) {
                    const _before = [...page];
                    _before.push(data.order_lists);
                    setPage(_before);
                    setNextPage(false);
                } else {
                    let array = 0;
                    if ( data.order_lists.length < 19 ) {
                        array = splitArrIntoChunks(data.order_lists, data.order_lists.length);
                        
                        const emptyCount = 19 - data.order_lists.length
                        for (let index = 0; index < emptyCount; index++) {
                            setRowEmpty(prevState => [...prevState, {id: index}]);                            
                        }
                    } else {
                        array = splitArrIntoChunks(data.order_lists, 19);
                    }
                    setNextPage(true);
                    setPage(array);
                }
            }
        }
    }

    const splitArrIntoChunks = (array, chunkSize) => {
      let i, j, accum = [];
    
      for (let index = 0; index < array.length; index+=chunkSize) {
        accum = [...accum, array.slice(index, index+chunkSize)];
      }
    
      return accum;
    }

    useEffect(() => {
        setChunk(11);
        setDate(formatDateTimeFullString(new Date()));

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>                
            {            
                page.length === 0 ? 
                    <div className='page'>
                        <div className="page-header">
                            <div className="row">
                                <div className="column">
                                    <span>
                                        {date}
                                    </span>
                                    <br/>
                                    <span>
                                        Periode {formatDateFullString(model.period1)} s.d. {formatDateFullString(model.period2)}
                                    </span>
                                </div>
                                <div className="column">
                                    <div className='company'>
                                        SAMPURNA GROUP - {model.company_name}
                                    </div>
                                    <div className="report-title">
                                        SLIP GAJI
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <table className="table-info">
                                        <tr>
                                            <td className='text-title'>NIK</td>
                                            <td>{model.nik}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-title'>Nama Lengkap</td>
                                            <td>{model.employee_name}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-title'>Nomor Polisi</td>
                                            <td>{model.plate_no}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-title'>Nama Formasi</td>
                                            <td>{model.formation_name}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="column">
                                    <table className="table-info">
                                        <tr>
                                            <td className='text-title'>Bisnis Unit</td>
                                            <td>{model.sales_type_name}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-title'>Rekening</td>
                                            <td>{model.bank_no}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-title'>Nama Rekening</td>
                                            <td>{model.bank_account_name}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-title'>Bank</td>
                                            <td>{model.bank_name}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <table className="table-content">
                            <thead>
                                <tr>
                                    <td>
                                        <div className="page-header-space"></div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div>
                                            <div className="row">
                                                <div className="column">
                                                    <table className='table-report'>
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
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="column">
                                                    <table className='table-report borderTop'>
                                                        <tbody>
                                                            <tr>
                                                                <td className=''>Pot. Claim Ban</td>
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
                                                    </table>
                                                </div>
                                            </div>                                            
                                            <div className="row">
                                                <div className="column">
                                                    <table className='table-report'>
                                                        <tbody>
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
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="column">
                                                    <table className='table-report borderTop'>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{textAlign:"left"}} className="borderTop"></td>
                                                                <td style={{textAlign:"right"}} className="borderTop">{formatCurrency(model.loan_lists[0].tire_claim + model.loan_lists[0].sparepart + model.loan_lists[0].cash + model.loan_lists[0].var_mat +
                                                                    model.loan_lists[0].others_ + model.loan_lists[0].laka_finance + model.loan_lists[0].laka_sparepart + model.loan_lists[0].bpjs_tk + model.loan_lists[0].laka_payment, 0)}</td>
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
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>
                                        <div className="page-footer-space"></div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="page-footer">
                        </div>
                    </div>
                : page.map((data, number) => {
                        return <div className='page'>
                            <div className="page-header">
                                <div className="row">
                                    <div className="column">
                                        <span>
                                            {date}
                                        </span>
                                        <br/>
                                        <span>
                                            Periode {formatDateFullString(model.period1)} s.d. {formatDateFullString(model.period2)}
                                        </span>
                                    </div>
                                    <div className="column">
                                        <div className='company'>
                                            SAMPURNA GROUP - {model.company_name}
                                        </div>
                                        <div className="report-title">
                                            SLIP GAJI
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <table className="table-info">
                                            <tr>
                                                <td className='text-title'>NIK</td>
                                                <td>{model.nik}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-title'>Nama Lengkap</td>
                                                <td>{model.employee_name}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-title'>Nomor Polisi</td>
                                                <td>{model.plate_no}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-title'>Nama Formasi</td>
                                                <td>{model.formation_name}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="column">
                                        <table className="table-info">
                                            <tr>
                                                <td className='text-title'>Bisnis Unit</td>
                                                <td>{model.sales_type_name}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-title'>Rekening</td>
                                                <td>{model.bank_no}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-title'>Nama Rekening</td>
                                                <td>{model.bank_account_name}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-title'>Bank</td>
                                                <td>{model.bank_name}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <table className="table-content">
                                <thead>
                                    <tr>
                                        <td>
                                            <div className="page-header-space"></div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <div className="row">
                                                    <div className="column">
                                                        <table className='table-report'>
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
                                                                    data.map((row, i) => {
                                                                        return <tr>
                                                                            <td style={{textAlign:"center"}}>{number > 0 ? chunk + i + 1 : i + 1}</td>
                                                                            <td style={{textAlign:"center"}}>{formatCurrency(row.ritase, 0)}</td>
                                                                            <td style={{textAlign:"center"}}>{formatCurrency(row.total_do, 0)}</td>
                                                                            <td style={{textAlign:"center"}}>{formatCurrency(row.total_rit, 2)}</td>
                                                                            <td style={{textAlign:"right"}}>{formatCurrency(row.total_ritase, 0)}</td>
                                                                        </tr>
                                                                    })                                                                
                                                                }

                                                                {
                                                                    rowEmpty.length === 0 ? "" : rowEmpty.map((row) => {
                                                                        return <tr><td colSpan={5}></td></tr>
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="column">
                                                    {
                                                        number === 0 ? 
                                                            <table className='table-report borderTop'>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className=''>Pot. Claim Ban</td>
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
                                                            </table> : ""
                                                    }
                                                    </div>
                                                </div>
                                                {
                                                    number + 1 === page.length && nextPage === false ? 
                                                    <div className="row">
                                                        <div className="column">
                                                            <table className='table-report'>
                                                                <tbody>
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
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="column">
                                                            <table className='table-report borderTop'>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{textAlign:"left"}} className="borderTop"></td>
                                                                        <td style={{textAlign:"right"}} className="borderTop">{formatCurrency(model.loan_lists[0].tire_claim + model.loan_lists[0].sparepart + model.loan_lists[0].cash + model.loan_lists[0].var_mat +
                                                                            model.loan_lists[0].others_ + model.loan_lists[0].laka_finance + model.loan_lists[0].laka_sparepart + model.loan_lists[0].bpjs_tk + model.loan_lists[0].laka_payment, 0)}</td>
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
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div> : ""
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <div className="page-footer-space"></div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="page-footer">
                            </div>
                        </div>
                    })
                }

            {
                nextPage === true && <div className='page'>
                <div className="page-header">
                    <div className="row">
                        <div className="column">
                            <span>
                                {date}
                            </span>
                            <br/>
                            <span>
                                Periode {formatDateFullString(model.period1)} s.d. {formatDateFullString(model.period2)}
                            </span>
                        </div>
                        <div className="column">
                            <div className='company'>
                                SAMPURNA GROUP - {model.company_name}
                            </div>
                            <div className="report-title">
                                SLIP GAJI
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <table className="table-info">
                                <tr>
                                    <td className='text-title'>NIK</td>
                                    <td>{model.nik}</td>
                                </tr>
                                <tr>
                                    <td className='text-title'>Nama Lengkap</td>
                                    <td>{model.employee_name}</td>
                                </tr>
                                <tr>
                                    <td className='text-title'>Nomor Polisi</td>
                                    <td>{model.plate_no}</td>
                                </tr>
                                <tr>
                                    <td className='text-title'>Nama Formasi</td>
                                    <td>{model.formation_name}</td>
                                </tr>
                            </table>
                        </div>
                        <div className="column">
                            <table className="table-info">
                                <tr>
                                    <td className='text-title'>Bisnis Unit</td>
                                    <td>{model.sales_type_name}</td>
                                </tr>
                                <tr>
                                    <td className='text-title'>Rekening</td>
                                    <td>{model.bank_no}</td>
                                </tr>
                                <tr>
                                    <td className='text-title'>Nama Rekening</td>
                                    <td>{model.bank_account_name}</td>
                                </tr>
                                <tr>
                                    <td className='text-title'>Bank</td>
                                    <td>{model.bank_name}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <table className="table-content">
                    <thead>
                        <tr>
                            <td>
                                <div className="page-header-space"></div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    <div className="row">
                                        <div className="column">
                                            <table className='table-report'>
                                                <tbody>
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
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="column">
                                            <table className='table-report borderTop'>
                                                <tbody>
                                                    <tr>
                                                        <td style={{textAlign:"left"}} className="borderTop"></td>
                                                        <td style={{textAlign:"right"}} className="borderTop">{formatCurrency(model.loan_lists[0].tire_claim + model.loan_lists[0].sparepart + model.loan_lists[0].cash + model.loan_lists[0].var_mat +
                                                            model.loan_lists[0].others_ + model.loan_lists[0].laka_finance + model.loan_lists[0].laka_sparepart + model.loan_lists[0].bpjs_tk + model.loan_lists[0].laka_payment, 0)}</td>
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
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <div className="page-footer-space"></div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className="page-footer">
                </div>
            </div>
            }
        </div>
    )
}

export default DumpTruckSlip;