# Study Design — Academic Surgery — RCTs, Cohort Studies & Advanced Surgical Trial Methodology

*Block C · Academic Surgery · PGY2-4*

*Guidelines: CONSORT 2010 · STROBE 2007 · IDEAL Collaboration 2016 · ICH E9(R1) Estimand Framework*


## Hierarchy of Study Designs

Surgical research spans a hierarchy of study designs, each with distinct strengths and limitations. The choice of design must be matched to the research question: aetiology, therapy, prognosis, diagnosis, and harm questions have different optimal designs. The study design determines what can be concluded — not the sample size, not the statistical analysis. Understanding this hierarchy is essential for critical appraisal of the surgical literature.

*Study Design Classification and Appropriate Questions*
Design | Type | Best for | Main Limitation
--- | --- | --- | ---
Systematic review + meta-analysis | Synthesis | Treatment efficacy; prevalence | Quality of included studies; heterogeneity
RCT | Experimental | Causal inference for treatment effects | Cost; feasibility in surgery; blinding problems
Prospective cohort | Observational | Incidence, prognosis, risk factors | Selection bias; loss to follow-up; confounding
Retrospective cohort / case-control | Observational | Rare disease; long-latency outcomes; hypothesis-generating | Recall bias; confounding; selection bias
Cross-sectional survey | Observational | Prevalence; screening test evaluation | Cannot establish temporality or causation
Case series / case report | Descriptive | Novel findings; hypothesis generation; rare complications | No control group; cannot establish rates

> **Board Pearl — IDEAL Framework for Surgical Innovation** — The IDEAL Collaboration (McCulloch, Lancet 2009) provides a staged framework for evaluating surgical procedures: Stage 1 (Idea — first-in-human), Stage 2a (Development — technical refinement, small series), Stage 2b (Exploration — prospective development study with registry), Stage 3 (Assessment — comparative study, often RCT), Stage 4 (Long-term study — registry, surveillance). Surgical procedures often enter clinical practice at Stage 2a — the IDEAL framework promotes rigorous evaluation before widespread adoption.

The parallel group superiority RCT — where participants are randomised to intervention or control and followed for the same primary outcome — is the fundamental design for establishing treatment efficacy. However, this is only one of many randomised designs available to the surgical researcher. Alternative randomised designs (crossover, factorial, cluster, adaptive, stepped-wedge, platform) offer efficiency, pragmatic appeal, or unique suitability to specific research questions. Non-randomised designs (cohort, case-control, registry-based) remain essential when RCTs are not feasible.


## Randomised Controlled Trials in Surgery

The RCT is the gold standard for establishing causality, but surgical RCTs face unique challenges: (1) **Blinding**: patients and surgeons cannot be blinded to the operative approach — only outcome assessors can be blinded (assessor-blinded design); (2) **Learning curve**: technical variation between surgeons makes the experimental arm heterogeneous; (3) **Equipoise**: genuine clinical uncertainty must exist for randomisation to be ethical; (4) **Consent**: patients may refuse randomisation when the treatment involves very different operations; (5) **Contamination**: surgeons who participate in both arms may adopt techniques from the experimental arm. These challenges explain why surgery has fewer RCTs than pharmacotherapy.

The **CONSORT 2010 statement** provides a 25-item checklist and flow diagram for reporting parallel group RCTs. Key items for surgical trials include: Item 4 (eligibility criteria — include centre volume and surgeon experience thresholds); Item 5 (intervention description — sufficient detail for replication, including learning curve considerations); Item 9 (allocation concealment mechanism — central randomisation by telephone/web is the gold standard); Item 11 (blinding — specify who was blinded and method; for surgical trials, assessor-blinded is the achievable standard); Item 14 (recruitment — CONSORT flow diagram showing all participants at each stage). CONSORT extensions exist for: cluster RCTs, crossover trials, non-inferiority trials, and surgical interventions (TIDieR extension for intervention description).

> **Common Pitfall — Allocation Concealment vs Blinding** — Allocation concealment and blinding are different concepts: **Allocation concealment** prevents those enrolling patients from knowing the next allocation — this prevents selection bias at enrolment and is mandatory for all RCTs. **Blinding** prevents knowledge of the allocated treatment from influencing outcome assessment after enrolment. Allocation concealment is achievable in all trials (sealed envelopes, central randomisation); blinding of the surgeon and patient is often impossible in surgical trials. Confusing the two is a common critical appraisal error.

*CONSORT 2010 — Key Items for Surgical Trial Critical Appraisal*
Item | What to Check | Red Flag
--- | --- | ---
Item 1 — Randomisation method | Sequence generation: computer-generated or table of random numbers | Quasi-randomisation (alternating, date of birth, hospital number) is NOT true randomisation
Item 9 — Allocation concealment | Mechanism to prevent foreknowledge: central telephone/web randomisation, pharmacy control | Sealed envelopes can be tampered with — not gold standard for surgical trials
Item 11 — Blinding | Who was blinded: patient, surgeon, outcome assessor, statistician, data monitoring committee | No mention of blinding at any level is a high-risk-of-bias signal
Item 13 — Flow diagram | All participants screened, eligible, randomised, analysed; reasons for exclusion at each stage | Missing or incomplete flow diagram prevents assessment of selection bias
Item 16 — Primary analysis | Intention-to-treat as primary; per-protocol as sensitivity | Per-protocol as primary without ITT analysis
Item 19 — Harms | All serious adverse events and protocol-specified harms must be reported | Reporting only positive outcomes without harm data


## Observational Study Methodology

*Key Biases in Surgical Observational Research*
Bias | Definition | Example | Mitigation
--- | --- | --- | ---
Selection bias | Groups differ systematically at baseline | Laparoscopic vs open — younger fitter patients get laparoscopic | Propensity score matching; multivariable regression
Confounding by indication | Indication for treatment is associated with outcome | Sicker patients get more radical surgery | Instrumental variable analysis; restriction
Immortal time bias | Follow-up period misattributed to exposed group | Time to receive neoadjuvant therapy counted as exposure | Correct time-at-risk calculation
Information bias | Systematic error in data collection/classification | Retrospective chart review — missing complications | Prospective data collection; validated registries
Attrition bias | Differential loss to follow-up by group | Patients with complications lost to follow-up | Intention-to-treat analysis; sensitivity analysis

> **Board Pearl — Intention-to-Treat Principle** — In RCTs, the **intention-to-treat (ITT) principle** analyses all randomised patients in their assigned group, regardless of what treatment they actually received. ITT preserves the benefits of randomisation (comparable groups) and reflects real-world effectiveness (including non-adherence). The alternative — per-protocol analysis (only patients who completed assigned treatment) — is prone to selection bias. Always report ITT as primary analysis; per-protocol as sensitivity. Missing data in ITT is handled by multiple imputation or mixed models — never by dropping patients.

The **STROBE statement** (Strengthening the Reporting of Observational Studies in Epidemiology) provides a 22-item checklist for cohort, case-control, and cross-sectional studies. Key items relevant to surgical observational research: Item 6 (eligibility criteria — must be pre-specified, not defined post-hoc); Item 7 (exposure definition — must be clinically valid and consistently applied); Item 12 (statistical methods — regression model variable selection must be described); Item 13 (participants — flow diagram showing exclusions with reasons); Item 16 (main results — effect sizes with 95% CIs, not just p-values); Item 20 (limitations — must include discussion of confounding, bias, and generalisability).


## Crossover and Factorial Trial Designs

The **crossover design** assigns all participants to receive both treatments in sequence, separated by a washout period. Each participant acts as their own control, eliminating between-subject variability and dramatically increasing statistical efficiency — typically requiring one-quarter the sample of a parallel group trial for the same power. In surgical research, crossover designs are applicable when: (1) the condition is stable and chronic (not curable by the intervention); (2) the intervention has a reversible effect; (3) a washout period can eliminate carryover effects; (4) the intervention is non-invasive (e.g., peri-operative medication, positioning, physiotherapy). Crossover designs are generally not appropriate for operative interventions because surgery is irreversible and the washout period cannot meaningfully eliminate the effects of one operation before the next.

The **washout period** in a crossover trial must be long enough to ensure that the effect of the first treatment has completely dissipated before the second treatment begins. If the washout is inadequate, **carryover effect** occurs — the effect of treatment A persists into the measurement period of treatment B, confounding the comparison. Washout duration depends on the biological half-life of the intervention effect. For pharmacological agents, a minimum of 5 half-lives is typically required. For surgical interventions applied to chronic conditions (e.g., nerve blocks, anaesthetic techniques), the washout is guided by the expected duration of biological effect. Statistical detection of carryover uses a test of the period-by-treatment interaction.

The **factorial design** tests two or more interventions simultaneously within the same trial. In a 2×2 factorial, participants are randomised to: A+B, A+placebo-B, placebo-A+B, or placebo-A+placebo-B — generating four groups that allow testing of both A and B independently in separate 2-group comparisons. Factorial designs are highly efficient: they can answer two questions for approximately the cost of one trial, provided the two interventions do not interact. When factorial designs are used to test two questions, the power calculation assumes no interaction. When the goal is specifically to test for interaction (does A work better in the presence of B?), the sample size must be multiplied by 4 — making factorial interaction studies very large.

> **Interaction in Factorial Designs** — The critical assumption of a factorial design is **no qualitative interaction** between the two interventions — meaning A works similarly whether or not B is given. If this assumption is violated, the factorial analysis is misleading. Before using a factorial design, verify biological plausibility of independence. Example: testing two components of an enhanced recovery protocol simultaneously assumes they act additively — if one element counteracts the other, the factorial result will be uninterpretable. Always test for interaction statistically and report the interaction term, even if not significant.

*Crossover vs Factorial vs Parallel Group — Key Features*
Feature | Parallel Group | Crossover | Factorial (2×2)
--- | --- | --- | ---
Sample size efficiency | Reference | ~25% of parallel (within-subject control) | ~50% of parallel (tests 2 questions)
Carryover risk | None | Major concern — requires washout period | None (no temporal sequence)
Applicable in surgery | Always | Only non-operative or reversible interventions | If interventions are independent
CONSORT extension? | Core CONSORT 2010 | CONSORT crossover extension | CONSORT factorial extension
Key analysis issue | ITT primary | Period and carryover effects must be tested | Test interaction before main effects


## Adaptive Trial Designs in Surgery

Adaptive designs allow pre-specified modifications to trial parameters during the trial based on accumulating data, without compromising type I error rate. The modifications must be pre-specified in the protocol and statistical analysis plan — they are not ad-hoc decisions made after observing results. Common adaptive modifications include: **Interim analysis with stopping rules** (stop early for efficacy or futility); **Sample size re-estimation** (adjust the final sample size based on observed variance); **Adaptive allocation** (increase allocation to better-performing arm — response-adaptive randomisation); **Population enrichment** (restrict enrolment to subgroups showing greatest benefit after an interim look); **Seamless phase designs** (combine phase II dose-finding with phase III confirmatory testing).

**Interim analyses** — planned looks at accumulating data during the trial — require pre-specified stopping rules (also called stopping boundaries) to control the overall type I error rate. Because multiple looks at the data inflate the type I error rate (similar to multiple comparisons), the significance threshold at each interim must be adjusted. Common spending functions include: **O'Brien-Fleming boundaries** (very conservative early, approaching full α late — difficult to stop early, appropriate when prior evidence is weak); **Pocock boundaries** (equal alpha at each look — easier to stop early but higher overall early stopping rate); **Lan-DeMets alpha-spending function** (flexible, can be applied at unplanned look times). The Data Safety and Monitoring Board (DSMB) reviews interim analyses — they are independent of the trial team to prevent bias.

> **DSMB — Data Safety and Monitoring Board** — All large RCTs, particularly those testing surgical interventions with potential for harm, should have an independent Data Safety and Monitoring Board (DSMB). The DSMB: (1) reviews unblinded interim safety and efficacy data at pre-specified intervals; (2) applies the stopping rules to recommend early termination for benefit, harm, or futility; (3) reviews serious adverse events and unexpected protocol deviations; (4) reports to the trial steering committee while the trial team remains blinded. DSMB members must be independent of the trial — no investigators or sponsor representatives. Regulatory guidance (FDA draft guidance 2019; EMA reflection paper) mandates DSMB for most phase III trials.

> **Adaptive Designs — When They Go Wrong** — Adaptive designs are methodologically complex and require prospective statistical planning before any data are seen. Common failures include: (1) modifications not pre-specified — any unplanned adaptation inflates type I error; (2) inadequate blinding of adaptation decisions — if the trial team knows which arm is doing better, this introduces bias; (3) operational bias — if arm allocation changes, investigators may deduce which arm is superior from the new allocation ratio; (4) under-powered final analysis — if sample size re-estimation is misapplied. Regulatory agencies (FDA, EMA) require detailed statistical analysis plans for adaptive designs.


## Cluster Randomised Trials

In a **cluster randomised trial (CRT)**, the unit of randomisation is a group (cluster) rather than an individual — for example, a hospital, a surgical unit, or a theatre team. All eligible individuals within a cluster receive the same intervention. Cluster randomisation is appropriate when: (1) the intervention is delivered at the cluster level (e.g., a new surgical checklist, a training programme, a theatre protocol); (2) individual randomisation would result in contamination (if some surgeons in the same unit use the intervention and others do not, the control group is contaminated); (3) the research question is inherently about a system or team, not an individual patient.

The statistical implication of cluster randomisation is that patients within the same cluster are more similar to each other than patients in different clusters — this is called **clustering or within-cluster correlation**. The degree of clustering is quantified by the **intraclass correlation coefficient (ICC)**, which ranges from 0 (no clustering effect — patients within a cluster are as different as patients across clusters) to 1 (perfect clustering — all patients within a cluster have identical outcomes). Even a small ICC (e.g., 0.05) substantially increases the required sample size — the sample size must be multiplied by the **design effect = 1 + (m−1) × ICC**, where m is the average cluster size.

*Cluster RCT — Sample Size Inflation by ICC and Cluster Size*
ICC | Cluster size (m) | Design Effect | Equivalent individual trial ratio
--- | --- | --- | ---
0.01 | 20 | 1.19 | Cluster trial needs 19% more patients
0.05 | 20 | 1.95 | Cluster trial needs ~2× more patients
0.05 | 50 | 3.45 | Cluster trial needs 3.5× more patients
0.10 | 20 | 2.90 | Cluster trial needs ~3× more patients
0.10 | 50 | 5.90 | Cluster trial needs ~6× more patients

> **Stepped-Wedge Design** — The **stepped-wedge design** is a variant of the cluster RCT in which all clusters start in the control condition, then sequentially cross over to the intervention at different randomly assigned time points ('steps'). By the end of the trial, all clusters have received the intervention. This design is appropriate when: (1) the intervention is believed to be beneficial and it would be unacceptable to permanently withhold it from some clusters; (2) the intervention must be rolled out sequentially for logistical reasons; (3) the research question is about implementation effectiveness. All time-periods contribute to both control and intervention estimates, maximising statistical efficiency. Analysis requires mixed models accounting for time trends and clustering.


## Non-inferiority and Equivalence Trials

A **non-inferiority (NI) trial** tests whether a new treatment is not unacceptably worse than an established active control — within a pre-specified non-inferiority margin (Δ). NI trials are appropriate when: (1) a new treatment has potential advantages in safety, cost, convenience, or invasiveness compared to the established treatment; (2) the established treatment is known to be effective (so placebo control would be unethical); (3) the research question is whether the new treatment can replace the established treatment. Example: 'Is laparoscopic colectomy non-inferior to open colectomy for 5-year overall survival, within a margin of 5% absolute difference?'

The **non-inferiority margin (Δ)** is the largest clinically acceptable difference between the new and standard treatment. Setting Δ requires: (1) clinical judgement — how large a difference would clinicians and patients accept given the benefits of the new treatment?; (2) statistical reasoning — Δ must be smaller than the previously established benefit of the active control over placebo, to preserve at least part of that benefit ('fraction retention' approach). If Δ is too large, a new treatment that is substantially inferior to the standard could be declared non-inferior. Regulatory agencies (FDA, EMA) require pre-specification of Δ with justification.

Analysis of NI trials uses the **confidence interval approach**: the trial is non-inferior if the upper confidence limit of the difference (new minus standard) does not exceed Δ. A critical nuance: in NI trials, the ITT analysis (which dilutes treatment differences by including non-adherent patients) is **conservative for superiority** testing but **anti-conservative for NI** testing — non-adherence makes groups look more similar, spuriously supporting NI. Therefore, NI trials must report both ITT and **per-protocol (PP) analyses**, and NI should be declared only if both agree.

> **NI Trial Pitfalls — Biocreep and Margin Inflation** — **Biocreep** occurs when successive NI trials each establish a new standard treatment that is slightly worse than the previous one — through the chain of NI margins, the eventual treatment may be substantially inferior to the original placebo-controlled comparator. To prevent biocreep, the NI margin must be explicitly linked to the original placebo-controlled evidence base, not just to the most recent active comparator. Always check: has this non-inferiority margin been justified against the original placebo-controlled evidence for the active control?


## Qualitative Research Methods in Surgery

Qualitative research explores the lived experience, meanings, perspectives, and processes underlying health and healthcare, using methods that generate non-numerical data. In surgical research, qualitative methods address questions that quantitative designs cannot: 'Why do surgeons vary in their adoption of a new technique?'; 'What do patients experience during recovery from major abdominal surgery?'; 'Why is compliance with an enhanced recovery protocol low in this hospital?'. Qualitative findings complement quantitative results and are essential components of complex intervention evaluation.

The major qualitative research methods used in surgical research include: (1) **Semi-structured interviews** — in-depth one-to-one conversations using a flexible topic guide; ideal for exploring individual experiences, decision-making, and perspectives; recorded, transcribed verbatim, and analysed thematically; (2) **Focus groups** — group discussions generating data through interaction and debate; ideal for exploring shared experiences and social norms within surgical teams; (3) **Ethnographic observation** — researcher directly observes clinical practice (e.g., in theatre, ward rounds) to understand real-world behaviour; (4) **Document analysis** — systematic analysis of clinical records, meeting minutes, protocols, or policy documents as data sources; (5) **Think-aloud methods** — participants verbalise their reasoning during a task (e.g., reading a consent form) to reveal cognitive processes.

**Thematic analysis** is the most widely used analytical approach in surgical qualitative research. The process: (1) familiarisation with the data — read all transcripts thoroughly; (2) generating initial codes — label segments of data systematically; (3) searching for themes — group codes into candidate themes; (4) reviewing themes — check themes against coded data and full dataset; (5) defining and naming themes — produce a clear, accurate account of each theme; (6) producing the report — write up findings with illustrative quotations. Thematic analysis is theoretically flexible — it can be applied within multiple qualitative frameworks (phenomenology, grounded theory, framework analysis).

*Qualitative Research Reporting — COREQ Checklist Key Items*
Domain | Key Items | Common Omissions
--- | --- | ---
Research team | Researcher characteristics; relationship to participants; prior assumptions | Reflexivity statement often missing in surgical papers
Study design | Sampling method (purposive vs snowball); sample size justification (data saturation) | Claiming 'saturation' without describing the process
Data collection | Interview guide development; recording method; field notes | Failing to provide the topic guide as supplementary material
Analysis | Coding process; NVivo or other software; member-checking; triangulation | Single-analyst coding without peer review of themes
Reporting | Participant quotations; negative cases; researcher impact on findings | Only reporting quotes that confirm the researcher's prior view

> **Mixed Methods in Surgical Trials** — The Medical Research Council framework for complex interventions recommends **process evaluation** alongside RCTs of complex surgical interventions. A process evaluation uses qualitative and quantitative methods to understand: (1) **Fidelity** — was the intervention delivered as intended?; (2) **Dose** — how much of the intervention did participants receive?; (3) **Mechanisms** — how did the intervention work (or fail)?; (4) **Context** — what contextual factors modified the intervention's effect? Example: the ICAN trial (ICU-delivered rehabilitation after major abdominal surgery) embedded a qualitative process evaluation exploring patient and physiotherapist experiences, explaining why patients in some centres received more rehabilitation than others.


## Estimand Framework and Pragmatic vs Explanatory Trials

The **estimand framework** (ICH E9(R1), 2019) provides a structured approach to defining precisely what the trial is designed to estimate — the 'target of inference'. The estimand consists of five components: (1) **Population** — which patients does this question apply to?; (2) **Treatment** — what are the two (or more) treatments being compared?; (3) **Variable** — what outcome is being measured?; (4) **Population-level summary** — what is the treatment comparison measure (risk difference, hazard ratio, mean difference)?; (5) **Intercurrent events** — what happens to the estimand when patients discontinue treatment, cross over, or die?. The choice of how to handle intercurrent events (e.g., 'treatment policy strategy' = include all patients regardless of treatment discontinuation; 'hypothetical strategy' = what if all patients had adhered?) determines whether the trial estimates effectiveness or efficacy.

The distinction between **pragmatic** and **explanatory** trials reflects the estimand's focus. Pragmatic trials estimate the effect of offering a treatment in routine clinical practice — they use broad eligibility criteria, routine care settings, and ITT analysis with the 'treatment policy' strategy for intercurrent events. They measure effectiveness. Explanatory trials estimate the biological effect of treatment when perfectly administered — they use strict eligibility criteria, intensive per-protocol monitoring, and hypothetical strategies for intercurrent events. They measure efficacy. Most phase III surgical trials aim to be pragmatic — the PRECIS-2 tool (Pragmatic-Explanatory Continuum Indicator Summary) provides a graphical assessment of how pragmatic or explanatory a trial design is across 9 domains.

> **Platform, Basket, and Umbrella Trials** — **Platform trials** are a paradigm in which multiple interventions are tested simultaneously within a single master protocol and infrastructure, with arms that can be added or dropped based on pre-specified stopping rules — sharing control arm data across all comparisons. **Basket trials** enroll patients with a specific molecular/biological marker regardless of tumour histology, testing whether the intervention works across tumour types sharing the target. **Umbrella trials** enroll patients with a single tumour histology but randomise to different targeted therapies based on molecular subtype profiling within the trial. These designs are primarily used in oncology but are beginning to appear in surgical-oncology research (e.g., STAMPEDE in prostate cancer, I-SPY in breast cancer).