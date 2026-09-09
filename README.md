# ⚛️ AI-Based Interactive Quantum Algorithm Learning Platform

An interactive full-stack learning platform designed to teach quantum computing principles, circuit design, and quantum algorithms through intuitive visual feedback, live statevector simulation, and context-aware AI tutoring.

---

## 🌟 Key Features

### 1. 📘 Quantum Basics Module
A 7-step guided curriculum covering:
- **Classical Bits vs Qubits**: Deterministic switches vs complex probability amplitudes.
- **Physical Realizations**: Electron spin, photon polarization, and superconducting transmon qubits.
- **Computational Basis States**: $|0\rangle$ and $|1\rangle$, state vectors, and orthonormal bases.
- **Superposition & Amplitude Sliders**: Interactive controls modifying $|c_0|^2$ and $|c_1|^2$ in real-time.
- **Probability Amplitudes & Normalization**: Dirac notation $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ and Born's rule ($|\alpha|^2 + |\beta|^2 = 1$).
- **Measurement & Wavefunction Collapse**: Interactive probabilistic measurement simulation with running trial tallies.
- **Interactive Bloch Sphere**: Real-time 2D isometric projection rotating across polar angle $\theta$ and azimuth $\phi$.

### 2. 🔬 Interactive Quantum Circuit Builder
- Configurable **1 to 3 Qubit** horizontal wire grid across 10 discrete time steps.
- **Gate Palette**: $H$ (Hadamard), $X$ (Pauli-NOT), $Z$ (Phase-flip), and $\text{CNOT}$ (Controlled-NOT entangler) with hover tooltips and eraser/select tools.
- Serializes placed gates into clean JSON and transmits to the backend for execution.
- **Laptop-Optimized UI**: Collapsible palette (`‹ / ›`), view switcher (`[Split]`, `[Circuit]`, `[Results]`), and full-screen expandable results dashboard.

### 3. 📊 Rich State Visualizations
- **Dirac Ket Formatting**: Displays exact complex statevectors (e.g. `0.7071|00⟩ + 0.7071|11⟩`).
- **Before → After Transformation Cards**: Classifies resulting states (Ground, Deterministic, Equal Superposition, Maximally Entangled Bell state).
- **Bloch Sphere Widget**: Real-time 3D coordinate projection with exact polar and azimuthal angles.
- **Theoretical Probability Distribution**: Bar charts showing exact Born rule probabilities per basis state.
- **1,024-Shot Measurement Histogram**: Simulated experimental sampling confirming theoretical probabilities.

### 4. ⚡ Guided Quantum Algorithm Lab
- **Deutsch-Jozsa Algorithm**:
  - Explains classical $O(2^{n-1})$ query complexity vs quantum $O(1)$ single-query determination via phase kickback.
  - 4 Preset Oracles (*Constant 0*, *Constant 1*, *Balanced XOR*, *Balanced First Bit*).
  - Single-query execution verdict with constructive/destructive interference analysis.
- **Grover's Search Algorithm**:
  - Explains quantum search as geometric amplitude amplification rather than "instant" searching.
  - 4-item search space ($|00\rangle, |01\rangle, |10\rangle, |11\rangle$).
  - **4-Stage Sequential Reveal**: Ground state $\to$ Uniform Superposition $\to$ Oracle Phase Inversion $\to$ Diffusion Operator (Inversion about the Mean) with ~100% target retrieval.

### 5. 🤖 Context-Aware AI Quantum Tutor
- Socratic quantum teaching assistant that is fully aware of the user's active screen, circuit gates, and last simulation result.
- Provides grounded, mathematically accurate explanations (e.g. why applying $H$ to $|0\rangle$ splits 1,024 shots evenly into 0 and 1).
- Supports external LLM providers (Gemini / OpenAI) with an intelligent built-in pedagogical quantum engine fallback.

### 6. 📝 Practice Quiz & Student Dashboard
- **10 Curated Questions**: Multiple choice, true/false, and output prediction questions.
- Immediate pedagogical explanations for each answer.
- Progress bars tracking completion across Quantum Basics, Gates, Circuits, and Algorithms with `localStorage` persistence.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Routing**: React Router v7 (8 routes)

### Backend
- **Framework**: FastAPI + Uvicorn + Pydantic v2
- **Simulation**: Qiskit SDK + NumPy linear algebra state evolution
- **Language**: Python 3.11

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Git**

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The API server will run at `http://127.0.0.1:8000` (Health check: `http://127.0.0.1:8000/api/health`).

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 📚 Grounded References
Educational content and algorithm implementations are strictly aligned with:
- **IBM Quantum Learning & Qiskit Documentation**
- **Nielsen & Chuang** — *Quantum Computation and Quantum Information*
- **John Preskill** — *Physics 219 Course Information & Lecture Notes* (Caltech)
- **Deutsch & Jozsa (1992)** — *Rapid Solution of Problems by Quantum Computation*
- **Lov K. Grover (1996)** — *A Fast Quantum Mechanical Algorithm for Database Search*

---

## 📄 License
This project is open-source under the MIT License.
