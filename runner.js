console.log("Runner is loading.");

if (!reporter || !player1) {
    console.log("ERROR: load Mechanics before Runner");
    throw new Error("script loading order error");
}

run_game(true, 5, 1000);

console.log("Runner loaded.");
