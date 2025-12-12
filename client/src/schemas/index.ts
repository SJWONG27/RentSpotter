import * as z from "zod";

export const lessorAgreeementSchema = z.object({
  day: z.string().min(1, { message: "Day is required" }),
  month: z.string().min(1, { message: "Month of effective date is required" }),
  year: z.string().min(1, { message: "Year of effective date is required" }),
  lessorName: z.string().min(1, { message: "Lessor name is required" }),
  lessorIc: z.string().min(1, { message: "Lessor IC is required" }),
  lesseeName: z.string().min(1, { message: "Lessee name is required" }),
  lesseeIc: z.string().min(1, { message: "Lessee IC is required" }),
  address: z.string().min(1, { message: "Property address is required" }),
  effectiveDate: z.string().min(1, { message: "Effective date is required" }),
  expireDate: z.string().min(1, { message: "Expiry date is required" }),
  rentRmWord: z
    .string()
    .min(1, { message: "Rent amount in words is required" }),
  rentRmNum: z
    .string()
    .min(1, { message: "Rent amount in numbers is required" }),
  advanceDay: z.string().min(1, { message: "Advance pay days is required" }),
  depositRmWord: z
    .string()
    .min(1, { message: "Deposit amount in words is required" }),
  depositRmNum: z
    .string()
    .min(1, { message: "Deposit amount in numbers is required" }),
  lessorAdd: z.string().min(1, { message: "Lessor address is required" }),
  lessorTel: z.string().min(1, { message: "Lessor tel no is required" }),
  lessorFax: z.string().min(1, { message: "Lessor fax no is required" }),
  lesseeAdd: z.string().min(1, { message: "Lessee address is required" }),
  lesseeTel: z.string().min(1, { message: "Lessee tel no is required" }),
  lesseeFax: z.string().min(1, { message: "Lessee fax no is required" }),
  lessorDesignation: z
    .string()
    .min(1, { message: "Lessor designation no is required" }),
  lesseeDesignation: z
    .string()
    .min(1, { message: "Lessee designation no is required" }),
  lessorSignature: z.instanceof(File).optional(),
});

export const lesseeAgreeementSchema = z.object({
  lesseeIc: z.string().min(1, { message: "Lessee IC is required" }),
  lesseeDesignation: z
    .string()
    .min(1, { message: "Lessee designation no is required" }),
  lesseeSignature: z.instanceof(File).optional(),
});
