const DEFAULT_ATTEMPTS = 12;
const DEFAULT_DELAY_MS = 5_000;

export async function waitForPublishedPackage({
  name,
  version,
  npmTag,
  viewVersion,
  attempts = DEFAULT_ATTEMPTS,
  delayMs = DEFAULT_DELAY_MS,
  wait = delay,
}) {
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error('Publication verification attempts must be a positive integer.');
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('Publication verification delay must be a non-negative number.');
  }

  let publishedVersion;
  let taggedVersion;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    publishedVersion = viewVersion(`${name}@${version}`);
    taggedVersion = viewVersion(`${name}@${npmTag}`);

    if (publishedVersion === version && taggedVersion === version) {
      return {
        verified: true,
        attempts: attempt,
        publishedVersion,
        taggedVersion,
      };
    }

    if (attempt < attempts) await wait(delayMs);
  }

  return {
    verified: false,
    attempts,
    publishedVersion,
    taggedVersion,
  };
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, milliseconds);
  });
}
