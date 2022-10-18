console.log("Runner is loading.");

if (!reporter || !player1) {
    console.log("ERROR: load Mechanics before Runner");
    throw new Error("script loading order error");
}

run_game(true, 1, 2000);

console.log("Runner loaded.");
