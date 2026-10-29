// ===== Música =====
// Cambia INICIO_CANCION si quieres que arranque en otro segundo
const INICIO_CANCION = 0;
const audio = document.getElementById("musica");
const botonMusica = document.getElementById("play-pausa");

const ICONO_PLAY = `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`;
const ICONO_PAUSA = `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>`;

function actualizarBoton() {
  const sonando = !audio.paused;
  botonMusica.innerHTML = sonando ? ICONO_PAUSA : ICONO_PLAY;
  botonMusica.setAttribute(
    "aria-label",
    sonando ? "Pausar música" : "Reproducir música",
  );
}

function reproducir() {
  if (audio.currentTime < INICIO_CANCION) {
    if (audio.readyState >= 1) audio.currentTime = INICIO_CANCION;
    else
      audio.addEventListener(
        "loadedmetadata",
        () => {
          audio.currentTime = INICIO_CANCION;
        },
        { once: true },
      );
  }
  audio.play().catch(() => {});
}

function pausarMusica() {
  if (!audio.paused) audio.pause();
}

audio.loop = true;
audio.addEventListener("play", actualizarBoton);
audio.addEventListener("pause", actualizarBoton);

botonMusica.addEventListener("click", () => {
  if (audio.paused) reproducir();
  else pausarMusica();
});

// Pausar al cambiar de pestaña, minimizar, salir de la ventana o cerrar
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausarMusica();
});
window.addEventListener("blur", pausarMusica);
window.addEventListener("pagehide", pausarMusica);

// ===== Abrir invitación =====
const intro = document.getElementById("intro");
const contenido = document.getElementById("contenido");

document.getElementById("abrir").addEventListener("click", () => {
  gsap.to(intro, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      intro.hidden = true;
    },
  });
  contenido.hidden = false;
  botonMusica.hidden = false;
  reproducir();
  actualizarBoton();
  iniciarAnimaciones();
  setTimeout(() => ScrollTrigger.refresh(), 100);
});

// ===== Cuenta regresiva (zona horaria de Veracruz, UTC-6) =====
const fechaEvento = new Date("2026-11-15T14:30:00-06:00");
const elDias = document.getElementById("dias");
const elHoras = document.getElementById("horas");
const elMinutos = document.getElementById("minutos");
const elSegundos = document.getElementById("segundos");

function actualizarContador() {
  let d = fechaEvento - new Date();
  if (d <= 0) {
    elDias.textContent =
      elHoras.textContent =
      elMinutos.textContent =
      elSegundos.textContent =
        "00";
    return;
  }
  const dias = Math.floor(d / 864e5);
  d -= dias * 864e5;
  const horas = Math.floor(d / 36e5);
  d -= horas * 36e5;
  const minutos = Math.floor(d / 6e4);
  d -= minutos * 6e4;
  const segundos = Math.floor(d / 1000);

  elDias.textContent = String(dias).padStart(2, "0");
  elHoras.textContent = String(horas).padStart(2, "0");
  elMinutos.textContent = String(minutos).padStart(2, "0");
  elSegundos.textContent = String(segundos).padStart(2, "0");
}
actualizarContador();
setInterval(actualizarContador, 1000);

// ===== Animaciones GSAP =====
gsap.registerPlugin(ScrollTrigger);
let animado = false;

function iniciarAnimaciones() {
  if (animado) return;
  animado = true;

  gsap
    .timeline({ defaults: { ease: "back.out(1.6)" } })
    .from(".hero .kicker", { y: -16, opacity: 0, duration: 0.5 })
    .from(".titulo-principal", { y: 20, opacity: 0, duration: 0.6 }, "-=0.2")
    .from(
      ".capibara-hero",
      { scale: 0.7, opacity: 0, rotation: -6, duration: 0.9 },
      "-=0.3",
    )
    .from(
      ".festejado, .desliza",
      { y: 16, opacity: 0, stagger: 0.15, duration: 0.5 },
      "-=0.4",
    );

  // Scroll: las secciones entran suavemente
  gsap.utils.toArray(".seccion:not(.hero)").forEach((sec) => {
    gsap.from(
      sec.querySelectorAll(
        ".titulo-seccion, .texto-centro, .tarjeta, .btn, .confirmacion, .kicker",
      ),
      {
        scrollTrigger: {
          trigger: sec,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 36,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      },
    );
  });

  // Parallax suave de la capibara del hero al hacer scroll
  gsap.to(".capibara-hero", {
    y: -60,
    scrollTrigger: {
      trigger: "#inicio",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

// ===== Formulario RSVP → WhatsApp 238 223 3474 =====
const form = document.getElementById("form-rsvp");
const confirmacion = document.getElementById("confirmacion");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre-invitado").value.trim();
  const personas = document.getElementById("personas").value;
  const mensaje = document.getElementById("mensaje").value.trim();

  let texto = `🦫 Confirmación de asistencia\nNombre: ${nombre}\nPersonas: ${personas}\nFestejada: Paulette (Pau)\nFecha: domingo 15 de noviembre de 2026, 2:30 p.m.`;
  if (mensaje) texto += `\nMensaje: ${mensaje}`;

  window.open(
    `https://wa.me/5212382233474?text=${encodeURIComponent(texto)}`,
    "_blank",
    "noopener",
  );

  confirmacion.hidden = false;
  gsap.from(confirmacion, {
    scale: 0.6,
    opacity: 0,
    duration: 0.5,
    ease: "back.out(2)",
  });
  form.reset();
});

// ===== Emojis flotando de fondo =====
const capaFlotante = document.createElement("div");
capaFlotante.className = "flotantes";
capaFlotante.setAttribute("aria-hidden", "true");
document.body.prepend(capaFlotante);

const emojisFlotantes = ["🌿", "🍉", "🌼", "🫧", "🍃", "🌻", "🥕", "🌸"];
for (let i = 0; i < 14; i++) {
  const el = document.createElement("span");
  el.className = "emoji-flotante";
  el.textContent = emojisFlotantes[i % emojisFlotantes.length];
  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = 1.2 + Math.random() * 1.4 + "rem";
  el.style.animationDuration = 9 + Math.random() * 7 + "s";
  el.style.animationDelay = -Math.random() * 12 + "s"; // ya empiezan en movimiento
  capaFlotante.appendChild(el);
}
