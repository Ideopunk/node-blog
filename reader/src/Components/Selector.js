import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

const Selector = ({ token, setToken }) => {
	const [sign, setSign] = useState(false);

	return (
		<div>
			{sign ? <Login token={token} setToken={setToken} /> : <Signup />}
			<div onClick={() => setSign(!sign)}>
				{sign ? "Or would you prefer to sign in?" : "Or would you prefer to log in?"}
			</div>
		</div>
	);
};

export default Selector;
