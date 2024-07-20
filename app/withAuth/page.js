// hoc/withAuth.js
"use client";
// hoc/withAuth.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
  const ProtectedRoute = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/signin");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  ProtectedRoute.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedRoute;
};

export default withAuth;
