export interface Blueprint {
  id: string;
  name: string;
  category: string;
  time: string;
  inputs: { name: string; amount: number; canManufacture?: boolean; blueprintId?: string }[];
  outputs: { name: string; amount: number }[];
  printerType: string;
}

export interface PrinterType {
  id: string;
  name: string;
  blueprints: Blueprint[];
}

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

export interface MineralTotal {
  name: string;
  totalAmount: number;
}
