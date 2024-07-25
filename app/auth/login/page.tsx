import LoginForm from "./LoginForm";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage = ({ searchParams }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col p-5 shadow-lg w-full md:w-[30%] border rounded-md">
        <h1 className="mb-10 text-center bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
          Log In
        </h1>
        <LoginForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
};

export default LoginPage;
