# 1. Vault File Structure

### 📦 **Immutable Vault File Structure (stored on IPFS)**

> Canonical encoding: YAML 
Everything inside is read-only; mutable state lives on-chain.
> 

```yaml
# ────────────────────────────────────────────────────────────────
#  Immutable Vault file (YAML flavour)
#  Everything below is read-only once published to IPFS
# ────────────────────────────────────────────────────────────────
vault_id: "0xabcdef1234..."      # UID that matches the on-chain Plan/Vault
version: 1                       # schema version
created_at: 1716710400           # unix timestamp (seconds)
owner_pk: "0x…32bytes"           # Ed25519 master public key (PK_MASTER)
encrypted_data: "0x…32bytes"           # AES

program:                         # static description of the ticket bundle
  language: "lua54-bytecode"
  digest: "sha256:aa…ff"         # hash of the whole /program/ folder
  entrypoint: "ticket_000.luac"  # first step to execute

# ────────────────────────────────────────────────────────────────
#  FROST parameters
#  Only the quorum (threshold) is stored here — the **actual**
#  participant set is discovered *dynamically* at run-time via
#  the agent-mesh and therefore is NOT hard-coded in the vault.
# ────────────────────────────────────────────────────────────────
frost:
  threshold: 3                  # K: minimum number of signature shares required to aggregate a valid signature
  total_participants: 5        # N: total number of agents participating in the FROST round
  secret_share_path: "keys/share_1.pem"  # File path to this agent’s private FROST share
  group_public_key: "0xabc123..."        # Hex-encoded group public key for signature verification
  round_timeout_ms: 2000       # Optional: maximum time (in ms) to wait for partial shares from peers

# ────────────────────────────────────────────────────────────────
#  Signed tickets (one per execution step)
# ────────────────────────────────────────────────────────────────
tickets:
  - idx: 0
    hint_hash:  "0x1111…"        # 16-byte tag = Trunc128(SHA256(sig_master))
    byte_code:  "base64:AAA…="   # compiled Lua byte-code
    meta_enc:   "base64:BBB…="   # encrypted parameters for the Lua VM
    sig_master: "0xAAA…"         # Ed25519(PK_MASTER, hash(all-fields-above))
    expires:    1_900_000_000    # (optional) absolute timeout (unix secs)

  - idx: 1
    hint_hash:  "0x2222…"
    byte_code:  "base64:CCC…="
    meta_enc:   "base64:DDD…="
    sig_master: "0xBBB…"

  # … more steps …

# ────────────────────────────────────────────────────────────────
#  Optional 
# ────────────────────────────────────────────────────────────────
notes:
    sha3_256: "ee…"
    size: 12_455
```

---

---

### ✅ Example **`agent.yaml`**

```yaml
agent:
  agent_id: "agent-1"                   # Unique agent ID (e.g., I2P hash or custom string)
  instance_id: "vault-worker-01"       # Optional: human-readable instance label

network:
  transport_backend: "i2p"             # Options: "i2p", "tcp", "mock"
  i2p_sam_host: "127.0.0.1"            # I2P SAM bridge (Docker or native)
  i2p_sam_port: 7656
  tcp_port: 40101                      # Fallback localhost TCP port for testing
  allow_clearnet: false                # Force IPFS over I2P only
  enable_tor: false                    # Placeholder for future use

ipfs:
  cid_source: "file://cids.list"       # Source of new Vault CIDs (or "ipns://...")
  gateway: "http://127.0.0.1:8080"     # IPFS gateway over I2P or local daemon
  pin_cache_path: "./cache/ipfs"      # Optional: path for offline pinning
  verify_hash: true                   # Enable SHA-256 verification of downloaded Vaults

vault:
  max_vault_size_bytes: 10485760       # Max size (10MB) of extracted vault TAR
  manifest_filename: "vault.json"      # Manifest inside TAR for metadata
  ticket_filename: "ticket.luac"       # Compiled Lua bytecode
  ctx_includes:
    - chain_height
    - timestamp
    - vault_meta

lua:
  engine: "mlua"                       # Options: "mlua", "luajit" (if enabled)
  memory_limit_mib: 32
  timeout_ms: 500
  deny_libraries:
    - os
    - io
    - debug
    - package
  hash_chaining: true                  # Enable per-line hash chaining
  cbor_output: true                    # Enable CBOR-encoded output struct from ticket

frost:
  threshold: 3                         # K: number of required sig-shares
  total_participants: 5               # N: total number of agents
  peer_id: "agent-1"                   # Must match top-level `agent.peer_id`
  secret_share_path: "keys/share_1.pem"
  group_public_key: "0xaabbeedd..."    # Hex-encoded group pubkey
  round_timeout_ms: 2000

sui:
  enabled: true
  mode: "stub"                         # "stub" or "devnet"
  rpc_url: "https://fullnode.devnet.sui.io"
  dry_run: true                        # Only simulate PTB execution
  contract_address: "0x123456..."      # Placeholder; not validated yet

logging:
  level: info                          # One of: "error", "warn", "info", "debug", "trace"
  file: "logs/agent.log"
  stdout: true
  opentelemetry:
    enabled: false
    endpoint: "http://localhost:4317"

telemetry:
  trace_steps: true                    # Log execution trace from Lua ticket
  log_signature_rounds: true           # Log FROST signing steps
  include_result_hash: true            # Log SHA3-256 result hash for verification

storage:
  ledger_db: "storage/ledger.sqlite"
  working_dir: "storage/tmp"

dev:
  hot_reload: false                    # Reserved for future Lua update mechanism
  auto_reset: false                    # Reset local DB and config on boot (useful for CI)

```

---

---

## 🔐 **Hash-Chaining Execution Trace in Lua Bytecode**

### 🎯 Purpose

To guarantee that every step of a Lua ticket was executed **completely and honestly**, we generate a **cumulative execution hash** as the script runs.

This hash cannot be forged or reconstructed unless **every instruction or logical step is actually executed**.

---

## ⚙️ Step-by-Step Implementation

### **1. Initialize Execution Hash**

At the start of every Lua ticket, we initialize the hash:

```lua
local current_hash = sha3_256("ZUZ::execution_start")
```

---

### **2. Update Hash at Each Step**

During execution, we update the hash for each meaningful operation. For example:

```lua
local step_code = "check_balance:args=1000"
current_hash = sha3_256(current_hash .. step_code)

```

This can be done:

- **Manually**, by inserting code-line annotations at key logic points
- Or **automatically**, by wrapping Lua functions ~~or bytecode dispatch in Rust/host~~

---

### **3. Finalize Execution Hash**

At the end of execution:

```lua
local final_hash = sha3_256(current_hash .. "ZUZ::done")
-- Optional: sign the hash
local signature = sign_with_key(final_hash, private_key)
```

The `final_hash` becomes a **unique fingerprint** of the full execution path. It can be:

- Broadcast to other agents for FROST signing
- Included in the YAML output of the ticket
- Used later for verification

---

## ✅ What This Achieves

- If even one step is skipped, altered, or reordered — the `execution_hash` will not match
- If the Lua bytecode is tampered with, the final hash will be invalid
- Any party can **re-run the ticket in a sandbox** and verify that the same `execution_hash` is produced
- for debugging: **Trace logging→** Keep a list of hash contributions for debug/audit purposes

---

## 🧠 Where This Runs

- This logic is implemented **inside the Lua ticket itself**, or injected into it via the sandbox runtime
- In Rust, the `mlua` wrapper can:
    - Intercept key function calls,
    - Track hash updates at each step,
    - Return the `execution_hash` as part of the final result

---

## 🔧 Rust/WASM Version

If the Lua ticket is executed from Rust (as it is in this project), a typical hash chaining flow in Rust might look like:

```rust
let mut hash = sha3_256(b"ZUZ::execution_start");

for step in ticket_steps {
    hash = sha3_256(&[&hash, &step_bytes].concat());
}
let final_hash = sha3_256(&[&hash, b"ZUZ::done"].concat());

```

---

## 📦 Integration with FROST

The `execution_hash` becomes the **message** for FROST signing.

Only agents who reproduced the same result can contribute a valid signature share.