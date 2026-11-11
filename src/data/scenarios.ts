import { SwarmScenario } from '../types/agent';

export const SCENARIOS: SwarmScenario[] = [
  {
    id: 'zero-trust-migration',
    name: 'Zero-Trust Cloud Mesh Migration',
    category: 'Enterprise Cloud Architecture',
    description: 'Autonomous multi-agent migration of a legacy multi-region monolith to a Zero-Trust Kubernetes mesh with SPIFFE/SPIRE mTLS and automated chaos resilience validation.',
    agents: [
      {
        id: 'agent-orchestrator',
        name: 'Nexus Prime',
        role: 'orchestrator',
        avatar: 'ShieldCheck',
        model: 'gemini-1.5-pro',
        specialization: 'Hierarchical Task Decomposition & Consensus Verification',
        confidenceScore: 99.4,
        temperature: 0.2,
        systemPrompt: 'You coordinate autonomous specialist agents, reconcile state discrepancies, and ensure adherence to RFC-9110 and SOC2 compliance.'
      },
      {
        id: 'agent-architect',
        name: 'Dr. Elena Vance',
        role: 'architect',
        avatar: 'Cpu',
        model: 'gemini-1.5-pro',
        specialization: 'Distributed Systems Topology & Latency Optimization',
        confidenceScore: 97.8,
        temperature: 0.3,
        systemPrompt: 'You design fault-tolerant microservice meshes, egress gateways, and distributed event backbones.'
      },
      {
        id: 'agent-security',
        name: 'CipherOps',
        role: 'security_auditor',
        avatar: 'Lock',
        model: 'gemini-1.5-flash',
        specialization: 'Automated Threat Modeling & Cryptographic Identity Verification',
        confidenceScore: 98.9,
        temperature: 0.1,
        systemPrompt: 'You analyze threat attack surfaces using STRIDE methodology, audit RBAC policies, and enforce mTLS certificates.'
      },
      {
        id: 'agent-iac',
        name: 'TerraSynth',
        role: 'code_specialist',
        avatar: 'Terminal',
        model: 'gemini-1.5-flash',
        specialization: 'Deterministic Terraform HCL & Kubernetes Helm Synthesis',
        confidenceScore: 96.5,
        temperature: 0.2,
        systemPrompt: 'You produce idempotent, modular Infrastructure as Code adhering to AWS CIS Benchmark v1.4.'
      },
      {
        id: 'agent-chaos',
        name: 'Sentinel-9',
        role: 'synthesizer',
        avatar: 'Zap',
        model: 'gemini-1.5-flash',
        specialization: 'Fault Injection, Chaos Mesh, & SLA Verification',
        confidenceScore: 95.2,
        temperature: 0.4,
        systemPrompt: 'You simulate network partitions, packet drops, and node failures to verify MTTR and graceful degradation.'
      }
    ],
    nodes: [
      {
        id: 'node-1',
        title: 'Legacy Monolith Topology & Egress Profiling',
        description: 'Profile 48 distributed micro-endpoints, extract dependency call graphs, and quantify cross-service latency bottlenecks.',
        assignedAgentId: 'agent-architect',
        status: 'pending',
        dependencies: [],
        toolsCalled: [
          { id: 'tool-1', name: 'ast_dependency_walker', params: { repo: 'enterprise-core', depth: 4 }, latencyMs: 142 },
          { id: 'tool-2', name: 'network_packet_profiler', params: { capture_duration_sec: 60 }, latencyMs: 310 }
        ],
        reasoningLog: [
          'Deconstructing legacy monolithic boundary into 6 autonomous domains.',
          'Identified synchronous RPC coupling between PaymentGateway and InventoryWorker.',
          'Detected unencrypted intra-VPC database traffic across subnet 10.42.0.0/16.'
        ],
        durationMs: 820,
        tokensUsed: 1420,
        progress: 0
      },
      {
        id: 'node-2',
        title: 'STRIDE Threat Surface Modeling & Identity Specification',
        description: 'Map cryptographic SPIFFE IDs, generate Cilium Network Policies, and enforce strict zero-trust egress gates.',
        assignedAgentId: 'agent-security',
        status: 'pending',
        dependencies: ['node-1'],
        toolsCalled: [
          { id: 'tool-3', name: 'threat_matrix_generator', params: { standard: 'STRIDE-SOC2' }, latencyMs: 220 },
          { id: 'tool-4', name: 'spiffe_identity_allocator', params: { trust_domain: 'mesh.corp.internal' }, latencyMs: 95 }
        ],
        reasoningLog: [
          'Assigning cryptographically signed X.509 SVID credentials to each pod.',
          'Formulating Cilium L7 network filter to disallow unauthorized cross-namespace queries.',
          'Zero-Trust isolation score validated at 99.8% compliance against CIS guidelines.'
        ],
        durationMs: 940,
        tokensUsed: 1850,
        progress: 0
      },
      {
        id: 'node-3',
        title: 'Modular Terraform HCL & Envoy Gateway Generation',
        description: 'Synthesize production-ready Terraform modules for AWS EKS, Cilium CNI, and automated TLS cert rotations.',
        assignedAgentId: 'agent-iac',
        status: 'pending',
        dependencies: ['node-2'],
        toolsCalled: [
          { id: 'tool-5', name: 'terraform_hcl_synthesizer', params: { provider: 'hashicorp/aws', version: '~> 5.0' }, latencyMs: 410 },
          { id: 'tool-6', name: 'tflint_static_analysis', params: { strict: true }, latencyMs: 115 }
        ],
        reasoningLog: [
          'Emitted declarative Terraform resource definitions for dual-AZ EKS cluster with Bottlerocket OS nodes.',
          'Injected Envoy sidecar injection annotations into Helm charts.',
          'Validated zero drift against remote state S3 backend.'
        ],
        durationMs: 1250,
        tokensUsed: 2640,
        progress: 0
      },
      {
        id: 'node-4',
        title: 'Chaos Mesh Fault Injection & Partition Stress Test',
        description: 'Simulate 25% random packet drops, 150ms synthetic latency spikes, and AZ split-brain failover.',
        assignedAgentId: 'agent-chaos',
        status: 'pending',
        dependencies: ['node-3'],
        toolsCalled: [
          { id: 'tool-7', name: 'chaos_injector', params: { fault: 'network_partition', az: 'us-east-1b' }, latencyMs: 580 },
          { id: 'tool-8', name: 'prometheus_sli_evaluator', params: { metric: 'http_request_duration_p99' }, latencyMs: 180 }
        ],
        reasoningLog: [
          'Simulated sudden network partition between cluster nodes in us-east-1a and us-east-1b.',
          'Circuit breakers tripped in 42ms; Envoy diverted 100% of read traffic to healthy replicas without data loss.',
          'P99 latency remained stabilized at 21ms (well within the 50ms SLA boundary).'
        ],
        durationMs: 1100,
        tokensUsed: 2120,
        progress: 0
      },
      {
        id: 'node-5',
        title: 'Swarm Consensus & Automated Executive Runbook',
        description: 'Collate security audit hashes, verification metrics, and produce automated zero-downtime cutover plan.',
        assignedAgentId: 'agent-orchestrator',
        status: 'pending',
        dependencies: ['node-4'],
        toolsCalled: [
          { id: 'tool-9', name: 'artifact_cryptographic_signer', params: { algorithm: 'ECDSA_SHA256' }, latencyMs: 75 },
          { id: 'tool-10', name: 'runbook_compiler', params: { format: 'markdown+json' }, latencyMs: 160 }
        ],
        reasoningLog: [
          'Aggregated telemetry from all 4 specialist agents: Zero-trust compliance 100%, P99 verified.',
          'Digital signature signed by Nexus Prime: SHA256:7f49c00b8... verified.',
          'Zero-downtime blue/green cutover runbook compiled for production deployment.'
        ],
        durationMs: 890,
        tokensUsed: 1980,
        progress: 0
      }
    ],
    initialArtifacts: [
      {
        id: 'art-1',
        title: 'zero_trust_mesh.tf',
        type: 'code',
        language: 'hcl',
        content: `// Terraform Module: Zero-Trust Multi-AZ Kubernetes Mesh
// Generated by TerraSynth Agent with CIS AWS 1.4 Hardening

terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
    cilium = {
      source  = "cilium/cilium"
      version = "~> 1.15"
    }
  }
}

resource "aws_eks_cluster" "zero_trust_core" {
  name     = "nexus-mesh-prod-01"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.30"

  vpc_config {
    subnet_ids              = module.vpc.private_subnets
    endpoint_private_access = true
    endpoint_public_access  = false # No public API exposure
    security_group_ids      = [aws_security_group.cluster_sg.id]
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.cluster_kms.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

resource "cilium_network_policy" "strict_mtls_policy" {
  metadata {
    name      = "enforce-spiffe-mtls"
    namespace = "production"
  }

  spec = jsonencode({
    endpointSelector = {
      matchLabels = {
        tier = "microservice"
      }
    }
    ingress = [
      {
        fromEndpoints = [
          {
            matchLabels = {
              "io.cilium.k8s.policy.serviceaccount" = "api-gateway"
            }
          }
        ]
        toPorts = [
          {
            ports = [{ port = "8443", protocol = "TCP" }]
            rules = {
              http = [
                {
                  method = "POST"
                  path   = "/v1/secure/.*"
                }
              ]
            }
          }
        ]
        authentication = {
          mode = "required"
          type = "spire"
        }
      }
    ]
  })
}`,
        generatedByAgent: 'TerraSynth',
        timestamp: '2026-11-11T10:30:00Z'
      },
      {
        id: 'art-2',
        title: 'THREAT_MODEL_STRIDE.md',
        type: 'markdown',
        language: 'markdown',
        content: `# STRIDE Automated Threat Model Report
**Target System**: Multi-Tenant Banking Core Egress  
**Auditor**: CipherOps Autonomous Agent  
**Confidence**: 98.9% (Verified by Formal Property Verifier)

---

### Threat Vectors & Mitigations
| Threat Category | Attack Vector | Raw Risk | Automated Mitigation | Residual Risk |
|---|---|---|---|---|
| **Spoofing** | Rogue container impersonating Auth Service | **Critical** | Cryptographic SPIFFE X.509 SVID rotation every 60 minutes | **Negligible** |
| **Tampering** | In-transit MITM RPC eavesdropping | **High** | Mandatory WireGuard + Cilium transparent kernel encryption | **None** |
| **Repudiation** | Untracked privileged DB mutations | **High** | Immutable append-only cryptographic Kafka audit ledger | **Low** |
| **Info Disclosure** | Memory dump leak via side-channel | **Medium** | AWS Nitro Enclaves with confidential computing enabled | **Negligible** |
| **Denial of Service** | L7 Distributed HTTP flood | **High** | eBPF rate-limiting at XDP network layer (drops up to 10M pps) | **Low** |
| **Elevation of Priv.** | Container escape via kernel vuln | **Critical** | Seccomp default profile + read-only root filesystems | **Low** |

---

### Security Certification
Signed off by **CipherOps Security AI Core**  
Fingerprint: \`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\``,
        generatedByAgent: 'CipherOps',
        timestamp: '2026-11-11T10:31:00Z'
      }
    ]
  },
  {
    id: 'cve-autonomous-triage',
    name: 'Critical Zero-Day AST Triage & Memory Patch',
    category: 'Autonomous Cybersecurity',
    description: 'Swarm agents detect a buffer overrun in an open-source parsing library, localize the AST node, generate memory-safe Rust bindings, and fuzz-test for zero regressions.',
    agents: [
      {
        id: 'agent-orchestrator',
        name: 'Nexus Prime',
        role: 'orchestrator',
        avatar: 'ShieldAlert',
        model: 'gemini-1.5-pro',
        specialization: 'CVE Incident Management & Protocol Verification',
        confidenceScore: 99.1,
        temperature: 0.1,
        systemPrompt: 'Coordinates security emergency incident response.'
      },
      {
        id: 'agent-ast',
        name: 'ByteSieve',
        role: 'researcher',
        avatar: 'Search',
        model: 'gemini-1.5-flash',
        specialization: 'Binary AST Decompilation & Pointer Arithmetic Tracking',
        confidenceScore: 97.4,
        temperature: 0.1,
        systemPrompt: 'Deep AST code inspection and memory boundary tracking.'
      },
      {
        id: 'agent-rust',
        name: 'RustifyCore',
        role: 'code_specialist',
        avatar: 'Code2',
        model: 'gemini-1.5-pro',
        specialization: 'Memory-Safe Systems Refactoring & Borrow-Checker Proofs',
        confidenceScore: 98.6,
        temperature: 0.2,
        systemPrompt: 'Generates zero-cost memory safe Rust implementations.'
      },
      {
        id: 'agent-fuzz',
        name: 'AFL-Runner',
        role: 'synthesizer',
        avatar: 'Flame',
        model: 'gemini-1.5-flash',
        specialization: 'Differential Fuzzing & Mutation Test Generation',
        confidenceScore: 96.8,
        temperature: 0.3,
        systemPrompt: 'Runs 1,000,000 fuzz cycles with ASAN and UBSAN.'
      }
    ],
    nodes: [
      {
        id: 'cve-node-1',
        title: 'Zero-Day AST Decompilation & Pointer Leak Localization',
        description: 'Decompile parser AST to locate unsafe pointer offset calculation on malformed HTTP chunk headers.',
        assignedAgentId: 'agent-ast',
        status: 'pending',
        dependencies: [],
        toolsCalled: [
          { id: 'cve-t1', name: 'ast_taint_analyzer', params: { target_fn: 'parse_chunked_body' }, latencyMs: 190 }
        ],
        reasoningLog: [
          'Tracing input byte buffer from network socket to internal ring buffer.',
          'Identified unbounded pointer arithmetic at byte offset 0x4B2A in libparse.c.',
          'Arbitrary code execution primitive confirmed when chunk length is negative integer.'
        ],
        durationMs: 760,
        tokensUsed: 1350,
        progress: 0
      },
      {
        id: 'cve-node-2',
        title: 'Memory-Safe Rust Engine Refactoring with FFI',
        description: 'Rewrite vulnerable parsing subroutine in safe Rust with guaranteed bounds checking and C-ABI export.',
        assignedAgentId: 'agent-rust',
        status: 'pending',
        dependencies: ['cve-node-1'],
        toolsCalled: [
          { id: 'cve-t2', name: 'rust_borrow_checker', params: { unsafe_blocks: 0 }, latencyMs: 310 }
        ],
        reasoningLog: [
          'Synthesizing safe Zero-Copy parser using Nom and byte slice patterns.',
          'Compiling with #![forbid(unsafe_code)] to guarantee memory safety at compile time.',
          'Exposed extern "C" function matching legacy ABI seamlessly.'
        ],
        durationMs: 1120,
        tokensUsed: 2240,
        progress: 0
      },
      {
        id: 'cve-node-3',
        title: 'Differential Fuzz Testing (2.5M Corpus Mutations)',
        description: 'Execute automated regression fuzzing with AddressSanitizer against historical test suites.',
        assignedAgentId: 'agent-fuzz',
        status: 'pending',
        dependencies: ['cve-node-2'],
        toolsCalled: [
          { id: 'cve-t3', name: 'afl_differential_fuzzer', params: { corpus_size: 2500000 }, latencyMs: 640 }
        ],
        reasoningLog: [
          '2,500,000 mutations processed with 0 crashes, 0 memory leaks, 0 segfaults.',
          'Throughput measured at 184,000 requests/sec (12% faster than legacy C code).',
          'ASAN verification clean.'
        ],
        durationMs: 980,
        tokensUsed: 1690,
        progress: 0
      }
    ],
    initialArtifacts: [
      {
        id: 'art-cve-1',
        title: 'safe_parser.rs',
        type: 'code',
        language: 'rust',
        content: `// Automated Memory-Safe Replacement for CVE-2026-X
// Generated by RustifyCore Agent with #![forbid(unsafe_code)]

#![forbid(unsafe_code)]

#[repr(C)]
#[derive(Debug, PartialEq, Eq)]
pub enum ParseResult {
    Ok(usize),
    Incomplete,
    MalformedChunkHeader,
    IntegerOverflow,
}

pub struct SafeChunkParser<'a> {
    buffer: &'a [u8],
    cursor: usize,
}

impl<'a> SafeChunkParser<'a> {
    #[inline(always)]
    pub fn new(buffer: &'a [u8]) -> Self {
        Self { buffer, cursor: 0 }
    }

    pub fn parse_next_chunk(&mut self) -> ParseResult {
        let remaining = &self.buffer[self.cursor..];
        if remaining.is_empty() {
            return ParseResult::Incomplete;
        }

        // Guaranteed slice bounds check without raw pointers
        match remaining.iter().position(|&b| b == b'\\r') {
            Some(idx) => {
                let header_slice = &remaining[..idx];
                let header_str = match std::str::from_utf8(header_slice) {
                    Ok(s) => s,
                    Err(_) => return ParseResult::MalformedChunkHeader,
                };

                // Safe hexadecimal parsing prevents integer wrap-around
                let chunk_size = match usize::from_str_radix(header_str.trim(), 16) {
                    Ok(sz) => sz,
                    Err(_) => return ParseResult::MalformedChunkHeader,
                };

                self.cursor += idx + 2; // advance safely
                ParseResult::Ok(chunk_size)
            }
            None => ParseResult::Incomplete,
        }
    }
}`,
        generatedByAgent: 'RustifyCore',
        timestamp: '2026-11-11T10:32:00Z'
      }
    ]
  }
];
