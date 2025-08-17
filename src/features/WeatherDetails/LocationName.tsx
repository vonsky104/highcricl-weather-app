import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCurrentLocationQuery from "@/hooks/useCurrentLocationQuery";

interface ILocationNameProps {
	longitude: number;
	latitude: number;
}

const LocationName = ({ longitude, latitude }: ILocationNameProps) => {
	const {
		data: currentLocation,
		isFetching: isFetchingCurrentLocation,
		isError: isCurrentLocationError,
	} = useCurrentLocationQuery({ coords: { latitude, longitude } });

	if (isCurrentLocationError) {
		return <h1 className="text-red-100">Error when fetching location name</h1>;
	}

	if (isFetchingCurrentLocation || !currentLocation) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex flex-col gap-2">
			<h1>{currentLocation.city}</h1>
			<h2>{currentLocation.countryName}</h2>
		</div>
	);
};

export default LocationName;
