import { Blueprint } from './blueprints';
import printersData from './printers.json';

export interface PrinterType {
  id: string;
  name: string;
  blueprints: Blueprint[];
}

// Create printer type configs from the printers.json data
export const printerTypeConfigs = Object.entries(printersData).map(([id, printer]) => ({
  id: printer.typeNameID.toLowerCase().replace(/\s+/g, '-'),
  name: printer.typeNameID,
  includedTypeIDs: printer.includedTypeIDs
}));

export const createPrinterTypes = (blueprints: Blueprint[]): PrinterType[] => {
  return printerTypeConfigs.map(config => ({
    id: config.id,
    name: config.name,
    blueprints: blueprints.filter(bp => {
      // Check if the blueprint's ID is in the printer's includedTypeIDs
      const blueprintId = parseInt(bp.id);
      return config.includedTypeIDs.includes(blueprintId);
    })
  }));
};