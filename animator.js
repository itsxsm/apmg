if (!reporter) {
	console.log("ERROR: load Mechanics before Animator");
}

reporter.interpreters.push((message) => {
	console.log(`Animator received message: ${message}`);
});

console.log("Animator loaded.");