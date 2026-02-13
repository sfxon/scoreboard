// ✓ Add Timer code -> timer.js
// ✓ Add setup overlay to html and it's functionality to admin.js
// Add setup code functionality.
    // ✓ Activate setup by hotkey.
    // ✓ Room title (is for internal setup/management)
    // ✓ Game title.
    // ✓ Game subtitle.
    // ✓ Adding players (name, points)
    // ✓ Select players for current game.
    // ✓ Add input for points up and down for players
    // ✓ See, if the structure is useful.
    // ✓ Add animation, whenever player points have been added (delayed after an input, so if you add 3 points one after each other, wait for 5 seconds and then display the animation.)
    // ✓ Define entities and create some diagrams of them for later review.
    // ✓ Rename some of the entities. The ones that should be reviewed are marked with @TODO.
    // ✓ Add index db as a browser database to save the state by adding a custom api - for now it uses the browser database - so the browser code for the database will have an endpoint code-layer, as well as a client code-layer.
    // ✓ Build the internal API.
    // Link admin functions to the new database and save data directly after each change by usage of the API.
        // ✓ 1. Game name Eingabefeld entfernen.
        // ✓ x. Load room when page is loaded.
        // ✓ 2. Room name bei Änderung speichern.
        // ✓ 3. Subtitle bei Änderung speichern.
        // ✓ 4. activatedPlayers speichern.
        // ✓ 5. timerActive speichern.

// Continue integration here:
    // Link admin functions to the new database and save data directly after each change by usage of the API.
        // 6. timerPerRound speichern.
        // 7. roundTimeLeft speichern.
        // 8. roundTimerStartetAt speichern.
        // 9. roundState speichern.

        // 10. Player speichern
            // a) points updaten
            // b) lifetimePoints updaten.
            // c) roundsWon updaten.

        // 11. Player laden -> auch die aktiven in der richtigen Reihenfolge. Sollte theoretisch schon funktionieren.
        // 11. Player laden -> sicherstellen, dass es auch ohne Admin-Interface sauber lädt. Das Scoreboard soll ja auch ohne Admin die korrekten Werte anzeigen.

    // Link frontend function to the new database and save data directly after each change by usage of the API.
        // See above.

    // Fix responsive view (css).
    // Add keyboard or mouse shortcuts setup.
    // Add switch player sides button.
    // Show highscores with switching leaderboards: sorted by roundsWon, sorted by lifetimePoints, sorted by lifetimeWins
    // Add "Start" button to start the game timer. (and print out, that the shortcut button to start stop is the spacebar)
    // Leertaste zukünftig so verwenden, dass sie den Timer startet und stoppt, statt den Dialog zu öffnen und zu schließen.
    // Color layout (just some css code entry for now?)
    // Build frontend overlay -> whenever you move the mouse over the scoreboard, buttons should be shown that can change values interactively. Add an option, so that this is always possible -> call it "Touch screen mode".
    // Toggle touch screen mode on, whenever the user just does one touch on the screen, and the scoreboard inputs are deactivated.
    // Re-Design the screen to make it more attractive.
    // Make a video documentation in 2 steps:
    //    - Usage documentation.
    //    - Technical documentation.
    // Make some promo videos while playing some live games of cornhole.
    // Add info-bar, that this is a local room, not an online hostet room.