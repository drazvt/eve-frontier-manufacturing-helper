import { Blueprint } from '../types';
import { RawBlueprintData, TypeMapping } from '../types/rawData';
import { typeService } from './typeService';
import { printerMapper } from './printerMapper';

export class DataTransformer {
  private typeMapping: TypeMapping;

  constructor(typeMapping: TypeMapping) {
    this.typeMapping = typeMapping;
  }

  private formatTime(seconds: number): string {
    if (!seconds) return '0s';
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  private async getTypeInfo(typeId: number) {
    // Get type info from the API
    const typeInfo = await typeService.getTypeInfo(typeId);
    const name = typeInfo?.name || `Unknown Item (${typeId})`;
    const category = typeInfo?.categoryName || 'Unknown';
    
    return {
      name,
      category
    };
  }

  async transformBlueprints(rawData: RawBlueprintData): Promise<Blueprint[]> {
    // First, ensure we have all the type data
    await typeService.fetchAllTypes();

    return Promise.all(Object.entries(rawData)
      .filter(([_, blueprint]) => 
        blueprint.manufacturing_products && 
        blueprint.manufacturing_products.length > 0
      )
      .map(async ([id, blueprint]) => {
        const productInfo = await this.getTypeInfo(blueprint.manufacturing_products![0].typeID);
        
        const inputs = await Promise.all((blueprint.manufacturing_materials || []).map(async material => {
          const materialInfo = await this.getTypeInfo(material.typeID);
          return {
            name: materialInfo.name,
            amount: material.quantity,
            canManufacture: true, // This should be determined by checking if the material has a blueprint
            blueprintId: Object.entries(rawData).find(([_, bp]) => 
              bp.manufacturing_products?.some(p => p.typeID === material.typeID)
            )?.[0]
          };
        }));

        const outputs = await Promise.all((blueprint.manufacturing_products || []).map(async product => {
          const productInfo = await this.getTypeInfo(product.typeID);
          return {
            name: productInfo.name,
            amount: product.quantity
          };
        }));
        
        // Get printer type from the blueprint's typeID
        const printerType = printerMapper.getPrinterType(blueprint.blueprintTypeID);
        
        return {
          id: blueprint.blueprintTypeID.toString(), // Use blueprintTypeID as the ID
          name: productInfo.name,
          category: productInfo.category,
          time: this.formatTime(blueprint.manufacturing_time || 0),
          inputs,
          outputs,
          printerType
        };
      }));
  }
} 