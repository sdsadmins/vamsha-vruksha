"use client";
import { useEffect, useRef } from "react";

export interface DirectoryMember {
  id: string;
  name: string;
  area: string;
  address: string;
  photo: string;
  lat: number;
  lng: number;
}

interface Props {
  members: DirectoryMember[];
  highlighted: string | null;
  onSelect: (id: string) => void;
}

export default function DirectoryMap({ members, highlighted, onSelect }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInst    = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersMap = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInst.current) return;

    import("leaflet").then(L => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // India-centric view to show Karnataka + neighbouring
      const map = L.map(mapRef.current!, { zoomControl: true }).setView([13.5, 76.2], 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInst.current = map;
      renderMarkers(L, map);
    });

    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInst.current) return;
    import("leaflet").then(L => {
      // Remove all existing markers
      markersMap.current.forEach(m => mapInst.current.removeLayer(m));
      markersMap.current.clear();
      renderMarkers(L, mapInst.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, highlighted]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderMarkers(L: any, map: any) {
    // Group nearby members (same lat/lng) with a slight offset
    const seen: Record<string, number> = {};

    members.forEach(m => {
      const key = `${m.lat.toFixed(3)},${m.lng.toFixed(3)}`;
      const count = (seen[key] ?? 0);
      seen[key] = count + 1;

      const offsetLat = m.lat + (count * 0.008);
      const offsetLng = m.lng + (count * 0.004);

      const isHL = m.id === highlighted;

      const iconHtml = `
        <div style="position:relative;width:${isHL ? 52 : 44}px;">
          <div style="
            width:${isHL ? 48 : 40}px;height:${isHL ? 48 : 40}px;
            border-radius:50%;overflow:hidden;
            border:${isHL ? "3px" : "2px"} solid ${isHL ? "#D4AF7A" : "#1B4332"};
            box-shadow:0 ${isHL ? "4" : "2"}px ${isHL ? "16" : "8"}px rgba(0,0,0,${isHL ? "0.3" : "0.15"});
            background:#fff;
          ">
            <img src="${m.photo}" style="width:100%;height:100%;object-fit:cover;" />
          </div>
          <div style="
            position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
            width:0;height:0;border-left:6px solid transparent;
            border-right:6px solid transparent;
            border-top:9px solid ${isHL ? "#D4AF7A" : "#1B4332"};
          "></div>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [isHL ? 52 : 44, isHL ? 57 : 49],
        iconAnchor: [isHL ? 26 : 22, isHL ? 57 : 49],
      });

      const marker = L.marker([offsetLat, offsetLng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:150px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
              <img src="${m.photo}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;"/>
              <div>
                <p style="font-weight:700;font-size:12px;margin:0;color:#0D2B1E;">${m.name}</p>
                <p style="font-size:10px;color:#6B7280;margin:0;">${m.area}</p>
              </div>
            </div>
            <p style="font-size:10px;color:#374151;margin:0;">${m.address}</p>
          </div>
        `)
        .on("click", () => onSelect(m.id));

      if (isHL) {
        marker.openPopup();
        map.setView([offsetLat, offsetLng], 13, { animate: true });
      }

      markersMap.current.set(m.id, marker);
    });
  }

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "500px", borderRadius: "16px" }} />
  );
}
