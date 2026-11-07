# Wicklen website

Work here for the static website. Read README.md; build with python3 scripts/build.py
and check packaging with python3 -m unittest discover -s scripts -p 'test_*.py'.
Pushes to main automatically publish the checked static site. Show unreleased mod features
as previews; download metadata must describe published artifacts.

## Workspace context

This independent repository can also be opened as a submodule of wicklen-server under
projects/. In that layout, these relative paths describe related source:

| Relative path from this repository | Responsibility |
| --- | --- |
| `../../` | wicklen-server: pack profiles, public configuration, localization, releases, docs and ROADMAP.md. |
| `../wicklen-chronicles/` | The Chronicles mod: game-independent Java core, Fabric adapter, UI, spirit, discovery and native game tests. |
| `../wicklen-deployments/` | Shared VPS infrastructure, HTTPS, restricted artifact publication and controlled Minecraft updates. |

Read the relevant AGENTS.md before changing another repository. A standalone clone may
have no parent workspace or siblings; CI and normal checks must remain self-contained.
The parent workspace's README.md is the overall entry point; its ROADMAP.md is the shared
product plan. The shared local data directory is ../../workspace/, including tools/ for
Java/Gradle, python-venv/ for pack tooling and build/ for local outputs and saved worlds.
It is not disposable and must never be committed. Private settings are ../../.wicklen.local.env.

This repository owns its own commits and CI. Push changes here first, then update the
corresponding submodule pointer in wicklen-server deliberately. Recursive checkout may
leave HEAD detached; use the development branch before normal edits. Workspace cleanup
or a website publication does not authorize an SSH Minecraft deployment or restart.
Never commit tokens, private configuration, player data or backups.
