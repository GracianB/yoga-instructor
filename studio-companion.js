/* D19 Dragon Companion · reuse the D17 SVG, never invent a second skeleton.
   Two pre-authored poses (breath, centering) and one shared quiet rendering clock. */
(() => {
  "use strict";
  const studio = document.querySelector("#studio-guided");
  const host = document.querySelector("#instructor-flow");
  const guide = document.querySelector("#flow-guide");
  const source = guide?.querySelector("svg.yy-svg");
  const orb = studio?.querySelector(".studio-breath-orb");
  if (!studio || !host || !guide || !source || !orb) return;

  const mount = document.createElement("div");
  mount.className = "studio-companion yy-guide";
  mount.dataset.status = "idle";
  mount.dataset.ready = "true";
  mount.dataset.asanaState = "idle";
  mount.dataset.spirit = guide.dataset.spirit === "yin" ? "yin" : "yang";
  mount.setAttribute("aria-hidden", "true");

  // Clone a single source of truth. Keep the D17 musculature, horn, wings and
  // closed eyes, but exclude eight hidden SVG poses to reduce memory overhead.
  const svg = source.cloneNode(true);
  for (const pose of svg.querySelectorAll(".yy-pose")) {
    if (!["breath", "centering"].includes(pose.dataset.pose)) {
      pose.remove();
    } else {
      pose.classList.remove("is-current", "is-entering", "is-leaving");
    }
  }

  // SVG gradient IDs are document-wide. Rebase all definitions and references
  // to prevent the studio figure using another SVG's stale gradients.
  const refs = new Map();
  for (const node of svg.querySelectorAll("[id]")) {
    const previous = node.id;
    const unique = "studio-" + previous;
    refs.set(previous, unique);
    node.id = unique;
  }
  for (const node of svg.querySelectorAll("*")) {
    for (const attr of [...node.attributes]) {
      if (attr.name === "id") continue;
      let value = attr.value.replace(/url\(#([^)]+)\)/g,
        (whole, id) => refs.has(id) ? "url(#" + refs.get(id) + ")" : whole);
      if ((attr.name === "href" || attr.name === "xlink:href") && value.startsWith("#")) {
        const target = value.slice(1);
        if (refs.has(target)) value = "#" + refs.get(target);
      }
      if (value !== attr.value) node.setAttribute(attr.name, value);
    }
  }
  svg.setAttribute("role", "presentation");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("viewBox", "98 0 530 445");
  mount.appendChild(svg);
  orb.insertAdjacentElement("afterend", mount);

  const selectPose = (id) => {
    for (const pose of svg.querySelectorAll(".yy-pose")) {
      const selected = pose.dataset.pose === id;
      pose.classList.toggle("is-current", selected);
      pose.classList.remove("is-entering", "is-leaving");
    }
    mount.dataset.phase = id;
  };
  const sync = () => {
    const mode = host.dataset.studioMode || "asanas";
    const showing = mode === "breath" || mode === "meditation";
    mount.hidden = !showing;
    if (!showing) return;
    selectPose(mode === "breath" ? "breath" : "centering");
    studio.dataset.studioActive = mode;
    mount.dataset.spirit = guide.dataset.spirit === "yin" ? "yin" : "yang";
    mount.dataset.status = studio.dataset.studioStatus || "idle";
    mount.dataset.asanaState = studio.dataset.studioStatus || "idle";
  };
  new MutationObserver(sync).observe(host, {attributes:true,attributeFilter:["data-studio-mode"]});
  new MutationObserver(sync).observe(guide, {attributes:true,attributeFilter:["data-spirit"]});
  new MutationObserver(sync).observe(studio, {attributes:true,attributeFilter:["data-studio-status"]});
  sync();
})();
