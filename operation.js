console.log("Operation is loading.");

if (!log_error) {
    function log_error(message) { console.log(`ERROR: ${message}`); }
}

if (!reporter || !player1) {
    log_error("load Mechanics before Operation");
}

// at some point we should add console-only operation,
// but for now operation is only implemented via GUI
if (!reporter?.interpreters?.length) {
    log_error("load Animator before Operation")
    throw new Error("script loading order error");
}

function operator_chooses_chip_idx(idx) {
    player1.operator_chosen_chip = player1.hand[idx];

    if (!_interval_settings.use) {
        log_error("operator choice behavior without timer is undefined");
        return;
    }

    // the design goal is that if the operator makes their choice within the
    // time limit, the original interval will keep going; only if the
    // operator doesn't choose and await_operator is true will it be cleared,
    // and thus need to be reset once the choice is made.

    // for multiplayer, IF await_operator is provided at all (it may not be),
    // the default should be a mixed approach where await_operator allows a
    // fixed amount of bonus time before the match resumes automatically using
    // the navi's choice.

    if (!_interval_settings.active_interval) {
        _interval_settings.active_interval =
            setInterval(() => game_turn(), _interval_settings.interval_time);
    }
}

console.log("Operation loaded.");