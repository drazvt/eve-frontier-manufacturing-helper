import { Blueprint } from './blueprints';

export interface PrinterType {
  id: string;
  name: string;
  blueprints: Blueprint[];
}

export const printerTypeConfigs = [
  {
    id: 'material-processor',
    name: 'Material Processor'
  },
  {
    id: 'electronics-fabricator',
    name: 'Electronics Fabricator'
  },
  {
    id: 'ship-assembly',
    name: 'Ship Assembly Plant'
  },
  {
    id: 'defense-forge',
    name: 'Defense Systems Forge'
  },
  {
    id: 'industrial-fabricator',
    name: 'Industrial Fabricator'
  }
];

export const createPrinterTypes = (blueprints: Blueprint[]): PrinterType[] => {
  return printerTypeConfigs.map(config => ({
    ...config,
    blueprints: blueprints.filter(bp => bp.printerType === config.name)
  }));
};