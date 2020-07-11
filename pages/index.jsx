import { useState } from "react";
import CopyToClipBoard from "react-copy-to-clipboard";

import Loader from "react-loader-spinner";

import styles from "../styles/index.module.css";

const HomePage = (props) => {
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [response, setResponse] = useState(null);

	const handleChange = (e) => {
		setInput(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!input) {
			return setError("Please submit a valid Url");
		}
		setResponse(null);
		setError(null);
		setLoading(true);
		fetch("http://localhost:3000/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: input }),
		})
			.then(async (res) => {
				const jsonData = await res.json();
				console.log(jsonData);
				if (!res.ok) {
					throw new Error(jsonData.message);
				}
				return jsonData;
			})
			.then((data) => {
				setLoading(false);

				setResponse(data);
				setError(null);
			})
			.catch((err) => {
				console.log(error);
				setLoading(false);
				setError(err.message);
			});
	};

	return (
		<>
			<h1 className={styles.title}>Url shortener</h1>
			<div className={styles.form}>
				<form onSubmit={handleSubmit} className={styles.formControl}>
					<label className={styles.label} htmlFor="url">
						Enter Url to shorten
					</label>
					<input
						className={styles.input}
						value={input}
						onChange={handleChange}
						type="text"
						placeholder="http://www.example.com/something/somthing"
					/>
					<button className={styles.button} type="submit">
						Submit
					</button>
				</form>
			</div>
			{response ? (
				<div className={styles.output}>
					<p>{`${props.protocol}://${props.host}/${response.short}`}</p>
					<CopyToClipBoard
						text={`${props.protocol}://${props.host}/${response.short}`}
					>
						<button className={styles.buttonCopy}>Copy to clipboard</button>
					</CopyToClipBoard>
				</div>
			) : null}
			{error ? (
				<div className={styles.error}>
					<h5>{error}</h5>
				</div>
			) : null}
			{loading ? (
				<div className={styles.loading}>
					<Loader width={50} height={50} type="Puff" color="green" />
				</div>
			) : null}
		</>
	);
};

HomePage.getInitialProps = (ctx) => {
	return {
		protocol: ctx.req.protocol,
		host: ctx.req.get("host"),
	};
};

export default HomePage;
