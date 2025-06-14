import { blueprints as mockBlueprints } from '../data/blueprints';
import { createPrinterTypes } from '../data/printerTypes';
import { asteroidMining } from '../data/asteroidMining';
import { Blueprint, PrinterType } from '../types';
import { DataTransformer } from './dataTransformer';
import rawBlueprints from '../data/blueprints.json';

export class DataServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DataServiceError';
  }
}

// This will be replaced with real data fetching when available
class DataService {
  private useMockData: boolean = false;
  private isLoading: boolean = false;
  private error: DataServiceError | null = null;
  private dataTransformer: DataTransformer;
  private cachedBlueprints: Blueprint[] | null = null;

  constructor() {
    this.dataTransformer = new DataTransformer({});
  }

  setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
    this.cachedBlueprints = null;
  }

  getLoadingState(): boolean {
    return this.isLoading;
  }

  getError(): DataServiceError | null {
    return this.error;
  }

  private async handleDataFetch<T>(fetchFn: () => Promise<T>): Promise<T> {
    this.isLoading = true;
    this.error = null;
    
    try {
      const result = await fetchFn();
      return result;
    } catch (error) {
      this.error = new DataServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'FETCH_ERROR'
      );
      throw this.error;
    } finally {
      this.isLoading = false;
    }
  }

  // Get all blueprints
  async getBlueprints(): Promise<Blueprint[]> {
    return this.handleDataFetch(async () => {
      if (this.useMockData) {
        return mockBlueprints;
      }

      if (this.cachedBlueprints) {
        return this.cachedBlueprints;
      }

      this.cachedBlueprints = await this.dataTransformer.transformBlueprints(rawBlueprints);
      return this.cachedBlueprints;
    });
  }

  // Get printer types
  async getPrinterTypes(): Promise<PrinterType[]> {
    return this.handleDataFetch(async () => {
      const blueprints = await this.getBlueprints();
      return createPrinterTypes(blueprints);
    });
  }

  // Get asteroid mining data
  async getAsteroidMining() {
    return this.handleDataFetch(async () => {
      if (this.useMockData) {
        return asteroidMining;
      }
      // TODO: Replace with real asteroid mining data
      return asteroidMining;
    });
  }

  // Get a single blueprint by ID
  async getBlueprintById(id: string): Promise<Blueprint | undefined> {
    return this.handleDataFetch(async () => {
      const blueprints = await this.getBlueprints();
      return blueprints.find(bp => bp.id === id);
    });
  }

  // Get blueprints by category
  async getBlueprintsByCategory(category: string): Promise<Blueprint[]> {
    return this.handleDataFetch(async () => {
      const blueprints = await this.getBlueprints();
      return blueprints.filter(bp => bp.category === category);
    });
  }

  // Get blueprints by printer type
  async getBlueprintsByPrinterType(printerType: string): Promise<Blueprint[]> {
    return this.handleDataFetch(async () => {
      const blueprints = await this.getBlueprints();
      return blueprints.filter(bp => bp.printerType === printerType);
    });
  }
}

// Export a singleton instance
export const dataService = new DataService(); 