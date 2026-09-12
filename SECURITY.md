# Security boundaries

The browser never requests or stores private keys. Kondor signs chain transactions. Deployment and CLI keys are read only from local environment variables; never commit them or enter them in Hostinger settings.

Contracts check account authority, initialize once, and bound action frequency and per-action work. A freeze requires the actual upload-authorization flag at deployment; the UI configuration label is not proof. The independent reward contract verifies core participation and holds no token treasury.

Custom character manifests provide an HTTPS image; they cannot inject JavaScript or CSS into this client. External image hosts can still see image requests. Resource limits are not proof of unique human identity. Gameplay is deterministic and has no trusted randomness oracle.

This release has not received an independent security audit or live-chain validation. Review docs/RELEASE_STATUS.md before an irreversible deployment. Report sensitive vulnerabilities privately through an established maintainer contact rather than including exploit details or secrets in a public issue.
