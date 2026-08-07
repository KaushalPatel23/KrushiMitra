import { useCallback, useEffect, useState } from "react";

type LocationStatus =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "unsupported"
  | "unavailable"
  | "timeout";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const FALLBACK_LABEL = "Location unavailable";

const getLocationLabel = async (coordinates: Coordinates) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.latitude}&lon=${coordinates.longitude}&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      },
    );

    if (!response.ok) {
      return `${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}`;
    }

    const data = await response.json();
    const address = data?.address ?? {};
    const locationParts = [
      address.village,
      address.town,
      address.city,
      address.county,
      address.state,
      address.country,
    ].filter(Boolean);

    if (locationParts.length) {
      return locationParts.slice(0, 3).join(", ");
    }

    return data?.display_name ?? `${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}`;
  } catch {
    return `${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}`;
  }
};

export function useUserLocation(options?: { autoRequest?: boolean; reason?: string }) {
  const { autoRequest = true, reason = "to personalize your farm location" } = options ?? {};
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>(FALLBACK_LABEL);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      setLocationLabel(FALLBACK_LABEL);
      setErrorMessage("Browser geolocation is not supported on this device.");
      return null;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            maximumAge: 60_000,
            timeout: 10_000,
          },
        );
      });

      const nextCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      const label = await getLocationLabel(nextCoordinates);
      setCoordinates(nextCoordinates);
      setLocationLabel(label);
      setStatus("success");
      return { coordinates: nextCoordinates, label };
    } catch (error) {
      const geolocationError = error as GeolocationPositionError;
      if (geolocationError.code === 1) {
        setStatus("denied");
        setLocationLabel(FALLBACK_LABEL);
        setErrorMessage("Location permission was denied. You can continue without sharing your location.");
      } else if (geolocationError.code === 2) {
        setStatus("unavailable");
        setLocationLabel(FALLBACK_LABEL);
        setErrorMessage("Location data is temporarily unavailable.");
      } else if (geolocationError.code === 3) {
        setStatus("timeout");
        setLocationLabel(FALLBACK_LABEL);
        setErrorMessage("Location request timed out. Please try again.");
      } else {
        setStatus("unavailable");
        setLocationLabel(FALLBACK_LABEL);
        setErrorMessage("Location could not be determined right now.");
      }
      return null;
    }
  }, []);

  useEffect(() => {
    if (!autoRequest) {
      return;
    }

    void requestLocation();
  }, [autoRequest, requestLocation]);

  return {
    coordinates,
    locationLabel,
    status,
    errorMessage,
    requestLocation,
    reason,
  };
}
