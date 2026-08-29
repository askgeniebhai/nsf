# NSF RepoGuard

**Status:** Active governance policy for this repository.
**Scope:** Applies to every change made to this repository — by a human contributor or by an AI coding assistant — regardless of which tool is used to make it.

## Why this exists

NSF (Neela Security Force Platform) is a working application with real
users going through real login/attendance/payroll flows. AI coding
assistants are fast and capable of large, sweeping changes in a single
session. Without an explicit guardrail, that speed is a liability: an
assistant asked to "clean this up" or "improve this" can quietly redesign
working screens, swap out the auth model, or refactor business logic that
took real effort to get right — all while sounding confident about it.

RepoGuard exists to make the default the safe default: **preserve first,
change only what was explicitly asked for, and route anything bigger
through the repository owner.**

## AI coding agents: read this first

If you are an AI coding assistant (Claude, Copilot, Cursor, Codex, or any
other tool) about to modify this repository, **read this file in full
before making any change.** It is also linked from `AGENTS.md` at the repo
root and from `README.md` so it is discoverable regardless of entry point.

If a task you're given conflicts with a rule below, do not silently
resolve the conflict in either direction. Stop and say so.

## Core rules

1. **Preserve existing architecture.** This is a static, framework-free,
   client-side site (plain HTML/CSS/JS, `localStorage` as the data layer).
   Do not introduce a framework, bundler, backend, or database unless the
   owner explicitly asks for that specific change.
2. **No re-engineering without explicit owner approval.** "Cleanup",
   "improve", or "modernize" requests are scoped to what was asked —
   they are not an invitation to rewrite adjacent working code.
3. **No large refactoring without explicit owner approval.** Prefer the
   smallest change that satisfies the actual request.
4. **No technology-stack changes without explicit owner approval.**
   No new frameworks/libraries/build tools unless the owner asks for that
   specific change.
5. **No removal of working functionality without explicit owner
   approval.** If something looks unused or wrong, document it — do not
   delete it as a side effect of an unrelated change.
6. **No database/schema changes without explicit owner approval.**
   For NSF today, this means: no changes to the shape of the objects
   stored under `localStorage` keys (`nsf_employees`, `nsf_attendance_logs`,
   `nfs_attendance`, `nsf_user`, etc.) unless explicitly requested.
7. **No authentication/RBAC changes without explicit owner approval.**
   `js/auth.js`, the role model (`admin`/`supervisor`/`guard`/`client`),
   and `AuthService.checkAuth()` route protection are off-limits unless
   the owner explicitly asks for an auth/RBAC change.
8. **No business-logic changes without explicit owner approval.**
   Attendance marking/geofencing, payroll/salary calculations, and report
   generation logic are off-limits unless the owner explicitly asks for a
   logic change.
9. **No force pushes.**
10. **No rewriting Git history** (no `rebase -i`, `commit --amend` on
    already-pushed commits, etc.) on any shared branch.
11. **No uncontrolled direct modification of `main`.** All work happens
    on a dedicated branch and reaches `main` only via a reviewed PR that
    the owner merges.
12. **One clear milestone per branch/PR.** Do not bundle unrelated work
    into the same branch or PR.
13. **Changes must remain minimal and auditable.** A reviewer should be
    able to look at the diff and see exactly what changed and why, with
    nothing extraneous mixed in.
14. **Test/validate before merge.** Run whatever checks exist (see
    "Machine checks" below) and any manual verification the change
    reasonably calls for, and report what was actually run — never claim
    a check passed without running it.
15. **The repository owner reviews and merges PRs.** An AI assistant may
    prepare, push, and open a PR, but does not merge it unless the owner
    has given clear, scoped, written authorization for that specific
    merge in that specific conversation.

## What "explicit owner approval" means

A general instruction like "clean up the repo" or "make it look nicer" is
**not** approval to touch auth, RBAC, business logic, or the database
layer, or to do a large refactor — those require the owner to say so
specifically, for that specific change, in that specific request. When in
doubt, do the narrower thing and ask.

## Machine checks

This repository has no build step, package manager, or test framework
today (see `README.md`) — RepoGuard's automated check is intentionally
small, in `.github/workflows/repoguard-check.yml` and
`scripts/repoguard-check.sh`. On every pull request it verifies:

- This file (`.github/REPOGUARD.md`) and `AGENTS.md` are still present —
  governance cannot be silently deleted.
- Every `.js` file in the repository parses (`node --check`).
- Every `.html` file in the repository parses as HTML.
- Whether the PR touches a **sensitive path** (`js/auth.js`,
  `js/attendance.js`, `js/StorageService.js`, `admin/payroll.html`, or any
  `data/` file) and, if so, prints a clear, non-blocking annotation
  flagging it for extra owner scrutiny before merge.

**What this check cannot do:** it cannot verify that "explicit owner
approval" was actually given — that is a human judgment call, not a
machine-checkable fact. The sensitive-path flag exists to make such
changes impossible to miss during review, not to block them outright.
Final responsibility for enforcing the rules above rests with the owner's
review before merge, not with this workflow.

## Scope note

RepoGuard governs *how changes are made*, not the application's runtime
behavior. It must never modify or interfere with the deployed site, its
build/deploy process, or any existing page's functionality.
