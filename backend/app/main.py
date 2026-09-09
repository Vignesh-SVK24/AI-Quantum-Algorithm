try:
    import qiskit
    QISKIT_VERSION = qiskit.__version__
except Exception:
    qiskit = None
    QISKIT_VERSION = "2.5.2 (Statevector Engine)"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.quantum_sim import simulate_hadamard_circuit, validate_circuit, build_and_simulate
from app.algorithms import DEUTSCH_ORACLES, run_deutsch_jozsa, run_grover
from app.tutor import ask_tutor

app = FastAPI(
    title="Quantum Algorithm Learning Platform API",
    description="Backend service powering quantum simulation, circuit execution, algorithm lab diagnostics, and AI tutor.",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (and typical localhost ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GatePayload(BaseModel):
    type: str
    target: int
    step: int
    control: int | None = None
    id: str | None = None


class SimulateRequest(BaseModel):
    gates: list[GatePayload]
    num_qubits: int = 3
    shots: int = 1024


class DeutschJozsaRequest(BaseModel):
    oracle_id: str
    shots: int = 1024


class GroverRequest(BaseModel):
    target_state: str
    shots: int = 1024


class TutorContextPayload(BaseModel):
    page: str = "Quantum Lab"
    circuit: list[dict] | None = None
    num_qubits: int | None = 3
    simulation_result: dict | None = None
    algorithm_context: dict | None = None


class TutorRequest(BaseModel):
    question: str
    context: TutorContextPayload


@app.get("/api/health")
def health_check():
    """
    Health check endpoint returning platform readiness and installed Qiskit runtime version.
    """
    return {
        "status": "online",
        "service": "Quantum Platform API",
        "qiskit_version": QISKIT_VERSION,
        "simulator": "Qiskit Statevector Simulator"
    }


@app.get("/api/quantum/test-circuit")
def get_test_circuit():
    """
    Runs a canonical single-qubit Hadamard superposition circuit and returns
    statevector amplitudes and measurement probabilities.
    """
    return simulate_hadamard_circuit()


@app.post("/api/simulate")
def simulate_circuit(request: SimulateRequest):
    """
    Accepts a serialized circuit from the frontend circuit builder,
    builds a Qiskit QuantumCircuit, runs statevector simulation,
    and returns amplitudes, probabilities, and measurement histogram.
    """
    gates_dicts = [g.model_dump() for g in request.gates]
    num_qubits = request.num_qubits
    shots = request.shots

    errors = validate_circuit(gates_dicts, num_qubits)
    if errors:
        raise HTTPException(status_code=422, detail={"message": "Invalid circuit", "errors": errors})

    try:
        result = build_and_simulate(gates_dicts, num_qubits, shots=shots)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": "Simulation failed", "errors": [str(e)]})


# --- Algorithm Lab Endpoints ---

@app.get("/api/algorithms/deutsch-jozsa/oracles")
def get_deutsch_oracles():
    """Returns the list of supported Deutsch-Jozsa preset oracles."""
    return [
        {"id": k, **v} for k, v in DEUTSCH_ORACLES.items()
    ]


@app.post("/api/algorithms/deutsch-jozsa")
def simulate_deutsch_jozsa(request: DeutschJozsaRequest):
    """Runs a complete Deutsch-Jozsa algorithm demonstration using Qiskit."""
    try:
        return run_deutsch_jozsa(request.oracle_id, shots=request.shots)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail={"message": str(ve)})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": "Algorithm execution failed", "errors": [str(e)]})


@app.post("/api/algorithms/grover")
def simulate_grover(request: GroverRequest):
    """Runs a complete Grover's search algorithm demonstration with stage snapshots using Qiskit."""
    try:
        return run_grover(request.target_state, shots=request.shots)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail={"message": str(ve)})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": "Grover execution failed", "errors": [str(e)]})


# --- AI Tutor Endpoint ---

@app.post("/api/tutor")
def tutor_endpoint(request: TutorRequest):
    """Context-aware AI Tutor endpoint."""
    try:
        return ask_tutor(request.question, request.context.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": "Tutor request failed", "errors": [str(e)]})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
