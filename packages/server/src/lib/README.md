# DanceBlue Server Shared Code (utils, types, etc.)

This folder contains two types of code. First is that which has no side-effects,
something like converting between types, along with all of the types used across
the project. The second are reusable route handlers, like the notFound route.

No code in this folder should have any effects outside of the current request.
