import React, { useState } from "react";
import SideBar from "./SideBar";
import { Geosample } from "./GeosampleTypes";
import "./Geosamples.css";

//Hi i hardcoded some values for geosamplemanager, bc idk where it is actually coming from!!! feel free to get rid of it here...
const GeosampleManager = () => {
  const [geosamples, setGeosamples] = useState<Geosample[]>([
    {
      id: 1,
      zoneId: "A",
      starred: true,
      bookmarked: false,
      datetime: "2025-02-17T14:21:21Z",
      color: "gold",
      subcolor: "lightyellow",
      shape: "circle",
      rockType: "igneous",
      author: 1,
      description: "Geo Sample 1",
      photoJpg: "",
      elementalComposition: {
        SiO2: 45.5,
        TiO2: 3.2,
        Ai2O3: 14.6,
        FeO: 8.3,
        MnO: 0.1,
        MgO: 9.8,
        CaO: 11.7,
        K2O: 1.9,
        P2O3: 0.4,
        Other: 5.5,
      },
      latitude: 42.265869,
      longitude: -83.750031,
    },
    {
      id: 2,
      zoneId: "A",
      starred: false,
      bookmarked: false,
      datetime: "2025-02-17T14:22:00Z",
      color: "green",
      subcolor: "lightgreen",
      shape: "square",
      rockType: "sedimentary",
      author: 2,
      description: "Geo Sample 2",
      photoJpg: "",
      elementalComposition: {
        SiO2: 50.0,
        TiO2: 4.0,
        Ai2O3: 15.0,
        FeO: 7.0,
        MnO: 0.5,
        MgO: 10.0,
        CaO: 12.0,
        K2O: 2.0,
        P2O3: 0.5,
        Other: 6.0,
      },
      latitude: 42.265870,
      longitude: -83.750032,
    },
    {
      id: 3,
      zoneId: "B",
      starred: true,
      bookmarked: false,
      datetime: "2025-02-17T14:23:00Z",
      color: "blue",
      subcolor: "lightblue",
      shape: "hexagon",
      rockType: "metamorphic",
      author: 3,
      description: "Geo Sample 3",
      photoJpg: "",
      elementalComposition: {
        SiO2: 52.0,
        TiO2: 3.5,
        Ai2O3: 16.0,
        FeO: 6.5,
        MnO: 0.4,
        MgO: 9.5,
        CaO: 11.5,
        K2O: 2.5,
        P2O3: 0.3,
        Other: 4.3,
      },
      latitude: 42.265871,
      longitude: -83.750033,
    },
  ]);

  const [selectedSample, setSelectedSample] = useState<Geosample | null>(null);

  return (
    <div className="geosample-manager">
      <SideBar
        geosamples={geosamples}
        selectedSample={selectedSample}
        onSelectSample={setSelectedSample}
      />
    </div>
  );
};

export default GeosampleManager;
