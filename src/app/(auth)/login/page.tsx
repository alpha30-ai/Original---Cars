import AuthFlow from "@/components/auth/AuthFlow";

export const metadata = {
  title: "تسجيل الدخول | أورجينال",
  description: "تسجيل الدخول إلى حسابك في أورجينال",
};

export default function LoginPage() {
  return <AuthFlow initialMode="login" />;
}
