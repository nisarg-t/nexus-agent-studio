# Nexus AgentStudio

> **Autonomous Multi-Agent Orchestration Engine & Observability Studio**

Nexus AgentStudio is a high-performance orchestration workspace designed to coordinate, visualize, and monitor multi-agent swarms executing complex engineering workflows. It provides an interactive Directed Acyclic Graph (DAG) task engine, real-time reasoning telemetry, and deterministic simulation out of the box.

---

## Key Highlights

- **Visual Directed Acyclic Graph (DAG)**: Dynamically resolves dependencies, detects cycles, and coordinates parallel execution across distributed agent nodes.
- **Specialized Multi-Agent Swarm**: Features distinct agent roles—Orchestrator, Distributed Systems Architect, Security Auditor, Code Synthesizer, and Resilience Verifier.
- **Live Observability Stream**: Inspect agent thoughts, tool invocations, token metrics, and cost estimations in real time.
- **Plug-and-Play Simulation**: Works immediately without external dependencies or API keys in zero-cost simulation mode, with optional live Gemini API key connectivity.
- **Synthesized Artifact Inspector**: Review and copy generated infrastructure-as-code, formal threat models, and safe code patches.

---

## Architecture Overview

```
                         +-----------------------------+
                         |      Nexus Orchestrator     |
                         |   (Task Decomposition &     |
                         |    Consensus Verification)  |
                         +--------------+--------------+
                                        |
               +------------------------+------------------------+
               |                                                 |
+--------------v--------------+                   +--------------v--------------+
|     Systems Architect       |                   |       Security Auditor      |
| (Topology & Latency Opt)    |                   | (STRIDE & Cryptographic ID) |
+--------------+--------------+                   +--------------+--------------+
               |                                                 |
               +------------------------+------------------------+
                                        |
                         +--------------v--------------+
                         |       Code Specialist       |
                         |  (Terraform & Safe Code)    |
                         +--------------+--------------+
                                        |
                         +--------------v--------------+
                         |     Resilience Verifier     |
                         |   (Fault Injection & SLA)   |
                         +-----------------------------+
```

---

## Tech Stack

- **Runtime & Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Testing**: Vitest (Unit testing DAG cycle resolution and topological sorting)
- **Containerization**: Docker, Docker Compose, Nginx

---

## Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/your-username/nexus-agent-studio.git
cd nexus-agent-studio
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Run Tests

```bash
npm run test
```

### 4. Build for Production

```bash
npm run build
```

---

## Docker Deployment

To launch the studio in a self-contained container:

```bash
docker compose up --build -d
```

The application will be served at `http://localhost:3000`.

---

## License

This project is licensed under the MIT License.
