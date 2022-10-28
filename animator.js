console.log("Animator is loading.");

if (!log_error) {
    function log_error(message) { console.log(`ERROR: ${message}`); }
}

if (!reporter || !player1) {
    log_error("load Mechanics before Animator");
    throw new Error("script loading order error");
}

let turn_start_absolute_ms = Date.now();
const ALL_POSES = ["standing", "attacking", "struck", "shooting", "slashing"];
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

const sprites = [
    // TODO: use document.onload so scripts don't have to be after structure?

    // TODO: check if, instead of specifying both sides directly,
    // east offsets can be calculated from west offsets, or,
    // east offsets can be implemented by using right instead of left.
    {
        navi: player1,
        div: document.getElementById("navi-1"),
        hp_div: document.getElementById("navi-1-hp"),
        barrier_div: document.getElementById("navi-1-barrier"),
        effect_div: document.getElementById("navi-1-effect"),
        pose: "standing"
    },
    {
        navi: player2,
        div: document.getElementById("navi-2"),
        hp_div: document.getElementById("navi-2-hp"),
        barrier_div: document.getElementById("navi-2-barrier"),
        effect_div: document.getElementById("navi-2-effect"),
        pose: "standing"
    }
];

const navi_sprite_settings_by_name = {
    // TODO: any simple way to infer these from defined CSS classes?
    'ProtoMan.nav': {
        max_frame_for_pose: {
            'shooting': 5,
            'slashing': 9
        }
    },
    'MegaMan.nav': {
        max_frame_for_pose: {
            'shooting': 5,
            'slashing': 6,
            'throwing': 4
        }
    },
    'Roll.nav': {
        max_frame_for_pose: {
            'shooting': 5,
            'slashing': 6
        }
    },
    'GutsMan.nav': {
        max_frame_for_pose: {
            'shooting': 5,
            'slashing': 5
        }
    },
    'Ring.nav': {
        max_frame_for_pose: {
            'slashing': 6 
        }
    },
    'ElecMan.nav': {
        max_frame_for_pose: {
            'shooting': 3,
            'slashing': 4
        },
    }
}

const card_divs = [0, 1, 2, 3, 4].map(idx => {
    return document.getElementById(`battle-chip-card-${idx}`);
});

const fill_div = document.getElementById("turn-timer-fill");
const nofill_div = document.getElementById("turn-timer-nofill");

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

function get_occupant_by_name(name) {
    if (name.endsWith(".nav")) return get_navi_by_name(name);

    var obstacle = null;
    if (!name.includes(" ")) {
        obstacle = obstacles.find(o => o.name == name);
    } else {
        const [o_name, unique_id] = name.split(" ");
        obstacle = obstacles.find(o => {
            return o.name == o_name && o.unique_id == unique_id;
        });
    }

    if (obstacle) return obstacle;
    console.log(`ERROR: no occupant found for name: ${name}`);
    return undefined;
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
function set_sprite_pose(sprite, pose, frame = -1) {
    sprite = check_and_rescue_sprite(sprite);
    if (!sprite) return;

    if (!ALL_POSES.includes(pose)) {
        log_error(`set_sprite_pose got unrecognized pose: ${pose}`);
        return;
    }
    if (sprite.div.classList.contains(pose)) {
        if (frame == -1) return;
    } else {
        sprite.div.classList.replace(sprite.pose, pose);
        sprite.pose = pose;
    }

    if (frame != -1) {
        old_frame = grab_after_dash(sprite.div.className, "frame");
        if (old_frame != null) {
            old_frame = `frame-${old_frame}`;
            sprite.div.classList.replace(old_frame, `frame-${frame}`);
        } else {
            sprite.div.classList.add("frame-0");
        }
    }
}

function set_sprite_hp(sprite, hp) {
    sprite = check_and_rescue_sprite(sprite);
    if (!sprite.navi) return;
    sprite.hp_div.innerHTML = hp;
}

function repaint_for_turn_start() {
    repaint_battle_chip_cards();
    [player1, player2].forEach(p => {
        const sprite = get_sprite_by_navi(p);
        set_sprite_pose(sprite, "standing");
        set_sprite_hp(sprite, p.hp);
    });

    if (last_to_act == player2) {
        fill_div.style.backgroundColor = "maroon";
        nofill_div.style.backgroundColor = "pink";
    } else {
        // player's fill is red because the player is on red panels by default
        // maybe change to look more like CustomGauge in the future?
        fill_div.style.backgroundColor = "darkcyan";
        nofill_div.style.backgroundColor = "lightcyan";
    }
}

function max_frame_for_sprite_animation(sprite, pose_name) {
    const settings = navi_sprite_settings_by_name[sprite.navi.name];
    if (!(pose_name in settings.max_frame_for_pose)) return 0;
    return settings.max_frame_for_pose[pose_name];
}

function place_swoosh(swoosh_div) {
    const navi = anim_data.enactor;
    var [swoosh_i, swoosh_j] = navi.space;
    if (is_battle_chip_wide(navi.battle_chip)) {
        swoosh_j--;
        swoosh_div.classList.add("hits-Wide");
    } else {
        swoosh_div.classList.remove("hits-Wide");
    }

    swoosh_div.style.top = `${70 + swoosh_j * 36}px`;
    if (swoosh_div.classList.contains("east")) {
        swoosh_i--;
        swoosh_div.style.left = "unset";
        swoosh_div.style.right = `${(5 - swoosh_i) * 40}px`;
    } else {
        swoosh_i++;
        swoosh_div.style.left = `${swoosh_i * 40}px`;
        swoosh_div.style.right = "unset";
    }
}

function run_swoosh_animation(total_ms, frame) {
    var swoosh_div_id = anim_data.enactor == player1 ? "swoosh-1" : "swoosh-2";
    var swoosh_div = document.getElementById(swoosh_div_id);
    if (frame == 4) {
        swoosh_div.classList.remove("frame-3");
        return;
    }
    if (frame == 0) {
        place_swoosh(swoosh_div);
        swoosh_div.classList.add("frame-0");
    } else {
        swoosh_div.classList.replace(`frame-${frame - 1}`, `frame-${frame}`);
    }
    const delay = Math.round(total_ms / 4, 0);
    setTimeout(() => run_swoosh_animation(total_ms, frame + 1), delay);
}

function run_sprite_frame_animation(
    sprite, pose, total_ms, frame, last_frame)
{
    set_sprite_pose(sprite, pose, frame);
    if (frame >= last_frame) return;

    const delay = Math.round(total_ms / (last_frame + 1), 0);
    setTimeout(() => {
        run_sprite_frame_animation(
            sprite, pose, total_ms, frame + 1, last_frame
        );
    }, delay);
}

function animate_move() {
    if (!anim_data.moves_to) return 'skip';
    const navi_sprite = get_sprite_by_navi(anim_data.enactor);
    move_sprite_to_space(navi_sprite, anim_data.moves_to);
    anim_data.moves_to = null;
}
function animate_windup() {
    const pose = anim_data.attack_pose || "attacking";
    const navi_sprite = get_sprite_by_navi(anim_data.enactor); 
    // set_sprite_pose(navi_sprite, "attacking");
    max_frame = max_frame_for_sprite_animation(navi_sprite, pose);
    if (max_frame == 0) {
        set_sprite_pose(navi_sprite, pose);
    } else {
        run_sprite_frame_animation(navi_sprite, pose, 240, 0, max_frame);
    }

    if (pose == "slashing") run_swoosh_animation(240, 0);
}
function animate_wave() { ; }
function animate_result() {
    if (anim_data.dodges_to) {
        const dodger_sprite = get_sprite_by_navi(
            get_opponent(anim_data.enactor)
        );
        move_sprite_to_space(dodger_sprite, anim_data.dodges_to);
        anim_data.dodges_to = null;
    };

    anim_data.strikes.forEach(target => {
        if (!is_navi(target)) return;
        const target_sprite = get_sprite_by_navi(target);
        set_sprite_pose(target_sprite, "struck");
    });
}
function reset_standing_poses() {
    anim_data.enactor = null;
    anim_data.attack_pose = null;
    anim_data.spaces_hit = [];
    anim_data.moves_to = null;
    anim_data.dodges_to = null;
    anim_data.strikes.length = 0;
    set_sprite_pose(sprites[0], "standing");
    set_sprite_pose(sprites[1], "standing");
}

const animation_queue = [];

function run_animation() {
    if (animation_queue.length == 0) {
        if (!is_the_game_over()) {
            _interval_settings.active_interval = setInterval(
                () => game_turn(), _interval_settings.interval_time
            );
        }
        return;
    }

    [start_animation, end_animation, timeout_ms] = animation_queue[0];
    animation_queue.shift();

    var skip = false;
    if (start_animation) skip = start_animation() == 'skip';

    if (timeout_ms == 0 || skip) {
        if (end_animation) end_animation();
        run_animation();
        return;
    }
    setTimeout(() => {
        if (end_animation) end_animation();
        run_animation();
    }, timeout_ms);
}

function animate_navi_uses_chip_on_target(
    navi, target, does_hit = true)
{
    clearInterval(_interval_settings.active_interval);

    anim_data.enactor = navi;
    if (target && does_hit) anim_data.strikes = [target];

    const battle_chip = anim_data.enactor.battle_chip;
    const is_sword = battle_chip[TYPES_INDEX].split(' ')[0] == "Sword";
    anim_data.attack_pose = is_sword ? "slashing" : "shooting";

    const animations = [
        [animate_move, null, 500], 
        [animate_windup, null, 250],
        [animate_wave, null, 0],
        [animate_result, reset_standing_poses, 500],
    ]
    animations.forEach(animation => {
        animation_queue.push(animation);
    });
    run_animation();
}

function repaint_barriers() {
    [sprites[0], sprites[1]].forEach(sprite => {
        const div = sprite.barrier_div;
        const barrier_chip = sprite.navi.barrier_chip;

        var old_class = grab_after_dash(div.className, "barrier");
        if (old_class) old_class = `barrier-${old_class}`;
        if (!barrier_chip) {
            if (old_class) div.classList.remove(old_class);
            return;
        }

        var new_class = "barrier-Barrier";
        const barriers_with_sprites = [
            "AquaAura", "WoodAura", "FireAura", "LifeAura"
        ];
        if (barriers_with_sprites.includes(name_of(barrier_chip)))
            new_class = `barrier-${name_of(barrier_chip)}`;

        if (old_class) {
            div.classList.replace(old_class, new_class);
        } else {
            div.classList.add(new_class);
        }
    });
}

function move_sprite_to_space(sprite, space) {
    if (!are_spaces_equal(sprite.navi.space, space))
        log_error("animator got move message out of sync with navi");

    if (sprite.navi.is_east) {
        sprite.div.style.left = "unset";
        sprite.div.style.right = 40 * (5 - space[0]) + "px";
    } else {
        sprite.div.style.left = (space[0] * 40) + "px";
        sprite.div.style.right = "unset";
    }
    var bottom_px = get_bottom_line_px_for_j(space[1]) + 2;
    sprite.div.style.bottom = bottom_px + "px";
    sprite.div.style.zIndex = get_z_index_for_j(space[1]) + 10;
}

function repaint_battle_chip_cards() {
    const [slot, chooser] = get_chip_slot_and_chooser(player1);
    card_divs.forEach((div, idx) => {
        const card_number = player1.hand[idx][0].padStart(3, 0);
        div.style.backgroundImage =
            `url('sprites/cards_bn1/card${card_number}.gif')`;
        if (idx == slot) {
            div.classList.add("chosen");
            if (chooser == "Operator") div.classList.add("operator-choice");
        } else {
            div.classList.remove("chosen", "operator-choice");
        }
        if (!player1.are_chips_useful[idx]) {
            div.classList.add("not-useful");
        } else {
            div.classList.remove("not-useful");
        }

        const battle_chip = player1.hand[idx];
        // TODO: collect divs once at start instead
        document.getElementById(`chip-name-${idx}`).innerHTML
         = name_of(battle_chip);
        var damage_str = battle_chip[DAMAGE_INDEX];
        if (damage_str == "") damage_str = "-";
        const info_div = document.getElementById(`chip-info-${idx}`);
        if (parseInt(damage_str, 10) < 0) {
            info_div.classList.add("recover");
            damage_str = damage_str.slice(1);
        } else {
            info_div.classList.remove("recover");
        };
        info_div.innerHTML = damage_str;
    });
}

/* TODO: should be able to just grab everything with class terrain instead */
const _terrain_divs = [0, 1, 2, 3, 4, 5].flatMap(i => {
    return [0, 1, 2].map(j => document.getElementById(`terrain_${i}_${j}`));
});

function repaint_terrain() {
    _terrain_divs.forEach(div => {
        const [i, j] = div.id.split('_').slice(1, 3).map(x => parseInt(x, 10));
        const old_terrain = grab_after_dash(div.className, "terrain");
        const new_terrain = terrain[i][j];
        if (new_terrain == old_terrain) return;
        div.classList.replace(
            `terrain-${old_terrain}`, `terrain-${new_terrain}`
        );
    });
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
        document.getElementById("battlefield").insertBefore(div, obstacle_anchor);
    });
}

function navi_name_to_class(navi_name) {
    return navi_name.split('.')[0].toLowerCase();
}

function set_navis() {
    document.getElementById("navi-1").classList.add(
        navi_name_to_class(player1.name)
    );
    document.getElementById("navi-2").classList.add(
        navi_name_to_class(player2.name)
    );
    [sprites[0], sprites[1]].forEach(sprite => {
        move_sprite_to_space(sprite, sprite.navi.space);
    });
}

function paint_navi_kos_target(navi, koed_navi) {
    get_sprite_by_navi(koed_navi).div.style.display = "none";
}

function repaint_turn_countdown(elapsed_ratio) {
    const total_width = 232;
    const fill_width = Math.round(elapsed_ratio * total_width, 0);
    const nofill_width = total_width - fill_width;
    fill_div.style.width = fill_width + "px";
    nofill_div.style.width = nofill_width + "px";
}

function start_turn_countdown_painter() {
    // TODO: this looks jittery at high FPS; maybe try using
    // requestAnimationFrame or CSS animation/transation
    setInterval(() => {
        const elapsed_time_ms = Date.now() - turn_start_absolute_ms;
        let elapsed_ratio = elapsed_time_ms / _interval_settings.interval_time;
        if (elapsed_ratio > 1.0) elapsed_ratio = 1.0;
        repaint_turn_countdown(elapsed_ratio);
    }, 150);
}

const anim_data = {
    enactor: null,
    moves_to: null,
    battle_chip: null,
    dodges_to: null,
    strikes: [],
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

    // this if-else should be ordered to exit as early as possible, using
    // faster checks (==, startsWith, endsWith) before slower (includes)

    if (last_char == ')' && message.includes("'s turn")) {
        turn_start_absolute_ms = Date.now();
        repaint_for_turn_start();
    } else if (message == "Game reset.") {
        sprites[0].div.style.display = "initial";
        sprites[1].div.style.display = "initial";
        repaint_obstacles();
        move_sprite_to_space(get_sprite_by_navi(player1), [0, 0]);
        move_sprite_to_space(get_sprite_by_navi(player2), [5, 2]);
        repaint_panel_control();
        repaint_battle_chip_cards();
        repaint_barriers();
    } else if (message == "Game started.") {
        set_navis();
        start_turn_countdown_painter();
        repaint_battle_chip_cards();
    } else if (message.endsWith("raises a barrier.")
        || message.endsWith("and is broken.")) {
        repaint_barriers();

        if (message.includes(" blocks the hit ")) {
            const target = get_navi_by_name(words[0].split("'")[0]);
            const navi = get_opponent(target);
            anim_data.enactor = navi;
            animate_navi_uses_chip_on_target(navi, target, false);
        }
    } else if (message.endsWith(" is deleted.")
        || message.endsWith(" has burned out.")
        || message.includes(" places "))
    {
        repaint_obstacles();
    } else if (message.includes(" moves to ")
        || message.includes( "dodges to "))
    {
        if (words.length != 5) {
            log_error("animator got unexpected move/dodge report");
            return;
        }
        const navi = get_navi_by_name(words[0]);
        const space = [parseInt(words[3], 10), parseInt(words[4], 10)];
        if (message.includes(" moves to ")) {
            anim_data.enactor = navi;
            anim_data.moves_to = space;
            return;
        }
        anim_data.dodges_to = space;
    } else if (message.includes(" damage to ")) {
        const navi = get_navi_by_name(words[0]);
        const target_name = (words.length == 7) ? `${words[5]} ${words[6]}`
            : words[5];
        const target = get_occupant_by_name(target_name);
        animate_navi_uses_chip_on_target(navi, target, true);
        if (is_navi(target)) {
            const target_sprite = get_sprite_by_navi(target);
            set_sprite_hp(target_sprite, target.hp);
        }
    } else if (message.includes(" cannot line up ")
        || message.includes(" misses"))
    {
        // TODO: these repors is awkward; paint attack pose on chip use instead?
        const navi = get_navi_by_name(words[0]);
        anim_data.enactor = navi;
        animate_navi_uses_chip_on_target(navi, undefined, false);
    } else if ((message.includes(" uses ") && words.length == 3)
        || message.endsWith("negates all damage."))
    {
        ; // nothing to do
    }  else if (message.includes(" steals control ")) {
        repaint_panel_control();
    } else if (message.includes( " recovers " )
        || message.includes(" is already at max HP"))
    {
        const navi = get_navi_by_name(words[0]);
        if (navi) paint_recover_effect_on_navi(navi);
    } else if (message.includes(" changes the terrain ")) {
        repaint_terrain();
    } else if (message.includes(" has defeated ")) {
        const navi = get_navi_by_name(words[0]);
        const koed_navi = get_navi_by_name(last_word);
        paint_navi_kos_target(navi, koed_navi);
    } else if (message.includes(" will operate ")) {
        document.getElementById("navi-select").style.display = "none";
        document.getElementById("hand").style.display = "flex";
    }  else {
        console.log(`-> no animation interpreter for message: ${message}`);
    }
}

reporter.interpreters.push(animate_message);

// TODO: hands are not yet assigned at load time, change for faster testing
// repaint_battle_chip_cards();

console.log("Animator loaded.");
