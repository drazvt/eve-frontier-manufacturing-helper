import printersData from '../data/printers.json';

interface Printer {
  typeID: number;
  typeNameID: string;
  includedTypeIDs: number[];
}

interface PrintersData {
  [printerId: string]: Printer;
}

export class PrinterMapper {
  private printerMap: Map<number, string> = new Map();

  constructor() {
    // Create a mapping of typeID to printer name
    Object.values(printersData as PrintersData).forEach(printer => {
      printer.includedTypeIDs.forEach(typeId => {
        this.printerMap.set(typeId, printer.typeNameID);
      });
    });
  }

  getPrinterType(typeId: number): string {
    return this.printerMap.get(typeId) || 'Unknown';
  }
}

// Export a singleton instance
export const printerMapper = new PrinterMapper(); 