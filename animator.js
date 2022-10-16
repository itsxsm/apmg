console.log("Animator is loading.");

if (!log_error) {
    function log_error(message) { console.log(`ERROR: ${message}`); }
}

if (!reporter || !player1) {
    log_error("load Mechanics before Animator");
    throw new Error("script loading order error");
}

const ALL_POSES = ["standing", "attacking", "struck"];
const ALL_STANDARD_CHIP_TYPES = ["Shot", "Sword", "Toss"];
const SPECIAL_CHIP_ANIMATIONS = {};
var _cache_buster = 0;

const ANIMATION_TIMES_MS = {
    "Recover": 500,
};

function grab_after_dash(space_delim_string, word) {
    if (!space_delim_string || !word) return null;
    const words = space_delim_string.split(' ');
    for (var i = 0; i < words.length; i++) {
        var parts = words[i].split('-');
        if (parts.length == 2 && parts[0] == word) return parts[1];
    }
    return null;
}

sprites = [
    // TODO: use document.onload so scripts don't have to be after structure?

    // TODO: check if, instead of specifying both sides directly,
    // east offsets can be calculated from west offsets, or,
    // east offsets can be implemented by using right instead of left.
    {
        id: "protoman",
        navi: player1,
        div: document.getElementById("protoman"),
        hp_div: document.getElementById("protoman-hp"),
        barrier_div: document.getElementById("protoman-barrier"),
        effect_div: document.getElementById("protoman-effect"),
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
        pose: "standing"
    },
    {
        id: "magicman",
        navi: player2,
        div: document.getElementById("magicman"),
        hp_div: document.getElementById("magicman-hp"),
        barrier_div: document.getElementById("magicman-barrier"),
        effect_div: document.getElementById("magicman-effect"),
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
        pose: "standing"
    }
];

card_divs = [0, 1, 2, 3, 4].map(idx => {
    return document.getElementById(`battle-chip-card-${idx}`);
});

// for some reason, cannot assign navi references as keys?
// this results in an object with only one key...
// sprites_by_navi = {};
// sprites_by_navi[player1] = sprites[0];
// sprites_by_navi[player2] = sprites[1];
// keep it simple for now by not having the dictionary at all

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

function get_sprite_by_navi(navi) {
    if (navi == player1) return sprites[0];
    if (navi == player2) return sprites[1];
    log_error(`invalid navi to get_sprite_by_navi`);
    return undefined;
}

function check_and_rescue_sprite(sprite) {
    if (sprite?.div) return sprite;
    
    log_error("non-sprite passed to sprite method")
    if (is_navi(sprite)) return get_sprite_by_navi(sprite);
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
    sprite.div.classList.replace(sprite.pose, pose);
    sprite.pose = pose;

    // TODO: obstacle left offsets were replaced with margin-left settings,
    // see if the same can be done for navi poses

    const navi = sprite.navi;
    const side = navi.is_east ? "east" : "west";
    const left_offset_0 =
        sprite.left_offset_0s_by_side_and_pose[side][sprite.pose];

    const space = navi.space;
    var bottom_px = get_bottom_line_px_for_j(space[1]) + 2;

    sprite.div.style.left = (space[0] * 40 + left_offset_0) + "px";
    sprite.div.style.bottom = bottom_px + "px";
    sprite.div.style.zIndex = get_z_index_for_j(space[1]) + 10;
}

function set_sprite_hp(sprite, hp) {
    sprite = check_and_rescue_sprite(sprite);
    if (!sprite.navi) return;
    sprite.hp_div.innerHTML = hp;
}

function repaint_for_turn_start() {
    [player1, player2].forEach(p => {
        if (p == player1) repaint_battle_chip_cards();
        const sprite = get_sprite_by_navi(p);
        set_sprite_pose(sprite, "standing");
        set_sprite_hp(sprite, p.hp);
    });
}

// TODO: when this function is updated for true animation,
// rename paint -> animate
function paint_navi_uses_chip_type_on_target(
    navi, chip_type, target, does_hit = true)
{
    const sprite = get_sprite_by_navi(navi);

    // TODO: fix for obstacle targets
    const target_sprite =
        target ? get_sprite_by_navi(target) : null;

    // for now fixed attacking pose stands in for all chip uses
    set_sprite_pose(sprite, "attacking");
    if (target_sprite && does_hit) { set_sprite_pose(target_sprite, "struck"); }
}

function repaint_barriers(for_move_only = false) {
    [sprites[0], sprites[1]].forEach(sprite => {
        const div = sprite.barrier_div;

        // there's nothing to do on move with the semitransparent child div
        // barrier, but for barrier behind we'll need to move the barrier div
        // whenever the navi moves.
        if (for_move_only) return;

        var old_class = grab_after_dash(div.className, "barrier");
        if (old_class) old_class = `barrier-${old_class}`;
        if (!sprite.navi.barrier_chip) {
            if (old_class) div.classList.remove(old_class);
            return;
        }

        //const new_class = `barrier-${p.barrier_chip}`;
        const new_class = "barrier-Barrier";

        if (old_class) {
            div.classList.replace(old_class, new_class);
        } else {
            div.classList.add(new_class);
        }
    });
}

function repaint_barriers_for_move() { repaint_barriers(true) }

function move_navi_to_space(navi, space) {
    if (!are_spaces_equal(space, navi.space))
        log_error("animator got move message out of sync with navi");
    const sprite = get_sprite_by_navi(navi);
    const side = navi.is_east ? "east" : "west";
    const left_offset_0 =
        sprite.left_offset_0s_by_side_and_pose[side][sprite.pose];
    var bottom_px = get_bottom_line_px_for_j(space[1]) + 2;

    sprite.div.style.left = (space[0] * 40 + left_offset_0) + "px";
    sprite.div.style.bottom = bottom_px + "px";
    sprite.div.style.zIndex = get_z_index_for_j(space[1]) + 10;
}

function repaint_battle_chip_cards() {
    card_divs.forEach((div, idx) => {
        const card_number = player1.hand[idx][0].padStart(3, 0);
        div.style.backgroundImage =
            `url('sprites/cards_bn1/card${card_number}.gif')`;
    });
}

function repaint_terrain() {
    ;
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

function paint_recover_effect_on_navi(navi) {
    const effect_div = get_sprite_by_navi(navi).effect_div;
    effect_div.classList.add("effect-Recover");
    const background =
        `url("sprites/recover_anim_ge.gif?cache_buster=${_cache_buster++}")`;
    effect_div.style.backgroundImage = background;
    setTimeout(() => {
        effect_div.classList.remove("effect-Recover");
        effect_div.style.backgroundImage = "none";
    }, ANIMATION_TIMES_MS["Recover"]);
}

function get_bottom_line_px_for_j(j) { return [60, 36, 8][j]; }

function get_z_index_for_j(j) { return 100 * (j + 1); }

function repaint_obstacles() {
    // not the most efficient, but simple: remove everything and then recreate

    sprites.filter(sprite => !sprite.navi).forEach(sprite => {
        sprite.div.remove();
    });
    sprites.length = 2;

    obstacles.forEach((obstacle, index) => {
        const div = document.createElement("div");
        const name = name_of(obstacle);

        const bottom_px = get_bottom_line_px_for_j(obstacle.space[1]) + 2;

        div.id = "obstacle-" + index;
        div.style.position = "absolute";
        div.style.left = (obstacle.space[0] * 40) + "px";
        div.style.bottom = bottom_px + "px";
        div.style.zIndex = get_z_index_for_j(obstacle.space[1]);

        const chip_series =
            `obstacle-${trim_trailing_digit(name_of(obstacle.chip))}`;
        div.classList.add("obstacle", chip_series);
        sprites.push({
            id: name,
            div: div,
            left_offset_west_0: 0,
            left_offset_east_0: 0
        });
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
        repaint_barriers_for_move();
    } else if (message.includes(" steals control ")) {
        repaint_panel_control();
    } else if (message == "Game reset.") {
        repaint_obstacles();
        move_navi_to_space(player1, [0, 0]);
        move_navi_to_space(player2, [5, 2]);
        repaint_panel_control();
        repaint_battle_chip_cards();
        repaint_barriers();
    } else if (message.includes(" damage to ")) {
        const navi = get_navi_by_name(words[0]);
        const target = get_navi_by_name(words[5]);
        paint_navi_uses_chip_type_on_target(navi, "Shot", target, true);
        if (is_navi(target)) {
            const target_sprite = get_sprite_by_navi(target);
            set_sprite_hp(target_sprite, target.hp);
        }
    } else if (message.includes(" misses")) {
        const navi = get_navi_by_name(words[0]);
        paint_navi_uses_chip_type_on_target(navi, "Shot", undefined, false);
    } else if (message.includes(" places ")
        || message.endsWith(" is deleted.")
        || message.endsWith(" has burned out."))
    {
        repaint_obstacles();
    } else if (message.endsWith("raises a barrier.")
        || message.endsWith("and is broken.")) {
        repaint_barriers();
    } else if (message.includes( " recovers " )) {
        const navi = get_navi_by_name(words[0]);
        if (navi) paint_recover_effect_on_navi(navi);
    } else if (message.includes(" cannot line up ")
        || (message.includes(" uses ") && words.length == 3)
        || message.includes(" is already at max HP"))
    {
        ; // nothing to do
    } else if (message.includes(" changes the terrain ")) {
        repaint_terrain();
    } else {
        console.log(`-> no animation interpreter for message: ${message}`);
    }
}

reporter.interpreters.push(animate_message);

// TODO: hands are not yet assigned at load time, change for faster testing
// repaint_battle_chip_cards();

console.log("Animator loaded.");
