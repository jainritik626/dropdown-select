import React from "react";
import Checkbox from "./Checkbox";
import { status } from "./Constants";

export default function SelectedCategory(props) {
	const { items, onChange } = props;
	return (
		<ul>
			{items.map((item) => {
				let childList = null;
				if (Array.isArray(item.items)) {
					childList = <SelectedCategory items={item.items} onChange={onChange} />;
				}
				return (
					<li key={item.id}>
						<Checkbox
							id={item.id}
							name={item.name}
							checked={item.status === status.checked}
							indeterminate={item.status === status.indeterminate}
							compute={onChange}
						/>
						<label htmlFor={item.name}>{item.name}</label>
						{childList}
					</li>
				);
			})}
		</ul>
	);
}
