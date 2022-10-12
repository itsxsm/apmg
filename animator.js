function log_error(message) { console.log(`ERROR: ${message}`); }

if (!reporter) {
	log_error("load Mechanics before Animator");
}

const ALL_POSES = ["standing", "attacking", "struck"];
const ALL_STANDARD_CHIP_TYPES = ["Shot", "Sword", "Toss"];
const SPECIAL_CHIP_ANIMATIONS = {};

sprites = {
	// TODO: use document.onload so scripts don't have to be after structure?

	// TODO: check if, instead of specifying both sides directly,
	// east offsets can be calculated from west offsets, or,
	// east offsets can be implemented by using right instead of left.
	"ProtoMan.nav": {
		id: "protoman",
		navi: player1,
		div: document.getElementById("protoman"),
		left_offset_0s_by_side_and_pose: {
			"west": {
				"standing": 2,
				"attacking": -4,
				"struck": 2
			},
			"east": {
				"standing": -12,
				"attacking": -12,
				"struck": -12
			}
		},
		top_offset_0: 66,
		pose: "standing"
	},
	"MagicMan.nav": {
		id: "magicman",
		navi: player2,
		div: document.getElementById("magicman"),
		left_offset_0s_by_side_and_pose: {
			"west": {
				"standing": 3,
				"attacking": 3,
				"struck": 3
			},
			"east": {
				"standing": 3,
				"attacking": -12,
				"struck": 3
			}
		},
		is_east: true,
		top_offset_0: 54,
		pose: "standing"
	}
}

const obstacle_anchor = document.getElementById("obstacle-anchor");

function last_value(x) { return x[x.length - 1]; }

function trim_trailing_digit(str) {
	if (!str?.length) return str;
	const last_char = last_value(str);
	return isNaN(last_char) ? str : str.slice(0, -1);
}

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

function check_and_rescue_sprite(sprite) {
	if (sprite.div) return sprite;
	
	log_error("non-sprite passed to sprite method")
	if (typeof sprite == "string") return get_sprite_by_navi_name(sprite);
	if (sprite.kind == "Navi") return get_sprite_by_navi_name(name_of(sprite));
	return null;
}

// TODO: this works for static poses, may need refactor for true animations
function set_sprite_pose(sprite, pose) {
	sprite = check_and_rescue_sprite(sprite);
	if (!sprite) return;

	if (sprite.div.classList.contains(pose)) return;
	if (!ALL_POSES.includes(pose)) {
		log_error(`set_sprite_pose got unrecognized pose: ${pose}`);
		return;
	}
	sprite.div.classList.remove(sprite.pose);
	sprite.div.classList.add(pose);
	sprite.pose = pose;

	const navi = sprite.navi;
	const side = navi.is_east ? "east" : "west";
	const left_offset_0 =
		sprite.left_offset_0s_by_side_and_pose[side][sprite.pose];

	// TODO: can margin or padding be used for the pose offset so that absolute
	// positioning doesn't need to be recalculated when pose changes?

	const space = navi.space;
	sprite.div.style.left = (space[0] * 40 + left_offset_0) + "px";
	sprite.div.style.top = (space[1] * 24 + sprite.top_offset_0) + "px";
}

function repaint_for_turn_start() {
	[player1, player2].forEach(p =>
		set_sprite_pose(get_sprite_by_navi_name(name_of(p)), "standing")
	);
}

// TODO: when this function is updated for true animation,
// rename paint -> animate
function paint_navi_uses_chip_type_on_target(
	navi, chip_type, target, does_hit = true)
{
	const sprite = get_sprite_by_navi_name(name_of(navi));

	// TODO: fix for obstacle targets
	const target_sprite =
		target ? get_sprite_by_navi_name(name_of(target)) : null;

	// for now fixed attacking pose stands in for all chip uses
	set_sprite_pose(sprite, "attacking");
	if (target_sprite && does_hit) { set_sprite_pose(target_sprite, "struck"); }
}

function move_navi_to_space(navi, space) {
	const sprite = get_sprite_by_navi_name(navi.name);
	const side = navi.is_east ? "east" : "west";
	const left_offset_0 =
		sprite.left_offset_0s_by_side_and_pose[side][sprite.pose];

	sprite.div.style.left = (space[0] * 40 + left_offset_0) + "px";
	sprite.div.style.top = (space[1] * 24 + sprite.top_offset_0) + "px";
}

function repaint_panel_control() {
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
	});
}

function repaint_obstacles() {
	// not the most efficient, but simple: remove everything and then recreate

	Object.keys(sprites).filter(x => !x.endsWith(".nav"))
		.forEach(sprite_name => {
			sprites[sprite_name].div.remove();
			delete sprites[sprite_name]; 
		});

	// TODO: fix for multiple obstacles of the same type using name A, B, etc.
	obstacles.forEach(obstacle => {
		const div = document.createElement("div");
		const name = name_of(obstacle);
		div.id = name; // TODO: double check if this is right
		div.style.left = (obstacle.space[0] * 40) + "px";
		div.style.top = (obstacle.space[1] * 24) + "px";
		const chip_series =
			`obstacle-${trim_trailing_digit(name_of(obstacle.chip))}`;
		div.classList.add("obstacle", chip_series);
		sprites[name] = {
			id: name,
			div: div,
			left_offset_west_0: 0,
			left_offset_east_0: 0,
			top_offset_0: 0
		};
		document.getElementById("minigame").insertBefore(div, obstacle_anchor);
	});
}

function animate_message(message) {
	// console.log(`-> animator received message: ${message}`);
	const words = message.split(' ');

	var last_word = last_value(words);
	const last_char = last_value(last_word);
	if (!['.', ')', '!'].includes(last_char)) {
		log_error("animator got report with unexpected ending");
	}
	// remove trailing punctuation for name matching on last word
	words[words.length - 1] = last_word.slice(0, -1);
	last_word = last_value(words);

	if (last_char == ')' && message.includes("'s turn")) {
		repaint_for_turn_start();
	} else if (message.includes(" moves to ")) {
		if (words.length != 5) {
			log_error("animator got unexpected 'moves to' report");
			return;
		}
		const navi = get_navi_by_name(words[0]);
		const space = [parseInt(words[3], 10), parseInt(words[4], 10)];
		move_navi_to_space(navi, space);
	} else if (message.includes(" steals control ")) {
		repaint_panel_control();
	} else if (message == "Game reset.") {
		repaint_obstacles();
		move_navi_to_space(player1, [0, 0]);
		move_navi_to_space(player2, [5, 2]);
		repaint_panel_control();
	} else if (message.includes(" damage to ")) {
		const navi = get_navi_by_name(words[0]);
		const target = get_navi_by_name(words[5]);
		paint_navi_uses_chip_type_on_target(navi, "Shot", target, true);
	} else if (message.includes(" misses")) {
		const navi = get_navi_by_name(words[0]);
		paint_navi_uses_chip_type_on_target(navi, "Shot", undefined, false);
	} else if (message.includes(" places a ")
		|| message.includes(" is deleted"))
	{
		repaint_obstacles();
	} else if (message.includes(" cannot line up ")
		|| message.includes(" draws ")
		|| message.includes(" is already at max HP"))
	{
		; // nothing to do
	} else {
		console.log(`-> no animation interpreter for message: ${message}`);
	}
}

reporter.interpreters.push(animate_message);

console.log("Animator loaded.");
