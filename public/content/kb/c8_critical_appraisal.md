# Critical Appraisal — Academic Surgery — RCTs, Observational Studies, Diagnostics, Economic Evaluations & Clinical Guidelines

*Block C · Academic Surgery · PGY2-4*

*Guidelines: CASP Checklists 2023 · Cochrane RoB 2.0 · ROBINS-I 2016 · QUADAS-2 2011 · CHEERS 2022 · AGREE II 2010 · GRADE 2013*


## Critical Appraisal Framework

Critical appraisal is the systematic process of evaluating a published study to determine: (1) whether the results are valid (internal validity — was the study done correctly?); (2) what the results actually show (clinical magnitude and precision); (3) whether the results are applicable to your patient (external validity). The three-question framework — **Valid? Results? Applicable?** — underpins all critical appraisal tools including CASP, Cochrane RoB, and GRADE. Applying these three questions in sequence prevents the common error of accepting statistically significant results without interrogating whether the study was well-conducted or relevant to the clinical question.

*CASP RCT Checklist — 11 Questions in 3 Sections*
Section | Questions | Focus
--- | --- | ---
Section A: Valid? | Q1–2 | Did the trial address a clear question? Was assignment to treatment randomised?
Section A: Valid? | Q3–6 | Were patients blinded? Were groups similar at start? Were all participants accounted for at the end?
Section B: Results? | Q7–8 | How large was the treatment effect (ARR, RRR, NNT, HR)? How precise (95% CI)?
Section C: Applicable? | Q9–11 | Can these results be applied to local population? Were all important outcomes considered? Are benefits worth harms and costs?

> **Board Pearl — ARR, RRR, and NNT** — Relative risk reduction (RRR) always sounds more impressive than absolute risk reduction (ARR). Example: an intervention reduces mortality from 2% to 1% — RRR = 50% (impressive!), ARR = 1% (modest), NNT = 100 (you treat 100 patients to prevent 1 death). Always calculate and present the ARR and NNT alongside RRR. The NNT (Number Needed to Treat) = 1/ARR — it contextualises the absolute benefit and enables comparison of different interventions. A NNT of 4 for antibiotics in uncomplicated appendicitis vs a NNT of 100 for an expensive oncological targeted therapy have very different cost-effectiveness implications.


## Risk of Bias Assessment Tools

**Cochrane RoB 2.0** assesses risk of bias in RCTs across 5 domains: (1) Bias arising from the randomisation process (sequence generation + allocation concealment); (2) Bias due to deviations from intended interventions (blinding of participants + personnel); (3) Bias due to missing outcome data (completeness of follow-up); (4) Bias in measurement of the outcome (blinding of outcome assessors); (5) Bias in selection of the reported result (selective outcome reporting — compare protocol vs publication). Each domain is rated Low, Some Concerns, or High. The overall trial RoB is determined by the highest-rated domain. **ROBINS-I** (Risk Of Bias in Non-Randomised Studies of Interventions) applies 7 domains to observational studies, with pre-intervention, at-intervention, and post-intervention domains.

> **Common Pitfall — Selective Outcome Reporting Bias** — Selective outcome reporting bias occurs when a trial reports only the outcomes that showed a statistically significant result, while omitting or de-emphasising outcomes that did not. Detection: compare the trial's published report against its pre-registered protocol (ClinicalTrials.gov, ISRCTN, or PROSPERO for systematic reviews). Outcomes changed from primary to secondary, outcomes omitted from the publication, or outcomes listed in the protocol not mentioned in the paper are all red flags. The COMPare project (CEBM, 2016) found that in 67 consecutive RCTs in 5 top journals, 354 pre-specified outcomes were omitted and 357 new (non-pre-specified) outcomes were added.

*ROBINS-I Domains for Observational Studies*
Domain | Timing | Bias Type | Surgical Example
--- | --- | --- | ---
Confounding | Pre-intervention | Systematic differences in prognostic factors between groups | Laparoscopic cases selected for lower-risk patients
Selection of participants | Pre-intervention | Selection into the study based on characteristics related to the outcome | Including only patients who survived to follow-up
Classification of interventions | At intervention | Misclassification of exposure or comparison | Inconsistent definition of 'laparoscopic' (pure vs hand-assisted)
Deviations from intended interventions | Post-intervention | Unintended co-interventions or contamination | Open group receiving ERAS protocol not used at laparoscopic time period
Missing data | Post-intervention | Exclusion of participants with missing outcomes | Losses to follow-up systematically different between groups
Measurement of outcomes | Post-intervention | Differential assessment of outcomes between groups | Surgeons reviewing complications of their own procedures
Selection of reported results | Post-intervention | Selective reporting of outcomes | Only reporting outcomes that favour the intervention of interest


## External Validity and Applicability

*External Validity — Questions for Surgical Trial Applicability*
Domain | Question | Concern
--- | --- | ---
Patient population | Do my patients resemble the trial population? | Trials often exclude elderly, obese, comorbid patients most common in practice
Surgeon expertise | Was the trial conducted in high-volume specialist centres? | Results may not transfer to lower-volume settings (volume-outcome relationship)
Learning curve | Was the experimental technique new at trial onset? | CLASSIC trial: higher conversion rate early in learning curve
Co-interventions | Did trial patients receive systematic co-interventions (ERAS) not standard locally? | Co-interventions can drive outcome differences, not the experimental treatment alone
Outcome definition | Are the trial's outcome definitions consistent with local reporting? | Anastomotic leak definitions vary — ISREC vs clinical leak vs radiological leak
Follow-up duration | Is the follow-up long enough for the outcome of interest? | 5-year survival inadequate for adjuvant therapy trials in early-stage cancer

> **Board Pearl — The Volume-Outcome Relationship** — Many surgical procedures show a robust volume-outcome relationship: higher-volume surgeons and hospitals have lower mortality and morbidity for complex procedures (oesophagectomy, pancreatectomy, CRS+HIPEC). Birkmeyer JD et al. (NEJM 2002) demonstrated that surgeons in the highest volume quintile for pancreatectomy had mortality rates of 3.8% vs 14.3% in the lowest quintile. When applying surgical trial results to your setting, ask: were the trial surgeons operating at a volume comparable to your institution? If trials were conducted exclusively in expert high-volume centres, results may not generalise to lower-volume settings.


## Appraising Diagnostic Accuracy Studies (QUADAS-2)

Diagnostic accuracy studies evaluate how well a test (index test) identifies patients with or without a target condition compared to a reference standard. Critical appraisal of diagnostic studies requires specific tools because the biases that affect diagnostic accuracy studies differ fundamentally from those affecting therapeutic trials. QUADAS-2 (Quality Assessment of Diagnostic Accuracy Studies — version 2) is the current standard tool, structured around 4 domains and 2 assessment questions per domain (risk of bias and concerns about applicability). QUADAS-2 is required by the Cochrane Diagnostic Test Accuracy Working Group and recommended by PRISMA-DTA for systematic reviews of diagnostic accuracy.

*QUADAS-2 — Four Domains and Key Signalling Questions*
Domain | Assessed Element | Key Signalling Questions | Common Surgical Bias
--- | --- | --- | ---
Patient selection | Was the patient sample representative of the clinical question? | Was a consecutive or random sample enrolled? Was a case-control design avoided? | Spectrum bias: including only clear-cut positives and obvious negatives inflates apparent diagnostic accuracy
Index test | Was the index test interpreted without knowledge of the reference standard? | Were index test results interpreted blinded to reference standard? Was a threshold pre-specified? | Incorporation bias; review bias when index test is part of reference standard assessment
Reference standard | Was the reference standard likely to correctly classify the target condition? | Is the reference standard likely to classify the target condition correctly? Were reference standard results blinded to index test? | Imperfect reference standard (e.g., imaging as reference for histological diagnosis)
Flow and timing | Was the timing appropriate and all patients included in analysis? | Was the interval between index test and reference standard appropriate? Were all patients included in the analysis? | Partial verification bias (only index test positives undergo reference standard); differential verification bias (different reference standards for positives and negatives)

**Spectrum bias** is the most clinically important bias in diagnostic accuracy studies and is frequently encountered in surgical literature. It occurs when the spectrum of disease severity in the study population does not match the clinical population in which the test will be used. A study evaluating CT-PET for colorectal peritoneal metastases that includes only patients with grossly positive imaging vs clearly disease-free controls will produce artificially high sensitivity and specificity — the test performs best at the extremes of disease severity, not in the clinically challenging middle ground where diagnostic discrimination is actually needed. When appraising a diagnostic study, ask: does the study population include the full spectrum of patients who would undergo this test in practice — including those with equivocal findings?

> **Clinical Application — Appraising PET-CT for Peritoneal Metastases Detection** — A study reports PET-CT sensitivity 89%, specificity 94% for detecting peritoneal metastases in colorectal cancer patients being assessed for CRS+HIPEC candidacy. QUADAS-2 appraisal reveals: **Patient selection** — study enrolled patients referred specifically for tertiary centre assessment (spectrum bias: highest index suspicion); consecutive enrolment from a prospective database (low selection bias risk). **Index test** — PET-CT reads performed blinded to laparoscopic findings (low bias risk). **Reference standard** — diagnostic laparoscopy as reference standard (appropriate; high sensitivity for peritoneal disease — reference standard quality High). **Flow** — 8% of patients did not undergo reference standard laparoscopy (lost to follow-up); unclear if this is informative censoring. Applicability concern: the study population (tertiary referral patients suspected of peritoneal disease) may have higher prevalence than a general colorectal cancer surveillance population — positive predictive value will be inflated in lower-prevalence settings.

**Partial verification bias** (also called work-up bias) occurs when only a subset of patients who undergo the index test also receive the reference standard — specifically, when the decision to undergo the reference standard is influenced by the index test result. Example: patients with a positive CT-scan for peritoneal metastases all undergo diagnostic laparoscopy (reference standard), but patients with a negative CT do not — because laparoscopy is considered unnecessary. The true-negative rate among CT-negative patients is never assessed, artificially inflating apparent specificity. **Differential verification bias** is a related problem occurring when different subgroups receive different reference standards (e.g., CT-positive patients get laparoscopy; CT-negative patients get surveillance imaging), making cross-group comparison invalid.


## Appraising Economic Evaluations (CHEERS 2022)

Health economic evaluations quantify the relationship between resources invested (costs) and health outcomes achieved, enabling comparison of competing interventions on grounds of efficiency rather than effectiveness alone. Four types of economic evaluation exist: cost-effectiveness analysis (CEA — outcomes in natural units such as life-years or events avoided); cost-utility analysis (CUA — outcomes in quality-adjusted life-years, QALYs — most widely used for healthcare decision-making); cost-benefit analysis (CBA — outcomes monetised, enabling comparison across health and non-health sectors); and cost-minimisation analysis (CMA — outcomes assumed equivalent; cheapest option identified).

*CHEERS 2022 — Key Domains for Appraising Economic Evaluations*
CHEERS Domain | Item | Critical Appraisal Question | Common Omission
--- | --- | --- | ---
Title | 1 | Is this clearly identified as a health economic evaluation? | Study type not stated in title
Perspective | 4 | Whose costs are included? Healthcare payer? Society? Hospital? | Perspective not stated — different perspectives include different costs
Time horizon | 5 | Is the time horizon sufficient to capture all relevant costs and outcomes? | 5-year horizon for cancer surgery misses late recurrences and cure fractions
Discount rate | 6 | Are future costs and outcomes discounted, and at what rate? | No discounting of future outcomes; discount rate not justified
Comparators | 8 | Are comparators clinically relevant and representing current standard of care? | Comparison to suboptimal or obsolete standard care inflates economic efficiency
Effect inputs | 9 | What is the source of effectiveness data? RCT? Observational cohort? | Effectiveness from single observational study rather than systematic review
ICER | 16 | Is the incremental cost-effectiveness ratio reported with uncertainty? | ICER reported without confidence interval or probabilistic sensitivity analysis
Sensitivity analysis | 17–18 | Are deterministic and probabilistic sensitivity analyses performed? | Only one-way deterministic SA — probabilistic SA (PSA) missing
Equity | 21 | Are distributional effects considered? | Ignored — CRS+HIPEC is resource-intensive and access is inequitable

> **ICER — Incremental Cost-Effectiveness Ratio** — The ICER is the key output of a cost-effectiveness analysis: **ICER = (Cost of A − Cost of B) / (QALY of A − QALY of B)**. The ICER represents the additional cost required to gain one additional QALY with intervention A compared to B. ICER thresholds vary by country: UK (NICE): £20,000–£30,000/QALY (interventions below £20k are cost-effective; those above £30k require additional justification); Spain (Spanish Agency of Medicines and Medical Devices, AEMPS guideline): €30,000/QALY considered a common threshold although not officially legislated; USA: no official threshold, but analyses commonly use $50,000–$150,000/QALY. An ICER below threshold = cost-effective (more health per £/€ spent); above threshold = not cost-effective in standard interpretation. Note: the ICER threshold is not a hard clinical recommendation threshold — context, equity, and innovation considerations apply.

**Sensitivity analysis** is mandatory in health economic evaluations because model parameters are uncertain. Two types: (1) **Deterministic (one-way or multi-way)** — varies one parameter at a time across its plausible range to assess impact on the ICER; results presented as tornado diagram (parameters with greatest impact at the top); (2) **Probabilistic sensitivity analysis (PSA)** — simultaneously varies all uncertain parameters according to probability distributions (e.g., survival probability ~ Beta distribution; costs ~ Gamma distribution), runs 10,000 simulations, and produces a cost-effectiveness acceptability curve (CEAC) showing the probability of cost-effectiveness at each willingness-to-pay threshold. PSA is the gold standard for communicating ICER uncertainty and is required by NICE, AEMPS, and most health technology appraisal bodies.


## Appraising Qualitative Studies (CASP Qualitative)

Qualitative research investigates phenomena that cannot be reduced to numerical measurements — patient experiences, clinician decision-making processes, healthcare system barriers, and the social context of surgical care. In surgical oncology, qualitative research is increasingly used to understand: patient quality of life after CRS+HIPEC (beyond validated questionnaire scores); patient decision-making about high-risk surgery; barriers to implementing enhanced recovery pathways; and the psychological impact of stoma formation. Qualitative evidence is not inferior to quantitative evidence — it addresses different, complementary research questions.

*CASP Qualitative Checklist — 10 Questions*
Section | Question | Focus
--- | --- | ---
Section A: Valid? | Q1 | Was there a clear statement of the aims of the research?
Section A: Valid? | Q2 | Is a qualitative methodology appropriate?
Section A: Valid? | Q3 | Was the research design appropriate to address the aims?
Section A: Valid? | Q4 | Was the recruitment strategy appropriate to the aims of the research?
Section A: Valid? | Q5 | Was the data collected in a way that addressed the research issue?
Section A: Valid? | Q6 | Has the relationship between researcher and participants been adequately considered? (Reflexivity)
Section B: Results? | Q7 | Have ethical issues been taken into consideration?
Section B: Results? | Q8 | Was the data analysis sufficiently rigorous?
Section B: Results? | Q9 | Is there a clear statement of findings?
Section C: Applicable? | Q10 | How valuable is the research?

> **Board Pearl — Reflexivity in Qualitative Research** — **Reflexivity** (CASP question 6) refers to the explicit acknowledgement by the qualitative researcher of how their own background, beliefs, and position influenced the research — from study design through data analysis. A surgeon conducting qualitative interviews about patients' decisions to accept CRS+HIPEC must acknowledge that their position as the operating surgeon may influence how patients respond (social desirability bias), how they frame questions, and how they interpret findings. Qualitative research lacking any reflexivity statement is a significant quality concern — it does not mean the findings are invalid, but it limits the reader's ability to assess potential influence of the researcher's perspective on the interpretive conclusions.


## Clinical Practice Guidelines — Development & Appraisal (AGREE II)

Clinical practice guidelines (CPGs) are systematically developed statements to assist practitioner and patient decisions about appropriate care for specific clinical circumstances. High-quality guidelines are developed using systematic evidence review, expert consensus, stakeholder involvement, and explicit processes for translating evidence into recommendations. The quality of published guidelines varies enormously — from rigorous GRADE-informed documents (ESMO, NICE, ASCO) to expert-opinion-based statements lacking systematic evidence review. The AGREE II (Appraisal of Guidelines Research and Evaluation) instrument enables structured assessment of guideline quality across 6 domains.

*AGREE II — Six Domains and Scored Items*
Domain | Items | Focus | Key Quality Indicator
--- | --- | --- | ---
Scope and purpose | 1–3 | Overall objective, clinical questions, target population | Clinical questions formulated as PICO; target population specified
Stakeholder involvement | 4–6 | Guideline development group, patient views, target users | Patient/public representation in development group; piloted with target users
Rigour of development | 7–14 | Search strategy, evidence selection, evidence-to-recommendation, peer review, update | Systematic search documented; GRADE or equivalent used; external review conducted
Clarity of presentation | 15–17 | Specific recommendations, options, key recommendations | Recommendations clearly stated; different options for different patients identified
Applicability | 18–21 | Facilitators/barriers, advice for implementation, resource implications, monitoring criteria | Cost implications discussed; audit criteria provided
Editorial independence | 22–23 | Funding body, competing interests recorded | Competing interests of all panel members disclosed; funding body had no influence

**GRADE recommendation notation** in high-quality CPGs: recommendations are expressed as strong (⊕⊕⊕⊕) or weak/conditional (⊕⊕⊕○), and are described in terms of certainty of evidence (High/Moderate/Low/Very Low). The Evidence to Decision (EtD) framework (GRADEpro) documents the panel's reasoning for translating evidence into recommendations, considering: desirable and undesirable effects; certainty of evidence; values and preferences; balance of effects; resource requirements; health equity; acceptability; and feasibility. A guideline without GRADE evidence tables or equivalent evidence-to-recommendation documentation cannot be considered a rigorous evidence-based guideline — though it may still provide valuable expert consensus.

> **AGREE II — Rigour of Development Domain (Domain 3)** — Domain 3 of AGREE II is the most critical for evidence-based medicine — it evaluates whether the guideline followed a rigorous process for finding and grading evidence. Key items: Item 7 (systematic methods used to search for evidence — databases, date range, search strategy documented); Item 8 (criteria for selecting evidence are clearly described); Item 10 (methods for formulating the recommendations are clearly described, including GRADE or equivalent); Item 12 (explicit link between recommendations and supporting evidence); Item 13 (guideline externally reviewed by experts prior to publication); Item 14 (procedure for updating the guideline is provided). A guideline scoring poorly on Domain 3 should be considered expert consensus rather than evidence-based guidance, and recommendations should be interpreted accordingly.

> **Board Pearl — Guideline Adaptation** — Guideline adaptation refers to the systematic process of adopting or modifying a high-quality guideline developed in one context for use in a different context (different country, healthcare system, or patient population). The ADAPTE methodology provides a structured approach: (1) assess the source guideline's quality using AGREE II; (2) determine whether the clinical context differs sufficiently to require modification; (3) identify recommendations that require adaptation vs those that can be adopted as-is; (4) conduct local stakeholder review and piloting; (5) establish a monitoring and update process. In Spain, major oncological guidelines (e.g., ESMO colorectal cancer guidelines) are adapted to the Spanish context by SEOM (Sociedad Española de Oncología Médica) and AEC (Asociación Española de Cirujanos), accounting for medication availability, healthcare system structure, and local epidemiology.


## Evidence-Based Surgery — Applying Evidence at the Bedside

Evidence-based medicine (EBM) in surgery is not about applying clinical trial results mechanically to every patient — it is the integration of: (1) **Current best evidence** (systematic reviews, RCTs, observational studies, appropriately weighted by quality); (2) **Clinical expertise** (surgeon's experiential knowledge of likely individual outcomes and risks); (3) **Patient values and preferences** (what matters to this specific patient, given full information about options, risks, and likely outcomes). The tension between EBM and surgical practice arises because: RCTs exclude many real patients; surgical expertise varies enormously between centres; and patient values are heterogeneous. Applying trial evidence to the individual requires bridging all three.

*EBM at the Bedside — Five Steps for Surgical Decisions*
Step | Action | Tool
--- | --- | ---
1. Ask | Convert clinical uncertainty into an answerable PICO question | PICO framework; background vs foreground questions
2. Acquire | Search for the best available evidence efficiently | PubMed Clinical Queries; Cochrane Library; UpToDate for synthesis
3. Appraise | Critically evaluate study validity, results, and applicability | CASP checklists; RoB 2.0; GRADE summary tables
4. Apply | Integrate evidence with clinical expertise and patient values | Shared decision-making; patient decision aids; risk communication
5. Audit | Evaluate your own patient outcomes against evidence benchmarks | Local quality audit; morbidity-mortality meeting; NACR/BSGD registry comparison

> **Clinical Application — Applying CRS+HIPEC Evidence to an Individual Patient** — A 58-year-old woman with colorectal peritoneal metastases (PCI 14, CRS achievable, no systemic metastases, PS 1, CEA 8 ng/mL) is referred for CRS+HIPEC consideration. EBM at the bedside:

**Evidence:** PRODIGE 7 (Quénet, ASCO 2018/Lancet Oncology 2021) — no OS benefit for HIPEC vs CRS alone (OS 41.7 vs 41.2 months, HR 1.00); but this was with short intraperitoneal oxaliplatin exposure. UNICANCER PRODIGE 7 trial population PCI 7 median — PCI 14 is higher-risk. PSOGI retrospective data shows benefit at PCI<15. GRADE certainty: Moderate (one RCT with methodological concerns).

**Clinical expertise:** Your centre has performed 120 CRS+HIPEC procedures; your anastomotic leak rate is 6%; your cytoreduction rate (CC0/1) for PCI 14 is 92%. These metrics are consistent with high-volume centres from which the evidence derives.

**Patient values:** Patient states she understands the risk (9% major morbidity) but 'would rather try everything possible given a potential for long-term remission.' She has 3 young children and values the chance of extended survival over avoidance of morbidity.

**Decision:** CRS+HIPEC is offered. The evidence is modest but consistent with potential benefit for PCI<15; your centre metrics are appropriate; patient values align with an aggressive approach. Shared decision-making documentation should record this process.

**Risk communication** is a core EBM skill in surgical oncology. Communicating probabilities to patients effectively requires: (1) using absolute risks rather than relative risks ('1 in 10 patients' rather than '10%'); (2) providing visual aids (natural frequencies, icon arrays); (3) presenting both benefits and harms in the same format and time frame; (4) acknowledging uncertainty explicitly ('the evidence shows an average benefit, but we cannot predict your individual response'); (5) using patient decision aids when available (validated for colostomy decisions, bowel resection). The SPIKES framework (Setting, Perception, Invitation, Knowledge, Emotions, Strategy) provides structure for delivering difficult probabilistic information in the surgical consultation.