/* D24 · Three new hand-authored asanas. The D17 SVG anatomy is shared,
   but every shoulder, arm, hip, knee and contact point is a new composition.
   These are optional explorations: the original 10-step Flow remains intact. */
(() => {
  "use strict";
  const poses = [
    {
      id:"d24-mountain",kind:"mountain",
      name:["Montaña · Tadasana","Mountain · Tadasana"],
      cue:["Erguido y estable. Afloja los hombros, reparte el peso en ambos pies.",
           "Stand comfortably. Soften the shoulders and feel both feet grounded."],
      support:["Dos pies en el suelo; brazos relajados.","Both feet planted; arms relaxed."],
      body:[359,219,58,91,0],head:[359,107,.82,0,"closed"],
      arms:["M308 188Q287 235 278 317","M411 188Q435 239 441 317"],
      legs:["M331 290Q328 335 328 381","M386 290Q392 335 393 381"],
      hands:[[278,317],[441,317]],feet:[[328,381],[393,381]],
      tail:[426,257,.58,-9]
    },
    {
      id:"d24-downward",kind:"downward",
      name:["Perro boca abajo · Adho Mukha Svanasana","Downward dog · Adho Mukha Svanasana"],
      cue:["Eleva la pelvis como una montaña y reparte el apoyo entre manos y pies. Dobla las rodillas si lo necesitas.",
           "Lift the hips into an inverted V. Share the weight across hands and feet; bend the knees if helpful."],
      support:["Cuatro apoyos; evita empujar la cabeza hacia el suelo.","Four contact points; do not force the head towards the mat."],
      body:[368,235,112,43,0],head:[221,297,.66,-42,"closed"],
      arms:["M291 251Q235 302 179 371","M312 270Q283 319 235 377"],
      legs:["M432 217Q487 256 499 377","M447 211Q527 267 547 374"],
      hands:[[179,371],[235,377]],[230,383]],feet:[[499,377],[547,374]],[547,373]],
      tail:[463,183,.55,-30]
    },
    {
      id:"d24-butterfly",kind:"butterfly",
      name:["Mariposa · Baddha Konasana","Butterfly · Baddha Konasana"],
      cue:["Siéntate alto y acerca suavemente las plantas de los pies. Deja que las rodillas descansen.",
           "Sit upright and gently bring the soles towards each other. Let the knees settle naturally."],
      support:["Pelvis apoyada; rodillas libres, sin empujarlas.","Seated pelvis; never press the knees down."],
      body:[359,265,68,84,0],head:[360,144,.85,0,"closed"],
      arms:["M308 232Q278 283 319 343","M411 232Q440 283 400 343"],
      legs:["M326 316Q251 332 315 366","M391 316Q471 332 404 366"],
      hands:[[319,343],[400,343]],feet:[[315,366],[404,366]],
      tail:[429,280,.62,9]
    }
    ,    // V68: nine additional independent postures, each with its own
    // shoulders, joints, supports, head position, hands and feet.
    // None is injected into the ten-phase canonical Flow clock.
    {
      id:"v68-warrior-ii",kind:"warrior",category:"standing",
      name:["Guerrero II · Virabhadrasana II","Warrior II · Virabhadrasana II"],
      cue:["Abre los brazos, flexiona la rodilla delantera y suaviza la mirada sobre la mano.","Open both arms, bend the front knee and gaze softly over your hand."],
      support:["Rodilla alineada con el pie, hombros sueltos; acorta la zancada si es necesario.","Knee tracking over the foot, shoulders soft; shorten the stance if needed."],
      body:[361,234,72,87,-3],head:[355,105,.78,-8,"focus"],
      arms:["M312 187Q253 189 191 185","M412 189Q476 185 531 189"],
      legs:["M328 298Q258 332 235 370","M401 294Q452 302 513 376"],
      hands:[[191,185],[531,189]],feet:[[235,370],[513,376]],tail:[444,254,.54,-18]
    },
    {
      id:"v68-tree",kind:"tree",category:"standing",
      name:["Árbol · Vrksasana","Tree · Vrksasana"],
      cue:["Enraíza un pie; apoya el otro en tobillo o pantorrilla, nunca en la rodilla.","Root through one foot; rest the other on ankle or calf, never on the knee."],
      support:["Usa una pared o deja la punta del pie apoyada para mejorar el equilibrio.","Use a wall or keep your toes grounded for balance."],
      body:[363,232,60,85,0],head:[363,109,.8,0,"focus"],
      arms:["M316 190Q281 139 330 94","M408 190Q444 138 398 94"],
      legs:["M343 293Q338 341 342 381","M390 296Q441 300 415 329Q398 346 372 328"],
      hands:[[330,94],[398,94]],[395,92]],feet:[[342,381],[372,328]],[369,331]],tail:[437,256,.6,11]
    },
    {
      id:"v68-triangle",kind:"triangle",category:"standing",
      name:["Triángulo · Trikonasana","Triangle · Trikonasana"],
      cue:["Alarga ambos costados y abre el pecho; no necesitas alcanzar el suelo.","Lengthen both sides and open the chest; reaching the floor is optional."],
      support:["Apoya la mano en la espinilla o en un bloque, sin comprimir el cuello.","Rest your hand on the shin or a block without compressing the neck."],
      body:[350,242,65,86,-30],head:[291,119,.76,-27,"focus"],
      arms:["M311 189Q278 236 253 316","M388 207Q428 152 469 102"],
      legs:["M318 304Q264 321 225 379","M398 295Q454 316 511 378"],
      hands:[[253,316],[469,102]],feet:[[225,379],[511,378]],tail:[438,257,.58,-31]
    },
    {
      id:"v68-easy-seat",kind:"seat",category:"seated",
      name:["Postura fácil · Sukhasana","Easy pose · Sukhasana"],
      cue:["Eleva la coronilla, afloja la mandíbula y deja las manos descansar sobre las piernas.","Lengthen through your crown, relax the jaw and rest your hands on your legs."],
      support:["Si la pelvis se inclina hacia atrás, siéntate sobre una manta doblada.","Sit on a folded blanket if your pelvis tips backward."],
      body:[359,261,68,84,0],head:[359,140,.85,0,"closed"],
      arms:["M310 228Q280 277 282 326","M409 228Q439 277 435 326"],
      legs:["M329 315Q279 343 240 356","M388 315Q439 342 477 356"],
      hands:[[282,326],[435,326]],feet:[[240,356],[477,356]],tail:[436,274,.55,12]
    },
    {
      id:"v68-twist",kind:"twist",category:"seated",
      name:["Torsión sentada suave","Gentle seated twist"],
      cue:["Gira desde la caja torácica, mantén la columna larga y respira sin forzar.","Rotate through the ribs with a long spine and breathe without forcing."],
      support:["Mantén ambas caderas en contacto; reduce la rotación si lo necesitas.","Keep both sitting bones grounded; reduce the twist when needed."],
      body:[363,268,69,82,13],head:[386,145,.82,18,"soft"],
      arms:["M309 233Q330 280 404 308","M409 237Q447 282 439 344"],
      legs:["M333 317Q266 330 252 356","M396 319Q444 330 474 352"],
      hands:[[404,308],[439,344]],feet:[[252,356],[474,352]],tail:[433,286,.62,19]
    },
    {
      id:"v68-seated-fold",kind:"fold",category:"seated",
      name:["Flexión sentada · Paschimottanasana","Seated forward fold · Paschimottanasana"],
      cue:["Inclínate desde las caderas y alarga el torso; las rodillas pueden doblarse.","Hinge from the hips and lengthen your torso; the knees may stay bent."],
      support:["Usa una correa en los pies y evita tirar de la espalda.","Use a strap at your feet; do not pull through the spine."],
      body:[353,291,108,52,-33],head:[275,249,.70,-38,"closed"],
      arms:["M294 286Q259 326 217 352","M338 309Q307 345 276 358"],
      legs:["M403 320Q464 337 528 364","M413 300Q484 316 536 343"],
      hands:[[217,352],[276,358]],feet:[[528,364],[536,343]],tail:[444,269,.53,-28]
    },
    {
      id:"v68-child",kind:"child",category:"restorative",
      name:["Niño · Balasana","Child's pose · Balasana"],
      cue:["Lleva la pelvis hacia los talones y descansa la frente; brazos hacia delante o atrás.","Sink toward the heels and rest your forehead; arms may reach forward or back."],
      support:["Coloca una manta bajo las rodillas o un cojín bajo el torso si ayuda.","Use a blanket beneath the knees or a bolster under the chest."],
      body:[393,300,118,47,-17],head:[239,317,.67,-58,"closed"],
      arms:["M312 301Q244 330 171 359","M350 319Q298 346 216 378"],
      legs:["M445 304Q484 342 481 367","M470 292Q513 322 516 356"],
      hands:[[171,359],[216,378]],feet:[[481,367],[516,356]],tail:[471,267,.52,-18]
    },
    {
      id:"v68-forward-fold",kind:"fold",category:"standing",
      name:["Pinza de pie · Uttanasana","Standing forward fold · Uttanasana"],
      cue:["Flexiona las caderas y deja caer el peso del torso; dobla las rodillas sin problema.","Hinge at the hips and let the torso release; soft knees are welcome."],
      support:["Apoya las manos en bloques y evita forzar los isquiotibiales.","Rest hands on blocks and avoid forcing the hamstrings."],
      body:[366,236,64,91,70],head:[272,281,.7,69,"closed"],
      arms:["M323 220Q277 280 264 362","M368 246Q328 305 335 369"],
      legs:["M338 294Q339 347 337 384","M389 295Q397 347 401 384"],
      hands:[[264,362],[335,369]],feet:[[337,384],[401,384]],tail:[419,248,.54,-10]
    },
    {
      id:"v68-gratitude",kind:"seat",category:"restorative",
      name:["Gratitud · Anjali Mudra","Gratitude · Anjali Mudra"],
      cue:["Acerca ambas manos al centro del pecho y deja que la respiración se asiente.","Bring both hands toward your heart and let the breath settle."],
      support:["Puedes mantener las manos separadas si hay tensión en muñecas u hombros.","Keep your palms apart if wrists or shoulders feel tense."],
      body:[360,265,68,85,0],head:[360,143,.84,0,"smile"],
      arms:["M310 225Q302 272 350 251","M409 225Q418 273 370 251"],
      legs:["M327 318Q265 346 238 357","M392 318Q457 344 482 357"],
      hands:[[350,251],[370,251]],feet:[[238,357],[482,357]],tail:[434,279,.6,7]
    }
  ];
  // V71: precise, optional micro-guidance for each individual exploration.
  // Each pose has a setup, a calm breathing cue and an intentional release.
  // This supplements rather than modifies the ten-step guided sequence.
  const coaching={
    "d24-mountain":{
      setup:["Separa los pies al ancho de las caderas. Apoya talón, base del dedo gordo y base del meñique.",
             "Stand with feet hip-width apart. Ground through heel, big-toe mound and little-toe mound."],
      breath:["Inhala creciendo desde la coronilla; exhala relajando hombros y mandíbula.",
              "Inhale to lengthen through your crown; exhale to soften shoulders and jaw."],
      exit:["Afloja las rodillas, mueve los dedos y camina unos pasos con calma.",
            "Release the knees, wiggle your toes and take a few easy steps."]
    },
    "d24-downward":{
      setup:["Desde cuatro apoyos, separa los dedos y lleva las caderas arriba y atrás. Rodillas flexionadas si hace falta.",
             "From hands and knees, spread your fingers and send hips up and back. Keep knees bent if useful."],
      breath:["Respira por la espalda y alarga la columna; no fuerces los talones hacia el suelo.",
              "Breathe into your back and lengthen the spine. Heels need not touch the mat."],
      exit:["Baja las rodillas despacio y descansa en una postura cómoda.",
            "Lower your knees slowly and rest in a comfortable position."]
    },
    "d24-butterfly":{
      setup:["Siéntate sobre una manta si lo necesitas. Junta las plantas de los pies sin tirar de las rodillas.",
             "Sit on a folded blanket if helpful. Bring soles together without pulling your knees down."],
      breath:["Inhala elevando suavemente el pecho; exhala dejando que las caderas se ablanden.",
              "Inhale to gently lift your chest; exhale to soften around the hips."],
      exit:["Ayuda con las manos a juntar las rodillas y extiende las piernas poco a poco.",
            "Use your hands to bring knees together, then extend your legs gradually."]
    },
    "v68-warrior-ii":{
      setup:["Separa los pies ampliamente. Gira el pie delantero y flexiona esa rodilla en su dirección. Abre los brazos.",
             "Step feet wide. Turn the front foot out and bend that knee along its direction. Open both arms."],
      breath:["Inhala alargando los costados; exhala relajando los hombros sin hundir el pecho.",
              "Inhale into the side ribs; exhale to release the shoulders without collapsing the chest."],
      exit:["Estira suavemente la pierna delantera, baja los brazos y repite al otro lado.",
            "Gently straighten your front leg, lower the arms and repeat on the other side."]
    },
    "v68-tree":{
      setup:["Apoya un pie firmemente. Sitúa el otro sobre el tobillo o la pantorrilla, nunca contra la rodilla.",
             "Stand strongly on one foot. Rest the other on ankle or calf, never against the knee joint."],
      breath:["Mantén la mirada en un punto fijo y respira con naturalidad, sin bloquear el abdomen.",
              "Rest your gaze on one steady point and breathe naturally without bracing the belly."],
      exit:["Baja el pie con control. Recupera el equilibrio antes de cambiar de lado.",
            "Lower your foot with control. Regain balance before changing sides."]
    },
    "v68-triangle":{
      setup:["Da una zancada amplia. Alarga ambos costados e inclínate sobre la pierna delantera sin cerrar el pecho.",
             "Take a wide stance. Lengthen both sides and hinge over the front leg without closing the chest."],
      breath:["Inhala creando espacio entre las costillas; exhala soltando tensión del cuello.",
              "Inhale to make room between the ribs; exhale to soften the neck."],
      exit:["Activa suavemente las piernas para volver a subir. Cambia de lado con calma.",
            "Engage your legs gently to come upright. Change sides without rushing."]
    },
    "v68-easy-seat":{
      setup:["Cruza las piernas cómodamente. Eleva las caderas con un cojín si la espalda se redondea.",
             "Cross the legs comfortably. Raise the hips on a cushion if the back rounds."],
      breath:["Inhala creciendo; exhala soltando mandíbula, hombros y abdomen.",
              "Inhale to lengthen; exhale to release jaw, shoulders and belly."],
      exit:["Descruza las piernas lentamente y prueba el otro cruce si lo deseas.",
            "Uncross gently and try the opposite crossing if you wish."]
    },
    "v68-twist":{
      setup:["Siéntate con la pelvis estable. Alarga el tronco antes de girar ligeramente desde las costillas.",
             "Sit with a stable pelvis. Lengthen your torso before rotating gently through the ribs."],
      breath:["Inhala para crecer; exhala para mantener un giro pequeño, sin forzarlo.",
              "Inhale to grow tall; exhale into a small, unforced rotation."],
      exit:["Vuelve al centro al inhalar. Descansa y repite hacia el otro lado.",
            "Return to centre on an inhale. Rest, then repeat to the other side."]
    },
    "v68-seated-fold":{
      setup:["Estira las piernas con rodillas algo flexionadas. Inclínate desde las caderas sin tirar de los pies.",
             "Extend the legs with soft knees. Hinge at the hips without pulling on the feet."],
      breath:["Respira en la espalda manteniendo espacio entre el pecho y el abdomen.",
              "Breathe into the back while allowing space between chest and belly."],
      exit:["Apoya las manos para subir vértebra a vértebra, sin rebotes.",
            "Use your hands for support as you slowly return upright, without bouncing."]
    },
    "v68-child":{
      setup:["Desde cuatro apoyos, lleva las caderas hacia los talones. Ajusta la separación de las rodillas.",
             "From hands and knees, send hips towards heels. Adjust knee spacing as comfortable."],
      breath:["Deja respirar las costillas posteriores. Usa un cojín bajo el torso si lo necesitas.",
              "Breathe into the back ribs. Use a bolster under the chest if helpful."],
      exit:["Acerca las manos al cuerpo y sube lentamente, apoyándote en los brazos.",
            "Walk hands back and rise slowly with arm support."]
    },
    "v68-forward-fold":{
      setup:["Desde pie, dobla las rodillas y gira desde las caderas. Apoya las manos en bloques si ayuda.",
             "From standing, bend knees and hinge at the hips. Use blocks under your hands if useful."],
      breath:["Deja que la cabeza cuelgue sin tirar del cuello. Mantén una respiración suave.",
              "Let the head release without pulling on the neck. Keep breathing easily."],
      exit:["Dobla más las rodillas y sube despacio, manteniendo el peso equilibrado.",
            "Bend the knees more and rise slowly with balanced weight."]
    },
    "v68-gratitude":{
      setup:["Siéntate cómodo y acerca las palmas al corazón sin tensar muñecas ni hombros.",
             "Sit comfortably and bring palms towards your heart without straining wrists or shoulders."],
      breath:["Inhala con espacio en el pecho; exhala dejando que las manos y la cara se suavicen.",
              "Inhale with room in the chest; exhale to soften hands and face."],
      exit:["Separa las manos y déjalas descansar sobre las piernas. Abre los ojos a tu ritmo.",
            "Release the hands onto your legs. Open your eyes at your own pace."]
    }
  };
  for(const pose of poses){
    const detail=coaching[pose.id];
    if(!detail||!["setup","breath","exit"].every(key=>
       Array.isArray(detail[key])&&detail[key].length===2&&detail[key].every(Boolean)))
      throw Error("Missing bilingual coaching steps: "+pose.id);
    pose.coaching=Object.freeze(detail);
  }
  // All positions and limbs are authored, not generated by reflecting one side.
  const names = poses.map(p=>p.id);
  if(new Set(names).size!==poses.length)throw Error("Duplicate asana identifiers");
  for(const pose of poses){
    if(pose.arms.length!==2||pose.legs.length!==2||pose.hands.length!==2||pose.feet.length!==2)
      throw Error("Each asana requires exactly four distinct limbs and contact points");
    for(const point of [...pose.hands,...pose.feet]){
      if(!point.every(v=>Number.isFinite(v)&&v>=0&&v<=720))
        throw Error("Asana contact outside SVG viewBox");
    }
    Object.freeze(pose.hands);Object.freeze(pose.feet);
    Object.freeze(pose.arms);Object.freeze(pose.legs);
    Object.freeze(pose);
  }
  const api=Object.freeze({
    poses:Object.freeze(poses),
    byId:id=>poses.find(p=>p.id===id)||null
  });
  if(typeof window!=="undefined")window.YOGA_ASANA_LIBRARY=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})();
