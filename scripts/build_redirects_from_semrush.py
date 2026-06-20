#!/usr/bin/env python3
"""
Build Netraverse redirect candidates from a Semrush Backlink Analytics export.

Usage:
  python3 scripts/build_redirects_from_semrush.py semrush-backlinks.csv \
    --domain netraverse.com \
    --out-dir redirects/generated

Expected Semrush export columns vary by report. This script accepts common names:
  - Target URL / Target url / target_url / target / URL
  - Source URL / Source url / Referring Page URL / source_url
  - Authority Score / AS / Page AS / Domain AS
  - Backlinks / External Links / link_count

It keeps only targets on the requested domain, maps known legacy NeTraverse and
Win4Lin URLs to the current /win4lin/ pages, and leaves unknown paths marked for
manual review. Do not redirect unknown URLs to the homepage without review.
"""

from __future__ import annotations

import argparse
import csv
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional
from urllib.parse import unquote, urlparse


@dataclass(frozen=True)
class RedirectCandidate:
    source_path: str
    destination_path: str
    status: int
    match_type: str
    confidence: str
    source_url: str
    target_url: str
    authority_score: str
    backlinks: str
    reason: str


def pick(row: Dict[str, str], names: Iterable[str]) -> str:
    lower_map = {k.strip().lower(): v for k, v in row.items()}
    for name in names:
        value = lower_map.get(name.strip().lower())
        if value is not None:
            return value.strip()
    return ""


def normalize_path(raw_url: str, domain: str) -> Optional[str]:
    if not raw_url:
        return None

    raw_url = raw_url.strip()
    if raw_url.startswith("//"):
        raw_url = f"https:{raw_url}"

    if raw_url.startswith("/"):
        path = raw_url
    else:
        parsed = urlparse(raw_url)
        host = parsed.netloc.lower().split(":")[0]
        canonical_domain = domain.lower().lstrip("www.")
        if not host:
            return None
        if host not in {canonical_domain, f"www.{canonical_domain}"}:
            return None
        path = parsed.path or "/"

    path = unquote(path)
    path = re.sub(r"/{2,}", "/", path)
    return path or "/"


def classify_destination(path: str) -> tuple[str, str, str]:
    p = path.lower()

    exact_map = {
        "/products/index.php": ("/win4lin/", "high", "Old product index"),
        "/products/win4lin/index.php": ("/win4lin/", "high", "Old Win4Lin product index"),
        "/products/win4lin30": ("/win4lin/3-0/", "medium", "Old Win4Lin 3.0 product page"),
        "/products/win4lin30/": ("/win4lin/3-0/", "high", "Old Win4Lin 3.0 product page"),
        "/products/win4lin30/index.php": ("/win4lin/3-0/", "high", "Old Win4Lin 3.0 product index"),
        "/products/win4lin40": ("/win4lin/4-0/", "high", "Old Win4Lin 4.0 product page"),
        "/products/win4lin40/": ("/win4lin/4-0/", "high", "Old Win4Lin 4.0 product page"),
        "/products/win4lin40/index.php": ("/win4lin/4-0/", "high", "Old Win4Lin 4.0 product index"),
        "/products/win4lin40/benefits.php": ("/win4lin/4-0/benefits/", "high", "Old Win4Lin 4.0 benefits page"),
        "/products/win4lin40/features.php": ("/win4lin/4-0/features/", "high", "Old Win4Lin 4.0 features page"),
        "/products/win4lin40/requirements.php": ("/win4lin/4-0/requirements/", "high", "Old Win4Lin 4.0 requirements page"),
        "/products/win4lin50": ("/win4lin/5-0/", "high", "Old Win4Lin 5.0 product page"),
        "/products/win4lin50/": ("/win4lin/5-0/", "high", "Old Win4Lin 5.0 product page"),
        "/products/win4lin50/index.php": ("/win4lin/5-0/", "high", "Old Win4Lin 5.0 product index"),
        "/products/win4lin50/requirements.php": ("/win4lin/5-0/requirements/", "high", "Old Win4Lin 5.0 requirements page"),
        "/products/wts": ("/win4lin/terminal-server/", "high", "Old Win4Lin Terminal Server product page"),
        "/products/wts/": ("/win4lin/terminal-server/", "high", "Old Win4Lin Terminal Server product page"),
        "/products/wts/benefits.php": ("/win4lin/terminal-server/benefits/", "high", "Old Terminal Server benefits page"),
        "/products/wts/features.php": ("/win4lin/terminal-server/features/", "high", "Old Terminal Server features page"),
        "/products/wts/requirements.php": ("/win4lin/terminal-server/requirements/", "high", "Old Terminal Server requirements page"),
        "/products/wts/technology.php": ("/win4lin/terminal-server/technology/", "high", "Old Terminal Server technology page"),
        "/support/docs/win4lin-whitepapers.php": ("/win4lin/whitepapers/", "high", "Old Win4Lin whitepapers URL"),
        "/support/docs/win4lin-whitepapers": ("/win4lin/whitepapers/", "high", "Old Win4Lin whitepapers URL"),
        "/support/docs/win4lin-50-relnote.html": ("/win4lin/5-0/release-notes/", "high", "Old Win4Lin 5.0 release notes URL"),
        "/support/docs/400_relnotes.html": ("/win4lin/4-0/release-notes/", "high", "Old Win4Lin 4.0 release notes URL"),
        "/support/win4lin/downloads/kernel_patch/updates.php": ("/win4lin/kernel-patches/", "high", "Old kernel patch updates URL"),
        "/member/downloads": ("/win4lin/kernel-patches/", "medium", "Old member downloads URL"),
        "/support/docs": ("/win4lin/whitepapers/", "medium", "Old documentation URL"),
        "/support/docs/": ("/win4lin/whitepapers/", "medium", "Old documentation URL"),
        "/support": ("/win4lin/", "medium", "Old support URL"),
        "/support/": ("/win4lin/", "medium", "Old support URL"),
        "/lists/": ("/win4lin/", "medium", "Old mailing-list archive URL"),
        "/win4lin40": ("/win4lin/4-0/", "medium", "Common old short Win4Lin 4.0 URL"),
        "/win4lin5": ("/win4lin/5-0/", "medium", "Common old short Win4Lin 5.0 URL"),
    }

    if p in exact_map:
        return exact_map[p]
    if p.startswith("/products/win4lin30/"):
        return "/win4lin/3-0/", "medium", "Old Win4Lin 3.0 product URL"
    if p.startswith("/products/win4lin40/") or p.startswith("/win4lin40/"):
        return "/win4lin/4-0/", "medium", "Old Win4Lin 4.0 product URL"
    if p.startswith("/products/win4lin50/") or p.startswith("/win4lin5/"):
        return "/win4lin/5-0/", "medium", "Old Win4Lin 5.0 product URL"
    if p.startswith("/products/wts/"):
        return "/win4lin/terminal-server/", "medium", "Old Win4Lin Terminal Server URL"
    if p.startswith("/support/docs/"):
        return "/win4lin/whitepapers/", "medium", "Old documentation URL"
    if p.startswith("/member/downloads/"):
        return "/win4lin/kernel-patches/", "medium", "Old member downloads URL"
    if p.startswith("/support/"):
        return "/win4lin/", "medium", "Old support URL"
    if p.startswith(("/download", "/downloads", "/store", "/cart", "/buy")):
        return "/win4lin/", "medium", "Old download or commercial intent"
    if p.startswith("/lists/"):
        return "/win4lin/", "medium", "Old mailing-list archive URL"
    if "terminal" in p or "wts" in p:
        return "/win4lin/terminal-server/", "medium", "Contains terminal-server legacy keyword"
    if "win4lin" in p:
        return "/win4lin/", "medium", "Contains Win4Lin legacy keyword"
    if any(token in p for token in ["linux", "windows", "virtual", "emulat", "qemu", "vm"]):
        return "/content/run-windows-apps-on-linux/", "medium", "Legacy virtualization intent"
    if p in {"/", ""}:
        return "/", "low", "Root URL"

    return "REVIEW_MANUALLY", "review", "Unknown path; review manually before redirecting"


def read_candidates(input_csv: Path, domain: str) -> List[RedirectCandidate]:
    candidates: Dict[str, RedirectCandidate] = {}
    with input_csv.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise SystemExit("Input CSV has no header row.")

        for row in reader:
            target_url = pick(row, ["Target URL", "Target url", "target_url", "target", "URL", "Url"])
            source_url = pick(row, ["Source URL", "Source url", "source_url", "Referring Page URL", "Referring page URL", "Referring Page", "Source page"])
            authority_score = pick(row, ["Authority Score", "AS", "Page AS", "Domain AS", "Authority"])
            backlinks = pick(row, ["Backlinks", "External Links", "External links", "link_count", "Links"])

            path = normalize_path(target_url, domain)
            if not path:
                continue

            destination, confidence, reason = classify_destination(path)
            existing = candidates.get(path)
            if existing and (existing.authority_score or not authority_score):
                continue

            candidates[path] = RedirectCandidate(
                source_path=path,
                destination_path=destination,
                status=301,
                match_type="exact",
                confidence=confidence,
                source_url=source_url,
                target_url=target_url,
                authority_score=authority_score,
                backlinks=backlinks,
                reason=reason,
            )

    return sorted(candidates.values(), key=lambda c: (c.confidence == "review", c.confidence != "high", c.source_path))


def write_csv(candidates: List[RedirectCandidate], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "source_path",
        "destination_path",
        "status",
        "match_type",
        "confidence",
        "authority_score",
        "backlinks",
        "target_url",
        "source_url",
        "reason",
    ]
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for candidate in candidates:
            writer.writerow({field: getattr(candidate, field) for field in fields})


def write_cloudflare(candidates: List[RedirectCandidate], out_path: Path) -> None:
    lines = [
        "# Generated from Semrush backlink export. Review before merging into public/_redirects.",
        "# Cloudflare Pages _redirects format.",
        "",
    ]
    for candidate in candidates:
        if candidate.destination_path == "REVIEW_MANUALLY":
            lines.append(f"# REVIEW {candidate.source_path} -> ?  # {candidate.reason}")
            continue
        lines.append(f"{candidate.source_path:<56} {candidate.destination_path:<48} {candidate.status}")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_nginx(candidates: List[RedirectCandidate], out_path: Path) -> None:
    lines = [
        "# Generated from Semrush backlink export. Review before deploy.",
        "# Place inside the Nginx server block, before the app catch-all.",
        "",
    ]
    for candidate in candidates:
        if candidate.destination_path == "REVIEW_MANUALLY":
            lines.append(f"# REVIEW {candidate.source_path} -> ?  # {candidate.reason}")
            continue
        source = candidate.source_path.replace("'", "%27")
        destination = candidate.destination_path.replace("'", "%27")
        lines.append(f"location = {source} {{ return 301 {destination}; }}  # {candidate.confidence}: {candidate.reason}")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_apache(candidates: List[RedirectCandidate], out_path: Path) -> None:
    lines = [
        "# Generated from Semrush backlink export. Review before deploy.",
        "RewriteEngine On",
        "",
    ]
    for candidate in candidates:
        if candidate.destination_path == "REVIEW_MANUALLY":
            lines.append(f"# REVIEW {candidate.source_path} -> ?  # {candidate.reason}")
            continue
        source_pattern = re.escape(candidate.source_path)
        lines.append(f"RedirectMatch 301 ^{source_pattern}$ {candidate.destination_path}  # {candidate.confidence}: {candidate.reason}")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("--domain", default="netraverse.com")
    parser.add_argument("--out-dir", type=Path, default=Path("redirects/generated"))
    args = parser.parse_args()

    candidates = read_candidates(args.input_csv, args.domain)
    args.out_dir.mkdir(parents=True, exist_ok=True)
    write_csv(candidates, args.out_dir / "redirect-map.enriched.csv")
    write_cloudflare(candidates, args.out_dir / "cloudflare-generated-redirects.txt")
    write_nginx(candidates, args.out_dir / "nginx-generated-redirects.conf")
    write_apache(candidates, args.out_dir / "apache-generated-redirects.txt")

    review_count = sum(1 for candidate in candidates if candidate.destination_path == "REVIEW_MANUALLY")
    print(f"Generated {len(candidates)} redirect candidates. Manual review needed: {review_count}")
    print(f"Output directory: {args.out_dir}")


if __name__ == "__main__":
    main()
