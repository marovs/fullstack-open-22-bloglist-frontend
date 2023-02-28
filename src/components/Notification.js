const Notification = ({message}) => {
	if (message === null) {
		return null
	}

	let notificationStyle = {
		background: "lightgrey",
		fontSize: 20,
		borderStyle: "solid",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	}

	notificationStyle.color = message.type === "error" ? "red" : "green"

	return (
		<div style={notificationStyle}>
			{message.message}
		</div>
	)
}

export {Notification}