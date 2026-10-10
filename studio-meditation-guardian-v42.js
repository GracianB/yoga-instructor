/* V42 · UMA, lunar moth guardian of Meditation.
 * Separate from Nila (Movement) and the seated Breathing dragon.
 * Static independent vector geometry, no new clock or speech. */
(() => {
 "use strict";
 const host=document.getElementById("instructor-flow");
 const studio=document.getElementById("studio-guided");
 const mount=studio?.querySelector(".studio-companion");
 if(!host||!studio||!mount||mount.querySelector(".meditation-guardian"))return;
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.classList.add("meditation-guardian");
 svg.setAttribute("viewBox","75 20 410 355");
 svg.setAttribute("preserveAspectRatio","xMidYMid meet");
 svg.setAttribute("role","presentation");
 svg.setAttribute("aria-hidden","true");
 svg.setAttribute("focusable","false");
 svg.innerHTML=String.raw`
 <defs>
  <linearGradient id="uma-body" x1="0" y1="0" x2=".9" y2="1">
   <stop stop-color="#d5d1e9"/><stop offset=".55" stop-color="#a99fca"/><stop offset="1" stop-color="#716eab"/>
  </linearGradient>
  <linearGradient id="uma-wing" x1="0" y1="0" x2="1" y2="1">
   <stop stop-color="#a0b6c1"/><stop offset=".55" stop-color="#7b92ac"/><stop offset="1" stop-color="#6b6a9a"/>
  </linearGradient>
  <radialGradient id="uma-moon"><stop stop-color="#fffae4" stop-opacity=".93"/><stop offset=".35" stop-color="#d5e1df" stop-opacity=".31"/><stop offset="1" stop-color="#d1e0de" stop-opacity="0"/></radialGradient>
 </defs>
 <ellipse cx="280" cy="210" rx="217" ry="170" fill="url(#uma-moon)" class="uma-moon"/>
 <ellipse cx="280" cy="352" rx="159" ry="14" fill="#4f5368" opacity=".13"/>
 <!-- Long antennae: recognizable moth silhouette, nothing like a horned dragon -->
 <g class="uma-antennae" stroke="#8179a3" stroke-width="6" stroke-linecap="round" fill="none">
   <path d="M259 118 Q228 79 228 40 M301 118 Q332 79 332 40"/>
 </g>
 <circle cx="226" cy="40" r="8" fill="#e6d9b4"/><circle cx="334" cy="40" r="8" fill="#e6d9b4"/>
 <!-- Large folded wings become a calm mantle -->
 <path class="uma-wing-left" d="M238 151 C190 124 152 147 114 109 Q117 166 151 202 Q108 219 115 275 C143 264 165 283 181 325 Q218 311 248 285Z" fill="url(#uma-wing)" stroke="#6a7794" stroke-width="3"/>
 <path class="uma-wing-right" d="M322 151 C370 124 408 147 446 109 Q443 166 409 202 Q452 219 445 275 C417 264 395 283 379 325 Q342 311 312 285Z" fill="url(#uma-wing)" stroke="#6a7794" stroke-width="3"/>
 <path d="M229 181Q176 173 137 140 M203 239Q156 234 129 252 M331 181Q384 173 423 140 M357 239Q404 234 431 252" fill="none" stroke="#e6ebda" stroke-opacity=".65" stroke-width="4" stroke-linecap="round"/>
 <!-- Paired knees are connected under the rounded torso -->
 <path d="M250 284Q204 271 175 307Q157 338 189 345Q240 359 274 321Z M310 284Q356 271 385 307Q403 338 371 345Q320 359 286 321Z" fill="url(#uma-body)" stroke="#7774a6" stroke-width="3"/>
 <!-- Torso, no independent rectangular neck -->
 <path class="uma-body" d="M280 159 C238 159 209 194 208 245 Q200 294 231 323 Q245 340 280 341 Q315 340 329 323 Q360 294 352 245 C351 194 322 159 280 159Z" fill="url(#uma-body)" stroke="#6c6b9e" stroke-width="4" stroke-linejoin="round"/>
 <path d="M254 208Q279 197 305 208 M242 258Q280 283 318 258" fill="none" stroke="#e8e4ee" stroke-width="6" stroke-opacity=".48" stroke-linecap="round"/>
 <!-- Arms rest on knees, not floating away from the torso -->
 <path d="M216 219 C191 256 208 302 240 309 Q253 315 262 300" fill="none" stroke="#9692bd" stroke-width="33" stroke-linecap="round"/>
 <path d="M344 219 C369 256 352 302 320 309 Q307 315 298 300" fill="none" stroke="#9692bd" stroke-width="33" stroke-linecap="round"/>
 <path d="M236 303Q246 312 258 302 M302 302Q315 312 324 303" fill="none" stroke="#eee7e2" stroke-opacity=".72" stroke-width="4" stroke-linecap="round"/>
 <!-- Moth head with leaf-shaped cheeks and soft closed eyes -->
 <path class="uma-head" d="M280 105 C236 105 209 132 210 168 Q207 202 231 220 Q245 235 280 235 Q315 235 329 220 Q353 202 350 168 C351 132 324 105 280 105Z" fill="url(#uma-body)" stroke="#66658f" stroke-width="4"/>
 <path d="M233 152 Q254 171 267 151 M293 151 Q306 171 327 152" fill="none" stroke="#4c4e79" stroke-width="5" stroke-linecap="round"/>
 <path d="M265 194Q280 201 295 194" fill="none" stroke="#595879" stroke-width="3" stroke-linecap="round"/>
 <path d="M269 178 Q280 174 291 178 Q282 188 278 188Z" fill="#f5dfb4"/>
 <path d="M226 181Q240 190 247 181 M313 181Q327 190 337 181" stroke="#ecc2ca" stroke-width="5" opacity=".55" fill="none" stroke-linecap="round"/>
 <path d="M248 125Q278 111 305 128" fill="none" stroke="#f0e5e8" stroke-opacity=".65" stroke-width="6" stroke-linecap="round"/>
 <!-- An inward-facing crescent is her meditative symbol -->
 <path d="M277 267 A21 21 0 1 0 297 287 A17 17 0 1 1 277 267Z" fill="#faf0ce"/>
 <path d="M235 336Q282 344 325 336" fill="none" stroke="#d8cded" stroke-width="3" stroke-linecap="round"/>
 `;
 mount.appendChild(svg);
 host.dataset.meditationGuardian="uma";
})();
