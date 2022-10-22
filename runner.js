console.log("Runner is loading.");

if (!reporter || !player1) {
    console.log("ERROR: load Mechanics before Runner");
    throw new Error("script loading order error");
}

// const battle_chip_data_for_memory_calibration = [
//     ["128", "Damg_0", "ABCDE", "None", "0", "calibration only", "**", "Autohit"],
//     ["129", "Damg_30", "ABCDE", "None", "30", "calibration only", "**", "Autohit"],
//     ["130", "Damg_60", "ABCDE", "None", "60", "calibration only", "**", "Autohit"],
//     ["131", "Damg_90", "ABCDE", "None", "90", "calibration only", "**", "Autohit"],
//     ["132", "Damg_120", "ABCDE", "None", "120", "calibration only", "***", "Autohit"],
//     ["133", "Damg_150", "ABCDE", "None", "150", "calibration only", "***", "Autohit"],
//     ["134", "Damg_180", "ABCDE", "None", "180", "calibration only", "****", "Autohit"],
//     ["135", "Damg_210", "ABCDE", "None", "210", "calibration only", "****", "Autohit"],
//     ["136", "Damg_240", "ABCDE", "None", "240", "calibration only", "*****", "Autohit"],
//     ["137", "Damg_270", "ABCDE", "None", "270", "calibration only", "*****", "Autohit"],
//     ["138", "Damg_300", "ABCDE", "None", "300", "calibration only", "*****", "Autohit"],
// ];

// run_game is defined in mechanics.js
// params:
//   0: use_timer (bool)
//   1: matches_to_play (int) default 1
//   2: turn_time (int) milliseconds default 1000
//   3: await_operator (bool) default false
run_game(true, 1, 5000);

console.log("Runner loaded.");
