import { type ComponentProps, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text=base shadow-xs transition-colors ${className}`}
				ref={ref}
				{...props}
			/>
		);
	},
);

export default Input;
