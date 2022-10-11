const battle_chip_data_from_bn1 = [
	["1", "Cannon", "ABCDE", "None", "40", "A nice, big cannon!", "*", "Shot"],
	["2", "HiCannon", "FGHIJ", "None", "80", "A nice, big cannon!", "**", "Shot"],
	["3", "M-Cannon", "KLMNO", "None", "120", "A nice, big cannon!", "***", "Shot"],
	["4", "Shotgun", "KMNQR", "None", "30", "Hits enemy and keeps going 1pnl", "*", "Shot Splash Pattern=Forward"],
	["5", "CrossGun", "CEFJK", "None", "30", "4-panel diagonal blast", "*", "Shot Splash Pattern=Cross"],
	["6", "Spreader", "HIJKL", "None", "30", "Gun with a 1-panel blast", "**", "Shot Splash Pattern=Around"],
	["7", "Bubbler", "AKLPS", "Aqua", "50", "Bubbles w/ a 1-panel blast", "*", "Shot Splash Pattern=Forward"],
	["8", "Heater", "CFGKO", "Fire", "70", "Fire with a 1-panel blast", "**", "Shot Splash Patten=Forward"],
	["9", "MiniBomb", "CEJLP", "None", "50", "Throw a bomb! Depth=3", "*", "Toss"],
	["10", "LilBomb", "BDGOT", "None", "50", "Throw a bomb! Depth=3", "*", "Toss Explode Pattern=Wide"],
	["11", "CrosBomb", "BDHJL", "None", "70", "Cross bomb Depth=3", "**", "Toss Explode Pattern=Cross"],
	["12", "BigBomb", "BGOST", "None", "90", "Bomb with a big boom Depth=3", "****", "Toss Explode Pattern=Around"],
	["13", "Sword", "BKLPS", "None", "80", "Cut down enemies! Range=1", "*", "Sword"],
	["14", "WideSwrd", "CKMNS", "None", "80", "Cut down column! Range=1", "*", "Sword"],
	["15", "LongSwrd", "DENOS", "None", "80", "Cut down enemies! Range=2", "**", "Sword"],
	["16", "FtrSword", "BKLPS", "None", "100", "Warrior's sword Range=3", "***", "Sword"],
	["17", "KngtSwrd", "BCEGH", "None", "150", "Knight's sword Range=3", "****", "Sword"],
	["18", "HeroSwrd", "BDFIJ", "None", "200", "Legendary sword Range=3", "*****", "Sword"],
	["19", "FireSwrd", "BFGNP", "Fire", "100", "Cuts down column Range=1", "**", "Sword"],
	["20", "AquaSwrd", "AMNOP", "Aqua", "150", "Cuts down column Range=1", "***", "Sword"],
	["21", "ElecSwrd", "EGLOS", "Elec", "120", "Cuts down column Range=1", "***", "Sword"],
	["22", "Muramasa", "CEGJK", "None", "???", "Do damage = to your HP loss", "*****", "Sword"],
	["23", "ShokWave", "CKLNP", "None", "60", "Piercing ground wave", "*", "Shot Ground Unblockable"],
	["24", "SoniWave", "CDJMS", "None", "80", "Piercing ground wave", "**", "Shot Ground Unblockable"],
	["25", "DynaWave", "CEMRS", "None", "100", "Piercing ground wave", "***", "Shot Ground Unblockable"],
	["26", "FireTowr", "EFLMT", "Fire", "100", "Fire that can move up & down", "**", "Tower Unblockable"],
	["27", "AquaTowr", "ACGHR", "Aqua", "120", "Aqua that can move up & down", "**", "Tower Unblockable"],
	["28", "WoodTowr", "BCHKN", "Wood", "140", "Log that can move up & down", "**", "Tower Unblockable"],
	["29", "Quake1", "AEHKQ", "None", "90", "Cracks a panel Depth=3", "*", "Toss Shatter"],
	["30", "Quake2", "BCIKQ", "None", "120", "Cracks a panel Depth=3", "**", "Toss Shatter Explode Pattern=Wide"],
	["31", "Quake3", "CDHMQ", "None", "150", "Cracks a panel Depth=3", "***", "Toss Shatter Explode Pattern=Cross"],
	["32", "GutsPnch", "BHMNT", "None", "60", "Knocks stuff over Range=1", "*", "Close Push_Max"],
	["33", "IcePunch", "BHMNT", "Aqua", "80", "Knocks stuff over Range=1", "**", "Close Push_Max"],
	["34", "Dash", "BDGLO", "None", "50", "Knock over all in your path!", "*", "Dash"],
	["35", "Howitzer", "ACGHO", "None", "150", "Breaks panels Depth=3", "****", "Toss Shatter2"],
	["36", "TriArrow", "ABCDE", "None", "40", "Fires a 3-arrow burst", "*", "Shot x3 Metal"],
	["37", "TriSpear", "FGHIJ", "None", "50", "Fires a 3-spear burst", "**", "Shot x3 Metal"],
	["38", "TriLance", "KLMNO", "None", "60", "Fires a 3-lance burst", "****", "Shot x3 Metal"],
	["39", "Ratton1", "ABCDE", "None", "80", "Missile that can turn once", "*", "Drone Ground"],
	["40", "Ratton2", "FGHIJ", "None", "100", "Missile that can turn once", "**", "Drone Ground"],
	["41", "Ratton3", "KLMNO", "None", "120", "Missile that can turn once", "***", "Drone Ground"],
	["42", "Wave", "ADILM", "Aqua", "80", "3-row wave! [Aqua]", "***", "Shot Ground"],
	["43", "RedWave", "BEJNP", "Fire", "100", "3-row lava wave! [Fire]", "***", "Shot Ground"],
	["44", "BigWave", "CHKLQ", "Aqua", "160", "3-row giant wave [Aqua]", "****", "Shot Ground"],
	["45", "Gaia1", "CDLOT", "None", "100", "Rolling 3-column explosion!", "***", "Shot Unblockable"],
	["46", "Gaia2", "CFKPS", "None", "130", "Rolling 3-column explosion!", "****", "Shot Unblockable"],
	["47", "Gaia3", "CGMRT", "None", "160", "Rolling 3-column explosion!", "*****", "Shot Unblockable"],
	// ["48", "Thunder1", "AEGHS", "Elec", "90", "A rolling lightning attack", "*", "Wave"],
	// ["49", "Thunder2", "BCFIL", "Elec", "120", "A rolling lightning attack", "**", "Wave"],
	// ["50", "Thunder3", "DFGKN", "Elec", "150", "A rolling lightning attack", "***", "Wave"],
	// ["51", "RingZap1", "GHMNP", "Elec", "100", "Lightning circles you once", "*", "Shot Lag Root"],
	// ["52", "RingZap2", "CEGJL", "Elec", "100", "Lightning circles you twice", "**", "Shot Lag Root"],
	// ["53", "RingZap3", "ABORT", "Elec", "100", "Lightning circles you thrice", "***", "Shot Lag Root"],
	["54", "Typhoon", "ABDEG", "None", "30", "Creates a twister w/ 3 hits", "*", "Summon x3"],
	["55", "Huricane", "GIJKL", "None", "30", "Creates a twister w/ 5 hits", "**", "Summon x5"],
	["56", "Cyclone", "EFGHI", "None", "30", "Creates a twister w/ 8 hits", "***", "Summon x8"],
	// ["57", "Snakegg1", "BEGMN", "Wood", "130", "Squirming snake attack!", "*", "Drone Ground"],
	// ["58", "Snakegg2", "CEHNP", "Elec", "140", "Shocking snake attack!", "**", "Drone Ground"],
	// ["59", "Snakegg3", "ACFLS", "Fire", "150", "Scorching snake attack!", "***", "Drone Ground"],
	["60", "Drain1", "ABDKO", "None", "50", "Charge to drain HP from enemy", "**", "Dash Drain"],
	["61", "Drain2", "ACHNT", "None", "70", "Charge to drain HP from enemy", "**", "Dash Drain"],
	["62", "Drain3", "AEFLQ", "None", "90", "Charge to drain HP from enemy", "***", "Dash Drain"],
	["63", "BodyBurn", "EFKMN", "Fire", "100", "Engulf all around you in flames!", "****", "Dash"],
	["64", "X-Panel1", "BDGLS", "None", "", "Erase 1 panel Range=1", "**", "Close Terrain Broken"],
	["65", "X-Panel3", "BDGLS", "None", "", "Erase column Range=1", "***", "Close Terrain Broken"],
	["66", "Hammer", "AFIMQ", "None", "100", "Breaks cubes Range=1", "**", "Close Breaker"],
	["67", "MetGuard", "ACEGL", "None", "", "Hold A Btn for 3 sec defense!", "*", "Guard Shield"],
	["68", "IronShld", "ABORT", "None", "", "Hold btn. to create shield!", "**", "Guard Shield"],
	["69", "Recov10", "ACEGL", "None", "-10", "Recover 10HP", "*", "Recover"],
	["70", "Recov30", "ACEGL", "None", "-30", "Recover 30HP", "*", "Recover"],
	["71", "Recov50", "ACEGL", "None", "-50", "Recover 50HP", "*", "Recover"],
	["72", "Recov80", "ACEGL", "None", "-80", "Recover 80HP", "*", "Recover"],
	["73", "Recov120", "ACEGL", "None", "-120", "Recover 120HP", "**", "Recover"],
	["74", "Recov150", "ACEGL", "None", "-150", "Recover 150HP", "**", "Recover"],
	["75", "Recov200", "ACEGL", "None", "-200", "Recover 200HP", "***", "Recover"],
	["76", "Recov300", "ACEGL", "None", "-300", "Recover 300HP", "****", "Recover"],
	["77", "Steal", "AELPS", "None", "", "Steal left column of enemy area", "*", "Enemy_Front Steal_Control"],
	["78", "Geddon1", "FHJLN", "None", "", "All panels become cracked!", "***", "Both_Areas Terrain Cracked"],
	// ["79", "Geddon2", "ABEIK", "None", "", "Erases all empty panels", "****", "Both_Areas Terrain Broken"],
	// ["80", "Escape", "FHJLN", "None", "", "Escape from most enemies", "***", "Guard Stealth"],
	// ["81", "Interupt", "FHJLN", "None", "", "Destroy enemy chip data", "***", "Shot"],
	["82", "Repair", "AGHKS", "None", "", "Repair panels in your area", "*", "Own_Area Terrain Normal"],
	// ["83", "TimeBom1", "EGJLQ", "None", "80", "Sets time bomb in enemy area", "**", "Obstacle Delay-3 Ammo-1"],
	// ["84", "TimeBom2", "CFJLS", "None", "120", "Sets time bomb in enemy area", "***", "Obstacle Delay-3 Ammo-1"],
	// ["85", "TimeBom3", "ABGOP", "None", "160", "Sets time bomb in enemy area", "****", "Obstacle Delay-3 Ammo-1"],
	// ["86", "Cloud", "BGHOR", "Aqua", "30", "Rains up & down on 1 column", "*", "Airdrop Ammo-6"],
	// ["87", "Cloudier", "ADIMP", "Aqua", "50", "Rains up & down on 1 column", "**", "Airdrop Ammo-7"],
	// ["88", "Cloudest", "CFJKO", "Aqua", "100", "Rains up & down on 1 column", "***", "Airdrop Ammo-9"],
	// ["89", "Mine1", "GHMNP", "None", "160", "Hides a mine in enemy area", "**", "Bury Stealth Trap"],
	// ["90", "Mine2", "CEGJL", "None", "180", "Hides a mine in enemy area", "***", "Bury Stealth Trap"],
	// ["91", "Mine3", "ABORT", "None", "200", "Hides a mine in enemy area", "****", "Bury Stealth Trap"],
	// ["92", "Dynamyt1", "BGOQS", "Wood", "100", "Looks right for enemy", "***", "?"],
	// ["93", "Dynamyt2", "ACKMN", "Wood", "120", "Looks diagonally for enemy", "***", "?"],
	// ["94", "Dynamyt3", "GKMOP", "Wood", "100", "Looks up & down for enemy", "***", "?"],
	// ["95", "Remobit1", "ACFNO", "Elec", "80", "Remote control smasher!", "*", "Obstacle Remote Overhead:Airdrop Ammo-3"],
	// ["96", "Remobit2", "BDEHI", "Elec", "100", "Remote control smasher!", "**", "Obstacle Remote Overead:Airdrop Ammo-3"],
	// ["97", "Remobit3", "GJKPQ", "Elec", "120", "Remote control smasher!", "***", "Obstacle Remote Overhead:Airdrop Ammo 3"],
	// ["98", "Lockon1", "CDHIL", "None", "10", "Creates a lock on satellite!", "*", "Drone"],
	// ["99", "Lockon2", "BEGHM", "None", "15", "Creates a lock on satellite!", "**", "Drone"],
	// ["100", "Lockon3", "ADKNO", "None", "20", "Creates a lock on satellite!", "***", "Drone"],
	["101", "Candle1", "CFIPS", "Fire", "", "Set candle & recover some HP", "**", "Own_Back Obstacle HP=90 Every_Turn=Candle Amount=5"],
	["102", "Candle2", "BEGJL", "Fire", "", "Set candle & recover some HP", "***", "Own_Back Obstacle HP=120 Every_Turn=Candle Amount=10"],
	["103", "Candle3", "ADHKM", "Fire", "", "Set candle & recover some HP", "****", "Own_Back Obstacle HP=150 Every_Turn=Candle Amount=15"],
	["104", "Anubis", "CLNQT", "None", "", "Set Anubis statue to reduce HP", "*****", "Close Obstacle HP=150 Every_Turn=Poison Amount=20"],
	["105", "IceCube", "ACILM", "Aqua", "", "Creates a ice cube Range=1", "**", "Close Obstacle HP=200"],
	["106", "RockCube", "BEGMO", "None", "", "Creates 3 rock cubes randomly", "***", "Enemy_Random_3 Obstacle HP=200"],
	// ["107", "BstrGard", "AGKNR", "None", "", "1-turn of MetGuard w/ B Btn.", "***", "??"],
	// ["108", "BstrBomb", "DHJOT", "None", "", "1-turn of MiniBomb w/ B Btn.", "****", "??"],
	// ["109", "BstrSwrd", "BELPS", "None", "", "1-turn use of Sword with B Btn.", "****", "??"],
	// ["110", "BstrPnch", "CFIMQ", "None", "", "1-turn of GutsPnch with B Btn.", "****", "??"],
	// ["111", "SloGauge", "HKNOQ", "None", "", "Slows down custom gauge", "**", "Pyschic Stats-1"],
	// ["112", "FstGauge", "ACELN", "None", "", "Speeds up custom gauge", "**", "Psychic Stats+1"],
	// ["113", "Invis1", "IJLOQ", "None", "", "Temporary immunity", "**", "Guard Invis Rounds=1"],
	// ["114", "Invis2", "ACFJM", "None", "", "Temporary immunity", "***", "Guard Invis Rounds=2"],
	// ["115", "Invis3", "BDHKN", "None", "", "Temporary immunity", "****", "Guard Invis Rounds=3"],
	// ["116", "Dropdown", "ABORT", "Wood", "", "Invisible until you attack!", "*****", "Guard Invis Until Attack"],
	// ["117", "Popup", "CDHKN", "None", "", "Invisible when not attacking!", "*****", "Guard Invis Until Struck"],
	// ["118", "IronBody", "CDLQR", "None", "", "30 seconds stoneshape Defense UP", "**", "Guard HalfDamage Rounds 3"],
	["119", "Barrier", "DFMRS", "None", "", "Nullify 1 enemy attack", "**", "Guard Barrier"],
	["120", "BblWrap1", "CEGIM", "Aqua", "", "Aqua wall Comes back if damaged", "**", "Guard Barrier Refresh 1"],
	["121", "BblWrap2", "DFHKN", "Aqua", "", "Aqua wall Comes back if damaged", "**", "Guard Barrier Refresh 2"],
	["122", "BblWrap3", "ABLQR", "Aqua", "", "Aqua wall Comes back if damaged", "***", "Guard Barrier Refresh 3"],
	["123", "LeafShld", "CDFKQ", "Wood", "", "Turns dmg from 1 hit into HP", "***", "Guard Barrier Recover"],
	["124", "AquaAura", "DELRS", "Aqua", "", "Null<10dmg Weak vs. [Elec]", "**", "Guard Barrier Aura 10"],
	["125", "FireAura", "BGINT", "Fire", "", "Null<40dmg Weak vs. [Aqua]", "***", "Guard Barrier Aura 40"],
	["126", "WoodAura", "CFJOQ", "Wood", "", "Null<80dmg Weak vs. [Fire]", "****", "Guard Barrier Aura 80"],
	["127", "LifeAura", "AHKMP", "None", "", "Negate all attacks w/ damage<100", "*****", "Guard Barrier Aura 100"]
]

// TEST CHANGES: Steal Rarity *** => *


const NAME_INDEX = 1;
const CODES_INDEX = 2;
const ELEMENT_INDEX = 3;
const DAMAGE_INDEX = 4;
const DESCRIPTION_INDEX = 5;
const RARITY_INDEX = 6;
const TYPES_INDEX = 7;

const red = "\x1b[31m";
const blue = "\x1b[34m";
const magenta = "\x1b[35m"; 
const color_reset = "\x1b[0m";

var matches_played = 0;
var turns = 0;
var _interval_matches_to_play; // set only by run_game

const ALL_SPACES = [];
for (var j = 0; j <= 2; j++) {
	for (var i = 0; i <= 5; i++) {
		ALL_SPACES.push([i, j]);
	}
}

const are_spaces_east = [
	[false, false, false],
	[false, false, false],
	[false, false, false],
	[true, true, true],
	[true, true, true],
	[true, true, true]
];
const terrain = [
	['Normal', 'Normal', 'Normal'],
	['Normal', 'Normal', 'Normal'],
	['Normal', 'Normal', 'Normal'],
	['Normal', 'Normal', 'Normal'],
	['Normal', 'Normal', 'Normal'],
	['Normal', 'Normal', 'Normal'],
];
const obstacles = [];

const STARTING_HP = 600;

const player1 = {
	kind: 'Navi',
	name: 'ProtoMan.nav',
	hp: STARTING_HP,
	max_hp: STARTING_HP,
	space: [0, 0],
	is_east: false,
	records: {
		chip_ids_used_this_match: [],
		chip_uses_by_id: [],
		chip_wins_by_id: [],
		chip_kos_by_id: [],
		chip_losses_by_id: [],
		wins: 0,
		ties: 0,
		losses: 0,
		matches: 0
	}
};

const player2 = {
	kind: 'Navi',
	name: 'MagicMan.nav',
	hp: STARTING_HP,
	max_hp: STARTING_HP,
	space: [5, 2],
	is_east: true,
	records: {
		chip_ids_used_this_match: [],
		chip_uses_by_id: [],
		chip_wins_by_id: [],
		chip_kos_by_id: [],
		chip_losses_by_id: [],
		wins: 0,
		ties: 0,
		losses: 0,
		matches: 0
	}
};

player1.target = player2;
player2.target = player1;

const BASE_HITRATE = 0.9;

const reporter = { interpreters: [] };

// *** stateless calculation functions on simple objects ***********************

function random_item(list) {
	return list.length ? list[Math.floor(Math.random() * list.length)] : list;
}

function are_spaces_equal(a, b) { return a[0] == b[0] && a[1] == b[1]; }

function edges_distance_between_spaces(a, b) {
	return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function grab_after_equals(list, word) {
	for (var i = 0; i < list.length; i++) {
		var parts = list[i].split('=');
		if (parts.length == 2 && parts[0] == word) return parts[1];
	}
	return null;
}


function a_or_an(word) {
	return "AEIOUaeiou".split('').includes(word[0]) ? "an" : "a";
}

function is_space_valid(space) { 
	return space[0] >= 0 && space[0] <= 5 && space[1] >= 0 && space[1] <= 2;
}

function is_weak_to(a, b) {
	const weaknesses = [
		"Fire is weak to Aqua", "Aqua is weak to Elec", "Elec is weak to Wood",
		"Wood is weak to Fire"
	];
	return weaknesses.includes(
		`${a.element || a} is weak to ${b.element || b}`
	);
}

function min_item_by_method(list, method) {
	if (!list || list.length < 1) return null;
	var min = method(list[0]);
	var min_item = list[0];
	list.forEach(item => {
		var test_value = method(item);
		if (test_value < min) {
			min_item = item;
			min = test_value;
		}
	});
	return min_item;
}

function unique_spaces(spaces) {
	if (spaces.length <= 1) return spaces;
	// here we are turning every spaces into one larger number and back
	// e.g. [4, 1] => 41, 41 => [4, 1]
	// using binary instead of decimal because it computes faster
	var spaces_ints = spaces.map(space => (space[0] << 2) + space[1]);
	return [...new Set(spaces_ints)].map(x => [x >> 2, x & 3]);
}

// *** calculation functions on complex objects ********************************

const _chips_by_rarity = [[], [], [], [], [], []];

function does_player_control_space(player, space) {
	return is_space_east(space) == player.is_east;
}

function get_chips_by_rarity() {
	if (_chips_by_rarity[1].length) return _chips_by_rarity;
	battle_chip_data_from_bn1.forEach(battle_chip => {
		// this line will exclude chips that don't deal or recover any HP
		// if (!parseInt(battle_chip[DAMAGE_INDEX], 10)) return;
		_chips_by_rarity[battle_chip[RARITY_INDEX].length].push(battle_chip);
	})
	return _chips_by_rarity;

}

function get_special_damage(player, battle_chip) {
	switch (battle_chip[DESCRIPTION_INDEX]) {
		case "Do damage = to your HP loss":
			return player.max_hp - player.hp;
		default:
			console.log("ERROR: Unhandled Special Damage description");
			return 10;
	}
}

function get_occupant(space) {
	const all_occupants = [player1, player2].concat(obstacles);
	return all_occupants.find(x => are_spaces_equal(x.space, space));
}

function get_widened_spaces(spaces) {
	const widened_spaces = [];
	spaces.forEach(space => widened_spaces.push(space));
	spaces.forEach(space => {
		if (space[1] > 0) widened_spaces.push([space[0], space[1] - 1]);
	});
	spaces.forEach(space => {
		if (space[1] < 2) widened_spaces.push([space[0], space[1] + 1]);
	});
	return widened_spaces;
}

function has_barrier(player) { return !!player.barrier_chip; }

function has_shield(player) { return !!player.shield_chip; }

function is_battle_chip_wide(battle_chip) {
	const wide_words = ["column", "column!", "3-column", "3-row"];
	const description_words = battle_chip[DESCRIPTION_INDEX].split(" ");
	return description_words.some(w => wide_words.includes(w));
}

function is_kod(player) { return player.hp <= 0; }

function is_space_occupied(space) {
	const occupiers = [player1, player2].concat(obstacles);
	return occupiers.some(x => are_spaces_equal(space, x.space));
}

function is_space_east(space) { return are_spaces_east[space[0]][space[1]]; }

function is_space_gap(space) { return terrain[space[0]][space[1]] == "Broken"; }

function is_the_game_over() { return is_kod(player1) || is_kod(player2); }

function name_of(x) {
	return (Array.isArray(x) ? x[NAME_INDEX] : x.name ) || "Anonymous";
}

function spaces_where_player_could_hit_space_with_chip(
	player, target_space, battle_chip)
{
	const types = battle_chip[TYPES_INDEX].split(" ");
	const hit_type = types[0];
	const all_spaces_hit_types = [
		"Both_Areas", "Recover", "Guard", "Drone"
	]
	if (all_spaces_hit_types.includes(hit_type)) return ALL_SPACES;
	var spaces = [];
	var range = 5;
	var exact_range_only = false;
	switch (hit_type) {
		case "Sword": case "Close":
			range = 1;
			break;
		case "Summon":
			range = 2;
			exact_range_only = true;
			break;
		case "Toss":
			range = 3;
			exact_range_only = true;
			break;
		case "Shot": case "Tower": case "Dash": case "Wave":
			range = 5;
			break;
		default:
			console.log("ERROR: UNHANDLED HIT TYPE FOR " + battle_chip);
			break;
	}
	if (range > 5) range = 5;

	const description_words = battle_chip[DESCRIPTION_INDEX].split(' ');
	const equals_pairs = description_words.map(x => x.split('='))
		.filter(x => x.length == 2);
	equals_pairs.forEach(equals_pair => {
		if (equals_pair[0] == "Range" || equals_pair[0] == "Depth") {
			range = parseInt(equals_pair[1], 10);
		}
	});
	const is_ground = types.includes("Ground");

	const i = target_space[0];
	const j = target_space[1];
	const is_wide = is_battle_chip_wide(battle_chip);
	var is_blocked = [false, false, false];
	var test_js = [j];
	if (is_wide) {
		if (j - 1 >= 0) test_js.push(j - 1);
		if (j + 1 <= 2) test_js.push(j + 1);
	}

	const is_space_blocking = (space) => {
		if (is_ground && is_space_gap(space)) return true;
		return !exact_range_only && is_space_occupied(space)
			&& !are_spaces_equal(space, player.space)
			&& !types.includes("Unblockable");
	}

	if (player.is_east) {
		for (var shift = exact_range_only ? range : 1;
			shift <= range && i + shift <= 5; shift++)
		{
			test_js.forEach(t_j => {
				var space = [i + shift, t_j];
				is_blocked[t_j] ||= is_space_blocking(space);
				if (!is_blocked[t_j]) spaces.push(space);
			});
		}
	} else {
		for (var shift = exact_range_only ? range : 1;
			shift <= range && i - shift >= 0; shift++)
		{
			test_js.forEach(t_j => {
				var space = [i - shift, t_j];
				is_blocked[t_j] ||= is_space_blocking(space);
				if (!is_blocked[t_j]) spaces.push(space);
			});
		}
	}

	if (types.includes("Explode")) {
		const pattern = grab_after_equals(types, "Pattern");
		spaces = spaces_with_explode_pattern(spaces, pattern);
	}

	return spaces;
}

function spaces_struck_by_player_with_chip_from_space(
	player, battle_chip, from_space)
{
	// TODO: DRY this function using elements shared with
	// spaces_where_player_could_hit_space_with_chip

	const types = battle_chip[TYPES_INDEX].split(' ');
	const hit_type = types[0];
	var spaces = [];
	var range = 5;
	var exact_range_only = false;
	switch (hit_type) {
		case "Both_Areas": return ALL_SPACES;
		case "Recover": case "Guard": return [from_space];
		case "Sword": case "Close":
			range = 1;
			break;
		case "Summon":
			range = 2;
			exact_range_only = true;
			break;
		case "Toss":
			range = 3;
			exact_range_only = true;
			break;
		case "Shot": case "Tower": case "Dash": case "Wave": case "Drone":
			range = 5;
			break;
		default:
			console.log("ERROR: UNHANDLED HIT TYPE FOR " + battle_chip);
			break;
	}
	if (range > 5) range = 5;

	const description_words = battle_chip[DESCRIPTION_INDEX].split(' ');
	const equals_pairs = description_words.map(x => x.split('='))
		.filter(x => x.length == 2);
	equals_pairs.forEach(equals_pair => {
		if (equals_pair[0] == "Range" || equals_pair[0] == "Depth") {
			range = parseInt(equals_pair[1], 10);
		}
	});
	const is_ground = types.includes("Ground");

	const i = from_space[0];
	const j = from_space[1];
	const is_wide = is_battle_chip_wide(battle_chip);
	var will_block_beyond = [false, false, false];
	var is_blocked = [false, false, false];
	var test_js = [j];
	if (is_wide) {
		if (j - 1 >= 0) test_js.push(j - 1);
		if (j + 1 <= 2) test_js.push(j + 1);
	}

	const is_space_blocking = (space) => {
		if (is_ground && is_space_gap(space)) return true;
		return !exact_range_only && is_space_occupied(space)
			&& !are_spaces_equal(space, player.space)
			&& !types.includes("Unblockable");
	}

	if (player.is_east) {
		for (var shift = exact_range_only ? range : 1;
			shift <= range && i - shift >= 0; shift++)
		{
			test_js.forEach(t_j => {
				var space = [i - shift, t_j];
				is_blocked[t_j] ||= will_block_beyond[t_j];
				will_block_beyond[t_j] = is_space_blocking(space);
				if (!is_blocked[t_j]) spaces.push(space);
			});
		}
	} else {
		for (var shift = exact_range_only ? range : 1;
			shift <= range && i + shift <= 5; shift++)
		{
			test_js.forEach(t_j => {
				var space = [i + shift, t_j];
				is_blocked[t_j] ||= will_block_beyond[t_j];
				will_block_beyond[t_j] = is_space_blocking(space);
				if (!is_blocked[t_j]) spaces.push(space);
			});
		}
	}

	if (types.includes("Explode")) {
		const pattern = grab_after_equals(types, "Pattern");
		spaces = spaces_with_explode_pattern(spaces, pattern);
	}

	return spaces;
}

function spaces_with_explode_pattern(spaces, pattern) {
	var all_spaces = spaces.concat([]);
	const hits_around = pattern == "Around";
	const hits_cross = hits_around || pattern == "Cross";
	spaces.forEach(space => {
		// Explosions always hit at least panels above and below
		all_spaces.push([space[0], space[1] - 1]);
		all_spaces.push([space[0], space[1] + 1]);

		if (hits_cross) {
			all_spaces.push([space[0] - 1, space[1]]);
			all_spaces.push([space[0] + 1, space[1]]);
		}
		if (hits_around) {
			all_spaces.push([space[0] - 1, space[1] - 1]);
			all_spaces.push([space[0] + 1, space[1] - 1]);
			all_spaces.push([space[0] + 1, space[1] + 1]);
			all_spaces.push([space[0] - 1, space[1] + 1]);
		} 
	});
	all_spaces = all_spaces.filter(space => is_space_valid(space));
	return unique_spaces(all_spaces);
}

function nearest_space_where_player_can_hit_space_with_chip(
	player, target_space, battle_chip)
{
	var spaces = spaces_where_player_could_hit_space_with_chip(
		player, target_space, battle_chip
	);
	if (spaces.length == 0) return null;
	spaces = spaces.filter(space => 
		does_player_control_space(player, space) && !is_space_gap(space)
	);
	return min_item_by_method(spaces, (space) => edges_distance_between_spaces(
		space, player.space
	));
}

// *** mutating functions on simple objects ************************************

function shuffle(list) {
  var m = list.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = list[m];
    list[m] = list[i];
    list[i] = t;
  }
  return list;
}

// *** navi action methods *****************************************************

function i_move_to_space(player, space) {
	// TODO: pathing
	if (are_spaces_equal(player.space, space)) return;
	var old_loc = player.space;
	if (terrain[old_loc[0]][old_loc[1]] == "Cracked") { 
		terrain[old_loc[0]][old_loc[1]] = "Broken";
	}
	report(`${name_of(player)} moves to ${space[0]}, ${space[1]}.`)
	player.space[0] = space[0];
	player.space[1] = space[1];
}

function i_use_this_attack(player, battle_chip) {
	var target = player.target;
	var nearest_space = nearest_space_where_player_can_hit_space_with_chip(
		player, target.space, battle_chip
	);

	if (!nearest_space) {
		hittable_obstacle = obstacles.find(o => {
			if (!!o.every_turn_effect && o.is_east == player.is_east) return false;
			nearest_space = nearest_space_where_player_can_hit_space_with_chip(
				player, o.space, battle_chip
			);
			return nearest_space;
		});
		if (nearest_space) target = hittable_obstacle;
	}

	if (!nearest_space) {
		report(
			`${name_of(player)} cannot line up to use ${name_of(battle_chip)}.`
		);
		return;
	}

	if (!are_spaces_equal(nearest_space, player.space)) {
		i_move_to_space(player, nearest_space);
	};


	// TODO: currently, a chip hits at most one target, the one lined up for.
	// chips should hit every panel in the strike zone.
	if (Math.random() < BASE_HITRATE) { 
		var damage = parseInt(battle_chip[DAMAGE_INDEX], 10);
		if (battle_chip[DAMAGE_INDEX] == "???") {
			damage = get_special_damage(player, battle_chip);
		}
		deal_damage_amount_from_player_to_target_with_chip(
			damage, player, target, battle_chip
		);
	} else {
		// TODO: when attacker misses, target should move to an adjacent panel
		// MVP: targets with no safe adjacent spaces cannot dodge
		// FUTURE: allow multi-step dodges for long windups and slow projectiles
		player_misses_with_chip(player, battle_chip);
	}	
}

function i_use_this_battle_chip(player, battle_chip) {
	report(`${name_of(player)} draws ${name_of(battle_chip)}.`);

	const chip_id = parseInt(battle_chip[0], 10);
	player.records.chip_ids_used_this_match.push(chip_id);
	
	// shields are always dropped at the start of the next round;
	// barriers are only dropped when hit
	player.shield_chip = null;

	var damage = parseInt(battle_chip[DAMAGE_INDEX], 10);
	if (battle_chip[DAMAGE_INDEX] == "???") damage = 1;
	if (!!damage) {
		if (damage < 0) {
			heal_player_by_amount(player, -damage);
		} else {
			i_use_this_attack(player, battle_chip);
		}
	} else {
		const types = battle_chip[TYPES_INDEX].split(" ");
		if (types[0] == "Guard") {
			if (types[1] == "Barrier") {
				player.barrier_chip = battle_chip;
				player.barrier_effect = types[2] || "None";
				player.aura_damage = 0;
				player.barrier_refreshes = 0;
				report(`${name_of(player)} raises a barrier.`);
				switch (types[2]) {
					case "Aura":
						player.aura_damage = parseInt(types[3], 10);
						break;
					case "Refresh":
						player.barrier_refreshes = parseInt(types[3], 10);
						break;
				}
			} else if (types[1] == "Shield") {
				player.shield_chip = battle_chip;
				report(`${name_of(player)} raises a shield.`);
			}
		} else if (types[1] == "Obstacle") {
			player_places_obstacle_with_chip(player, battle_chip);
		}  else if (types.length > 1 && types.includes("Terrain")) { 
			player_sets_terrain_with_chip(player, battle_chip);
		} else if (types.includes("Steal_Control")) {
			player_steals_control_of_near_column(player);
		} else {
			console.log("ERROR: Unhandled nondamaging chip: " + battle_chip);
		};
	}
}

function i_take_my_turn(player) {
	turns += 1;
	report(`${name_of(player)}'s turn. (${player.hp}/${player.max_hp})`);
	before_every_turn();
	my_battle_chip = conjure_a_random_battle_chip();
	i_use_this_battle_chip(player, my_battle_chip);
}

// *** world action methods ****************************************************

function before_every_full_round() { return; }

function before_every_turn() {
	const get_amount = (obstacle) => {
		return parseInt(grab_after_equals(
			obstacle.chip[TYPES_INDEX].split(' '), "Amount"
		), 10);
	}

	obstacles.forEach(obstacle => {
		switch (obstacle.every_turn_effect) {
			case "Candle": // Candle recovers allies and burns itself down
				amount = get_amount(obstacle);
				var player = player1.is_east == obstacle.is_east
					? player1 : player2;
				if (player.hp <= player.max_hp) {
					heal_player_by_amount(player, amount);
				}
				obstacle.hp -= amount;
				if (obstacle.hp <= 0) {
					report(`${name_of(obstacle.chip)} has burned out.`)
					delete_obstacle(obstacle);
				}
				break;
			case "Poison":
				amount = get_amount(obstacle);
				var player = player1.is_east != obstacle.is_east
					? player1 : player2;
				player.hp -= amount;
				var message = `${name_of(player)} takes ${amount} poison damage`
					+ ` from ${name_of(obstacle.chip)}.`;
				report(message);
				if (is_kod(player)) {
					player_kos_target_with_chip(
						player.target, player, obstacle.chip
					);
				}
				break;
		}
	})
}

function player_places_obstacle_with_chip(player, battle_chip) {
	const types = battle_chip[TYPES_INDEX].split(' ');
	const placement = types[0];
	const max_hp = grab_after_equals(types, "HP") || 1;
	const element = battle_chip[ELEMENT_INDEX] || "None";
	var spaces = [];
	switch (placement) {
		case "Close":
			spaces = [
				[player.space[0] + (player.is_east ? -1 : 1), player.space[1]]
			];
			if (is_space_occupied(spaces[0]) || is_space_gap(spaces[0])) {
				spaces.length = 0;
			}
			break;
		case "Enemy_Random_3":
			var free_enemy_spaces = ALL_SPACES.filter(space => 
				!does_player_control_space(player, space)
					&& !is_space_occupied(space) && !is_space_gap(space)
			);
			shuffle(free_enemy_spaces);
			spaces = free_enemy_spaces.slice(0, 3);
			break;
		case "Own_Back":
			spaces = player.is_east ? 
				[[5, 0], [5, 1], [5, 2]] : [[0, 0], [0, 1], [0, 2]];
			spaces = spaces.filter(space => 
				!is_space_occupied(space) && !is_space_gap(space)
			);
			spaces = spaces.length ? [random_item(spaces)] : [];
			break;
		default:
			console.log(
				"ERROR: unhandled place for obstacle chip: " + battle_chip
			);
	}

	if (spaces.length == 0) return; // TODO: add report

	const chip_name = name_of(battle_chip);
	const every_turn = grab_after_equals(
		battle_chip[TYPES_INDEX].split(' '), "Every_Turn"
	)
	spaces.forEach(space => {
		const new_obstacle = {
			kind: 'Obstacle',
			hp: max_hp,
			max_hp: max_hp,
			element: element,
			every_turn_effect: every_turn, 
			space: space,
			is_east: player.is_east,
			name: chip_name,
			chip: battle_chip,
		};
		obstacles.push(new_obstacle);
	});

	const chips_placed = (spaces.length == 1)
		? `${a_or_an(chip_name)} ${chip_name}`
		: `${spaces.length} ${chip_name}s`;
	report (`${name_of(player)} places ${chips_placed} on the battlefield.`);
}

function player_sets_terrain_with_chip(player, battle_chip) {
	const types = battle_chip[TYPES_INDEX].split(' ');
	var spaces = [];
	switch (types[0]) { 
		case 'Close':
			var space = [
				player.space[0] + (player.is_east ? -1 : 1), player.space[1]
			];
			spaces = is_battle_chip_wide(battle_chip) ? 
				get_widened_spaces([space]) : [space];
			spaces = spaces.filter(space => is_space_valid(space));
			break;
		case 'Own_Area':
			spaces = ALL_SPACES.filter(space => 
				does_player_control_space(player, space)
			);
			break;
		case 'Both_Areas':
			spaces = ALL_SPACES;
			break;
	}
	if (spaces.length == 0) return;
	var new_terrain = types[2]; // hacky but should works for BN1 battle chips
	var spaces_changed = 0;
	spaces.forEach(space => {
		var old_terrain = terrain[space[0]][space[1]];
		if (old_terrain == "Broken" && new_terrain != "Normal") return;
		var is_cracked_override =
			new_terrain == "Broken" && is_space_occupied(space);
		set_terrain = is_cracked_override ? "Cracked" : new_terrain;
		if (old_terrain != set_terrain) {
			terrain[space[0]][space[1]] = set_terrain;
			spaces_changed++;
		}
	});
	report(`${name_of(player)} changes ${spaces_changed} to ${new_terrain}.`);
}

function report(message) { 
	console.log(message);
	reporter.interpreters.forEach(interpreter => { interpreter(message); });
}

function deal_damage_amount_from_player_to_target_with_chip(
	amount, player, target, battle_chip)
{
	var damage = amount;
	const chip_element = battle_chip[ELEMENT_INDEX] || "None";
	const target_element = target.element || "None";
	const both_elemental = (chip_element != "None" && target_element != "None")

	var is_a_weakness_hit = false;
	if (both_elemental && is_weak_to(target_element, chip_element)) {
		damage = Math.floor(damage * 1.5);
		is_a_wakness_hit = true;
	}

	var does_heal_self = false;
	var does_heal_target = false;
	var is_multi = false;
	var multi_factor = 1;

	const types = battle_chip[TYPES_INDEX].split(' ');
	types.forEach(type => {
		switch(type) {
			case 'x3':
				multi_factor = random_item([1, 2, 3, 3]);
			break;
			case 'x5':
				multi_factor = random_item([1, 2, 3, 4, 5, 5, 5]);
			break;
			case 'x8':
				multi_factor = random_item(
					[1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8]
				);
			break;
			case 'Drain': does_heal_self = true;
			break;
		}
	});

	if (has_barrier(target)) {
		var does_aura_negate = false;
		const barrier_element = target.barrier_chip[ELEMENT_INDEX] || "None";
		if (target.barrier_effect != "None" 
			&& !is_weak_to(barrier_element, chip_element))
		{
			switch (target.barrier_effect) {
				case 'Aura':
					if (damage < target.aura_damage) does_aura_negate = true;
					break;
				case 'Recover':
					does_heal_target = true;
					break;
				case 'Refresh':
					target.barrier_refresh_cooldown = 2;
			}
		}

		const barrier_name = name_of(target.barrier_chip);
		if (does_aura_negate) {
			multi_factor = 0;
			report(`${name_of(target)}'s ${barrier_name} negates all damage.`)
		} else  {
			target.barrier_chip = null;
			multi_factor -= 1;
			if (multi_factor > 0) {
				report(
					`${name_of(target)}'s ${barrier_name} blocks one hit and is broken.`
				);
			} else {
				report(
					`${name_of(target)}'s ${barrier_name} blocks the hit and is broken.`
				);
			}
			if (does_heal_target) heal_player_by_amount(target, damage);
		}
	} else if (has_shield(target)) {
		const shield_name = name_of(target.shield_chip);
		report(`${name_of(target)}'s ${shield_name} blocks the attack.`);
	}


	damage *= multi_factor;
	if (damage > 0) {
		target.hp -= damage;
		report(
			`${name_of(player)} deals ${amount} damage to ${name_of(target)}.`
		);
		if (does_heal_self) heal_player_by_amount(player, damage);
		if (target.kind == "Obstacle" && types.includes("Breaker")) {
			target.hp = 0;
		}
	}

	if (is_kod(target)) {
		target.hp = 0;
		player_kos_target_with_chip(player, target, battle_chip);
	}
}

function player_misses_with_chip(player, battle_chip) {
	report(`${name_of(player)} misses.`);
}

function player_steals_control_of_near_column(player) {
	const is_stealing_east = !player.is_east;
	var steal_i = -1;
	if (is_stealing_east) { 
		steal_i = [0, 1, 2, 3, 4, 5].find(i => 
			[[i, 0], [i, 1], [i, 2]].some(space => is_space_east(space))
		);
	} else {
		steal_i = [5, 4, 3, 2, 1, 0].find(i =>
			[[i, 0], [i, 1], [i, 2]].some(space => !is_space_east(space))
		);
	}
	var spaces = [[steal_i, 0], [steal_i, 1], [steal_i, 2]];
	spaces = spaces.filter(space =>
		!is_space_occupied(space) && is_space_east(space) != player.is_east
	);
	
	if (spaces.length == 0) {
		report(`${name_of(player)} could not steal control of any panels.`);
		return;
	}

	spaces.forEach(space => { 
		are_spaces_east[space[0]][space[1]] = player.is_east;
	});
	report(`${name_of(player)} steals control of ${spaces.length} panels.`);
}

function delete_obstacle(obstacle) {
	const obstacle_index = obstacles.indexOf(obstacle);
	if (obstacle_index == -1) {
		console.log("ERROR: obstacle to delete not found");
		return;
	}
	obstacles.splice(obstacle_index, 1);
}

function player_kos_target_with_chip(player, target, battle_chip) {
	if (target.kind == "Navi") {
		const chip_id = parseInt(battle_chip[0], 10);
		// report(`${name_of(target)} has been KOd by ${name_of(player)}!`);
		player.records.chip_kos_by_id[chip_id] ||= 0;
		player.records.chip_kos_by_id[chip_id]++;
		return;
	}

	report(`${name_of(target)} is deleted.`);
	delete_obstacle(target);
}

function print_the_stage() {
	const column_size = 15;
	function player_name_at(space) {
		// TODO: getting occupant this way is inefficient;
		// perhaps assign them all to an i,j map instead
		var occupant = get_occupant(space);
		var color = is_space_east(space) ? red : blue;
		var terrain_map = {"Normal": "_", "Broken": "/", "Cracked": "."}
		var terrain_char = terrain_map[terrain[space[0]][space[1]]];
		return color + (occupant ? name_of(occupant) : "")
			.padEnd(column_size, terrain_char) + color_reset;
	}
	const line_string = ` -----------------------------------------------------`
		+ `------------------------------------------ `;
	console.log(line_string);
	for (var j = 0; j < 3; j++) {
		var panel_strings = ["[" + player_name_at([0, j])];
		for (var i = 1; i < 5; i++) {
			panel_strings.push(player_name_at([i, j]));
		}
		panel_strings.push(player_name_at([5, j]) + "]");
		console.log(panel_strings.join('|'));
		console.log(line_string);
	}
}

function heal_player_by_amount(player, amount) {
	if (player.hp == player.max_hp) {
		report(`${name_of(player)} is already at max HP.`)
		return;
	}
	player.hp = Math.min(player.hp + amount, player.max_hp);
	
	if (player.hp == player.max_hp) {
		report(`${name_of(player)} recovers to max HP.`)
		return;
	}

	report(`${name_of(player)} recovers ${amount} HP.`);
}

function conjure_a_random_battle_chip(rerolls = 0) {
	chips_by_rarity = get_chips_by_rarity();
	random_value = Math.random();
	if (random_value >= 0.50) return random_item(chips_by_rarity[1]);
	if (random_value >= 0.20) return random_item(chips_by_rarity[2]);
	if (random_value >= 0.08) return random_item(chips_by_rarity[3]);
	if (random_value >= 0.02) return random_item(chips_by_rarity[4]);
	return random_item(chips_by_rarity[5]);
}

function game_tied() {
	report(`It's a tie!`);
	[player1, player2].forEach(p => { p.records.ties++; p.record.matches++; });
}

function player_defeats_player(winner, loser) {
	report(`${name_of(winner)} has defeated ${name_of(loser)}!`);
	
	winner.records.chip_ids_used_this_match.forEach(chip_id => {
		winner.records.chip_uses_by_id[chip_id] ||= 0;
		winner.records.chip_uses_by_id[chip_id]++;

		winner.records.chip_wins_by_id[chip_id] ||= 0;
		winner.records.chip_wins_by_id[chip_id]++;
	});

	loser.records.chip_ids_used_this_match.forEach(chip_id => {
		loser.records.chip_uses_by_id[chip_id] ||= 0;
		loser.records.chip_uses_by_id[chip_id]++;

		loser.records.chip_losses_by_id[chip_id] ||= 0;
		loser.records.chip_losses_by_id[chip_id]++;
	});

	winner.records.wins++;
	loser.records.losses++;
	winner.records.matches++;
	loser.records.matches++;
}

function reset_game() {
	[player1, player2].forEach(p => {
		p.hp = p.max_hp;
		p.barrier_chip = null;
		p.shield_chip = null;
	});
	obstacles.length = 0;
	[0, 1, 2, 3, 4, 5].forEach(i => 
		terrain[i] = ['Normal', 'Normal', 'Normal']
	);
	[0, 1, 2].forEach(i => are_spaces_east[i] = [false, false, false]);
	[3, 4, 5].forEach(i => are_spaces_east[i] = [true, true, true]);
	report(`Game reset.`);
}

function game_round(interval = null) {
	print_the_stage();
	before_every_full_round();
	i_take_my_turn(player1);
	if (!is_kod(player2)) i_take_my_turn(player2);

	if (is_the_game_over()) {
		player1_is_kod = is_kod(player1);
		player2_is_kod = is_kod(player2);
		if (player1_is_kod && player2_is_kod) {
			game_tied();
		} else if (player1_is_kod) {
			player_defeats_player(player2, player1);
		} else {
			player_defeats_player(player1, player2);
		}

		matches_played++;
		player1.records.chip_ids_used_this_match.length = 0;
		player2.records.chip_ids_used_this_match.length = 0;

		if (interval && matches_played >= _interval_matches_to_play) {
			clearInterval(interval);
			final_report();
		} else {
			reset_game();
		}
	}
}

function final_report() {
	player1.target = null;
	player2.target = null;
	battle_chip_data_from_bn1.forEach(chip => {
		chip_id = parseInt(chip[0], 10);
		if (!chip_id) return;
		var uses = (player1.records.chip_uses_by_id[chip_id] || 0)
			+ (player2.records.chip_uses_by_id[chip_id] || 0);
		if (!uses) return;
		var wins = (player1.records.chip_wins_by_id[chip_id] || 0)
			+ (player2.records.chip_wins_by_id[chip_id] || 0);
		console.log(`${chip} winrate: ${((wins + 0.0)/uses).toFixed(3)}`)
	})
	console.log(
		`Average turns per match: ${(turns/matches_played).toFixed(1)}`
	);
}

// top level execution

function run_game(use_timer, matches_to_play = 3) {
	if (use_timer) {
		_interval_matches_to_play = matches_to_play;
		var interval = setInterval(() => game_round(interval), 100);
	} else {
		while (matches_played < matches_to_play) game_round();
		final_report();
	}
}

console.log("Mechanics loaded.");