import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

const Selector = ({ token, setToken }) => {
	const [sign, setSign] = useState(false);

	return (
		<div>
			{sign ? <Login token={token} setToken={setToken} /> : <Signup />}
			<button onClick={() => setSign(!sign)} className="mrg-top">
				{sign ? "Or sign in?" : "Or log in?"}
			</button>
		</div>
	);
};

export default Selector;
