# High-Stakes, High-Urgency Problem Markets — Research Brief
**Date:** October 2, 2026 · **Method:** websearch + webfetch, ~30 queries, vendor sites and Reddit threads read directly.
**Scope caveat:** No browser session available, so no live Google Trends / Keyword Planner pulls. All volumes below are second-hand from published vendor tables. See §8 Uncertainty Register.

---

## 1. Headline findings (read these five)

1. **The ad auction tells you the truth about willingness to pay.** Money-adjacent queries bid **$24–$78 CPC**. Legal/eviction queries bid **$3–$6 CPC**. `tax relief` = 9,900/mo at **$77.53 CPC**; `tax relief programs` = 5,400/mo at **$77.89**. `debt help` = 12,100/mo at **$24.33**; `debt settlement` = 8,100/mo at **$30.06**. `eviction lawyer` = 12,100/mo at **$4.00**; `eviction notice` = 40,500/mo at **$2.86**. Legal keywords are cheap because the SERP is stuffed with legal-aid nonprofits and self-help content. Money keywords are expensive because lead-gen firms are bidding against each other for a $3,500–$15,000 retainer. **Implication: monetize legal problems with a product, not with ads. Monetize money problems with ads *and* a product.**

2. **The freelancer quarterly-tax calculator has been driven to $0.** One search surfaced six free, competent calculators (LancerCalc, fincalcs.co, fincalcapp.com, free1099taxcalc.com, clicktaxeasy, paycheckpartner, usefulcalculator). LancerCalc's own comparison table lists competitors at "$5–30/mo" and positions itself as "Free Forever." **This is not a product. It is a feature.**

3. **The single most valuable thing I found is a Reddit complaint that names a price and rejects it.** r/tax, May 15 2026 ([thread](https://www.reddit.com/r/tax/comments/1tebqob/finally_admitted_to_myself_i_have_no_idea_what_im/)):
   > "Like I know I'm supposed to set aside 'around 25-30%' but then someone mentions self employment tax and I panic and open like 6 tabs and close them all and just… transfer a random amount to savings and hope for the best"
   > "…is there something simple that isn't a full accounting subscription? all I want is to put in what I made, what I spent, and have something tell me what I owe. **feels like that shouldn't be a $30/month problem**"

   That is a stated budget ceiling, a stated feature list, and a stated reason the current market fails — in one paragraph. This is the most actionable artifact in the entire brief.

4. **Unauthorized practice of law got materially worse in 2026 and disclaimers no longer protect you.** *Upsolve, Inc. v. James*, No. 22-cv-627 (S.D.N.Y., Mar. 6 2026) — Judge Lewis Kaplan dismissed with prejudice; the 2d Circuit had already held UPL rules content-neutral (*155 F.4th 133*, 2025). The holding that matters: **"The line between lawful general information and unlawful individualized advice turns on what the speaker does—advises a specific person about a specific legal problem—not on what the speaker says about itself."** Florida Bar Formal Opinion 2024-1 goes further: AI that selects strategy or advises on rights **is** the practice of law, and in Florida that is a **third-degree felony** (Fla. Stat. § 454.23). FTC v. DoNotPay (FTC File No. 2323042) settled for $193K on the theory that disclaimers don't cure deceptive claims. **§5 has the full matrix.**

5. **One-time purchase is the default, and vendors market it as a feature, because these problems are episodic and terminal.** Every legal/medical/immigration vendor I read advertises "no subscription" explicitly — CivilCase: *"One price. Everything you need. No subscriptions. No upsells you have to dodge."* SmallClaimsHelper: *"a one-time fee of $19. No subscription or recurring fees."* ClaimBack: *"No subscriptions. No hidden fees. Pay once per claim."* VA Whisperer: *"Once you have it, you have it. No subscription, no monthly fee."* Eviction resolved = done. IRS plan set up = done. Judgment collected = done. **Nobody wants a subscription for a crisis that ends.**

---

## 2. Volume + CPC reality check

| Query | Vol/mo | CPC | Source |
|---|---|---|---|
| tax relief | 9,900 | **$77.53** | [softscotch](https://softscotch.com/seo-keywords-for-tax-preparation-services/) |
| tax relief programs | 5,400 | **$77.89** | softscotch |
| tax debt relief | 5,400 | $30.93 | [adtargeting](https://adtargeting.io/industry/debt-keywords) |
| debt help | 12,100 | $24.33 (PD 77) | adtargeting |
| debt settlement | 8,100 | $30.06 | adtargeting |
| consolidated credit | 12,100 | $15.50 | adtargeting |
| medical bills | 18,100 | **$23.72** (KD 51) | [seojuice](https://seojuice.com/keyword-research/healthcare/all/US/) |
| debt consolidation | 110,000 | $39.72 (PD 65) | adtargeting |
| immigration lawyer | 135,000 | $7.15 | [serpwars](https://serpwars.com/legal-keywords/) |
| divorce lawyers near me | 90,500 | $11.95 | serpwars |
| tenant lawyer | 14,800 | $4.39 | serpwars |
| eviction notice | 40,500 | $2.86 | serpwars |
| eviction lawyer | 12,100 | $4.00 | serpwars |
| landlord tenant lawyer | 6,600 | $5.38 | serpwars |
| small claims lawyer | 5,400 | $6.92 | serpwars |
| legal forms | 301,000 | $1.29 | [keywordspy](https://labs.keywordspy.com/overview/keyword.aspx?q=landlord+tenant) |
| free legal forms | 40,500 | $0.90 | keywordspy |
| metlife lawyer / attorney / met life lawyer | 27,100 each | $0.95–5.66 top-of-page, Low comp | [dmlawpartners](https://dmlawpartners.com/google-ads-for-metlife-lawyers/) (KP Jun 2025–May 2026) |

**Reading the table.** `legal forms` at 301,000/mo and $1.29 CPC says: enormous curiosity, near-zero willingness to pay per click. `medical bills` at 18,100/mo and $23.72 CPC says: a real payer exists in a supposedly informational query. The `metlife lawyer` cluster is a different play entirely — Low competition, floor-priced bids, and a 180-day ERISA clock. Denial-letter upload as the intake mechanism reportedly converts "3x to 5x better than a phone form" in that vertical.

**Meta on method.** DawnLedger ran the largest published study of this space (172,304 debt keywords, 30,000 distinct consumer questions) and **explicitly refuses to publish absolute volumes** because its numbers are model-estimated. Its durable finding is intent composition: **71% of debt keywords are informational, 18% commercial, 8% transactional, ~3% urgency.** Volume-weighted: 63% informational / 27% ready-to-act. Its methodology finding — free, self-help and court routes (8,974 distinct phrasings) are named *more* often than paid/structured programs (6,170) — is the most important strategic fact in this brief. ([methodology](https://dawnledger.com/research/debt-relief-search-landscape-2026/))

---

## 3. Category by category

### 3.1 Freelancer / side-income taxes — **highest pain, zero monetization**

**Demand (real language, r/tax, 2026):**
- *"First time owing the IRS from my business finally making a decent profit. Was having a panic attack at the amount owed. I (idiotically) didn't realize they let you split the payments up over the year."* ([Feb 2026](https://www.reddit.com/r/tax/comments/1qtz27i/))
- *"Sole proprietor — did not file or pay quarterly tax for 2025. 400k net income. **I didn't know i had to file or pay quarterly taxes.** ... should I send the irs the money now? before April 15?"* ([Mar 2026](https://www.reddit.com/r/tax/comments/1s7207y/))
- *"I'm trying to figure out whether I need to pay quarterly estimated taxes for 2026 and **I'm getting overwhelmed by all the IRS information**."* ([Jun 2026](https://www.reddit.com/r/tax/comments/1u9evbj/))
- *"I keep stressing and overthinking paying my quarterly taxes... I ended up creating a calculator with Claude AI to help me figure what I need to pay each quarter."* ([Jun 2026](https://www.reddit.com/r/tax/comments/1uafh7s/)) — **note this: a user hand-building the exact product, which is both proof of demand and evidence the free tier is "good enough."**

**Existing products:** six free calculators (above). Commercial CPA services: tax prep $10.46 CPC on `tax preparation services` (246,000/mo).

**Gap:** not calculation. The gap is the *ongoing, ongoing, ongoing* part — the person who wants to type two numbers a month and be told what to move to savings and when to send it. **The calculators answer "how much" once. Nobody has answered "what do I do every quarter, forever, without hiring someone."** That is also the only version that survives the $0 ceiling, because it's a workflow, not a formula.

### 3.2 IRS / tax debt

**Demand:** highest-CPC cluster in the entire study (`tax relief` $77.53, `tax relief programs` $77.89, `tax relief solutions` $35.26 on only 90/mo). ClarityTaxrelief's PAA harvest is built on this exact anxiety: *"It's 11 p.m. and you're six searches deep."*

**Existing products:** Claritiy Tax Relief, AuspiaAI, and a long tail of tax-resolution firms. Government-free options exist and are better than paid: installment agreements, Offer in Compromise (IRS accepted ~1 in 5 in FY2024, $205 fee), first-time penalty abatement, Currently Not Collectible.

**Gap:** the honest gap is that **most of these searches should not be sold a product.** DawnLedger's finding: of 123 searches naming $50,000+, **86 are student loans or IRS back-taxes** — debts "a paid unsecured settlement cannot and should not touch." Selling those people a $99 toolkit is selling them the wrong thing. The sellable product is a *decision tool* — "which of the five free IRS options fits your numbers" — not a settlement service.

**Hard credential line:** representing anyone before the IRS requires a Circular 230 credential (attorney, CPA, enrolled agent, or enrolled actuary). See §5.

### 3.3 Eviction defense — **highest urgency, weakest monetization, cleanest credential story**

**Demand — r/Renters, r/missouri, 2026, verbatim:**
- *"so today we (me and my mom) received an eviction notice... it has a court date of 7/29/2026... this is problem 1, in our lease it states the late fees will not exceed $155. problem 2 is that this lease was for the year we moved in (2021) and we never received a new lease so now we're technically on a month-to-month agreement."* ([Jul 2026](https://www.reddit.com/r/Renters/comments/1uwl3am/)) — **the actual question is about the lease, not the eviction.**
- *"I need help I'm about to be evicted **today**... he also only gave me 3 days to figure anything out. I start a job on Monday... so I'm trying to figure out the right footing to not be homeless."* ([r/missouri, May 2026](https://www.reddit.com/r/missouri/comments/1t6a7op/))
- *"The issue is they posted the notice on the 14th, at the end of the day (!!!), but its dated it the 13th?! So when do the three days start? **Was that a deliberate tactic?** That's 1 day left then!"* ([2024](https://www.reddit.com/r/AskLosAngeles/comments/1csqlm0/)) — **note: even in this thread the top answer is pure date arithmetic.** That's the product.
- Landlord banging on the door at 7pm with a flashlight ([r/TenantHelp](https://www.reddit.com/r/TenantHelp/comments/1q4x86a/)).

**Products and prices (all verified on their own sites):**

| Product | Price | Model |
|---|---|---|
| Ecomzy Mall Tenant Rights Toolkit | $9 (was $24) | one-time |
| caltenantlaw.com Eviction Defense Kit | $20, 39pp | one-time, incumbent |
| LegalCostCalculator.org kit | $22 | one-time |
| SmallClaimsHelper | $19 | one-time |
| LegalHubAI | $29 | one-time |
| CivilCase | $29 letter / $79 filing kit | one-time |
| ClaimKit (CA only) | $49 / $99 / $179 | one-time |
| Ezel.ai court filings | **$49/form**, $99 4-form packet | one-time, 30-day workspace |
| EvictionGuardian | $95 guide / $145 + consult | one-time |
| StopEvictionToday | $197 / $595 (paralegal reviewed) | one-time |
| EvictionStopNow | $495 | one-time |
| Sue.com | $249 | one-time |

**Gap:** the market is crowded at the bottom ($9–$99) with one premium attempt ($249) and one "we do it" attempt ($197–$595). The **uncontested gap** is a *lease-clause analyzer*: upload the lease and the notice, get flagged clauses ("your lease caps late fees at $155; the notice charges $280 — this clause may apply"), plus a deadline calendar computed from the notice dates, plus a filing checklist for the correct form number. Flagging a clause you can cite is not legal advice. Telling them the eviction is illegal *is*. That distinction is the whole business.

**Context:** California filing fees for unlawful detainer are **$240–$450**, and fee waiver (FW-001) is available ([CA Courts](https://selfhelp.courts.ca.gov/eviction-forms)). EvictionStopNow's own comparison says a lawyer runs **$2,000–$5,000+** at $250–500/hr.

### 3.4 Small claims court

Same demand shape as eviction, cleaner procedure. Market prices $19–$249. Filing fees $30–$75. Limits $2,500 (some states) to $25,000 (Texas); California $12,500. **Nobody at scale has done "we file it, you show up."** Note Ezel's bet: *"Most self-represented plaintiffs lose on a technicality: wrong form, wrong fee, wrong service. The kit removes the guesswork."* That is the correct product thesis — procedural correctness, zero legal judgment.

### 3.5 Insurance denial appeals — **crowded at $12–79, and everyone's product stops one step short**

**Products:** ClaimBack $12 (letter) / $59 (full fight, 100+ countries); DenialCrusher $39; DenialHelp $39/$59/$79; DenialFighter $39. All one-time. All explicitly "no subscription," all explicitly "no outcome guarantee."

**The demand is documented and the win condition is documented** (r/HealthInsurance):
- *"My Medicare Advantage plan dropped my current surgeon and hospital after surgery date was made... I appealed this decision I had the appeal overturned, but lost my upcoming surgery date."* ([May 2025](https://www.reddit.com/r/HealthInsurance/comments/1kdgzmq/))
- *"I needed a spinal fusion... My insurance company at the time denied it, twice, claiming there were other therapies... I then realized the denial was signed by a physician — an ENT. I demanded an orthopedist review my case, and within a week it was approved."* ([Dec 2024](https://www.reddit.com/r/HealthInsurance/comments/1hprjyx/))

**Gap:** the Reddit-derived win condition is *"make sure it has been reviewed by a physician who is a specialist."* **Every product sells the letter and stops.** DenialHelp is the only one gesturing past it ("supports a consented handoff to the practice") and it explicitly says "your clinician reviews the package." The unsold product is the **clinical evidence assembly** — pull the chart, the prior-auth history, the payer-specific policy (Cigna CPGs, Aetna Clinical Policy Bulletins, UHC Coverage Determination Guidelines), and package it so the clinician reviews for 10 minutes instead of 2 hours. **This is where the money is and it is deliberately unclaimed because it requires a clinician sign-off.**

**Credential flag:** the medical-necessity argument must come from a licensed clinician. Generating it yourself is medical practice.

### 3.6 Medical bills

**The single best documented demand-generation case in the entire space** is TikTok. Jared Walker / Dollar For posted a 60-second video in January 2021 explaining IRS §501(r) charity care; it hit 10M+ views in the first week, generated thousands of DMs, went to the front page of Reddit, and Dollar For has since cleared $19M+ (later: "more than that's for sure") in medical debt. ([KFF](https://kffhealthnews.org/health-care-costs/an-arm-and-a-leg-viral-tiktok-video-serves-up-recipe-to-crush-medical-debt/), [NPR](https://www.npr.org/2021/06/29/1011445496/can-tiktok-cancel-your-hospital-bills), [An Arm and a Leg transcript](https://armandalegshow.com/wp-content/uploads/2021/02/Transcript_Arm-and-a-Leg_S5-EP03_60-Second-Legal-Strategy_Feb-11-2021.pdf)) He also learned that 35 volunteers had to hand-build a database of ~2,700 hospital charity-care policies by hand because **there is no national database** — that gap is still open.

**Products:** BillAudit AI (self-reports 12,000 patients, 89% get some reduction, 67% average reduction, 21 days vs 60+); CostKits (free anonymous bill audit against the CMS NCCI bundling database and a 995,000-record Medicare fee schedule, built by an FSA/MAAA actuary; paid tier = auto-filled dispute letters); Claim Maximizer; VerifyDoc; CarePriceGuide (free itemized-bill-request generator as the funnel).

**Gap:** the free tier of CostKits already does the hard part (the code analysis). The paid product that wins is not better analysis — it's *assembly*: the itemized-bill request, the 501(r) financial-assistance application, the EOB reconciliation, the $400-above-GFE PPDR dispute (120-day window, $25 fee, [CMS](https://www.carepriceguide.com/blog/dispute-bill-over-good-faith-estimate-templates)), and the 40–60%-of-chargemaster cash offer — in one packet, in order, with the hospital's own published negotiated rate used as the anchor. Volume is roughly 60¢ on the dollar for large self-pay balances; that's the ROI story, and it is enormous.

**⚠️ Do not build on "medical debt is banned from credit reports."** Sources directly contradict each other. RecoverKit asserts the CFPB rule "is now in effect"; finbarrow, LegalClarity, RequestLetters and ailawyer all state a federal court **vacated it on July 11, 2025**. The durable, currently-in-force rules are the three bureaus' *voluntary* policies: paid collections removed, sub-$500 collections excluded, 365-day waiting period. Verify at [CFPB](https://www.consumerfinance.gov/) before publishing anything.

### 3.7 Government benefits — **the document is commodity; the representation is credentialed**

**Products:** SNAPBenefitsHelp $9.99 one-time appeal letter / $39.99-per-year subscription (explicit ROI math: "$2,400/year benefit, 480x return"); DisabilityFiled **$49 flat** "Complete Packet"; ACN Cares free for 60 days then $10.39/mo + a $149 re-activation fee; BenefitsNYC (NYC only); MedLink (NY/NJ/FL).

**DisabilityFiled's comparison page is the best strategic writing in this category:** DIY denial rate **62%**; disability attorneys take **25% of backpay capped at $7,200** (~$3,750 on a $15,000 award); the $49 packet keeps you 100% of benefits; total across reconsideration is $128 vs $3,750. That is a genuine, quantified, honest value argument — and it works by *not* touching the credentialed part.

**Credential flag — this is the hardest boundary in the brief.** Representation before the SSA may be done only by attorneys or **accredited representatives** under 4 CFR § 404.1740, and non-attorney reps are capped at 25% of backpay. So the entire legitimate product space is: *organize the applicant's own information into the official forms; the applicant signs and files.* DisabilityFiled states this explicitly and it is correct. Verify the CFR cite before relying on it.

### 3.8 Job loss / layoff / AI displacement

**Numbers (hunt for the consensus, not the headline):**
- ~**1.7M** US layoffs/discharges per month at a 1.1% rate (BLS JOLTS, April 2026)
- Average unemployment duration **26.0 weeks**, median **11.6 weeks** (BLS Table A-12, May 2026) — up from 21.9 weeks a year earlier
- Average severance **19.3 weeks**, up from 15.6 (Challenger, Gray & Christmas 2025, 8,000+ packages)
- Only **~9%** of eligible laid-off workers take COBRA (Commonwealth Fund) — eligibility ~66%. Cost: $9,325/yr single, $26,993/yr family (KFF 2025)
- **ACA enhanced premium tax credits expired Jan 1, 2026**; effect on marketplace premiums **+~114%** average (KFF 2025–26)
- **~1 in 3** cash out their 401(k) at job change — 42% hourly vs 21% salaried (Vanguard)
- **78% of HR leaders now describe layoffs as "regular" events**; 87% have conducted or plan layoffs (LHH/Adecco, Apr 2026) — ⚠️ this is an HR-services vendor surveying buyers, not workers. Directional only.
- Layoff has *no* resume penalty at 0–3 months: laid-off candidates interviewed at **5.74%** vs 4.97% employed (Huntr Q1 2026). The penalty is duration, not the layoff.

**Products:** ResumeTailor-style tools at **$9** (ResumePulse AI: "$9, PDF and Word delivered"); LastRound AI free tier / Starter / Ultimate (10 / 50 / 400 auto-applications per month); sisithefox $99 one-time "Career Reset File"; 1:1 coaches at $195/hr; corporate outplacement $100–$10,000+ per employee ($20,000+ executive).

**Gap — and it's a big one:** every product I found leads with **resume and LinkedIn**, which is now a $9 commodity and which the data says barely matters. Meanwhile the actual numbers describe a *financial* crisis: 9% COBRA take-up, 114% marketplace premium shock, one in three cashing out 401(k), and a 26-week search against 19.3 weeks of severance. **Nobody has productized the 90-day money plan**: runway calculator + severance-vs-continuing-offer comparison + COBRA-vs-marketplace arithmetic + the four 401(k) options + unemployment filing sequence (benefits are backdated to the *filing* date, so every week of delay is lost money). Every input is arithmetic and public program rules. Zero credential risk. This is the cleanest unclaimed product in the brief.

### 3.9 Immigration — **crowded, well-served on price, and the complaint is about lawyers, not DIY**

**Prices:** Immiva N-400 $199 / I-130 $149 / I-485 $249 (incl. I-864) / I-765 $99; Visaido I-130 Self-File Kit $99/case; Ezel $49/form; GreenCardApply $127 (since 1997); SimpleCitizen $599/$899/$1,299; Boundless ~$900–950; RapidVisa ~$699. Lawyers: N-400 **$500–$2,500**, marriage green card **$3,500–$6,000**, family petition I-130 **$2,000–$4,000**, H-1B $2,500–5,500, removal defense **$5,000–$15,000**, hourly $200–450. Government fees are separate and non-refundable: I-485 $1,440, I-130 $675, N-400 $760 paper/$710 online.

**Reddit demand:**
- *"Our lawyer quoted us $3,500 for their services, not including filing fees. We've received 2 bills thus far and the total is already over 3x more than that estimate... the bill from May alone was $1,000 over the full estimate we received."* ([r/USCIS, Aug 2026](https://www.reddit.com/r/USCIS/comments/1vd2hca/))
- *"On one hand, the circumstances make me want to hire professional help, but on the other hand, **my thin wallet says otherwise**... Would DIY filing be possible? What potential pitfalls should I be aware of?"* ([r/USCIS](https://www.reddit.com/r/USCIS/comments/1msbmu6/))
- *"before paying 5k to a lawyer I want to know if it would be worth it in my case"* ([r/DACA](https://www.reddit.com/r/DACA/comments/1cdmq1p/))
- The top DIY answer in that thread is a *YouTube channel* (Kseniya International), not a product.

**Gap:** the complaint is billing, not capability. Multiple sources describe the exact missing product — **unbundled**: DIY the forms, pay one hour of licensed-attorney review. Market rate is documented at **$425–$850** for a full package review and **$250–$1,000** for a 1–2 hour pre-filing review, plus $500–$2,500 for RFE-only help. LegalZoom's North Carolina consent judgment already established the compliant architecture: **lawyer reviews the document before delivery.** That is a buildable, defensible product at a real price point, and it is exactly what every one of the $99–$249 DIY tools refuses to do.

⚠️ **Flag:** FormGuard claims a DHS signature rule effective **07/10/2026** makes an invalid paper signature a *denial* (fee forfeited, no cure), not a rejection. Verify at [uscis.gov/forms/filing-guidance/fees](https://www.uscis.gov/forms/filing-guidance/fees) before publishing — if true it is a live, time-boxed content opportunity.

### 3.10 Small business / freelancer admin

**Commodity zone — do not enter with a template.** Operating agreement: LegalZoom $99 one-time, ZenBusiness $99, attorney $800–$2,400. Document packs: DBADocs $49 one-time (5 docs) **or $29/mo unlimited**; Fennec Press $9.99; Promptara $9.99/$19.99. Rocket Lawyer $39.99/mo or $239.88/yr. LLC formation itself: $35–$500 (national avg $129), California 5-year total $4,070.

**LLC vs sole proprietor is the one genuinely live question** and the one with a clean answer people get wrong: for a single owner, an LLC does **not** change the federal tax bill by a dollar (disregarded entity, same Schedule C, same SE tax). It changes liability exposure and state fees. That's a $29 calculator, not a $99 course — and it's the *misconception* ("getting an LLC lowers taxes") that makes people click.

**Getting paid:** the recurring freelancer complaint is "client won't pay me until they get paid." The dominant answer across every forum is *prevention*, not remedy — a contract with clear payment terms, deposits, and termination clauses. Virtual Pro Society's positioning is the honest one: *"Through my coaching and community work with VAs, one of the things I hear most often is 'this client won't pay me.' My first question is always 'what does your contract say?' And more often than not, what they show me is full of holes."*

**Gap:** the late-payment demand letter + small claims escalation ladder. Public addresses, $19–$29 demand letters (CivilCase), $79 filing kit, then small claims. The chained version — one purchase, all four rungs, pre-written — does not exist at a single price. Note the entire chain must be framed as the client's own words and the client's own data, with a hard stop at "you decide whether to file."

### 3.11 Unpaid wages / employment disputes

**Very low legal risk, strong penalties, weak product market.** State wage claims are free agency processes. Penalties are brutal and quotable: Colorado **200% of wages or $1,000 whichever is greater**, rising to 300%/$3,000 if willful; Illinois 5%/month damages + 1%/day penalty to the employee; FLSA liquidated damages equal the unpaid wages (double), plus fees and costs.

**Product reality:** Ezel offers a free pro-se wage claim guide. Every state DOL publishes its own free demand form (CO, IL, MD, TX, VA all do). **There is almost no paid market here** — the government already gives the template away, and the free channel is genuinely good. Flagging this so nobody builds into it expecting revenue.

### 3.12 Divorce / custody — deliberately out of scope

The highest-CPC legal cluster (`divorce lawyers near me` 90,500/mo at $11.95; Facebook CPL $50–150 vs Google $100–300 for family law, per My Legal Academy 2026). But every credible source converges on the same barrier: it is attorney work, Facebook can't target "people getting divorced," and the 2–8 week decision lag means the buyer isn't ready. **Not a $19–$99 product market.**

---

## 4. One-time vs subscription — the pattern is clear

| Problem type | Model | Examples |
|---|---|---|
| Court forms, filings, letters | **One-time, time-boxed** | $19–$249 per document; Ezel's "$49 for 3 days / $99 for 14 days" / 30-day workspace |
| Eviction defense | **One-time** | $9–$595 |
| Insurance appeal | **One-time** | $12–$79 |
| Immigration forms | **One-time** | $49–$249 |
| Medical bill packet | **One-time** | $9.99–$49 |
| Government benefits | **Hybrid** | $9.99 letter OR $39.99/yr; ACN free 60 days → $10.39/mo |
| Document libraries (repeat need) | **Subscription** | Rocket Lawyer $39.99/mo |
| Pro legal AI workspace | **Subscription** | Ezel Pro $249/mo |
| Career coaching | **Retainer** | $195/hr; 3–4 month packages |
| Corporate outplacement | **Per-employee contract** | $100 → $20,000+ |

**Three rules extracted:**
1. **Episodic + terminal problem = one-time.** Everyone in legal/medical/benefits markets advertises the absence of subscription as a feature. It converts better than a discount.
2. **Time-box the workspace, don't just price the document.** "$99 for 14 days" and "30-day workspace" are structurally different from "$99 forever" — they convert the panic without promising permanence.
3. **The free tier is the funnel and the artifact is the paywall.** CostKits, SNAPBenefitsHelp, DenialCrusher, RequestLetters, CivilCase's free case-strength check, Immiva's free eligibility check, Visaido's free tier, LancerCalc. Free analysis + blurred preview + paid for the *ready-to-send document* is the standard architecture.

---

## 5. Credential / licensing matrix — **the deliverable you asked for**

### 🔴 HIGH RISK — do not build without a license
| Activity | Why | Authority |
|---|---|---|
| Telling someone **which form to file** or **that they have a defense** | Selecting forms = legal advice. FL is a **third-degree felony** | Fla. Stat. § 454.23; FL Bar Op. 2024-1 |
| Any output that tells a specific person what to do about their specific case | *"the line… turns on what the speaker does… not on what the speaker says about itself"* | *Upsolve v. James* (S.D.N.Y. 2026); 155 F.4th 133 (2d Cir. 2025) |
| Appearing in court or contacting a court for them | Representation | UPL statutes, all states |
| Immigration **strategy**, inadmissibility analysis, drafting an RFE legal response | Must be attorney or DOJ-accredited rep | 8 CFR § 103.2(b) |
| Representing a claimant before the SSA | Attorney or accredited representative only; non-attorney capped at 25% of backpay | 4 CFR § 404.1740 |
| Drafting the **medical-necessity** argument in an insurance appeal | That's practicing medicine | State med-practice acts |
| Anything before the IRS as the taxpayer's representative | Circular 230 credential required | IRS Circular 230 |
| Promising or implying an outcome | FTC Act §5 | *FTC v. DoNotPay*, $193K |

### 🟢 SAFE — template, checklist, calculator, document assembly only
- Quarterly-tax calculators and set-aside schedulers; SE tax math
- Itemized-bill request letters; charity-care application packet assembly
- Bill negotiation scripts + benchmarking against published hospital price files
- FCRA §611 credit-report dispute letters; FDCPA §1692g debt validation letters
- Medical-debt credit-report removal letters (bureau-policy grounds)
- **Flagging a lease clause you can cite** ("this clause may apply") — never interpreting whether the eviction is lawful
- **Date arithmetic from the notice** — computing a deadline is not legal analysis
- Evidence checklists, hearing-day logistics, what-to-bring lists
- Resume/LinkedIn tailoring, interview scripts, networking message templates
- Runway calculators, severance comparisons, COBRA-vs-marketplace arithmetic
- Invoice/contract templates; late-fee escalation letters sent as the client's own words
- Benefits document checklists and renewal reminders
- Debt payoff / snowball / avalanche calculators

### 🟡 THE ONLY DEFENSIBLE ARCHITECTURE: **lawyer-in-the-loop**
The NC LegalZoom consent judgment requires an attorney to review documents before delivery and bars the vendor from exercising legal judgment in form selection. *Upsolve* means you cannot substitute AI for that. So:
- **Scope limitation beats disclaimer.** FirmAdapt's formulation is the correct one: "Tools that provide legal information (here is what the statute says) without applying it to specific facts (here is what you should do) have a much stronger position… The distinction requires careful product design, not just careful marketing."
- **Banned marketing phrases** (from state-bar complaint records): "AI lawyer," "AI attorney," "virtual lawyer," "We'll file your case," "We'll represent you," "Replaces your lawyer," "Our legal advice," "Win your case," "Beat the IRS," "Defeat your landlord."
- **Required disclaimer stack:** persistent "not legal advice" on every output page; "no attorney-client relationship" in ToS and at point of output; jurisdictional scope statement; attorney review available as an explicit upsell.
- **Build to the most restrictive state.** CA (Bus. & Prof. Code §§ 6125–6127, most institutionally aggressive UPL committee), FL (felony exposure), NY (Judiciary Law § 478, active committee). Texas has the friendliest statute — an express carve-out for software and forms that conspicuously state they are not a substitute for an attorney's advice.
- **Realistic worst case:** a cease-and-desist letter requiring product changes within 30 days plus public listing in the bar's UPL opinion record — which becomes a permanent search result for your company name. Usually not a fine. **Except in Florida.**

### Precedent to know
LegalZoom settled UPL challenges in NC, SC, OH, MO, AR, WA, CA, 2008–2015, paid fines, and restructured. Avvo settled with NY's AG in 2013. DoNotPay settled with the FTC in 2023 and restructured. **All three survived by changing the product, not the disclaimer.** Watch *Nippon Life v. OpenAI* (2026) — a UPL theory being actively litigated against a non-lawyer legal tool.

---

## 6. Where buying intent actually lives

**Google — for money, not for legal.** Proven by the CPC spread (§2). Money keywords bid $24–78 because lead-gen firms are auctioning. Legal keywords bid $3–6 because the SERP is owned by legal-aid nonprofits and self-help content.

**But Google is eating itself in these categories.** AI Overviews now appear on a large share of legal queries and cut organic CTR by **~61%** for sites not cited; cited pages earn **35% more clicks**; AI tools direct **~28% of consumers to a lawyer** (Clio 2025). **A pure-SEO play is weakening fastest exactly where the problem is most urgent.** ([Outrank Playbooks](https://www.outrank.so/playbooks/law-firm))

**Reddit — where the demand and the demand-shaping live, but you cannot sell.** r/personalfinance has **21.8M members**. Its rules: **Rule 2** bans all self-promotion including accounts with promotional profiles, affiliate links, and repeated financial credentials; **Rule 9** bans AI-generated content and bots; **Rule 13** bans legal and business discussion; **Rule 21** bans career and medical advice; posting requires 100 karma and 30 days of account age; open-source tools and customer-service replies need pre-approval. A user got permabanned for asking for feedback on their own free Excel workbook. **Treat Reddit as free research and free trust-building, never as a channel.** It is where people ask "should I pay $X for this," and where bad products are publicly destroyed — which is why the survivors all have scrupulous "no outcome guarantee" copy.

**Facebook — cheapest per lead, earliest in funnel, and the only channel with language targeting.** Family law: **$50–150 CPL on Facebook vs $100–300+ on Google**, but leads are 2–8 weeks from being ready. Immigration: **$8–25 CPL vs $15–45+ per click on Google**, and you can target Spanish/Chinese/Hindi/Tagalog/Vietnamese/Arabic in ways Google cannot. Caveat: you cannot target "people getting divorced" or "people about to be evicted" — you proxy via life events (recently moved, new job, empty nest) and inferred interests.

**TikTok — the one documented case of a single piece of content creating a demand category.** Jared Walker's 60-second charity-care video: 10M+ views in week one, thousands of DMs, front page of Reddit, $19M+ of debt cleared. Dr. Jenayn Calderilla's 3-part series on negotiating uninsured bills: 4.5M+ views. **Caveat: both from 2021 — I could not find a 2025–2026 comparable. Flagging the age.** But the mechanism (a credentialed or trusted individual explaining a statutory right in 60 seconds) has no reason to have gone stale, and it maps perfectly onto the 501(r)/No Surprises Act material.

**YouTube — quietly dominant in immigration.** The single most-upvoted DIY answer in r/DACA points to a YouTube channel, not a product. For high-stakes problems, an hour-long walkthrough of a government form beats a $99 PDF for a large fraction of the audience, and it is free.

---

## 7. Gaps, ranked by (pain × willingness-to-pay × credential safety)

1. **The ongoing freelancer tax workflow.** Explicit "$30/month problem" objection; the calculator half is free; nobody sells the recurring half. Zero credential risk. Test $29–49 lifetime.
2. **The 90-day post-layoff money plan.** The emotional problem is real, the financial data is damning (9% COBRA, +114% marketplace, 1-in-3 401(k) cashouts, 26-week search vs 19.3-week severance), and the entire market is selling resumes instead. All arithmetic. Zero credential risk.
3. **Lease-clause + notice analyzer for eviction.** The #1 thing renters in the sample were actually asking was about *their lease*, not the eviction. Flag-the-clause is safely outside UPL. Natural upsell to the existing $79–$99 filing kits.
4. **Unbundled immigration: DIY forms + 1 hour of licensed review.** Documented market rate $425–$850. Complaints are about lawyer billing (3x over quote), not about DIY. The LegalZoom-NC architecture is already legally settled. Highest price point on the list.
5. **Clinical evidence assembly for insurance appeals.** Every product stops at the letter; the Reddit-derived win condition is specialist review. Requires a clinician sign-off, so it's a partnership product, not a solo product. Highest ceiling.
6. **Late-payment escalation ladder (freelancer → small claims).** One purchase, four pre-written rungs. Prevention-over-remedy framing is what the audience actually responds to.
7. **Medical-bill packet assembly.** The free audit already exists; the paid product is assembly, not analysis. Enormous ROI story (60¢ on the dollar). Zero credential risk — it's your own bill and your own rights.

**Do not build:** freelance tax *calculators* (free, saturated); unpaid-wage claim kits (states give them away free); LLC operating agreements ($99 vs $800–2,400, commoditized); divorce/custody (attorney work); any debt-settlement service (FTC TSR advance-fee regime, 259 enforcement actions in a decade, and the FTC + Nevada AG are actively suing tax-debt-relief firms — [Oct 2025](https://www.mondaq.com/unitedstates/financial-services/1697482/ftc-and-nevada-ag-crack-down-on-deceptive-tax-debt-relief-scams-mimicking-the-irs)).

---

## 8. Uncertainty register — read before acting

**Keyword data is weak and internally inconsistent.**
- `eviction notice`: **135,000/mo** (keywordspy) vs **40,500/mo** (serpwars). 3.3x apart.
- `debt`: **823,000** (aitechtonic) vs **201,000** (adtargeting). 4x apart.
- aitechtonic's table is internally suspect — it assigns identical volumes to `unsecured debt` (823,000) and `mortgage debt` (201,000) and repeats volumes down the ranking in suspiciously regular steps. **Treat aitechtonic and directorysiteslist as content-farm output, not data.**
- DawnLedger explicitly disclaims its own volumes as model-estimated. Its *intent composition* is the reliable output.
- Net-net: **volumes below ~10,000/mo are noise. CPC is the signal** — and CPC came from Keyword Planner-grade sources.

**The CFPB medical-debt rule status is genuinely contested in the sources I read.** See §3.6. Verify before publishing anything.

**"80% of hospital bills contain a coding error" is not sourced.** Attributed to "CMS internal audits" by SEO content mills; I could not find a primary CMS document. BillAudit AI's "89% get some reduction / 67% average / 12,000 patients" is vendor self-report with no published methodology. **Do not use either in marketing copy.**

**Layoff counts disagree by 2x depending on definition.** "85,411 tech cuts YTD 2026, AI cited in 16%" (Huntr, via ResumeAdapter) vs "183,966 workers across 247 events, ~55% citing AI" (ResumePulse). At least one is aggregating announced-vs-confirmed differently. Unresolved.

**LastRound AI's own post admits its target query got "3 impressions at average position 42"** across 45 days — i.e., the site has negligible traffic. Do not treat LastRound, ResumeAdapter or ResumePulse as independent data sources; they recycle each other and Huntr.

**LHH's 87%-planning-layoffs stat is HR-services marketing** (Adecco Group selling outplacement). It describes buyer intent, not worker experience.

**Circular 230 and 4 CFR § 404.1740 are cited from general knowledge, not from a fetched primary source.** Verify both before relying on them for a compliance claim — they are the two most load-bearing credential boundaries in this brief.

**The Dollar For / TikTok case is from 2021.** I found no 2025–2026 equivalent. The $17B tax-benefit figure is from a Lown Institute analysis cited secondhand via Access Ventures.

**TikTok is a live regulatory risk for exactly these verticals** — financial services and health are both restricted ad categories, and debt-relief/tax-relief are named in enforcement actions. If a TikTok video is the demand engine, the account is the single point of failure.

---

## 9. What I'd test first

1. **$29–49 lifetime "Quarterly Tax Set-Aside"** against the exact r/tax complaint: *"put in what I made, what I spent, and have something tell me what I owe... shouldn't be a $30/month problem."* Free calculator as the funnel, paid for the recurring scheduler + the payment instruction + the deadline calendar. Weeks to build. Tests the single clearest price objection in the brief.
2. **$39 "Post-Layoff Money Plan"** — runway, severance-vs-continuing, COBRA vs marketplace arithmetic, 401(k) four options, unemployment filing order. Every input is public program data. Resume coaching is a $9 red herring; the financial decisions are the actual 2026 crisis.
3. **Lease + notice analyzer** as a lead magnet into the existing $79–$99 eviction filing kits. Sells the thing renters are actually asking about. Requires the hardest UPL discipline: flag, never conclude.
4. **Watch *Nippon Life v. OpenAI*.** If the UPL theory advances, the entire unbundled-legal-recommendation category — including every one of these products — re-risks. If it fails, the unbundled immigration review product at $425–$850 becomes considerably more attractive.
