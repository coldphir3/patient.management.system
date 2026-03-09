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
  Receptionist: ["reception", "reports"],
  "Enrolled Nurse": ["vitals", "reports"],
  "Nurse/Clinician": ["exam", "reports"],
  "Doctor/Clinician": ["diagnosis", "reports"],
  Admin: ["reception", "vitals", "exam", "diagnosis", "reports"]
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
  audit: [],
  idCounter: 22,
  selected: {
    vitalsPatientId: "",
    examPatientId: "",
    diagnosisPatientId: ""
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
  chiefComplaint: document.getElementById("chiefComplaint"),
  symptoms: document.getElementById("symptoms"),
  medicalHistory: document.getElementById("medicalHistory"),
  physicalNotes: document.getElementById("physicalNotes"),
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
  medication: document.getElementById("medication"),
  followUpDate: document.getElementById("followUpDate"),
  clearDiagnosisBtn: document.getElementById("clearDiagnosisBtn"),

  reportCards: document.getElementById("reportCards"),
  diagnosisSummaryBody: document.getElementById("diagnosisSummaryBody"),
  historyPatientSelect: document.getElementById("historyPatientSelect"),
  historyTimeline: document.getElementById("historyTimeline"),
  auditBody: document.getElementById("auditBody")
};

function init() {
  applyControlStyles();
  resetState();
  bindEvents();
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
  state.audit = [];
  state.idCounter = 22;
  state.selected = {
    vitalsPatientId: "",
    examPatientId: "",
    diagnosisPatientId: ""
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

  el.diagnosisQueueBody.addEventListener("click", onDiagnosisQueueAction);
  el.diagnosisForm.addEventListener("submit", onSaveDiagnosis);
  el.clearDiagnosisBtn.addEventListener("click", clearDiagnosisForm);

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

function onExamQueueAction(event) {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;

  const patient = findPatient(btn.dataset.id);
  if (!patient) return;

  state.selected.examPatientId = patient.id;
  el.examPatientId.value = patient.id;
  el.examTarget.textContent = `${patient.id} - ${fullName(patient)}`;

  el.chiefComplaint.value = patient.exam?.chiefComplaint || "";
  el.symptoms.value = patient.exam?.symptoms || "";
  el.medicalHistory.value = patient.exam?.medicalHistory || "";
  el.physicalNotes.value = patient.exam?.physicalNotes || "";
  el.observations.value = patient.exam?.observations || "";
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

  const chiefComplaint = el.chiefComplaint.value.trim();
  const symptoms = el.symptoms.value.trim();
  if (!chiefComplaint || !symptoms) {
    showAlert("Chief complaint and symptoms are required.", "error");
    return;
  }

  const attachments = Array.from(el.attachments.files || []).map((f) => f.name);

  patient.exam = {
    chiefComplaint,
    symptoms,
    medicalHistory: el.medicalHistory.value.trim(),
    physicalNotes: el.physicalNotes.value.trim(),
    observations: el.observations.value.trim(),
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
  el.examPatientId.value = "";
  el.examTarget.textContent = "None";
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
  el.medication.value = patient.diagnosis?.medication || "";
  el.followUpDate.value = patient.diagnosis?.followUpDate || "";

  el.diagnosisSummary.innerHTML = buildDiagnosisSummary(patient);
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
  if (!diagnosis || !treatmentPlan) {
    showAlert("Diagnosis and treatment plan are required.", "error");
    return;
  }

  patient.diagnosis = {
    diagnosis,
    icdCode: el.icdCode.value.trim(),
    treatmentPlan,
    medication: el.medication.value.trim(),
    followUpDate: el.followUpDate.value,
    recordedAt: new Date().toISOString(),
    user: state.role
  };
  patient.status = STATUS.COMPLETE;

  addHistory(patient, "Diagnosis recorded and consultation completed");
  addAudit("Recorded diagnosis", patient.id);

  clearDiagnosisForm();
  renderAll();
  showAlert(`Consultation completed for ${patient.id}.`);
}

function clearDiagnosisForm() {
  el.diagnosisForm.reset();
  state.selected.diagnosisPatientId = "";
  el.diagnosisPatientId.value = "";
  el.diagnosisTarget.textContent = "None";
  el.diagnosisSummary.textContent = "Select a patient to review vitals and examination notes.";
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
  renderSearchTable();
  renderVitalsQueue();
  renderExamQueue();
  renderDiagnosisQueue();
  renderReports();
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
    : "<tr><td colspan='4' class='text-slate-500 patients found.</td></tr>";

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
    : "<tr><td colspan='4' class='text-slate-500 patients are waiting for vitals.</td></tr>";
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
    : "<tr><td colspan='4' class='text-slate-500 patients are waiting for examination.</td></tr>";
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
    : "<tr><td colspan='4' class='text-slate-500 patients are waiting for diagnosis.</td></tr>";
}

function renderReports() {
  const total = state.patients.length;
  const waitingVitals = byStatus(STATUS.WAITING_VITALS).length;
  const waitingExam = byStatus(STATUS.WAITING_EXAM).length;
  const waitingDiagnosis = byStatus(STATUS.WAITING_DIAGNOSIS).length;
  const complete = byStatus(STATUS.COMPLETE).length;

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
    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Avg SpO2 / Pulse / Temp<strong class="mt-1 block text-xl font-semibold text-slate-900">${safeNumber(avgSpo2)} / ${safeNumber(avgPulse)} / ${safeNumber(avgTemp)}</strong></div>
  `;

  renderDiagnosisSummary();
  renderHistoryTimeline();
  renderAuditTrail();
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
    : "<tr><td colspan='2' class='text-slate-500 diagnosis records yet.</td></tr>";
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
    el.historyTimeline.innerHTML = "<li class='text-slate-500 patient selected.</li>";
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
      .map((entry) => `<li class="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"><strong>${escapeHtml(prettyDate(entry.time))}</strong><br>${escapeHtml(entry.action)}<br><span class='text-slate-500 ${escapeHtml(entry.user)}</span></li>`)
      .join("")
    : "<li class='text-slate-500 history entries.</li>";
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
    : "<tr><td colspan='4' class='text-slate-500 audit entries.</td></tr>";
}

function buildDiagnosisSummary(patient) {
  const vitals = patient.vitals
    ? `BP: ${patient.vitals.bp}, SpO2: ${patient.vitals.spo2}, Temp: ${patient.vitals.temperature || "-"}, Pulse: ${patient.vitals.pulse || "-"}`
    : "No vitals recorded";

  const exam = patient.exam
    ? `${patient.exam.chiefComplaint || "-"}; ${patient.exam.symptoms || "-"}`
    : "No examination notes recorded";

  return `<strong>Vitals:</strong> ${escapeHtml(vitals)}<br><strong>Exam:</strong> ${escapeHtml(exam)}`;
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
