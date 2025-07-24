import React, { useState, useEffect } from "react";
import "./LandscapePrototype.css";

interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  sunlight: string;
  water: string;
  petSafe: boolean;
  lowMaintenance: boolean;
  description: string;
}

interface PlacedPlant {
  id: string;
  plantId: string;
  x: number;
  y: number;
  plant: Plant;
}

const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    category: "Perennial",
    sunlight: "full",
    water: "low",
    petSafe: true,
    lowMaintenance: true,
    description: "Fragrant purple flowers, drought-tolerant",
  },
  {
    id: "2",
    name: "Rose Bush",
    scientificName: "Rosa hybrid",
    category: "Shrub",
    sunlight: "full",
    water: "medium",
    petSafe: false,
    lowMaintenance: false,
    description: "Classic flowering shrub with thorns",
  },
  {
    id: "3",
    name: "Hosta",
    scientificName: "Hosta plantaginea",
    category: "Perennial",
    sunlight: "shade",
    water: "medium",
    petSafe: true,
    lowMaintenance: true,
    description: "Large leafy plant perfect for shade areas",
  },
  {
    id: "4",
    name: "Japanese Maple",
    scientificName: "Acer palmatum",
    category: "Tree",
    sunlight: "partial",
    water: "medium",
    petSafe: true,
    lowMaintenance: false,
    description: "Beautiful ornamental tree with colorful foliage",
  },
  {
    id: "5",
    name: "Succulent Garden",
    scientificName: "Various species",
    category: "Succulent",
    sunlight: "full",
    water: "low",
    petSafe: false,
    lowMaintenance: true,
    description: "Low-water plants in various shapes and colors",
  },
  {
    id: "6",
    name: "Fern",
    scientificName: "Pteridium aquilinum",
    category: "Perennial",
    sunlight: "shade",
    water: "high",
    petSafe: true,
    lowMaintenance: true,
    description: "Lush green foliage for shaded areas",
  },
];

export default function LandscapePrototype() {
  const [plants] = useState<Plant[]>(mockPlants);
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [growthYear, setGrowthYear] = useState(5);
  const [activeFilters, setActiveFilters] = useState({
    sunlight: [] as string[],
    water: [] as string[],
    features: [] as string[],
  });

  const filteredPlants = plants.filter((plant) => {
    if (
      searchTerm &&
      !plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (
      activeFilters.sunlight.length > 0 &&
      !activeFilters.sunlight.includes(plant.sunlight)
    )
      return false;
    if (
      activeFilters.water.length > 0 &&
      !activeFilters.water.includes(plant.water)
    )
      return false;
    if (
      activeFilters.features.includes("petSafe") &&
      !plant.petSafe
    )
      return false;
    if (
      activeFilters.features.includes("lowMaintenance") &&
      !plant.lowMaintenance
    )
      return false;
    return true;
  });

  const handleFilterToggle = (type: "sunlight"|"water"|"features", value: string) => {
    setActiveFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvas = e.currentTarget;
    canvas.classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    const plant = plants.find((p) => p.id === id);
    if (!plant) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newPlaced: PlacedPlant = {
      id: `placed-${Date.now()}`,
      plantId: id,
      x,
      y,
      plant,
    };
    setPlacedPlants((prev) => [...prev, newPlaced]);
  };

  const removePlant = (id: string) => {
    setPlacedPlants((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    document.addEventListener("dragover", (e) => {
      if (!(e.target as HTMLElement).closest("#canvas")) {
        e.preventDefault();
      }
    });
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
            </svg>
            Grounded
          </div>
          <div className="nav-menu">
            <button className="nav-button">Design</button>
            <button className="nav-button">Plants</button>
            <button className="nav-button">Projects</button>
            <button className="nav-button">Learn</button>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select className="role-selector">
              <option>Homebuyer</option>
              <option>Builder</option>
              <option>Professional</option>
            </select>
            <div className="user-avatar">SJ</div>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <div className="design-canvas">
          <div className="canvas-header">
            <h3 className="canvas-title">Design Canvas</h3>
            <div className="canvas-actions">
              <button className="action-button">Export</button>
              <button className="action-button">Share</button>
            </div>
          </div>
          <div
            className="canvas-area"
            id="canvas"
            onDragOver={allowDrop}
            onDrop={handleDrop}
          >
            {placedPlants.length === 0 && (
              <div className="canvas-placeholder" id="placeholder">
                <svg className="canvas-placeholder-icon" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
                <p>Drag plants here to start designing</p>
              </div>
            )}
            {placedPlants.map((pp) => {
              const scale = 0.5 + (growthYear / 20) * 0.5;
              return (
                <div
                  key={pp.id}
                  className="placed-plant"
                  style={{
                    left: `${pp.x}%`,
                    top: `${pp.y}%`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                  }}
                  onClick={() => removePlant(pp.id)}
                >
                  <div className="plant-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div className="plant-label">{pp.plant.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="plant-catalog">
          <h3 className="catalog-title">Plant Catalog</h3>
          <input
            className="search-input"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Sunlight</label>
              <div className="filter-options">
                {["full", "partial", "shade"].map((val) => (
                  <div
                    key={val}
                    className={`filter-option ${
                      activeFilters.sunlight.includes(val) ? "active" : ""
                    }`}
                    onClick={() => handleFilterToggle("sunlight", val)}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Water Needs</label>
              <div className="filter-options">
                {["low", "medium", "high"].map((val) => (
                  <div
                    key={val}
                    className={`filter-option ${
                      activeFilters.water.includes(val) ? "active" : ""
                    }`}
                    onClick={() => handleFilterToggle("water", val)}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Features</label>
              <div className="filter-options">
                <div
                  className={`filter-option ${
                    activeFilters.features.includes("petSafe") ? "active" : ""
                  }`}
                  onClick={() => handleFilterToggle("features", "petSafe")}
                >
                  Pet Safe
                </div>
                <div
                  className={`filter-option ${
                    activeFilters.features.includes("lowMaintenance")
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleFilterToggle("features", "lowMaintenance")
                  }
                >
                  Low Maintenance
                </div>
              </div>
            </div>
          </div>

          <div className="growth-control">
            <label className="growth-label">Growth Projection</label>
            <input
              type="range"
              className="growth-slider"
              min="1"
              max="20"
              value={growthYear}
              onChange={(e) => setGrowthYear(parseInt(e.target.value))}
            />
            <div className="growth-value">Year {growthYear}</div>
          </div>

          <div className="plant-grid">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className="plant-card"
                draggable
                onDragStart={(e) => handleDragStart(e, plant.id)}
              >
                <div className="plant-name">{plant.name}</div>
                <div className="plant-scientific">{plant.scientificName}</div>
                <div className="plant-features">
                  <div className="plant-feature">{plant.sunlight}</div>
                  <div className="plant-feature">{plant.water}</div>
                  {plant.petSafe && (
                    <div className="plant-feature">Pet Safe</div>
                  )}
                  {plant.lowMaintenance && (
                    <div className="plant-feature">Low Maintenance</div>
                  )}
                </div>
                <div className="plant-description">{plant.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
