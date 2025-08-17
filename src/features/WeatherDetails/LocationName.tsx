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
		isPending,
	} = useCurrentLocationQuery({ coords: { latitude, longitude } });

	if (isCurrentLocationError) {
		return <h1 className="text-red-100">Error when fetching location name</h1>;
	}

	if (isFetchingCurrentLocation || !currentLocation || isPending) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex flex-col gap-1 items-center">
			<h1 className="text-4xl font-semibold text-foreground">
				{currentLocation.city}
			</h1>
			<h2 className="text-2xl font-semibold text-foreground">
				{currentLocation.countryName}
			</h2>
		</div>
	);
};

export default LocationName;
