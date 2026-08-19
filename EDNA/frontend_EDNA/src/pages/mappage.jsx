import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  X,
  Info,
  MapPin,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react";
import "./mappage.css";

export default function MapPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    novel: true,
    old: true,
    zones: true,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSpeciesList, setShowSpeciesList] = useState(false);

  // Mock data with accurate coordinates and enhanced information
  const novelSpecies = [
    {
      id: "NS001",
      name: "ASV_001",
      lat: 25.05,
      lon: -135.25,
      color: "#FF6B6B", // Red color for this species
      score: 0.89,
      description: "A novel marine species discovered near Los Angeles coast.",
      confidence: 0.92,
      samples: 15,
      depth: "4500m",
      habitat: "Benthic zone",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Cnidaria",
        class: "Anthozoa",
        order: "Unknown",
        family: "Unknown",
        genus: "Unknown",
        species: "Unknown",
      },
      characteristics: [
        "Bioluminescent properties observed",
        "Unique tentacle structure with 12 arms",
        "Estimated size: 15-20cm diameter",
        "Found near hydrothermal vents",
      ],
      environmentalConditions: {
        temperature: "2-4°C",
        salinity: "35 ppt",
        pH: "7.5-7.8",
        oxygenLevel: "Low (2-3 mg/L)",
      },
      researchNotes:
        "Shows remarkable adaptation to low-oxygen environments. DNA analysis suggests divergence from known species approximately 2 million years ago.",
      conservationStatus: "Data Deficient - Requires further study",
      relatedPublications: [
        "Marine Biology Letters, 2024, Vol 45, pp 123-135",
        "Deep Sea Research Part I, 2024, In Press",
      ],
    },
    {
      id: "NS002",
      name: "ASV_002",
      lat: 1.3521,
      lon: 103.8198,
      color: "#eadb11ff", // Teal color for this species
      score: 0.67,
      description: "Freshwater eDNA candidate discovered in Singapore rivers.",
      confidence: 0.87,
      samples: 23,
      depth: "2-5m",
      habitat: "Freshwater river system",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Arthropoda",
        class: "Malacostraca",
        order: "Decapoda",
        family: "Unknown",
        genus: "Unknown",
        species: "Unknown",
      },
      characteristics: [
        "Microscopic crustacean (0.5-1mm)",
        "Transparent body with blue pigmentation",
        "Rapid reproduction cycle (7 days)",
        "Filter feeder specializing in microalgae",
      ],
      environmentalConditions: {
        temperature: "25-28°C",
        salinity: "0.5 ppt",
        pH: "6.5-7.5",
        dissolvedOxygen: "6-8 mg/L",
      },
      researchNotes:
        "First discovered through environmental DNA sampling. Live specimens captured after 6 months of targeted searching. Shows potential as bioindicator species for water quality.",
      conservationStatus:
        "Critically Endangered - Habitat under urban development pressure",
      relatedPublications: [
        "Freshwater Biology, 2023, Vol 68, pp 890-902",
        "Environmental DNA, 2023, Vol 5, Issue 4",
      ],
    },
    {
      id: "NS003",
      name: "ASV_003",
      lat: 59.47, // London's botanical gardens (Kew Gardens)
      lon: -8.295, // London's botanical gardens (Kew Gardens)
      color: "#45B7D1", // Blue color for this species
      score: 0.92,
      description:
        "Soil eDNA sample novel taxon in London's botanical gardens.",
      confidence: 0.95,
      samples: 8,
      depth: "10-30cm below surface",
      habitat: "Temperate soil ecosystem",
      taxonomy: {
        kingdom: "Fungi",
        phylum: "Ascomycota",
        class: "Unknown",
        order: "Unknown",
        family: "Unknown",
        genus: "Uknown",
        species: "Unknown",
      },
      characteristics: [
        "Mycorrhizal fungus with unique spore structure",
        "Forms symbiotic relationships with oak trees",
        "Produces novel antimicrobial compounds",
        "Fruiting bodies appear after heavy rainfall",
      ],
      environmentalConditions: {
        temperature: "10-18°C",
        moisture: "60-80%",
        pH: "6.0-7.0",
        soilType: "Loamy with high organic content",
      },
      researchNotes:
        "Discovered through metagenomic analysis of soil samples. Produces compounds with potential pharmaceutical applications. Forms extensive underground networks spanning up to 100m².",
      conservationStatus: "Vulnerable - Limited to specific soil conditions",
      relatedPublications: [
        "Nature Microbiology, 2025, Advance Online",
        "Soil Biology and Biochemistry, 2025, Vol 180",
      ],
    },
  ];

  const oldSpecies = [
    {
      id: "OS101",
      name: "Known Species",
      lat: 35.6895,
      lon: 139.6917,
      score: 0.34,
      depth: "0-50m",
      habitat: "Coastal waters",
      description: "Common coastal species found in Tokyo Bay",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Mollusca",
        class: "Gastropoda",
        order: "Neogastropoda",
        family: "Muricidae",
        genus: "Knownus",
        species: "species",
      },
      conservationStatus: "Least Concern",
      populationTrend: "Stable",
    },
    {
      id: "OS102",
      name: "Familiaria aquaticus",
      lat: -33.8688,
      lon: 151.2093,
      score: 0.78,
      depth: "Intertidal zone",
      habitat: "Rocky shores",
      description: "Well-studied species from Sydney Harbor",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Echinodermata",
        class: "Asteroidea",
        order: "Forcipulatida",
        family: "Asteriidae",
        genus: "Familiaria",
        species: "aquaticus",
      },
      conservationStatus: "Near Threatened",
      populationTrend: "Decreasing due to ocean acidification",
    },
  ];

  const protectedZones = [
    {
      id: "PZ1",
      name: "Marine Protected Area A",
      polygon: [
        [24.8, -135.5],
        [24.8, -135.0],
        [25.3, -135.0],
        [25.3, -135.5],
      ],

      area: "125 km²",
      established: 2015,
      depth: "0-500m",
      protectionLevel: "No-take zone",
      managedBy: "California Department of Fish and Wildlife",
      keySpecies: [
        "California sea lion",
        "Giant kelp forests",
        "Garibaldi (state fish)",
        "Novel species NS001",
      ],
      regulations: [
        "No fishing or harvesting",
        "Limited research permits required",
        "No anchoring in sensitive areas",
        "Seasonal restrictions for marine mammal breeding",
      ],
      monitoringPrograms: [
        "Quarterly biodiversity surveys",
        "Continuous water quality monitoring",
        "Annual eDNA sampling",
      ],
    },
    {
      id: "PZ2",
      name: "Reserve B",
      polygon: [
        [1.2, 103.5],
        [1.2, 104.0],
        [1.7, 104.0],
        [1.7, 103.5],
      ],
      area: "87 km²",
      established: 2018,
      depth: "0-20m",
      protectionLevel: "Multiple use - restricted activities",
      managedBy: "Singapore National Parks Board",
      keySpecies: [
        "Mangrove ecosystems",
        "Horseshoe crabs",
        "Novel species NS002",
        "Migratory shorebirds",
      ],
      regulations: [
        "Sustainable fishing only",
        "No industrial development",
        "Ecotourism permitted with guides",
        "Speed limits for boats",
      ],
      monitoringPrograms: [
        "Monthly water quality testing",
        "Bi-annual species census",
        "Continuous eDNA monitoring station",
      ],
    },
  ];

  // Filter species based on search
  const filteredNovel = novelSpecies.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOld = oldSpecies.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowSidebar(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const foundNovel = novelSpecies.find((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const foundOld = oldSpecies.find((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const found = foundNovel || foundOld;
    if (found) {
      handleMarkerClick(found, foundNovel ? "novel" : "old");
    }
  };

  const toggleFilter = (filterType) => {
    setFilters((prev) => ({ ...prev, [filterType]: !prev[filterType] }));
  };

  // Convert lat/lon to pixel position on the map
  const getMarkerPosition = (lat, lon) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const handleSpeciesLocationClick = (species, type) => {
    handleMarkerClick(species, type);
    const markerId = `marker-${species.id}`;
    const markerElement = document.getElementById(markerId);
    if (markerElement) {
      markerElement.classList.add("marker-glow");
      setTimeout(() => {
        markerElement.classList.remove("marker-glow");
      }, 3000);
    }
  };

  return (
    <div className="map-page">
      {/* Header Section */}
      <header className="map-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="page-title">Discovery Map</h1>
            <p className="page-subtitle">
              Visualize novel species discoveries across geography & explore
              protection zones
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="map-main-content">
        {/* Top Controls Bar */}
        <div className="controls-bar">
          <div className="controls-wrapper">
            {/* Search */}
            <form className="search-box" onSubmit={handleSearch}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>

            {/* Filters Dropdown */}
            <div className="dropdown-container">
              <button
                className="dropdown-trigger"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown
                  size={16}
                  className={`chevron ${showFilters ? "rotate" : ""}`}
                />
              </button>
              {showFilters && (
                <div className="dropdown-menu">
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      checked={filters.novel}
                      onChange={() => toggleFilter("novel")}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-dot novel"></span>
                    <span>Novel Species ({novelSpecies.length})</span>
                  </label>
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      checked={filters.old}
                      onChange={() => toggleFilter("old")}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-dot old"></span>
                    <span>Historic Species ({oldSpecies.length})</span>
                  </label>
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      checked={filters.zones}
                      onChange={() => toggleFilter("zones")}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-zone"></span>
                    <span>Protected Zones ({protectedZones.length})</span>
                  </label>
                </div>
              )}
            </div>

            {/* Species List Dropdown */}
            <div className="dropdown-container">
              <button
                className="dropdown-trigger"
                onClick={() => setShowSpeciesList(!showSpeciesList)}
              >
                <MapPin size={18} />
                <span>Species Locations</span>
                <ChevronDown
                  size={16}
                  className={`chevron ${showSpeciesList ? "rotate" : ""}`}
                />
              </button>
              {showSpeciesList && (
                <div className="dropdown-menu species-menu">
                  {filters.novel &&
                    filteredNovel.map((species) => (
                      <div
                        key={species.id}
                        className="species-item"
                        onClick={() =>
                          handleSpeciesLocationClick(species, "novel")
                        }
                      >
                        <span className="species-dot novel"></span>
                        <div className="species-info">
                          <div className="species-name">{species.name}</div>
                          <div className="species-coords">
                            {species.lat.toFixed(2)}°, {species.lon.toFixed(2)}°
                          </div>
                        </div>
                      </div>
                    ))}
                  {filters.old &&
                    filteredOld.map((species) => (
                      <div
                        key={species.id}
                        className="species-item"
                        onClick={() =>
                          handleSpeciesLocationClick(species, "old")
                        }
                      >
                        <span className="species-dot old"></span>
                        <div className="species-info">
                          <div className="species-name">{species.name}</div>
                          <div className="species-coords">
                            {species.lat.toFixed(2)}°, {species.lon.toFixed(2)}°
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="legend-inline">
              <span className="legend-title">Legend:</span>
              <div className="legend-items">
                {novelSpecies.map((species) => (
                  <div key={species.id} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: species.color }}
                    ></span>
                    <span>{species.name}</span>
                  </div>
                ))}
                <div className="legend-item">
                  <span className="legend-dot old"></span>
                  <span>Known</span>
                </div>
                <div className="legend-item">
                  <span className="legend-zone"></span>
                  <span>Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="map-viewport">
          <div className="map-canvas">
            {/* Map Background */}
            <div
              className="map-background"
              style={{
                backgroundImage: `url('/assets/images/world-map.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="map-grid"></div>

              {/* Species Markers */}
              {filters.novel &&
                filteredNovel.map((species) => {
                  const position = getMarkerPosition(species.lat, species.lon);
                  return (
                    <div
                      key={species.id}
                      id={`marker-${species.id}`}
                      className="map-marker novel-marker"
                      style={{
                        left: position.x,
                        top: position.y,
                      }}
                      onClick={() => handleMarkerClick(species, "novel")}
                    >
                      <div
                        className="marker-pin novel"
                        style={{ "--marker-color": species.color }}
                      >
                        <div className="pin-inner"></div>
                        <div className="pin-pulse"></div>
                      </div>
                      <div className="marker-tooltip">{species.name}</div>
                    </div>
                  );
                })}

              {filters.old &&
                filteredOld.map((species) => {
                  const position = getMarkerPosition(species.lat, species.lon);
                  return (
                    <div
                      key={species.id}
                      id={`marker-${species.id}`}
                      className="map-marker old-marker"
                      style={{
                        left: position.x,
                        top: position.y,
                      }}
                      onClick={() => handleMarkerClick(species, "old")}
                    >
                      <div className="marker-pin old">
                        <div className="pin-inner"></div>
                      </div>
                      <div className="marker-tooltip">{species.name}</div>
                    </div>
                  );
                })}

              {/* Protected Zones */}
              {filters.zones &&
                protectedZones.map((zone) => {
                  const position = getMarkerPosition(
                    zone.polygon[0][0],
                    zone.polygon[0][1]
                  );
                  return (
                    <div
                      key={zone.id}
                      className="protected-zone"
                      style={{
                        left: position.x,
                        top: position.y,
                      }}
                      onClick={() => handleMarkerClick(zone, "zone")}
                    >
                      <div className="zone-area"></div>
                      <div className="zone-label">{zone.name}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Info Sidebar */}
      <div className={`info-sidebar ${showSidebar ? "open" : ""}`}>
        <button className="sidebar-close" onClick={() => setShowSidebar(false)}>
          <X size={20} />
        </button>

        {selectedItem && (
          <div className="sidebar-content">
            <div className="sidebar-header">
              <div className={`sidebar-icon ${selectedItem.type}`}>
                {selectedItem.type === "zone" ? (
                  <Shield size={24} />
                ) : selectedItem.type === "novel" ? (
                  <MapPin size={24} />
                ) : (
                  <Clock size={24} />
                )}
              </div>
              <div>
                <h3>{selectedItem.name}</h3>
                <p className="sidebar-id">{selectedItem.id}</p>
              </div>
            </div>

            <div className="sidebar-body">
              {selectedItem.type === "zone" ? (
                <>
                  <div className="info-item">
                    <span className="info-label">Area</span>
                    <span className="info-value">{selectedItem.area}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Depth Range</span>
                    <span className="info-value">{selectedItem.depth}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Established</span>
                    <span className="info-value">
                      {selectedItem.established}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Protection Level</span>
                    <span className="info-value">
                      {selectedItem.protectionLevel}
                    </span>
                  </div>
                  <div className="info-section">
                    <h4>Key Species</h4>
                    <ul className="info-list">
                      {selectedItem.keySpecies?.map((species, idx) => (
                        <li key={idx}>{species}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn-action">
                    Suggest Monitoring Program
                  </button>
                </>
              ) : (
                <>
                  {selectedItem.description && (
                    <p className="species-description">
                      {selectedItem.description}
                    </p>
                  )}

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Novelty Score</span>
                      <span className="info-value">{selectedItem.score}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Depth</span>
                      <span className="info-value">{selectedItem.depth}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Habitat</span>
                      <span className="info-value">{selectedItem.habitat}</span>
                    </div>
                    {selectedItem.confidence && (
                      <div className="info-item">
                        <span className="info-label">Confidence Score</span>
                        <span className="info-value">
                          {(selectedItem.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {selectedItem.samples && (
                      <div className="info-item">
                        <span className="info-label">Sample Count</span>
                        <span className="info-value">
                          {selectedItem.samples}
                        </span>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="info-label">Conservation Status</span>
                      <span className="info-value status-badge">
                        {selectedItem.conservationStatus}
                      </span>
                    </div>
                  </div>

                  {selectedItem.taxonomy && (
                    <div className="info-section">
                      <h4>Taxonomic Classification</h4>
                      <div className="taxonomy-list">
                        {Object.entries(selectedItem.taxonomy).map(
                          ([rank, name]) => (
                            <div key={rank} className="taxonomy-item">
                              <span className="taxonomy-rank">
                                {rank.charAt(0).toUpperCase() + rank.slice(1)}:
                              </span>
                              <span
                                className={`taxonomy-name ${
                                  name === "Unknown" ? "unknown" : ""
                                }`}
                              >
                                {name}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedItem.characteristics && (
                    <div className="info-section">
                      <h4>Possible Characteristics</h4>
                      <ul className="info-list">
                        {selectedItem.characteristics.map((char, idx) => (
                          <li key={idx}>{char}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.environmentalConditions && (
                    <div className="info-section">
                      <h4>Environmental Conditions</h4>
                      <div className="conditions-grid">
                        {Object.entries(
                          selectedItem.environmentalConditions
                        ).map(([key, value]) => (
                          <div key={key} className="condition-item">
                            <span className="condition-label">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="condition-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.researchNotes && (
                    <div className="info-section">
                      <h4>Research Notes</h4>
                      <p className="research-notes">
                        {selectedItem.researchNotes}
                      </p>
                    </div>
                  )}

                  <button className="btn-action">View Detailed Analysis</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
