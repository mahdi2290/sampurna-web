import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { formatDateTimeFullString, formatCurrency } from "../../../helpers/FormatHelpers";

const DailyUJTPage = (props) => {
    const componentRef = useRef();
    const [date, setDate] = useState(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        setDate(formatDateTimeFullString(new Date()));
    }, [props]);

    return (
        <>
            <Button type="button" onClick={handlePrint} label="Print" icon="pi pi-print" className="mb-3" />

            <div className="grid">
                <div className="col">
                    <div className="card">
                        <div ref={componentRef} className="sg-page">
                            <div className="sg-layout-report">
                                <div className="sg-row">
                                    <div className="sg-column-full">
                                        <div className="sg-company-name sg-text-center sg-margin-bottom-10">Sampurna Group</div>
                                        <div className="sg-company-address sg-text-center">
                                            <p>Laporan UJT Harian</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sg-report-title"></div>
                            </div>
                            <table className="sg-table-container pt-5">
                                <thead>
                                    <tr>
                                        <td>
                                            <div className="sg-layout-report-ujt-space"></div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <table className="sg-table">
                                                    <thead>
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Tgl SJ</th>
                                                            <th>Grp PT</th>
                                                            <th>Jenis Mobil</th>
                                                            <th>No Mobil</th>
                                                            <th>Grp Mobil</th>
                                                            <th>Supir</th>
                                                            <th>No SJ</th>
                                                            <th>Transaksi</th>
                                                            <th>Asal Tujuan Awal</th>
                                                            <th>UJT</th>
                                                            <th>Cm/Tn</th>
                                                            <th>Selisih</th>
                                                            <th>Operan</th>
                                                            <th>Loan</th>
                                                            <th>Subtotal</th>
                                                            <th>By Koperasi</th>
                                                            <th>By Abu</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            props.header.order_lists !== null &&
                                                            props.header.order_lists.map((row, i) => {
                                                                return <tr key={row.id}>
                                                                    <td style={{width:'1%',textAlign:'center'}}>{i + 1}</td>
                                                                    <td style={{width:'6%',textAlign:'left'}}>{row.issue_date}</td>
                                                                    <td style={{width:'3%',textAlign:'left'}}>{row.company_code}</td>
                                                                    <td style={{width:'9%',textAlign:'left'}}>{row.fleet_type_name}</td>
                                                                    <td style={{width:'7%',textAlign:'left'}}>{row.plate_no}</td>
                                                                    <td style={{width:'3%',textAlign:'left'}}>{props.header.company_code}</td>
                                                                    <td style={{width:'10%',textAlign:'left'}}>{row.employee_name}</td>
                                                                    <td style={{width:'3%',textAlign:'left'}}>{row.reference_no}</td>
                                                                    <td style={{width:'1%',textAlign:'left'}}>{row.order_type_alias}</td>
                                                                    {/* <td style={{width:'10%',textAlign:'left'}}>{row.customer_code} - {row.plant_name}</td> */}
                                                                    <td style={{width:'15%',textAlign:'left'}}>{row.complete_name}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.ujt_out, 0)}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.bomus_claim, 0)}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.selisih, 0)}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.operan, 0)}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.adjustment, 0)}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.subtotal, 0)}</td>
                                                                    <td style={{width:'3%',textAlign:'right'}}>{formatCurrency(row.laka, 0)}</td>
                                                                    <td style={{width:'3%',textAlign:'right'}}>{formatCurrency(0)}</td>
                                                                    <td style={{width:'5%',textAlign:'right'}}>{formatCurrency(row.total, 0)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <div className="sg-summary">
                                                    <div className="sg-row">
                                                        <div className="sg-column-20">
                                                            <table className="sg-summary-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Saldo Awal</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.opening_balance, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Dropping</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.dropping, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Kas Keluar</b></td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">UJT Keluar</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_out.ujt_out, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Selisih</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_out.selisih, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Bonus</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_out.bonus, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Adjustment</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_out.adjustment, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Total Kas Keluar</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.total_cash_out, 0)}</b></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="sg-column-20 borderRight">
                                                            <table className="sg-summary-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Kas Masuk</b></td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">UJT Void</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_in.ujt_void, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Operan</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_in.operan, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Claim</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_in.claim, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Reimburse</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_in.reimburse_finance, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Total Kas Masuk</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.total_cash_in, 0)}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Saldo Akhir</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.closing_balance, 0)}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="sg-column-20">
                                                            <table className="sg-summary-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>On Hand</b></td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">UJT Void</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_on_hand.void_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">UJT on hand</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_on_hand.ujt_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Operan</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_on_hand.operan_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Over Reimburse</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_on_hand.over_reimburse_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Additional</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_on_hand.additional_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Loan</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_on_hand.loan_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Total On Hand</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.total_on_hand, 0)}</b></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="sg-column-20">
                                                            <table className="sg-summary-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Dana HO</b></td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Unposted HO</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_ho.unposted_ho, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Over Reimburse</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.cash_ho.over_reimburse_ho, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Total Dana HO</b></td>
                                                                        {/* <td className="sg-summary-table-value"><b>{formatCurrency(props.header.subtotal, 0)}</b></td> */}
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.total_unposted, 0)}</b></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="sg-column-20">
                                                            <table className="sg-summary-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">Selisih</td>
                                                                        <td className="sg-summary-table-value">{formatCurrency(props.header.selisih_on_hand, 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Sub Total</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.subtotal, 0)}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title">&nbsp;</td>
                                                                        <td className="sg-summary-table-value">&nbsp;</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Modal</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.modal, 0)}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                    <td className="sg-summary-table-title"><b>Modal vs Subtotal</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.balance_modal, 0)}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="sg-summary-table-title"><b>Bonus Claim</b></td>
                                                                        <td className="sg-summary-table-value"><b>{formatCurrency(props.header.bonus_claim_unrelease, 0)}</b></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <div className="sg-page-footer-ujt-space"></div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="sg-page-footer">
                                <div className="sg-content-footer">
                                    <div id="content" className="sg-footer">
                                        {date}
                                        <div id="pageFooter">
                                            {/* Page {page} of {pages} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DailyUJTPage;
