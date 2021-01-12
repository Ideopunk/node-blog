import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

const Selector = ({ token, setToken }) => {
	const [sign, setSign] = useState(false);

	return (
		<div>
			{sign ? <Login token={token} setToken={setToken} /> : <Signup />}
			<button onClick={() => setSign(!sign)} className="mrg-top">
				{sign ? "Or would you prefer to sign in?" : "Or would you prefer to log in?"}
			</button>
		</div>
	);
};

export default Selector;
