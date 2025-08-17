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

	if (isFetchingCurrentLocation || !currentLocation || isPending) {
		return <LoadingSpinner />;
	}

	if (isCurrentLocationError) {
		return (
			<h1 className="text-4xl font-semibold text-red-500">
				Error when fetching location name
			</h1>
		);
	}

	if (!currentLocation.city) {
		return (
			<h1 className="text-4xl font-semibold text-red-500">No name found</h1>
		);
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
