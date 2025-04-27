// src/components/PDFGenerator.js
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function PDFGenerator({ title, data, columns, filename, children }) {
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    setLoading(true);

    const doc = new jsPDF();
    // header text
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // build the table head & body
    const head = [columns.map(col => col.header)];
    const body = data.map(row => columns.map(col => row[col.field]));

    doc.autoTable({
      startY: 28,
      head,
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [243, 244, 246], textColor: [107, 114, 128], fontStyle: 'bold' },
    });

    // save the PDF
    doc.save(`${filename}.pdf`);
    setLoading(false);
  };

  return children({ loading, generatePDF });
}