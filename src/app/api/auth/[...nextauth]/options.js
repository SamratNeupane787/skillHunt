import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../Models/user.model.js";
export const options = {
  providers: [
    GithubProvider({
      profile(profile) {
        console.log("Profile Github :", profile);

        let userRole = "Github User";

        return {
          ...profile,
          role: userRole,
        };
      },

      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_Secret,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);
        let userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;

      if (!session) {
        console.log("Pls login");
      }
      const { name, email, role } = session?.user;
      console.log(session?.user);
      try {
        await connectMongoDB();

        const res = await fetch("http:localhost:3000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            role,
          }),
        });
        if (res.ok) {
          return user;
        }
      } catch (error) {
        console.log("error occured", error);
      }

      return session;
    },
  },
};
