function log_error(message) { console.log(`ERROR: ${message}`); }

if (!reporter) {
	log_error("load Mechanics before Animator");
}

sprites = {
	// TODO: use document.onload so scripts don't have to be after structure?
	"ProtoMan.nav": {
		id: "protoman",
		div: document.getElementById("protoman"),
		left_offset_west_0: 0,
		left_offset_east_0: -12,
		top_offset_0: 66
	},
	"MagicMan.nav": {
		id: "magicman",
		div: document.getElementById("magicman"),
		left_offset_west_0: 0, // not checked yet
		left_offset_east_0: 3,
		top_offset_0: 54
	}
}

function last_value(x) { return x[x.length - 1]; }

// TODO: don't use these panel i/j functions on classes_str,
// instead set up a shadow DOM of the grid one time on startup
function get_i_from_classes_str(classes_str) {
	const col_at = classes_str.indexOf("col_");
	if (col_at == -1) return -1;
	return parseInt(classes_str[col_at + 4], 10);
}

function get_j_from_classes_str(classes_str) {
	const row_at = classes_str.indexOf("row_");
	if (row_at == -1) return -1;
	return parseInt(classes_str[row_at + 4], 10);
}

function get_navi_by_name(navi_name) {
	if (player1.name == navi_name) return player1;
	if (player2.name == navi_name) return player2;
	log_error(`no navi found for name ${navi_name}`);
	return null;
}

function get_sprite_by_navi_name(navi_name) {
	const sprite = sprites[navi_name];
	if (!sprite) log_error(`no sprite found for name ${navi_name}`);
	return sprite;
}

function move_navi_to_space(navi, space) {
	const sprite = get_sprite_by_navi_name(navi.name);
	const left_offset_0 = navi.is_east ?
		sprite.left_offset_east_0 : sprite.left_offset_west_0;

	sprite.div.style.left = (space[0] * 40 + left_offset_0) + "px";
	sprite.div.style.top = (space[1] * 24 + sprite.top_offset_0) + "px";
}

reporter.interpreters.push((message) => {
	console.log(`-> animator received message: ${message}`);
	const words = message.split(' ');

	// remove trailing punctuation
	const last_word = words[words.length - 1];
	const last_char = last_word[last_word.length - 1];
	if (!['.', ')', '!'].includes(last_char)) {
		log_error("animator got report with unexpected ending")
	}
	words[words.length - 1] = last_word.slice(0, -1);

	if (message.includes("moves to")) {
		if (words.length != 5) {
			log_error("animator got unexpected 'moves to' report.");
			return;
		}
		console.log("-> animator performing movement...")
		const navi = get_navi_by_name(words[0]);
		const space = [parseInt(words[3], 10), parseInt(words[4], 10)];
		move_navi_to_space(navi, space);
	} else if (message.includes("steals control")) {
		// TODO: use a grid shadow DOM for this instead
		[...document.getElementsByClassName("panel")].forEach(div => {
			var classes_str = div.className;
			var i = get_i_from_classes_str(classes_str);
			var j = get_j_from_classes_str(classes_str);
			if (is_space_east([i, j])) {
				div.classList.replace("west", "east")
			} else {
				div.classList.replace("east", "west");
			}
		})
	} else if (message.includes("cannot line up")) {
		; // nothing to do
	} else {
		console.log("-> no interpeter for message.");
	}
});

console.log("Animator loaded.");

// TODO: there is currently an error with control painting where a navi will
// *sometimes* step onto panels they do not appear to control.
// This should not happen!