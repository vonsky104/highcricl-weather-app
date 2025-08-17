interface ITemperatureProps {
	value: number;
}

const Temperature = ({ value }: ITemperatureProps) => {
	return <>{Math.ceil(value)} &#8451;</>;
};

export default Temperature;
