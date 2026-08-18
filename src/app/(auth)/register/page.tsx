import AuthFlow from "@/components/auth/AuthFlow";

export const metadata = {
  title: "إنشاء حساب | أورجينال",
  description: "إنشاء حساب جديد في أورجينال",
};

export default function RegisterPage() {
  return <AuthFlow initialMode="register" />;
}
