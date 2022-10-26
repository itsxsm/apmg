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
    player1.operator_chosen_chip_slot = idx;
    try {
        repaint_battle_chip_cards();
    } catch (err) {
        console.log("Unable to paint selection.");
    }

    if (!_interval_settings.use) {
        log_error("operator choice behavior without timer is undefined");
        return;
    }
}

console.log("Operation loaded.");
