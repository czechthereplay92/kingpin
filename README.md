# Kingpin

A persistent browser mafia RPG: crimes, jail, hospital, gym training, jobs,
banking, travel, gangs, and PvP attacking. Built on the same stack as your
other Discord projects — static HTML/JS frontend, Netlify Functions backend,
Netlify Blobs for storage. No cron jobs needed: jail/hospital release,
stat regeneration, and travel all resolve based on elapsed time whenever
a player's state is read.

## Deploying (same flow as your other projects)

1. Create a new GitHub repo and upload everything in this folder via the
   GitHub web UI (drag and drop all files, keeping the folder structure —
   `netlify/functions/` and `netlify/functions/_lib/` must stay nested).
2. In Netlify: "Add new site" → "Import an existing project" → connect
   the GitHub repo. Build settings are already set in `netlify.toml`
   (no build command needed, functions dir is `netlify/functions`).
3. Netlify Blobs works automatically for functions deployed on Netlify —
   no extra environment variables needed (this is different from your
   Bingo project's setup, which needed manual Blobs env vars; the
   `getStore()` calls here auto-configure using Netlify's function context).
4. Deploy. Visit your site, the first page is the login/register screen.

## How to extend

- All game balance (crime payouts, job pay, city unlock levels, etc.) lives
  in `netlify/functions/_lib/gamedata.js` — edit numbers there.
- Each feature is one file in `netlify/functions/` (crime.js, train.js,
  bank.js, travel.js, job.js, gang.js, attack.js) plus a matching HTML page.
- To add an admin panel like The Outfit has (bans, editing accounts,
  session revocation), that would be a new set of `staff_*` style
  functions gated by an `isAdmin` flag on the user record — happy to
  build that next.

## Admin panel

Visit `admin.html` while logged in as an admin. **The very first account
ever registered on a fresh deployment automatically becomes admin** — there's
no other bootstrap step, so register your own account first before telling
anyone else about the site.

What it can do:
- Search players and edit any of their stats (money, bank, level, exp,
  energy/brave/will/health and their maxes, combat stats, city)
- Release a player from jail or discharge them from the hospital early
- Ban / unban a player's account (this also force-revokes all their
  active sessions, logging them out everywhere)
- Ban / unban a raw IP address, independent of any account — blocks
  both login and new registrations from that IP
- Revoke a player's sessions without banning them (useful if you think
  their account/token leaked)
- Promote another player to admin, or demote one (you can't demote
  yourself, so you can't accidentally lock yourself out)

Every player record now tracks `lastIp` and a short `ipHistory` (last 20
distinct IPs), visible in the edit panel — that's what you'd use to find
the IP to ban for a player using alts.

## What was intentionally left out of the original PHP script

The 611-file original included a full phpBB-style forum, a shop/items
system, jail chat, polls, and 2010-era staff moderation tools. Those
weren't ported — this build focuses on the actual play loop. Say the
word if you want the shop/items system added.
