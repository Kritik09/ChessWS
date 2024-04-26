import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="grid grid-cols-10 h-full">
      <div className="col-span-8 flex justify-center">
        <img src="../src/assets/chessImg.jpg" alt="" className="p-2" />
      </div>
      <div className="col-span-2 flex justify-center items-center flex-col">
        <p className="font-sans font-bold text-white text-3xl py-4">
          Welcome to Chess{" "}
        </p>
        <Link to={"/game"}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Connect
          </button>
        </Link>
      </div>
    </div>
  );
}
