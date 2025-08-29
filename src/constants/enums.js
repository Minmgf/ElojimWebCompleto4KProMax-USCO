// Enums para mantener consistencia con el schema de Prisma

export const TYPE_DOCUMENT = {
  CC: "CC",
  TI: "TI", 
  CE: "CE",
  PASAPORTE: "Pasaporte"
};

export const TYPE_DOCUMENT_OPTIONS = [
  { value: TYPE_DOCUMENT.CC, label: "Cédula de Ciudadanía" },
  { value: TYPE_DOCUMENT.TI, label: "Tarjeta de Identidad" },
  { value: TYPE_DOCUMENT.CE, label: "Cédula de Extranjería" },
  { value: TYPE_DOCUMENT.PASAPORTE, label: "Pasaporte" }
];

export const GENDER = {
  MASCULINO: "MASCULINO",
  FEMENINO: "FEMENINO", 
  OTRO: "OTRO"
};

export const GENDER_OPTIONS = [
  { value: GENDER.MASCULINO, label: "Masculino" },
  { value: GENDER.FEMENINO, label: "Femenino" },
  { value: GENDER.OTRO, label: "Otro" }
];

export const SOCIAL_STRATUM = {
  E1: "E1",
  E2: "E2",
  E3: "E3", 
  E4: "E4",
  E5: "E5",
  E6: "E6"
};

export const SOCIAL_STRATUM_OPTIONS = [
  { value: SOCIAL_STRATUM.E1, label: "Estrato 1" },
  { value: SOCIAL_STRATUM.E2, label: "Estrato 2" },
  { value: SOCIAL_STRATUM.E3, label: "Estrato 3" },
  { value: SOCIAL_STRATUM.E4, label: "Estrato 4" },
  { value: SOCIAL_STRATUM.E5, label: "Estrato 5" },
  { value: SOCIAL_STRATUM.E6, label: "Estrato 6" }
];

export const ETNICAL_GROUP = {
  NINGUNO: "Ninguno",
  AFRODESCENDIENTE: "Afrodescendiente",
  INDIGENA: "Indigena", 
  RAIZAL: "Raizal",
  ROM_GITANO: "Rom_Gitano",
  PALENQUERO: "Palenquero",
  OTRO: "Otro"
};

export const ETNICAL_GROUP_OPTIONS = [
  { value: ETNICAL_GROUP.NINGUNO, label: "Ninguno" },
  { value: ETNICAL_GROUP.AFRODESCENDIENTE, label: "Afrodescendiente" },
  { value: ETNICAL_GROUP.INDIGENA, label: "Indígena" },
  { value: ETNICAL_GROUP.RAIZAL, label: "Raizal" },
  { value: ETNICAL_GROUP.ROM_GITANO, label: "Rom/Gitano" },
  { value: ETNICAL_GROUP.PALENQUERO, label: "Palenquero" },
  { value: ETNICAL_GROUP.OTRO, label: "Otro" }
];

// Valores por defecto para formularios
export const DEFAULT_FORM_VALUES = {
  typeDocument: TYPE_DOCUMENT.CC,
  gender: GENDER.MASCULINO,
  socialStratum: SOCIAL_STRATUM.E1, 
  etnicalGroup: ETNICAL_GROUP.NINGUNO
};
