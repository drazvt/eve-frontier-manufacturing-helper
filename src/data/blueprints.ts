export interface Blueprint {
  id: string;
  name: string;
  category: string;
  time: string;
  inputs: { name: string; amount: number; canManufacture?: boolean; blueprintId?: string }[];
  outputs: { name: string; amount: number }[];
  printerType: string;
}

export const blueprints: Blueprint[] = [
  {
    id: '1',
    name: 'CARBON WEAVE',
    category: 'Materials',
    time: '17s',
    inputs: [
      { name: 'Carbon Fiber', amount: 10 },
      { name: 'Synthetic Polymers', amount: 5 }
    ],
    outputs: [{ name: 'Carbon Weave', amount: 1 }],
    printerType: 'Material Processor'
  },
  {
    id: '2',
    name: 'REINFORCED ALLOYS',
    category: 'Materials',
    time: '19s',
    inputs: [
      { name: 'Iron Ore', amount: 20 },
      { name: 'Titanium Ore', amount: 8 },
      { name: 'Chromium', amount: 3 }
    ],
    outputs: [{ name: 'Reinforced Alloys', amount: 1 }],
    printerType: 'Material Processor'
  },
  {
    id: '3',
    name: 'THERMAL COMPOSITES',
    category: 'Materials',
    time: '20s',
    inputs: [
      { name: 'Ceramic Compounds', amount: 12 },
      { name: 'Heat-Resistant Fibers', amount: 6 }
    ],
    outputs: [{ name: 'Thermal Composites', amount: 1 }],
    printerType: 'Material Processor'
  },
  {
    id: '4',
    name: 'PRINTED CIRCUITS',
    category: 'Electronics',
    time: '38s',
    inputs: [
      { name: 'Silicon Wafers', amount: 15 },
      { name: 'Copper Wire', amount: 25 },
      { name: 'Gold Traces', amount: 2 }
    ],
    outputs: [{ name: 'Printed Circuits', amount: 1 }],
    printerType: 'Electronics Fabricator'
  },
  {
    id: '5',
    name: 'ADVANCED CIRCUITS',
    category: 'Electronics',
    time: '1m 15s',
    inputs: [
      { name: 'Printed Circuits', amount: 3, canManufacture: true, blueprintId: '4' },
      { name: 'Rare Earth Elements', amount: 8 },
      { name: 'Platinum Connectors', amount: 4 }
    ],
    outputs: [{ name: 'Advanced Circuits', amount: 1 }],
    printerType: 'Electronics Fabricator'
  },
  {
    id: '6',
    name: 'NOMAD PROGRAM FRAME',
    category: 'Electronics',
    time: '1m 23s',
    inputs: [
      { name: 'Advanced Circuits', amount: 25, canManufacture: true, blueprintId: '5' },
      { name: 'Quantum Crystals', amount: 3 }
    ],
    outputs: [{ name: 'Nomad Program Frame', amount: 1 }],
    printerType: 'Electronics Fabricator'
  },
  {
    id: '7',
    name: 'HULL PLATES',
    category: 'Ship Components',
    time: '45s',
    inputs: [
      { name: 'Reinforced Alloys', amount: 8, canManufacture: true, blueprintId: '2' },
      { name: 'Carbon Weave', amount: 4, canManufacture: true, blueprintId: '1' },
      { name: 'Structural Foam', amount: 6 }
    ],
    outputs: [{ name: 'Hull Plates', amount: 1 }],
    printerType: 'Material Processor'
  },
  {
    id: '8',
    name: 'SOJOURN',
    category: 'Ships',
    time: '39s',
    inputs: [
      { name: 'Hull Plates', amount: 50, canManufacture: true, blueprintId: '7' },
      { name: 'Navigation Crystals', amount: 2 }
    ],
    outputs: [{ name: 'Sojourn Ship', amount: 1 }],
    printerType: 'Ship Assembly Plant'
  },
  {
    id: '9',
    name: 'SHIP COMPONENTS',
    category: 'Ship Components',
    time: '1m 30s',
    inputs: [
      { name: 'Advanced Circuits', amount: 10, canManufacture: true, blueprintId: '5' },
      { name: 'Hull Plates', amount: 15, canManufacture: true, blueprintId: '7' },
      { name: 'Thermal Composites', amount: 8, canManufacture: true, blueprintId: '3' },
      { name: 'Fusion Cores', amount: 1 }
    ],
    outputs: [{ name: 'Ship Components', amount: 1 }],
    printerType: 'Ship Assembly Plant'
  },
  {
    id: '10',
    name: 'REFLEX',
    category: 'Ships',
    time: '1m',
    inputs: [
      { name: 'Ship Components', amount: 30, canManufacture: true, blueprintId: '9' },
      { name: 'Warp Drive Crystals', amount: 5 }
    ],
    outputs: [{ name: 'Reflex Ship', amount: 1 }],
    printerType: 'Ship Assembly Plant'
  },
  {
    id: '11',
    name: 'ARMOR PLATING',
    category: 'Defense Components',
    time: '1m 10s',
    inputs: [
      { name: 'Reinforced Alloys', amount: 20, canManufacture: true, blueprintId: '2' },
      { name: 'Thermal Composites', amount: 12, canManufacture: true, blueprintId: '3' },
      { name: 'Ablative Coating', amount: 8 }
    ],
    outputs: [{ name: 'Armor Plating', amount: 1 }],
    printerType: 'Defense Systems Forge'
  },
  {
    id: '12',
    name: 'BULKY ARMOR PLATES II',
    category: 'Defense',
    time: '2m 35s',
    inputs: [
      { name: 'Armor Plating', amount: 40, canManufacture: true, blueprintId: '11' },
      { name: 'Reinforcement Mesh', amount: 15 }
    ],
    outputs: [{ name: 'Bulky Armor Plates II', amount: 1 }],
    printerType: 'Defense Systems Forge'
  },
  {
    id: '13',
    name: 'SHIELD COMPONENTS',
    category: 'Defense Components',
    time: '2m',
    inputs: [
      { name: 'Advanced Circuits', amount: 15, canManufacture: true, blueprintId: '5' },
      { name: 'Energy Crystals', amount: 8 },
      { name: 'Plasma Conduits', amount: 12 }
    ],
    outputs: [{ name: 'Shield Components', amount: 1 }],
    printerType: 'Defense Systems Forge'
  },
  {
    id: '14',
    name: 'BULWARK SHIELD GENERATOR II',
    category: 'Defense',
    time: '3m 27s',
    inputs: [
      { name: 'Shield Components', amount: 35, canManufacture: true, blueprintId: '13' },
      { name: 'Power Cores', amount: 5 }
    ],
    outputs: [{ name: 'Bulwark Shield Generator II', amount: 1 }],
    printerType: 'Defense Systems Forge'
  },
  {
    id: '15',
    name: 'SYNTHETIC MINING LENS',
    category: 'Mining',
    time: '30s',
    inputs: [
      { name: 'Synthetic Crystals', amount: 10 },
      { name: 'Optical Polymers', amount: 8 }
    ],
    outputs: [{ name: 'Synthetic Mining Lens', amount: 1 }],
    printerType: 'Industrial Fabricator'
  },
  {
    id: '16',
    name: 'LASER COMPONENTS',
    category: 'Mining Components',
    time: '1m 20s',
    inputs: [
      { name: 'Advanced Circuits', amount: 8, canManufacture: true, blueprintId: '5' },
      { name: 'Focusing Crystals', amount: 4 },
      { name: 'Laser Diodes', amount: 12 }
    ],
    outputs: [{ name: 'Laser Components', amount: 1 }],
    printerType: 'Industrial Fabricator'
  },
  {
    id: '17',
    name: 'MINING LASER ARRAY',
    category: 'Mining',
    time: '45s',
    inputs: [
      { name: 'Laser Components', amount: 20, canManufacture: true, blueprintId: '16' },
      { name: 'Targeting Systems', amount: 3 }
    ],
    outputs: [{ name: 'Mining Laser Array', amount: 1 }],
    printerType: 'Industrial Fabricator'
  },
  {
    id: '18',
    name: 'QUANTUM PROCESSOR',
    category: 'Electronics',
    time: '2m 15s',
    inputs: [
      { name: 'Advanced Circuits', amount: 12, canManufacture: true, blueprintId: '5' },
      { name: 'Quantum Materials', amount: 6 },
      { name: 'Superconductors', amount: 4 }
    ],
    outputs: [{ name: 'Quantum Processor', amount: 1 }],
    printerType: 'Electronics Fabricator'
  }
];