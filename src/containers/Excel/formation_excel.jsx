import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

export const createFormationExcel = (data) => {
    handleExport(data).then((url) => {
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", "formation.xlsx");
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
            A: "Formasi.",
            B: "No Bak",
            C: "No Mobil",
            D: "NIK",
            E: "Nama Supir",
            F: "Lama Bekerja",
            G: "No Telp",
            H: "No Rekening",
            I: "Nama Rekening",
            J: "Kategori SIM",
            K: "Exp SIM",
            L: "Tempat Tinggal",
            M: "NIK",
            N: "Nama Supir",
            O: "Lama Bekerja",
            P: "No Telp",
            Q: "No Rekening",
            R: "Nama Rekening",
            S: "Kategori SIM",
            T: "Exp SIM",
            U: "Tempat Tinggal",
        },
    ];

    let table2 = [];

    data.lists.forEach((row) => {
        table1.push({
            A: row.formation_grup_name,
            B: row.tub_no,
            C: row.plate_no,
            D: row.driver_nik,
            E: row.driver_name,
            F: row.driver_join_date === null ? "" : row.driver_join_date,
            G: row.driver_phone === null ? "" : row.driver_phone,
            H: row.driver_bank_no === null ? "" : row.driver_bank_no,
            I: row.driver_bank_name === null ? "" : row.driver_bank_name,
            J: row.driver_license_type === null ? "" : row.driver_license_type,
            K: row.driver_license_exp_date === null ? "" : row.driver_license_exp_date,
            L: row.driver_location === null ? "" : row.driver_location,
            M: row.back_up_nik === null ? "" : row.back_up_nik,
            N: row.back_up_name === null ? "" : row.back_up_name,
            O: row.back_up_join_date === null ? "" : row.back_up_join_date,
            P: row.back_up_phone === null ? "" : row.back_up_phone,
            Q: row.back_up_bank_no === null ? "" : row.back_up_bank_no,
            R: row.back_up_bank_name === null ? "" : row.back_up_bank_name,
            S: row.back_up_license_type === null ? "" : row.back_up_license_type,
            T: row.back_up_license_exp_date === null ? "" : row.back_up_license_exp_date,
            U: row.back_up_location === null ? "" : row.back_up_location,
        });
    });

    table1 = [{ A: "Formasi Armada" }, {}]
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

    XLSX.utils.book_append_sheet(wb, sheet, "Formasi");

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb);

    var headerIndexes = [];
    finalData.forEach((data, index) =>
        data["A"] === "Formasi." ? headerIndexes.push(index) : null
    );

    // const totalRecords = data.lists.length;

    const dataInfo = {
        titleCell: "A1",
        titleRange: "A1:N1",
        theadRange:
            headerIndexes?.length >= 1
                ? `A${headerIndexes[0] + 1}:N${headerIndexes[0] + 1}`
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
        sheet.column("B").width(10);
        sheet.column("C").width(15);
        sheet.column("D").width(20);
        sheet.column("E").width(30);
        sheet.column("F").width(15);
        sheet.column("G").width(15);
        sheet.column("H").width(15);
        sheet.column("I").width(15);
        sheet.column("J").width(15);
        sheet.column("K").width(30);
        sheet.column("L").width(15);
        sheet.column("M").width(20);
        sheet.column("N").width(30);
        sheet.column("O").width(15);
        sheet.column("P").width(15);
        sheet.column("Q").width(15);
        sheet.column("R").width(15);
        sheet.column("S").width(15);
        sheet.column("T").width(30);
        sheet.column("U").width(15);

        sheet.range(dataInfo.titleRange).merged(true).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
        });

        sheet.range(dataInfo.theadRange).style({
            bold: true,
            horizontalAlignment: "center",
        });
      });

    return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
};
