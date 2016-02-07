# PADsim
Damage simulator for Puzzle and Dragons boards.

This was really just an experiment to practice HTML/JavaScript.
Pretty proud of the match-3 algorithm though.

Current version uses modelSim.html.
Assets will be moved into proper folders when I get a chance.
Making the interface pretty was not a priority, I just wanted it to be compact.
If I continue this, I'll probably rewrite the whole thing in python.

Also, there's technically a bug in the match-3 algorithm (on purpose):

0 0 0 0 0 0 

X 0 0 0 0 0 

X 0 0 0 0 0 

X X 0 0 0 0 

0 X X X 0 0 

This will register as only 1 match, but that bridge orb won't be removed.
This bug was actually in the game, and everyone accepted it as a fact of life.
Though sometime in 2015 (v7.0?) they fixed it out of nowhere.
If I come back to this project, I'll rework the algorithm to account for it.
Also fix the rounding issues in the damage calcs.