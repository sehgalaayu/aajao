# Behavior Validation Plan (5 Hosts)

## Goal

Validate one thing only:
Does this spread naturally inside WhatsApp groups?

Do not optimize for opinions, design taste, or feature requests during this run.

## Test Cohorts

Recruit 5 hosts from different social contexts:

1. College friends group
2. Office group
3. Close-friends group (5 to 8 members)
4. Large chaotic group (20+ members)
5. Mixed group (family, society, or club)

## Host Instructions (Send As-Is)

Create a scene and send the link in your WhatsApp group.

Do not explain anything.
Do not follow up.
Do not push people.

Just observe what happens.

If a host explains the product in chat, mark that run as invalid.

## Run Rules

- Do not change UI or copy mid-test.
- Do not intervene in group chat.
- Let behavior happen naturally.
- Keep each run open for at least 24 hours.

## Optional Seeding

Before share, seed 1 to 2 initial Going responses if the room is completely empty.
Use this only if your objective is momentum sensitivity testing.
Mark seeded runs in notes so analysis remains honest.

## Primary Metrics

Track these drop points per event:

1. Open rate
   Definition: unique page opens / estimated group size
   Signal threshold: if below 20%, share message is weak

2. RSVP rate
   Definition: unique responders (Going, Maybe, No) / unique opens
   Signal threshold: if below 50%, first-screen conversion is weak

3. Second-user join
   Definition: at least one additional user joins after first responder
   Signal threshold: if none, social trigger is weak

4. Share rate
   Definition: users who share / users who RSVP
   Signal threshold: near zero means viral loop is broken

5. Chain depth
   Definition: longest observed invite chain depth
   Example: A shares -> B joins -> B shares -> C joins gives depth 2
   Signal threshold: if always depth 1, incentive and urgency are weak

6. Time to first RSVP
   Definition: time from first open to first RSVP action
   Signal threshold: if consistently slow, first-screen hook is weak

7. Time to second join
   Definition: time from first RSVP to second unique join
   Signal threshold: if slow or absent, momentum trigger is weak

## Attribution Layer (Required)

To move from guess-based analysis to data-backed analysis, track referral source.

1. Referral links
   Share links should include referral id:
   /event/[id]?ref=<userRef>

2. Response attribution
   Store inviter id on response records:
   invited_by: userRef | null

3. Outcome
   You can now compute:
   - who brought whom
   - real chain depth
   - join counts attributable to each inviter

## Behavioral Signals To Observe

Capture qualitative notes while monitoring:

- Do people ask: "what is this?"
- Do they ignore link entirely?
- Do they RSVP but not share?
- Do they joke/react in-thread after joining?

These notes often explain metric failures better than dashboards.

## Interpretation Guide

Case A: High opens, low RSVP
Likely issue: landing screen or early trust
Action: strengthen first-screen hook and social proof

Case B: High RSVP, low sharing
Likely issue: invite trigger timing or copy
Action: improve post-RSVP trigger and WhatsApp CTA message

Case C: No second join
Likely issue: no momentum
Action: strengthen activity proof and urgency messaging

Case D: Frequent "what is this?"
Likely issue: message clarity
Action: improve shared message framing

Case E: Chain depth > 1 appears repeatedly
Likely issue solved: loop behavior exists
Action: invest in scaling, attribution, and retention

## Success Criteria For This Round

You are not looking for huge virality yet.
You are looking for signal:

- meaningful open behavior
- consistent RSVP behavior
- at least 1 to 2 organic re-shares in multiple runs

## Post-Test Output

After running all 5 tests, summarize:

1. Completed tracker rows
2. Top 3 bottlenecks
3. One next product change only

Do not queue multiple changes at once. Iterate bottleneck by bottleneck.
