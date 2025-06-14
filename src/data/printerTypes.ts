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
      // The blueprint ID in the transformed data is the blueprintTypeID
      // We need to match it against the includedTypeIDs from printers.json
      const blueprintId = parseInt(bp.id);
      return config.includedTypeIDs.includes(blueprintId);
    }).sort((a, b) => a.name.localeCompare(b.name)) // Sort blueprints by name
  }));
};