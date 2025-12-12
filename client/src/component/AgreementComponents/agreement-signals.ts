import { signal } from "@preact/signals";

export const lessorFormValues = signal({
  day: "",
  month: "",
  year: "",
  lessorName: "",
  lessorIc: "",
  lesseeName: "",
  lesseeIc: "",
  address: "",
  effectiveDate: "",
  expireDate: "",
  rentRmWord: "",
  rentRmNum: "",
  advanceDay: "",
  depositRmWord: "",
  depositRmNum: "",
  lessorAdd: "",
  lessorTel: "",
  lessorFax: "",
  lesseeAdd: "",
  lesseeTel: "",
  lesseeFax: "",
  lessorDesignation: "",
  lesseeDesignation: "",
});

export const lesseeFormValues = signal({
  lesseeIc: "",
  lesseeDesignation: "",
});

export const lessorSignature = signal<File | null>(new File([], ""));

export const lessorSignatureUrl = signal<string | undefined>("");

export const lesseeSignature = signal<File | null>(new File([], ""));

export const lesseeSignatureUrl = signal<string | undefined>("");

export const signalDate = signal(new Date());
