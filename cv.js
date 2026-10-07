const T = {
      es: { role:"Instructor de yoga · Murcia", tag:"Presencia. Respiración. Práctica real.", d1t:"Sala", d1p:"Clases multi-nivel. Entras, respiras, sales distinto.", d2t:"1:1", d2p:"Movilidad, estrés, hábito. Una persona, un criterio.", d3t:"Equipos", d3p:"Bienestar en el trabajo. Lo hice en Google / YouTube.", exp:"Experiencia", j1s:"Instructor · planta baja, González Adalid 12", j1p:"Clases multi-nivel hasta el cierre del centro en junio de 2026.", j2s:"Wellness Ambassador · yoga corporativo", j2p:"Programas de yoga y bienestar para equipos IT + ES.", j3t:"Clases particulares", j3s:"Instructor personalizado", j3p:"Movilidad, estrés, constancia y técnica.", j4p:"Disciplina, presencia y constancia. La base antes de la sala.", edu:"Formación", edup:"Certificación oficial. Asanas, pranayama, filosofía. Prácticas en Madrid. Turismo (Erasmus Bergamo 2012 · Murcia 2011).", q:"Busco clases transformadoras y honestas: cuerpo, respiración y atención. Sin postureo. Con método y calidez.", lang:"Idiomas", av:"Disponibilidad", avp:"Fines de semana · tardes y noches. Murcia.", pdf:"./assets/CV_Gracian_Baena_Yoga_ES.pdf" },
      en: { role:"Yoga instructor · Murcia", tag:"Presence. Breath. Real practice.", d1t:"Studio", d1p:"Multi-level classes. Walk in, breathe, leave different.", d2t:"1:1", d2p:"Mobility, stress, habit. One person, one criterion.", d3t:"Teams", d3p:"Wellbeing at work. I did it at Google / YouTube.", exp:"Experience", j1s:"Instructor · ground floor, González Adalid 12", j1p:"Multi-level classes until the centre closed in June 2026.", j2s:"Wellness Ambassador · corporate yoga", j2p:"Yoga and wellbeing programmes for IT + ES teams.", j3t:"Private classes", j3s:"Personalised instructor", j3p:"Mobility, stress, consistency and technique.", j4p:"Discipline, presence and consistency. The base before the studio.", edu:"Training", edup:"Official certification. Asana, pranayama, philosophy. Placements in Madrid. Tourism (Erasmus Bergamo 2012 · Murcia 2011).", q:"Honest, transformative classes: body, breath and attention. No performance. Method and warmth.", lang:"Languages", av:"Availability", avp:"Weekends · evenings and nights. Murcia.", pdf:"./assets/CV_Gracian_Baena_Yoga_EN.pdf" }
    };
    function apply(lang) {
      const t = T[lang];
      document.documentElement.lang = lang;
      document.title = lang === "en" ? "Gracián Baena — Yoga CV" : "Gracián Baena — CV Yoga";
      document.getElementById("es").setAttribute("aria-pressed", String(lang === "es"));
      document.getElementById("en").setAttribute("aria-pressed", String(lang === "en"));
      document.querySelectorAll("[data-i]").forEach(el => { if (t[el.dataset.i]) el.textContent = t[el.dataset.i]; });
      document.querySelector("[data-pdf]").href = t.pdf;
      document.getElementById("es").classList.toggle("is-on", lang === "es");
      document.getElementById("en").classList.toggle("is-on", lang === "en");
    }
    document.getElementById("es").onclick = () => apply("es");
    document.getElementById("en").onclick = () => apply("en");
