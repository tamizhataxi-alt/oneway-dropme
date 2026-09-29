"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatPlaceLabel,
  isGoogleMapsConfigured,
  loadGoogleMaps,
} from "@/lib/google-maps";
import { cn } from "@/lib/utils";

interface PlacesAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export default function PlacesAutocompleteInput({
  value,
  onChange,
  placeholder,
  id,
  className,
  disabled = false,
}: PlacesAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  const [ready, setReady] = useState(false);
  const hasApiKey = isGoogleMapsConfigured();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hasApiKey || disabled) return;

    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !inputRef.current) return;

        const tamilNaduBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(8.0, 76.0),
          new google.maps.LatLng(13.8, 80.5)
        );

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "in" },
          fields: ["formatted_address", "name", "geometry", "address_components"],
          bounds: tamilNaduBounds,
          strictBounds: false,
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const label = formatPlaceLabel(place);
          if (label) onChangeRef.current(label);
        });

        autocompleteRef.current = autocomplete;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
      if (autocompleteRef.current && window.google?.maps) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      autocompleteRef.current = null;
    };
  }, [disabled, hasApiKey]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={hasApiKey && ready ? "off" : "address-line1"}
      className={cn(className)}
      aria-label={placeholder}
    />
  );
}
