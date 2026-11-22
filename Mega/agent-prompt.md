Read the cloned repositories or official docs for pi and herdr first, clone respositories are in ~/dev/oss. If any capability is missing, tell me plainly instead of faking or simulating it.

Build me an /agent command:

1. Running /agent <name> <job> opens a pane beside Main in pi and starts pi there with that job. A saved agent can also be opened by name from agents/<name>/agent.md, using only the text under its "## Job" heading. Opening an agent must not add a turn to Main: if a custom command in pi is itself a message to the model, make /agent a shell command or a herder key binding instead.
2. Let me choose the model with a flag, plus a model picker if pi supports one, defaulting to a small, fast model.
3. Follow only Main's conversation from this session, never the supporting agent's own conversation or another agent's, and pass on each new prompt and each finished reply as text.
4. Number the supporting agent's findings and never send anything back to Main automatically. Let me send one finding to Main by its number with a command such as /agent send main #2, and by selecting it with the arrow keys if pi supports that.
5. A sent finding must not interrupt Main's running reply or change what I have typed in Main's input. If pi cannot do that directly, keep sent findings in a queue file and, if pi has a hook that can add text when I submit a prompt, attach them to my next prompt in Main. If it has no such hook, show me how many findings are waiting, for example in the pane's title in pi, and let me paste them myself. Tell me plainly which of these you built.
6. Have /agent --help print a full guide, and have a bare /agent list saved agents and usage. Show hints while typing if [my harness] supports them; otherwise rely on bare /agent and --help.
