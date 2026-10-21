// Measured results, copied from the committed outputs summarised in
// ../../project/01, 08 and 11. Used by the charts on /work/[slug].

export const medguardCalibration = {
  source: "MedGuard outputs/calibrator (PubMedQA)",
  rows: [
    { label: "Uncalibrated", ece: 0.1427, brier: 0.5625 },
    { label: "Temperature scaling", ece: 0.2023, brier: 0.598 },
    { label: "Logistic regression", ece: 0.1183, brier: 0.5502 },
    { label: "Evidence-conditioned MLP", ece: 0.056, brier: 0.5455, mine: true },
  ],
};

export const medguardDatasets = {
  source: "MedGuard outputs/cross_dataset",
  rows: [
    { dataset: "PubMedQA", n: 1000, baselineAcc: 64.67, before: 0.1427, after: 0.056, change: 60.7 },
    { dataset: "BioASQ", n: 875, baselineAcc: 100.0, before: 0.0069, after: 0.0396, change: -471.9 },
    { dataset: "MedNLI", n: 1000, baselineAcc: 64.0, before: 0.0722, after: 0.0608, change: 15.8 },
    { dataset: "NLI4CT", n: 1000, baselineAcc: 51.33, before: 0.0668, after: 0.0286, change: 57.2 },
  ],
};

export const medguardAbstention = {
  source: "MedGuard outputs/decision/decision_stats.json (75-example test split)",
  rows: [
    { label: "Answer everything", coverage: 100, accuracy: 62.0 },
    { label: "Fixed threshold 0.5", coverage: 73.33, accuracy: 67.27 },
    { label: "Split conformal", coverage: 81.33, accuracy: 67.21, mine: true },
  ],
};

export const recommenderModels = {
  source: "Hybrid-Recommender notebook outputs (Food.com, 55,312 test ratings)",
  rows: [
    { label: "CBF", phase: 1, rmse: 0.9955, ndcg: 0.8249 },
    { label: "User CF", phase: 1, rmse: 0.9161, ndcg: 0.8231 },
    { label: "50/50 hybrid", phase: 1, rmse: 0.9025, ndcg: 0.8252 },
    { label: "Ridge", phase: 2, rmse: 0.8687, ndcg: 0.8602 },
    { label: "Bayesian ridge", phase: 2, rmse: 0.8686, ndcg: 0.8604 },
    { label: "Approx. kernel ridge", phase: 2, rmse: 0.8809, ndcg: 0.8451 },
    { label: "Item-item CF", phase: 3, rmse: 0.9352, ndcg: 0.85 },
    { label: "Matrix factorization", phase: 3, rmse: 0.8601, ndcg: 0.8637, best: true },
    { label: "PMF", phase: 3, rmse: 0.8971, ndcg: 0.8163 },
    { label: "H1 weighted blend", phase: 4, rmse: 0.8638, ndcg: 0.8629 },
    { label: "H2 3-way blend", phase: 4, rmse: 0.8609, ndcg: 0.8641 },
    { label: "H3 switching", phase: 4, rmse: 0.8682, ndcg: 0.8607 },
    { label: "H4 stacked meta-learner", phase: 4, rmse: 0.8775, ndcg: 0.8588 },
  ],
};

export const pestBackbones = {
  source: "Pest classification notebook outputs (1,099 test images)",
  rows: [
    { label: "ResNet50", train: 91.55, val: 88.05, test: 87.53, loss: 0.4454 },
    { label: "Xception", train: 90.87, val: 88.51, test: 87.26, loss: 0.4222 },
    { label: "DenseNet121", train: 91.64, val: 87.83, test: 87.63, loss: 0.3919 },
    { label: "EfficientNetB5", train: 91.89, val: 89.19, test: 87.08, loss: 0.3828 },
  ],
  classes: [
    { label: "Moth", f1: "0.98 – 1.00" },
    { label: "Slug", f1: "0.94 – 0.97" },
    { label: "Weevil", f1: "0.94 – 0.96" },
    { label: "Wasp", f1: "0.90 – 0.96" },
    { label: "Beetle", f1: "0.92 – 0.94" },
    { label: "Earwig", f1: "0.77 – 0.82" },
    { label: "Earthworms", f1: "0.71 – 0.79" },
    { label: "Snail", f1: "0.73 – 0.78" },
    { label: "Ants", f1: "0.67 – 0.77" },
  ],
};
