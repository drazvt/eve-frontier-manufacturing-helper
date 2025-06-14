import { TypeInfo } from '../types/rawData';

interface TypeResponse {
  data: TypeInfo[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class TypeService {
  private baseUrl = 'https://blockchain-gateway-stillness.live.tech.evefrontier.com/v2';
  private cache: Map<number, TypeInfo> = new Map();

  async fetchAllTypes(): Promise<Map<number, TypeInfo>> {
    const limit = 100;
    let offset = 0;
    let total = Infinity;

    while (offset < total) {
      try {
        const response = await fetch(`${this.baseUrl}/types?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TypeResponse = await response.json();
        
        // Update total from first response
        if (total === Infinity) {
          total = data.metadata.total;
        }

        // Cache the types
        data.data.forEach(type => {
          this.cache.set(type.id, type);
        });

        offset += limit;
      } catch (error) {
        console.error('Error fetching types:', error);
        throw error;
      }
    }

    return this.cache;
  }

  async getTypeInfo(typeId: number): Promise<TypeInfo | undefined> {
    // If we have it in cache, return it
    if (this.cache.has(typeId)) {
      return this.cache.get(typeId);
    }

    // If cache is empty, fetch all types
    if (this.cache.size === 0) {
      await this.fetchAllTypes();
      return this.cache.get(typeId);
    }

    // If we have some types but not this one, fetch it individually
    try {
      const response = await fetch(`${this.baseUrl}/types/${typeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const type: TypeInfo = await response.json();
      this.cache.set(typeId, type);
      return type;
    } catch (error) {
      console.error(`Error fetching type ${typeId}:`, error);
      return undefined;
    }
  }

  getCategoryName(typeId: number): string {
    const type = this.cache.get(typeId);
    return type?.categoryName || 'Unknown';
  }

  getGroupName(typeId: number): string {
    const type = this.cache.get(typeId);
    return type?.groupName || 'Unknown';
  }
}

// Export a singleton instance
export const typeService = new TypeService(); 