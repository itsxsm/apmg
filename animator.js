console.log("Animator is loading.");

if (!log_error) {
    function log_error(message) { console.log(`ERROR: ${message}`); }
}

if (!reporter || !player1) {
    log_error("load Mechanics before Animator");
    throw new Error("script loading order error");
}

let turn_start_absolute_ms = Date.now();
const ALL_POSES = [
    "standing", "attacking", "struck", "shooting", "slashing", "throwing"
];
const ALL_STANDARD_CHIP_TYPES = ["Shot", "Sword", "Toss"];
const SPECIAL_CHIP_ANIMATIONS = {};
var _cache_buster = 0; // TODO: remove, this is silly
let frame_num = 0;

const ANIMATION_TIMES_MS = {
    "Recover": 500,
};

const RF_MS = 1000.0 / 60.0;

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

const frame_durations_defaults = {
    'shooting': [1, 2, 1, 1, 2, 22], // ends with repeat of 1
    'slashing': [8, 2, 2, 2, 2, 2, 2, 9],
    'swoosh': [4, 3, 4],
}

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
        },
        frame_durations_for_pose: frame_durations_defaults
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

const card_divs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => {
    return document.getElementById(`battle-chip-card-${idx}`);
});

const fill_div = document.getElementById("turn-timer-fill");
const nofill_div = document.getElementById("turn-timer-nofill");
const ball_div = document.getElementById("ball");

// for some reason, cannot assign navi references as keys?
// this results in an object with only one key...
// sprites_by_navi = {};
// sprites_by_navi[player1] = sprites[0];
// sprites_by_navi[player2] = sprites[1];
// keep it simple for now by not having the dictionary at all

const obstacle_anchor = document.getElementById("obstacle-anchor");
const effect_anchor = document.getElementById("effect-anchor");

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

function create_placed_wave_effect_div(space) {
    div = document.createElement("div");
    const name = name_of(anim_data.enactor.battle_chip);
    const bottom_px = get_bottom_line_px_for_j(space[1]) + 2;
    div.id = `effect-${name}_${space[0]}_${space[1]}`;
    div.style.position = "absolute";
    div.style.left = space[0] * 40 + "px";
    div.style.bottom = bottom_px + "px";
    div.style.zIndex = get_z_index_for_j(space[1]);
    div.classList.add("effect", "ground-wave")
    document.getElementById("battlefield").insertBefore(div, effect_anchor);
    return div;
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
        console.log(`WARNING: set_sprite_pose got unrecognized pose: ${pose}`);
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

function add_update(on_frame_num, do_this) {
    if (animation_queue.length && on_frame_num < animation_queue[0][0])
    {
        var idx = 1;
        while (idx < animation_queue.length
            && on_frame_num < animation_queue[idx][0]) idx++;
        // TODO: double-check to make sure this isn't off by one or two
        animation_queue.splice(idx, 0, [on_frame_num, do_this]);
    }
    animation_queue.unshift([on_frame_num, do_this]);
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

function enque_move_updates(anim_calcs) {
    if (!anim_data.moves_to) return { frame_after: frame_num };
    
    const navi_sprite = get_sprite_by_navi(anim_data.enactor);
    move_sprite_to_space(navi_sprite, anim_data.moves_to);
    anim_data.moves_to = null;
    return { frame_after: anim_calcs.frame_after + 15 };
}

function clear_div_frame(div, frame) {
    div.classList.remove(`frame-${frame}`);
}

function set_div_frame(div, frame) {
    if (frame > 0) {
        div.classList.replace(`frame-${frame-1}`, `frame-${frame}`);
    } else {
        div.classList.add("frame-0");
    }
}

function enque_swoosh_updates(anim_calcs) {
    var swoosh_div_id = anim_data.enactor == player1 ? "swoosh-1" : "swoosh-2";
    var swoosh_div = document.getElementById(swoosh_div_id);
    var next_frame = anim_calcs.slash_starting_frame;
    [...Array(5).keys()].forEach(s_frame => {
        if (s_frame == 0) {
            add_update(next_frame, () => {
                place_swoosh(swoosh_div);
                set_div_frame(swoosh_div, 0);
            }, true);
            next_frame += 180 / 4;
        } else if (s_frame == 4) { 
            add_update(next_frame, () => { 
                clear_div_frame(swoosh_div, 3) ;
            }, true);
        } else {
            console.log("next_frame = " + next_frame);
            add_update(next_frame, () => { 
                console.log(`changed swoosh frame to ${s_frame} at - ${frame_num}`);
                set_div_frame(swoosh_div, s_frame);
            }, true);
            next_frame += 180 / 4;
        }
    });

    const swoosh_frame_after = next_frame + 1;
    if (swoosh_frame_after > anim_calcs.frame_after)
        anim_calcs.frame_after = swoosh_frame_after;
    return anim_calcs;
}

function enque_windup_updates(anim_calcs) {
    const pose = anim_data.attack_pose || "attacking";

    if (pose == "throwing") return enque_throw_updates(anim_calcs);

    const navi_sprite = get_sprite_by_navi(anim_data.enactor);
    // set_sprite_pose(navi_sprite, "attacking");
    const max_frame = max_frame_for_sprite_animation(navi_sprite, pose);
    if (pose == "slashing")
        anim_calcs.slash_starting_frame = anim_calcs.frame_after;
    let frame = anim_calcs.frame_after;

    if (max_frame == 0) {
        add_update(frame, () => set_sprite_pose(navi_sprite, pose));
        return { frame_after: anim_calcs.frame_after};
    } else {
        [...Array(max_frame + 1).keys()].forEach(s_frame => {
            add_update(frame, () => {
                set_sprite_pose(navi_sprite, pose, s_frame)
            });
            frame += 180 / (max_frame + 1);
        });
    }

    anim_calcs.frame_after = frame;
    if (pose == "slashing")
        anim_calcs = enque_swoosh_updates(anim_calcs);
    return anim_calcs;
}

function enque_wave_updates(anim_calcs) {
    const shockwave_chips = ["ShokWave", "SoniWave", "DynaWave"];
    const tidalwave_chips = ["Wave", "RedWave", "BigWave"];
    const all_wave_chips = shockwave_chips.concat(tidalwave_chips);
    const navi = anim_data.enactor;
    if (!all_wave_chips.includes(name_of(navi.battle_chip))) return anim_calcs;
    const next_frame = anim_calcs.frame_after;

    const [start_i, j] = anim_data.enactor.space;
    const i_change = anim_data.enactor.is_east ? -1 : 1;
    // TODO: for now hardcoding for default, later read settings
    const set_frames = [3, 4, 7, 11, 14, 17, 20, 24];
    const reset_frame = 27;

    for (var i_shift = 1; start_i + i_shift * i_change >= 0
        && start_i + i_shift * i_change <= 5;
        i_shift++)
    {
        effect_i = start_i + i_shift * i_change;
        const div = create_placed_wave_effect_div([effect_i, j]);
        effect_delay = 18 * i_shift;
        set_frames.forEach((frame_offset, s_frame) => {
            const on_frame = next_frame + effect_delay + frame_offset;
            add_update(on_frame, () => set_div_frame(div, s_frame));
        });
        add_update(next_frame + effect_delay + reset_frame, () => {
            div.remove();
        });
    }

    anim_calcs.frame_after += reset_frame + 1;
    return anim_calcs;
}

function enque_explode_updates(anim_calcs) {
    if (!anim_calcs.explode_spaces) return;
    if (!anim_calcs.explode_spaces.length) {
        log_error("anim_calcs.explode_spaces was empty");
        return anim_calcs;
    }

    const next_frame = anim_calcs.frame_after;
    const set_frames = [1, 3, 7, 11, 15, 19];
    const reset_frame = 21;
    const explode_divs = anim_calcs.explode_spaces.map(space => {
        return document.getElementById(`explosion_${space[0]}_${space[1]}`);
    });
    set_frames.forEach((frame_offset, s_frame) => {
        const on_frame = next_frame + frame_offset;
        add_update(on_frame, () => {
            exploded_divs.forEach(div => set_div_frame(div, s_frame));
        });
    });
    add_update(next_frame + reset_frame, () => {
        explode_divs.forEach(div => clear_div_frame(div, 5));
    });

    anim_calcs.frame_after += reset_frame + 1;
    return anim_calcs;
}

function enque_throw_updates(anim_calcs) {
    const next_frame = anim_calcs.frame_after;

    // sprite portion
    // TODO: for now hardcoding for default, later read settings
    const set_frames = [1, 6, 10, 13, 18];
    let reset_frame = 22;
    const sprite = get_sprite_by_navi(anim_data.enactor);

    set_frames.forEach((frame_offset, s_frame) => {
        const on_frame = next_frame + frame_offset;
        add_update(on_frame, () => {
            set_sprite_pose(sprite, "throwing", s_frame);
        });
    });
    add_update(next_frame + reset_frame, () => {
        set_sprite_pose(sprite, "standing");
    });

    // rising phase
    // let [x_change, y_change] = [(103-42)/22, (77-117)/22];
    var left = 40 * anim_data.enactor.space[0];
    var top = 50;
    var x_change = anim_data.enactor.is_east ? -2 : 2;
    [...new Array(22).keys()].forEach(offset_m1 => {
        add_update(next_frame + offset_m1 + 1, () => {
            ball_div.style.left = `${Math.round(left, 0)}px`;
            left += x_change;
            ball_div.style.top = `${Math.round(top, 0)}px`;
            top -= 1;
            if (!offset_m1) ball_div.style.visbility = "visible";
        });
    });

    // falling phase
    // [x_change, y_change] = [(182-103)/26, (132-77)/26];
    [...new Array(26).keys()].forEach(offset_m23 => {
        add_update(next_frame + offset_m23 + 23, () => {
            ball_div.style.left = `${Math.round(left, 0)}px`;
            left += x_change;
            ball_div.style.top = `${Math.round(top, 0)}px`;
            top += 2;
        });
    });

    add_update(next_frame + 48, () => ball_div.style.visibility = "hidden");

    anim_calcs.frame_after += 49;
    return anim_calcs;
}

function enque_result_updates(anim_calcs) {
    const does_add_time = anim_data.dodges_to || anim_data.strikes.length;
    add_update(anim_calcs.frame_after, () => {
        if (anim_data.dodges_to) {
            const dodger_sprite = get_sprite_by_navi(
                get_opponent(anim_data.enactor)
            );            
            move_sprite_to_space(dodger_sprite, anim_data.dodges_to);
            anim_data.dodges_to = null;
        }

        anim_data.strikes.forEach(target => {
            if (!is_navi(target)) return;
            const target_sprite = get_sprite_by_navi(target);
            set_sprite_pose(target_sprite, "struck");
        });
    });

    if (does_add_time) anim_calcs.frame_after += 15;
    return anim_calcs;
}

function enque_reset_standing_poses(anim_calcs) {
    add_update(anim_calcs.frame_after, () => {
        anim_data.enactor = null;
        anim_data.attack_pose = null;
        anim_data.spaces_hit = [];
        anim_data.moves_to = null;
        anim_data.dodges_to = null;
        anim_data.strikes.length = 0;
        set_sprite_pose(sprites[0], "standing");
        set_sprite_pose(sprites[1], "standing");
    });

    return anim_calcs;
}

// function animate_wave() {
//     const shockwave_chips = ["ShokWave", "SoniWave", "DynaWave"];
//     const tidalwave_chips = ["Wave", "RedWave", "BigWave"];
//     const all_wave_chips = shockwave_chips.concat(tidalwave_chips);
//     const navi = anim_data.enactor;
//     if (!all_wave_chips.includes(name_of(navi.battle_chip))) return 0;

//     const distance = navi.is_east ? navi.space[0] : (5 - navi.space[0]);
//     if (distance == 0) return 0;

//     const ref_frames_per_space = 13;
//     const ms_per_space = ref_frames_per_space * RF_MS;
//     const overlap_ref_frames = 6;
//     const delay_ref_frames = ref_frames_per_space - overlap_ref_frames;
//     const delay_ms = delay_ref_frames * RF_MS;
//     run_wave_animation(ms_per_space, 0, 7);
//     setTimeout(() => run_wave_animation(ms_per_space, 0, 7), delay_ms);

//     // TODO: this method should determine and return time until impact
//     // so that the struck pose can be animated at the right time
//     return ms_per_spaces * distance + delay_ms;
// }

const animation_queue = [];

function animater_update_frame() {
    while(animation_queue.length
        && frame_num >= last_value(animation_queue)[0])
    {
        last_value(animation_queue)[1]();
        animation_queue.pop();
    };
    frame_num++;
    // TODO: unexpected state error logging here
}

_animation_interval = null;

function start_animation_timer() {
    if (_animation_interval) return;
    _animation_interval = setInterval(() => {
        animater_update_frame();
    }, RF_MS);
}

function resume_turn_ber() {
    if (!is_the_game_over()) {
        _interval_settings.active_interval = setInterval(
            () => game_turn(), _interval_settings.interval_time
        );
    }
}

function animate_navi_uses_chip_on_target(
    navi, target, does_hit = true)
{
    clearInterval(_interval_settings.active_interval);
    start_animation_timer();

    anim_data.enactor = navi;
    if (target && does_hit) anim_data.strikes = [target];

    const battle_chip = anim_data.enactor.battle_chip;
    const types = battle_chip[TYPES_INDEX].split(' ');
    anim_data.attack_pose = "shooting";
    if (types[0] == "Sword") anim_data.attack_pose = "slashing";
    if (types[0] == "Toss") anim_data.attack_pose = "throwing";

    let anim_calcs = enque_move_updates({ frame_after: frame_num });
    anim_calcs = enque_windup_updates(anim_calcs);
    anim_calcs = enque_wave_updates(anim_calcs);
    anim_calcs = enque_result_updates(anim_calcs);
    anim_calcs = enque_reset_standing_poses(anim_calcs);
    add_update(anim_calcs.frame_after + 1, () => resume_turn_ber());
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
