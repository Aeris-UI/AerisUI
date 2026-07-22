# Aeris UI Security

## Supported versions

Aeris UI `22.0.0-alpha.0` is an evaluation prerelease and does not carry a production support
commitment. Stable release lines and end-of-support dates will be listed here when applicable.

## Reporting a vulnerability

Please report suspected vulnerabilities privately through the repository's GitHub security
advisory flow. Include the affected component and version, a minimal reproduction, the expected
impact, and any relevant browser or operating-system details. Do not open a public issue before a
fix is available.

Do not include real credentials, personal data, or production application data in a report. A
maintainer will acknowledge the report, assess scope and severity, coordinate a fix, and agree on
disclosure timing with the reporter. Response and remediation times depend on impact and project
availability; the project does not promise a fixed service-level agreement.

## Security model

- Aeris relies on Angular's contextual escaping and sanitization for template text, attributes,
  URLs, and styles. The library does not use `bypassSecurityTrust*` APIs.
- Editor HTML is sanitized before supported rich-text nodes are imported. Applications must still
  validate and sanitize rich text again when it crosses a server or storage boundary.
- Menu URLs use Angular URL sanitization. Links opening a new browsing context receive
  `noopener noreferrer` by default when no explicit `rel` value is supplied.
- Table CSV exports quote every field, neutralize spreadsheet formula prefixes, constrain custom
  separators, and sanitize download filenames.
- FileUpload previews are opt-in, restricted to allowlisted raster image MIME types, capped at
  10 MB by default, and backed by object URLs that are revoked when no longer needed.

## Consumer responsibilities

Client-side checks cannot establish trust. Applications are responsible for authorization,
server-side validation, safe persistence, output encoding outside Angular templates, and secure
transport. In particular, file type and size must be verified from file content on the server;
the browser-provided filename and MIME type are not trustworthy.

Use Angular's recommended Content Security Policy and Trusted Types configuration as defense in
depth. Keep Angular and Aeris patched, and review application-specific templates and callbacks as
trusted executable code rather than user data.
