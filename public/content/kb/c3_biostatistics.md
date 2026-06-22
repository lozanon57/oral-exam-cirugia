# Biostatistics for Surgeons — Academic Surgery — Hypothesis Testing, Regression, Survival Analysis & Bayesian Methods

*Block C · Academic Surgery · PGY2-4*

*Guidelines: CONSORT 2010 Statistical Analysis · STROBE Checklist 2007 · TRIPOD 2015 · GRADE 2011*


## Statistical Tests — Choosing Correctly

Selecting the correct statistical test requires knowing: (1) the data type (continuous, ordinal, categorical); (2) the number of groups being compared; (3) whether the data are paired or independent; (4) whether the data follow a normal distribution (parametric vs non-parametric decision). Applying the wrong test produces invalid p-values — a frequent source of methodological error in surgical literature. The commonest error is using a t-test on skewed data (e.g., length of stay, blood loss) where a Mann-Whitney U test or log-transformation is required.

*Statistical Test Selection Guide*
Data Type | Groups | Distribution | Test
--- | --- | --- | ---
Continuous | 2 independent | Normal | Independent t-test
Continuous | 2 independent | Non-normal / skewed | Mann-Whitney U (Wilcoxon rank-sum)
Continuous | 2 paired (pre/post) | Normal | Paired t-test
Continuous | 2 paired | Non-normal | Wilcoxon signed-rank test
Continuous | ≥3 independent | Normal | One-way ANOVA → post-hoc (Tukey)
Continuous | ≥3 independent | Non-normal | Kruskal-Wallis → post-hoc (Dunn)
Categorical (2×2) | 2 groups, n>5/cell | — | Chi-squared test (χ²)
Categorical (2×2) | 2 groups, n<5/cell | — | Fisher's exact test
Survival/time-to-event | 2+ groups | — | Kaplan-Meier + log-rank test; Cox regression for HRs

> **Board Pearl — p-value Misconceptions** — The p-value is **not** the probability that the null hypothesis is true. It is the probability of observing results as extreme as those obtained (or more extreme) if the null hypothesis were true. A p-value of 0.03 does not mean there is a 3% chance the finding is due to chance — that interpretation is incorrect. Always report the effect size and 95% confidence interval alongside the p-value. A small study can produce a clinically important difference that is statistically non-significant (insufficient power); a large study can produce a statistically significant but clinically trivial difference.

**Normality assessment** is required before applying parametric tests. Methods: (1) Visual inspection — histogram showing symmetric bell shape; Q-Q plot (points on the diagonal line); (2) Formal tests — Shapiro-Wilk test (preferred for n<50), Kolmogorov-Smirnov test (larger samples); (3) Descriptive statistics — compare mean and median (similar = symmetric; mean >> median = right skew). Critically: formal normality tests have low power in small samples (type II error — fail to detect non-normality) and excessive power in large samples (reject normality for trivial deviations). For large samples (n>100), visual assessment is more informative than formal tests.

**Multiple comparisons correction** is required when testing more than one hypothesis simultaneously to prevent inflation of the type I error rate. The **Bonferroni correction** divides the significance level α by the number of comparisons (α* = 0.05/k) — this is the most conservative approach and appropriate for a small number of truly independent tests. The **Benjamini-Hochberg (false discovery rate) procedure** is less conservative and more appropriate for exploratory analyses with many comparisons (e.g., genome-wide association studies, proteomic profiling). For pre-specified secondary endpoints in RCTs, a hierarchical testing procedure (gate-keeping) controls error without requiring Bonferroni correction.


## Survival Analysis

Survival analysis handles time-to-event data where not all patients experience the outcome during follow-up (censoring). The **Kaplan-Meier estimator** generates a step-function survival curve by computing the probability of surviving each successive event time. Patients who are lost to follow-up, withdraw, or reach study end without the event are **censored** at their last known alive time — they contribute information up to that point. The **log-rank test** compares survival curves between groups, testing whether the curves are statistically different across the entire follow-up period. The **Cox proportional hazards model** estimates the hazard ratio (HR) — the ratio of the instantaneous risk of the event in one group vs another — after adjusting for covariates. The proportional hazards assumption (constant HR over time) must be verified (Schoenfeld residuals test).

> **Common Pitfall — Interpreting the Hazard Ratio** — The hazard ratio is not the same as a relative risk or odds ratio. A HR of 0.65 (95% CI 0.50–0.85) for laparoscopic vs open surgery means that at any given point in time, the rate of the event is 35% lower in the laparoscopic group. The HR is valid only if the proportional hazards assumption holds — if the survival curves cross, the HR is misleading. When survival curves cross, consider restricted mean survival time (RMST) as an alternative summary measure.

**Competing risks** are a critical consideration in surgical oncology survival analysis. A competing risk is any event that prevents the event of interest from occurring or changes the probability of its occurrence. Example: in analysis of disease-specific survival after colorectal cancer resection, death from cardiovascular disease is a competing event — it prevents the patient from dying from colorectal cancer. Standard Kaplan-Meier analysis treating competing events as censored overestimates the cumulative incidence of the event of interest. The **Fine-Gray competing risks model** estimates the subdistribution hazard — the appropriate model when competing events are present — and should be used instead of Kaplan-Meier + Cox when deaths from other causes are common.

**Propensity score analysis** in observational surgical survival studies uses the propensity score — the probability of receiving the treatment given observed covariates — to balance comparison groups. The PS is estimated from logistic regression of treatment on all measured baseline covariates. Balance after matching or weighting is assessed by standardised mean differences (SMD < 0.1 for all covariates indicates adequate balance). Critically: PS methods can only control for **measured confounders** — unmeasured confounders (surgeon skill, performance status not recorded in database) remain. Sensitivity analysis for unmeasured confounding using E-values (VanderWeele & Ding, 2017) quantifies how strong an unmeasured confounder would need to be to explain the observed association.


## Diagnostic Test Accuracy and Sample Size

*Diagnostic Test Accuracy Measures*
Measure | Formula | Interpretation | Clinical Use
--- | --- | --- | ---
Sensitivity | TP / (TP + FN) | Ability to detect disease when present | High sensitivity: good for ruling OUT disease (SnNout)
Specificity | TN / (TN + FP) | Ability to exclude disease when absent | High specificity: good for ruling IN disease (SpPin)
PPV | TP / (TP + FP) | Probability disease present given positive test | Depends on prevalence — higher in high-prevalence populations
NPV | TN / (TN + FN) | Probability disease absent given negative test | Depends on prevalence — higher in low-prevalence populations
LR+ | Sensitivity / (1 − Specificity) | How much more likely positive test in disease | >10 = strong evidence of disease
LR− | (1 − Sensitivity) / Specificity | How much less likely negative test in disease | <0.1 = strong evidence against disease

> **Board Pearl — Sample Size: Type I and Type II Errors** — Sample size calculation is determined by four inputs: (1) **α** (Type I error rate = probability of falsely rejecting H₀) — conventionally 0.05; (2) **Power** (1 − β, where β = Type II error rate = probability of missing a true effect) — conventionally 0.80 or 0.90; (3) **Effect size** (the minimum clinically important difference); (4) **Variance** (expected spread of the outcome). Increasing power or reducing α requires a larger sample. An underpowered study cannot reliably detect a true difference — a non-significant result from an underpowered study does not prove equivalence.


## Multivariate Analysis — Logistic and Linear Regression

**Logistic regression** is used when the outcome is binary (e.g., complication yes/no, 30-day mortality, anastomotic leak). The model estimates the **log-odds** of the outcome as a linear function of predictor variables, producing an **odds ratio (OR)** for each predictor after adjustment for all other variables in the model. The OR represents the multiplicative change in the odds of the outcome per unit increase in the predictor variable (for continuous predictors) or compared to the reference category (for categorical predictors), holding all other predictors constant.

Interpretation of logistic regression results requires attention to: (1) **OR vs RR**: OR is not the same as relative risk (RR). When the outcome is common (>10%), OR substantially overestimates RR and should not be interpreted as if it were a risk ratio. Use RR or risk difference when the outcome is common. (2) **Adjusted vs unadjusted**: the OR from multivariate logistic regression differs from the unadjusted (bivariable) OR — both should be reported, and substantial changes in OR after adjustment indicate confounding. (3) **Model performance**: report Hosmer-Lemeshow goodness-of-fit test and C-statistic (equivalent to AUC) to assess model calibration and discrimination. (4) **Overfitting**: a model with too many predictors relative to events (rule of thumb: 10 events per variable minimum) will overfit — apparent performance is better than true performance in new patients.

*Logistic Regression — Common Reporting Elements*
Element | Why Report | Surgical Example
--- | --- | ---
Number of events | Determines maximum model complexity (10 EPV rule) | 82 anastomotic leaks → maximum 8 predictor variables
Adjusted OR (95% CI) | Primary measure of association after confounding adjustment | OR 2.4 (95% CI 1.3–4.5) for diabetes → 2.4× odds of leak in diabetics
Hosmer-Lemeshow p-value | Calibration — does model fit the data well? | p=0.45 (non-significant) indicates good calibration
C-statistic (AUC) | Discrimination — does model distinguish cases from non-cases? | AUC = 0.78 indicates acceptable discrimination
Complete case vs imputed | Missing data handling transparency | Multiple imputation of missing BMI in 12% of patients
Variable selection method | Avoid stepwise selection — use clinical a priori or LASSO | Pre-specified clinically based variable selection, not data-driven

**Linear regression** is used when the outcome is a continuous variable (e.g., operative time in minutes, length of stay, haemoglobin change). The model estimates the **mean difference** in outcome per unit change in predictor, producing a **regression coefficient (β)** for each predictor. Assumptions: linearity (association between predictor and outcome is linear); independence of observations; homoscedasticity (constant variance of residuals across fitted values); normality of residuals (not of the outcome). Violations are assessed by residual plots. When the outcome is skewed (e.g., length of stay), log-transformation of the outcome and exponentiation of coefficients produces a geometric mean ratio — more interpretable than the mean difference on a log scale.

> **Stepwise Variable Selection — A Common Methodological Error** — Stepwise variable selection (forward, backward, or stepwise regression) — in which variables are added or removed based on p-values in the model — produces models that are overfit to the sample, have inflated OR estimates, and perform poorly in independent validation. Penalised regression methods (LASSO, ridge, elastic net) are methodologically superior for exploratory prediction modelling. For confirmatory analyses, all variables should be pre-specified based on clinical knowledge and prior evidence — not selected from the data. Reporting 'variables were selected by backward stepwise regression with p<0.05' is a methodological red flag.


## Mixed Models and Repeated Measures

Mixed effects models (also called multilevel models, hierarchical models, or random effects models) are used when data have a hierarchical structure — patients nested within hospitals, repeated measurements nested within patients, or assessments nested within cluster-randomised groups. The model contains both **fixed effects** (the average treatment or predictor effect across all groups) and **random effects** (cluster-specific or subject-specific deviations from the overall average). Random effects capture the correlation between observations from the same cluster or subject, producing valid standard errors and inference despite the non-independence.

**Repeated measures designs** collect multiple observations from the same patient over time (e.g., pain scores at day 1, 3, 7, and 30 post-operatively). Standard repeated measures ANOVA assumes sphericity (equal covariance between all time-point pairs) — this assumption is frequently violated in surgical outcome data. **Linear mixed effects models** (LMM) accommodate: (1) unbalanced data (patients with missing time-points are included under missing-at-random assumptions); (2) flexible correlation structures (different correlation patterns between time-points); (3) continuous time measurement (not restricted to pre-specified intervals); (4) time-varying covariates. LMM produces valid inference for outcomes measured longitudinally in surgical trials.

> **Application — ERAS Protocol Quality of Life Measurement** — An RCT of ERAS vs standard care collects quality of life (QoL) at baseline, 1 week, 1 month, 3 months, and 6 months. Mixed effects models allow: (1) including patients with missing time-point measurements (e.g., those who died before 6 months); (2) estimating the trajectory of QoL recovery over time and whether ERAS vs standard care groups differ in trajectory (time-by-group interaction); (3) adjusting for baseline QoL and other covariates. The ANCOVA approach (single time-point analysis adjusting for baseline) is an alternative for the primary endpoint — both approaches have advantages and should be pre-specified.

*Mixed Models — Key Applications in Surgical Research*
Application | Random Effect | Fixed Effects | Outcome
--- | --- | --- | ---
Cluster RCT analysis | Hospital | Treatment arm, patient covariates | Binary (complication) or continuous (LOS)
Repeated measures QoL | Patient (subject) | Time, treatment, time×treatment interaction | Continuous QoL score
Surgeon volume-outcomes | Surgeon + hospital | Annual volume, patient risk, procedure year | Binary (mortality, complication)
Multicentre longitudinal study | Centre + patient | Time, intervention, centre-level variables | Any outcome type
Meta-analysis of IPD | Study | Treatment, patient-level covariates, study characteristics | OR, RR, HR depending on design


## Bayesian Statistics in Surgical Research

Bayesian statistics provides an alternative framework to classical (frequentist) hypothesis testing. Instead of asking 'What is the probability of observing this data if H₀ is true?' (p-value), Bayesian analysis asks 'Given this data, what is the probability that H₁ is true?' — producing a **posterior probability** that the treatment is beneficial. The Bayesian framework formally incorporates **prior beliefs** (previous evidence, expert knowledge) through a **prior distribution**, updates this with the observed data (likelihood), and produces a **posterior distribution** that quantifies uncertainty about the treatment effect.

Key Bayesian outputs in surgical research: (1) **Posterior probability of benefit**: 'There is an 87% probability that laparoscopic resection reduces 30-day complications by more than 5%.' This is directly actionable and clinically intuitive — more interpretable than a p-value. (2) **Credible interval (CrI)**: the Bayesian equivalent of the confidence interval — 'There is a 95% probability that the true treatment effect lies between -2.1% and -8.4% reduction in leak rate.' Unlike frequentist CIs, CrIs have a direct probability interpretation. (3) **Bayes factor (BF)**: the ratio of the marginal likelihood of the data under H₁ versus H₀ — quantifying the strength of evidence for or against H₁. BF > 10 indicates strong evidence for H₁; BF < 0.1 indicates strong evidence for H₀; BF between 0.1 and 10 is inconclusive.

*Bayes Factor Interpretation — Evidence Scale*
Bayes Factor (BF₁₀) | Evidence for H₁ over H₀
--- | ---
> 100 | Decisive evidence for H₁
30–100 | Very strong evidence for H₁
10–30 | Strong evidence for H₁
3–10 | Moderate evidence for H₁
1–3 | Anecdotal evidence for H₁
1 | No evidence (equal likelihood)
0.33–1 | Anecdotal evidence for H₀
0.1–0.33 | Moderate evidence for H₀
< 0.1 | Strong evidence for H₀

**Prior distribution selection** is the most contentious aspect of Bayesian analysis. Choices: (1) **Informative prior**: based on prior meta-analytic evidence or mechanistic knowledge — appropriate when substantial relevant prior evidence exists; (2) **Weakly informative prior**: centred on no effect with broad dispersion, allowing the data to dominate — appropriate when prior evidence is weak or there is concern about prior influence on conclusions; (3) **Non-informative (flat) prior**: equal probability across all possible values — produces results similar to frequentist analysis; (4) **Sceptical prior**: centred slightly against the intervention being beneficial — appropriate in a confirmatory analysis to guard against over-interpretation. Prior sensitivity analysis should always be reported: if conclusions change substantially with different reasonable priors, the evidence is not robust.

> **MCMC — Markov Chain Monte Carlo Sampling** — For complex Bayesian models, the posterior distribution cannot be computed analytically — it is approximated by **Markov Chain Monte Carlo (MCMC) sampling**. MCMC iteratively generates random samples from the posterior distribution; once the chain converges, these samples represent draws from the posterior and can be summarised (mean, credible interval). MCMC convergence must be verified by: trace plots (should show stationary behaviour, not trending); R-hat statistic (<1.1 for all parameters indicates convergence); effective sample size (>1000 for reliable posterior estimates). Common MCMC software: Stan (via RStan or CmdStan), BUGS/JAGS, PyMC. Bayesian adaptive trial designs use MCMC to update posterior probabilities at each interim analysis.


## Diagnostic Test Accuracy — ROC Curves and AUC

The **Receiver Operating Characteristic (ROC) curve** plots sensitivity (true positive rate) on the y-axis against 1−specificity (false positive rate) on the x-axis across all possible decision thresholds for a continuous diagnostic test or prediction model. Each point on the curve represents a specific threshold — moving along the curve corresponds to shifting the decision threshold from stringent (high specificity, low sensitivity — lower right of curve) to permissive (high sensitivity, low specificity — upper left of curve). A perfect test occupies the top-left corner (sensitivity=1.0, 1−specificity=0); a useless test lies along the diagonal (AUC=0.5).

The **Area Under the ROC Curve (AUC)**, also termed the C-statistic in logistic regression, is the single summary measure of a diagnostic test's discriminative ability. AUC = 0.5 corresponds to no discriminative ability (equivalent to random assignment). AUC interpretation for surgical risk models: 0.5–0.6 poor; 0.6–0.7 fair; 0.7–0.8 acceptable; 0.8–0.9 excellent; 0.9–1.0 outstanding. The clinical utility of a model with a given AUC depends on the decision context — an AUC of 0.75 for perioperative mortality prediction may be clinically useful despite moderate discrimination. AUC does not reflect calibration (how close predicted probabilities are to observed probabilities) — always report both AUC and calibration assessment.

**Optimal threshold selection** from a ROC curve should be guided by clinical context, not purely by statistical criteria. Common approaches: (1) **Youden's J statistic** (maximises sensitivity + specificity − 1) — minimises total misclassification; (2) **Minimum distance to top-left corner** — finds the threshold closest to the ideal point; (3) **Clinical utility analysis** — weights false negatives and false positives differentially based on clinical consequences. Example: in pre-operative risk stratification for major surgery, the consequence of a false negative (failing to identify a high-risk patient) is worse than a false positive (unnecessarily optimising a low-risk patient) — the threshold should be set with higher sensitivity at the cost of specificity.

*ROC Analysis — Key Metrics for Surgical Prediction Models*
Metric | What It Measures | Acceptable Range | Surgical Application
--- | --- | --- | ---
AUC / C-statistic | Overall discrimination | ≥0.70 for clinical use | P-POSSUM, NSQIP surgical risk calculator
Calibration (Hosmer-Lemeshow) | Agreement between predicted and observed rates | p > 0.05 (non-significant is good) | POSSUM overpredicts mortality in low-risk patients
Net Reclassification Index (NRI) | Improvement in classification with new model vs old | >0 favours new model | Adding serum albumin improves POSSUM NRI
Integrated Discrimination Improvement (IDI) | Mean improvement in predicted probability | >0 favours new model | Adding frailty score to ASA grade improves IDI
Decision curve analysis | Net benefit at each threshold probability | Superior net benefit across clinical range | Optimal threshold for ERAS candidacy decision

> **Internal vs External Validation** — A prediction model's AUC computed in the same dataset used for development (apparent AUC) is always optimistic — it reflects overfitting, not true performance. Internal validation methods (bootstrap, cross-validation) correct for optimism and produce a shrinkage factor to adjust coefficients. However, internal validation does not address generalisability. **External validation** in an independent cohort from a different setting and time period is the gold standard for demonstrating clinical utility. The TRIPOD statement (Transparent Reporting of a multivariable prediction model for Individual Prognosis Or Diagnosis) mandates reporting of both development and validation performance metrics.


## Missing Data — MCAR, MAR, MNAR, and Imputation

Missing data are ubiquitous in surgical research — up to 30–40% of patients in database studies may have missing values for one or more variables. The approach to missing data determines whether analysis results are valid or biased. The mechanism of missingness — why data are missing — is critical. Three mechanisms are defined: (1) **Missing Completely At Random (MCAR)**: missingness is unrelated to any observed or unobserved variable — essentially random; (2) **Missing At Random (MAR)**: missingness depends on observed variables but not on the unobserved value of the missing variable itself — missingness can be explained by other data in the dataset; (3) **Missing Not At Random (MNAR)**: missingness depends on the missing value itself — e.g., patients with high BMI do not have BMI recorded because it is not measured in morbidly obese patients. MNAR is the most problematic mechanism and cannot be resolved by standard imputation.

**Multiple imputation** (MI) is the recommended approach for handling missing data under MCAR and MAR mechanisms. MI: (1) creates multiple (typically m=20) completed datasets by sampling from the predictive distribution of missing values given observed data; (2) analyses each completed dataset using the planned analysis; (3) combines results using Rubin's rules (pooled estimates and standard errors that account for imputation uncertainty). MI is implemented in all major statistical software (R: mice package; Stata: mi impute; SAS: PROC MI). The imputation model should include all variables in the analysis model plus any auxiliary variables correlated with missingness — omitting a variable from the imputation model that is included in the analysis model biases results.

*Missing Data Mechanisms — Summary and Approach*
Mechanism | Definition | Example in Surgery | Appropriate Approach
--- | --- | --- | ---
MCAR | Missingness unrelated to any data | BMI missing because laboratory tube was lost | Complete case analysis valid; MI increases efficiency
MAR | Missingness depends on observed data, not on missing value | BMI missing more in elderly patients (but BMI itself doesn't predict missingness) | Multiple imputation with appropriate imputation model
MNAR | Missingness depends on the unobserved missing value | Complications not recorded because patient died before assessment | Sensitivity analysis under different MNAR assumptions; pattern mixture models
Dropout (longitudinal) | Patient withdraws from follow-up | Patient stops responding to QoL questionnaires after complications | Mixed models (MAR assumption) + MNAR sensitivity analysis

> **Complete Case Analysis — When It Is Valid** — Complete case analysis (CCA) — analysing only patients with complete data — is valid only under the MCAR mechanism. Under MAR, CCA produces biased estimates because missingness is systematically related to covariates. In most surgical database studies, data are missing for systematic reasons (older patients, emergency presentations, early years of registry data) — making CCA biased. The fraction of missing information (not just the percentage of cases with missing data) determines the impact on standard errors. Multiple imputation should be the default approach for any dataset with >5% missing data in key variables, reported alongside CCA as a sensitivity analysis.