require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Measurement",
  "esri/widgets/Expand",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/widgets/Home",
  "esri/widgets/Compass",
  "esri/widgets/ScaleBar",
  "esri/widgets/Zoom",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Legend"
], function(
  Map, MapView, GeoJSONLayer, LayerList,
  Search, BasemapToggle, Measurement, Expand,
  Graphic, Locate, Home, Compass, ScaleBar,
  Zoom, BasemapGallery, Legend
) {
  // Show loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // Image mapping for features
  const featureImages = {
    "National Parks": {
      "Jigme Dorji National Park": "images/parks/jigme-dorji.jpg",
      "Royal Manas National Park": "images/parks/royal-manas.jpg",
      "Thrumshingla National Park": "images/parks/thrumshingla.jpg",
      "Bumdeling Wildlife Sanctuary": "images/parks/bumdeling.jpg",
      "Sakteng Wildlife Sanctuary": "images/parks/sakteng.jpg",
      "Jigme Singye Wangchuck National Park": "images/parks/jigme-singye.jpg",
      "Wangchuck Centennial Park": "images/parks/wangchuck.jpg",
      "Phipsoo Wildlife Sanctuary": "images/parks/phipsoo.jpg",
      "Jomotshangk Wildlife Sanctuary": "images/parks/jomotshangka.jpg",
      "Jigme Khesar strict Nature Reserve": "images/parks/jigme-khesar.jpg"
    },
    "Biological Corridors": {
      "BC1": "images/corridors/BC1.jpg",
      "BC2": "images/corridors/BC2.jpg",
      "BC3": "images/corridors/BC3.jpg",
      "BC4": "images/corridors/BC4.jpg",
      "BC5": "images/corridors/BC5.jpg",
      "BC6": "images/corridors/BC6.jpg",
      "BC7": "images/corridors/BC7.jpg",
      "BC8": "images/corridors/BC8.jpg"
    },
    "Districts (Dzongkhag)": {
      "Thimphu": "images/dzongkhag/thimphu.jpg",
      "Paro": "images/dzongkhag/paro.jpg",
      "Punakha": "images/dzongkhag/punakha.jpg",
      "Wangduephodrang": "images/dzongkhag/wangdue.jpg",
      "Chhukha": "images/dzongkhag/chukha.jpg",
      "Haa": "images/dzongkhag/haa.jpg",
      "Samtse": "images/dzongkhag/samtse.jpg",
      "Dagana": "images/dzongkhag/dagana.jpg",
      "Tsirang": "images/dzongkhag/tsirang.jpg",
      "Sarpang": "images/dzongkhag/sarpang.jpg",
      "Trongsa": "images/dzongkhag/trongsa.jpg",
      "Bumthang": "images/dzongkhag/bumthang.jpg",
      "Zhemgang": "images/dzongkhag/zhemgang.jpg",
      "Monggar": "images/dzongkhag/mongar.jpg",
      "Trashigang": "images/dzongkhag/trashigang.jpg",
      "Yangtse": "images/dzongkhag/trashiyangtse.jpg",
      "Lhuentse": "images/dzongkhag/lhuentse.jpg",
      "Pemagatshel": "images/dzongkhag/pemagatshel.jpg",
      "Samdrupjongkhar": "images/dzongkhag/samdrup.jpg",
      "Gasa": "images/dzongkhag/gasa.jpg"
    }
  };

  // National Parks Layer
  const nationalParksLayer = new GeoJSONLayer({
    url: "./data/national_parks.geojson",
    title: "National Parks",
    opacity: 0.8,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [52, 168, 83, 0.7],
        outline: {
          color: [34, 139, 34],
          width: 1.5
        }
      }
    },
    popupEnabled: false,
    outFields: ["*"]
  });

  // Biological Corridors Layer
  const corridorsLayer = new GeoJSONLayer({
    url: "./data/biological_corridors.geojson",
    title: "Biological Corridors",
    opacity: 0.7,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [255, 107, 53, 0.6],
        outline: {
          color: [255, 140, 0],
          width: 1.2
        }
      }
    },
    popupEnabled: false,
    outFields: ["*"]
  });

  // Community Forests Layer
  const communityForestsLayer = new GeoJSONLayer({
    url: "./data/community_forests.geojson",
    title: "Community Forests",
    opacity: 0.75,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [100, 180, 50, 0.7],
        outline: {
          color: [50, 120, 20],
          width: 1.2
        }
      }
    },
    popupEnabled: false,
    outFields: ["*"]
  });

  // District Layer
  const dzongkhagLayer = new GeoJSONLayer({
    url: "./data/dzongkhag.geojson",
    title: "Districts (Dzongkhag)",
    opacity: 0.5,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [100, 100, 100],
          width: 1.5
        }
      }
    },
    popupEnabled: false,
    outFields: ["*"]
  });

  // Subdistrict Layer
  const gewogLayer = new GeoJSONLayer({
    url: "./data/gewog.geojson",
    title: "Subdistricts (Gewog)",
    opacity: 0.4,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [150, 150, 150],
          width: 0.8,
          style: "dash"
        }
      }
    },
    visible: false,
    popupEnabled: false,
    outFields: ["*"]
  });

  // Bhutan Boundary Layer
  const bhutanBoundaryLayer = new GeoJSONLayer({
    url: "./data/bhutan_boundary.geojson",
    title: "National Boundary",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [0, 0, 0],
          width: 2
        }
      }
    },
    popupEnabled: false,
    outFields: ["*"]
  });

  // Create map with all layers
  const map = new Map({
    basemap: "streets-navigation-vector",
    layers: [
      bhutanBoundaryLayer,
      dzongkhagLayer,
      gewogLayer,
      nationalParksLayer,
      corridorsLayer,
      communityForestsLayer
    ]
  });

  // Initialize view with responsive padding
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [90.4, 27.5],
    zoom: 8,
    ui: {
      components: ["attribution"]
    },
    popup: {
      enabled: false
    },
    padding: {
      bottom: isMobile() ? 60 : 0 // Adjust for mobile nav bar
    }
  });

  // Helper function to check mobile devices
  function isMobile() {
    return window.matchMedia("(max-width: 576px)").matches;
  }

  // Add widgets with responsive positioning
  view.ui.add(new Home({ view }), "top-left");
  view.ui.add(new Compass({ view }), "top-left");
  view.ui.add(new ScaleBar({ view, unit: "metric" }), "bottom-left");
  
  // Add Zoom widget
  const zoomWidget = new Zoom({
    view: view,
    layout: "vertical"
  });
  view.ui.add(zoomWidget, "top-left");
  
  // Enhanced Search widget
  const search = new Search({
    view,
    includeDefaultSources: false,
    sources: [{
      layer: dzongkhagLayer,
      searchFields: ["Dzongkhag_Name"],
      displayField: "Dzongkhag_Name",
      exactMatch: false,
      outFields: ["*"],
      name: "Districts",
      placeholder: "Search districts...",
      zoomScale: 50000,
      suggestionTemplate: "{Dzongkhag_Name} District"
    }],
    popupEnabled: false
  });
  view.ui.add(search, "top-right");

  // Enhanced Locate widget
  const locateWidget = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: (view, options) => {
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
    style: "background-color: #fff; color: #0058a3;"
  });
  view.ui.add(locateWidget, "top-left");

  // Measurement tool with expand
  const measurement = new Measurement({
    view: view,
    activeTool: null, // Start with no active tool
    linearUnit: "kilometers",
    areaUnit: "square-kilometers"
  });
  
  // Create buttons for measurement tools
  const measurementContainer = document.createElement("div");
  measurementContainer.className = "measurement-toolbar";
  
  // Distance measurement button
  const distanceBtn = document.createElement("button");
  distanceBtn.className = "measurement-btn";
  distanceBtn.title = "Measure Distance";
  distanceBtn.innerHTML = '<i class="fas fa-ruler"></i>';
  distanceBtn.addEventListener("click", () => {
    measurement.activeTool = "distance";
    clearMeasurementBtns();
    distanceBtn.classList.add("active");
  });
  
  // Area measurement button
  const areaBtn = document.createElement("button");
  areaBtn.className = "measurement-btn";
  areaBtn.title = "Measure Area";
  areaBtn.innerHTML = '<i class="fas fa-ruler-combined"></i>';
  areaBtn.addEventListener("click", () => {
    measurement.activeTool = "area";
    clearMeasurementBtns();
    areaBtn.classList.add("active");
  });
  
  // Clear measurements button
  const clearBtn = document.createElement("button");
  clearBtn.className = "measurement-btn";
  clearBtn.title = "Clear Measurements";
  clearBtn.innerHTML = '<i class="fas fa-trash"></i>';
  clearBtn.addEventListener("click", () => {
    measurement.clear();
    clearMeasurementBtns();
  });
  
  // Helper function to clear active button states
  function clearMeasurementBtns() {
    const btns = measurementContainer.querySelectorAll(".measurement-btn");
    btns.forEach(btn => btn.classList.remove("active"));
  }
  
  // Add buttons to container
  measurementContainer.appendChild(distanceBtn);
  measurementContainer.appendChild(areaBtn);
  measurementContainer.appendChild(clearBtn);
  
  // Create expand widget for measurement tools
  const measurementExpand = new Expand({
    view: view,
    content: measurementContainer,
    expandIconClass: "esri-icon-measure-line",
    expandTooltip: "Measurement Tools",
    expanded: false,
    mode: "floating"
  });
  view.ui.add(measurementExpand, "top-right");

  // Basemap Gallery
  const basemapGallery = new BasemapGallery({
    view: view
  });
  const bgExpand = new Expand({
    view: view,
    content: basemapGallery,
    expandIconClass: "esri-icon-basemap",
    expandTooltip: "Basemap Gallery",
    expanded: false
  });
  view.ui.add(bgExpand, "top-right");

  // Enhanced Layer List with opacity control
  const layerList = new LayerList({
    view: view,
    container: "layerListContainer",
    listItemCreatedFunction: function(event) {
      const item = event.item;
      
      const sliderContainer = document.createElement("div");
      sliderContainer.className = "slider-container";
      
      const sliderLabel = document.createElement("span");
      sliderLabel.className = "slider-label";
      sliderLabel.textContent = "Opacity:";
      
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = 0;
      slider.max = 1;
      slider.step = 0.1;
      slider.value = item.layer.opacity;
      slider.className = "opacity-slider";
      
      slider.addEventListener("input", function() {
        item.layer.opacity = parseFloat(this.value);
      });
      
      sliderContainer.appendChild(sliderLabel);
      sliderContainer.appendChild(slider);
      
      item.panel = {
        content: [ "legend", sliderContainer ],
        open: false
      };
    }
  });

  // Toggle sidebar
  const layerListToggle = document.getElementById("layerListToggle");
  const floatingLayerListToggle = document.getElementById("floatingLayerListToggle");
  const sidebar = document.querySelector(".sidebar");
  
  function toggleSidebar() {
    sidebar.classList.toggle("visible");
    const icon = layerListToggle.querySelector("i");
    icon.classList.toggle("fa-chevron-left");
    icon.classList.toggle("fa-chevron-right");
  }
  
  layerListToggle.addEventListener("click", toggleSidebar);
  floatingLayerListToggle.addEventListener("click", toggleSidebar);

  // Fullscreen toggle
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  fullscreenBtn.addEventListener("click", function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.innerHTML = '<i class="fas fa-expand"></i>';
      }
    }
  });

  // Dashboard elements
  const dashboard = document.getElementById("dashboard");
  const closeBtn = document.getElementById("closeDashboard");

  // Feature selection
  view.on("click", function(event) {
    view.hitTest(event).then(function(response) {
      const results = response.results.filter(result => 
        result.graphic && result.graphic.layer && result.graphic.layer !== bhutanBoundaryLayer
      );
      
      if (results.length > 0) {
        displayFeatureInfo(results[0].graphic);
        showDashboard();
      } else {
        hideDashboard();
      }
    });
  });

  // Close dashboard
  view.on("double-click", hideDashboard);
  view.on("key-down", function(event) {
    if (event.key === "Escape") hideDashboard();
  });
  closeBtn.addEventListener("click", hideDashboard);

  function showDashboard() {
    dashboard.classList.add("visible", "slide-in");
    dashboard.classList.remove("hidden");
  }

  function hideDashboard() {
    dashboard.classList.remove("visible");
    clearHighlight();
    resetFeatureInfo();
  }

  // Feature info display
  function displayFeatureInfo(graphic) {
    const attributes = graphic.attributes;
    const layerTitle = graphic.layer.title;
    const featureName = attributes.Name || attributes.Dzongkhag_Name || attributes.Gewog_Name || "Unnamed Feature";
    
    const displayAttributes = Object.entries(attributes)
      .filter(([key]) => !["OBJECTID", "FID", "Shape__Area", "Shape__Length"].includes(key))
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    // Check if there's an image for this feature
    const imagePath = featureImages[layerTitle] && featureImages[layerTitle][featureName];
    const imageHtml = imagePath 
      ? `<div class="feature-image-container">
           <img src="${imagePath}" alt="${featureName}" class="feature-image">
         </div>`
      : '';
    
    let content = `
      <div class="feature-card">
        <h3>${featureName}</h3>
        <div class="feature-subtitle">${layerTitle}</div>
        ${imageHtml}
        <div class="attributes-container">
    `;
    
    displayAttributes.forEach(([key, value]) => {
      if (key !== "Name" && key !== "Dzongkhag_Name" && key !== "Gewog_Name") {
        content += `
          <div class="attribute-row">
            <div class="attribute-label">${formatLabel(key)}:</div>
            <div class="attribute-value">${formatValue(value, key)}</div>
          </div>
        `;
      }
    });
    
    document.getElementById("featureInfo").innerHTML = content + `</div></div>`;
    highlightFeature(graphic);
  }

  function formatLabel(label) {
    return label
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Km2', 'km²')
      .replace('Ha', 'hectares');
  }

  function formatValue(value, key) {
    if (value === null || value === undefined) return '<span class="na">N/A</span>';
    
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('area') || key.toLowerCase().includes('km2')) {
        return `<span class="number">${value.toLocaleString()}</span> km²`;
      }
      if (key.toLowerCase().includes('ha') || key.toLowerCase().includes('hectare')) {
        return `<span class="number">${value.toLocaleString()}</span> hectares`;
      }
      return `<span class="number">${value.toLocaleString()}</span>`;
    }
    
    if (typeof value === 'string') {
      return value.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    return value;
  }

  function highlightFeature(graphic) {
    clearHighlight();
    const highlightGraphic = new Graphic({
      geometry: graphic.geometry,
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [255, 0, 0],
          width: 3
        }
      }
    });
    view.graphics.add(highlightGraphic);
  }

  function clearHighlight() {
    view.graphics.removeAll();
  }

  function resetFeatureInfo() {
    document.getElementById("featureInfo").innerHTML = `
      <div class="empty-state fade-in">
        <i class="fas fa-mouse-pointer"></i>
        <p>Click on any feature to view details</p>
      </div>
    `;
  }

  // Helper function to calculate total area for a layer
  function calculateLayerArea(layer, areaField) {
    return new Promise((resolve) => {
      layer.queryFeatures({
        outFields: [areaField],
        returnGeometry: false
      }).then(({ features }) => {
        let totalArea = 0;
        features.forEach(feature => {
          if (feature.attributes[areaField]) {
            totalArea += parseFloat(feature.attributes[areaField]);
          }
        });
        resolve(totalArea);
      }).catch(() => {
        resolve(0); // Return 0 if there's an error
      });
    });
  }

  // Statistics calculation
  function calculateStatistics() {
    const stats = {
      totalParks: 0,
      totalCorridors: 0,
      totalForests: 0,
      totalProtectedArea: 0
    };
  
    // Array to hold all our promises
    const promises = [
      nationalParksLayer.queryFeatureCount(),
      corridorsLayer.queryFeatureCount(),
      communityForestsLayer.queryFeatureCount()
    ];
    
    // Add area calculations for each layer
    promises.push(
      calculateLayerArea(nationalParksLayer, "Area"),
      calculateLayerArea(corridorsLayer, "Area"),
      calculateLayerArea(communityForestsLayer, "Area")
    );
  
    Promise.all(promises).then(([parks, corridors, forests, parksArea, corridorsArea, forestsArea]) => {
      stats.totalParks = parks;
      stats.totalCorridors = corridors;
      stats.totalForests = forests;
      
      // Sum up all protected areas
      stats.totalProtectedArea = (parksArea + corridorsArea + forestsArea).toFixed(2);
      
      updateStatisticsPanel(stats);
    }).catch(error => {
      console.error("Error calculating statistics:", error);
      // Fallback values
      stats.totalParks = 10;
      stats.totalCorridors = 9;
      stats.totalForests = 445;
      stats.totalProtectedArea = "16,000"; // Example fallback value
      updateStatisticsPanel(stats);
    });
  }

  function updateStatisticsPanel(stats) {
    const statsGrid = document.querySelector(".stats-grid");
    statsGrid.innerHTML = `
      <div class="stat-item fade-in">
        <div class="stat-label">National Parks</div>
        <div class="stat-value">${stats.totalParks}</div>
      </div>
      <div class="stat-item fade-in" style="animation-delay: 0.1s">
        <div class="stat-label">Biological Corridors</div>
        <div class="stat-value">${stats.totalCorridors}</div>
      </div>
      <div class="stat-item fade-in" style="animation-delay: 0.2s">
        <div class="stat-label">Community Forests</div>
        <div class="stat-value">${stats.totalForests}</div>
      </div>
      <div class="stat-item fade-in" style="animation-delay: 0.3s">
        <div class="stat-label">Total Protected Area</div>
        <div class="stat-value">${stats.totalProtectedArea} km²</div>
      </div>
    `;
  }

  // Mobile navigation handlers
  const mobileLayerBtn = document.getElementById("mobileLayerBtn");
  const mobileInfoBtn = document.getElementById("mobileInfoBtn");
  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const mobileLocationBtn = document.getElementById("mobileLocationBtn");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  
  mobileLayerBtn.addEventListener("click", toggleSidebar);
  mobileInfoBtn.addEventListener("click", function() {
    if (dashboard.classList.contains("visible")) {
      hideDashboard();
    } else {
      showDashboard();
    }
  });
  mobileSearchBtn.addEventListener("click", function() {
    search.clear();
    search.focus();
  });
  mobileLocationBtn.addEventListener("click", function() {
    locateWidget.locate();
  });
  mobileMenuBtn.addEventListener("click", function() {
    aboutUsModal.style.display = "block";
  });

  // Zoom to Bhutan when loaded
  bhutanBoundaryLayer.when(() => {
    view.goTo(bhutanBoundaryLayer.fullExtent);
    calculateStatistics();
    
    // Hide loading overlay when map is ready
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }, 1000);
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    view.ui.move('home', 'top-left');
    view.ui.move('compass', 'top-left');
    view.padding = {
      bottom: isMobile() ? 60 : 0
    };
  });
});

// About Us modal logic
const aboutUsBtn = document.getElementById("aboutUsBtn");
const aboutUsModal = document.getElementById("aboutUsModal");
const closeAboutUs = document.getElementById("closeAboutUs");

aboutUsBtn.addEventListener("click", function() {
  aboutUsModal.style.display = "block";
});
closeAboutUs.addEventListener("click", function() {
  aboutUsModal.style.display = "none";
});
window.addEventListener("click", function(event) {
  if (event.target === aboutUsModal) {
    aboutUsModal.style.display = "none";
  }
});