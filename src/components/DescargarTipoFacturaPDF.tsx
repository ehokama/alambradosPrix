// app/utils/crearPDF.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Item = {
  Descripcion: string;
  Cantidad: number;
  "Precio unitario": string;
  Total: string;
};
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}
const carrito = [
  {
    Descripcion: "Tejido romboidal 1.5mts X 2.5 X 14.5 (10mts)",
    Cantidad: 6,
    "Precio unitario": "$ 100",
    Total: "$ 600"
  },
  {
    Descripcion: "Poste de quebracho colorado 4 X 4 X 2.2mts",
    Cantidad: 3,
    "Precio unitario": "$ 200",
    Total: "$ 600"
  },
    {
    Descripcion: "Cemento Avellaneda x 50Kg",
    Cantidad: 4,
    "Precio unitario": "$ 960",
    Total: "$ 3840"
  }
];

const fecha = new Date();
const fechaStr = fecha.toISOString().slice(0,10);

export function generarPDF(nombreCliente: string) { 
    const doc = new jsPDF();

    // encabezado de la factura

    const pageWidth = doc.internal.pageSize.getWidth();
    const imgHeight = 40 / (1555 / 688);    
    
    const imgData = "data:image/jpeg;base64,/9j/4AA..."
    
    doc.addImage(imgData, "PNG", (pageWidth - 40) / 2 , 5, 40, imgHeight);    doc.addImage(imgData, "PNG", (pageWidth - 40) / 2 , 5, 40, imgHeight);                               

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150);
    doc.setFontSize(10);
    doc.text("Doc. no válido como factura", 10, (5 + imgHeight / 2 ) );
    doc.text("Presupuesto", pageWidth - 10, (5 + imgHeight / 2) , { align: "right" });

    doc.setDrawColor(150);
    doc.setLineWidth(0.5);
    doc.line(10, (5 + imgHeight / 2) + 30 , pageWidth - 10, (5 + imgHeight / 2) + 30);

    const yBase = imgHeight + 10; // un poco debajo de la imagen + espacio
    const margenIzquierdo = 10;
    const margenDerecho = pageWidth - 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    
    doc.text("Alambrados Prix (SRL)", margenIzquierdo, yBase);
    doc.text(`Fecha: ${fechaStr}`, margenDerecho, yBase, { align: "right" });

    const yLinea2 = yBase + 7;
    doc.text("Cno. Gral. Belgrano 707, B1876 Bernal Oeste, Provincia de Buenos Aires", margenIzquierdo, yLinea2);
    doc.text("CUIT: XX-XXXXXXXX-X", margenDerecho, yLinea2, { align: "right" });

    const yLinea3 = yLinea2 + 7;
    doc.text("Tel: +54 11 5163 1551 / Whatsapp: +54 11 2308 4556", margenIzquierdo, yLinea3);
    doc.text("alambradosprix@hotmail.com", margenDerecho, yLinea3, { align: "right" });


    // === DETALLE DE LA FACTURA ===

    const tableResult = autoTable(doc, {
        startY: yLinea3 + 10, // después de los datos de encabezado
        margin: { top: yLinea3 + 10, left: 10, right: 10 },
        head: [["Descripción", "Cantidad", "Precio unitario", "Total"]],
        body: carrito.map(item => [
            item.Descripcion,
            item.Cantidad.toString(),
            item["Precio unitario"],
            item.Total
            ]),
            styles: {
            fontSize: 10,
            cellPadding: 3,
            },
            headStyles: {
            fillColor: [245, 245, 245],
            textColor: 0,
            fontStyle: 'bold'
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
            },
            alternateRowStyles: { 
                fillColor: [255, 255, 255] }
            
    });

    
    const finalY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY || 0;
      
    // Agregar el texto debajo
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Los precios son de referencia al momento de la creación del presupuesto y podrán ser ajustados, sin previo aviso (la fecha es especificada en el encabezado de este documento).",
      14, // x
      finalY + 10, // y
      { maxWidth: 180 } // para que se haga salto de línea si es necesario
    );


    //footer 
    const totalPages = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
    
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const footerText = `Página: ${i} / ${totalPages}`;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(footerText, pageWidth - 10, pageHeight - 10, { align: "right" });
    }



    // Guardar el PDF
    doc.save(`presupuesto_${nombreCliente}_${fechaStr}.pdf`);
}
