# Scene 5 Documentation

## Overview

When creating Scene 5, I came up with and created two playable mini-games with Babylon.js: a look good Particle Garden and a quick Target Smash. The Particle Garden consisted of several colorful orbs which created particle effects, on a calming green background picture. The Target Smash game was based on clicking randomly appearing targets in a limited period of time with the score tally, the number of misses, and the time elapsed being tracked.

## Challenges Faced

During development, I faced a few obstacles. Smooth transitioning between scenes and sharing of canvases made discarding and recreating the Babylon scenes was hard at first. Initially, when debugging, it took multiple debugging sessions to synchronize the game state to avoid problems like infinite alert loop during certain changes including the end of the game. I also embedded background music, which was applied when playing the game. Also, a feature of turning the music on and off the scene, which led to errors in the DOM elements.

## Solutions and Resources

To clear these, I spoke to users on web communities such as Stack Overflow and established documents on Babylon.js greatly. Such resources made it possible to get acquainted with important notions, including physics impostors (collision detection), action managers (interactive events), and scene lifecycle. The debugging tips I got helped to trace event handling failures and timing problems during spawning and despawning of the targets.

## Final Outcome

These problems were mostly solved after several small tests and improvements as shown below, adding a `gameActive` flag to manage the flow of the game, correctly disposing of scenes and correcting audio playback loop by correcting asset locations and eliminating bad toggle buttons. The final project has visually impressive presentation, proper tracking of the game state, and reactive controls.
