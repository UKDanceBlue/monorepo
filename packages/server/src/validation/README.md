# DanceBlue Server Validation

This directory contains the validation and request parsing code for the
DanceBlue server. It generally consists of joi schemas for validating requests
and functions to parse request data (i.e. `*Body` to `Parsed*Body`). While these
validation schemas may get data from the database (if necessary), but shall not
modify it.
