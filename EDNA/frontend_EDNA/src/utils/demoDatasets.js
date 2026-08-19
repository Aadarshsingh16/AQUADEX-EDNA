// Pre-configured test cases / sample datasets for eDNA exploration

export const DEMO_DATASETS = [
  {
    id: "demo-abyssal",
    title: "Abyssal Plain 4,000m eDNA Survey",
    subtitle: "Deep benthic sediment eDNA survey capturing rare piezophilic archaea and uncultured deep-sea microfauna.",
    tag: "Deep Benthic",
    marker: "16S rRNA",
    readType: "Short reads",
    depth: "4,120m",
    location: "Clarion-Clipperton Zone (13.14° N, 126.85° W)",
    readsCount: "142,850 reads",
    date: "2026-03-14",
    summaryMetrics: [
      { label: "% ASVs assigned per rank", value: "94.2%" },
      { label: "Shannon Diversity", value: "4.82" },
      { label: "Simpson Diversity", value: "0.94" },
      { label: "# Novel ASVs detected", value: "14" }
    ],
    noveltyTable: [
      {
        id: "ASV_ABYSSAL_001",
        noveltyScore: "0.94",
        vaeloss: "0.88",
        faissDist: "0.92",
        epaAnnotation: "Uncultured Deep-Sea Archaeon",
        diamondHit: "No",
        abundance: 342,
        depth: 4120,
        location: "Pacific CCZ Station A1"
      },
      {
        id: "ASV_ABYSSAL_007",
        noveltyScore: "0.87",
        vaeloss: "0.79",
        faissDist: "0.84",
        epaAnnotation: "Piezophilic Gammaproteobacterium nov.",
        diamondHit: "No",
        abundance: 215,
        depth: 4150,
        location: "Pacific CCZ Station A2"
      },
      {
        id: "ASV_ABYSSAL_012",
        noveltyScore: "0.82",
        vaeloss: "0.74",
        faissDist: "0.79",
        epaAnnotation: "Novel Euryarchaeota Marine Group II",
        diamondHit: "No",
        abundance: 189,
        depth: 4090,
        location: "Pacific CCZ Station A1"
      },
      {
        id: "ASV_ABYSSAL_025",
        noveltyScore: "0.61",
        vaeloss: "0.55",
        faissDist: "0.58",
        epaAnnotation: "Alphaproteobacteria deep clade",
        diamondHit: "Yes",
        abundance: 512,
        depth: 4120,
        location: "Pacific CCZ Station A3"
      },
      {
        id: "ASV_ABYSSAL_041",
        noveltyScore: "0.44",
        vaeloss: "0.38",
        faissDist: "0.41",
        epaAnnotation: "Actinomycetota candidate",
        diamondHit: "Yes",
        abundance: 920,
        depth: 4100,
        location: "Pacific CCZ Station A2"
      }
    ],
    artifacts: [
      { filename: "abundance_matrix.csv", url: "#", size: 524288 },
      { filename: "novelty_scores.csv", url: "#", size: 104857 },
      { filename: "taxonomy_assignments.tsv", url: "#", size: 314572 },
      { filename: "umap_clusters.png", url: "#", size: 1204857 },
      { filename: "report.html", url: "#", size: 2048576 }
    ],
    qcChartData: {
      retained: 96.2,
      removed: 3.8,
      qualityStats: { q20: 99.1, q30: 96.8, gc: 46.2 }
    },
    alphaData: [
      { sample: "CCZ-Station A1", richness: 142, shannon: 4.82, simpson: 0.94 },
      { sample: "CCZ-Station A2", richness: 128, shannon: 4.65, simpson: 0.92 },
      { sample: "CCZ-Station A3", richness: 156, shannon: 4.91, simpson: 0.95 }
    ],
    betaData: {
      pcoaPoints: [
        { id: "Station A1", x: 0.28, y: 0.15 },
        { id: "Station A2", x: -0.12, y: 0.32 },
        { id: "Station A3", x: 0.18, y: -0.24 }
      ],
      heatmapData: [
        { id: "Station A1", data: [{ x: "Station A1", y: 0 }, { x: "Station A2", y: 0.24 }, { x: "Station A3", y: 0.31 }] },
        { id: "Station A2", data: [{ x: "Station A1", y: 0.24 }, { x: "Station A2", y: 0 }, { x: "Station A3", y: 0.38 }] },
        { id: "Station A3", data: [{ x: "Station A1", y: 0.31 }, { x: "Station A2", y: 0.38 }, { x: "Station A3", y: 0 }] }
      ]
    },
    taxonomyData: {
      sankeyData: {
        nodes: [
          { id: "Archaea" },
          { id: "Bacteria" },
          { id: "Euryarchaeota" },
          { id: "Gammaproteobacteria" },
          { id: "Piezophilic Clades" },
          { id: "Unclassified Deep" }
        ],
        links: [
          { source: "Archaea", target: "Euryarchaeota", value: 35 },
          { source: "Bacteria", target: "Gammaproteobacteria", value: 45 },
          { source: "Gammaproteobacteria", target: "Piezophilic Clades", value: 30 },
          { source: "Archaea", target: "Unclassified Deep", value: 15 }
        ]
      },
      stackedBarData: [
        { sample: "Station A1", Euryarchaeota: 38, Gammaproteobacteria: 42, Planctomycetes: 12, Unclassified: 8 },
        { sample: "Station A2", Euryarchaeota: 32, Gammaproteobacteria: 48, Planctomycetes: 14, Unclassified: 6 },
        { sample: "Station A3", Euryarchaeota: 40, Gammaproteobacteria: 40, Planctomycetes: 10, Unclassified: 10 }
      ]
    }
  },
  {
    id: "demo-hydrothermal",
    title: "Mariana Hydrothermal Vent Microbiome",
    subtitle: "Extremophilic community from active black smoker chimney walls rich in chemolithoautotrophic sulfur oxidizers.",
    tag: "Hydrothermal Vent",
    marker: "16S rRNA / COI",
    readType: "Long reads (Nanopore)",
    depth: "2,750m",
    location: "Mariana Arc Vent Field (18.25° N, 144.73° E)",
    readsCount: "215,400 reads",
    date: "2026-04-02",
    summaryMetrics: [
      { label: "% ASVs assigned per rank", value: "89.6%" },
      { label: "Shannon Diversity", value: "3.45" },
      { label: "Simpson Diversity", value: "0.81" },
      { label: "# Novel ASVs detected", value: "28" }
    ],
    noveltyTable: [
      {
        id: "ASV_VENT_101",
        noveltyScore: "0.96",
        vaeloss: "0.92",
        faissDist: "0.95",
        epaAnnotation: "Chemolithoautotrophic Sulfur Oxidizer nov.",
        diamondHit: "No",
        abundance: 1420,
        depth: 2750,
        location: "Mariana Chimney Alpha"
      },
      {
        id: "ASV_VENT_108",
        noveltyScore: "0.91",
        vaeloss: "0.86",
        faissDist: "0.89",
        epaAnnotation: "Hyperthermophilic Methanogenic Archaeon",
        diamondHit: "No",
        abundance: 890,
        depth: 2750,
        location: "Mariana Chimney Alpha"
      },
      {
        id: "ASV_VENT_204",
        noveltyScore: "0.88",
        vaeloss: "0.81",
        faissDist: "0.85",
        epaAnnotation: "Deep Vent Tubeworm Symbiont Clade",
        diamondHit: "No",
        abundance: 670,
        depth: 2780,
        location: "Mariana Vent Plume B"
      },
      {
        id: "ASV_VENT_219",
        noveltyScore: "0.74",
        vaeloss: "0.69",
        faissDist: "0.71",
        epaAnnotation: "Campylobacterota vent candidate",
        diamondHit: "Yes",
        abundance: 1100,
        depth: 2750,
        location: "Mariana Chimney Beta"
      },
      {
        id: "ASV_VENT_302",
        noveltyScore: "0.52",
        vaeloss: "0.48",
        faissDist: "0.50",
        epaAnnotation: "Aquificae thermophile",
        diamondHit: "Yes",
        abundance: 2300,
        depth: 2740,
        location: "Mariana Vent Plume A"
      }
    ],
    artifacts: [
      { filename: "vent_abundance.csv", url: "#", size: 680000 },
      { filename: "novelty_candidates.csv", url: "#", size: 210000 },
      { filename: "diamond_hits.tsv", url: "#", size: 450000 },
      { filename: "report.html", url: "#", size: 2150000 }
    ],
    qcChartData: {
      retained: 92.4,
      removed: 7.6,
      qualityStats: { q20: 97.4, q30: 94.1, gc: 54.8 }
    },
    alphaData: [
      { sample: "Chimney Wall", richness: 98, shannon: 3.45, simpson: 0.81 },
      { sample: "Plume Center", richness: 115, shannon: 3.82, simpson: 0.85 },
      { sample: "Ambient Background", richness: 165, shannon: 4.95, simpson: 0.94 }
    ],
    betaData: {
      pcoaPoints: [
        { id: "Chimney Wall", x: 0.45, y: -0.10 },
        { id: "Plume Center", x: 0.15, y: 0.35 },
        { id: "Ambient Background", x: -0.42, y: -0.22 }
      ],
      heatmapData: [
        { id: "Chimney Wall", data: [{ x: "Chimney Wall", y: 0 }, { x: "Plume Center", y: 0.52 }, { x: "Ambient", y: 0.81 }] },
        { id: "Plume Center", data: [{ x: "Chimney Wall", y: 0.52 }, { x: "Plume Center", y: 0 }, { x: "Ambient", y: 0.64 }] },
        { id: "Ambient", data: [{ x: "Chimney Wall", y: 0.81 }, { x: "Plume Center", y: 0.64 }, { x: "Ambient", y: 0 }] }
      ]
    },
    taxonomyData: {
      sankeyData: {
        nodes: [
          { id: "Bacteria" },
          { id: "Campylobacterota" },
          { id: "Sulfur-Oxidizers" },
          { id: "Thermococcales" },
          { id: "Archaeoglobales" }
        ],
        links: [
          { source: "Bacteria", target: "Campylobacterota", value: 50 },
          { source: "Campylobacterota", target: "Sulfur-Oxidizers", value: 40 },
          { source: "Bacteria", target: "Thermococcales", value: 25 },
          { source: "Campylobacterota", target: "Archaeoglobales", value: 15 }
        ]
      },
      stackedBarData: [
        { sample: "Chimney Wall", Campylobacterota: 55, Aquificae: 25, Thermococcus: 15, Unclassified: 5 },
        { sample: "Plume Center", Campylobacterota: 40, Aquificae: 30, Thermococcus: 20, Unclassified: 10 },
        { sample: "Ambient", Campylobacterota: 15, Aquificae: 10, Thermococcus: 5, Unclassified: 70 }
      ]
    }
  },
  {
    id: "demo-coral-twilight",
    title: "Mesopelagic Twilight Zone Biodiversity",
    subtitle: "Midwater pelagic eDNA sampling focused on gelatinous zooplankton, novel radiolarians, and micro-eukaryotes.",
    tag: "Pelagic Twilight",
    marker: "18S rRNA / COI",
    readType: "Short reads",
    depth: "650m",
    location: "Coral Sea Basin (17.52° S, 151.38° E)",
    readsCount: "98,600 reads",
    date: "2026-05-18",
    summaryMetrics: [
      { label: "% ASVs assigned per rank", value: "97.1%" },
      { label: "Shannon Diversity", value: "5.12" },
      { label: "Simpson Diversity", value: "0.96" },
      { label: "# Novel ASVs detected", value: "8" }
    ],
    noveltyTable: [
      {
        id: "ASV_MESO_004",
        noveltyScore: "0.89",
        vaeloss: "0.83",
        faissDist: "0.87",
        epaAnnotation: "Cryptic Siphonophore candidate clade",
        diamondHit: "No",
        abundance: 145,
        depth: 650,
        location: "Coral Sea Station T1"
      },
      {
        id: "ASV_MESO_019",
        noveltyScore: "0.84",
        vaeloss: "0.78",
        faissDist: "0.81",
        epaAnnotation: "Deep Eukaryotic Radiolaria nov.",
        diamondHit: "No",
        abundance: 310,
        depth: 680,
        location: "Coral Sea Station T2"
      },
      {
        id: "ASV_MESO_033",
        noveltyScore: "0.68",
        vaeloss: "0.62",
        faissDist: "0.65",
        epaAnnotation: "Novel Ctenophore deep lineage",
        diamondHit: "Yes",
        abundance: 580,
        depth: 640,
        location: "Coral Sea Station T1"
      },
      {
        id: "ASV_MESO_050",
        noveltyScore: "0.55",
        vaeloss: "0.49",
        faissDist: "0.51",
        epaAnnotation: "Bioluminescent Dinoflagellate symbiont",
        diamondHit: "Yes",
        abundance: 1250,
        depth: 650,
        location: "Coral Sea Station T3"
      }
    ],
    artifacts: [
      { filename: "eukaryotic_abundance.csv", url: "#", size: 412000 },
      { filename: "siphonophore_alignments.tsv", url: "#", size: 190000 },
      { filename: "report.html", url: "#", size: 1890000 }
    ],
    qcChartData: {
      retained: 98.1,
      removed: 1.9,
      qualityStats: { q20: 99.5, q30: 98.1, gc: 43.1 }
    },
    alphaData: [
      { sample: "Twilight 500m", richness: 168, shannon: 5.12, simpson: 0.96 },
      { sample: "Twilight 650m", richness: 154, shannon: 4.98, simpson: 0.95 },
      { sample: "Twilight 800m", richness: 142, shannon: 4.85, simpson: 0.94 }
    ],
    betaData: {
      pcoaPoints: [
        { id: "500m Depth", x: -0.22, y: 0.28 },
        { id: "650m Depth", x: 0.05, y: -0.15 },
        { id: "800m Depth", x: 0.32, y: 0.12 }
      ],
      heatmapData: [
        { id: "500m", data: [{ x: "500m", y: 0 }, { x: "650m", y: 0.28 }, { x: "800m", y: 0.44 }] },
        { id: "650m", data: [{ x: "500m", y: 0.28 }, { x: "650m", y: 0 }, { x: "800m", y: 0.22 }] },
        { id: "800m", data: [{ x: "500m", y: 0.44 }, { x: "650m", y: 0.22 }, { x: "800m", y: 0 }] }
      ]
    },
    taxonomyData: {
      sankeyData: {
        nodes: [
          { id: "Eukaryota" },
          { id: "Cnidaria" },
          { id: "Hydrozoa" },
          { id: "Radiolaria" },
          { id: "Polycystinea" }
        ],
        links: [
          { source: "Eukaryota", target: "Cnidaria", value: 45 },
          { source: "Cnidaria", target: "Hydrozoa", value: 35 },
          { source: "Eukaryota", target: "Radiolaria", value: 30 },
          { source: "Radiolaria", target: "Polycystinea", value: 25 }
        ]
      },
      stackedBarData: [
        { sample: "500m", Hydrozoa: 42, Radiolaria: 28, Dinoflagellates: 18, Others: 12 },
        { sample: "650m", Hydrozoa: 38, Radiolaria: 34, Dinoflagellates: 16, Others: 12 },
        { sample: "800m", Hydrozoa: 30, Radiolaria: 40, Dinoflagellates: 14, Others: 16 }
      ]
    }
  }
];

export const getDemoDatasetById = (id) => {
  return DEMO_DATASETS.find(d => d.id === id) || DEMO_DATASETS[0];
};
