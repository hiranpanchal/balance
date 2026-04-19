"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Button } from "@/components/site/Button";
import { TextField, TextAreaField } from "@/components/site/FormField";
import { BookingSummary } from "./BookingSummary";
import type { BookingSelection, Service } from "@/lib/types";

const schema = z.object({
  firstName: z.string().min(1, "Required."),
  lastName: z.string().min(1, "Required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(6, "Please enter a phone number."),
  firstTime: z.boolean(),
  notes: z.string().max(300, "300 characters max.").optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to continue." }),
  }),
});

type FormData = z.infer<typeof schema>;

export function StepDetails({
  services,
  selection,
  update,
  next,
}: {
  services: Service[];
  selection: BookingSelection;
  update: (patch: Partial<BookingSelection>) => void;
  next: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: selection.firstName || "",
      lastName: selection.lastName || "",
      email: selection.email || "",
      phone: selection.phone || "",
      firstTime: selection.firstTime ?? true,
      notes: selection.notes || "",
      consent: selection.consent || undefined,
    },
  });

  const firstTime = watch("firstTime");

  const onSubmit = (data: FormData) => {
    update({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      firstTime: data.firstTime,
      notes: data.notes,
      consent: data.consent,
    });
    next();
  };

  return (
    <div className="bw-fade pt-12 md:pt-16">
      <div className="text-center max-w-[700px] mx-auto">
        <Eyebrow>Step three</Eyebrow>
        <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-5 text-teal">
          A few details.
        </h2>
        <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
          Just enough for us to hold your session and say hello on the day.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-14 grid md:grid-cols-[1fr_360px] gap-12 items-start"
      >
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <TextField
              label="First name"
              autoComplete="given-name"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <TextField
              label="Last name"
              autoComplete="family-name"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <TextField
            label="Phone"
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-gold mb-3">
              Is this your first time with us?
            </div>
            <label className="inline-flex items-center gap-3 text-[14px] text-teal">
              <input
                type="checkbox"
                {...register("firstTime")}
                className="w-4 h-4 accent-teal"
              />
              <span>{firstTime ? "Yes — first visit" : "No — returning"}</span>
            </label>
          </div>

          <TextAreaField
            label="Notes or requests (optional)"
            maxLength={300}
            help="Up to 300 characters. Anywhere sore, any allergies, anything we should know."
            {...register("notes")}
            error={errors.notes?.message}
          />

          <div>
            <label className="flex items-start gap-3 text-[14px] leading-[22px] text-teal">
              <input
                type="checkbox"
                {...register("consent")}
                className="mt-1 w-4 h-4 accent-teal"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-gold/50"
                >
                  terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-gold/50"
                >
                  privacy policy
                </a>
                .
              </span>
            </label>
            {errors.consent && (
              <p role="alert" className="mt-2 text-[13px] text-error">
                {errors.consent.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit">Continue</Button>
          </div>
        </div>

        <BookingSummary services={services} selection={selection} />
      </form>
    </div>
  );
}
