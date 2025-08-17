import ky from "ky";

export default ky.create({
	retry: 0,
});
