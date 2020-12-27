import "./App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
	const [text, setText] = useState("");

	useEffect(() => {
		axios.get("http://localhost:8080/").then((response) => setText(response.data));
	}, []);

	return (
		<div className="App">
			<p>Yo</p>
			<p>{text}</p>
		</div>
	);
};

export default App;
