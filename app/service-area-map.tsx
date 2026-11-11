type ServiceAreaMapProps = {
  className: "map-panel" | "service-area-map" | "service-area-map service-area-map-full";
};

export function ServiceAreaMap({ className }: ServiceAreaMapProps) {
  return (
    <div className={className}>
      <iframe
        title="Interactive map of the On Site Building Construction service area"
        src="https://www.google.com/maps?q=Auckland%2C%20New%20Zealand&z=7&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
