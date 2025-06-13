# EVE Frontier Manufacturing Helper - Data Format Specification

This document outlines the data format requirements for integrating real game data into the manufacturing helper application.

## Blueprint Data Format

```typescript
interface Blueprint {
  id: string;          // Unique identifier for the blueprint
  name: string;        // Display name of the blueprint
  category: string;    // Category (e.g., "Materials", "Electronics", "Ships")
  time: string;        // Manufacturing time (e.g., "17s", "1m 30s")
  inputs: {            // Required materials
    name: string;      // Material name
    amount: number;    // Required quantity
    canManufacture?: boolean;  // Whether this material can be manufactured
    blueprintId?: string;      // ID of the blueprint to manufacture this material
  }[];
  outputs: {           // Produced items
    name: string;      // Item name
    amount: number;    // Produced quantity
  }[];
  printerType: string; // Type of printer required (e.g., "Material Processor", "Electronics Fabricator")
}
```

## Printer Types Format

```typescript
interface PrinterType {
  id: string;          // Unique identifier for the printer type
  name: string;        // Display name of the printer
  blueprints: Blueprint[];  // List of blueprints that can be manufactured
}
```

## Asteroid Mining Data Format

```typescript
interface AsteroidMining {
  [materialName: string]: string[];  // Map of material names to asteroid types
}
```

## Data Extraction Guidelines

1. **Blueprint IDs**:
   - Must be unique across all blueprints
   - Should be consistent between inputs and outputs
   - Recommended format: numeric strings (e.g., "1", "2", "3")

2. **Time Format**:
   - Use "s" for seconds (e.g., "17s")
   - Use "m" for minutes (e.g., "1m 30s")
   - Use "h" for hours (e.g., "2h 15m")

3. **Categories**:
   - Materials
   - Electronics
   - Ship Components
   - Ships
   - Defense Components
   - Defense
   - Mining

4. **Printer Types**:
   - Material Processor
   - Electronics Fabricator
   - Ship Assembly Plant
   - Defense Systems Forge
   - Industrial Fabricator

## Integration Steps

1. Extract game data into JSON format matching the above specifications
2. Create a new file in `src/data/` for the real data
3. Update the `DataService` class to use the real data:
   ```typescript
   // In dataService.ts
   private async fetchRealBlueprints(): Promise<Blueprint[]> {
     // Load and parse your real data here
     return realBlueprints;
   }
   ```
4. Set `useMockData` to `false` when ready to switch

## Validation

Before switching to real data, ensure:
1. All required fields are present
2. IDs are unique and consistent
3. Time formats are correct
4. Categories and printer types match the expected values
5. All referenced blueprints exist (for manufacturable inputs)

## Example Data

```json
{
  "id": "1",
  "name": "CARBON WEAVE",
  "category": "Materials",
  "time": "17s",
  "inputs": [
    { "name": "Carbon Fiber", "amount": 10 },
    { "name": "Synthetic Polymers", "amount": 5 }
  ],
  "outputs": [
    { "name": "Carbon Weave", "amount": 1 }
  ],
  "printerType": "Material Processor"
}
``` 