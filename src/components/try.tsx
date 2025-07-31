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
const fecha = new Date();
const fechaStr = fecha.toISOString().slice(0,10);

export function generarInformativoPDF(nombreCliente: string) { 
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // encabezado de la factura

      const margen = 10;
  const headerHeight = 40;

  const sectionWidth = (pageWidth - margen * 2) / 3;
  const leftX = margen;
  const centerX = margen + sectionWidth;
  const rightX = margen + 2 * sectionWidth;   
    
    const imgData = "data:image/jpeg;base64,/9j/4AAQSkZJ...";
    
    const imgHeight = headerHeight;
  const imgWidth = sectionWidth;


  // 🔲 Bordes de prueba
  doc.setDrawColor(0); // Negro
  doc.setLineWidth(0.5);
  doc.rect(leftX, 10, sectionWidth, headerHeight);   // Borde sección izquierda
  doc.rect(centerX, 10, sectionWidth, headerHeight); // Borde sección centro
  doc.rect(rightX, 10, sectionWidth, headerHeight);  // Borde sección derecha


  // 📸 Sección izquierda: Imagen
  doc.addImage(imgData, "PNG", leftX, 10, imgWidth, imgHeight);

  // ❌ Sección centro: Letra X
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(0);
  doc.text("X", centerX + sectionWidth / 2, 25, { align: "center" });

  // 🔲 Borde alrededor de la "X"
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(centerX + sectionWidth / 2 - 7, 13, 14, 16); // x, y, width, height

  // 📝 Sección derecha: texto
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80);

  const rightTextX = rightX + 2; // pequeño desplazamiento
  let y = 15;

  doc.text("DOCUMENTO NO VÁLIDO COMO FACTURA", rightTextX, y, { align: "left" });
  y += 7;
  doc.text("PRESUPUESTO N°25-02031", rightTextX, y, { align: "left" });
  y += 7;
  doc.text("31 DE JULIO DE 2025", rightTextX, y, { align: "left" });

  // 🔻 Línea divisoria después del encabezado
  doc.setDrawColor(150);
  doc.setLineWidth(0.5);
  doc.line(margen, 10 + imgHeight + 5, pageWidth - margen, 10 + imgHeight + 5);

  // Ahora podés continuar con el resto del contenido debajo de ese header
  const yBase = 10 + imgHeight + 10;
      








    

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
