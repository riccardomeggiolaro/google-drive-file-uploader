import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export class TableUtil {
  static exportArray(Headers: string[], Data: any[], ext: "xlsx" | "csv") {
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.aoa_to_sheet([]);

    XLSX.utils.book_append_sheet(workbook, worksheet);

    XLSX.utils.sheet_add_aoa(worksheet, [Headers], { origin: 'A1' });
    let number = 2
    Data.forEach(arr => {
        XLSX.utils.sheet_add_aoa(worksheet, [arr], { origin: `A${number}` });
        number = number + 1;
    })

    XLSX.writeFile(workbook, `eventi_BaronPesi.${ext}`);
  }

  static generatePDF(Headers: string[], Data: any[]){
    const doc = new jsPDF('landscape','px','a4');
    autoTable(doc, {
      head: [Headers],
      body: Data
    })
    doc.save("eventi_BaronPesi.pdf")
  }
}
