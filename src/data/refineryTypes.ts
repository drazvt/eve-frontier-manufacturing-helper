import { Blueprint } from './blueprints';
import refineriesData from './refinery.json';

export interface RefineryType {
  id: string;
  name: string;
  blueprints: Blueprint[];
}

// Create refinery type configs from the refinery.json data
export const refineryTypeConfigs = Object.entries(refineriesData).map(([id, refinery]) => ({
  id: refinery.typeNameID.toLowerCase().replace(/\s+/g, '-'),
  name: refinery.typeNameID,
  includedTypeIDs: refinery.includedTypeIDs
}));

export const createRefineryTypes = (blueprints: Blueprint[]): RefineryType[] => {
  return refineryTypeConfigs.map(config => ({
    id: config.id,
    name: config.name,
    blueprints: blueprints.filter(bp => {
      const blueprintId = parseInt(bp.id);
      return config.includedTypeIDs.includes(blueprintId);
    }).sort((a, b) => a.name.localeCompare(b.name))
  }));
}; 