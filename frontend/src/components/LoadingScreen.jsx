import { useSpinner } from "./LoadingContext";

function LoadingScreen() {
  const { spinner } = useSpinner();

  if (!spinner) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.49)] bg-opacity-30 z-50">
      <div className="text-white text-xl font-bold animate-pulse">
        Loading...
      </div>
    </div>
  );
}
export default LoadingScreen;
