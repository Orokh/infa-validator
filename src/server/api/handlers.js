function handleListResult(err, data, res, aggFunc) {
	if (err) {
		console.log(err);
		res.send({
			success: false,
			message: `Error: ${err.message}`
		});
	}
	const { Count } = data;
	let { Items } = data;

	if (typeof aggFunc === 'function') {
		Items = Items.reduce(aggFunc, []);
	}

	res.send({
		success: true,
		message: `Retrieved ${Count} items`,
		list: Items
	});
}

module.exports.handleListResult = handleListResult;
