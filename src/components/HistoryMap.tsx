import { useEffect, useMemo, useRef, useState } from "react";
import { Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import { categoryMeta, placeById, places } from "../data/places";
import type { Place, PlaceCategory } from "../types";
import BowfinComparison from "./BowfinComparison";
import SourceLinks from "./SourceLinks";

interface HistoryMapProps {
  initialPlaceId?: string;
}

const allCategories = Object.keys(categoryMeta) as PlaceCategory[];

export default function HistoryMap({ initialPlaceId }: HistoryMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const initialPlace = initialPlaceId ? placeById[initialPlaceId] : undefined;
  const [scope, setScope] = useState<"okinawa" | "journey">(initialPlace?.scope ?? "okinawa");
  const [selectedId, setSelectedId] = useState(initialPlaceId ?? "shuri-castle");
  const [activeCategories, setActiveCategories] = useState<PlaceCategory[]>(allCategories);

  const visiblePlaces = useMemo(
    () => places.filter((place) => place.scope === scope && activeCategories.includes(place.category)),
    [activeCategories, scope],
  );
  const selectedPlace = placeById[selectedId] ?? visiblePlaces[0];

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: mapContainer.current,
      center: [127.75, 26.28],
      zoom: 8.25,
      minZoom: 1.5,
      maxZoom: 17,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => {
      map.addSource("evacuation-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [127.6647, 26.2117],
              [129.51, 29.53],
              [129.8737, 32.7448],
            ],
          },
        },
      });
      map.addLayer({
        id: "evacuation-route-line",
        type: "line",
        source: "evacuation-route",
        layout: { visibility: "none", "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#2e7183", "line-width": 3, "line-dasharray": [2, 2] },
      });
      setMapReady(true);
    });

    mapRef.current = map;
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = visiblePlaces.map((place) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `map-marker map-marker--${place.category}`;
      button.textContent = categoryMeta[place.category].glyph;
      button.setAttribute("aria-label", `${place.name}の解説を開く`);
      button.title = place.name;
      button.addEventListener("click", () => setSelectedId(place.id));
      return new Marker({ element: button, anchor: "center" })
        .setLngLat(place.coordinates)
        .addTo(map);
    });

    if (map.getLayer("evacuation-route-line")) {
      map.setLayoutProperty(
        "evacuation-route-line",
        "visibility",
        scope === "journey" && activeCategories.includes("route") ? "visible" : "none",
      );
    }
  }, [activeCategories, mapReady, scope, visiblePlaces]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (scope === "okinawa") {
      map.fitBounds(
        [
          [127.62, 26.04],
          [127.98, 26.73],
        ],
        { padding: 40, duration: 800 },
      );
    } else {
      map.fitBounds(
        [
          [127.2, 25.5],
          [130.4, 33.4],
        ],
        { padding: 45, duration: 800 },
      );
    }
  }, [mapReady, scope]);

  useEffect(() => {
    if (!initialPlaceId) return;
    const place = placeById[initialPlaceId];
    if (!place) return;
    setScope(place.scope);
    setSelectedId(place.id);
  }, [initialPlaceId]);

  useEffect(() => {
    const current = placeById[selectedId];
    if (current?.scope === scope) return;
    setSelectedId(scope === "okinawa" ? "shuri-castle" : "naha-port");
  }, [scope, selectedId]);

  const selectPlace = (place: Place) => {
    setSelectedId(place.id);
    mapRef.current?.flyTo({ center: place.coordinates, zoom: place.id === "pearl-harbor-bowfin" ? 12 : 11, duration: 1000 });
  };

  const toggleCategory = (category: PlaceCategory) => {
    setActiveCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  };

  return (
    <main id="main-content" className="map-page">
      <section className="map-intro">
        <span className="eyebrow">HISTORY MAP</span>
        <h1>場所から、歴史を読み直す。</h1>
        <p>
          世界遺産、戦争遺跡、慰霊・資料施設、学童疎開船の航路を重ねます。マーカーを選ぶと、解説と公的資料を確認できます。
        </p>
      </section>

      <section className="map-workspace" aria-label="沖縄歴史マップ">
        <div className="map-controls">
          <div className="scope-switch" aria-label="地図の範囲">
            <button className={scope === "okinawa" ? "is-active" : ""} type="button" onClick={() => setScope("okinawa")}>
              沖縄本島
            </button>
            <button className={scope === "journey" ? "is-active" : ""} type="button" onClick={() => setScope("journey")}>
              疎開船・真珠湾
            </button>
          </div>
          <div className="category-filters" aria-label="地点の分類">
            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategories.includes(category) ? "is-active" : ""}
                onClick={() => toggleCategory(category)}
                aria-pressed={activeCategories.includes(category)}
              >
                <span style={{ background: categoryMeta[category].color }} aria-hidden="true" />
                {categoryMeta[category].label}
              </button>
            ))}
          </div>
        </div>

        <div className="map-layout">
          <div className="map-canvas-wrap">
            <div ref={mapContainer} className="map-canvas" aria-label="地点を表示する地図" />
            <p className="map-disclaimer">地点・航路は学習用の概略表示です。訪問前に各施設の公式情報をご確認ください。</p>
          </div>

          <aside className="place-panel" aria-live="polite">
            {selectedPlace ? (
              <>
                <span className="place-category" style={{ color: categoryMeta[selectedPlace.category].color }}>
                  {categoryMeta[selectedPlace.category].label}
                </span>
                <h2>{selectedPlace.name}</h2>
                {selectedPlace.reading && <p className="place-reading">{selectedPlace.reading}</p>}
                <p className="place-location">{selectedPlace.location}</p>
                <p className="place-summary">{selectedPlace.summary}</p>
                <div className="access-note">
                  <strong>見学・公開情報</strong>
                  <span>{selectedPlace.accessStatus}</span>
                </div>
                <SourceLinks sourceIds={selectedPlace.sourceIds} />
              </>
            ) : (
              <p>表示する地点を選んでください。</p>
            )}
          </aside>
        </div>

        <div className="place-index">
          <div>
            <span className="eyebrow">PLACE INDEX</span>
            <h2>{scope === "okinawa" ? "沖縄本島の地点" : "疎開船とBowfinの地点"}</h2>
          </div>
          <div className="place-index__grid">
            {visiblePlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                className={selectedId === place.id ? "is-active" : ""}
                onClick={() => selectPlace(place)}
              >
                <span style={{ color: categoryMeta[place.category].color }}>{categoryMeta[place.category].glyph}</span>
                <span>{place.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <BowfinComparison />
    </main>
  );
}
