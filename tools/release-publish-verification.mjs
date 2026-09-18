const DEFAULT_ATTEMPTS = 61;
const DEFAULT_DELAY_MS = 5_000;

export async function waitForPublishedPackages({
  names,
  version,
  npmTag,
  viewVersion,
  attempts = DEFAULT_ATTEMPTS,
  delayMs = DEFAULT_DELAY_MS,
  wait = delay,
}) {
  if (!Array.isArray(names) || names.length === 0 || names.some((name) => !name)) {
    throw new Error('Publication verification requires at least one package name.');
  }
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error('Publication verification attempts must be a positive integer.');
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('Publication verification delay must be a non-negative number.');
  }

  let packages = [];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    packages = names.map((name) => {
      const publishedVersion = viewVersion(`${name}@${version}`);
      const taggedVersion = viewVersion(`${name}@${npmTag}`);
      return {
        name,
        verified: publishedVersion === version && taggedVersion === version,
        publishedVersion,
        taggedVersion,
      };
    });

    if (packages.every((package_) => package_.verified)) {
      return {
        verified: true,
        attempts: attempt,
        packages,
      };
    }

    if (attempt < attempts) await wait(delayMs);
  }

  return {
    verified: false,
    attempts,
    packages,
  };
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, milliseconds);
  });
}
