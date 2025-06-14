export interface RawBlueprint {
  blueprintTypeID: number;
  maxProductionLimit: number;
  manufacturing_materials?: {
    quantity: number;
    typeID: number;
  }[];
  manufacturing_products?: {
    quantity: number;
    typeID: number;
  }[];
  manufacturing_time?: number;
}

export interface RawBlueprintData {
  [blueprintId: string]: RawBlueprint;
}

export interface TypeMapping {
  [typeId: number]: {
    name: string;
    category: string;
    printerType: string;
  };
}

export interface TypeInfo {
  id: number;
  name: string;
  description: string;
  mass: number;
  radius: number;
  volume: number;
  portionSize: number;
  groupName: string;
  groupId: number;
  categoryName: string;
  categoryId: number;
  iconUrl: string;
}

export interface TypesData {
  [typeId: string]: TypeInfo;
} 