# Systematic Review & Meta-Analysis — Academic Surgery — PRISMA, Cochrane Methods, Advanced Synthesis & Living Reviews

*Bloque C · Academic Surgery · PGY3-4*

*Guías: PRISMA 2020 · Cochrane Handbook v6.3 2022 · GRADE 2013 · PROSPERO · NMA-CONSORT Extension*


## Systematic Review Methodology

A systematic review applies a pre-specified, transparent, and reproducible methodology to identify, evaluate, and synthesise all available evidence relevant to a clearly defined research question. It is distinguished from a narrative review by its protocol pre-registration (PROSPERO), comprehensive and documented search strategy, explicit inclusion/exclusion criteria, systematic risk of bias assessment, and quantitative synthesis (meta-analysis) when appropriate. The PRISMA 2020 checklist (27 items) is the mandatory reporting standard — completion of the PRISMA checklist is required for submission to most high-impact surgical journals.

*PRISMA 2020 — Key Process Steps*
Stage | Action | Tool/Standard
--- | --- | ---
Protocol registration | Pre-register protocol before data extraction | PROSPERO (prospero.york.ac.uk)
Search strategy | PICO-structured; Boolean operators; MeSH + free text; date range | Documented in appendix; PRESS checklist for peer review of search
Database search | Minimum: MEDLINE, EMBASE, CENTRAL (Cochrane); consider WHO ICTRP for trials | Exported to Rayyan or Covidence for deduplication
Study selection | 2 independent reviewers; title/abstract then full-text screening; PRISMA flow diagram | Cohen's kappa for inter-rater agreement
Data extraction | Pre-piloted extraction form; 2 reviewers independently | RevMan, Excel, or SRDR
Risk of bias | RCT: Cochrane RoB 2.0; Observational: ROBINS-I | Traffic-light plots
Meta-analysis | Random-effects model if I²>50%; fixed-effects if I²<25% | RevMan, R (meta package)
Certainty of evidence | GRADE: 4 levels (high/moderate/low/very low) | GRADEpro GDT software

> **Board Pearl — Random Effects vs Fixed Effects Meta-Analysis** — **Fixed-effects meta-analysis** assumes all studies estimate the same true effect size — differences between studies are due to sampling error only. Appropriate when studies are near-identical in design, population, and intervention (rare in surgery). **Random-effects meta-analysis** assumes each study estimates its own true effect drawn from a distribution of true effects — the meta-analysis estimates the mean of this distribution. More appropriate for surgical meta-analyses where between-study heterogeneity exists. Random-effects models weight small studies more heavily than fixed-effects, which can amplify publication bias effects.

**PROSPERO registration** is the pre-registration of systematic review protocols in the International Prospective Register of Systematic Reviews, maintained by the Centre for Reviews and Dissemination (University of York). PROSPERO registration must occur before data extraction begins (ideally before screening). Registration establishes: the research question, eligibility criteria, search strategy, outcome hierarchy, and analysis plan — preventing outcome switching and post-hoc protocol changes. PRISMA 2020 requires reporting the PROSPERO registration number. Most journals require PROSPERO registration for systematic reviews submitted after 2020. A PROSPERO record that does not match the published systematic review in its methods or outcomes is a red flag for reviewers and a potential grounds for rejection.


## Search Strategy — Grey Literature and Contact Authors

Publication bias — the preferential publication of positive (statistically significant) results — is the most serious threat to the validity of meta-analytic conclusions. Studies with negative results are less likely to be submitted, accepted, or published, and take longer to be published when they are. A systematic review that searches only published literature therefore systematically overestimates effect sizes. Grey literature searching is a mandatory component of comprehensive systematic searches, specifically to identify unpublished studies.

*Grey Literature Sources for Surgical Systematic Reviews*
Source | Content | Access Method | PRISMA Item
--- | --- | --- | ---
ClinicalTrials.gov | Registered trials including results; unpublished completed trials | Direct search; NCT number extraction | PRISMA item 6 — search of registers
WHO ICTRP | International Clinical Trials Registry Platform — aggregates 17 national registries | ictrp.who.int search | PRISMA item 6
ISRCTN | UK/European trial register; includes surgical RCTs | isrctn.com direct search | PRISMA item 6
OpenDOAR institutional repositories | Theses, dissertations, institutional reports | Search via DART Europe, EThOS | PRISMA item 6
Conference proceedings | ESSO, ASES, ESMO, SSO annual meeting abstracts — often 2–5 years before publication | Society websites; Clinicalkey; PubMed abstracts | PRISMA item 6
FDA/EMA approval documents | Drug/device approval dossiers with trial data | FDA.gov, EMA.europa.eu | PRISMA item 6
Author contact | Unpublished data from known trialists; ongoing trials near completion | Email request with specific data request | Documented in search methods

> **PICO vs PICo — Selecting the Correct Framework** — **PICO** (Population, Intervention, Comparison, Outcome) is the standard framework for systematic reviews of interventions and is appropriate for most surgical meta-analyses: 'In patients undergoing colorectal resection (P), does laparoscopic surgery (I) compared to open surgery (C) reduce anastomotic leak rate (O)?' **PICo** (Population, phenomenon of Interest, Context) is used for qualitative systematic reviews: 'Among patients who underwent CRS+HIPEC (P), what are the experiences of quality of life recovery (I) in the context of specialised peritoneal oncology centres (Co)?' PRISMA 2020 requires explicit statement of the review framework used. For surgical research, PICO is nearly always appropriate for quantitative synthesis; PICo for qualitative evidence synthesis.

**Contacting authors** for unpublished data or for published data in an unusable format is an important component of reducing publication bias and maximising data utilisation. The Cochrane Handbook recommends contacting corresponding authors of: eligible studies that report insufficient data for meta-analysis; completed trials with no published results (identified via registries); and conference abstracts that may have subsequently been published in full. Response rates to author contact vary from 30–60% — lower response is expected for older studies and deceased investigators. PRISMA 2020 requires reporting of all author contact attempts and responses. **Citation chasing** (forward citation tracking of included studies using Web of Science, Scopus, or Google Scholar) and **snowball searching** (backward searching of reference lists from included studies) are complementary strategies that increase search comprehensiveness.


## Interpreting the Forest Plot

The **forest plot** is the visual summary of a meta-analysis. Each horizontal line represents one included study — the central square is the point estimate (OR, RR, MD, or HR), and the width of the line is the 95% confidence interval. The square size is proportional to the study's weight in the analysis. The **diamond** at the bottom represents the pooled estimate — its centre is the summary effect, its width is the 95% CI. If the diamond does not cross the line of no effect (OR=1 for binary outcomes; MD=0 for continuous outcomes), the pooled result is statistically significant at p<0.05. **Heterogeneity** (I²): the proportion of total variability due to between-study differences rather than chance: I²<25% = low heterogeneity; 25–50% = moderate; 50–75% = substantial; >75% = considerable. High heterogeneity warrants subgroup analysis or meta-regression to identify the source.

> **Common Pitfall — Publication Bias** — Publication bias occurs because studies with positive (statistically significant) results are more likely to be published, submitted, or published faster than negative studies. This inflates the apparent effect size in a meta-analysis. Detection: **funnel plot asymmetry** (visually inspect for asymmetric distribution of study effect sizes; small studies should cluster at the bottom in a symmetric funnel); **Egger's test** (regression test for funnel plot asymmetry; p<0.10 suggests asymmetry). Correction: **trim and fill method** (imputes missing studies to achieve symmetry and recalculates pooled estimate). Prevention: search trial registries (WHO ICTRP, ClinicalTrials.gov) for unpublished studies; contact authors for unpublished data.

*Sensitivity Analyses in Meta-Analysis*
Type | Purpose | When to Use | Interpretation
--- | --- | --- | ---
Leave-one-out | Remove each study sequentially and re-estimate pool | Always; particularly important for influential studies | If removing one study substantially changes the pooled estimate or significance, that study is influential — investigate why
Risk of bias subgroup | Analyse high vs low RoB studies separately | When studies have heterogeneous risk of bias | Higher quality (low RoB) studies should produce the most reliable estimate
Publication status | Separate published vs unpublished data | When grey literature is included | Differences suggest publication bias
Follow-up duration | Separate short-term vs long-term outcome data | When outcomes vary by follow-up | Short-term benefits may not persist — critical for oncological outcomes
Study design subgroup | RCT vs observational separately | When both study types are included | Directional consistency between designs strengthens evidence; discordance suggests confounding in observational studies


## GRADE Evidence Certainty

*GRADE — Certainty of Evidence Levels*
Level | Starting Point | Upgraded by | Downgraded by | Meaning
--- | --- | --- | --- | ---
High | RCTs | Large effect; dose-response; confounders would reduce effect | Risk of bias; inconsistency; indirectness; imprecision; publication bias | Very confident the true effect is close to the estimate
Moderate | RCTs with limitations / upgraded observational | — | 1 serious domain downgrade | Moderately confident; true effect likely close but may be substantially different
Low | Observational studies / RCTs with major limitations | — | 2 serious domain downgrades | Limited confidence; true effect may be substantially different
Very low | Case series / downgraded lower evidence | — | 3+ serious domain downgrades | Very little confidence in the estimate; true effect is likely substantially different

> **Board Pearl — GRADE in Surgical Guidelines** — GRADE is now required by major guideline bodies (NICE, WHO, ESMO, ASCO) when formulating recommendations. A high-certainty evidence level does not automatically translate into a strong recommendation — the recommendation strength also depends on: values and preferences, resource implications, feasibility, and equity considerations. Conversely, a very low certainty evidence base can still produce a strong recommendation if the intervention is the only feasible option or if harm of inaction is catastrophic. In surgical guidelines (e.g., ESMO 2023, EHS, WSES), most recommendations are based on low or very low certainty evidence — reinforcing the need for more and better-designed surgical trials.


## Network Meta-Analysis

Network meta-analysis (NMA) is an extension of pairwise meta-analysis that allows simultaneous comparison of three or more interventions within a single coherent statistical framework, using both direct evidence (trials that directly compare two interventions) and indirect evidence (comparisons made through a common comparator). For example, if trials exist comparing A vs B and B vs C (but no direct A vs C trial), NMA can generate an indirect estimate of A vs C via the B-network — and if a direct A vs C trial also exists, NMA synthesises both into a mixed estimate. This is particularly valuable in surgical oncology where multiple procedures, routes, or techniques may each have been compared only against standard care but not directly against each other.

*Network Meta-Analysis — Core Assumptions*
Assumption | Definition | How to Assess | Consequence if Violated
--- | --- | --- | ---
Transitivity | Studies in the network are sufficiently similar in their patient populations, outcome definitions, and clinical context that indirect comparisons are valid | Clinical assessment of study populations and interventions; statistical assessment via meta-regression | Indirect estimates are biased; NMA conclusions may be misleading
Consistency | Direct and indirect evidence for the same comparison agree (statistical agreement) | Node-splitting (comparing direct vs indirect estimates); design-by-treatment interaction test | Inconsistency indicates network heterogeneity or model misspecification
Homogeneity | Studies within each pairwise comparison are sufficiently similar (standard meta-analysis assumption applied to each link) | I² within each pairwise comparison | High heterogeneity within any link reduces confidence in that link's estimate

> **Board Pearl — SUCRA Ranking in NMA** — **SUCRA** (Surface Under the Cumulative Ranking Curve) is a probability-based ranking metric used in NMA to rank all interventions simultaneously. SUCRA ranges from 0 to 100%: a SUCRA of 100% indicates the treatment is most likely to be the best; 0% indicates it is most likely the worst. SUCRA is useful for presenting the totality of ranking evidence, but has important limitations: it does not account for the clinical magnitude of differences (a treatment ranked first by 1% may be clinically equivalent to the second-ranked treatment); ranking is highly sensitive to which comparators are included in the network; and SUCRA should never be the primary endpoint of an NMA — absolute effect estimates with credible intervals remain the primary result. The CINeMA framework (Confidence in Network Meta-Analysis) assesses the certainty of NMA evidence, analogous to GRADE for pairwise meta-analysis.

NMA reporting follows the CONSORT extension for NMA and the PRISMA NMA extension. Key reporting elements: the network diagram (nodes = interventions; edges = direct comparisons; edge width proportional to number of trials; node size proportional to sample size); league tables (matrix showing all pairwise estimates); SUCRA ranking plots; assessment of consistency (node-splitting results); and sensitivity analyses by risk of bias and heterogeneity. Software: R (netmeta package, gemtc, bnma); Stata (network suite); ADDIS (Bayesian framework). NMA results are rated using CINeMA, which assesses within-study bias, reporting bias, indirectness, imprecision, heterogeneity, and incoherence.


## Individual Patient Data Meta-Analysis

Individual Patient Data (IPD) meta-analysis obtains and re-analyses the original participant-level data from each included study, rather than using the published aggregate summary statistics (means, odds ratios, event rates). IPD is considered the gold standard of meta-analysis methodology because it provides: more precise covariate adjustment; ability to standardise outcome definitions and measurement across studies; investigation of treatment effect modification by individual patient characteristics (subgroup analyses that would be impossible with aggregate data); correction of errors in published aggregate data; and the ability to perform time-to-event analyses with exact follow-up times rather than summary statistics.

*IPD vs Aggregate Data Meta-Analysis — Comparison*
Feature | Aggregate Data (AD) | Individual Patient Data (IPD)
--- | --- | ---
Data obtained | Summary statistics from publications | Patient-level dataset from trial investigators
Covariate adjustment | Limited to what is published | Full adjustment for all collected covariates
Subgroup analyses | Ecological fallacy risk; limited by published subgroups | Valid within-study subgroup analyses possible
Outcome standardisation | Dependent on published definitions | Can harmonise outcome definitions across studies
Time-to-event analysis | Requires digitised Kaplan-Meier curves or published HRs | Exact event times and censoring available
Resource requirements | Weeks to months | 1–3 years; data sharing agreements; extensive cleaning
Examples in surgery | Most published surgical meta-analyses | NSABP B-06 IPD; SEER-Medicare IPD analyses; EORTC GITSG pooled analyses

> **Clinical Application — IPD in Peritoneal Surgery** — The PSOGI (Peritoneal Surface Oncology Group International) has conducted IPD analyses pooling patient-level data from multiple international HIPEC centres to examine prognostic factors for overall survival after CRS+HIPEC for colorectal peritoneal metastases. These IPD analyses (Verwaal-derived datasets, Simkens, PSOGI collaborative) have been able to examine PCI thresholds, completeness of cytoreduction scores, and neoadjuvant chemotherapy effects with a precision impossible from published aggregate data alone. The PSOGI registry represents one of the most successful examples of collaborative IPD infrastructure in surgical oncology.


## Bayesian Meta-Analysis

Bayesian meta-analysis provides an alternative statistical framework to the classical (frequentist) approach used in most published meta-analyses. In the Bayesian framework, results are expressed as posterior probability distributions rather than point estimates with confidence intervals. The Bayesian approach formally incorporates prior beliefs (prior distributions) about the parameter of interest, which are then updated by the data to produce the posterior distribution. This framework is conceptually aligned with how clinicians actually reason about evidence: 'Given what I knew before this meta-analysis, and given these new data, what is my updated belief about the treatment effect?'

*Frequentist vs Bayesian Meta-Analysis — Key Differences*
Feature | Frequentist | Bayesian
--- | --- | ---
Output | Point estimate + 95% confidence interval | Posterior distribution + 95% credible interval
Interpretation | 'If the study were repeated infinitely, 95% of CIs would contain the true value' | 'Given the data, there is 95% probability the true value lies in this interval'
Prior information | Not formally incorporated | Explicitly incorporated via prior distribution (informative or non-informative)
Probability statements | Cannot make direct probability statements (p-value is not probability of H0 being true) | Direct: 'Probability that treatment is better than control = 82%'
Heterogeneity estimation | DerSimonian-Laird or REML | Full posterior distribution for τ² (between-study variance)
Network meta-analysis | Frequentist NMA (netmeta) | Bayesian NMA (gemtc, MCMC) — often preferred for NMA
Software | R (meta), Stata | R (gemtc, bnma), JAGS, Stan, BUGS

> **Board Pearl — Bayesian NMA in Surgical Guidelines** — Bayesian NMA is the preferred approach for complex networks with many interventions and few direct comparisons, because it naturally handles sparse data through prior distributions and produces full probability distributions for all ranking parameters including SUCRA. NICE (UK) guidance on technology appraisal recommends Bayesian NMA when a network of interventions is being assessed for health technology appraisal. For surgical oncology, Bayesian NMA has been used to compare HIPEC drug regimens (oxaliplatin vs mitomycin-C vs bidirectional chemotherapy) across networks of non-comparative trials — generating indirect estimates that frequentist methods handle less naturally. The credible interval (Bayesian CI) has the intuitive interpretation that frequentist confidence intervals incorrectly get attributed: 'there is 95% probability that the true effect lies in this interval'.


## Prospective Meta-Analysis

A prospective meta-analysis (PMA) is one in which the decision to conduct a meta-analysis, the outcomes to be pooled, and the analysis plan are specified before the results of the individual studies are known. This is distinct from a standard (retrospective) meta-analysis, which synthesises already-published studies and is therefore vulnerable to the selective inclusion of studies with known positive results. PMAs are typically planned before or concurrent with the running of multiple trials on the same question, each of which individually may lack power to detect the primary outcome.

*Prospective vs Retrospective Meta-Analysis*
Feature | Retrospective Meta-Analysis | Prospective Meta-Analysis
--- | --- | ---
Timing of analysis plan | After results are known — results can influence meta-analysis design | Before results are known — eliminates post-hoc bias
Data standardisation | Uses published summary statistics (different definitions) | Data collection harmonised prospectively across trials
Risk of publication bias | High — searches post-publication | Lower — all planned trials included regardless of result
Risk of outcome switching | Present if outcomes changed between protocol and publication | Eliminated — outcomes pre-specified before trial completion
Registration | PROSPERO (after trials complete) | PROSPERO before trial data collected
Power | Derived from published data | Pre-calculated prospectively; sample sizes coordinated
Examples | Most systematic reviews | CGARN (prostate cancer); PMA of HIPEC trials (emerging)

> **Prospective Meta-Analysis Alliance (PMA Alliance) Framework** — The PMA Alliance (2001) established principles for prospective meta-analyses: (1) the PMA is planned and analysis protocol registered before individual trial results are available; (2) data are collected in a standardised format across trials; (3) analysis is conducted on IPD where possible; (4) results of individual trials are not known to the PMA coordinators before final analysis. This framework eliminates the retrospective analysis bias that affects traditional meta-analysis. In surgical oncology, the GASTRIC Group PMA of adjuvant chemotherapy after gastric cancer resection and the ACUITY PMA of aortic repair trials are leading examples.


## Updating Systematic Reviews — Living Systematic Reviews

A living systematic review (LSR) is a systematic review that is continuously updated as new evidence becomes available, rather than being conducted at a single time point. In rapidly evolving fields — oncology treatment protocols, surgical technique innovation, novel device evaluation — the evidence base may change substantially within months of publication of a conventional systematic review. LSRs maintain a persistent, updated synthesis of the evidence, enabling clinical guidelines to incorporate the latest evidence without requiring the full systematic review process to be repeated from scratch.

*Living Systematic Review — Operational Framework*
Component | Standard Systematic Review | Living Systematic Review
--- | --- | ---
Search frequency | One-time (or occasional update) | Continuous or at defined intervals (monthly, quarterly)
Update trigger | Ad hoc; resource-dependent | Predetermined surveillance search cadence or triggered by new RCT publication
Protocol | Fixed at registration | Evolving; documented amendments with rationale
Publication model | Single paper | Versioned online document (e.g., Cochrane Review) with version history
Resource requirements | Finite; funded as discrete project | Ongoing; requires sustained team and funding infrastructure
Registration | PROSPERO one-time | PROSPERO with LSR notation; updates registered
Examples | Any conventional Cochrane review | COVID-19 NMA (ISTH); WHO COVID-19 LSR; NIHR LSR programme

> **Clinical Application — LSR in Surgical Oncology** — Living systematic reviews are emerging as a model for rapidly evolving surgical oncology evidence bases. The Peritoneal Surface Oncology Group International (PSOGI) has discussed LSR infrastructure for CRS+HIPEC evidence, where new RCTs (PRODIGE 7, COLOPEC 2, ongoing SPIRIDON and CAIRO 6) continuously update the evidence landscape. An LSR of CRS+HIPEC vs systemic chemotherapy would allow surgical oncology guidelines to update the pooled OS estimate and GRADE certainty rating within weeks of a new trial reporting, rather than waiting for a de novo systematic review cycle (2–3 years). The Cochrane Colorectal Cancer Group is a model for this approach in the colorectal field.

LSR publication models include: (1) **Versioned PDF** — journal publishes updated versions with version numbers and amendment logs (BMJ Open, Cochrane); (2) **Dynamic online resource** — continuously updated web-based document with version tracking (WHO COVID-19 evidence platform); (3) **Journal-linked pre-registration** — protocol published with commitment to updates at defined intervals. The key challenge for LSRs in surgical research is sustained funding and team commitment — the initial publication attracts resources, but subsequent updates may be unfunded. The NMA surveillance model (monthly alert searches, quarterly update assessment, annual meta-analytic update if threshold number of new studies met) is an operationally feasible approach for surgical research groups.