import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const SimulMpr = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const returnStep = location.state?.returnStep ?? 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      SIMULATEUR MPR

      <button onClick={() => navigate("/", { replace: true, state: { step: returnStep } })}>
        Retour
      </button>
    </div>
  );
};

export default SimulMpr;
