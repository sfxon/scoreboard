# Scoreboard

Use this scoreboard to display your live game scores.

## Project goals

* Build a minimum scoreboard.
* Support the starry cluster ball game known from Youtube in the beginning.
* Build a minimum project which runs alone in the browser first, with no external database. Just use browser database features.
* Later, we might add an online service or database.
* Free for use and open source with basic features.


## Ideas

* We could make that colors for every player could be defined.
  * We always would have a primary and a secondary color, so if colors of 2 players are too close, the system could choose the alternative color scheme. But maybe that is too much overload. We'll see.

## Concepts

The projects data hierarchie is

```Game > Room > Session > Match > Round```

### Game

Game represents the concept of a game. There are many different kind of games, but we go down into the detail,
so this usually does not represent a general group, but the dedicated game with it's rulesets, that can be played.


### Room

A room is a place, where a game is played. It contains players and holds statistics about played rounds, highscores, etc in this room.


### Session

A session is the running instance of a game.
A session can consist of different players, that are playing this session.


### Match

A match is part of a session.
A match can be setup of multiple rounds.
Not all games require, to make it that complicated.
Often we just skip the "match" entity and go directly into rounds for the key of simplicity.


### Round

A round is part of a match, where the defined quantity of players are playing against each other,
that are need to play the game.