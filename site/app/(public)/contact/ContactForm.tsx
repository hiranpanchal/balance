"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, TextAreaField } from "@/components/site/FormField";
import { Button } from "@/components/site/Button";
import { Eyebrow } from "@/components/site/Eyebrow";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  message: z.string().min(10, "A sentence or two will do."),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // TODO: wire in a real contact endpoint.
    // eslint-disable-next-line no-console
    console.log("[mock contact message]", data);
    await new Promise((r) => setTimeout(r, 400));
    setSent(true);
    reset();
  };

  if (sent) {
    return (
      <div className="bg-cream-light rounded-lg p-10 text-center">
        <Eyebrow>Thank you</Eyebrow>
        <p className="font-display text-[26px] text-teal mt-4">
          Your note is with us.
        </p>
        <p className="mt-4 text-[14px] leading-[24px] text-teal/80">
          We&rsquo;ll reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextField
        label="Name"
        {...register("name")}
        error={errors.name?.message}
        autoComplete="name"
      />
      <TextField
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
        autoComplete="email"
      />
      <TextField
        label="Phone (optional)"
        type="tel"
        {...register("phone")}
        error={errors.phone?.message}
        autoComplete="tel"
      />
      <TextAreaField
        label="Message"
        {...register("message")}
        error={errors.message?.message}
      />
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
