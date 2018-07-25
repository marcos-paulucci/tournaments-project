var xl = require('excel4node');
const filesPath = 'public/uploads/';

class XlsService {

    createXls(name, dataset) {
        var wb = new xl.Workbook();

        var ws = wb.addWorksheet('Sheet 1');

        var style = wb.createStyle({
            font: {
                color: '#FF0800',
                size: 12,
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let headers = [],
            elem = dataset[0];
        for (let prop in elem) {
            if (elem.hasOwnProperty(prop)) {
                headers.push(prop);
            }
        }
        for (let w = 0; w < headers.length; w++) {
            ws.cell(1, w + 1)
                .string(headers[w])
                .style(style);
        }

        const rows = dataset.length;
        for (let i = 0; i < rows; i++){
            let battle = dataset[i];
            for (let h = 0; h < headers.length; h++) {
                let valCell = battle[headers[h]] ? battle[headers[h]].toString() : "";
                ws.cell(i + 2, h + 1)
                    .string(valCell)
                    .style(style);
            }
        }
        wb.write(filesPath + name);
    };
}

let xlsService = new XlsService();
module.exports = xlsService;
