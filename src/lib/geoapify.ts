// Google Maps API integration (replacing Geoapify)
import { GOOGLE_MAPS_API_KEY } from './constants';

export interface GeoapifyPlace {
    place_id: string;
    name: string;
    formatted_address: string;
    lat: number;
    lng: number;
}

export interface RouteResult {
    geometry: [number, number][];
    distance: number; // in meters
    time: number; // in seconds
}

// Initialize Google Maps service once
let autocompleteService: google.maps.places.AutocompleteService | null = null;
let placesService: google.maps.places.PlacesService | null = null;
let directionsService: google.maps.DirectionsService | null = null;

function initializeServices() {
    if (!autocompleteService) {
        autocompleteService = new google.maps.places.AutocompleteService();
    }
    if (!placesService) {
        // Create a dummy div for PlacesService (required by Google Maps API)
        const dummyDiv = document.createElement('div');
        placesService = new google.maps.places.PlacesService(dummyDiv);
    }
    if (!directionsService) {
        directionsService = new google.maps.DirectionsService();
    }
}

// Search for places using Google Places Autocomplete API
export async function searchPlaces(query: string): Promise<GeoapifyPlace[]> {
    try {
        // Initialize services
        initializeServices();

        if (!autocompleteService || !placesService) {
            console.error('Google Maps services not initialized');
            return [];
        }

        // Get autocomplete predictions
        const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
            autocompleteService!.getPlacePredictions(
                {
                    input: query,
                    componentRestrictions: { country: 'in' },
                },
                (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        resolve(results);
                    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        resolve([]);
                    } else {
                        reject(new Error(`Places API error: ${status}`));
                    }
                }
            );
        });

        // Get details for each prediction
        const places = await Promise.all(
            predictions.slice(0, 5).map(async (prediction) => {
                try {
                    const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
                        placesService!.getDetails(
                            {
                                placeId: prediction.place_id,
                                fields: ['geometry', 'name', 'formatted_address'],
                            },
                            (result, status) => {
                                if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                                    resolve(result);
                                } else {
                                    reject(new Error(`Place details error: ${status}`));
                                }
                            }
                        );
                    });

                    if (details.geometry?.location) {
                        return {
                            place_id: prediction.place_id,
                            name: details.name || prediction.description,
                            formatted_address: details.formatted_address || prediction.description,
                            lat: details.geometry.location.lat(),
                            lng: details.geometry.location.lng(),
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Error getting place details:', error);
                    return null;
                }
            })
        );

        return places.filter((p): p is GeoapifyPlace => p !== null);
    } catch (error) {
        console.error('Error searching places:', error);
        return [];
    }
}

// Get route using Google Directions API
export async function getRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
): Promise<RouteResult[]> {
    try {
        // Initialize services
        initializeServices();

        if (!directionsService) {
            console.error('Google Maps DirectionsService not initialized');
            return [];
        }

        const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService!.route(
                {
                    origin: new google.maps.LatLng(origin.lat, origin.lng),
                    destination: new google.maps.LatLng(destination.lat, destination.lng),
                    travelMode: google.maps.TravelMode.DRIVING,
                    provideRouteAlternatives: true,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        resolve(result);
                    } else {
                        reject(new Error(`Directions API error: ${status}`));
                    }
                }
            );
        });

        if (!result.routes || result.routes.length === 0) {
            return [];
        }

        return result.routes.map(route => {
            const leg = route.legs[0];
            const geometry: [number, number][] = [];
            route.overview_path.forEach((latLng) => {
                geometry.push([latLng.lat(), latLng.lng()]);
            });

            return {
                geometry,
                distance: leg.distance?.value || 0, // in meters
                time: leg.duration?.value || 0, // in seconds
            };
        });
    } catch (error) {
        console.error('Error getting route:', error);
        return [];
    }
}
