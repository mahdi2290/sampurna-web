import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

export const exportExcelPayroll = (models, filename) => {
    import('xlsx').then(xlsx => {
        const payroll = xlsx.utils.json_to_sheet(models);

        const orderData = [];
        const loanData = [];
        for (let index = 0; index < models.length; index++) {
            const row = models[index];
            if (row.order_lists !== null) {
                row.order_lists.forEach(orderRow => {
                    orderData.push(orderRow);
                });
            }
            if (row.loan_lists !== null) {
                row.loan_lists.forEach(loanRow => {
                    loanData.push(loanRow);
                });
            }
        }
        const order = xlsx.utils.json_to_sheet(orderData);
        const loan = xlsx.utils.json_to_sheet(loanData);

        const workbook = { Sheets: { 'payroll': payroll, 'order': order, 'loan': loan }, SheetNames: ['payroll', 'order', 'loan'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, filename);
    });
}

export const exportExcel = (models, filename) => {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(models);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, filename);
    });
}

const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then(module => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    });
}

export const exportExcelArray = (filename, finalData) => {
    const fileType = "xlsx"

    finalData.map((item, index) => {
        item['json'] = XLSX.utils.json_to_sheet(item.data)
    });
    const obj = {
        Sheets: {},
        SheetNames: {}
    }
    finalData.map((item, index) => {
        obj.Sheets[item['category']] = item.json
        obj.SheetNames.push(item.category)
    });
    const file = {...obj}
    const excelBuffer = XLSX.write(file, {bookType: "xlsx", type: "array"})
    const data = new Blob([excelBuffer], {type:fileType})
    FileSaver.saveAs(data, filename + ".xlsx")
}
