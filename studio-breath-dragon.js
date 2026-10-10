/* V31 / Breathe: a bespoke seated guardian, not a clipped copy of an asana pose.
   Static SVG geometry, one clock from practice-studio.js, no rAF or extra timers. */
(() => {
 "use strict";
 const root=document.querySelector("#instructor-flow");
 const mount=root?.querySelector(".studio-companion");
 const studio=root?.querySelector("#studio-guided");
 if(!mount||!studio)return;
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.classList.add("studio-breath-dragon");
 svg.setAttribute("viewBox","65 18 430 360");
 svg.setAttribute("preserveAspectRatio","xMidYMid meet");
 svg.setAttribute("aria-hidden","true");
 svg.setAttribute("focusable","false");
 svg.setAttribute("role","presentation");
 svg.innerHTML=`<defs>
 <linearGradient id="sd31-body" x1=".16" y1="0" x2=".86" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="var(--dragon-light,#bedac5)"/><stop offset=".5" stop-color="var(--dragon-mid,#83ad9e)"/><stop offset="1" stop-color="var(--dragon-deep,#457c73)"/></linearGradient>
 <linearGradient id="sd31-head" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--dragon-light,#c5e1cf)"/><stop offset="1" stop-color="var(--dragon-mid,#80ae9a)"/></linearGradient>
 <linearGradient id="sd31-wing" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--wing-light,#d7e5d0)"/><stop offset="1" stop-color="var(--dragon-deep,#568978)"/></linearGradient>
 <linearGradient id="sd31-chest" x1=".4" y1="0" x2=".5" y2="1"><stop stop-color="var(--chest-light,#faf4e5)"/><stop offset="1" stop-color="var(--chest-mid,#d1e1cc)"/></linearGradient>
 <linearGradient id="sd31-horn" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff9e4"/><stop offset=".7" stop-color="#ddc68e"/><stop offset="1" stop-color="#b18b60"/></linearGradient>
 <radialGradient id="sd31-halo"><stop stop-color="#f9eac2" stop-opacity=".72"/><stop offset=".47" stop-color="#c3e5d4" stop-opacity=".19"/><stop offset="1" stop-color="#c3e5d4" stop-opacity="0"/></radialGradient>
 <filter id="sd31-shadow" x="-40%" y="-70%" width="180%" height="240%"><feGaussianBlur stdDeviation="8"/></filter>
</defs>
<ellipse class="sd31-halo" cx="280" cy="217" rx="226" ry="166" fill="url(#sd31-halo)"/>
<ellipse cx="286" cy="356" rx="173" ry="15" fill="#274a40" opacity=".13" filter="url(#sd31-shadow)"/>
<path class="sd31-ground" d="M120 354 Q280 360 441 354" fill="none" stroke="var(--dragon-deep,#568978)" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>
<!-- Tail rooted at the right hip, travelling behind the wing and curling inward -->
<path class="sd31-tail" d="M364 301 C411 312 445 309 464 275 C490 227 476 207 456 219 C442 228 453 246 461 247" fill="none" stroke="var(--dragon-deep,#518a7e)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M377 308 C427 314 456 300 469 260" fill="none" stroke="var(--dragon-light,#bedac5)" stroke-width="11" stroke-linecap="round" opacity=".66"/>
<path d="M454 248 C477 251 485 231 473 220" stroke="#e8d6a3" stroke-width="5" fill="none" stroke-linecap="round"/>
<!-- Layered wings grow from upper back; no detached ellipses -->
<g class="sd31-wings">
 <path d="M236 170 C184 110 136 118 106 90 Q112 147 138 170 C108 175 103 191 99 214 C138 202 168 212 208 235 Q225 205 236 170Z" fill="url(#sd31-wing)" stroke="var(--dragon-deep,#568978)" stroke-width="3" stroke-linejoin="round"/>
 <path d="M325 166 C374 105 424 116 459 88 Q455 150 429 170 Q468 173 469 213 C423 198 393 214 353 236 Q336 196 325 166Z" fill="url(#sd31-wing)" stroke="var(--dragon-deep,#568978)" stroke-width="3" stroke-linejoin="round"/>
 <path d="M229 183 Q162 153 123 114 M215 198 Q165 186 112 196 M332 181 Q396 148 445 113 M340 204 Q397 184 454 194" fill="none" stroke="var(--wing-vein,#f4efce)" stroke-width="3" stroke-linecap="round" opacity=".7"/>
</g>
<!-- Hind legs stay anchored at the same baseline as the front paws -->
<path d="M216 284 C186 288 173 318 182 336 Q193 350 233 342 L255 317 Z" fill="url(#sd31-body)" stroke="var(--dragon-deep,#568978)" stroke-width="3"/>
<path d="M345 284 C373 286 389 319 378 336 Q365 349 324 342 L307 314 Z" fill="url(#sd31-body)" stroke="var(--dragon-deep,#568978)" stroke-width="3"/>
<!-- One uninterrupted pear-shaped torso integrates hip, shoulder and throat -->
<path class="sd31-body" d="M279 137 C238 138 209 174 202 218 C191 270 192 312 227 333 C247 347 316 349 339 333 C373 313 370 269 361 223 C354 177 324 138 279 137Z" fill="url(#sd31-body)" stroke="var(--dragon-deep,#568978)" stroke-width="4" stroke-linejoin="round"/>
<path d="M240 176 C224 212 221 273 235 301" fill="none" stroke="var(--dragon-light,#bedac5)" stroke-width="8" stroke-linecap="round" opacity=".25"/>
<!-- Chest surface is softly animated only within the body, never moves feet -->
<g class="sd31-breath-core">
 <path d="M280 179 C249 178 230 217 230 262 C231 302 253 325 280 326 C308 325 330 299 330 260 C330 214 310 180 280 179Z" fill="url(#sd31-chest)" stroke="var(--dragon-deep,#568978)" stroke-opacity=".23" stroke-width="2"/>
 <path d="M259 207 C269 200 288 199 300 207" fill="none" stroke="#fffbed" stroke-opacity=".64" stroke-width="4" stroke-linecap="round"/>
 <path class="sd31-breath-line" d="M250 274 Q280 293 311 274" stroke="var(--dragon-deep,#568978)" stroke-opacity=".3" stroke-width="2" fill="none"/>
</g>
<!-- Forearms extend from integrated shoulder sockets and cradle the abdomen -->
<path d="M213 197 C190 219 193 272 210 291 Q224 306 245 292 L258 279 Q241 274 231 259 Q228 232 240 218" fill="url(#sd31-body)" stroke="var(--dragon-deep,#568978)" stroke-width="3" stroke-linejoin="round"/>
<path d="M349 196 C373 215 371 271 352 293 Q339 306 317 291 L304 279 Q322 274 331 256 Q332 226 321 217" fill="url(#sd31-body)" stroke="var(--dragon-deep,#568978)" stroke-width="3" stroke-linejoin="round"/>
<path d="M221 284 Q230 290 240 286 M321 285 Q332 291 342 285" fill="none" stroke="var(--dragon-deep,#568978)" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
<!-- Broad neck seamlessly emerges behind the face, no rectangle -->
<path d="M252 148 Q242 168 252 190 Q278 204 305 190 Q314 168 306 149Z" fill="url(#sd31-body)" stroke="var(--dragon-deep,#568978)" stroke-width="3"/>
<!-- Horn and two silhouette crests -->
<path d="M265 75 Q274 46 284 23 Q295 47 297 75Z" fill="url(#sd31-horn)" stroke="#bc9f71" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M228 105 Q205 85 209 65 Q225 75 242 92 M329 105 Q349 82 344 66 Q334 75 314 91" fill="url(#sd31-head)" stroke="var(--dragon-deep,#568978)" stroke-width="3" stroke-linejoin="round"/>
<!-- Large integrated head and muzzle -->
<path class="sd31-head" d="M280 65 C234 65 212 94 218 136 C220 158 238 174 251 179 C263 187 296 187 308 179 C329 167 344 149 340 125 C339 85 320 65 280 65Z" fill="url(#sd31-head)" stroke="var(--dragon-deep,#568978)" stroke-width="3.8" stroke-linejoin="round"/>
<path d="M258 147 C261 132 300 132 304 147 C311 163 294 175 280 175 C265 175 250 160 258 147Z" fill="var(--snout,#d1e8d9)" opacity=".8"/>
<path d="M238 126 Q254 138 268 124 M293 124 Q308 139 322 125" fill="none" stroke="var(--eye,#264c43)" stroke-width="4.5" stroke-linecap="round"/>
<path d="M268 156 Q280 161 291 156" fill="none" stroke="var(--eye,#264c43)" stroke-opacity=".76" stroke-width="3" stroke-linecap="round"/>
<circle cx="258" cy="146" r="2.5" fill="var(--eye,#264c43)" opacity=".7"/><circle cx="301" cy="146" r="2.5" fill="var(--eye,#264c43)" opacity=".7"/>
<path d="M235 148 Q244 154 255 150 M305 150 Q315 154 324 146" fill="none" stroke="var(--cheek,#dbab9e)" stroke-width="6" stroke-opacity=".45" stroke-linecap="round"/>
<path d="M255 84 Q269 75 283 77" fill="none" stroke="#fff8e5" stroke-width="6" stroke-linecap="round" opacity=".24"/>
<!-- The planted front feet cover body seams, three small curved claws each -->
<path d="M221 314 C203 314 190 331 199 343 Q217 352 251 347 Q266 337 248 318Z" fill="url(#sd31-head)" stroke="var(--dragon-deep,#568978)" stroke-width="3"/>
<path d="M338 313 C356 313 373 331 363 343 Q345 352 307 347 Q291 337 309 318Z" fill="url(#sd31-head)" stroke="var(--dragon-deep,#568978)" stroke-width="3"/>
<path d="M214 336 L213 344 M232 337 L231 345 M248 335 L249 342 M320 336 L319 344 M338 337 L338 345 M356 335 L357 342" fill="none" stroke="var(--dragon-deep,#568978)" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>
<circle class="sd31-heart" cx="280" cy="253" r="10" fill="#f9e6b3" opacity=".36"/>
`;
 mount.appendChild(svg);
})();
