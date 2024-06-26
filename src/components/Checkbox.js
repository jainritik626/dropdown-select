import React, { useRef, useLayoutEffect } from "react";
import { status } from "./Constants";

export default function Checkbox(props) {
	const { indeterminate, checked, id, compute, ...rest } = props;
	const inputRef = useRef(null);

	useLayoutEffect(() => {
		if (inputRef.current) {
			inputRef.current.indeterminate = indeterminate;
			inputRef.current.checked = checked;
		}
	}, [indeterminate, checked]);

	return (
		<input
			{...rest}
			ref={inputRef}
			type="checkbox"
			onChange={() => {
				const newStatus = inputRef.current.checked
					? status.checked
					: status.unchecked;
				compute(id, newStatus);
			}}
		/>
	);
}
