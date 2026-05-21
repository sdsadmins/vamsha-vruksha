"use client";
import { useEffect, useRef } from "react";

export interface MapFamily {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  photo: string;
  address: string;
  stopNumber?: number;
}

interface RouteMapProps {
  families: MapFamily[];
  selected: string[];
  center?: [number, number];
  zoom?: number;
  /** GeoJSON coordinates [lng, lat][] from OSRM for actual road path */
  routeGeometry?: number[][];
}

export default function RouteMap({
  families, selected, center = [12.972, 77.594], zoom = 12, routeGeometry,
}: RouteMapProps) {
  const mapRef      = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef  = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeLineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    import("leaflet").then(L => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: true })
        .setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      updateMarkers(L, map);
    });

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then(L => updateMarkers(L, mapInstanceRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, families, routeGeometry]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateMarkers(L: any, map: any) {
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (routeLineRef.current) { map.removeLayer(routeLineRef.current); routeLineRef.current = null; }

    const orderedSelected = families.filter(f => selected.includes(f.id));
    const fallbackPoints: [number, number][] = [];

    orderedSelected.forEach((fam, idx) => {
      fallbackPoints.push([fam.lat, fam.lng]);
      const stopNum = idx + 1;

      const iconHtml = `
        <div style="position:relative;width:52px;">
          <div style="
            width:48px;height:48px;border-radius:50%;overflow:hidden;
            border:3px solid #1B4332;box-shadow:0 2px 12px rgba(0,0,0,0.25);background:#fff;
          "><img src="${fam.photo}" style="width:100%;height:100%;object-fit:cover;" /></div>
          <div style="
            position:absolute;top:-4px;right:-4px;
            width:20px;height:20px;border-radius:50%;
            background:linear-gradient(135deg,#1B4332,#2D6A4F);color:white;
            font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;
            border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);font-family:Inter,sans-serif;
          ">${stopNum}</div>
          <div style="
            position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
            width:0;height:0;border-left:6px solid transparent;
            border-right:6px solid transparent;border-top:8px solid #1B4332;
          "></div>
        </div>
      `;

      const icon = L.divIcon({ html: iconHtml, className: "", iconSize: [52, 60], iconAnchor: [26, 60] });
      const marker = L.marker([fam.lat, fam.lng], { icon }).addTo(map).bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:160px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <img src="${fam.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" />
            <div>
              <p style="font-weight:700;font-size:13px;margin:0;color:#0D2B1E;">${fam.name}</p>
              <p style="font-size:10px;color:#6B7280;margin:0;">${fam.area}</p>
            </div>
          </div>
          <p style="font-size:11px;color:#374151;margin:0;">${fam.address}</p>
        </div>
      `);
      markersRef.current.push(marker);
    });

    if (orderedSelected.length < 2) {
      if (fallbackPoints.length === 1) map.setView(fallbackPoints[0], 14);
      return;
    }

    if (routeGeometry && routeGeometry.length > 1) {
      // Draw actual road route from OSRM geometry [lng, lat] → Leaflet wants [lat, lng]
      const latLngs: [number, number][] = routeGeometry.map(([lng, lat]) => [lat, lng]);
      routeLineRef.current = L.polyline(latLngs, {
        color: "#1B4332", weight: 4, opacity: 0.85,
      }).addTo(map);
      map.fitBounds(routeLineRef.current.getBounds(), { padding: [50, 50] });
    } else {
      // Fallback: straight-line dashed polyline
      routeLineRef.current = L.polyline(fallbackPoints, {
        color: "#1B4332", weight: 3, opacity: 0.65, dashArray: "8, 6",
      }).addTo(map);
      map.fitBounds(routeLineRef.current.getBounds(), { padding: [40, 40] });
    }
  }

  return (
    <div ref={mapRef} style={{ width:"100%", height:"100%", borderRadius:"16px", zIndex:0 }} />
  );
}
