const STATUS = {
  REGISTERED: "Registered",
  WAITING_VITALS: "Waiting for Vitals",
  WAITING_EXAM: "Waiting for Examination",
  WAITING_DIAGNOSIS: "Waiting for Diagnosis",
  COMPLETE: "Consultation Complete"
};

const VIEW_BY_ROLE = {
  Receptionist: "reception",
  "Enrolled Nurse": "vitals",
  "Nurse/Clinician": "exam",
  "Doctor/Clinician": "diagnosis",
  Admin: "reports"
};

const ALLOWED_VIEWS = {
  Receptionist: ["reception", "reports", "inventory"],
  "Enrolled Nurse": ["vitals", "reports", "inventory"],
  "Nurse/Clinician": ["exam", "reports", "inventory"],
  "Doctor/Clinician": ["diagnosis", "reports", "inventory"],
  Admin: ["reception", "vitals", "exam", "diagnosis", "reports", "inventory"]
};
const AUTH_STORAGE_KEY = "clinic-auth-user";
const AUTH_USERS = [
  { username: "reception1", password: "clinic123", role: "Receptionist", name: "Reception User" },
  { username: "nurse1", password: "clinic123", role: "Enrolled Nurse", name: "Enrolled Nurse" },
  { username: "clinician1", password: "clinic123", role: "Nurse/Clinician", name: "Clinic Nurse" },
  { username: "doctor1", password: "clinic123", role: "Doctor/Clinician", name: "Clinic Doctor" },
  { username: "admin1", password: "clinic123", role: "Admin", name: "System Admin" }
];

const state = {
  role: null,
  currentUser: null,
  patients: [],
  inventory: [],
  inventoryLog: [],
  audit: [],
  idCounter: 22,
  selected: {
    vitalsPatientId: "",
    examPatientId: "",
    diagnosisPatientId: "",
    diagnosisMedicines: [],
    examSymptoms: [],
    examHistoryTags: [],
    examObservationTags: []
  }
};
const NAV_ACTIVE_CLASSES = [
  "bg-gradient-to-br",
  "from-clinic-600",
  "to-clinic-700",
  "text-white",
  "shadow-sm"
];
const NAV_INACTIVE_CLASSES = [
  "bg-slate-50",
  "text-slate-600",
  "ring-1",
  "ring-slate-200",
  "hover:bg-slate-100",
];

const BUTTON_PRIMARY_SM = "inline-flex items-center rounded-lg bg-gradient-to-br from-clinic-600 to-clinic-700 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-105";
const BUTTON_SECONDARY_SM = "inline-flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50";

const CONTROL_CLASSES = [
  "w-full",
  "rounded-xl",
  "border",
  "border-slate-300",
  "bg-white",
  "px-3",
  "py-2",
  "text-sm",
  "text-slate-800",
  "outline-none",
  "transition",
  "focus:border-clinic-600",
  "focus:ring-2",
  "focus:ring-cyan-100",
];

const EXAM_LIBRARY = {
  chiefComplaints: [
    { category: "General", label: "Fever" },
    { category: "General", label: "Headache" },
    { category: "General", label: "Fatigue" },
    { category: "Respiratory", label: "Cough" },
    { category: "Respiratory", label: "Shortness of breath" },
    { category: "Respiratory", label: "Sore throat" },
    { category: "Gastrointestinal", label: "Abdominal pain" },
    { category: "Gastrointestinal", label: "Diarrhoea" },
    { category: "Gastrointestinal", label: "Nausea and vomiting" },
    { category: "Musculoskeletal", label: "Back pain" },
    { category: "Musculoskeletal", label: "Joint pain" },
    { category: "Skin / Soft Tissue", label: "Rash" },
    { category: "Skin / Soft Tissue", label: "Wound review" },
    { category: "Urinary", label: "Pain on urination" },
    { category: "ENT", label: "Ear pain" },
    { category: "Neurological", label: "Dizziness" }
  ],
  symptomsByCategory: {
    General: ["Fever", "Fatigue", "Malaise", "Headache", "Dizziness", "Loss of appetite"],
    Respiratory: ["Cough", "Shortness of breath", "Wheeze", "Sore throat", "Runny nose", "Chest discomfort"],
    Gastrointestinal: ["Abdominal pain", "Diarrhoea", "Vomiting", "Nausea", "Bloating", "Constipation"],
    Musculoskeletal: ["Back pain", "Joint pain", "Muscle aches", "Reduced movement", "Swelling", "Limp"],
    "Skin / Soft Tissue": ["Rash", "Itching", "Wound", "Swelling", "Redness", "Discharge"],
    Urinary: ["Burning urination", "Frequency", "Urgency", "Flank pain", "Lower abdominal pain"],
    ENT: ["Ear pain", "Blocked nose", "Hearing loss", "Sinus pain", "Sneezing", "Sore throat"],
    Neurological: ["Headache", "Dizziness", "Weakness", "Numbness", "Blurred vision"]
  },
  historyTags: [
    "No chronic illness reported",
    "Hypertension",
    "Diabetes",
    "Asthma",
    "HIV on treatment",
    "TB history",
    "Pregnancy",
    "Drug allergy"
  ],
  observationTags: [
    "Alert and oriented",
    "Ambulatory",
    "Reduced oral intake",
    "Falls risk",
    "Isolation precautions",
    "Requires repeat vitals",
    "Needs clinician review",
    "Caregiver informed"
  ],
  physicalTemplates: [
    {
      id: "general-stable",
      categories: ["General", "Neurological"],
      label: "General review - stable",
      text: "Patient alert, oriented, and cooperative. No immediate distress observed on general review."
    },
    {
      id: "respiratory-clear",
      categories: ["Respiratory", "General"],
      label: "Respiratory - clear chest",
      text: "Chest expansion symmetrical. Air entry adequate bilaterally. No wheeze or crackles heard."
    },
    {
      id: "throat-pharynx",
      categories: ["ENT", "Respiratory"],
      label: "ENT - sore throat review",
      text: "Oropharynx visualized with mild erythema. No airway compromise noted."
    },
    {
      id: "abd-soft",
      categories: ["Gastrointestinal"],
      label: "Abdomen - soft non-distended",
      text: "Abdomen soft with no guarding. Mild localized tenderness only where reported."
    },
    {
      id: "msk-tenderness",
      categories: ["Musculoskeletal"],
      label: "Musculoskeletal - tenderness",
      text: "Localized tenderness present with preserved distal perfusion. No obvious deformity seen."
    },
    {
      id: "skin-rash",
      categories: ["Skin / Soft Tissue"],
      label: "Skin - rash review",
      text: "Skin warm with localized rash noted. No rapidly spreading cellulitis features seen."
    },
    {
      id: "urinary-comfort",
      categories: ["Urinary"],
      label: "Urinary - stable review",
      text: "Patient comfortable at rest. No visible distress while awaiting clinician review."
    }
  ]
};

const INVENTORY_CATEGORY_OPTIONS = [
  "Analgesic",
  "Antibiotic",
  "Anti-inflammatory",
  "Antihistamine",
  "Respiratory",
  "Supportive Care",
  "Supplement",
  "Injection"
];

const el = {
  currentUserName: document.getElementById("currentUserName"),
  currentUserRole: document.getElementById("currentUserRole"),
  profileMenuToggle: document.getElementById("profileMenuToggle"),
  profileMenu: document.getElementById("profileMenu"),
  profileSettingsBtn: document.getElementById("profileSettingsBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  appRoot: document.getElementById("appRoot"),
  loginOverlay: document.getElementById("loginOverlay"),
  loginForm: document.getElementById("loginForm"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  loginError: document.getElementById("loginError"),
  navButtons: Array.from(document.querySelectorAll(".nav-btn")),
  views: Array.from(document.querySelectorAll(".view")),
  alerts: document.getElementById("alerts"),
  resetDemoBtn: document.getElementById("resetDemoBtn"),

  registrationForm: document.getElementById("registrationForm"),
  regPatientId: document.getElementById("regPatientId"),
  firstName: document.getElementById("firstName"),
  surname: document.getElementById("surname"),
  dob: document.getElementById("dob"),
  gender: document.getElementById("gender"),
  phone: document.getElementById("phone"),
  street: document.getElementById("street"),
  city: document.getElementById("city"),
  postalCode: document.getElementById("postalCode"),
  kinName: document.getElementById("kinName"),
  kinRelationship: document.getElementById("kinRelationship"),
  kinPhone: document.getElementById("kinPhone"),
  kinAddress: document.getElementById("kinAddress"),
  clearRegBtn: document.getElementById("clearRegBtn"),
  patientSearch: document.getElementById("patientSearch"),
  patientSearchBody: document.getElementById("patientSearchBody"),

  vitalsQueueBody: document.getElementById("vitalsQueueBody"),
  vitalsForm: document.getElementById("vitalsForm"),
  vitalsPatientId: document.getElementById("vitalsPatientId"),
  vitalsTarget: document.getElementById("vitalsTarget"),
  bp: document.getElementById("bp"),
  spo2: document.getElementById("spo2"),
  temperature: document.getElementById("temperature"),
  pulse: document.getElementById("pulse"),
  vitalsDateTime: document.getElementById("vitalsDateTime"),
  clearVitalsBtn: document.getElementById("clearVitalsBtn"),

  examQueueBody: document.getElementById("examQueueBody"),
  examForm: document.getElementById("examForm"),
  examPatientId: document.getElementById("examPatientId"),
  examTarget: document.getElementById("examTarget"),
  complaintCategory: document.getElementById("complaintCategory"),
  chiefComplaint: document.getElementById("chiefComplaint"),
  chiefComplaintSuggestions: document.getElementById("chiefComplaintSuggestions"),
  symptomPicker: document.getElementById("symptomPicker"),
  symptomSuggestionList: document.getElementById("symptomSuggestionList"),
  addSymptomBtn: document.getElementById("addSymptomBtn"),
  quickSymptomButtons: document.getElementById("quickSymptomButtons"),
  selectedSymptomList: document.getElementById("selectedSymptomList"),
  symptoms: document.getElementById("symptoms"),
  historyQuickButtons: document.getElementById("historyQuickButtons"),
  selectedHistoryList: document.getElementById("selectedHistoryList"),
  medicalHistory: document.getElementById("medicalHistory"),
  generalAppearance: document.getElementById("generalAppearance"),
  hydrationStatus: document.getElementById("hydrationStatus"),
  respiratoryEffort: document.getElementById("respiratoryEffort"),
  painScore: document.getElementById("painScore"),
  physicalTemplate: document.getElementById("physicalTemplate"),
  insertPhysicalTemplateBtn: document.getElementById("insertPhysicalTemplateBtn"),
  physicalNotes: document.getElementById("physicalNotes"),
  disposition: document.getElementById("disposition"),
  reviewPriority: document.getElementById("reviewPriority"),
  observationQuickButtons: document.getElementById("observationQuickButtons"),
  selectedObservationList: document.getElementById("selectedObservationList"),
  observations: document.getElementById("observations"),
  attachments: document.getElementById("attachments"),
  attachmentList: document.getElementById("attachmentList"),
  clearExamBtn: document.getElementById("clearExamBtn"),

  diagnosisQueueBody: document.getElementById("diagnosisQueueBody"),
  diagnosisForm: document.getElementById("diagnosisForm"),
  diagnosisPatientId: document.getElementById("diagnosisPatientId"),
  diagnosisTarget: document.getElementById("diagnosisTarget"),
  diagnosisSummary: document.getElementById("diagnosisSummary"),
  diagnosisField: document.getElementById("diagnosisField"),
  icdCode: document.getElementById("icdCode"),
  treatmentPlan: document.getElementById("treatmentPlan"),
  medicineSelect: document.getElementById("medicineSelect"),
  medicineQuantity: document.getElementById("medicineQuantity"),
  addMedicineBtn: document.getElementById("addMedicineBtn"),
  medicineSelectionHint: document.getElementById("medicineSelectionHint"),
  selectedMedicineList: document.getElementById("selectedMedicineList"),
  medication: document.getElementById("medication"),
  followUpDate: document.getElementById("followUpDate"),
  clearDiagnosisBtn: document.getElementById("clearDiagnosisBtn"),

  reportCards: document.getElementById("reportCards"),
  inventoryTableBody: document.getElementById("inventoryTableBody"),
  inventoryItemForm: document.getElementById("inventoryItemForm"),
  inventoryItemSelect: document.getElementById("inventoryItemSelect"),
  inventoryName: document.getElementById("inventoryName"),
  inventoryCategory: document.getElementById("inventoryCategory"),
  inventoryCategorySuggestions: document.getElementById("inventoryCategorySuggestions"),
  inventoryUnit: document.getElementById("inventoryUnit"),
  inventoryReorderLevel: document.getElementById("inventoryReorderLevel"),
  inventoryOpeningStock: document.getElementById("inventoryOpeningStock"),
  clearInventoryItemBtn: document.getElementById("clearInventoryItemBtn"),
  restockForm: document.getElementById("restockForm"),
  restockMedicineId: document.getElementById("restockMedicineId"),
  restockQuantity: document.getElementById("restockQuantity"),
  restockReason: document.getElementById("restockReason"),
  lowStockAlertsList: document.getElementById("lowStockAlertsList"),
  inventoryActivityBody: document.getElementById("inventoryActivityBody"),
  diagnosisSummaryBody: document.getElementById("diagnosisSummaryBody"),
  historyPatientSelect: document.getElementById("historyPatientSelect"),
  historyTimeline: document.getElementById("historyTimeline"),
  auditBody: document.getElementById("auditBody")
};

function init() {
  applyControlStyles();
  resetState();
  bindEvents();
  initStaticUi();
  initAuth();
  renderAll();
}

function applyControlStyles() {
  document.querySelectorAll("input:not([type='hidden']), select, textarea").forEach((control) => {
    CONTROL_CLASSES.forEach((cls) => control.classList.add(cls));
  });

  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.classList.add("min-h-[96px]", "resize-y");
  });
}

function initStaticUi() {
  renderChiefComplaintDatalist();
  renderSymptomDatalist();
  renderPhysicalTemplateOptions();
  renderHistoryQuickButtons();
  renderObservationQuickButtons();
  renderInventoryCategorySuggestions();
}
function initAuth() {
  let savedUsername = "";
  try {
    savedUsername = localStorage.getItem(AUTH_STORAGE_KEY) || "";
  } catch (_e) {}

  const existing = AUTH_USERS.find((u) => u.username === savedUsername);
  if (existing) {
    startSession(existing, false);
    return;
  }

  showLoginOverlay();
  updateNavPermissions();
  updateCurrentUserPanel();
}

function showLoginOverlay() {
  if (el.loginOverlay) {
    el.loginOverlay.classList.remove("hidden");
  }
  if (el.appRoot) {
    el.appRoot.classList.add("pointer-events-none", "select-none", "blur-[1px]", "opacity-70");
  }
}

function hideLoginOverlay() {
  if (el.loginOverlay) {
    el.loginOverlay.classList.add("hidden");
  }
  if (el.appRoot) {
    el.appRoot.classList.remove("pointer-events-none", "select-none", "blur-[1px]", "opacity-70");
  }
}

function setLoginError(message = "") {
  if (!el.loginError) return;
  if (!message) {
    el.loginError.textContent = "";
    el.loginError.classList.add("hidden");
    return;
  }
  el.loginError.textContent = message;
  el.loginError.classList.remove("hidden");
}

function onLoginSubmit(event) {
  event.preventDefault();

  const username = (el.loginUsername?.value || "").trim().toLowerCase();
  const password = el.loginPassword?.value || "";

  const user = AUTH_USERS.find((u) => u.username.toLowerCase() === username && u.password === password);
  if (!user) {
    setLoginError("Invalid username or password.");
    return;
  }

  setLoginError("");
  if (el.loginPassword) el.loginPassword.value = "";
  startSession(user, true);
}

function startSession(user, announce = true) {
  state.currentUser = {
    username: user.username,
    role: user.role,
    name: user.name
  };
  state.role = user.role;

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, user.username);
  } catch (_e) {}

  updateCurrentUserPanel();
  closeProfileMenu();
  hideLoginOverlay();
  applyRole(user.role);

  if (announce) {
    showAlert(`Signed in as ${user.name} (${user.role}).`, "info");
  }
}

function endSession(announce = true) {
  state.currentUser = null;
  state.role = null;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (_e) {}

  updateCurrentUserPanel();
  closeProfileMenu();
  updateNavPermissions();
  showLoginOverlay();
  setLoginError("");
  if (el.loginUsername) el.loginUsername.value = "";
  if (el.loginPassword) el.loginPassword.value = "";

  if (announce) {
    showAlert("You have been logged out.", "info");
  }
}

function updateCurrentUserPanel() {
  const isSignedIn = Boolean(state.currentUser);

  if (el.currentUserName) {
    el.currentUserName.textContent = isSignedIn ? state.currentUser.name : "Not signed in";
  }
  if (el.currentUserRole) {
    el.currentUserRole.textContent = `Role: ${isSignedIn ? state.currentUser.role : "-"}`;
  }

  if (el.profileMenuToggle) {
    el.profileMenuToggle.disabled = !isSignedIn;
    el.profileMenuToggle.classList.toggle("opacity-70", !isSignedIn);
    el.profileMenuToggle.classList.toggle("cursor-not-allowed", !isSignedIn);
  }

  if (!isSignedIn) {
    closeProfileMenu();
  }
}

function toggleProfileMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!state.currentUser || !el.profileMenu || !el.profileMenuToggle) {
    return;
  }

  if (el.profileMenu.classList.contains("hidden")) {
    openProfileMenu();
  } else {
    closeProfileMenu();
  }
}

function openProfileMenu() {
  if (!el.profileMenu || !el.profileMenuToggle) return;
  el.profileMenu.classList.remove("hidden");
  el.profileMenuToggle.setAttribute("aria-expanded", "true");
}

function closeProfileMenu() {
  if (!el.profileMenu || !el.profileMenuToggle) return;
  el.profileMenu.classList.add("hidden");
  el.profileMenuToggle.setAttribute("aria-expanded", "false");
}

function onProfileMenuDocumentClick(event) {
  if (!el.profileMenu || !el.profileMenuToggle) return;
  const target = event.target;

  if (el.profileMenu.contains(target) || el.profileMenuToggle.contains(target)) {
    return;
  }

  closeProfileMenu();
}

function onProfileMenuKeydown(event) {
  if (event.key === "Escape") {
    closeProfileMenu();
  }
}

function onProfileSettingsClick() {
  closeProfileMenu();
  showAlert("Profile settings is not available in this prototype yet.", "info");
}
function actorName() {
  if (state.currentUser?.name) return state.currentUser.name;
  if (state.role) return state.role;
  return "System";
}

function actorHistoryLabel() {
  if (state.currentUser?.name && state.currentUser?.role) {
    return `${state.currentUser.name} (${state.currentUser.role})`;
  }
  return state.role || "System";
}

function resetState() {
  const seed = createSeedPatients();
  state.patients = seed;
  state.inventory = createSeedInventory();
  state.inventoryLog = createSeedInventoryLog(state.inventory);
  state.audit = [];
  state.idCounter = 22;
  state.selected = {
    vitalsPatientId: "",
    examPatientId: "",
    diagnosisPatientId: "",
    diagnosisMedicines: [],
    examSymptoms: [],
    examHistoryTags: [],
    examObservationTags: []
  };

  seed.forEach((p) => {
    p.history.forEach((entry) => {
      state.audit.unshift({
        time: entry.time,
        user: entry.user,
        action: entry.action,
        patientId: p.id
      });
    });
  });

  resetForms();
}

function createSeedInventory() {
  return [
    { id: "MED-001", name: "Paracetamol 500mg", category: "Analgesic", unit: "tabs", stock: 180, reorderLevel: 40 },
    { id: "MED-002", name: "Amoxicillin 500mg", category: "Antibiotic", unit: "caps", stock: 96, reorderLevel: 24 },
    { id: "MED-003", name: "Ibuprofen 200mg", category: "Anti-inflammatory", unit: "tabs", stock: 72, reorderLevel: 20 },
    { id: "MED-004", name: "Azithromycin 250mg", category: "Antibiotic", unit: "tabs", stock: 30, reorderLevel: 12 },
    { id: "MED-005", name: "Cetirizine 10mg", category: "Antihistamine", unit: "tabs", stock: 48, reorderLevel: 16 },
    { id: "MED-006", name: "Salbutamol Inhaler", category: "Respiratory", unit: "inhalers", stock: 14, reorderLevel: 6 },
    { id: "MED-007", name: "ORS Sachets", category: "Supportive Care", unit: "sachets", stock: 22, reorderLevel: 10 }
  ];
}

function createSeedInventoryLog(items) {
  return items.map((item, index) => ({
    id: `INV-OPEN-${index + 1}`,
    time: new Date(Date.now() - (index + 1) * 1000 * 60 * 12).toISOString(),
    type: "Opening Balance",
    medicineId: item.id,
    medicineName: item.name,
    quantityChange: item.stock,
    unit: item.unit,
    balanceAfter: item.stock,
    note: "Seeded demo inventory opening balance",
    patientId: "",
    user: "System"
  }));
}

function createSeedPatients() {
  const now = Date.now();
  return [
    {
      id: "PT-2026-0014",
      firstName: "Lindiwe",
      surname: "Maseko",
      dob: "1991-04-14",
      gender: "Female",
      phone: "082-440-1204",
      address: { street: "12 Riverbend Ave", city: "Johannesburg", postalCode: "2000" },
      nextOfKin: { name: "Thabo Maseko", relationship: "Brother", phone: "083-107-7788", address: "12 Riverbend Ave" },
      status: STATUS.WAITING_VITALS,
      vitals: null,
      exam: null,
      diagnosis: null,
      history: [
        timeline(now - 1000 * 60 * 48, "Patient registered and queued for vitals", "Receptionist")
      ]
    },
    {
      id: "PT-2026-0017",
      firstName: "Sipho",
      surname: "Dlamini",
      dob: "1988-01-21",
      gender: "Male",
      phone: "082-915-2291",
      address: { street: "89 Lakeview Rd", city: "Johannesburg", postalCode: "2001" },
      nextOfKin: { name: "Nomsa Dlamini", relationship: "Spouse", phone: "082-224-3110", address: "89 Lakeview Rd" },
      status: STATUS.WAITING_EXAM,
      vitals: {
        bp: "128/82",
        spo2: 97,
        temperature: "37.1",
        pulse: "78",
        measuredAt: iso(now - 1000 * 60 * 32),
        user: "Enrolled Nurse"
      },
      exam: null,
      diagnosis: null,
      history: [
        timeline(now - 1000 * 60 * 67, "Patient registered and queued for vitals", "Receptionist"),
        timeline(now - 1000 * 60 * 32, "Vitals captured and moved to examination", "Enrolled Nurse")
      ]
    },
    {
      id: "PT-2026-0022",
      firstName: "Ayesha",
      surname: "Khan",
      dob: "1996-08-03",
      gender: "Female",
      phone: "083-991-1146",
      address: { street: "40 Willow Park", city: "Johannesburg", postalCode: "2002" },
      nextOfKin: { name: "Arif Khan", relationship: "Father", phone: "072-561-9000", address: "40 Willow Park" },
      status: STATUS.WAITING_DIAGNOSIS,
      vitals: {
        bp: "121/79",
        spo2: 98,
        temperature: "36.9",
        pulse: "74",
        measuredAt: iso(now - 1000 * 60 * 44),
        user: "Enrolled Nurse"
      },
      exam: {
        chiefComplaint: "Persistent sore throat",
        symptoms: "Sore throat, fatigue, mild fever",
        medicalHistory: "No chronic disease reported",
        physicalNotes: "Mild pharyngeal redness",
        observations: "Hydration adequate",
        attachments: ["throat-image.jpg"],
        recordedAt: iso(now - 1000 * 60 * 20),
        user: "Nurse/Clinician"
      },
      diagnosis: null,
      history: [
        timeline(now - 1000 * 60 * 75, "Patient registered and queued for vitals", "Receptionist"),
        timeline(now - 1000 * 60 * 44, "Vitals captured and moved to examination", "Enrolled Nurse"),
        timeline(now - 1000 * 60 * 20, "Examination notes captured and moved to diagnosis", "Nurse/Clinician")
      ]
    },
    {
      id: "PT-2026-0003",
      firstName: "Peter",
      surname: "Jacobs",
      dob: "1977-09-18",
      gender: "Male",
      phone: "081-111-3422",
      address: { street: "6 Pine Walk", city: "Johannesburg", postalCode: "2091" },
      nextOfKin: { name: "Grace Jacobs", relationship: "Spouse", phone: "081-111-3423", address: "6 Pine Walk" },
      status: STATUS.COMPLETE,
      vitals: {
        bp: "129/84",
        spo2: 97,
        temperature: "37.2",
        pulse: "80",
        measuredAt: iso(now - 1000 * 60 * 50),
        user: "Enrolled Nurse"
      },
      exam: {
        chiefComplaint: "Cough and headache",
        symptoms: "Dry cough, low-grade fever",
        medicalHistory: "Seasonal allergies",
        physicalNotes: "Chest clear, no wheeze",
        observations: "Likely viral infection",
        attachments: [],
        recordedAt: iso(now - 1000 * 60 * 34),
        user: "Nurse/Clinician"
      },
      diagnosis: {
        diagnosis: "Acute Upper Respiratory Infection",
        icdCode: "J06.9",
        treatmentPlan: "Hydration, rest, antipyretics",
        medication: "Paracetamol 500mg TDS for 3 days",
        followUpDate: "2026-03-16",
        recordedAt: iso(now - 1000 * 60 * 10),
        user: "Doctor/Clinician"
      },
      history: [
        timeline(now - 1000 * 60 * 80, "Patient registered and queued for vitals", "Receptionist"),
        timeline(now - 1000 * 60 * 50, "Vitals captured and moved to examination", "Enrolled Nurse"),
        timeline(now - 1000 * 60 * 34, "Examination notes captured and moved to diagnosis", "Nurse/Clinician"),
        timeline(now - 1000 * 60 * 10, "Diagnosis recorded and consultation completed", "Doctor/Clinician")
      ]
    }
  ];
}

function bindEvents() {
  el.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveView(btn.dataset.view));
  });

  if (el.loginForm) {
    el.loginForm.addEventListener("submit", onLoginSubmit);
  }

  if (el.profileMenuToggle) {
    el.profileMenuToggle.addEventListener("click", toggleProfileMenu);
  }

  if (el.profileSettingsBtn) {
    el.profileSettingsBtn.addEventListener("click", onProfileSettingsClick);
  }

  if (el.logoutBtn) {
    el.logoutBtn.addEventListener("click", () => {
      closeProfileMenu();
      endSession(true);
    });
  }

  document.addEventListener("click", onProfileMenuDocumentClick);
  document.addEventListener("keydown", onProfileMenuKeydown);

  if (el.resetDemoBtn) {
    el.resetDemoBtn.addEventListener("click", () => {
      resetState();
      if (state.currentUser?.role) {
        applyRole(state.currentUser.role);
      }
      renderAll();
      showAlert("Demo dataset reset.", "info");
    });
  }

  el.patientSearch.addEventListener("input", renderSearchTable);
  el.patientSearchBody.addEventListener("click", onSearchTableAction);
  el.registrationForm.addEventListener("submit", onSaveRegistration);
  el.clearRegBtn.addEventListener("click", clearRegistrationForm);

  el.vitalsQueueBody.addEventListener("click", onVitalsQueueAction);
  el.vitalsForm.addEventListener("submit", onSaveVitals);
  el.clearVitalsBtn.addEventListener("click", clearVitalsForm);

  el.examQueueBody.addEventListener("click", onExamQueueAction);
  el.examForm.addEventListener("submit", onSaveExam);
  el.clearExamBtn.addEventListener("click", clearExamForm);
  el.attachments.addEventListener("change", renderAttachmentNames);
  el.complaintCategory.addEventListener("change", onComplaintCategoryChange);
  el.addSymptomBtn.addEventListener("click", onAddExamSymptom);
  el.symptomPicker.addEventListener("keydown", onSymptomPickerKeydown);
  el.quickSymptomButtons.addEventListener("click", onQuickSymptomAction);
  el.selectedSymptomList.addEventListener("click", onSelectedExamTagAction);
  el.historyQuickButtons.addEventListener("click", onHistoryTagAction);
  el.selectedHistoryList.addEventListener("click", onSelectedExamTagAction);
  el.observationQuickButtons.addEventListener("click", onObservationTagAction);
  el.selectedObservationList.addEventListener("click", onSelectedExamTagAction);
  el.insertPhysicalTemplateBtn.addEventListener("click", onInsertPhysicalTemplate);

  el.diagnosisQueueBody.addEventListener("click", onDiagnosisQueueAction);
  el.diagnosisForm.addEventListener("submit", onSaveDiagnosis);
  el.clearDiagnosisBtn.addEventListener("click", clearDiagnosisForm);
  el.medicineSelect.addEventListener("change", renderMedicineSelectionHint);
  el.medicineQuantity.addEventListener("input", renderMedicineSelectionHint);
  el.addMedicineBtn.addEventListener("click", onAddMedicineToDraft);
  el.selectedMedicineList.addEventListener("click", onSelectedMedicineListAction);

  el.inventoryItemSelect.addEventListener("change", onInventoryItemSelectChange);
  el.inventoryItemForm.addEventListener("submit", onSaveInventoryItem);
  el.clearInventoryItemBtn.addEventListener("click", clearInventoryItemForm);
  el.restockForm.addEventListener("submit", onRestockInventory);

  el.historyPatientSelect.addEventListener("change", renderHistoryTimeline);
}
function applyRole(role) {
  state.role = role;
  updateNavPermissions();
  if (VIEW_BY_ROLE[role]) {
    setActiveView(VIEW_BY_ROLE[role], true);
  }
}

function updateNavPermissions() {
  const allowed = state.role ? (ALLOWED_VIEWS[state.role] || []) : [];

  el.navButtons.forEach((btn) => {
    const canAccess = allowed.includes(btn.dataset.view);
    btn.disabled = !canAccess;
    btn.classList.toggle("opacity-40", !canAccess);
    btn.classList.toggle("cursor-not-allowed", !canAccess);
  });
}

function setActiveView(view, force = false) {
  if (!state.role) {
    return;
  }

  const allowed = ALLOWED_VIEWS[state.role] || [];
  if (!force && !allowed.includes(view)) {
    showAlert(`Access denied for ${state.role}.`, "error");
    return;
  }

  el.navButtons.forEach((btn) => {
    const isActive = btn.dataset.view === view;
    btn.classList.toggle("text-white", isActive);

    NAV_ACTIVE_CLASSES.forEach((cls) => btn.classList.toggle(cls, isActive));
    NAV_INACTIVE_CLASSES.forEach((cls) => btn.classList.toggle(cls, !isActive));
  });

  el.views.forEach((section) => {
    section.classList.toggle("hidden", section.id !== `view-${view}`);
  });
}

function onSaveRegistration(event) {
  event.preventDefault();
  if (!canPerform("Receptionist")) return;

  const firstName = el.firstName.value.trim();
  const surname = el.surname.value.trim();
  const dob = el.dob.value;
  const gender = el.gender.value;
  const phone = el.phone.value.trim();

  if (!firstName || !surname || !dob || !gender || !phone) {
    showAlert("First Name, Surname, DOB, Gender, and Phone are required.", "error");
    return;
  }

  const existingId = el.regPatientId.value;
  let patient = existingId ? findPatient(existingId) : null;

  if (!patient) {
    patient = {
      id: nextPatientId(),
      firstName,
      surname,
      dob,
      gender,
      phone,
      address: {},
      nextOfKin: {},
      status: STATUS.WAITING_VITALS,
      vitals: null,
      exam: null,
      diagnosis: null,
      history: []
    };
    state.patients.unshift(patient);
    addHistory(patient, "Patient registered and queued for vitals");
    addAudit("Registered patient", patient.id);
    showAlert(`Patient ${patient.id} created and queued for vitals.`);
  } else {
    addHistory(patient, "Patient details updated and queued for vitals");
    addAudit("Updated patient demographics", patient.id);
    showAlert(`Patient ${patient.id} updated and queued for vitals.`);
  }

  patient.firstName = firstName;
  patient.surname = surname;
  patient.dob = dob;
  patient.gender = gender;
  patient.phone = phone;
  patient.address = {
    street: el.street.value.trim(),
    city: el.city.value.trim(),
    postalCode: el.postalCode.value.trim()
  };
  patient.nextOfKin = {
    name: el.kinName.value.trim(),
    relationship: el.kinRelationship.value.trim(),
    phone: el.kinPhone.value.trim(),
    address: el.kinAddress.value.trim()
  };
  patient.status = STATUS.WAITING_VITALS;

  clearRegistrationForm();
  renderAll();
}

function onSearchTableAction(event) {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const patient = findPatient(id);
  if (!patient) return;

  if (btn.dataset.action === "load") {
    loadPatientIntoRegistration(patient);
    showAlert(`Loaded ${patient.id} into registration form.`);
    return;
  }

  if (btn.dataset.action === "queue") {
    if (!canPerform("Receptionist")) return;
    patient.status = STATUS.WAITING_VITALS;
    addHistory(patient, "Patient manually queued for vitals");
    addAudit("Queued patient for vitals", patient.id);
    renderAll();
    showAlert(`${patient.id} moved to Waiting for Vitals.`);
  }
}

function loadPatientIntoRegistration(patient) {
  el.regPatientId.value = patient.id;
  el.firstName.value = patient.firstName || "";
  el.surname.value = patient.surname || "";
  el.dob.value = patient.dob || "";
  el.gender.value = patient.gender || "";
  el.phone.value = patient.phone || "";
  el.street.value = patient.address?.street || "";
  el.city.value = patient.address?.city || "";
  el.postalCode.value = patient.address?.postalCode || "";
  el.kinName.value = patient.nextOfKin?.name || "";
  el.kinRelationship.value = patient.nextOfKin?.relationship || "";
  el.kinPhone.value = patient.nextOfKin?.phone || "";
  el.kinAddress.value = patient.nextOfKin?.address || "";
}

function clearRegistrationForm() {
  el.registrationForm.reset();
  el.regPatientId.value = "";
}

function onVitalsQueueAction(event) {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;

  const patient = findPatient(btn.dataset.id);
  if (!patient) return;

  state.selected.vitalsPatientId = patient.id;
  el.vitalsPatientId.value = patient.id;
  el.vitalsTarget.textContent = `${patient.id} - ${fullName(patient)}`;

  el.bp.value = patient.vitals?.bp || "";
  el.spo2.value = patient.vitals?.spo2 ?? "";
  el.temperature.value = patient.vitals?.temperature || "";
  el.pulse.value = patient.vitals?.pulse || "";
  el.vitalsDateTime.value = patient.vitals?.measuredAt ? patient.vitals.measuredAt.slice(0, 16) : nowDateTimeLocal();
}

function onSaveVitals(event) {
  event.preventDefault();
  if (!canPerform("Enrolled Nurse")) return;

  const id = el.vitalsPatientId.value;
  const patient = findPatient(id);
  if (!patient) {
    showAlert("Select a patient from the vitals queue first.", "error");
    return;
  }

  const bp = el.bp.value.trim();
  const spo2Raw = Number(el.spo2.value);
  if (!/^\d{2,3}\/\d{2,3}$/.test(bp)) {
    showAlert("Blood Pressure must be numeric like 120/80.", "error");
    return;
  }
  if (Number.isNaN(spo2Raw) || spo2Raw < 0 || spo2Raw > 100) {
    showAlert("Oxygen Saturation must be between 0 and 100.", "error");
    return;
  }

  patient.vitals = {
    bp,
    spo2: spo2Raw,
    temperature: el.temperature.value.trim(),
    pulse: el.pulse.value.trim(),
    measuredAt: el.vitalsDateTime.value ? new Date(el.vitalsDateTime.value).toISOString() : new Date().toISOString(),
    user: state.role
  };
  patient.status = STATUS.WAITING_EXAM;

  addHistory(patient, "Vitals captured and moved to examination");
  addAudit("Captured vitals", patient.id);

  clearVitalsForm();
  renderAll();
  showAlert(`Vitals saved for ${patient.id}. Status changed to Waiting for Examination.`);
}

function clearVitalsForm() {
  el.vitalsForm.reset();
  el.vitalsPatientId.value = "";
  state.selected.vitalsPatientId = "";
  el.vitalsTarget.textContent = "None";
}

function renderExamAssistants() {
  renderChiefComplaintDatalist();
  renderSymptomDatalist();
  renderQuickSymptomButtons();
  renderSelectedExamTagLists();
  renderHistoryQuickButtons();
  renderObservationQuickButtons();
  renderPhysicalTemplateOptions();
}

function renderChiefComplaintDatalist() {
  const category = el.complaintCategory.value;
  const complaints = EXAM_LIBRARY.chiefComplaints
    .filter((item) => !category || item.category === category)
    .map((item) => item.label);

  el.chiefComplaintSuggestions.innerHTML = uniqueStringList(complaints)
    .sort((a, b) => a.localeCompare(b))
    .map((label) => `<option value="${escapeHtml(label)}"></option>`)
    .join("");
}

function renderSymptomDatalist() {
  const category = el.complaintCategory.value;
  const source = category
    ? (EXAM_LIBRARY.symptomsByCategory[category] || [])
    : Object.values(EXAM_LIBRARY.symptomsByCategory).flat();

  el.symptomSuggestionList.innerHTML = uniqueStringList(source)
    .sort((a, b) => a.localeCompare(b))
    .map((label) => `<option value="${escapeHtml(label)}"></option>`)
    .join("");
}

function renderQuickSymptomButtons() {
  const category = el.complaintCategory.value;
  const suggestions = category
    ? (EXAM_LIBRARY.symptomsByCategory[category] || [])
    : uniqueStringList(Object.values(EXAM_LIBRARY.symptomsByCategory).flat()).slice(0, 10);

  if (!suggestions.length) {
    el.quickSymptomButtons.innerHTML = '<p class="text-xs text-slate-500">Select a complaint category to load symptom suggestions.</p>';
    return;
  }

  el.quickSymptomButtons.innerHTML = suggestions
    .map((symptom) => `
      <button
        type="button"
        data-symptom="${escapeHtml(symptom)}"
        class="${selectionButtonClasses(state.selected.examSymptoms.some((item) => item.toLowerCase() === symptom.toLowerCase()))}"
      >
        ${escapeHtml(symptom)}
      </button>
    `)
    .join("");
}

function renderHistoryQuickButtons() {
  el.historyQuickButtons.innerHTML = EXAM_LIBRARY.historyTags
    .map((tag) => `
      <button
        type="button"
        data-history-tag="${escapeHtml(tag)}"
        class="${selectionButtonClasses(state.selected.examHistoryTags.some((item) => item.toLowerCase() === tag.toLowerCase()))}"
      >
        ${escapeHtml(tag)}
      </button>
    `)
    .join("");
}

function renderObservationQuickButtons() {
  el.observationQuickButtons.innerHTML = EXAM_LIBRARY.observationTags
    .map((tag) => `
      <button
        type="button"
        data-observation-tag="${escapeHtml(tag)}"
        class="${selectionButtonClasses(state.selected.examObservationTags.some((item) => item.toLowerCase() === tag.toLowerCase()))}"
      >
        ${escapeHtml(tag)}
      </button>
    `)
    .join("");
}

function renderSelectedExamTagLists() {
  renderSelectedExamTagList(el.selectedSymptomList, state.selected.examSymptoms, "No symptoms added yet.", "symptom");
  renderSelectedExamTagList(el.selectedHistoryList, state.selected.examHistoryTags, "No history flags selected.", "history");
  renderSelectedExamTagList(el.selectedObservationList, state.selected.examObservationTags, "No observation tags selected.", "observation");
}

function renderSelectedExamTagList(container, items, emptyText, tagType) {
  container.innerHTML = items.length
    ? items.map((item) => `
      <span class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
        ${escapeHtml(item)}
        <button type="button" data-remove-exam-tag="${escapeHtml(item)}" data-tag-type="${tagType}" class="text-cyan-700 transition hover:text-cyan-900">Remove</button>
      </span>
    `).join("")
    : `<span class="rounded-full border border-dashed border-slate-300 bg-white px-3 py-1 text-xs text-slate-500">${escapeHtml(emptyText)}</span>`;
}

function renderPhysicalTemplateOptions() {
  const category = el.complaintCategory.value;
  const current = el.physicalTemplate.value;
  const templates = EXAM_LIBRARY.physicalTemplates.filter((item) => !category || item.categories.includes(category));
  const options = ['<option value="">Select a template</option>']
    .concat(templates.map((item) => `<option value="${item.id}">${escapeHtml(item.label)}</option>`));

  el.physicalTemplate.innerHTML = options.join("");
  if (current && templates.some((item) => item.id === current)) {
    el.physicalTemplate.value = current;
  }
}

function onComplaintCategoryChange() {
  renderChiefComplaintDatalist();
  renderSymptomDatalist();
  renderQuickSymptomButtons();
  renderPhysicalTemplateOptions();
}

function onAddExamSymptom() {
  const symptom = normalizeText(el.symptomPicker.value);
  if (!symptom) return;

  if (pushUniqueSelection("examSymptoms", symptom)) {
    el.symptomPicker.value = "";
    renderQuickSymptomButtons();
    renderSelectedExamTagLists();
    showAlert(`${symptom} added to the symptom list.`, "info");
  }
}

function onSymptomPickerKeydown(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  onAddExamSymptom();
}

function onQuickSymptomAction(event) {
  const btn = event.target.closest("button[data-symptom]");
  if (!btn) return;

  toggleSelectionValue("examSymptoms", btn.dataset.symptom);
  renderQuickSymptomButtons();
  renderSelectedExamTagLists();
}

function onHistoryTagAction(event) {
  const btn = event.target.closest("button[data-history-tag]");
  if (!btn) return;

  toggleSelectionValue("examHistoryTags", btn.dataset.historyTag);
  renderHistoryQuickButtons();
  renderSelectedExamTagLists();
}

function onObservationTagAction(event) {
  const btn = event.target.closest("button[data-observation-tag]");
  if (!btn) return;

  toggleSelectionValue("examObservationTags", btn.dataset.observationTag);
  renderObservationQuickButtons();
  renderSelectedExamTagLists();
}

function onSelectedExamTagAction(event) {
  const btn = event.target.closest("button[data-remove-exam-tag]");
  if (!btn) return;

  const key = {
    symptom: "examSymptoms",
    history: "examHistoryTags",
    observation: "examObservationTags"
  }[btn.dataset.tagType];

  if (!key) return;
  const target = btn.dataset.removeExamTag.toLowerCase();
  state.selected[key] = state.selected[key].filter((item) => item.toLowerCase() !== target);
  renderQuickSymptomButtons();
  renderHistoryQuickButtons();
  renderObservationQuickButtons();
  renderSelectedExamTagLists();
}

function onInsertPhysicalTemplate() {
  const templateId = el.physicalTemplate.value;
  const template = EXAM_LIBRARY.physicalTemplates.find((item) => item.id === templateId);
  if (!template) {
    showAlert("Choose an exam template first.", "error");
    return;
  }

  if (el.physicalNotes.value.includes(template.text)) {
    showAlert("That template is already in the notes.", "info");
    return;
  }

  el.physicalNotes.value = [el.physicalNotes.value.trim(), template.text].filter(Boolean).join("\n");
  showAlert(`${template.label} inserted into physical notes.`, "info");
}

function selectionButtonClasses(isSelected) {
  return [
    "inline-flex",
    "items-center",
    "rounded-full",
    "border",
    "px-3",
    "py-1.5",
    "text-xs",
    "font-semibold",
    "transition",
    isSelected
      ? "border-cyan-300 bg-cyan-100 text-cyan-900"
      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
  ].join(" ");
}

function onExamQueueAction(event) {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;

  const patient = findPatient(btn.dataset.id);
  if (!patient) return;

  state.selected.examPatientId = patient.id;
  el.examPatientId.value = patient.id;
  el.examTarget.textContent = `${patient.id} - ${fullName(patient)}`;

  el.complaintCategory.value = patient.exam?.complaintCategory || "";
  el.chiefComplaint.value = patient.exam?.chiefComplaint || "";
  state.selected.examSymptoms = cloneStringList(patient.exam?.symptomTags);
  state.selected.examHistoryTags = cloneStringList(patient.exam?.historyTags);
  state.selected.examObservationTags = cloneStringList(patient.exam?.observationTags);
  el.symptoms.value = patient.exam?.symptomNotes || (patient.exam?.symptomTags?.length ? "" : patient.exam?.symptoms || "");
  el.medicalHistory.value = patient.exam?.medicalHistoryNotes || (patient.exam?.historyTags?.length ? "" : patient.exam?.medicalHistory || "");
  el.generalAppearance.value = patient.exam?.physicalGuide?.generalAppearance || "";
  el.hydrationStatus.value = patient.exam?.physicalGuide?.hydrationStatus || "";
  el.respiratoryEffort.value = patient.exam?.physicalGuide?.respiratoryEffort || "";
  el.painScore.value = patient.exam?.physicalGuide?.painScore || "";
  el.physicalTemplate.value = patient.exam?.physicalTemplateId || "";
  el.physicalNotes.value = patient.exam?.physicalNotesRaw || patient.exam?.physicalNotes || "";
  el.disposition.value = patient.exam?.disposition || "";
  el.reviewPriority.value = patient.exam?.reviewPriority || "";
  el.observations.value = patient.exam?.observationNotes || (patient.exam?.observationTags?.length || patient.exam?.disposition || patient.exam?.reviewPriority ? "" : patient.exam?.observations || "");
  renderExamAssistants();
  renderAttachmentNames(patient.exam?.attachments || []);
}

function onSaveExam(event) {
  event.preventDefault();
  if (!canPerform("Nurse/Clinician")) return;

  const id = el.examPatientId.value;
  const patient = findPatient(id);
  if (!patient) {
    showAlert("Select a patient from the examination queue first.", "error");
    return;
  }

  const complaintCategory = el.complaintCategory.value;
  const chiefComplaint = el.chiefComplaint.value.trim();
  const symptomTags = uniqueStringList(state.selected.examSymptoms);
  const historyTags = uniqueStringList(state.selected.examHistoryTags);
  const observationTags = uniqueStringList(state.selected.examObservationTags);
  const symptomNotes = el.symptoms.value.trim();
  const medicalHistoryNotes = el.medicalHistory.value.trim();
  const physicalNotesRaw = el.physicalNotes.value.trim();
  const observationNotes = el.observations.value.trim();

  if (!complaintCategory || !chiefComplaint || (!symptomTags.length && !symptomNotes)) {
    showAlert("Complaint category, chief complaint, and at least one symptom are required.", "error");
    return;
  }

  const uploadedAttachments = Array.from(el.attachments.files || []).map((f) => f.name);
  const attachments = uploadedAttachments.length ? uploadedAttachments : (patient.exam?.attachments || []);

  const physicalGuide = {
    generalAppearance: el.generalAppearance.value,
    hydrationStatus: el.hydrationStatus.value,
    respiratoryEffort: el.respiratoryEffort.value,
    painScore: el.painScore.value
  };
  const physicalGuideParts = [
    physicalGuide.generalAppearance ? `General appearance: ${physicalGuide.generalAppearance}` : "",
    physicalGuide.hydrationStatus ? `Hydration: ${physicalGuide.hydrationStatus}` : "",
    physicalGuide.respiratoryEffort ? `Respiratory effort: ${physicalGuide.respiratoryEffort}` : "",
    physicalGuide.painScore ? `Pain score: ${physicalGuide.painScore}` : ""
  ].filter(Boolean);
  const disposition = el.disposition.value;
  const reviewPriority = el.reviewPriority.value;
  const observationGuideParts = [
    disposition ? `Disposition: ${disposition}` : "",
    reviewPriority ? `Escalation: ${reviewPriority}` : ""
  ].filter(Boolean);

  patient.exam = {
    complaintCategory,
    chiefComplaint,
    symptomTags,
    symptomNotes,
    symptoms: composeStructuredText(symptomTags, symptomNotes),
    historyTags,
    medicalHistoryNotes,
    medicalHistory: composeStructuredText(historyTags, medicalHistoryNotes),
    physicalGuide,
    physicalTemplateId: el.physicalTemplate.value || "",
    physicalNotesRaw,
    physicalNotes: composeStructuredText(physicalGuideParts, physicalNotesRaw, " | "),
    observationTags,
    observationNotes,
    disposition,
    reviewPriority,
    observations: composeStructuredText([...observationTags, ...observationGuideParts], observationNotes, " | "),
    attachments,
    recordedAt: new Date().toISOString(),
    user: state.role
  };
  patient.status = STATUS.WAITING_DIAGNOSIS;

  addHistory(patient, "Examination notes captured and moved to diagnosis");
  addAudit("Captured examination notes", patient.id);

  clearExamForm();
  renderAll();
  showAlert(`Examination notes saved for ${patient.id}. Status changed to Waiting for Diagnosis.`);
}

function clearExamForm() {
  el.examForm.reset();
  state.selected.examPatientId = "";
  state.selected.examSymptoms = [];
  state.selected.examHistoryTags = [];
  state.selected.examObservationTags = [];
  el.examPatientId.value = "";
  el.examTarget.textContent = "None";
  renderExamAssistants();
  renderAttachmentNames([]);
}

function renderAttachmentNames(existing = null) {
  const names = Array.isArray(existing)
    ? existing
    : Array.from(el.attachments.files || []).map((f) => f.name);

  el.attachmentList.innerHTML = names.length
    ? names.map((name) => `<span class="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">${escapeHtml(name)}</span>`).join("")
    : '<span class="text-sm text-slate-500">No attachments selected.</span>';
}

function onDiagnosisQueueAction(event) {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;

  const patient = findPatient(btn.dataset.id);
  if (!patient) return;

  state.selected.diagnosisPatientId = patient.id;
  el.diagnosisPatientId.value = patient.id;
  el.diagnosisTarget.textContent = `${patient.id} - ${fullName(patient)}`;

  el.diagnosisField.value = patient.diagnosis?.diagnosis || "";
  el.icdCode.value = patient.diagnosis?.icdCode || "";
  el.treatmentPlan.value = patient.diagnosis?.treatmentPlan || "";
  el.medication.value = patient.diagnosis?.medicationNotes || patient.diagnosis?.medication || "";
  el.followUpDate.value = patient.diagnosis?.followUpDate || "";
  state.selected.diagnosisMedicines = cloneMedicationDraft(patient.diagnosis?.prescribedMedicines || []);
  el.medicineQuantity.value = "1";

  el.diagnosisSummary.innerHTML = buildDiagnosisSummary(patient);
  renderMedicineOptions();
  renderMedicineSelectionHint();
  renderSelectedMedicineList();
}

function onSaveDiagnosis(event) {
  event.preventDefault();
  if (!canPerform("Doctor/Clinician")) return;

  const id = el.diagnosisPatientId.value;
  const patient = findPatient(id);
  if (!patient) {
    showAlert("Select a patient from diagnosis queue first.", "error");
    return;
  }

  const diagnosis = el.diagnosisField.value.trim();
  const treatmentPlan = el.treatmentPlan.value.trim();
  const medicationNotes = el.medication.value.trim();
  const prescribedMedicines = cloneMedicationDraft(state.selected.diagnosisMedicines);
  if (!diagnosis || !treatmentPlan) {
    showAlert("Diagnosis and treatment plan are required.", "error");
    return;
  }
  if (!canDispenseDraft(prescribedMedicines)) {
    return;
  }

  patient.diagnosis = {
    diagnosis,
    icdCode: el.icdCode.value.trim(),
    treatmentPlan,
    medication: medicationNotes,
    medicationNotes,
    prescribedMedicines,
    followUpDate: el.followUpDate.value,
    recordedAt: new Date().toISOString(),
    user: state.role
  };
  applyInventoryUsage(prescribedMedicines, patient);
  patient.status = STATUS.COMPLETE;

  addHistory(
    patient,
    prescribedMedicines.length
      ? "Diagnosis recorded, medication dispensed, and consultation completed"
      : "Diagnosis recorded and consultation completed"
  );
  addAudit(
    prescribedMedicines.length
      ? "Recorded diagnosis and updated medicine inventory"
      : "Recorded diagnosis",
    patient.id
  );

  clearDiagnosisForm();
  renderAll();
  showAlert(
    prescribedMedicines.length
      ? `Consultation completed for ${patient.id}. Medicine inventory updated.`
      : `Consultation completed for ${patient.id}.`
  );
}

function clearDiagnosisForm() {
  el.diagnosisForm.reset();
  state.selected.diagnosisPatientId = "";
  state.selected.diagnosisMedicines = [];
  el.diagnosisPatientId.value = "";
  el.diagnosisTarget.textContent = "None";
  el.diagnosisSummary.textContent = "Select a patient to review vitals and examination notes.";
  if (el.medicineQuantity) {
    el.medicineQuantity.value = "1";
  }
  renderMedicineOptions();
  renderMedicineSelectionHint();
  renderSelectedMedicineList();
}

function canPerform(requiredRole) {
  if (!state.currentUser || !state.role) {
    showLoginOverlay();
    showAlert("You must sign in first.", "error");
    return false;
  }

  if (state.role === requiredRole || state.role === "Admin") return true;
  showAlert(`Only ${requiredRole} can perform this action.`, "error");
  return false;
}

function renderAll() {
  renderExamAssistants();
  renderMedicineOptions();
  renderMedicineSelectionHint();
  renderSelectedMedicineList();
  renderSearchTable();
  renderVitalsQueue();
  renderExamQueue();
  renderDiagnosisQueue();
  renderReports();
  renderInventory();
}

function renderSearchTable() {
  const q = (el.patientSearch.value || "").trim().toLowerCase();
  const matches = state.patients.filter((p) => {
    const bundle = `${p.id} ${p.firstName} ${p.surname} ${p.phone}`.toLowerCase();
    return bundle.includes(q);
  });

  el.patientSearchBody.innerHTML = matches.length
    ? matches.map((p) => `
        <tr>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(fullName(p))}<br><span class="text-slate-500">${escapeHtml(p.id)}</span></td>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(p.phone || "-")}</td>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${statusBadge(p.status)}</td>
          <td class="px-3 py-2 align-top text-sm text-slate-700">
            <button class="${BUTTON_SECONDARY_SM}" data-action="load" data-id="${p.id}">Load</button>
            <button class="${BUTTON_SECONDARY_SM}" data-action="queue" data-id="${p.id}">Queue Vitals</button>
          </td>
        </tr>
      `).join("")
    : "<tr><td colspan='4' class='px-3 py-3 text-sm text-slate-500'>No patients found.</td></tr>";

  buildHistoryPatientSelect();
}

function renderVitalsQueue() {
  const queue = byStatus(STATUS.WAITING_VITALS);
  el.vitalsQueueBody.innerHTML = queue.length
    ? queue.map((p) => `
      <tr>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${p.id}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(fullName(p))}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${statusBadge(p.status)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700"><button class="${BUTTON_PRIMARY_SM}" data-id="${p.id}">Select</button></td>
      </tr>
    `).join("")
    : "<tr><td colspan='4' class='px-3 py-3 text-sm text-slate-500'>No patients are waiting for vitals.</td></tr>";
}

function renderExamQueue() {
  const queue = byStatus(STATUS.WAITING_EXAM);
  el.examQueueBody.innerHTML = queue.length
    ? queue.map((p) => `
      <tr>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${p.id}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(fullName(p))}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${statusBadge(p.status)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700"><button class="${BUTTON_PRIMARY_SM}" data-id="${p.id}">Select</button></td>
      </tr>
    `).join("")
    : "<tr><td colspan='4' class='px-3 py-3 text-sm text-slate-500'>No patients are waiting for examination.</td></tr>";
}

function renderDiagnosisQueue() {
  const queue = byStatus(STATUS.WAITING_DIAGNOSIS);
  el.diagnosisQueueBody.innerHTML = queue.length
    ? queue.map((p) => `
      <tr>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${p.id}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(fullName(p))}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${statusBadge(p.status)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700"><button class="${BUTTON_PRIMARY_SM}" data-id="${p.id}">Select</button></td>
      </tr>
    `).join("")
    : "<tr><td colspan='4' class='px-3 py-3 text-sm text-slate-500'>No patients are waiting for diagnosis.</td></tr>";
}

function renderReports() {
  const total = state.patients.length;
  const waitingVitals = byStatus(STATUS.WAITING_VITALS).length;
  const waitingExam = byStatus(STATUS.WAITING_EXAM).length;
  const waitingDiagnosis = byStatus(STATUS.WAITING_DIAGNOSIS).length;
  const complete = byStatus(STATUS.COMPLETE).length;
  const lowStockCount = state.inventory.filter((item) => item.stock <= item.reorderLevel).length;

  const vitalsSet = state.patients.filter((p) => p.vitals);
  const avgSpo2 = average(vitalsSet.map((p) => Number(p.vitals.spo2))).toFixed(1);
  const avgPulse = average(vitalsSet.map((p) => Number(p.vitals.pulse || 0))).toFixed(1);
  const avgTemp = average(vitalsSet.map((p) => Number(p.vitals.temperature || 0))).toFixed(1);

  el.reportCards.innerHTML = `
    <div class="rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900">Total Patients<strong class="mt-1 block text-2xl font-semibold text-clinic-700">${total}</strong></div>
    <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Waiting for Vitals<strong class="mt-1 block text-2xl font-semibold text-amber-700">${waitingVitals}</strong></div>
    <div class="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">Waiting for Examination<strong class="mt-1 block text-2xl font-semibold text-sky-700">${waitingExam}</strong></div>
    <div class="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">Waiting for Diagnosis<strong class="mt-1 block text-2xl font-semibold text-violet-700">${waitingDiagnosis}</strong></div>
    <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Consultation Complete<strong class="mt-1 block text-2xl font-semibold text-emerald-700">${complete}</strong></div>
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">Low Stock Medicines<strong class="mt-1 block text-2xl font-semibold text-rose-700">${lowStockCount}</strong></div>
    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Avg SpO2 / Pulse / Temp<strong class="mt-1 block text-xl font-semibold text-slate-900">${safeNumber(avgSpo2)} / ${safeNumber(avgPulse)} / ${safeNumber(avgTemp)}</strong></div>
  `;

  renderDiagnosisSummary();
  renderHistoryTimeline();
  renderAuditTrail();
}

function renderInventory() {
  renderInventoryTable();
  renderInventoryManager();
  renderLowStockAlerts();
  renderInventoryActivity();
}

function renderDiagnosisSummary() {
  const counts = new Map();
  state.patients
    .filter((p) => p.diagnosis?.diagnosis)
    .forEach((p) => {
      const key = p.diagnosis.diagnosis;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

  const rows = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  el.diagnosisSummaryBody.innerHTML = rows.length
    ? rows.map(([diagnosis, count]) => `<tr><td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(diagnosis)}</td><td class="px-3 py-2 align-top text-sm text-slate-700">${count}</td></tr>`).join("")
    : "<tr><td colspan='2' class='px-3 py-3 text-sm text-slate-500'>No diagnosis records yet.</td></tr>";
}

function buildHistoryPatientSelect() {
  const current = el.historyPatientSelect.value;
  el.historyPatientSelect.innerHTML = state.patients
    .map((p) => `<option value="${p.id}">${p.id} - ${escapeHtml(fullName(p))}</option>`)
    .join("");

  if (current && findPatient(current)) {
    el.historyPatientSelect.value = current;
  }
}

function renderHistoryTimeline() {
  const selectedId = el.historyPatientSelect.value || state.patients[0]?.id;
  if (!selectedId) {
    el.historyTimeline.innerHTML = "<li class='text-sm text-slate-500'>No patient selected.</li>";
    return;
  }

  if (!el.historyPatientSelect.value) {
    el.historyPatientSelect.value = selectedId;
  }

  const patient = findPatient(selectedId);
  if (!patient) return;

  const items = [...patient.history].sort((a, b) => new Date(b.time) - new Date(a.time));
  el.historyTimeline.innerHTML = items.length
    ? items
      .map((entry) => `<li class="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"><strong>${escapeHtml(prettyDate(entry.time))}</strong><br>${escapeHtml(entry.action)}<br><span class="text-slate-500">By ${escapeHtml(entry.user)}</span></li>`)
      .join("")
    : "<li class='text-sm text-slate-500'>No history entries.</li>";
}

function renderAuditTrail() {
  const rows = [...state.audit].sort((a, b) => new Date(b.time) - new Date(a.time));
  el.auditBody.innerHTML = rows.length
    ? rows
      .slice(0, 150)
      .map((entry) => `
        <tr>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(prettyDate(entry.time))}</td>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(entry.user)}</td>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(entry.action)}</td>
          <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(entry.patientId || "-")}</td>
        </tr>
      `)
      .join("")
    : "<tr><td colspan='4' class='px-3 py-3 text-sm text-slate-500'>No audit entries.</td></tr>";
}

function buildDiagnosisSummary(patient) {
  const vitals = patient.vitals
    ? `BP: ${patient.vitals.bp}, SpO2: ${patient.vitals.spo2}, Temp: ${patient.vitals.temperature || "-"}, Pulse: ${patient.vitals.pulse || "-"}`
    : "No vitals recorded";

  const exam = patient.exam
    ? `${patient.exam.chiefComplaint || "-"}; ${patient.exam.symptoms || "-"}`
    : "No examination notes recorded";

  const medicationSummary = patient.diagnosis?.prescribedMedicines?.length
    ? patient.diagnosis.prescribedMedicines.map((item) => `${item.name} x${item.quantity} ${item.unit}`).join(", ")
    : (patient.diagnosis?.medicationNotes || patient.diagnosis?.medication || "No medication recorded");

  return `<strong>Vitals:</strong> ${escapeHtml(vitals)}<br><strong>Exam:</strong> ${escapeHtml(exam)}<br><strong>Medication:</strong> ${escapeHtml(medicationSummary)}`;
}

function renderMedicineOptions() {
  const currentValue = el.medicineSelect.value;
  const options = ['<option value="">Select medicine</option>']
    .concat(
      [...state.inventory]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${item.stock} ${escapeHtml(item.unit)} available)</option>`)
    );

  el.medicineSelect.innerHTML = options.join("");
  if (currentValue && findInventoryItem(currentValue)) {
    el.medicineSelect.value = currentValue;
  }
}

function renderMedicineSelectionHint() {
  const medicineId = el.medicineSelect.value;
  const quantity = normalizedMedicineQuantity();

  if (!medicineId) {
    el.medicineSelectionHint.innerHTML = "Select a medicine to preview remaining stock after dispensing.";
    return;
  }

  const item = findInventoryItem(medicineId);
  if (!item) {
    el.medicineSelectionHint.innerHTML = "Selected medicine could not be found in inventory.";
    return;
  }

  const alreadySelected = selectedMedicineQuantity(medicineId);
  const projectedRemaining = item.stock - alreadySelected - quantity;
  const statusText = projectedRemaining < 0
    ? "Not enough stock for that quantity."
    : projectedRemaining <= item.reorderLevel
      ? "This selection will push stock to low level."
      : "Stock remains healthy after this selection.";

  el.medicineSelectionHint.innerHTML = `
    <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-semibold text-slate-800">${escapeHtml(item.name)}</p>
        <p class="text-xs text-slate-500">Current stock: ${item.stock} ${escapeHtml(item.unit)} | Already in basket: ${alreadySelected} ${escapeHtml(item.unit)}</p>
      </div>
      <div class="text-sm font-semibold ${projectedRemaining < 0 ? "text-red-600" : projectedRemaining <= item.reorderLevel ? "text-amber-600" : "text-emerald-700"}">
        After add: ${projectedRemaining}
      </div>
    </div>
    <p class="mt-2 text-xs ${projectedRemaining < 0 ? "text-red-600" : "text-slate-500"}">${statusText}</p>
  `;
}

function renderSelectedMedicineList() {
  if (!state.selected.diagnosisMedicines.length) {
    el.selectedMedicineList.innerHTML = '<div class="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-500">No medicines added yet.</div>';
    return;
  }

  el.selectedMedicineList.innerHTML = state.selected.diagnosisMedicines
    .map((item) => {
      const inventoryItem = findInventoryItem(item.medicineId);
      const remaining = inventoryItem ? inventoryItem.stock - item.quantity : "-";
      return `
        <div class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-semibold text-slate-800">${escapeHtml(item.name)}</p>
            <p class="text-xs text-slate-500">${item.quantity} ${escapeHtml(item.unit)} selected${inventoryItem ? ` | Remaining after save: ${remaining} ${escapeHtml(item.unit)}` : ""}</p>
          </div>
          <button
            type="button"
            data-remove-medicine="${item.medicineId}"
            class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Remove
          </button>
        </div>
      `;
    })
    .join("");
}

function onAddMedicineToDraft() {
  if (!canPerform("Doctor/Clinician")) return;

  if (!el.diagnosisPatientId.value) {
    showAlert("Select a patient from the diagnosis queue first.", "error");
    return;
  }

  const medicineId = el.medicineSelect.value;
  const quantity = normalizedMedicineQuantity();

  if (!medicineId) {
    showAlert("Choose a medicine from inventory first.", "error");
    return;
  }

  const inventoryItem = findInventoryItem(medicineId);
  if (!inventoryItem) {
    showAlert("That medicine is no longer available in inventory.", "error");
    return;
  }

  const existingQuantity = selectedMedicineQuantity(medicineId);
  if (existingQuantity + quantity > inventoryItem.stock) {
    showAlert(`Only ${inventoryItem.stock - existingQuantity} ${inventoryItem.unit} left to add for ${inventoryItem.name}.`, "error");
    return;
  }

  const existing = state.selected.diagnosisMedicines.find((item) => item.medicineId === medicineId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.selected.diagnosisMedicines.push({
      medicineId: inventoryItem.id,
      name: inventoryItem.name,
      quantity,
      unit: inventoryItem.unit
    });
  }

  el.medicineQuantity.value = "1";
  renderMedicineOptions();
  renderMedicineSelectionHint();
  renderSelectedMedicineList();
  showAlert(`${inventoryItem.name} added to prescription basket.`, "info");
}

function onSelectedMedicineListAction(event) {
  const btn = event.target.closest("button[data-remove-medicine]");
  if (!btn) return;

  state.selected.diagnosisMedicines = state.selected.diagnosisMedicines.filter((item) => item.medicineId !== btn.dataset.removeMedicine);
  renderMedicineOptions();
  renderMedicineSelectionHint();
  renderSelectedMedicineList();
}

function renderInventoryTable() {
  const rows = [...state.inventory].sort((a, b) => {
    const aLow = a.stock <= a.reorderLevel ? 0 : 1;
    const bLow = b.stock <= b.reorderLevel ? 0 : 1;
    if (aLow !== bLow) return aLow - bLow;
    return a.name.localeCompare(b.name);
  });

  el.inventoryTableBody.innerHTML = rows.length
    ? rows.map((item) => `
      <tr>
        <td class="px-3 py-2 align-top text-sm text-slate-700">
          <span class="font-semibold">${escapeHtml(item.name)}</span><br>
          <span class="text-xs text-slate-500">${escapeHtml(item.id)}</span>
        </td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(item.category)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${item.stock} ${escapeHtml(item.unit)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${item.reorderLevel} ${escapeHtml(item.unit)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${inventoryStatusBadge(item)}</td>
      </tr>
    `).join("")
    : "<tr><td colspan='5' class='px-3 py-3 text-sm text-slate-500'>No medicine inventory loaded.</td></tr>";
}

function renderInventoryManager() {
  renderInventoryManagerOptions();
  renderInventoryCategorySuggestions();
  updateInventoryAdminControls();
}

function renderInventoryManagerOptions() {
  const sorted = [...state.inventory].sort((a, b) => a.name.localeCompare(b.name));
  const currentItem = el.inventoryItemSelect.value;
  const currentRestock = el.restockMedicineId.value;
  const itemOptions = ['<option value="">Create new medicine</option>']
    .concat(sorted.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${item.stock} ${escapeHtml(item.unit)})</option>`));
  const restockOptions = ['<option value="">Select medicine</option>']
    .concat(sorted.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${item.stock} ${escapeHtml(item.unit)})</option>`));

  el.inventoryItemSelect.innerHTML = itemOptions.join("");
  el.restockMedicineId.innerHTML = restockOptions.join("");

  if (currentItem && findInventoryItem(currentItem)) {
    loadInventoryItemIntoForm(findInventoryItem(currentItem));
  }
  if (currentRestock && findInventoryItem(currentRestock)) {
    el.restockMedicineId.value = currentRestock;
  }
}

function renderInventoryCategorySuggestions() {
  const categories = uniqueStringList(INVENTORY_CATEGORY_OPTIONS.concat(state.inventory.map((item) => item.category)));
  el.inventoryCategorySuggestions.innerHTML = categories
    .sort((a, b) => a.localeCompare(b))
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join("");
}

function updateInventoryAdminControls() {
  const isAdmin = state.role === "Admin";
  [
    el.inventoryItemSelect,
    el.inventoryName,
    el.inventoryCategory,
    el.inventoryUnit,
    el.inventoryReorderLevel,
    el.clearInventoryItemBtn,
    el.restockMedicineId,
    el.restockQuantity,
    el.restockReason
  ].forEach((control) => {
    control.disabled = !isAdmin;
  });
  el.inventoryOpeningStock.disabled = !isAdmin || Boolean(el.inventoryItemSelect.value);
  const inventorySubmit = el.inventoryItemForm.querySelector("button[type='submit']");
  const restockSubmit = el.restockForm.querySelector("button[type='submit']");
  if (inventorySubmit) inventorySubmit.disabled = !isAdmin;
  if (restockSubmit) restockSubmit.disabled = !isAdmin;
}

function onInventoryItemSelectChange() {
  const item = findInventoryItem(el.inventoryItemSelect.value);
  if (!item) {
    clearInventoryItemForm(false);
    return;
  }

  loadInventoryItemIntoForm(item);
  el.restockMedicineId.value = item.id;
}

function loadInventoryItemIntoForm(item) {
  el.inventoryItemSelect.value = item.id;
  el.inventoryName.value = item.name;
  el.inventoryCategory.value = item.category;
  el.inventoryUnit.value = item.unit;
  el.inventoryReorderLevel.value = String(item.reorderLevel);
  el.inventoryOpeningStock.value = String(item.stock);
  el.inventoryOpeningStock.disabled = true;
}

function clearInventoryItemForm(resetSelection = true) {
  if (resetSelection) {
    el.inventoryItemSelect.value = "";
  }
  el.inventoryName.value = "";
  el.inventoryCategory.value = "";
  el.inventoryUnit.value = "";
  el.inventoryReorderLevel.value = "0";
  el.inventoryOpeningStock.value = "0";
  el.inventoryOpeningStock.disabled = false;
}

function onSaveInventoryItem(event) {
  event.preventDefault();
  if (!canPerform("Admin")) return;

  const existingId = el.inventoryItemSelect.value;
  const name = normalizeText(el.inventoryName.value);
  const category = normalizeText(el.inventoryCategory.value);
  const unit = el.inventoryUnit.value;
  const reorderLevel = normalizedNonNegativeNumber(el.inventoryReorderLevel.value);
  const openingStock = normalizedNonNegativeNumber(el.inventoryOpeningStock.value);

  if (!name || !category || !unit) {
    showAlert("Medicine name, category, and unit are required.", "error");
    return;
  }

  if (!existingId && state.inventory.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    showAlert("A medicine with that name already exists. Load it from the list to update it.", "error");
    return;
  }

  if (!existingId) {
    const item = {
      id: nextMedicineId(),
      name,
      category,
      unit,
      stock: openingStock,
      reorderLevel
    };
    state.inventory.push(item);
    logInventoryActivity("Created", item, openingStock, `Medicine created with opening stock of ${openingStock} ${unit}.`);
    addAudit(`Created inventory item ${item.name}`);
    renderAll();
    loadInventoryItemIntoForm(item);
    el.restockMedicineId.value = item.id;
    showAlert(`${item.name} added to inventory.`, "info");
    return;
  }

  const item = findInventoryItem(existingId);
  if (!item) {
    showAlert("Selected medicine could not be found.", "error");
    return;
  }
  if (state.inventory.some((entry) => entry.id !== existingId && entry.name.toLowerCase() === name.toLowerCase())) {
    showAlert("Another medicine already uses that name.", "error");
    return;
  }

  const changes = [];
  if (item.name !== name) changes.push(`name: ${item.name} -> ${name}`);
  if (item.category !== category) changes.push(`category: ${item.category} -> ${category}`);
  if (item.unit !== unit) changes.push(`unit: ${item.unit} -> ${unit}`);
  if (item.reorderLevel !== reorderLevel) changes.push(`reorder level: ${item.reorderLevel} -> ${reorderLevel}`);

  item.name = name;
  item.category = category;
  item.unit = unit;
  item.reorderLevel = reorderLevel;

  if (changes.length) {
    logInventoryActivity("Updated", item, 0, changes.join("; "));
    addAudit(`Updated inventory item ${item.name}`);
    showAlert(`${item.name} master data updated.`, "info");
  } else {
    showAlert("No inventory changes were detected.", "info");
  }

  renderAll();
  loadInventoryItemIntoForm(item);
  el.restockMedicineId.value = item.id;
}

function onRestockInventory(event) {
  event.preventDefault();
  if (!canPerform("Admin")) return;

  const item = findInventoryItem(el.restockMedicineId.value);
  const quantity = normalizedPositiveNumber(el.restockQuantity.value);
  const reason = el.restockReason.value;

  if (!item) {
    showAlert("Select a medicine to restock.", "error");
    return;
  }
  if (!quantity) {
    showAlert("Enter a restock quantity greater than zero.", "error");
    return;
  }

  item.stock += quantity;
  logInventoryActivity("Restock", item, quantity, reason);
  addAudit(`Restocked ${item.name} by ${quantity} ${item.unit}`);
  renderAll();
  el.restockMedicineId.value = item.id;
  el.restockQuantity.value = "1";
  el.inventoryItemSelect.value = item.id;
  loadInventoryItemIntoForm(item);
  showAlert(`${item.name} restocked by ${quantity} ${item.unit}.`, "info");
}

function renderLowStockAlerts() {
  const rows = [...state.inventory]
    .filter((item) => item.stock <= item.reorderLevel)
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));

  el.lowStockAlertsList.innerHTML = rows.length
    ? rows.map((item) => `
      <div class="rounded-xl border ${item.stock === 0 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"} p-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-semibold ${item.stock === 0 ? "text-red-800" : "text-amber-900"}">${escapeHtml(item.name)}</p>
            <p class="text-xs ${item.stock === 0 ? "text-red-700" : "text-amber-700"}">${item.stock} ${escapeHtml(item.unit)} available | Reorder level ${item.reorderLevel} ${escapeHtml(item.unit)}</p>
          </div>
          <span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}">
            ${item.stock === 0 ? "Out of Stock" : "Low Stock"}
          </span>
        </div>
      </div>
    `).join("")
    : '<div class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">No low-stock medicines right now.</div>';
}

function renderInventoryActivity() {
  const rows = [...state.inventoryLog].sort((a, b) => new Date(b.time) - new Date(a.time));
  el.inventoryActivityBody.innerHTML = rows.length
    ? rows.slice(0, 150).map((entry) => `
      <tr>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${escapeHtml(prettyDate(entry.time))}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${inventoryActivityTypeBadge(entry.type)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">
          <span class="font-semibold">${escapeHtml(entry.medicineName)}</span><br>
          <span class="text-xs text-slate-500">${escapeHtml(entry.medicineId)}</span>
        </td>
        <td class="px-3 py-2 align-top text-sm ${entry.quantityChange < 0 ? "text-red-700" : entry.quantityChange > 0 ? "text-emerald-700" : "text-slate-700"}">
          ${entry.quantityChange > 0 ? "+" : ""}${entry.quantityChange} ${escapeHtml(entry.unit)}
        </td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">${entry.balanceAfter} ${escapeHtml(entry.unit)}</td>
        <td class="px-3 py-2 align-top text-sm text-slate-700">
          ${escapeHtml(entry.note || "-")}
          <div class="mt-1 text-xs text-slate-500">By ${escapeHtml(entry.user)}${entry.patientId ? ` | Patient ${escapeHtml(entry.patientId)}` : ""}</div>
        </td>
      </tr>
    `).join("")
    : "<tr><td colspan='6' class='px-3 py-3 text-sm text-slate-500'>No inventory activity recorded yet.</td></tr>";
}

function inventoryStatusBadge(item) {
  if (item.stock === 0) {
    return '<span class="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">Out of Stock</span>';
  }
  if (item.stock <= item.reorderLevel) {
    return '<span class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Low Stock</span>';
  }
  return '<span class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">In Stock</span>';
}

function inventoryActivityTypeBadge(type) {
  const tone = {
    "Opening Balance": "bg-slate-100 text-slate-700",
    Created: "bg-cyan-100 text-cyan-800",
    Updated: "bg-slate-100 text-slate-700",
    Restock: "bg-emerald-100 text-emerald-700",
    Dispense: "bg-amber-100 text-amber-700"
  }[type] || "bg-slate-100 text-slate-700";

  return `<span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}">${escapeHtml(type)}</span>`;
}

function applyInventoryUsage(prescribedMedicines, patient = null) {
  const lowStockTriggered = [];
  prescribedMedicines.forEach((medicine) => {
    const inventoryItem = findInventoryItem(medicine.medicineId);
    if (inventoryItem) {
      inventoryItem.stock = Math.max(0, inventoryItem.stock - medicine.quantity);
      logInventoryActivity(
        "Dispense",
        inventoryItem,
        medicine.quantity * -1,
        `Dispensed to ${patient ? `${patient.id} - ${fullName(patient)}` : "selected patient"}.`,
        patient?.id || ""
      );
      if (inventoryItem.stock <= inventoryItem.reorderLevel) {
        lowStockTriggered.push(`${inventoryItem.name} (${inventoryItem.stock} ${inventoryItem.unit} left)`);
      }
    }
  });

  if (lowStockTriggered.length) {
    showAlert(`Low stock alert: ${lowStockTriggered.join(", ")}.`, "info");
  }
}

function canDispenseDraft(prescribedMedicines) {
  return prescribedMedicines.every((medicine) => {
    const inventoryItem = findInventoryItem(medicine.medicineId);
    if (!inventoryItem) {
      showAlert(`${medicine.name} could not be found in inventory.`, "error");
      return false;
    }
    if (medicine.quantity > inventoryItem.stock) {
      showAlert(`Not enough stock for ${medicine.name}. Available: ${inventoryItem.stock} ${inventoryItem.unit}.`, "error");
      return false;
    }
    return true;
  });
}

function cloneMedicationDraft(items) {
  return (items || []).map((item) => ({
    medicineId: item.medicineId,
    name: item.name,
    quantity: Number(item.quantity) || 0,
    unit: item.unit || "units"
  }));
}

function selectedMedicineQuantity(medicineId) {
  return state.selected.diagnosisMedicines
    .filter((item) => item.medicineId === medicineId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

function normalizedMedicineQuantity() {
  const parsed = Number.parseInt(el.medicineQuantity.value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function findInventoryItem(id) {
  return state.inventory.find((item) => item.id === id);
}

function logInventoryActivity(type, item, quantityChange, note = "", patientId = "") {
  state.inventoryLog.unshift({
    id: `INV-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: new Date().toISOString(),
    type,
    medicineId: item.id,
    medicineName: item.name,
    quantityChange,
    unit: item.unit,
    balanceAfter: item.stock,
    note,
    patientId,
    user: actorName()
  });
}

function nextMedicineId() {
  const highest = state.inventory.reduce((max, item) => {
    const parsed = Number.parseInt(String(item.id).replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);
  return `MED-${String(highest + 1).padStart(3, "0")}`;
}

function cloneStringList(items) {
  return uniqueStringList(Array.isArray(items) ? items : []);
}

function uniqueStringList(items) {
  const seen = new Set();
  const output = [];
  (items || []).forEach((item) => {
    const clean = normalizeText(item);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) return;
    seen.add(key);
    output.push(clean);
  });
  return output;
}

function composeStructuredText(tags, notes, joiner = ", ") {
  const cleanTags = uniqueStringList(tags);
  const cleanNotes = normalizeText(notes);
  return cleanTags.length && cleanNotes
    ? `${cleanTags.join(joiner)} | ${cleanNotes}`
    : cleanTags.length
      ? cleanTags.join(joiner)
      : cleanNotes;
}

function pushUniqueSelection(key, value) {
  const clean = normalizeText(value);
  if (!clean) return false;
  if (state.selected[key].some((item) => item.toLowerCase() === clean.toLowerCase())) return false;
  state.selected[key].push(clean);
  state.selected[key] = uniqueStringList(state.selected[key]);
  return true;
}

function toggleSelectionValue(key, value) {
  const clean = normalizeText(value);
  if (!clean) return;
  const existing = state.selected[key].find((item) => item.toLowerCase() === clean.toLowerCase());
  if (existing) {
    state.selected[key] = state.selected[key].filter((item) => item.toLowerCase() !== clean.toLowerCase());
    return;
  }
  state.selected[key].push(clean);
  state.selected[key] = uniqueStringList(state.selected[key]);
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizedNonNegativeNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function normalizedPositiveNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function addHistory(patient, action) {
  const entry = timeline(Date.now(), action, actorHistoryLabel());
  patient.history.push(entry);
}

function addAudit(action, patientId = "") {
  state.audit.unshift({
    time: new Date().toISOString(),
    user: actorName(),
    action,
    patientId
  });
}

function nextPatientId() {
  state.idCounter += 1;
  return `PT-2026-${String(state.idCounter).padStart(4, "0")}`;
}

function findPatient(id) {
  return state.patients.find((p) => p.id === id);
}

function byStatus(status) {
  return state.patients.filter((p) => p.status === status);
}

function fullName(patient) {
  return `${patient.firstName || ""} ${patient.surname || ""}`.trim();
}

function timeline(ms, action, user) {
  return { time: new Date(ms).toISOString(), action, user };
}

function iso(ms) {
  return new Date(ms).toISOString();
}

function nowDateTimeLocal() {
  const d = new Date();
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function prettyDate(isoValue) {
  return new Date(isoValue).toLocaleString();
}

function average(values) {
  const cleaned = values.filter((v) => Number.isFinite(v) && v > 0);
  if (!cleaned.length) return 0;
  return cleaned.reduce((sum, n) => sum + n, 0) / cleaned.length;
}

function safeNumber(value) {
  return Number.isFinite(Number(value)) ? value : "-";
}

function statusBadge(status) {
  const cls = {
    [STATUS.REGISTERED]: "bg-blue-100 text-blue-700",
    [STATUS.WAITING_VITALS]: "bg-amber-100 text-amber-700",
    [STATUS.WAITING_EXAM]: "bg-sky-100 text-sky-800",
    [STATUS.WAITING_DIAGNOSIS]: "bg-violet-100 text-violet-700",
    [STATUS.COMPLETE]: "bg-emerald-100 text-emerald-700"
  }[status] || "bg-blue-100 text-blue-700";

  return `<span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}">${escapeHtml(status)}</span>`;
}

function showAlert(message, type = "info") {
  const node = document.createElement("div");
  const base = "rounded-xl border px-3 py-2 text-sm shadow-sm backdrop-blur";
  const tone = type === "error"
    ? "border-red-200 bg-red-50 text-red-800"
    : "border-cyan-200 bg-cyan-50 text-cyan-900";

  node.className = `${base} ${tone}`;
  node.textContent = message;
  el.alerts.prepend(node);

  window.setTimeout(() => {
    node.remove();
  }, 3600);
}

function resetForms() {
  clearRegistrationForm();
  clearVitalsForm();
  clearExamForm();
  clearDiagnosisForm();
  el.patientSearch.value = "";
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

init();
