
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AuthWrapper;
