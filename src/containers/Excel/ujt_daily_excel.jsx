import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

export const createUJTExcel = (data) => {
    handleExport(data).then((url) => {
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", "surat_jalan.xlsx");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
};

const workbook2blob = (workbook) => {
    const wopts = {
        bookType: "xlsx",
        bookSST: false,
        type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
    });

    return blob;
};

const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length);

    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i);
    }

    return buf;
};

const handleExport = (data) => {
    let table1 = [
        {
            A: "Tgl SJ.",
            B: "Grup PT",
            C: "Jenis Mobil",
            D: "No Mobil",
            E: "Grup Mobil",
            F: "Nama Supir",
            G: "No SJ",
            H: "Jenis Transaksi",
            I: "Tujuan Awal",
            J: "UJT",
            K: "Cm/Tn",
            L: "Selisih",
            M: "Operan",
            N: "K Kas",
            O: "Adjustment",
            P: "Reimburse",
            Q: "Total"
        },
    ];

    let table2 = [];

    data.order_lists.forEach((row) => {
        table1.push({
            A: row.issue_date,
            B: row.company_code,
            C: row.fleet_type_name,
            D: row.plate_no,
            E: data.company_code,
            F: row.employee_name,
            G: row.reference_no,
            H: row.order_type_name,
            I: row.customer_code + " - " + row.plant_name,
            J: row.ujt_out,
            K: row.bomus_claim,
            L: row.selisih,
            M: row.operan,
            N: row.ujt_void,
            O: row.adjustment,
            P: row.reimburse_finance,
            Q: row.total
        });
    });

    table2.push({
        H: "Saldo Awal",
        I: data.opening_balance
    });
    table2.push({
        H: "Dropping",
        I: data.dropping
    });
    table2.push({
        H: "Kas Keluar",
        I: "",
        J: "Kas Masuk",
        K: "",
        L: "On Hand",
        M: "",
        N: "Dana HO",
        O: ""
    });
    table2.push({
        H: "UJT Keluar",
        I: data.cash_out.ujt_out,
        J: "UJT Void",
        K: data.cash_in.ujt_void,
        L: "UJT Void",
        M: data.cash_on_hand.void_on_hand,
        N: "Unposted HO",
        O: data.cash_ho.unposted_ho,
        P: "Selisih",
        Q: data.operan_on_hand
    });
    table2.push({
        H: "Selisih",
        I: data.cash_out.selisih,
        J: "Operan",
        K: data.cash_in.operan,
        L: "UJT on hand",
        M: data.cash_on_hand.ujt_on_hand,
        N: "Over Reimburse",
        O: data.cash_ho.over_reimburse_ho
    });
    table2.push({
        H: "Bonus",
        I: data.cash_out.bonus,
        J: "Claim",
        K: data.cash_in.claim,
        L: "Operan",
        M: data.cash_on_hand.selisih_on_hand,
    });
    table2.push({
        H: "Adjustment",
        I: data.cash_out.adjustment,
        J: "Reimburse",
        K: data.cash_in.reimburse_finance,
        L: "Over Reimburse",
        M: data.cash_on_hand.over_reimburse_on_hand,
    });
    table2.push({
        L: "Additional",
        M: data.cash_on_hand.additional_on_hand,
    });
    table2.push({
        L: "Loan",
        M: data.cash_on_hand.loan_on_hand,
    });
    table2.push({
    });
    table2.push({
        H: "Total Kas Keluar",
        I: data.total_cash_out,
        J: "Total Kas Masuk",
        K: data.total_cash_int,
        L: "Total On Hand",
        M: data.total_on_hand,
        N: "Total Dana HO",
        O: data.subtotal,
        P: "Sub Total",
        Q: data.total
    });
    table2.push({
    });
    table2.push({
        J: "Saldo Akhir",
        K: data.closing_balance,
        P: "Modal",
        Q: data.modal
    });

    table1 = [{ A: "Laporan UJT Harian" }, { A: data.company_name}, { A: "Tanggal ", B: data.issue_date, D: "Shift", E: data.shift}]
        .concat(table1)
        .concat([""])
        .concat(table2);

    // const finalData = [...title, ...table1];
    const finalData = [...table1];

    //create a new workbook
    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
        skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, "UJT");

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb);

    var headerIndexes = [];
    finalData.forEach((data, index) =>
        data["A"] === "Tgl SJ." ? headerIndexes.push(index) : null
    );

    const totalRecords = data.order_lists.length;

    const dataInfo = {
        titleCell: "A1",
        titleRange: "A1:Q1",
        titleCompanyRange: "A2:Q2",
        tbodyRange: `J5:Q${finalData.length}`,
        theadRange:
            headerIndexes?.length >= 1
                ? `A${headerIndexes[0] + 1}:Q${headerIndexes[0] + 1}`
                : null,
        tFirstColumnRange:
            totalRecords > 0
            ? `A${totalRecords + 4}:Q${totalRecords + 20}`
            : null,
    };

    return addStyle(workbookBlob, dataInfo);
};

const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
        workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
            fontFamily: "Arial",
            verticalAlignment: "center",
        });

        sheet.column("A").width(15);
        sheet.column("B").width(12);
        sheet.column("C").width(25);
        sheet.column("D").width(15);
        sheet.column("E").width(10);
        sheet.column("F").width(40);
        sheet.column("G").width(20);
        sheet.column("H").width(20);
        sheet.column("I").width(50);
        sheet.column("J").width(15);
        sheet.column("K").width(15);
        sheet.column("L").width(15);
        sheet.column("M").width(15);
        sheet.column("N").width(15);
        sheet.column("O").width(15);
        sheet.column("P").width(15);
        sheet.column("Q").width(15);

        sheet.range(dataInfo.titleRange).merged(true).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
        });

        sheet.range(dataInfo.titleCompanyRange).merged(true).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
        });

        if (dataInfo.tbodyRange) {
            sheet.range(dataInfo.tbodyRange).style({
                horizontalAlignment: "right",
                numberFormat: "#,##0.00"
            });
        }

        sheet.range(dataInfo.theadRange).style({
            bold: true,
            horizontalAlignment: "center",
        });

        if (dataInfo.tFirstColumnRange) {
          sheet.range(dataInfo.tFirstColumnRange).style({
            horizontalAlignment: "right",
            numberFormat: "#,##0.00"
          });
        }
      });

    return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
};
