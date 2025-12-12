import { useForm } from "react-hook-form";
import { lessorAgreeementSchema } from "schemas";
import { useParams } from "react-router-dom";
import * as z from "zod";
import { Request, Response, NextFunction } from "express";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { useState, useTransition } from "react";
import { Input } from "components/ui/input";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  lessorFormValues,
  lessorSignature,
  lessorSignatureUrl,
} from "./agreement-signals";
import { effect } from "@preact/signals";
import axios from "axios";

export const LandlordAgreementForm = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [effectiveStartDate, setEffectiveStartDate] = useState<Date>();
  const form = useForm<z.infer<typeof lessorAgreeementSchema>>({
    resolver: zodResolver(lessorAgreeementSchema),
    defaultValues: {
      day: "",
      month: "April",
      year: "2024",
      lessorName: "Lye Xin Tian",
      lessorIc: "000000",
      lesseeName: "Joshua",
      lesseeIc: "000000",
      address: "Ryan and Mihon Unit 16/3",
      effectiveDate: "1 April 2024",
      expireDate: "1 April 2025",
      rentRmWord: "Three Thousand Six Hundred",
      rentRmNum: "3600",
      advanceDay: "10",
      depositRmWord: "Five Hundred",
      depositRmNum: "500",
      lessorAdd: "775 House",
      lessorTel: "0123456789",
      lessorFax: "04-1234567",
      lesseeAdd: "KL",
      lesseeTel: "0123456789",
      lesseeFax: "04-1234567",
      lessorDesignation: "Ms.",
      lesseeDesignation: "Mr.",
      lessorSignature: new File([], ""),
    },
  });

  const fileReader = new FileReader();

  effect(() => {
    if (lessorSignature.value) {
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          lessorSignatureUrl.value = result as string | undefined;
        }
      };
      fileReader.readAsDataURL(lessorSignature.value);
    }
  });

  const onSubmit = async (values: z.infer<typeof lessorAgreeementSchema>) => {
    if (!lessorSignature.value || lessorSignature.value.size === 0) {
      setError("Please upload signature");
      return;
    }
    setError("");
    setSuccess("");
    lessorFormValues.value = values;
    const response = await axios.post(
      `/api/leaseAgreement/submitLandlordLeaseAgreement/${applicationId}`,
      {
        day: values.day,
        month: values.month,
        year: values.year,
        lessorName: values.lessorName,
        lessorIc: values.lessorIc,
        lesseeName: values.lesseeName,
        address: values.address,
        effectiveDate: values.effectiveDate,
        expireDate: values.expireDate,
        rentRmWord: values.rentRmWord,
        rentRmNum: values.rentRmNum,
        advanceDay: values.advanceDay,
        depositRmWord: values.depositRmWord,
        depositRmNum: values.depositRmNum,
        lessorAdd: values.lessorAdd,
        lessorTel: values.lessorTel,
        lessorFax: values.lessorFax,
        lesseeAdd: values.lesseeAdd,
        lesseeTel: values.lesseeTel,
        lesseeFax: values.lesseeFax,
        lessorDesignation: values.lessorDesignation,
        lessorSignature: lessorSignatureUrl.value,
      }
    );

    const leaseAgreementId = response.data.leaseAgreementId;
    console.log(leaseAgreementId);

    localStorage.setItem(
      "lessorFormValues",
      JSON.stringify(lessorFormValues.value)
    );
    localStorage.setItem(
      "lessorSignature",
      JSON.stringify(lessorSignature.value)
    );
    localStorage.setItem(
      "lessorSignatureUrl",
      JSON.stringify(lessorSignatureUrl.value)
    );
    // startTransition(() => {});
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/landlordLeaseAgreementPg1/${leaseAgreementId}`);
  };

  return (
    <>
      <section className="flex justify-center p-8">
        <CardWrapper
          headerLabel="Agreement Form"
          subheaderLabel="Fill in all details"
        >
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="3"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="February"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="24"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lessorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessor Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Tan Ah Kow"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lessorIc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessor IC</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="000101-14-XXXX"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lesseeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessee Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Tan Ah Du"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lesseeIc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessee IC</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="000101-14-XXXX"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="123, Jalan ABC, 56000 KL"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effective Date</FormLabel>
                      <FormControl>
                        {/* <DatePicker
                          date={effectiveStartDate}
                          setDate={setEffectiveStartDate}
                          signalDate={signalDate}
                        /> */}
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="1 May 2024"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="expireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="1 May 2025"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="rentRmWord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Amount (Words)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Five Hundred"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                <FormField
                  control={form.control}
                  name="rentRmNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Amount (Numbers)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="500.00"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="advanceDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Pay Days</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="10"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="depositRmWord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount (Words)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Five Hundred"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="depositRmNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount (Numbers)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="500.00"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lessorAdd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessor Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="123, Jalan ABC, 56000 KL"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lessorTel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessor Tel No</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="012-3456789"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lessorFax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessor Fax No</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="04-1234567"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lesseeAdd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessee Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="123, Jalan ABC, 56000 KL"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lesseeTel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessee Tel No</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="012-3456789"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="lesseeFax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesse Fax No</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="04-1234567"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lessorDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessor Designation</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Mr."
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lesseeDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessee Designation</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Ms."
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lessorSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature file</FormLabel>
                      <FormControl>
                        <Input
                          accept=".jpg, .jpeg, .png"
                          type="file"
                          onChange={(e) =>
                            field.onChange(
                              (lessorSignature.value = e.target.files
                                ? e.target.files[0]
                                : null)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <br className="" />
              <Button
                type="submit"
                className="w-full rounded-lg bg-dark-orange hover:shadow-standardisedHoverShadow hover:opacity-70"
                disabled={isPending}
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </section>
    </>
  );
};
export { lessorFormValues };
