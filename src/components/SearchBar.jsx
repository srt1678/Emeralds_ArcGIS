import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import "./SearchBar.css";

const SearchBar = ({ onSearch, viewRef }) => {
	const [isSearching, setIsSearching] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const toggleIsSearching = () => {
		if (isSearching) {
			viewRef.current.graphics.removeAll();
		}
		setIsSearching(!isSearching);
	};

	const handleSearch = () => {
		if (searchInput.trim() !== "") {
			onSearch(searchInput);
		}
	};

	return (
		<>
			<button
				className="search-button"
				onClick={() => {
					toggleIsSearching();
				}}
			>
				{isSearching ? (
					<RxCross2 className="toggle-icon-button" />
				) : (
					<IoSearch className="search-icon-button" />
				)}
			</button>
			{isSearching && (
				<div className="test">
					<input
						className="search-bar-container"
						type="text"
						placeholder="Search Address"
						onChange={(e) => {
							setSearchInput(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
				</div>
			)}
		</>
	);
};

export default SearchBar;
