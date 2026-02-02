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

* Bring structure to code.
  * Currently I will not refactor the system.
  * A future approach might optimize the base system, to reflect more kinds of sports. See Concepts > Data Hierarchy for more information.

## Concepts

### Data Hierarchy

The projects data hierarchie is

```Game > League > Tournament > Match > Round```

#### Game

Game represents the concept of a game. There are many different kind of games, but we go down into the detail,
so this usually does not represent a general group, but the dedicated game with it's rulesets, that can be played.


#### League

A League is a place, where an instance of a game is played regularly. It contains players and holds statistics about played rounds, highscores, etc in this league.
The system actually uses "Room" as a synonym. That might be subject of change in the future.


#### Tournament

A tournament is the running instance of a game.
A tournament can consist of different players, that are playing this tournament.
A synonym for tournament can be season. The differenciation between Tournament and Season might be, how long the event is,
where a Tournament might be a shorter period, like a couple of hours or a view days,
while a season might last over a couple of months or a year.


#### Match

A match is part of a Tournament/Season.
A match can be setup of multiple rounds.
Not all games require, to make it that complicated.
Often we just skip the "match" entity and go directly into rounds for the key of simplicity.


#### Round

A round is part of a match.
It is intended to be used as synonym for Quarter (American Football), Third (Icehokey), Halftime (Soccer), ...