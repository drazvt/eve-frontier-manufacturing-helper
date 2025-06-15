import { Blueprint } from './blueprints';
import refineriesData from './refinery.json';
import { typeService } from '../services/typeService';

export interface RefineryRecipe {
  inputId: string;
  inputName: string;
  outputIds: string[];
  outputNames: string[];
}

export interface RefineryType {
  id: string;
  name: string;
  recipes: RefineryRecipe[];
}

interface RefineryData {
  typeID: number;
  typeNameID: string;
  includedTypeIDs: Array<{
    input: string;
    output: number[];
  }>;
}

interface RefineriesData {
  [key: string]: RefineryData;
}

// Create refinery type configs from the refinery.json data
export const refineryTypeConfigs = Object.keys(refineriesData as RefineriesData)
  .filter(key => key.trim() !== '') // Filter out empty keys
  .map(id => {
    const refinery = (refineriesData as RefineriesData)[id];
    const recipes = refinery.includedTypeIDs.map(recipe => ({
      inputId: recipe.input,
      inputName: '', // Will be populated with getTypeInfo
      outputIds: recipe.output.map(String),
      outputNames: [] // Will be populated with getTypeInfo
    }));

    return {
      id: refinery.typeNameID.toLowerCase().replace(/\s+/g, '-'),
      name: refinery.typeNameID,
      recipes
    }
  });

export const createRefineryTypes = async (): Promise<RefineryType[]> => {
  // First ensure we have all types loaded
  await typeService.fetchAllTypes();

  return Promise.all(refineryTypeConfigs.map(async config => ({
    id: config.id,
    name: config.name,
    recipes: await Promise.all(config.recipes.map(async recipe => {
      const inputType = await typeService.getTypeInfo(parseInt(recipe.inputId));
      const outputTypes = await Promise.all(recipe.outputIds.map(id => typeService.getTypeInfo(parseInt(id))));

      return {
        ...recipe,
        inputName: inputType?.name || `Material ${recipe.inputId}`,
        outputNames: outputTypes.map(type => type?.name || `Material ${recipe.inputId}`)
      };
    }))
  })));
}; 