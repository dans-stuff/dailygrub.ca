# Red Deer Research

Raw research archive: `research/red-deer-raw-2025-12.md` (1111 lines, 88+ agents, 2025-12-14 to 2025-12-16)

## Backlog

### Critical Fixes
- [x] **REMOVE Hudsons RD from deals.json** — Hudsons Canada's Pub Red Deer **closed December 28, 2019**. ✓ Removed from deals.json 2026-02-06
- [x] Fix: Cilantro & Chive specials have CHANGED — Wed = "Pub Night & Pints", Thu = "Fish & Chips". ✓ Updated in deals.json 2026-02-06
- [x] Fix: MR MIKES late night hours — changed from 8pm to 9pm-close. ✓ Updated in deals.json 2026-02-06
- [x] Fix: Mary Brown's Big Mary Monday — price increased $3.99 → $4.99. Human confirmed 2026-02-06. Updated in deals.json. ✓

### Add More Deals to Existing Restaurants
- [x] State & Main: add Mon ($2 off Margaritas), Thu (half-price wine bottles), Sat ($2 off Sangria), Sun ($2 off Signature Caesar), Happy Hour (daily 2-5pm & 9pm-close), Late Night (Sun-Thu after 9pm half-off apps & $4 drinks). ✓ applied 2026-02-07
- [x] State & Main: add second location (Golden West Plaza, 6702 Golden West Ave, 403-343-2047) ✓ applied 2026-02-07
- [x] **CORRECTION** State & Main: human spot-check 2026-02-07 found: Late Night deal was fabricated (remove), missing daily draft specials (Mon Corona, Tue Banded Peak, Wed Lawn Mower, Sun Churchill Radler), Thu wine more granular. ✓ corrected 2026-02-07
- [x] MR MIKES RD: add missing Sat Weekend Mimosas ($5 until 2pm) and Sat Madri Excepcional ($1 off). ✓ applied 2026-02-07
- [x] Blowers & Grafton RD: add Music Bingo Monday ($4 hi-balls and beer). ✓ applied 2026-02-07
- [x] Original Joe's: add Mon ($2 off Margaritas), Thu (half-price wine bottles), Sat ($2 off Sangria), Sun ($1 off Caesars). ✓ applied 2026-02-07 (Happy Hour not added — needs GP-specific price verification)
- [x] MR MIKES: add daily drink specials (Mon margaritas $9, Tue Miller/Coors $5 + cocktails $8, Wed wine discounts, Thu draft $7, Fri/Sat shots $5, Sun Caesars $8 + mimosas $5) ✓ applied 2026-02-07
- [x] Boston Pizza RD: pasta price corrected $10.99 → $11.99; Sat/Sun deals added ✓ 2026-02-06

### Promote to Production
- [x] Boston Pizza Red Deer → `boston-pizza-rd` (2026-02-06)
- [x] East Side Mario's → `east-side-marios-rd` (2026-02-06)
- [x] Same Old Dave's → `same-old-daves-rd` (2026-02-06)
- [x] Stacked Pancake & Breakfast House → `stacked-pancake-rd` (2026-02-06)
- [x] Cora Breakfast and Lunch → `cora-rd` (2026-02-06)
- [x] Chillabong's Bar & Grill → `chillabongs-rd` (2026-02-06)
- [x] Arrae Patisserie → `arrae-patisserie-rd` (2026-02-06)
- [x] Triple O's → `triple-os-rd` (2026-02-06)
- [x] Tandoor N Flame → `tandoor-n-flame-rd` (2026-02-06)
- [x] Butter Chicken Hut → `butter-chicken-hut-rd` (2026-02-06)
- [x] Indian Flame & Pizza → `indian-flame-rd` (2026-02-06)
- [x] The Keg RD → `the-keg-rd` (2026-02-06)
- [x] Moxies RD → `moxies-rd` (2026-02-06)
- [x] MR MIKES RD → `mr-mikes-rd` (2026-02-06)
- [x] ~~Hudsons RD → `hudsons-rd` (2026-02-06)~~ **CLOSED — must remove**
- [x] Mary Brown's RD → `mary-browns-rd` (2026-02-06)

### New Restaurants to Promote
- [x] Blowers & Grafton (researched below, 5+ daily specials + Hali Hour) — ✓ promoted 2026-02-07
- [ ] Swiss Chalet Red Deer (2 Can Dine Tuesday $19.99, Kids Eat Free Wed)
- [ ] Earls Red Deer (happy hour + daily specials — needs detail)
- [ ] Red Deer Resort & Casino (Prime Rib Thursdays $24.95 at 5pm)
- [ ] Denny's Red Deer (15% seniors Thu 2-10pm — niche, may not be worth adding)

### New Restaurants to Investigate
- [ ] Browns Socialhouse (Clearview) — Social Hour well-documented chain-wide. Strong candidate. Verify RD location hours & specific menu
- [ ] George's Pizza & Steakhouse — half-price pizza Mon & Thu from TripAdvisor reviews. Needs phone call (403-342-1090) for current pricing
- [ ] ABC Country Restaurant — Prime Rib Fri + Sunday Brunch Buffet. Needs phone call (403-358-4280) for pricing
- [ ] Smitty's — 29¢ wings happy hour 4-6pm from TripAdvisor. Daily specials page says "Edmonton/Spruce Grove only." Needs phone call to verify RD participation
- [ ] Tribe — Happy Hour 3-5pm & 9-11pm ($5 drinks). Data may be outdated (2017-era). Needs phone call (403-392-3046)
- [ ] Famoso — Happy Hour exists but no details. Needs phone call (587-273-3744)
- [ ] The Granary Kitchen — Happy Hour exists per reviewers. Needs phone call (403-986-4663)
- [ ] Forno — Happy Hour + possible late-night pizza deal. Needs phone call (403-713-0355)
- [ ] Belly Hop Brewing — Monday Night Specials per Yelp. Needs phone call (403-318-0853)
- [ ] Troubled Monk Brewery — specials page exists but couldn't be fetched. Needs phone call (403-348-2378)
- [ ] One Eleven Grill — Happy Hour daily 2pm-5pm now confirmed via website. Needs detail on menu/pricing

### Still to Promote
- [ ] Memphis Blues BBQ House (1 deal) — Red Deer location unverified (web data showed Vancouver)

### Re-verify
- [ ] Original Joe's RD: **likely missing daily draft specials** — same parent company as State & Main (which had hidden draft-of-the-day specials not visible in search snippets). Ask user to check originaljoes.ca/en/menus/specials.html directly. Site returns 403 on automated fetch.
- [ ] MR MIKES RD: Saturday Mimosas & Madri confirmed on national mrmikes.ca page but not independently verified at Red Deer location ("Deals at participating locations only"). Low priority — likely correct.
- [ ] Taco Loft: raw file mentions Wed margaritas + Thu combo not in production — website did not load specials (Wix JS site). Needs phone call
- [ ] Bo's Bar: verify current wing price (30¢ from 2025 TripAdvisor) — website did not show specials. Needs phone call
- [ ] Leah's Bar: conflicting Wed vs Thu wing night — needs phone call
- [ ] Chillabong's: website says "Follow us on social media for specials" — no specials on site. Current data from visitreddeer.com only. Needs phone/social media check

### Research Gaps
- [ ] Murph's Pub: wing Wednesday pricing unknown
- [ ] East 40th Pub: "2-for-1 Dad'z Pizza" details vague
- [ ] Mohave Smokehouse: daily specials not publicly listed — needs direct verification

### Staleness Note (2026-02-06)
All deals with `lastVerified: 2025-12-16` are 52 days old. Not yet at the 90-day threshold (would be stale after 2026-03-16). Next verification sweep should happen before mid-March.

## Leads & Rumors

Unverified tips, search snippets, and secondhand mentions. These are NOT confirmed — they exist here to build a pool of possibilities for future research sessions.

| Restaurant / Lead | What We Heard | Where We Heard It | Date Noted | Status |
|-------------------|---------------|-------------------|------------|--------|
| Sammy's Sports Bar | Listed as "Medicine Hat only" in search results | Cross-reference during Medicine Hat research | 2026-02-06 | Unverified — not in Red Deer |
| Mohave Smokehouse | Daily specials not publicly listed | eatreddeer.ca mention | 2025-12-16 | Unverified — needs direct verification |
| One Eleven Grill | "Red Deer's Premier Steakhouse" with live music weekends | oneelevengrill.com in search results | 2026-02-06 | Unverified — no specials info found |
| Pampa Brazilian Steakhouse | Grilled meats carved tableside by gauchos | visitreddeer.com mention | 2026-02-06 | Unverified — likely prix fixe, not daily deal format |
| Hash Breakfast Eatery | Retro upscale breakfast, fresh local ingredients | visitreddeer.com mention | 2026-02-06 | Unverified — no specials info |
| Albert's (eatreddeer.ca) | Family dining, breakfast & lunch 7 days | eatreddeer.ca | 2026-02-06 | Unverified — same ownership as Murph's & Same Old Dave's |
| Red Hart Brewing | 10% off off-sales (Nov 2024) | visitreddeer.com deals page | 2026-02-06 | Unverified — brewery, not restaurant deal |
| Denny's Red Deer | Free kids meals 4-10pm, seniors 15% off Thu 2-10pm | dennys.ca search results | 2026-02-06 | Promising — needs verification of current availability |
| Browns Socialhouse (Clearview) | Social Hour daily 2-5pm & 9pm-close; 50% off wine bottles Wed | brownssocialhouse.com/clearview, OpenTable | 2026-02-08 | Promoted to researched |
| Smitty's Restaurant & Lounge | 29¢ wings daily happy hour 4-6pm; half-price wine bottles; buy 1 shareable get 2nd half price | TripAdvisor reviews, smittysrestaurants.com/promotions | 2026-02-08 | Promoted to researched |
| George's Pizza & Steakhouse | Half-price pizza Mon & Thu; $4 wine Mon | TripAdvisor reviews (multiple) | 2026-02-08 | Promoted to researched |
| ABC Country Restaurant | Prime Rib Friday night; Sunday Brunch Buffet 9am-2pm | abcreddeer.com, TripAdvisor reviews | 2026-02-08 | Promoted to researched |
| Ricky's All Day Grill (2 locations) | 10% seniors discount (65+); 15% off online pickup (code RICKYS15) | rickysrestaurants.ca, flyerca.com | 2026-02-08 | Promoted to researched |
| Tribe (Fusion/Flatbread) | Happy Hour 3-5pm & 9-11pm: $5 wine/$5 highballs/$5 draft | OpenTable, reddeerdining.ca | 2026-02-08 | Promoted to researched |
| Famoso Neapolitan Pizzeria | Happy Hour exists (split early/late); 50% off pizza after 9pm? | Yelp reviews, famoso.ca | 2026-02-08 | Promoted to researched |
| Danielle's (+ D2 Bar & Stage) | 2-for-1 pizza, pasta, chicken, donairs, burgers, apps, salads | daniellesreddeer.ca, Yelp | 2026-02-08 | Promoted to researched |
| The Granary Kitchen | Happy Hour exists | Yelp, OpenTable reviewers | 2026-02-08 | Unverified — no details available. Wix site didn't render |
| Forno (Italian) | Happy Hour with discounted martinis and wine; 50% off pizza after 9pm? | Yelp reviews, fornorestaurant.ca | 2026-02-08 | Unverified — review-sourced only. Dinner-only (open 4pm) |
| Dino's 2 for 1 Pizza & Pasta | Combo specials from $32.95-$38.95 (2 pizzas + wings etc.) | dfrestaurant.ca | 2026-02-08 | Unverified — standing combos, not day-specific. Takeout/delivery only |
| Troubled Monk Brewery | "What's on special" link exists on website | troubledmonk.com | 2026-02-08 | Unverified — specials page could not be fetched |
| Belly Hop Brewing | Monday Night Specials; Happy Hour | Yelp | 2026-02-08 | Unverified — no details available |
| Mediterranean Lava Grill | "Daily deals starting at $13.99" | Website | 2026-02-08 | Unverified — no day-specific details |
| One Eleven Grill | Happy Hour daily 2pm-5pm confirmed | oneelevengrill.com/happy-hour-at-one-eleven-grill/ | 2026-02-08 | Updated — source URL found, needs menu/pricing detail |

## Restaurants

### The Hideout - Eats & Beats — `in-production` `the-hideout`
411 Lantern Street | https://the-hideout.com/ | local | 403-348-5309

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Mexicana Monday — $3 OFF tacos/nachos/quesadillas | Mon | All day | the-hideout.com | 2025-12-16 |
| BOGO Appy Night | Tue | All day | the-hideout.com | 2025-12-16 |
| 99¢ Wings (11 flavours, min 10) | Wed | All day | the-hideout.com | 2025-12-16 |
| $14.75 Curry Mussels, $13 Burgers | Thu | All day | the-hideout.com | 2025-12-16 |
| 8oz Prime Rib $39 | Fri | 5pm+ | the-hideout.com | 2025-12-16 |
| $3 OFF any pasta | Sat | All day | the-hideout.com | 2025-12-16 |
| BOGO Pizza | Sun | All day | the-hideout.com | 2025-12-16 |
| Happy Hour $5.95 cocktails/wine/draught | Daily | 3-6pm | the-hideout.com | 2025-12-16 |
| Lunch: $16.75 steak sandwich, $10 wine | Mon-Fri | 11am-2pm | the-hideout.com | 2025-12-16 |

Note: 2026-02-06 verification attempt — website did not render specials (JS-heavy page). Web search confirmed Mexicana Monday $3 off is still listed. Remaining deals not independently re-confirmed via web.

### Bo's Bar and Stage — `in-production` `bos-bar`
2310 50 Ave | https://bosbar.com/ | local | 403-309-2200

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| 30¢/wing (min 10) | Wed | All day | TripAdvisor, bosbar.com | 2025-12-16 |
| Taco special | Thu | All day | bosbar.com | 2025-12-16 |
| Happy Hour — $2 off Winterlust items & cocktails | Mon-Fri | 2:30-5:30pm | bosbar.com | 2025-12-16 |

Note: 2026-02-06 verification attempt — bosbar.com did not render specials (JS-heavy). Wing price (30¢) from TripAdvisor, may have changed. Flagged in backlog for phone call.

### Taco Loft — `in-production` `taco-loft`
4924B 50 Street (Ross Street Patio) | https://www.tacoloft.ca/ | local | 403-396-7437

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $2.22/taco, Mini Tacos Night | Tue | All day | TripAdvisor, tacoloft.ca | 2025-12-16 |

Note: 2026-02-06 verification attempt — tacoloft.ca is a Wix site, did not render specials content. Flagged in backlog.

### Occam's Razor — `in-production` `occams-razor`
105-4916 50 Street | ~~https://occamsrazor.ca/~~ **DOMAIN COMPROMISED** | local | 587-272-2825

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $5 Marinated & smoked wings | Thu | All day | TripAdvisor, Wanderlog | 2025-12-16 |

Note: 2026-02-06 verification attempt — occamsrazor.ca fetched unrelated content (cryptocurrency page). Domain may have changed or been compromised. Needs human check.

> **DOMAIN COMPROMISED (2026-02-06):** occamsrazor.ca is now hosting a cryptocurrency gambling website. The restaurant is still operating (confirmed via TripAdvisor rank #12, OpenTable, Google). Hours: Wed-Sat 4:30-10pm. Website field removed from deals.json. $5 wings Thursday deal needs re-verification via phone (587-272-2825) since the website source is gone.

### Cilantro & Chive — `in-production` `cilantro-and-chive`
1927 50th Avenue | https://cilantroandchive.ca/reddeer/ | local | 587-272-2880

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Margarita & Mac n Cheese | Mon | All day | cilantroandchive.ca/reddeer/ | **2026-02-06** |
| Poutine & Beer flights | Tue | All day | cilantroandchive.ca/reddeer/ | **2026-02-06** |
| **Pub Night & Pints** | Wed | **4pm+** | cilantroandchive.ca/reddeer/ | **2026-02-06** |
| **Fish & Chips** | Thu | All day | cilantroandchive.ca/reddeer/ | **2026-02-06** |

**CHANGE DETECTED (2026-02-06):** Website now shows Wed = "Pub Night & Pints" (was Prime Rib Night), Thu = "Fish & Chips" (was Stuffed Yorkshire Puddings). Mon & Tue confirmed unchanged. Production data needs updating. Note: some cached search results still show old specials. The directly-fetched website is the primary source.

### Original Joe's — `in-production` `original-joes-rd`
4720 51st Avenue | https://www.originaljoes.ca | chain

> **NOTE: originaljoes.ca returns 403 on automated fetch.** Same parent company as State & Main (Ricky's All Day Grill / RRGB). Deals were added from web search snippets in 2026-02-06 session. Spot-check (2026-02-07) confirmed all 5 deals via independent web search: Mon $2 off margaritas, Tue half-price wings after 2pm, Thu half-price wine bottles, Sat $2 off sangria (White & Rosé), Sun $1 off caesars. Search snippets were accurate for OJ's (unlike State & Main), likely because OJ's specials are chain-wide not location-specific. However, OJ's may also have daily draft specials like State & Main that aren't showing in snippets. **On next re-verification, ask user to check originaljoes.ca/en/menus/specials.html directly** to look for draft-of-the-day specials we might be missing.

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Half-Price Wings | Tue | 2pm+ | originaljoes.ca | 2025-12-16 |
| $2 off Margaritas | Mon | All day | web search (originaljoes.ca) | 2026-02-06 |
| Half-price wine bottles | Thu | All day | web search (originaljoes.ca) | 2026-02-06 |
| $2 off Sangria (White & Rosé) | Sat | All day | web search (originaljoes.ca) | 2026-02-06 |
| $1 off Caesars | Sun | All day | web search (originaljoes.ca) | 2026-02-06 |

Note: 2026-02-06 — originaljoes.ca returned 403 on direct fetch. Deals confirmed via web search snippets from originaljoes.ca location pages. Only half-price wings Tue currently in production; 4 additional deals should be added.

### The Canadian Brewhouse — `in-production` `canadian-brewhouse-rd`
12 Conway St | https://thecanadianbrewhouse.com | chain | 403-342-1703

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| 69¢ Wings | Wed | All day | canadianbrewhouse.com | 2025-12-16 |

Note: 2026-02-06 — specials page loads dynamically by province, could not extract. Deal not re-confirmed.

### Montana's BBQ & Bar — `in-production` `montana-bbq-rd`
2004 50th Ave | https://montanas.ca | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Half-Price 8pc wings (w/ beverage) | Mon | All day | montanas.ca, web search | **2026-02-06** |
| $5 Taco (w/ beverage) | Tue | All day | montanas.ca, web search | **2026-02-06** |
| AYCE Ribs (pork, 2 sides, cornbread) | Wed | All day | montanas.ca, web search | **2026-02-06** |

Note: 2026-02-06 — montanas.ca returned 403 on direct fetch. All 3 deals confirmed active via web search snippets.

### Taco Time — `in-production` `taco-time-rd`
3321 50 Ave & 6702 Golden West Ave & 4747 67 St | https://tacotimecanada.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $2 Taco Tuesday | Tue | All day | tacotimecanada.com | 2025-12-16 |

### State & Main — `in-production` `state-and-main-rd`
East Hill: 3020 22nd Street (403-986-8470) | Golden West: 6702 Golden West Ave (403-343-2047) | https://stateandmain.ca | chain

> **WARNING: stateandmain.ca is unreliable for automated fetching.** The site frequently returns 403 errors on direct fetch. Web search snippets from this site are **known to produce incorrect data** — a 2026-02-06 session using only search snippets fabricated a "Late Night Half-Off Apps" deal that did not exist, missed daily draft specials on every day, and missed Tuesday entirely. **DO NOT trust search snippets for this restaurant.** The specials are location-specific (not chain-wide). The correct URL for Red Deer East Hill is `stateandmain.ca/en/menus/specials.html` — but it requires human verification since automated fetches fail. If re-verification is needed, ask the user to check the website directly.

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $2 off Margaritas (Tommy's or Spicy Honey, 2oz) | Mon | All day | human (verified from website) | **2026-02-07** |
| Corona Draft $1 off (50cl Mexican lager) | Mon | All day | human (verified from website) | **2026-02-07** |
| Banded Peak Draft $1 off (Southern Aspect IPA 16oz + seasonal 16oz) | Tue | All day | human (verified from website) | **2026-02-07** |
| Half-Price Wings (buffalo, hot, S&P, BBQ, teriyaki, honey garlic — 1lb) | Wed | 2pm+ | human (verified from website) | **2026-02-07** |
| Lawn Mower Yard Lager Draft $1 off (4.3% ABV, 16oz) | Wed | All day | human (verified from website) | **2026-02-07** |
| Wine by the Glass $1 off (5oz / 8oz) | Thu | All day | human (verified from website) | **2026-02-07** |
| Wine by the Bottle half price | Thu | All day | human (verified from website) | **2026-02-07** |
| By the Bottle Only Wines 25% off | Thu | All day | human (verified from website) | **2026-02-07** |
| White Sangria $2 off (3.5oz) | Sat | All day | human (verified from website) | **2026-02-07** |
| Signature Caesar $2 off (vodka or gin, 2oz) | Sun | All day | human (verified from website) | **2026-02-07** |
| Churchill Radler Draft $1 off (16oz, grapefruit & orange) | Sun | All day | human (verified from website) | **2026-02-07** |
| Happy Hour (food from $7.50, drinks from $6) | Daily | 2-5pm & 9pm-close | human (verified from website) | **2026-02-07** |

Note: 2026-02-06 — stateandmain.ca returned 403 on direct fetch. Deals confirmed via web search snippets from official site. Currently only Wing Wednesday in production; 6 additional deals/specials found. Also has a SECOND location (Golden West) not reflected in production.

> **CORRECTION (2026-02-07):** Human spot-check of stateandmain.ca/en/menus/specials.html (Red Deer - East Hill) revealed major errors from the 2026-02-06 web-search-only session: (1) "Late Night Half-Off Apps & $4 drinks" deal **did not exist** — was fabricated from search snippet misread; the 9pm-close window is the same Happy Hour menu, not a separate half-off deal. (2) Each day has a **featured draft beer $1 off** not captured: Mon Corona, Tue Banded Peak, Wed Lawn Mower Yard, Sun Churchill Radler. (3) Tuesday was missing entirely. (4) Thursday wine is more granular: glass $1 off + bottle half price + by-the-bottle-only 25% off. (5) Saturday is specifically "White Sangria." Website is flaky (frequently returns 403), which is why the original session relied on search snippets. Happy Hour confirmed as "Every Day 2pm-5pm & 9pm-close" with specific food ($7.50-$25) and drink ($6-$12.50) menu.

### Boston Pizza Red Deer — `in-production` `boston-pizza-rd`
North: 7494 50 Ave | South: 3215 Gaetz Ave | https://bostonpizza.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $10 Pizzas | Mon | All day | bostonpizza.com | 2025-12-16 |
| Pasta from $10.99 | Tue | All day | bostonpizza.com | 2025-12-16 |
| Wing Wednesday (pricing varies) | Wed | All day | bostonpizza.com | 2025-12-16 |
| Buy 2 Apps, Get 1 Free | Thu | All day | bostonpizza.com | 2025-12-16 |
| $2 Off Cactus Cut Potatoes | Fri | All day | bostonpizza.com | 2025-12-16 |

Note: 2026-02-06 — bostonpizza.com returned 404 on promos page. Deals not re-confirmed via web. Not yet stale (52 days).

> **Price correction (2026-02-06):** Pasta Tuesday price corrected from $10.99 to $11.99 per official bostonpizza.com Alberta specials page. Saturday ($3 Off Bandera Bread) and Sunday ($2 Off Boston-Sized Burgers) deals added to deals.json — these were already in the Lethbridge and Medicine Hat entries.

### East Side Mario's — `in-production` `east-side-marios-rd`
2004 50 Avenue | https://eastsidemarios.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Buy 1 Pasta, Take 1 Home FREE (w/ beverage) | Wed | All day | eastsidemarios.com | 2025-12-16 |
| Amore for Two $50 — 3-course for 2 (w/ 2 beverages) | Thu | All day | eastsidemarios.com | 2025-12-16 |
| $3.99 domestic draught & house wine w/ entree | Daily | All day | eastsidemarios.com, web search | **2026-02-06** |

Note: 2026-02-06 — eastsidemarios.com returned 403. $3.99 draught deal confirmed still listed via web search snippet.

### Same Old Dave's — `in-production` `same-old-daves-rd`
5020 47 Ave | local | Tue-Sun 4-8pm, closed Mon

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Full rack ribs + 2 sides $20 | Thu | All day | eatreddeer.ca, restaurantguru.com | 2025-12-16 |

Note: 2026-02-06 — eatreddeer.ca still mentions "rib specials at Same Old Dave's" in web search. Not independently re-confirmed with pricing.

### Stacked Pancake & Breakfast House — `in-production` `stacked-pancake-rd`
2004 50 Avenue | https://stackedpancakehouse.ca | local | 587-272-1090 | 7am-3pm daily

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Early Bird: 2 eggs, bacon/ham/sausage, homefries, toast | Mon-Fri | 7-9am | stackedpancakehouse.ca | 2025-12-16 |
| Lunch Specials $17.99 | Daily | All day | stackedpancakehouse.ca | 2025-12-16 |

Note: 2026-02-06 — website mentions "Daily specials, seasonal menus & more" but specific deals did not render. Also running a Feb 14-16 SickKids charity promo ($2 from every pastry).

### Cora Breakfast and Lunch — `in-production` `cora-rd`
6858 Gaetz Ave, Unit 3 | https://chezcora.com | chain | 403-986-8855 | Mon-Sat 6am-3pm, Sun 7am-3pm

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Early Morning: 2 eggs, 3 bacon, toast, potatoes, coffee $5.55 | Daily | Before 8am | chezcora.com | 2025-12-16 |

### The Keg Steakhouse — `in-production` `the-keg-rd`
6365 50 Ave | https://www.thekeg.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Apps From $10 (garlic toast, tuna tartare, wings, burger, prime rib sandwich) | Mon-Fri | 3-5pm | thekeg.com | 2025-12-16 |
| Late Night Bites From $10 | Sun-Thu | 9pm-close | thekeg.com | 2025-12-16 |
| Late Night Bites From $10 | Fri-Sat | 10pm-close | thekeg.com | 2025-12-16 |

Note: 2026-02-06 — thekeg.com social hour page did not render content (CSS/JS only). Deals not re-confirmed. Not yet stale (52 days).

### Moxies — `in-production` `moxies-rd`
2828 Gaetz Ave | https://moxies.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $5 Drinks & $10 Cocktails + food shareables | Daily | 2-5pm & 9pm-close | moxies.com | 2025-12-16 |
| Half-Price Wine Bottles | Wed | All day | moxies.com | 2025-12-16 |

Note: 2026-02-06 — moxies.com happy hour page returned 404. Web search confirms Moxies Red Deer still open and offers happy hour.

### MR MIKES — `in-production` `mr-mikes-rd`
6701 Gaetz Ave | https://mrmikes.ca | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Happiest Hours: Bites from $5, Drinks from $5 | Daily | **2-5pm** | mrmikes.ca/promotions/happiest-hours | **2026-02-06** |
| Happiest Hours Late Night: Same menu | Daily | **9pm-close** | mrmikes.ca/promotions/happiest-hours | **2026-02-06** |
| Daily Drink Specials (Mon margaritas $9, Tue bottles $5, Wed wine off, Thu draft $7, Fri/Sat shots $5, Sun Caesars $8 + mimosas $5) | Various | All day | mrmikes.ca/promotions/daily-specials | **2026-02-06** |
| Weekend Mimosas $5 (until 2pm) | Sat | Until 2pm | mrmikes.ca/promotions/daily-specials | **2026-02-07** |
| Madri Excepcional $1 off (450ml/473ml tall can) | Sat | All day | mrmikes.ca/promotions/daily-specials | **2026-02-07** |

**CHANGE DETECTED:** Late night start time is 9pm per website, not 8pm as in production data.

Food items confirmed: $5 Garlic Parmesan Fries, $6 Loaded Fries, $7 Bruschetta, $9 miniMikes/Chicken Bites, $13 Panko Shrimp/Cajun Chicken Sandwich, $25 Steak Frites.
Drinks confirmed: $5 wine/well highballs/Caesars, $7 draft steins.

> **Spot-check (2026-02-07):** All 8 daily drink specials confirmed from mrmikes.ca/promotions/daily-specials. Added 2 missing Saturday deals (Weekend Mimosas $5 until 2pm, Madri Excepcional $1 off). Now 10 deals. Note: Happiest Hours times vary by location — mrmikes.ca doesn't list hours on their happiest-hours page; OpenTable listings show some locations at 8pm-close and others at 9pm-close. Red Deer uses 9pm-close (corrected 2026-02-06). On re-verification, check if this has changed. The daily specials page says "Deals at participating locations only" — Saturday Mimosas and Madri confirmed on national page but not independently verified at Red Deer location.

### Hudsons Canada's Pub — ~~`in-production`~~ **`closed`** ~~`hudsons-rd`~~
Former: 4900 50 St | **CLOSED December 28, 2019**

**Evidence:**
- Yelp listing: "HUDSONS - RED DEER - CLOSED" (yelp.ca/biz/hudsons-red-deer-red-deer)
- rdnewsnow.com article: "Hudsons Canada's Pub closing Red Deer location" (Dec 17, 2019)
- hudsonscanadaspub.com lists locations only in Edmonton, Calgary, Lethbridge, Saskatoon — no Red Deer

**ACTION REQUIRED:** Remove `hudsons-rd` from deals.json immediately. This restaurant has been closed for over 6 years.

### Mary Brown's — `in-production` `mary-browns-rd`
6858 50 Ave, Suite 2 | https://marybrowns.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Big Mary Monday $4.99 | Mon | All day | marybrowns.com + human | 2026-02-06 |

> **Note (2026-02-06):** Price increased from $3.99 to $4.99. Multiple 2026 sources (savealoonie.com, sudburyevents.com, dealdeal.ca) showed $4.99. Human confirmed $4.99 on 2026-02-06. Updated in deals.json.

### Chillabong's Bar & Grill — `in-production` `chillabongs-rd`
18-69 Dunlop Street | https://chillabongs.ca/ | local | 403-343-3332

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Wing Night | Wed | All day | visitreddeer.com | 2025-12-16 |
| Cheap Guinness | Thu | All day | visitreddeer.com | 2025-12-16 |
| Happy Hour | Daily | 4-7pm | visitreddeer.com | 2025-12-16 |

Note: 2026-02-06 — chillabongs.ca says "Follow us on social media to see all our daily food & drink specials." No specials listed on website. Data sourced from visitreddeer.com. $12 Steak Sandwich (11am-4pm) still unverified.

### Memphis Blues BBQ House — `researched`
558 Laura Ave (Gasoline Alley Farmer's Market) | https://memphisbluesbbq.com | local | Thu 11am-8pm, Fri-Sat 9am-8pm, Sun 9am-4pm

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Weekend brunch: $5 Mimosas, $7 Caesars | Sat-Sun | 12-3pm | memphisbluesbbq.com | 2025-12-16 |

### Arrae Patisserie — `in-production` `arrae-patisserie-rd`
#11 3701 50 Ave | https://arraepatisserie.ca | local | 403-373-9889 | Tue-Fri 7:30am-5:30pm, Sat 8am-5pm

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Cakelet Tuesday $2.50 | Tue | All day | arraepatisserie.ca | 2025-12-16 |
| Canele Friday $4.95 | Fri | All day | arraepatisserie.ca | 2025-12-16 |
| Pain aux Raisins Saturday $5.50 | Sat | All day | arraepatisserie.ca | 2025-12-16 |

Note: 2026-02-06 — arraepatisserie.ca homepage did not render specials content. Not re-confirmed. Not yet stale.

### Triple O's — `in-production` `triple-os-rd`
130-3115 50 Avenue | https://tripleos.com | chain | 7am-10pm daily

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Spicy Ultimate Crunch $7.99 | Mon | All day | tripleos.com | 2025-12-16 |
| Original Burger $7.99 | Tue | All day | tripleos.com | 2025-12-16 |
| Crispy Cod Burger $7.99 | Wed | All day | tripleos.com | 2025-12-16 |

### Tandoor N Flame — `in-production` `tandoor-n-flame-rd`
Unit 108, 4807 50 Ave | https://tandoornflame.ca | local | 403-347-7600

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Lunch Buffet (rotating appetizers, mains, rice, naan, desserts) | Mon,Wed,Fri | 11am-2pm | tandoornflame.ca | **2026-02-06** |

Note: 2026-02-06 — Confirmed directly from tandoornflame.ca: buffet Mon/Wed/Fri 11am-2pm. Price not listed on website. Hours show Mon-Sun 11am-10pm (some conflicting 8pm close time shown).

### Butter Chicken Hut — `in-production` `butter-chicken-hut-rd`
4909 49 St #104 | local | 403-465-7777 | Tue-Sat 11am-11pm, Sun 12-11pm, Mon closed

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $12 Lunch Special | Tue-Sun | Lunch | multiple sources | 2025-12-16 |

### Indian Flame & Pizza — `in-production` `indian-flame-rd`
130-3 Ironside St | https://indianflame.ca | local | 403-314-4100

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Lunch Buffet (curries, naan, desserts) | Daily | 11am-2pm | indianflame.ca | 2025-12-16 |
| 10% off online orders (Indian menu & pizza) | Daily | All day | indianflame.ca | **2026-02-06** |

Note: 2026-02-06 — indianflame.ca confirmed buffet service exists (menu category), but pricing not shown on homepage. Hours: Mon-Sun 11am-9:30pm. Online ordering discount confirmed. Catering from $10/person for 50-300 people.

### Blowers & Grafton — `in-production` `blowers-grafton-rd`
2079 50 Ave | https://blowersgrafton.com/red-deer/ | chain | Hours: Sun-Thu 11am-12am, Fri-Sat 11am-2am

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| $5 off any pizza | Mon | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $1 off Grafton Street Lager (14oz) | Mon | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $4 off Fish & Chips | Tue | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $1 off Grafton Street Amber (14oz) | Tue | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $2 off all Cocktails | Wed | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $2 off OG Halifax Donair | Wed | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| Oysters $2.50 each / $15 half-dozen | Thu | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| 50% off wine bottles | Thu | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $2 off all Caesars (1 oz) | Sun | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $2 off Selfie Garlic Fingers | Sun | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| $3 off Selfie Nachos | Sun | All day | blowersgrafton.com/menu/daily-specials | **2026-02-06** |
| Hali Hour (food from $5, drinks from $5) | Daily | 2-5pm & 9pm-close | blowersgrafton.com/hali-hour | **2026-02-06** |
| Music Bingo Monday ($4 hi-balls and beer) | Mon | Evening | blowersgrafton.com/red-deer/ | **2026-02-07** |

Note: Halifax street food chain. Well-documented specials directly from website. No Fri/Sat daily specials listed (Hali Hour still applies). B&G website is reliable for automated fetching — daily-specials and hali-hour pages render cleanly.

> **PROMOTED to production (2026-02-07)** as `blowers-grafton-rd`. All deals re-verified from blowersgrafton.com/menu/daily-specials/ on 2026-02-07. Daily specials (Mon-Thu, Sun) + Hali Hour (daily 2-5pm & 9pm-close) confirmed.

> **Spot-check (2026-02-07):** All 6 deals confirmed via secondary fetch of blowersgrafton.com. Added Music Bingo Monday ($4 hi-balls and beer) — sourced from location page blowersgrafton.com/red-deer/, not the daily-specials page. Also has DJ Nights Fri/Sat at 9pm (event, not a deal). Now 7 deals.

### Swiss Chalet Red Deer — `researched` (NEW)
5111 22nd Street | https://www.swisschalet.com | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| 2 Can Dine for $19.99 (2 quarter chicken dinners, w/ 2 beverages) | Tue | All day | swisschalet.com/en/specials/2-can-dine.html | **2026-02-06** |
| Kids Eat Free (w/ adult entree) | Wed | All day | web search snippet | **2026-02-06** |

Note: 2026-02-06 — swisschalet.com returned 403. Deals confirmed via web search and swisschalet.com specials page URL. 2 Can Dine valid for dine-in, takeout, pickup (not delivery). Taxes, upgrades, beverages extra.

### Earls Kitchen + Bar — `researched` (NEW)
2111 Gaetz Avenue | https://earls.ca/locations/red-deer/ | chain | 403-342-4055 | Mon-Thu/Sun 11am-10pm, Fri-Sat 11am-11pm

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Happy Hour | Mon-Thu, Sun | 2-5pm & 9-10pm | earls.ca, web search | **2026-02-06** |
| Happy Hour | Fri-Sat | 2-5pm & 9-11pm | earls.ca, web search | **2026-02-06** |
| Daily features (half-price apps, drink specials) | Various | Happy Hour times | web search (happyhourschedule.com, earls.ca) | **2026-02-06** |

Note: 2026-02-06 — earls.ca location page did not render menu content. Happy hour times confirmed via web search. Specific pricing and daily features not confirmed. Needs phone call or in-person check for exact menu items and prices before promoting.

### Red Deer Resort & Casino — `researched` (NEW)
6500 67 Street | https://reddeerresortandcasino.ca | local

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Prime Rib Thursdays $24.95+GST | Thu | 5pm+ | reddeerresortandcasino.ca/offer/prime-rib-thursdays/ | **2026-02-06** |

Note: Also has a "Casino Chinese Buffet for $24.95" and "Deal & Dine" rewards program, but details not confirmed.

### Denny's Red Deer — `researched` (NEW)
(at Sandman Hotel) | https://www.dennys.ca/restaurant/alberta/red-deer/ | chain

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| 15% Seniors Discount (55+) | Thu | 2-10pm | dennys.ca | **2026-02-06** |
| 10% off online pick-up orders | Daily | All day | dennys.ca | **2026-02-06** |

Note: Other possible deals mentioned in search (free kids meals 4-10pm, $9.99 Grand Slam w/ drink) but not confirmed as current. Seniors discount is niche — may not warrant production inclusion.

### Murph's Pub & Grill — `researched`
5020 47 Avenue | eatreddeer.ca/murphs-pub-grill | local | 403-341-6397

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| Wing Wednesday (pricing unknown) | Wed | All day | eatreddeer.ca | 2025-12-16 |
| Happy hour specials (details unknown) | Various | Various | web search (eatreddeer.ca) | 2026-02-06 |
| Beer & Steak Special (details unknown) | Various | Various | web search (eatreddeer.ca) | 2026-02-06 |

### East 40th Pub & Dad'z Pizza — `researched`
3811 40 Avenue | https://www.east40thpub.ca/ | local | 403-340-1844

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| 2-for-1 Dad'z Pizza | Various | All day | east40thpub.ca | 2025-12-16 |
| Happy Hour specials | Daily | Varies | east40thpub.ca | 2025-12-16 |

### Leah's Bar and Grill — `researched`
6315 Horn St | local | 403-986-9005 | No website (Skip/Uber Eats)

| Deal | Days | Time | Source | Verified |
|------|------|------|--------|----------|
| 50% off wing baskets (Wed or Thu — conflicting) | Wed or Thu | All day | TripAdvisor | 2025-12-16 |
| Steak Sandwich Special $12.25 | Daily | All day | TripAdvisor | 2025-12-16 |

### The Krossing — `no-deals-found`
5114 48 Street | local | 403-406-6592 | Facebook only

### The Tap House Pub & Grill — `no-deals-found`
1927 50th Ave | local | 403-341-5400

### Jim & Jer's Pub — `no-deals-found`
2810 Bremner Avenue | local | 403-348-0400 | No website

### Longriders Saloon — `closed`
Former: 3310 50 Avenue | Closed January 21, 2023

### Fratters Speakeasy — `closed`
Former: 5114 48th Street | Closed August 4, 2016

### Cowboys Nightclub — `closed`
4608 50th Ave | Status unclear, possibly reNew Thrift Store

### Blarney Stone Pub — `closed`
Former: 6320 50 Avenue | Yelp shows closed Dec 2025

### Ugly's Pub & Grill — `not-in-city`
5010 50 Street, Lacombe (25km north)

### Hanger Pub & Grill — `not-in-city`
3216 b 22 Street, Springbrook

### Gator's Bar & Grill — `not-in-city`
Calgary only

### Sawmill Prime Rib — `not-in-city`
Edmonton/Leduc/Grande Prairie only

### Mr. D's Pub — `not-in-city`
Does not exist in Red Deer

### Central City Pub — `not-in-city`
Surrey BC only

### Sammy's Sports Bar — `not-in-city`
Medicine Hat only

### Browns Socialhouse (Clearview) — `researched`
- **Status:** `researched`
- **Address:** Unit 125, 31 Clearview Market Way, Red Deer, AB T4P 0M9
- **Website:** https://www.brownssocialhouse.com/clearview
- **Type:** `chain`
- **Phone:** (403) 986-9711

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| Social Hour (share plates, cocktails from $5, beer from $5, wine 6oz $6) | Daily | 2-5pm & 9pm-close | brownssocialhouse.com/clearview, OpenTable | 2026-02-08 |
| 50% off wine bottles | Wed | All day + during Social Hour | brownssocialhouse.com, ultimatehappyhours.com | 2026-02-08 |

Note: Chain-wide Social Hour is well-documented across all Browns locations. Red Deer Clearview location confirmed open via OpenTable. Strong candidate for production promotion.

### Smitty's Restaurant & Lounge — `researched`
- **Status:** `researched`
- **Address:** 6500 67 St, Red Deer, AB (at Red Deer Resort)
- **Website:** https://www.smittysrestaurants.com
- **Type:** `chain`

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| 29¢ wings | Daily | 4-6pm (happy hour) | TripAdvisor reviews, smittysrestaurants.com/promotions | 2026-02-08 |
| Buy 1 shareable starter, get 2nd half price | Daily | 4-6pm (happy hour) | smittysrestaurants.com/promotions | 2026-02-08 |
| Half off all wine bottles, $1 off all wine glasses | Daily | 4-6pm (happy hour) | smittysrestaurants.com/promotions | 2026-02-08 |
| 10% seniors discount (65+) | Daily | All day | smittysrestaurants.com | 2026-02-08 |

Note: CAVEAT — The daily specials page (Taco Tue $3, AYCE Wings Wed $19.99, Sliders Thu $4, AYCE Fish & Chips Fri) is explicitly listed as "Edmonton and Spruce Grove locations" only. The lounge happy hour with 29¢ wings appears available at Red Deer per TripAdvisor reviews but needs human verification. Phone call recommended.

### George's Pizza & Steakhouse — `researched`
- **Status:** `researched`
- **Address:** 6715 Gaetz Ave, Red Deer, AB T4N 4C9
- **Website:** https://georgespizzasteakhouse.com/
- **Type:** `local`
- **Phone:** (403) 342-1090

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| Half-price pizza + $1 | Mon | All day | TripAdvisor reviews (multiple) | 2026-02-08 |
| $4 wine glass | Mon | All day | TripAdvisor reviews | 2026-02-08 |
| Half-price pizza | Thu | All day | TripAdvisor reviews (multiple) | 2026-02-08 |

Note: Open since 1978. Multiple TripAdvisor reviews confirm the Monday and Thursday half-price pizza deals. Website did not list specials on automated fetch. Pricing details ("+$1" on Monday) come from reviews and may be dated. Needs human verification of current pricing.

### ABC Country Restaurant — `researched`
- **Status:** `researched`
- **Address:** 2085 50 Ave, Red Deer, AB
- **Website:** https://abcreddeer.com/
- **Type:** `local`
- **Phone:** (403) 358-4280

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| Prime Rib Friday (slow roasted chef-carved, choice of side, seasonal vegetables) | Fri | Evening (5pm+) | abcreddeer.com, TripAdvisor | 2026-02-08 |
| Sunday Brunch Buffet (hot & cold dishes, salad bar, dessert bar) | Sun | 9am-2pm | abcreddeer.com, TripAdvisor | 2026-02-08 |

Note: Classic family-style diner, famous for pies. Both Friday Prime Rib and Sunday Brunch are recurring weekly features confirmed by multiple sources (website, TripAdvisor reviews). Pricing not publicly listed — needs phone call or in-person check. Hours: Mon-Thu/Sun 7am-9pm, Fri-Sat 7am-10pm, Sun 8am-9pm.

### Ricky's All Day Grill — `researched`
- **Status:** `researched`
- **Address (South):** 163 Leva Ave, Red Deer, AB T4E 0A5
- **Address (Cafe):** 901-6702 Golden West Ave, Red Deer, AB T4P 1A8
- **Website:** https://rickysrestaurants.ca/locations/red-deer/
- **Type:** `chain`

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| 10% seniors discount (65+) | Daily | All day | rickysrestaurants.ca, flyerca.com | 2026-02-08 |
| 15% off online pickup (code RICKYS15) | Daily | All day | mealdeals.app | 2026-02-08 |

Note: 85+ locations across Canada. Seniors discount is permanent. Seasonal LTOs rotate (e.g., "Wintertime Warmers" through March 16, 2026, items from $15.99-$19.99). Not a "daily specials" restaurant per se. Same parent company (RRGB) as Original Joe's and State & Main.

### Tribe — `researched`
- **Status:** `researched`
- **Address:** 4930 Ross Street, Red Deer, AB T4N 1X7
- **Website:** tribeflatout.com (returns 403 on automated fetch)
- **Type:** `local`
- **Phone:** (403) 392-3046

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| Happy Hour ($5 wine tumblers, $5 highballs, $5 draft) | Wed-Sun | 3-5pm | OpenTable, reddeerdining.ca | 2026-02-08 |
| Late Happy Hour (same pricing) | Wed-Sun | 9-11pm | OpenTable, restaurantguru.com | 2026-02-08 |

Note: Fusion/flatbread restaurant, open Wed-Sun only. Happy hour details from OpenTable and ReviewGuru — some data may be from 2017-era listings. Needs human verification that prices are current.

### Famoso Neapolitan Pizzeria — `researched`
- **Status:** `researched`
- **Address:** 5016B 51 Avenue, Red Deer, AB
- **Website:** https://famoso.ca/locations/red-deer/
- **Type:** `chain`
- **Phone:** (587) 273-3744

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| Happy Hour (split early/late — details unknown) | Daily? | Unknown | Yelp mentions | 2026-02-08 |
| 50% off pizza after 9pm? | Daily? | After 9pm | Single Yelp review | 2026-02-08 |

Note: Website's specials pages are empty templates that redirect to individual locations. Red Deer location page does not list specials. The 50% off pizza after 9pm comes from a single review and is unverified. Needs phone call or in-person check.

### Danielle's — `researched`
- **Status:** `researched`
- **Address:** 5017 49 Street, Red Deer, AB T4N 1V4
- **Website:** https://daniellesreddeer.ca/
- **Type:** `local`
- **Phone:** (587) 272-0508

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| 2-for-1 (pizza, pasta, chicken, donairs, burgers, apps, salads) | Daily | All day | daniellesreddeer.ca, Yelp | 2026-02-08 |

Note: Takeout/delivery-focused restaurant. The 2-for-1 appears to be their standard pricing model, not a promotional deal. D2 Bar & Stage (5008 48 St) next door is same ownership, hosts live music and karaoke. May not fit "daily deal" format.

### Nando's Red Deer — `closed`
- **Status:** `closed`
- **Former Address:** 6320 Gaetz Ave, Red Deer
- **Evidence:** Yelp listing shows "CLOSED" (updated January 2026)

### Applebee's Red Deer — `closed`
- **Status:** `closed`
- **Former Address:** 5250 22 Street, Red Deer
- **Evidence:** Yelp listing shows "CLOSED" (updated November 2025)

### St. Louis Bar & Grill — `not-in-city`
No Red Deer location found (2026-02-08 search)

### LOCAL Public Eatery — `not-in-city`
No Red Deer location found (2026-02-08 search)

### Kelsey's — `not-in-city`
No Red Deer location found (2026-02-08 search)

### Jack Astor's — `not-in-city`
No Red Deer location found (2026-02-08 search)

### Cactus Club Cafe — `not-in-city`
No Red Deer location found (2026-02-08 search)

### Joey Restaurants — `not-in-city`
No Red Deer location found (2026-02-08 search)

### Las Palmeras — `no-deals-found`
3630 50 Ave, Red Deer | local | Mexican/Salvadoran, since 1992. No specials found (2026-02-08).

### Mediterranean Lava Grill — `no-deals-found`
6791 50 Ave #6, Red Deer | local | "Daily deals starting at $13.99" per website, but no day-specific details found (2026-02-08).

### Dino's 2 for 1 Pizza & Pasta — `no-deals-found`
3121 49 Ave, Red Deer | local | Standing combo specials ($32.95-$38.95) but not day-specific deals. Takeout/delivery only. Since 35+ years. (2026-02-08)

### The Granary Kitchen — `no-deals-found`
1935 50 Ave, Red Deer | local | (403) 986-4663 | Happy Hour confirmed to exist per reviewers but no details available. Wix site didn't render content (2026-02-08).

### Forno — `no-deals-found`
6852 66 St #1101, Red Deer | local | (403) 713-0355 | Happy Hour with discounted martinis/wine mentioned in reviews. 50% off pizza after 9pm from single review. Dinner-only (open 4pm). No details confirmed (2026-02-08).

### Troubled Monk Brewery — `no-deals-found`
5551 45th Street, Unit 1, Red Deer | local brewery | (403) 348-2378 | "What's on special" link on website but specials page could not be fetched (2026-02-08).

### Belly Hop Brewing — `no-deals-found`
8105 Edgar Industrial Dr, Red Deer | local brewery | (403) 318-0853 | "Monday Night Specials" and "Happy Hour" per Yelp, no details (2026-02-08).

## Research Log

| Date | Action | Result |
|------|--------|--------|
| 2025-12-14 | Initial research (43 agents) | 10 local restaurants verified, 17 chain locations, 6 closed/not-in-RD |
| 2025-12-15 | Deep verification (38+ agents) | 23→50+ restaurants verified, category research complete |
| 2025-12-16 | Comprehensive guides (8 agents) | Wing night guide, chain deals, brewery guide added |
| 2025-12-16 | First production push | 10 restaurants + 3 chains added to deals.json (13 total) |
| 2026-02-06 | Research doc restructured | Migrated from raw dump to standardized format |
| 2026-02-06 | Promoted 5 restaurants | Boston Pizza RD, East Side Mario's, Same Old Dave's, Stacked Pancake, Cora → deals.json |
| 2026-02-06 | Promoted 3 more restaurants | Triple O's, Tandoor N Flame, Arrae Patisserie → deals.json (7 deals) |
| 2026-02-06 | Promoted 8 more restaurants | The Keg, Moxies, MR MIKES, Hudsons, Mary Brown's (chains), Chillabong's, Butter Chicken Hut, Indian Flame (locals) → deals.json (18 deals) |
| 2026-02-06 | Verification sweep | Hudsons RD confirmed CLOSED (since 2019). Cilantro & Chive specials changed (Wed/Thu). MR MIKES late night hour corrected (9pm not 8pm). Mary Brown's price may be $4.99 not $3.99. State & Main, OJ's have many more deals than in production. 5 new restaurants researched (Blowers & Grafton, Swiss Chalet, Earls, Red Deer Resort, Denny's). Tandoor N Flame re-verified. Montana's deals re-confirmed via search. |
| 2026-02-06 | deals.json: Hudsons RD removed | Closed restaurant removed from production data |
| 2026-02-06 | deals.json: Cilantro & Chive updated | Wed/Thu deals corrected to match current website (Pub Night & Pints, Fish & Chips) |
| 2026-02-06 | deals.json: MR MIKES RD fixed | Late night startHour changed from 20 to 21 (9pm-close per mrmikes.ca) |
| 2026-02-06 | Human verified: Mary Brown's RD | Price confirmed $4.99 (was $3.99). Updated in deals.json. |
| 2026-02-06 | Audit: Occam's Razor domain compromised | occamsrazor.ca now serves crypto gambling. Website removed from deals.json. Restaurant still operating. |
| 2026-02-06 | Audit: Boston Pizza RD price fix | Pasta Tue $10.99 → $11.99 per official source. Sat/Sun deals added. |
| 2026-02-07 | deals.json: State & Main RD expanded | Added 6 missing deals (Mon margaritas, Thu wine, Sat sangria, Sun Caesar, daily happy hour, late night). Added second location (Golden West: 6702 Golden West Ave). Was 1 deal, now 7. |
| 2026-02-07 | deals.json: Original Joe's RD expanded | Added 4 missing deals (Mon margaritas, Thu wine, Sat sangria, Sun Caesar). Was 1 deal, now 5. Happy hour not added (needs price verification). |
| 2026-02-07 | deals.json: MR MIKES RD expanded | Added 6 daily drink specials (Sun Caesars/mimosas, Mon margaritas, Tue Miller/cocktails, Wed wine, Thu draft, Fri/Sat shots). All verified from mrmikes.ca. Was 2 deals, now 8. |
| 2026-02-07 | deals.json: Blowers & Grafton promoted | New restaurant `blowers-grafton-rd` with 6 deals (Mon pizza/lager, Tue fish & chips/amber, Wed cocktails/donair, Thu oysters/wine, Sun Caesars/garlic fingers/nachos, daily Hali Hour). All re-verified from primary source. |
| 2026-02-07 | Spot-check: State & Main RD | Human verified stateandmain.ca specials page. MAJOR CORRECTIONS: (1) "Late Night Half-Off Apps" deal removed — did not exist, was search snippet misread. (2) Added daily draft specials: Mon Corona $1 off, Tue Banded Peak $1 off (entirely new day), Wed Lawn Mower Yard $1 off, Sun Churchill Radler $1 off. (3) Thu wine updated to 3-tier: glass $1 off, bottle half price, bottle-only 25% off. (4) Happy Hour updated to 2-5pm & 9pm-close with specific menu. Was 7 deals, now 8 (1 removed, 2 new). |
| 2026-02-07 | Spot-check: MR MIKES RD | Secondary confirmation from mrmikes.ca/promotions/daily-specials. All 8 existing deals confirmed. Added 2 missing Saturday deals: Weekend Mimosas $5 (until 2pm), Madri Excepcional $1 off. Now 10 deals. |
| 2026-02-07 | Spot-check: Blowers & Grafton RD | Secondary confirmation from blowersgrafton.com. All 6 existing deals confirmed. Added Music Bingo Monday: $4 hi-balls and beer (from location page). Now 7 deals. |
| 2026-02-07 | Spot-check: Original Joe's RD | Secondary confirmation via web search snippets (originaljoes.ca returns 403). All 5 deals confirmed. No changes needed. |
| 2026-02-07 | Spot-check: Bar One (3 cities) | Secondary confirmation from baronecanada.com/specials-events. All 6 deals confirmed across Lethbridge, Grande Prairie, Medicine Hat. Minor note: research says "8 wing flavors" but website lists 9. No production data changes needed. |
| 2026-02-08 | New restaurant discovery sweep | Searched for new RD restaurants not already tracked. Found 10 new restaurants with potential deals, 2 closed (Nando's, Applebee's), 6 not-in-city (St. Louis, LOCAL, Kelsey's, Jack Astor's, Cactus Club, Joey), 7 no-deals-found. |
| 2026-02-08 | Added 16 new leads | Browns Socialhouse, Smitty's, George's Pizza, ABC Country, Ricky's, Tribe, Famoso, Danielle's, Granary Kitchen, Forno, Dino's, Troubled Monk, Belly Hop, Mediterranean Lava Grill, One Eleven Grill (updated). |
| 2026-02-08 | Added 8 researched restaurant sections | Browns Socialhouse (Clearview), Smitty's, George's Pizza & Steakhouse, ABC Country, Ricky's All Day Grill, Tribe, Famoso, Danielle's — all with deal tables and source URLs. |
| 2026-02-08 | Added closed/not-in-city/no-deals-found entries | Nando's (closed), Applebee's (closed), 6 chains not in RD, 7 restaurants with no confirmed deals (Las Palmeras, Mediterranean Lava Grill, Dino's, Granary Kitchen, Forno, Troubled Monk, Belly Hop). |
| 2026-02-08 | Added 11 backlog items | Phone verification needed for George's Pizza, ABC Country, Smitty's, Tribe, Famoso, Granary Kitchen, Forno, Belly Hop, Troubled Monk, One Eleven Grill. Browns Socialhouse ready for promotion review. |
