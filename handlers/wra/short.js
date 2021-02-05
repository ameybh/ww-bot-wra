const handleShort = (message, text, wraAPI) => {
	try {	
		console.log('Short message');
		// send the rest of the message to Wolfram|Alpha API
		wraAPI.getShort(text)
			.then(res => {
				message.reply(res)
					.catch(err => console.log(err));
			})
			.catch(err => {
				message.reply(String(err));
			});
	} catch (err) {
		console.log(err);
	}
};
module.exports = handleShort;