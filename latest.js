// The button always follows the newest GitHub release. A new tag does not
// need a change to this page. Opening the page does not start the download.
const RELEASES = "https://api.github.com/repos/csy20/02_OS/releases/latest";

function isoName(parts) {
  const first = parts[0]?.name ?? "";
  return first.replace(/\.part[a-z]+$/, "");
}

async function showLatest() {
  const button = document.querySelector("#download");
  const status = document.querySelector("#release-status");
  const join = document.querySelector("#join");
  const files = document.querySelector("#files");
  try {
    const response = await fetch(RELEASES);
    if (!response.ok) throw new Error(String(response.status));
    const release = await response.json();
    const assets = release.assets ?? [];
    const whole = assets.find((asset) => asset.name.endsWith(".iso"));
    const parts = assets
      .filter((asset) => /\.iso\.part/.test(asset.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    const tag = release.tag_name || "the latest release";
    button.textContent = `Download ${tag}`;
    button.href = whole?.browser_download_url || release.html_url;
    status.textContent = whole
      ? `${tag} is the latest image. The button downloads that file.`
      : `${tag} is the latest image. The button opens that release. The image is split, so download every part before you join them.`;

    if (parts.length) {
      const name = isoName(parts);
      join.textContent = `cat ${name}.part* > ${name}\nsha256sum -c 02_OS.sha256`;
    } else if (whole) {
      join.textContent = `sha256sum -c 02_OS.sha256`;
    }

    files.replaceChildren();
    for (const asset of assets) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = asset.browser_download_url;
      link.textContent = asset.name;
      item.append(link);
      files.append(item);
    }
  } catch {
    status.textContent = "The latest release could not be read just now. The button still opens the newest GitHub release.";
  }
}

showLatest();
