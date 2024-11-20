import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface LedgerEntry {
  type: string;
  amount: number;
  date: Date;
  previousBalance: number;
  newBalance: number;
  notes?: string;
}

interface ClientLedger {
  client: {
    name: string;
    status: string;
  };
  totalCredit: number;
  totalPayee: number;
  balance: number;
  entries: LedgerEntry[];
}

export const generateClientLedgerReport = (ledger: ClientLedger) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Client Ledger Report', 105, 15, { align: 'center' });
  
  // Add client info
  doc.setFontSize(12);
  doc.text(`Client: ${ledger.client.name}`, 20, 30);
  doc.text(`Status: ${ledger.client.status}`, 20, 37);
  doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy')}`, 20, 44);
  
  // Add summary
  doc.text('Summary:', 20, 55);
  doc.text(`Total Credit: ${ledger.totalCredit.toFixed(2)}`, 30, 62);
  doc.text(`Total Payée: ${ledger.totalPayee.toFixed(2)}`, 30, 69);
  doc.text(`Current Balance: ${ledger.balance.toFixed(2)}`, 30, 76);
  
  // Add transactions table
  const tableData = ledger.entries.map(entry => [
    format(new Date(entry.date), 'dd/MM/yyyy'),
    entry.type === 'credit' ? 'Credit' : 'Payée',
    entry.amount.toFixed(2),
    entry.previousBalance.toFixed(2),
    entry.newBalance.toFixed(2),
    entry.notes || ''
  ]);
  
  doc.autoTable({
    startY: 85,
    head: [['Date', 'Type', 'Amount', 'Previous', 'New', 'Notes']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const generateMultiClientReport = (summaries: any[]) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Client Balances Summary', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 22, { align: 'center' });
  
  // Add summary table
  const tableData = summaries.map(summary => [
    summary.clientName,
    summary.totalCredit.toFixed(2),
    summary.totalPayee.toFixed(2),
    summary.currentBalance.toFixed(2),
    summary.lastTransaction ? format(new Date(summary.lastTransaction), 'dd/MM/yyyy') : 'N/A'
  ]);
  
  doc.autoTable({
    startY: 30,
    head: [['Client', 'Total Credit', 'Total Payée', 'Balance', 'Last Transaction']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Add totals
  const totals = summaries.reduce((acc, curr) => ({
    totalCredit: acc.totalCredit + curr.totalCredit,
    totalPayee: acc.totalPayee + curr.totalPayee,
    totalBalance: acc.totalBalance + curr.currentBalance
  }), { totalCredit: 0, totalPayee: 0, totalBalance: 0 });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text(`Total Credit: ${totals.totalCredit.toFixed(2)}`, 20, finalY);
  doc.text(`Total Payée: ${totals.totalPayee.toFixed(2)}`, 80, finalY);
  doc.text(`Net Balance: ${totals.totalBalance.toFixed(2)}`, 140, finalY);
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};
