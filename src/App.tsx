import React, { useState, useRef, useEffect } from 'react';
import { dataService, DataServiceError } from './services/dataService';
import { Blueprint, PrinterType, MineralTotal } from './types';

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eve-orange mx-auto"></div>
      <p className="mt-4 text-gray-300">Loading manufacturing data...</p>
    </div>
  </div>
);

// Error state component
const ErrorState = ({ error }: { error: DataServiceError }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center p-6 bg-eve-border bg-opacity-20 rounded-lg">
      <h2 className="text-red-400 text-xl mb-2">Error Loading Data</h2>
      <p className="text-gray-300 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-eve-orange text-black rounded hover:bg-opacity-80 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

function App() {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [expandedPrinters, setExpandedPrinters] = useState<Set<string>>(new Set());
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [printerTypes, setPrinterTypes] = useState<PrinterType[]>([]);
  const [asteroidMiningData, setAsteroidMiningData] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<DataServiceError | null>(null);

  // Refs
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [loadedBlueprints, loadedPrinterTypes, loadedAsteroidMining] = await Promise.all([
          dataService.getBlueprints(),
          dataService.getPrinterTypes(),
          dataService.getAsteroidMining()
        ]);
        setBlueprints(loadedBlueprints);
        setPrinterTypes(loadedPrinterTypes);
        setAsteroidMiningData(loadedAsteroidMining);
      } catch (err) {
        setError(err instanceof DataServiceError ? err : new DataServiceError('Failed to load data', 'LOAD_ERROR'));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Scroll indicator effect
  useEffect(() => {
    const checkScrollIndicator = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const hasOverflow = element.scrollHeight > element.clientHeight;
        const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
        setShowScrollIndicator(hasOverflow && !isAtBottom);
      }
    };

    checkScrollIndicator();
    
    const handleScroll = () => {
      checkScrollIndicator();
    };

    const handleResize = () => {
      checkScrollIndicator();
    };

    if (contentRef.current) {
      contentRef.current.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [expandedPrinters, selectedBlueprint]);

  // Click outside effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setFocusedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const filteredBlueprints = blueprints.filter(blueprint =>
    blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blueprint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blueprint.printerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suggestions = searchTerm.length > 0 ? filteredBlueprints.slice(0, 5) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    setFocusedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestionIndex >= 0) {
          selectBlueprint(suggestions[focusedSuggestionIndex]);
        } else if (suggestions.length > 0) {
          selectBlueprint(suggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedSuggestionIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  const selectBlueprint = (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setSearchTerm(blueprint.name);
    setShowSuggestions(false);
    setFocusedSuggestionIndex(-1);
  };

  const togglePrinterExpansion = (printerId: string) => {
    setExpandedPrinters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(printerId)) {
        newSet.delete(printerId);
      } else {
        newSet.add(printerId);
      }
      return newSet;
    });
  };

  const findBlueprintById = (id: string): Blueprint | undefined => {
    return blueprints.find(bp => bp.id === id);
  };

  const handleSearchFocus = () => {
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };

  const renderTreeLine = (isLast: boolean, hasChildren: boolean) => {
    if (isLast) {
      return hasChildren ? '└─ ' : '└─ ';
    } else {
      return hasChildren ? '├─ ' : '├─ ';
    }
  };

  const renderDependencyTree = (blueprint: Blueprint, depth: number = 0, isLast: boolean = true, prefix: string = ''): JSX.Element => {
    if (depth > 5) return <div className="text-xs text-gray-500 font-mono">... (max depth reached)</div>;
    
    return (
      <div className="font-mono text-sm tracking-wider">
        {blueprint.inputs.map((input, index) => {
          const dependentBlueprint = input.blueprintId ? findBlueprintById(input.blueprintId) : null;
          const isLastInput = index === blueprint.inputs.length - 1;
          const hasManufacturableChild = input.canManufacture && dependentBlueprint;
          
          const currentPrefix = depth === 0 ? '' : prefix + (isLast ? '    ' : '│   ');
          const treeSymbol = renderTreeLine(isLastInput, hasManufacturableChild);
          
          return (
            <div key={index} className="text-gray-300">
              <div className="flex items-center hover:bg-eve-border hover:bg-opacity-30 rounded px-2 py-1 transition-colors">
                <span className="text-gray-500 select-none tracking-widest">{currentPrefix}{treeSymbol}</span>
                <span className={`mr-2 tracking-wide ${input.canManufacture ? 'text-blue-400' : 'text-yellow-400'}`}>
                  {input.name}
                </span>
                <span className="text-eve-orange font-bold mr-2 tracking-wider">×{input.amount}</span>
                
                {dependentBlueprint && (
                  <span className="text-xs text-gray-400 tracking-wide">({dependentBlueprint.time} • {dependentBlueprint.printerType})</span>
                )}
              </div>
              
              {hasManufacturableChild && (
                <div className="ml-0">
                  {renderDependencyTree(dependentBlueprint, depth + 1, isLastInput, currentPrefix)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate total minerals needed for a blueprint
  const calculateMineralTotals = (blueprint: Blueprint, multiplier: number = 1): Map<string, number> => {
    const mineralTotals = new Map<string, number>();

    const addMinerals = (bp: Blueprint, mult: number) => {
      bp.inputs.forEach(input => {
        if (input.canManufacture && input.blueprintId) {
          // This is a manufacturable component, recurse into its dependencies
          const dependentBlueprint = findBlueprintById(input.blueprintId);
          if (dependentBlueprint) {
            addMinerals(dependentBlueprint, mult * input.amount);
          }
        } else {
          // This is a raw mineral/material
          const currentAmount = mineralTotals.get(input.name) || 0;
          mineralTotals.set(input.name, currentAmount + (input.amount * mult));
        }
      });
    };

    addMinerals(blueprint, multiplier);
    return mineralTotals;
  };

  const getMineralTotalsArray = (blueprint: Blueprint): MineralTotal[] => {
    const mineralMap = calculateMineralTotals(blueprint);
    return Array.from(mineralMap.entries())
      .map(([name, totalAmount]) => ({ name, totalAmount }))
      .sort((a, b) => b.totalAmount - a.totalAmount); // Sort by quantity descending
  };

  // Update the mineral display section
  const renderMineralInfo = (mineral: MineralTotal) => (
    <tr key={mineral.name} className="border-b border-eve-border">
      <td className="py-3 px-4 text-gray-300">{mineral.name}</td>
      <td className="py-3 px-4 text-right text-eve-orange font-bold tracking-wider">×{mineral.totalAmount.toLocaleString()}</td>
      <td className="py-3 px-4 text-gray-300 text-xs tracking-wide">
        {asteroidMiningData[mineral.name] ? asteroidMiningData[mineral.name].join(', ') : 'Unknown'}
      </td>
    </tr>
  );

  return (
    <div 
      className="min-h-screen text-white font-mono relative"
      style={{
        backgroundImage: 'url(/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 h-screen overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-eve-orange mb-2 drop-shadow-lg title-spacing tracking-ultra-wide">EVE FRONTIER</h1>
            <h2 className="text-xl text-gray-300 drop-shadow-md tracking-widest">MANUFACTURING HELPER</h2>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="relative mb-6">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search blueprints..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-4 py-3 bg-eve-gray bg-opacity-90 border border-eve-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-eve-orange focus:ring-1 focus:ring-eve-orange relative z-10 backdrop-blur-sm tracking-wider"
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-eve-gray bg-opacity-95 border border-eve-border border-t-0 rounded-b-lg shadow-lg z-20 max-h-80 overflow-y-auto backdrop-blur-sm"
              >
                {suggestions.map((blueprint, index) => (
                  <div
                    key={blueprint.id}
                    onClick={() => selectBlueprint(blueprint)}
                    className={`p-3 border-b border-eve-border cursor-pointer hover:bg-eve-border hover:bg-opacity-80 transition-colors ${
                      index === focusedSuggestionIndex ? 'bg-eve-border bg-opacity-80 border-l-4 border-l-eve-orange' : ''
                    } ${index === suggestions.length - 1 ? 'border-b-0 rounded-b-lg' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm tracking-wide">{blueprint.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 tracking-wide">
                          <span>{blueprint.category}</span>
                          <span>•</span>
                          <span>{blueprint.time}</span>
                          <span>•</span>
                          <span className="text-eve-orange">{blueprint.printerType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Printer Types - Narrower */}
            <div className="lg:col-span-1">
              <div className="bg-eve-gray bg-opacity-90 border border-eve-border rounded-lg backdrop-blur-sm">
                <div className="p-4 border-b border-eve-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-eve-orange tracking-widest">PRINTER TYPES</h3>
                  </div>
                  <p className="text-sm text-gray-400 tracking-wide">{printerTypes.length} printer types available</p>
                </div>
                <div>
                  {printerTypes.map((printer) => (
                    <div key={printer.id} className="border-b border-eve-border last:border-b-0">
                      <div
                        onClick={() => togglePrinterExpansion(printer.id)}
                        className="p-4 cursor-pointer hover:bg-eve-border hover:bg-opacity-60 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm tracking-wide">{printer.name}</h4>
                              <p className="text-xs text-gray-400 tracking-wide">{printer.blueprints.length} blueprints</p>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            {expandedPrinters.has(printer.id) ? '▲' : '▼'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Dropdown Content */}
                      {expandedPrinters.has(printer.id) && (
                        <div className="px-4 pt-2 pb-4 bg-eve-dark bg-opacity-50">
                          <div className="space-y-2">
                            {printer.blueprints.map((blueprint) => (
                              <div
                                key={blueprint.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectBlueprint(blueprint);
                                }}
                                className="p-2 bg-eve-gray bg-opacity-60 rounded border border-eve-border cursor-pointer hover:bg-eve-border hover:bg-opacity-80 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-xs tracking-wide">{blueprint.name}</h5>
                                    <div className="flex items-center space-x-2 text-xs text-gray-400 tracking-wide">
                                      <span>{blueprint.category}</span>
                                      <span>•</span>
                                      <span>{blueprint.time}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Manufacturing Tree - Wider */}
            <div className="lg:col-span-3">
              {selectedBlueprint ? (
                <div className="bg-eve-gray bg-opacity-90 border border-eve-border rounded-lg backdrop-blur-sm">
                  {/* Blueprint Header */}
                  <div className="p-6 border-b border-eve-border">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-eve-orange tracking-widest">{selectedBlueprint.name}</h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1 tracking-wide">
                          <span>{selectedBlueprint.category}</span>
                          <span>•</span>
                          <span>Manufacturing Time: {selectedBlueprint.time}</span>
                          <span>•</span>
                          <span className="text-eve-orange">Requires: {selectedBlueprint.printerType}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-300 mt-2 tracking-wide">
                          <span>Produces: {selectedBlueprint.outputs.map(o => `${o.amount}x ${o.name}`).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manufacturing Tree - Full Width */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-eve-orange mb-6 flex items-center space-x-2 tracking-widest">
                      <span>MANUFACTURING DEPENDENCY TREE</span>
                    </h3>
                    
                    <div className="bg-eve-dark bg-opacity-80 rounded border border-eve-border p-6 overflow-x-auto mb-6">
                      <div className="font-mono text-lg text-gray-300 mb-4 pb-3 border-b border-eve-border tracking-wider">
                        <span className="text-eve-orange font-bold">{selectedBlueprint.name}</span>
                        <span className="text-gray-400 ml-2">({selectedBlueprint.time} • {selectedBlueprint.printerType})</span>
                      </div>
                      
                      <div className="text-base leading-relaxed">
                        {renderDependencyTree(selectedBlueprint)}
                      </div>
                      
                      {selectedBlueprint.inputs.length === 0 && (
                        <div className="text-gray-400 font-mono text-sm italic tracking-wide">
                          └─ No manufacturing dependencies (uses raw materials only)
                        </div>
                      )}

                      {/* Legend */}
                      <div className="mt-6 pt-4 border-t border-eve-border">
                        <h4 className="text-sm font-semibold text-eve-orange mb-3 tracking-widest">LEGEND</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs tracking-wide">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">●</span>
                            <span className="text-gray-300">Manufacturable Component</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">●</span>
                            <span className="text-gray-300">Raw Mineral/Material</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mineral Totals Table */}
                    {(() => {
                      const mineralTotals = getMineralTotalsArray(selectedBlueprint);
                      return mineralTotals.length > 0 && (
                        <div className="bg-eve-dark bg-opacity-80 rounded border border-eve-border p-6">
                          <h3 className="text-xl font-semibold text-eve-orange mb-4 flex items-center space-x-2 tracking-widest">
                            <span>TOTAL MINERAL REQUIREMENTS</span>
                          </h3>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full font-mono tracking-wider">
                              <thead>
                                <tr className="border-b border-eve-border">
                                  <th className="text-left py-3 px-4 text-eve-orange font-semibold tracking-widest">MINERAL/MATERIAL</th>
                                  <th className="text-right py-3 px-4 text-eve-orange font-semibold tracking-widest">TOTAL QUANTITY</th>
                                  <th className="text-left py-3 px-4 text-eve-orange font-semibold tracking-widest">ASTEROID TYPES</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mineralTotals.map(renderMineralInfo)}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-eve-gray bg-opacity-90 border border-eve-border rounded-lg p-12 text-center backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-gray-400 mb-2 tracking-widest">Select a Blueprint</h3>
                  <p className="text-gray-500 tracking-wide">Choose a blueprint from the printer types or use the search bar to explore manufacturing dependencies and requirements.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <div className="text-center">
            <p className="text-gray-300 text-sm font-mono animate-pulse tracking-widest">scroll down for more</p>
            <div className="flex justify-center mt-1">
              <div className="text-gray-300 animate-bounce">▼</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;