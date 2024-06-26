import React, { useState, useEffect } from "react";
import "./App.css";
import SelectedCategory from "./components/Lists";
import { status } from "./components/Constants";
import { newData } from "./data";

const transformData = (data) => {
  const transformNode = (node) => {
    if (node.categoryValue.endsWith("_diffnode")) {
      return null;
    }

    const transformedChildren = node.children
      ? Object.values(node.children).map(transformNode).filter(child => child !== null)
      : null;

    return {
      id: node.categoryId,
      name: node.categoryValue,
      items: transformedChildren,
      status: null 
    };
  };

  return Object.values(data.relationships).map(transformNode).filter(node => node !== null);
};

const transformedData = transformData(newData);

export default function App() {
  const [items, setItems] = useState(transformedData);
  const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("Selected Category Values:", selectedCategoryValues);
  }, [selectedCategoryValues]);

  const setStatus = (root, status) => {
    root.status = status;
    if (Array.isArray(root.items)) {
      root.items.forEach((item) => {
        setStatus(item, status);
      });
    }
  };

  const computeStatus = (items) => {
    let checked = 0;
    let indeterminate = 0;

    items.forEach((item) => {
      if (item.status && item.status === status.checked) checked++;
      if (item.status && item.status === status.indeterminate) indeterminate++;
    });

    if (checked === items.length) {
      return status.checked;
    } else if (checked > 0 || indeterminate > 0) {
      return status.indeterminate;
    }
  };

  const traverse = (root, needle, status) => {
    let id;
    let items;

    if (Array.isArray(root)) {
      items = root;
    } else {
      id = root.id;
      items = root.items;
    }

    if (id === needle) {
      return setStatus(root, status);
    }

    if (!items) {
      return root;
    } else {
      items.forEach((item) => traverse(item, needle, status));
      root.status = computeStatus(items);
    }
  };

  const traverseAndCollectSelected = (root, selectedValues) => {
    if (root.status === status.checked) {
      selectedValues.push(root.name);
    }

    if (Array.isArray(root.items)) {
      root.items.forEach((item) => {
        traverseAndCollectSelected(item, selectedValues);
      });
    }
  };

  const handleCheckboxChange = (checkboxId, status) => {
    const updatedItems = [...items];
    traverse(updatedItems, checkboxId, status);
    setItems(updatedItems);

    // Collect selected category values
    const selectedValues = [];
    updatedItems.forEach((item) => {
      traverseAndCollectSelected(item, selectedValues);
    });

    setSelectedCategoryValues(selectedValues);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="App">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedCategoryValues.length === 0 ? 'Select Categories' : selectedCategoryValues.join(", ")}
      </div>
      {isDropdownOpen && (
        <div className="dropdown-options">
          <SelectedCategory items={items} onChange={handleCheckboxChange} />
        </div>
      )}
    </div>
  );
}
