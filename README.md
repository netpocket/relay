# ncc-relay

A service that handles websocket communication between
netpocketos devices and ncc browser sessions.

By acting as a middleman it allows devices and browsers,
which may both be behind their own firewalls, to seem
as though they are communicating directly with one another.

It expects a specific protocol -- this can be understood
by examining the specs of this project and netpocketos. Each
project tests a side of the coin.

## Requirements

* Node.js

## Usage

`npm start`

