import { blueprints } from '../data/blueprints';
import { createPrinterTypes } from '../data/printerTypes';
import { asteroidMining } from '../data/asteroidMining';
import { Blueprint, PrinterType } from '../types';

export class DataServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DataServiceError';
  }
}

// This will be replaced with real data fetching when available
class DataService {
  private useMockData: boolean = true;
  private isLoading: boolean = false;
  private error: DataServiceError | null = null;

  // Toggle between mock and real data
  setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
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
        return blueprints;
      }
      // TODO: Replace with real data fetching
      // return await fetchRealBlueprints();
      return blueprints;
    });
  }

  // Get printer types
  async getPrinterTypes(): Promise<PrinterType[]> {
    return this.handleDataFetch(async () => {
      if (this.useMockData) {
        return createPrinterTypes(blueprints);
      }
      // TODO: Replace with real data fetching
      // return await fetchRealPrinterTypes();
      return createPrinterTypes(blueprints);
    });
  }

  // Get asteroid mining data
  async getAsteroidMining() {
    return this.handleDataFetch(async () => {
      if (this.useMockData) {
        return asteroidMining;
      }
      // TODO: Replace with real data fetching
      // return await fetchRealAsteroidMining();
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