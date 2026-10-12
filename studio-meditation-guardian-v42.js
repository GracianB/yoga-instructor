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
 <path class="uma-wing-left" d="M238 151 C195 127 152 144 112 105 C116 160 136 183 151 198 C113 215 105 243 116 277 C150 261 167 283 181 325 Q220 307 248 285Z" fill="url(#uma-wing)" stroke="#6a7794" stroke-width="3"/>
 <path class="uma-wing-right" d="M322 151 C365 127 408 144 448 105 C444 160 424 183 409 198 C447 215 455 243 444 277 C410 261 393 283 379 325 Q340 307 312 285Z" fill="url(#uma-wing)" stroke="#6a7794" stroke-width="3"/>
 <path d="M229 181Q176 173 137 140 M203 239Q156 234 129 252 M331 181Q384 173 423 140 M357 239Q404 234 431 252" fill="none" stroke="#e6ebda" stroke-opacity=".65" stroke-width="4" stroke-linecap="round"/>
 <path class="uma-lunar-thread" d="M185 211Q165 195 147 180 M375 211Q397 192 417 178 M178 267Q160 265 150 258 M382 267Q400 265 410 258"/>
 <!-- Paired knees are connected under the rounded torso -->
 <path d="M250 284Q204 271 175 307Q157 338 189 345Q240 359 274 321Z M310 284Q356 271 385 307Q403 338 371 345Q320 359 286 321Z" fill="url(#uma-body)" stroke="#7774a6" stroke-width="3"/>
 <!-- V102: uninterrupted pelvic bridge between both seated knees. -->
 <path class="uma-v102-pelvis" d="M234 298Q248 271 280 275Q313 271 326 298Q333 322 302 337Q280 347 257 337Q226 322 234 298Z"/>
 <!-- Torso, no independent rectangular neck -->
 <path class="uma-body" d="M280 159 C238 159 209 194 208 245 Q200 294 231 323 Q245 340 280 341 Q315 340 329 323 Q360 294 352 245 C351 194 322 159 280 159Z" fill="url(#uma-body)" stroke="#6c6b9e" stroke-width="4" stroke-linejoin="round"/>
 <path d="M254 208Q279 197 305 208 M242 258Q280 283 318 258" fill="none" stroke="#e8e4ee" stroke-width="6" stroke-opacity=".48" stroke-linecap="round"/>
 <!-- Axillary gussets remain attached when the mantle and arms overlap. -->
 <path class="uma-v102-axilla" d="M211 218Q217 190 241 198Q257 210 251 231L233 251Q212 251 211 218Z"/>
 <path class="uma-v102-axilla" d="M349 218Q343 190 319 198Q303 210 309 231L327 251Q348 251 349 218Z"/>
 <!-- Arms rest on knees, not floating away from the torso -->
 <path class="uma-arm-left" d="M222 213 C203 223 193 255 204 280 C209 300 222 312 242 313 Q253 315 266 303 L263 291 Q248 291 237 290 C224 278 225 253 241 229Z" fill="url(#uma-body)" stroke="#7676a5" stroke-width="2.8" stroke-linejoin="round"/>
 <path class="uma-arm-right" d="M338 213 C357 223 367 255 356 280 C351 300 338 312 318 313 Q307 315 294 303 L297 291 Q312 291 323 290 C336 278 335 253 319 229Z" fill="url(#uma-body)" stroke="#7676a5" stroke-width="2.8" stroke-linejoin="round"/>
 <path class="uma-palms" d="M236 303Q246 312 258 302 M302 302Q315 312 324 303" fill="none" stroke="#eee7e2" stroke-opacity=".72" stroke-width="4" stroke-linecap="round"/>
 <path class="uma-wrist-light" d="M211 266Q209 288 231 300 M349 266Q351 288 329 300" fill="none" stroke="#ebe2f3" stroke-width="3" stroke-opacity=".4" stroke-linecap="round"/>
 <!-- Moth head with leaf-shaped cheeks and soft closed eyes -->
 <path class="uma-head" d="M280 105 C235 105 206 132 211 165 C205 181 214 210 233 222 Q250 237 280 236 Q310 237 327 222 C346 210 355 181 349 165 C354 132 325 105 280 105Z" fill="url(#uma-body)" stroke="#66658f" stroke-width="4"/>
 <!-- V91: awakening is a stage change, never an independent idle animation. -->
 <g class="uma-open-eyes" opacity="0">
   <path d="M237 156 Q252 145 268 156 M292 156 Q307 145 323 156" fill="none" stroke="#4c4e79" stroke-width="4" stroke-linecap="round"/>
   <ellipse cx="253" cy="153" rx="4.5" ry="6" fill="#4c4e79"/>
   <ellipse cx="307" cy="153" rx="4.5" ry="6" fill="#4c4e79"/>
   <circle cx="255" cy="151" r="1.5" fill="#faf7ec"/>
   <circle cx="309" cy="151" r="1.5" fill="#faf7ec"/>
 </g>
 <g class="uma-focus-sparks" opacity="0" fill="none" stroke="#e6d4a3" stroke-linecap="round" stroke-width="2">
   <path d="M281 63V77 M274 70H288 M185 119V130 M179 124H191 M375 119V130 M369 124H381"/>
 </g>
 <path class="uma-closed-eyes uma-eye-lines" d="M237 153 Q254 165 268 152 M292 152 Q306 165 323 153" fill="none" stroke="#4c4e79" stroke-width="4.6" stroke-linecap="round"/>
 <path d="M265 194Q280 201 295 194" fill="none" stroke="#595879" stroke-width="3" stroke-linecap="round"/>
 <path class="uma-nose-line" d="M271 183 Q280 187 289 183" fill="none" stroke="#766b94" stroke-opacity=".58" stroke-width="2.6" stroke-linecap="round"/>
 <path d="M226 181Q240 190 247 181 M313 181Q327 190 337 181" stroke="#ecc2ca" stroke-width="5" opacity=".55" fill="none" stroke-linecap="round"/>
 <path class="uma-brow-light" d="M251 126Q278 117 303 127" fill="none" stroke="#f0e5e8" stroke-opacity=".32" stroke-width="3.5" stroke-linecap="round"/>
 <path class="uma-breath-crest" d="M256 238Q280 229 304 238" stroke="#ece5ff" stroke-opacity=".43"
  stroke-width="3.1" fill="none" stroke-linecap="round"/>
 <!-- V102: Uma's tiny, pleasantly drowsy firefly and living lotus.
      They use the EXISTING session clock via CSS custom properties. -->
 <g class="uma-v102-firefly" aria-hidden="true">
  <ellipse cx="392" cy="101" rx="12" ry="9" fill="#fff6d8" opacity=".92"/>
  <path d="M381 96Q372 83 380 80Q389 85 390 96M394 96Q404 82 411 85Q415 94 402 100" fill="#e2d6f3" stroke="#a08bb6" stroke-width="1.8"/>
  <path d="M387 101Q390 104 393 101M397 101Q400 104 403 101" fill="none" stroke="#6b5b80" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M393 108Q398 112 401 108" fill="none" stroke="#a78bad" stroke-width="1.3" stroke-linecap="round"/>
  <circle cx="378" cy="108" r="3" fill="#ffecb3" opacity=".8"/>
 </g>
 <g class="uma-v102-orbit-star" aria-hidden="true" fill="none" stroke="#e4cb8d" stroke-width="2.8" stroke-linecap="round">
  <path d="M165 95V117M154 106H176M173 77V87M168 82H178"/>
 </g>
 <g class="uma-v102-lotus" aria-hidden="true">
  <path d="M140 155Q128 136 141 116Q155 132 156 149Q164 127 178 125Q182 144 160 156Q151 163 140 155Z" fill="#e4c8e4" stroke="#a681b3" stroke-width="2"/>
  <path d="M145 153Q141 135 155 119Q166 138 155 156Z" fill="#ffedda"/>
  <path d="M126 157Q149 171 176 156" fill="none" stroke="#a681b3" stroke-width="2.2" stroke-linecap="round"/>
 </g>
 <!-- An inward-facing crescent is her meditative symbol -->
 <path d="M277 267 A21 21 0 1 0 297 287 A17 17 0 1 1 277 267Z" fill="#faf0ce"/>
 <path d="M235 336Q282 344 325 336" fill="none" stroke="#d8cded" stroke-width="3" stroke-linecap="round"/>
 `;
 mount.appendChild(svg);
 host.dataset.meditationGuardian="uma";
})();
