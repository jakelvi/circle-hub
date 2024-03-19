import { useUserContext } from "@/context/AuthContex";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      <img
        src="/assets/images/side-img.png"
        alt="logo"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </>
  );
}
