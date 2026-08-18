import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "USER" | "ADMIN";
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    image?: string | null;
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
    picture?: string | null;
  }
}
