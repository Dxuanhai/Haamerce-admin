import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Resend } from "resend";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatterVND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const resend = new Resend("re_GeYMAt2v_LUwSc65PJUzPt3RRXjr6rEHp");
export const sendEmail = async ({ data }: any) => {
  console.log("🚀  / sendEmail  / data :", data);

  await resend.emails.send({
    from: "Haamerce@resend.dev",
    to: "dauhai2005@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });
};
