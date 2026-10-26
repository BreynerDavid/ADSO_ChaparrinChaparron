/**
 * ==========================================================================
 * Proyecto: 100 proyectos JS · 01 - Tinder Swipe (Edición Premium)
 * Autor: Breyner Pineda
 * Lógica, Audio & Efectos: Edición Premium UI/UX & Responsive Experience
 * Descripción:
 * Módulo JavaScript completo que incluye:
 *  - Sintetizador de audio procedimental con Web Audio API (cero dependencias).
 *  - Motor de partículas de alto rendimiento sobre HTML5 Canvas (corazones, confeti, estrellas, chispas).
 *  - Baraja de perfiles detallada con navegación de fotos por historias (Story-bars).
 *  - Física de arrastre táctil / ratón con inclinación tridimensional reactiva (3D Parallax).
 *  - Dynamic Island interactiva con cuenta regresiva para Super Boost.
 *  - Modal de celebración "¡Es un Match!" con animación, sonido y envío de primer mensaje.
 *  - Cajón de mensajes y matches con chat simulado interactivo en tiempo real.
 *  - Modal de perfil y ajustes con sliders dinámicos y persistencia.
 *  - Hoja inferior de detalles completos con reproductor del himno de Spotify.
 *  - Atajos de teclado completos y reloj en tiempo real.
 * Todos los comentarios y documentación están en español.
 * ==========================================================================
 */

// =========================================================================
// 1. SINTETIZADOR DE AUDIO PROCEDIMENTAL (WEB AUDIO API)
// =========================================================================
class SoundFXEngine {
  constructor() {
    this.ctx = null
    this.isMuted = localStorage.getItem('tinder_sfx_muted') === 'true'
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    localStorage.setItem('tinder_sfx_muted', this.isMuted)
    return this.isMuted
  }

  playTap() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(450, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }

  playSwipe() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 0.12)

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.12)
  }

  playLike() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 (acorde alegre)
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05)

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(this.ctx.currentTime + idx * 0.05)
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.25)
    })
  }

  playSuperLike() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51] // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06)

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.35)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(this.ctx.currentTime + idx * 0.06)
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.35)
    })
  }

  playNope() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(260, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.16)

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.16)
  }

  playMatch() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    // Fanfarria armónica majestuosa
    const chord1 = [440, 554.37, 659.25] // A Major
    const chord2 = [587.33, 739.99, 880]   // D Major
    const chord3 = [659.25, 830.61, 987.77, 1318.5] // E Major brillante

    const playChord = (notes, time, dur) => {
      notes.forEach(f => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(f, time)
        gain.gain.setValueAtTime(0.14, time)
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(time)
        osc.stop(time + dur)
      })
    }

    const t = this.ctx.currentTime
    playChord(chord1, t, 0.2)
    playChord(chord2, t + 0.18, 0.25)
    playChord(chord3, t + 0.38, 0.7)
  }

  playBoost() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.4)

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.45)
  }

  playUndo() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.2)

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.2)
  }

  playMessage() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.12)
  }
}

const soundFX = new SoundFXEngine()

// =========================================================================
// 2. MOTOR DE PARTÍCULAS EN CANVAS (CONFETI, CORAZONES, ESTRELLAS, CHISPAS)
// =========================================================================
class ParticleFXEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null
    this.particles = []
    this.animId = null

    if (this.canvas) {
      this.resize()
      window.addEventListener('resize', () => this.resize())
    }
  }

  resize() {
    if (!this.canvas) return
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  burstHearts(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 6 + 3
      this.particles.push({
        type: 'heart',
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 14 + 10,
        alpha: 1,
        color: ['#fd267d', '#ff6036', '#00d68f', '#ff4458'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1,
        life: 1,
        decay: Math.random() * 0.015 + 0.012
      })
    }
    this.startLoop()
  }

  burstStars(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5)
      const speed = Math.random() * 7 + 4
      this.particles.push({
        type: 'star',
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 12 + 8,
        alpha: 1,
        color: ['#28a0f5', '#60a5fa', '#38bdf8', '#fbbf24'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.15,
        life: 1,
        decay: Math.random() * 0.015 + 0.012
      })
    }
    this.startLoop()
  }

  burstConfetti(count = 70) {
    const colors = ['#fd267d', '#ff6036', '#28a0f5', '#00d68f', '#f59e0b', '#a855f7']
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'confetti',
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 120,
        y: window.innerHeight * 0.45,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12 - 4,
        size: Math.random() * 8 + 5,
        height: Math.random() * 12 + 8,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
        life: 1,
        gravity: 0.35,
        decay: Math.random() * 0.01 + 0.008
      })
    }
    this.startLoop()
  }

  burstSparks(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 2
      this.particles.push({
        type: 'spark',
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        alpha: 1,
        color: ['#c084fc', '#a855f7', '#e879f9', '#ffffff'][Math.floor(Math.random() * 4)],
        life: 1,
        decay: Math.random() * 0.03 + 0.02
      })
    }
    this.startLoop()
  }

  startLoop() {
    if (!this.animId) {
      this.loop = this.loop.bind(this)
      this.animId = requestAnimationFrame(this.loop)
    }
  }

  loop() {
    if (!this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += p.gravity || 0.15
      p.life -= p.decay
      p.alpha = Math.max(0, p.life)
      if (p.rotation !== undefined && p.vRot) p.rotation += p.vRot

      if (p.life <= 0) {
        this.particles.splice(i, 1)
        continue
      }

      this.ctx.save()
      this.ctx.globalAlpha = p.alpha
      this.ctx.translate(p.x, p.y)
      if (p.rotation) this.ctx.rotate(p.rotation)

      if (p.type === 'heart') {
        this.ctx.fillStyle = p.color
        const s = p.size / 15
        this.ctx.beginPath()
        this.ctx.moveTo(0, s * -4)
        this.ctx.bezierCurveTo(s * 7, s * -12, s * 14, s * -2, 0, s * 10)
        this.ctx.bezierCurveTo(s * -14, s * -2, s * -7, s * -12, 0, s * -4)
        this.ctx.fill()
      } else if (p.type === 'star') {
        this.ctx.fillStyle = p.color
        const spikes = 5
        const outerRadius = p.size
        const innerRadius = p.size / 2
        let rot = (Math.PI / 2) * 3
        let x = 0
        let y = 0
        const step = Math.PI / spikes

        this.ctx.beginPath()
        this.ctx.moveTo(0, -outerRadius)
        for (let j = 0; j < spikes; j++) {
          x = Math.cos(rot) * outerRadius
          y = Math.sin(rot) * outerRadius
          this.ctx.lineTo(x, y)
          rot += step

          x = Math.cos(rot) * innerRadius
          y = Math.sin(rot) * innerRadius
          this.ctx.lineTo(x, y)
          rot += step
        }
        this.ctx.lineTo(0, -outerRadius)
        this.ctx.closePath()
        this.ctx.fill()
      } else if (p.type === 'confetti') {
        this.ctx.fillStyle = p.color
        this.ctx.fillRect(-p.size / 2, -p.height / 2, p.size, p.height)
      } else {
        // Spark
        this.ctx.fillStyle = p.color
        this.ctx.beginPath()
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        this.ctx.fill()
      }

      this.ctx.restore()
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.loop)
    } else {
      this.animId = null
    }
  }
}

const particleFX = new ParticleFXEngine('fxCanvas')

// =========================================================================
// 3. BASE DE DATOS DE PERFILES DE ALTA GAMA (RICH PROFILES)
// =========================================================================
const PROFILES_DATA = [
  {
    id: 'sofia_24',
    name: 'Sofía',
    age: 24,
    verified: true,
    distance: 'A 3 km de distancia',
    occupation: 'Arquitecta & Diseñadora de Interiores',
    city: 'Madrid / Barcelona',
    bio: 'Apasionada por la luz natural, el café de especialidad y los espacios minimalistas con alma. Busco planes espontáneos, museos y caminatas al atardecer.',
    tags: ['Arquitectura 🏛️', 'Yoga 🧘‍♀️', 'Café ☕', 'Fotografía 📷'],
    photos: [
      './photos/2.webp',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80'
    ],
    spotify: {
      song: 'Midnight City',
      artist: 'M83 · Hurry Up, We\'re Dreaming',
      albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80'
    },
    isMatch: true
  },
  {
    id: 'leila_27',
    name: 'Leila',
    age: 27,
    verified: true,
    distance: 'A 2 km de distancia',
    occupation: 'Diseñadora UX/UI & Ilustradora',
    city: 'Centro de la ciudad',
    bio: 'Me pierdo dibujando en cafeterías o descubriendo vinilos indie. Fan absoluta de viajar ligera de equipaje y conversar sobre cine hasta las tantas.',
    tags: ['Arte 🎨', 'Música Indie 🎵', 'Viajes ✈️', 'Diseño 💻'],
    photos: [
      './photos/1.webp',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80'
    ],
    spotify: {
      song: 'Sweater Weather',
      artist: 'The Neighbourhood',
      albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80'
    },
    isMatch: true
  },
  {
    id: 'camila_25',
    name: 'Camila',
    age: 25,
    verified: true,
    distance: 'A 4 km de distancia',
    occupation: 'Bióloga Marina & Buceadora',
    city: 'Costa & Aventura',
    bio: 'Si no me encuentras en el agua, probablemente esté cocinando algo nuevo o planeando la próxima ruta de montaña. Amante de los animales y las puestas de sol.',
    tags: ['Playa 🌊', 'Buceo 🤿', 'Gastronomía 🍣', 'Mascotas 🐕'],
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=80'
    ],
    spotify: {
      song: 'Electric Feel',
      artist: 'MGMT · Oracular Spectacular',
      albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=150&q=80'
    },
    isMatch: true
  },
  {
    id: 'mateo_28',
    name: 'Mateo',
    age: 28,
    verified: true,
    distance: 'A 6 km de distancia',
    occupation: 'Chef & Emprendedor Gastronómico',
    city: 'Distrito Creativo',
    bio: 'La comida une a las personas. Siempre en busca de la mejor pizza artesanal y de una buena copa de vino. ¿Te apetece una cata a ciegas?',
    tags: ['Cocina 🍳', 'Vino 🍷', 'Running 🏃', 'Jazz 🎷'],
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
    ],
    spotify: {
      song: 'Fly Me to the Moon',
      artist: 'Frank Sinatra',
      albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80'
    },
    isMatch: false
  },
  {
    id: 'valentina_23',
    name: 'Valentina',
    age: 23,
    verified: true,
    distance: 'A 5 km de distancia',
    occupation: 'Fotógrafa & Productora Musical',
    city: 'Estudio Norte',
    bio: 'Cazadora de luz y sintetizadores analógicos. Mi meta es capturar instantes que no vuelven. Si tienes buenas recomendaciones musicales, ya me caes bien.',
    tags: ['Fotografía 📸', 'Sintetizadores 🎹', 'Conciertos 🎸', 'Moda 👗'],
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80'
    ],
    spotify: {
      song: 'The Less I Know The Better',
      artist: 'Tame Impala · Currents',
      albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80'
    },
    isMatch: true
  }
]

// =========================================================================
// 4. ESTADO DE LA APLICACIÓN & VARIABLES GLOBALES
// =========================================================================
const DECISION_THRESHOLD = 80
let isAnimating = false
let pullDeltaX = 0
let pullDeltaY = 0
let isDragging = false
let dragStartTime = 0
let startX = 0
let startY = 0

// Pila para historial de cartas (Undo)
const swipedCardsHistory = []

// Perfiles actualmente en la baraja (ordenados de fondo a superficie)
let activeProfilesQueue = []

// Perfil activo mostrado en el Bottom Sheet de detalles
let currentDetailProfile = null

// Temporizador del Super Boost en la Dynamic Island
let boostTimerInterval = null

// Simulación de conversaciones de chat
const conversationsData = [
  {
    id: 'sofia_24',
    name: 'Sofía',
    avatar: './photos/2.webp',
    lastMessage: '¡Totalmente! Me encantaría ver ese museo 🏛️',
    time: '14:20',
    unread: 1,
    messages: [
      { text: '¡Hola Sofía! Vi que te encanta la arquitectura.', sent: true, time: '14:15' },
      { text: '¡Totalmente! Me encantaría ver ese museo 🏛️', sent: false, time: '14:20' }
    ]
  },
  {
    id: 'leila_27',
    name: 'Leila',
    avatar: './photos/1.webp',
    lastMessage: 'Jajaja qué temazo de M83 pusiste en tu bio!',
    time: 'Ayer',
    unread: 2,
    messages: [
      { text: '¡Hey! Tu portafolio de UX se ve increíble.', sent: true, time: 'Ayer' },
      { text: 'Jajaja qué temazo de M83 pusiste en tu bio!', sent: false, time: 'Ayer' }
    ]
  }
]

// =========================================================================
// 5. RENDERIZADO Y GESTIÓN DE TARJETAS
// =========================================================================

/**
 * Genera el elemento HTML para una tarjeta de perfil
 */
function createCardElement(profile) {
  const article = document.createElement('article')
  article.dataset.profileId = profile.id
  article._profileData = profile
  article._currentPhotoIndex = 0

  // Generar barras de progreso de historias
  const storyBarsHTML = profile.photos.map((_, i) => 
    `<div class="story-bar ${i === 0 ? 'active' : ''}"></div>`
  ).join('')

  // Generar etiquetas (tags)
  const tagsHTML = profile.tags.map(tag => 
    `<span class="tag-pill">${tag}</span>`
  ).join('')

  article.innerHTML = `
    <!-- Barras de indicador de historias -->
    <div class="story-indicators">
      ${storyBarsHTML}
    </div>

    <!-- Zonas de toque para cambiar fotos -->
    <div class="tap-zone tap-zone-left" title="Foto anterior"></div>
    <div class="tap-zone tap-zone-right" title="Siguiente foto"></div>

    <!-- Imagen del perfil -->
    <img class="profile-img" src="${profile.photos[0]}" alt="${profile.name}, ${profile.age} años" />
    <div class="card-gradient-overlay"></div>

    <!-- Sellos de decisión -->
    <div class="choice nope">NOPE</div>
    <div class="choice like">LIKE</div>
    <div class="choice super">SUPER LIKE</div>

    <!-- Información del perfil -->
    <div class="profile-info">
      <div class="info-content">
        <h2>
          ${profile.name} <span class="age">${profile.age}</span>
          ${profile.verified ? `
            <span class="verified-badge" title="Perfil verificado">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
          ` : ''}
        </h2>
        <div class="profile-meta">
          <div class="meta-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>${profile.distance}</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
            <span>${profile.occupation}</span>
          </div>
        </div>
        <div class="profile-tags">
          ${tagsHTML}
        </div>
      </div>

      <!-- Botón Info Fab para abrir Bottom Sheet -->
      <button class="card-info-btn" aria-label="Ver detalles del perfil" title="Más información">
        <svg viewBox="0 0 24 24"><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/></svg>
      </button>
    </div>
  `

  // Asignar evento al botón de información
  const infoBtn = article.querySelector('.card-info-btn')
  if (infoBtn) {
    infoBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      openDetailSheet(profile)
    })
  }

  return article
}

/**
 * Cambia la foto visible de una tarjeta específica
 */
function changeCardPhoto(cardEl, direction) {
  const profile = cardEl._profileData
  if (!profile || profile.photos.length <= 1) return

  let newIndex = cardEl._currentPhotoIndex + direction
  if (newIndex < 0) newIndex = 0
  if (newIndex >= profile.photos.length) newIndex = profile.photos.length - 1

  if (newIndex === cardEl._currentPhotoIndex) return

  cardEl._currentPhotoIndex = newIndex

  // Cambiar imagen
  const imgEl = cardEl.querySelector('img.profile-img')
  if (imgEl) {
    imgEl.style.opacity = '0.7'
    imgEl.src = profile.photos[newIndex]
    setTimeout(() => {
      imgEl.style.opacity = '1'
    }, 80)
  }

  // Actualizar indicadores de historia
  const bars = cardEl.querySelectorAll('.story-bar')
  bars.forEach((bar, idx) => {
    bar.classList.toggle('active', idx === newIndex)
  })

  soundFX.playTap()
}

/**
 * Inicializa y renderiza la baraja de perfiles
 */
function initializeDeck() {
  const cardsContainer = document.getElementById('cardsDeck')
  if (!cardsContainer) return

  // Remover tarjetas previas si existen
  cardsContainer.querySelectorAll('article').forEach(el => el.remove())

  // Clonamos perfiles en orden inverso (la primera aparecerá arriba del stack)
  activeProfilesQueue = [...PROFILES_DATA].reverse()

  activeProfilesQueue.forEach(profile => {
    const cardEl = createCardElement(profile)
    cardsContainer.appendChild(cardEl)
  })

  swipedCardsHistory.length = 0
  updateUndoButtonState()
  checkEmptyDeckState()
}

/**
 * Comprueba y actualiza la apariencia del estado vacío de la baraja
 */
function checkEmptyDeckState() {
  const cards = document.querySelectorAll('.cards article')
  const emptyState = document.querySelector('.empty-state')
  if (emptyState) {
    emptyState.style.display = cards.length === 0 ? 'flex' : 'none'
  }
}

/**
 * Actualiza el botón de deshacer (disabled/enabled)
 */
function updateUndoButtonState() {
  const btnUndo = document.getElementById('btnUndo')
  if (btnUndo) {
    btnUndo.classList.toggle('disabled', swipedCardsHistory.length === 0)
  }
}

/**
 * Muestra una notificación emergente tipo Toast
 */
function showToast(message, icon = '✨') {
  const toast = document.getElementById('toastNotification')
  if (!toast) return

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`
  toast.classList.add('show')

  clearTimeout(toast._timeout)
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show')
  }, 2200)
}

/**
 * Actualiza la tarjeta que está debajo para efecto de profundidad 3D
 */
function updateUnderlyingCard(progress) {
  const cards = document.querySelectorAll('.cards article')
  if (cards.length < 2) return

  const underCard = cards[cards.length - 2]
  if (!underCard) return

  const scale = 0.95 + 0.05 * progress
  const translateY = 12 * (1 - progress)
  const brightness = 0.82 + 0.18 * progress

  underCard.style.transform = `scale(${scale}) translateY(${translateY}px)`
  underCard.style.filter = `brightness(${brightness})`
}

function resetUnderlyingCard() {
  const cards = document.querySelectorAll('.cards article')
  if (cards.length < 2) return

  const underCard = cards[cards.length - 2]
  if (!underCard) return

  underCard.removeAttribute('style')
}

// =========================================================================
// 6. FÍSICA DE ARRASTRE Y GESTOS (MOUSE & TOUCH)
// =========================================================================

function startDrag(event) {
  if (isAnimating) return

  // Ignorar clics en botones internos o modales
  if (event.target.closest('button') || event.target.closest('.modal-overlay') || event.target.closest('.drawer-overlay') || event.target.closest('.detail-sheet-overlay')) {
    return
  }

  const actualCard = event.target.closest('article')
  if (!actualCard) return

  const allCards = document.querySelectorAll('.cards article')
  if (actualCard !== allCards[allCards.length - 1]) return

  isDragging = false
  dragStartTime = Date.now()

  startX = event.pageX ?? (event.touches ? event.touches[0].pageX : 0)
  startY = event.pageY ?? (event.touches ? event.touches[0].pageY : 0)

  // Listeners
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('touchend', onEnd)

  function onMove(e) {
    const currentX = e.pageX ?? (e.touches ? e.touches[0].pageX : 0)
    const currentY = e.pageY ?? (e.touches ? e.touches[0].pageY : 0)

    pullDeltaX = currentX - startX
    pullDeltaY = currentY - startY

    // Si el movimiento supera un umbral mínimo, activamos arrastre
    if (Math.abs(pullDeltaX) > 6 || Math.abs(pullDeltaY) > 6) {
      isDragging = true
      if (e.cancelable) e.preventDefault()
    }

    if (!isDragging) return

    const deg = pullDeltaX / 14
    actualCard.style.transform = `translateX(${pullDeltaX}px) translateY(${pullDeltaY * 0.4}px) rotate(${deg}deg)`
    actualCard.style.cursor = 'grabbing'

    // Actualizar sellos de decisión
    const opacityX = Math.min(Math.abs(pullDeltaX) / 80, 1)
    const opacityY = Math.min(Math.abs(Math.min(0, pullDeltaY)) / 90, 1)

    const choiceLike = actualCard.querySelector('.choice.like')
    const choiceNope = actualCard.querySelector('.choice.nope')
    const choiceSuper = actualCard.querySelector('.choice.super')

    if (pullDeltaY < -60 && Math.abs(pullDeltaX) < 60) {
      // Super Like
      if (choiceSuper) choiceSuper.style.opacity = opacityY
      if (choiceLike) choiceLike.style.opacity = 0
      if (choiceNope) choiceNope.style.opacity = 0
    } else {
      if (choiceSuper) choiceSuper.style.opacity = 0
      if (pullDeltaX > 0) {
        if (choiceLike) choiceLike.style.opacity = opacityX
        if (choiceNope) choiceNope.style.opacity = 0
      } else {
        if (choiceNope) choiceNope.style.opacity = opacityX
        if (choiceLike) choiceLike.style.opacity = 0
      }
    }

    const progress = Math.min(Math.abs(pullDeltaX) / 140, 1)
    updateUnderlyingCard(progress)
  }

  function onEnd(e) {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)

    const duration = Date.now() - dragStartTime

    // Si fue un simple toque (tap rápido y sin arrastre), cambiamos de foto
    if (!isDragging && duration < 280) {
      const rect = actualCard.getBoundingClientRect()
      const clickX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - rect.left
      if (clickX < rect.width * 0.4) {
        changeCardPhoto(actualCard, -1) // Foto anterior
      } else {
        changeCardPhoto(actualCard, 1)  // Foto siguiente
      }
      return
    }

    // Tomar decisión de arrastre
    const isSuper = pullDeltaY < -110 && Math.abs(pullDeltaX) < 70
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD || isSuper

    if (decisionMade) {
      isAnimating = true
      const profile = actualCard._profileData

      if (isSuper) {
        actualCard.classList.add('go-up')
        soundFX.playSuperLike()
        particleFX.burstStars()
        showToast(`¡Super Like enviado a ${profile.name}!`, '⭐')
        swipedCardsHistory.push({ element: actualCard, direction: 'up', profile })
        maybeTriggerMatch(profile)
      } else {
        const goRight = pullDeltaX > 0
        actualCard.classList.add(goRight ? 'go-right' : 'go-left')

        if (goRight) {
          soundFX.playLike()
          particleFX.burstHearts()
          showToast(`¡Te gusta ${profile.name}!`, '💚')
          swipedCardsHistory.push({ element: actualCard, direction: 'right', profile })
          maybeTriggerMatch(profile)
        } else {
          soundFX.playNope()
          showToast(`Has descartado a ${profile.name}`, '👋')
          swipedCardsHistory.push({ element: actualCard, direction: 'left', profile })
        }
      }

      updateUndoButtonState()

      actualCard.addEventListener('transitionend', () => {
        actualCard.remove()
        resetUnderlyingCard()
        checkEmptyDeckState()
        isAnimating = false
        pullDeltaX = 0
        pullDeltaY = 0
      }, { once: true })
    } else {
      // Regreso a posición de reposo
      actualCard.classList.add('reset')
      actualCard.querySelectorAll('.choice').forEach(c => (c.style.opacity = 0))
      resetUnderlyingCard()

      actualCard.addEventListener('transitionend', () => {
        actualCard.removeAttribute('style')
        actualCard.classList.remove('reset')
        pullDeltaX = 0
        pullDeltaY = 0
      }, { once: true })
    }
  }
}

// =========================================================================
// 7. SWIPE PROGRAMÁTICO (BOTONES Y TECLADO)
// =========================================================================

function triggerSwipe(type) {
  if (isAnimating) return

  const allCards = document.querySelectorAll('.cards article')
  if (allCards.length === 0) return

  const actualCard = allCards[allCards.length - 1]
  const profile = actualCard._profileData
  isAnimating = true

  if (type === 'like') {
    const choiceEl = actualCard.querySelector('.choice.like')
    if (choiceEl) choiceEl.style.opacity = 1
    actualCard.classList.add('go-right')
    soundFX.playLike()
    particleFX.burstHearts()
    showToast(`¡Te gusta ${profile.name}!`, '💚')
    swipedCardsHistory.push({ element: actualCard, direction: 'right', profile })
    maybeTriggerMatch(profile)
  } else if (type === 'nope') {
    const choiceEl = actualCard.querySelector('.choice.nope')
    if (choiceEl) choiceEl.style.opacity = 1
    actualCard.classList.add('go-left')
    soundFX.playNope()
    showToast(`Has descartado a ${profile.name}`, '👋')
    swipedCardsHistory.push({ element: actualCard, direction: 'left', profile })
  } else if (type === 'super') {
    const choiceEl = actualCard.querySelector('.choice.super')
    if (choiceEl) choiceEl.style.opacity = 1
    actualCard.classList.add('go-up')
    soundFX.playSuperLike()
    particleFX.burstStars()
    showToast(`¡Super Like enviado a ${profile.name}!`, '⭐')
    swipedCardsHistory.push({ element: actualCard, direction: 'up', profile })
    maybeTriggerMatch(profile)
  }

  updateUndoButtonState()
  updateUnderlyingCard(1)

  actualCard.addEventListener('transitionend', () => {
    actualCard.remove()
    resetUnderlyingCard()
    checkEmptyDeckState()
    isAnimating = false
  }, { once: true })
}

/**
 * Deshacer última acción (Undo)
 */
function undoLastSwipe() {
  if (isAnimating) return
  if (swipedCardsHistory.length === 0) {
    showToast('No hay acciones recientes para deshacer', 'ℹ️')
    return
  }

  isAnimating = true
  const lastAction = swipedCardsHistory.pop()
  const card = lastAction.element

  card.className = ''
  card.removeAttribute('style')
  card.querySelectorAll('.choice').forEach(choice => (choice.style.opacity = 0))

  if (lastAction.direction === 'right') {
    card.style.transform = 'translateX(130%) rotate(25deg)'
  } else if (lastAction.direction === 'left') {
    card.style.transform = 'translateX(-130%) rotate(-25deg)'
  } else {
    card.style.transform = 'translateY(-130%) scale(1.1)'
  }
  card.style.opacity = '0'

  const cardsContainer = document.getElementById('cardsDeck')
  cardsContainer.appendChild(card)

  void card.offsetWidth

  soundFX.playUndo()
  card.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.2), opacity 0.35s ease'
  card.style.transform = 'translateX(0) translateY(0) rotate(0deg) scale(1)'
  card.style.opacity = '1'

  showToast('Deshaciendo última acción...', '⏪')
  updateUndoButtonState()

  card.addEventListener('transitionend', () => {
    card.removeAttribute('style')
    isAnimating = false
  }, { once: true })
}

// =========================================================================
// 8. CELEBRACIÓN "¡ES UN MATCH!"
// =========================================================================

function maybeTriggerMatch(profile) {
  if (!profile.isMatch) return

  // Retardo de 400ms para permitir que la carta inicie su animación
  setTimeout(() => {
    openMatchModal(profile)
  }, 400)
}

function openMatchModal(profile) {
  const matchModal = document.getElementById('matchModal')
  if (!matchModal) return

  const partnerImg = document.getElementById('matchPartnerImg')
  const subheading = document.getElementById('matchSubheading')
  const inputMsg = document.getElementById('matchInputMessage')

  if (partnerImg) partnerImg.src = profile.photos[0]
  if (subheading) subheading.textContent = `A ti y a ${profile.name} os gustáis mutuamente`
  if (inputMsg) {
    inputMsg.value = ''
    inputMsg.placeholder = `Di algo a ${profile.name}...`
  }

  matchModal.classList.add('active')
  matchModal.setAttribute('aria-hidden', 'false')

  soundFX.playMatch()
  particleFX.burstConfetti(85)
}

function closeMatchModal() {
  const matchModal = document.getElementById('matchModal')
  if (matchModal) {
    matchModal.classList.remove('active')
    matchModal.setAttribute('aria-hidden', 'true')
  }
}

// =========================================================================
// 9. SUPER BOOST INTERACTIVO (DYNAMIC ISLAND EXPANDIBLE)
// =========================================================================

function triggerBoost() {
  soundFX.playBoost()
  particleFX.burstSparks()
  showToast('¡Super Boost Activado! Eres el perfil #1 en tu zona', '⚡')

  const boostAura = document.getElementById('boostAura')
  const dynamicIsland = document.getElementById('dynamicIsland')
  const islandContent = document.getElementById('islandContent')

  if (boostAura) boostAura.classList.add('active')
  if (dynamicIsland) dynamicIsland.classList.add('boost-active')

  let timeLeft = 30
  if (islandContent) {
    islandContent.innerHTML = `<span>⚡</span> <span>Boost: ${timeLeft}s</span>`
  }

  clearInterval(boostTimerInterval)
  boostTimerInterval = setInterval(() => {
    timeLeft--
    if (islandContent) {
      islandContent.innerHTML = `<span>⚡</span> <span>Boost: ${timeLeft}s</span>`
    }

    if (timeLeft <= 0) {
      clearInterval(boostTimerInterval)
      if (boostAura) boostAura.classList.remove('active')
      if (dynamicIsland) dynamicIsland.classList.remove('boost-active')
      if (islandContent) {
        islandContent.innerHTML = `<span class="island-dot"></span>`
      }
      showToast('Tu Super Boost ha finalizado', '✨')
    }
  }, 1000)
}

// =========================================================================
// 10. CAJÓN DE MENSAJES Y CHAT INTERACTIVO
// =========================================================================

function renderChatsDrawer() {
  const matchesCarousel = document.getElementById('matchesCarousel')
  const chatsList = document.getElementById('chatsList')

  // Renderizar Matches en carrusel
  if (matchesCarousel) {
    matchesCarousel.innerHTML = PROFILES_DATA.map(p => `
      <div class="match-bubble-item" data-id="${p.id}">
        <div class="match-bubble-avatar">
          <img src="${p.photos[0]}" alt="${p.name}" />
        </div>
        <span class="match-bubble-name">${p.name}</span>
      </div>
    `).join('')

    matchesCarousel.querySelectorAll('.match-bubble-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id
        const profile = PROFILES_DATA.find(p => p.id === id)
        if (profile) openActiveChat(profile)
      })
    })
  }

  // Renderizar Lista de Chats
  if (chatsList) {
    chatsList.innerHTML = conversationsData.map(c => `
      <div class="chat-item" data-id="${c.id}">
        <div class="chat-item-avatar">
          <img src="${c.avatar}" alt="${c.name}" />
          <span class="chat-online-dot"></span>
        </div>
        <div class="chat-item-content">
          <div class="chat-item-top">
            <span class="chat-item-name">${c.name}</span>
            <span class="chat-item-time">${c.time}</span>
          </div>
          <p class="chat-item-msg">${c.lastMessage}</p>
        </div>
      </div>
    `).join('')

    chatsList.querySelectorAll('.chat-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id
        const conv = conversationsData.find(c => c.id === id)
        if (conv) {
          const profile = PROFILES_DATA.find(p => p.id === id) || {
            id: conv.id,
            name: conv.name,
            photos: [conv.avatar]
          }
          openActiveChat(profile, conv)
        }
      })
    })
  }
}

let activeConversationTarget = null

function openActiveChat(profile, existingConv = null) {
  let conv = existingConv || conversationsData.find(c => c.id === profile.id)
  if (!conv) {
    conv = {
      id: profile.id,
      name: profile.name,
      avatar: profile.photos[0],
      lastMessage: 'Nuevo match',
      time: 'Ahora',
      unread: 0,
      messages: [
        { text: `¡Has hecho match con ${profile.name}! Di algo agradable.`, sent: false, time: 'Ahora' }
      ]
    }
    conversationsData.unshift(conv)
  }

  activeConversationTarget = conv

  const chatView = document.getElementById('activeChatView')
  const partnerAvatar = document.getElementById('chatPartnerAvatar')
  const partnerName = document.getElementById('chatPartnerName')
  const msgContainer = document.getElementById('chatMessagesContainer')

  if (partnerAvatar) partnerAvatar.src = conv.avatar
  if (partnerName) partnerName.textContent = conv.name

  if (msgContainer) {
    msgContainer.innerHTML = conv.messages.map(m => `
      <div class="bubble ${m.sent ? 'sent' : 'received'}">
        ${m.text}
        <div class="bubble-time">${m.time}</div>
      </div>
    `).join('')
    msgContainer.scrollTop = msgContainer.scrollHeight
  }

  if (chatView) chatView.classList.add('open')
  soundFX.playTap()
}

function sendChatMessage(text) {
  if (!text || !text.trim() || !activeConversationTarget) return

  const msgContainer = document.getElementById('chatMessagesContainer')
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Mensaje del usuario
  activeConversationTarget.messages.push({ text: text.trim(), sent: true, time: now })
  activeConversationTarget.lastMessage = text.trim()
  activeConversationTarget.time = now

  if (msgContainer) {
    const bubble = document.createElement('div')
    bubble.className = 'bubble sent'
    bubble.innerHTML = `${text.trim()}<div class="bubble-time">${now}</div>`
    msgContainer.appendChild(bubble)
    msgContainer.scrollTop = msgContainer.scrollHeight
  }

  soundFX.playMessage()

  // Respuesta simulada inteligente
  setTimeout(() => {
    const replies = [
      '¡Me encanta! Totalmente de acuerdo contigo 😊',
      'Jajaja qué risa, ¿y cuándo tomamos ese café? ☕',
      '¡Qué buen gusto! Definitivamente tenemos mucho en común ✨',
      'Estaba justo pensando en eso mismo! ¿Tienes libre este finde?'
    ]
    const replyText = replies[Math.floor(Math.random() * replies.length)]
    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    activeConversationTarget.messages.push({ text: replyText, sent: false, time: replyTime })
    activeConversationTarget.lastMessage = replyText
    activeConversationTarget.time = replyTime

    if (msgContainer) {
      const replyBubble = document.createElement('div')
      replyBubble.className = 'bubble received'
      replyBubble.innerHTML = `${replyText}<div class="bubble-time">${replyTime}</div>`
      msgContainer.appendChild(replyBubble)
      msgContainer.scrollTop = msgContainer.scrollHeight
    }

    soundFX.playMessage()
    renderChatsDrawer()
  }, 1400)
}

// =========================================================================
// 11. HOJA INFERIOR DE DETALLES DEL PERFIL (BOTTOM SHEET)
// =========================================================================

function openDetailSheet(profile) {
  currentDetailProfile = profile
  const sheet = document.getElementById('profileDetailSheet')
  if (!sheet) return

  const heroImg = document.getElementById('detailHeroImg')
  const nameAge = document.getElementById('detailNameAge')
  const occ = document.getElementById('detailOccupation')
  const metaPills = document.getElementById('detailMetaPills')
  const bio = document.getElementById('detailBioText')
  const tagsContainer = document.getElementById('detailTagsContainer')
  const songTitle = document.getElementById('detailSongTitle')
  const songArtist = document.getElementById('detailSongArtist')
  const spotifyArt = document.getElementById('detailSpotifyArt')

  if (heroImg) heroImg.src = profile.photos[0]
  if (nameAge) nameAge.innerHTML = `${profile.name} <span class="age">${profile.age}</span>`
  if (occ) occ.textContent = profile.occupation
  if (bio) bio.textContent = profile.bio

  if (metaPills) {
    metaPills.innerHTML = `
      <span class="tag-pill">📍 ${profile.distance}</span>
      <span class="tag-pill">🏙️ ${profile.city || 'Cerca de ti'}</span>
    `
  }

  if (tagsContainer) {
    tagsContainer.innerHTML = profile.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')
  }

  if (profile.spotify) {
    if (songTitle) songTitle.textContent = profile.spotify.song
    if (songArtist) songArtist.textContent = profile.spotify.artist
    if (spotifyArt) spotifyArt.src = profile.spotify.albumArt
  }

  sheet.classList.add('active')
  sheet.setAttribute('aria-hidden', 'false')
  soundFX.playTap()
}

function closeDetailSheet() {
  const sheet = document.getElementById('profileDetailSheet')
  if (sheet) {
    sheet.classList.remove('active')
    sheet.setAttribute('aria-hidden', 'true')
  }
}

// =========================================================================
// 12. PARALLAX 3D TILT AL MOVER EL RATÓN
// =========================================================================

function initTiltEffect() {
  const phone = document.getElementById('appPhone')
  if (!phone) return

  let tiltEnabled = localStorage.getItem('tinder_tilt_enabled') !== 'false'

  phone.addEventListener('mousemove', (e) => {
    if (!tiltEnabled || isDragging || isAnimating) return
    const topCard = document.querySelector('.cards article:last-of-type')
    if (!topCard) return

    const rect = topCard.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const rotY = (x / (rect.width / 2)) * 6
    const rotX = -(y / (rect.height / 2)) * 6

    topCard.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
  })

  phone.addEventListener('mouseleave', () => {
    const topCard = document.querySelector('.cards article:last-of-type')
    if (topCard && !isDragging) {
      topCard.style.transform = 'scale(1) translateY(0)'
    }
  })
}

// =========================================================================
// 13. INICIALIZACIÓN GENERAL & EVENT LISTENERS
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Iniciar reloj digital en tiempo real en la status bar
  const clockEl = document.getElementById('statusClock')
  function updateClock() {
    if (!clockEl) return
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const mins = now.getMinutes().toString().padStart(2, '0')
    clockEl.textContent = `${hours}:${mins}`
  }
  updateClock()
  setInterval(updateClock, 30000)

  // 2. Cargar Baraja de Perfiles inicial
  initializeDeck()
  renderChatsDrawer()
  initTiltEffect()

  // 3. Botones del Footer
  const btnUndo = document.getElementById('btnUndo')
  const btnNope = document.getElementById('btnNope')
  const btnSuperLike = document.getElementById('btnSuperLike')
  const btnLike = document.getElementById('btnLike')
  const btnBoost = document.getElementById('btnBoost')

  if (btnUndo) btnUndo.addEventListener('click', undoLastSwipe)
  if (btnNope) btnNope.addEventListener('click', () => triggerSwipe('nope'))
  if (btnSuperLike) btnSuperLike.addEventListener('click', () => triggerSwipe('super'))
  if (btnLike) btnLike.addEventListener('click', () => triggerSwipe('like'))
  if (btnBoost) btnBoost.addEventListener('click', triggerBoost)

  // 4. Botón de Reiniciar Baraja en Estado Vacío
  const btnReload = document.getElementById('btnReloadDeck')
  if (btnReload) {
    btnReload.addEventListener('click', () => {
      soundFX.playTap()
      initializeDeck()
      showToast('Baraja reiniciada con todos los perfiles', '🔄')
    })
  }

  // 5. Botones del Header
  const btnHeaderProfile = document.getElementById('btnHeaderProfile')
  const btnCloseProfile = document.getElementById('btnCloseProfile')
  const profileModal = document.getElementById('profileModal')

  if (btnHeaderProfile && profileModal) {
    btnHeaderProfile.addEventListener('click', () => {
      soundFX.playTap()
      profileModal.classList.add('active')
      profileModal.setAttribute('aria-hidden', 'false')
    })
  }

  if (btnCloseProfile && profileModal) {
    btnCloseProfile.addEventListener('click', () => {
      soundFX.playTap()
      profileModal.classList.remove('active')
      profileModal.setAttribute('aria-hidden', 'true')
    })
  }

  const btnHeaderMessages = document.getElementById('btnHeaderMessages')
  const btnCloseMessages = document.getElementById('btnCloseMessages')
  const messagesDrawer = document.getElementById('messagesDrawer')
  const activeChatView = document.getElementById('activeChatView')
  const btnBackToChats = document.getElementById('btnBackToChats')

  if (btnHeaderMessages && messagesDrawer) {
    btnHeaderMessages.addEventListener('click', () => {
      soundFX.playTap()
      messagesDrawer.classList.add('active')
      messagesDrawer.setAttribute('aria-hidden', 'false')
      renderChatsDrawer()
    })
  }

  if (btnCloseMessages && messagesDrawer) {
    btnCloseMessages.addEventListener('click', () => {
      soundFX.playTap()
      messagesDrawer.classList.remove('active')
      messagesDrawer.setAttribute('aria-hidden', 'true')
      if (activeChatView) activeChatView.classList.remove('open')
    })
  }

  if (btnBackToChats && activeChatView) {
    btnBackToChats.addEventListener('click', () => {
      soundFX.playTap()
      activeChatView.classList.remove('open')
      renderChatsDrawer()
    })
  }

  // Chat Input y Envío
  const chatInput = document.getElementById('chatTextInput')
  const btnSendChat = document.getElementById('btnSendChatMsg')

  if (btnSendChat && chatInput) {
    btnSendChat.addEventListener('click', () => {
      sendChatMessage(chatInput.value)
      chatInput.value = ''
    })

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage(chatInput.value)
        chatInput.value = ''
      }
    })
  }

  // Logo interactivo
  const btnHeaderLogo = document.getElementById('btnHeaderLogo')
  if (btnHeaderLogo) {
    btnHeaderLogo.addEventListener('click', () => {
      soundFX.playTap()
      particleFX.burstHearts(window.innerWidth / 2, 70, 15)
      showToast('¡Descubre personas increíbles cerca de ti!', '🔥')
    })
  }

  // Sonido Mute Toggle
  const btnSoundToggle = document.getElementById('btnSoundToggle')
  const iconSoundOn = document.getElementById('iconSoundOn')
  const iconSoundOff = document.getElementById('iconSoundOff')

  function updateSoundIcons(isMuted) {
    if (iconSoundOn && iconSoundOff) {
      iconSoundOn.classList.toggle('hidden', isMuted)
      iconSoundOff.classList.toggle('hidden', !isMuted)
    }
  }
  updateSoundIcons(soundFX.isMuted)

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      const isMuted = soundFX.toggleMute()
      updateSoundIcons(isMuted)
      const sfxSwitch = document.getElementById('sfxToggleSwitch')
      if (sfxSwitch) sfxSwitch.checked = !isMuted
      showToast(isMuted ? 'Sonidos silenciados' : 'Sonidos activados', isMuted ? '🔇' : '🔊')
    })
  }

  // Switch de SFX en el modal de perfil
  const sfxToggleSwitch = document.getElementById('sfxToggleSwitch')
  if (sfxToggleSwitch) {
    sfxToggleSwitch.checked = !soundFX.isMuted
    sfxToggleSwitch.addEventListener('change', (e) => {
      if (e.target.checked === soundFX.isMuted) {
        const isMuted = soundFX.toggleMute()
        updateSoundIcons(isMuted)
      }
    })
  }

  // Switch de Tilt 3D
  const tiltToggleSwitch = document.getElementById('tiltToggleSwitch')
  if (tiltToggleSwitch) {
    tiltToggleSwitch.checked = localStorage.getItem('tinder_tilt_enabled') !== 'false'
    tiltToggleSwitch.addEventListener('change', (e) => {
      localStorage.setItem('tinder_tilt_enabled', e.target.checked)
    })
  }

  // Sliders de distancia y edad
  const distSlider = document.getElementById('distSlider')
  const distValue = document.getElementById('distValue')
  if (distSlider && distValue) {
    distSlider.addEventListener('input', (e) => {
      distValue.textContent = `${e.target.value} km`
    })
  }

  const ageSlider = document.getElementById('ageSlider')
  const ageValue = document.getElementById('ageValue')
  if (ageSlider && ageValue) {
    ageSlider.addEventListener('input', (e) => {
      ageValue.textContent = `18 - ${e.target.value} años`
    })
  }

  const btnSaveProfileSettings = document.getElementById('btnSaveProfileSettings')
  if (btnSaveProfileSettings && profileModal) {
    btnSaveProfileSettings.addEventListener('click', () => {
      soundFX.playTap()
      profileModal.classList.remove('active')
      showToast('Preferencias guardadas exitosamente', '💾')
    })
  }

  // 6. Modal de Match
  const btnKeepSwiping = document.getElementById('btnKeepSwiping')
  const btnSendMatchMessage = document.getElementById('btnSendMatchMessage')
  const matchInputMessage = document.getElementById('matchInputMessage')

  if (btnKeepSwiping) {
    btnKeepSwiping.addEventListener('click', closeMatchModal)
  }

  if (btnSendMatchMessage && matchInputMessage) {
    btnSendMatchMessage.addEventListener('click', () => {
      const text = matchInputMessage.value
      closeMatchModal()
      if (messagesDrawer) {
        messagesDrawer.classList.add('active')
        const lastSwiped = swipedCardsHistory[swipedCardsHistory.length - 1]
        if (lastSwiped && lastSwiped.profile) {
          openActiveChat(lastSwiped.profile)
          if (text) sendChatMessage(text)
        }
      }
    })
  }

  // 7. Hoja de Detalles (Bottom Sheet)
  const btnCloseDetailSheet = document.getElementById('btnCloseDetailSheet')
  if (btnCloseDetailSheet) {
    btnCloseDetailSheet.addEventListener('click', closeDetailSheet)
  }

  const btnSheetNope = document.getElementById('btnSheetNope')
  const btnSheetSuper = document.getElementById('btnSheetSuper')
  const btnSheetLike = document.getElementById('btnSheetLike')

  if (btnSheetNope) {
    btnSheetNope.addEventListener('click', () => {
      closeDetailSheet()
      triggerSwipe('nope')
    })
  }

  if (btnSheetSuper) {
    btnSheetSuper.addEventListener('click', () => {
      closeDetailSheet()
      triggerSwipe('super')
    })
  }

  if (btnSheetLike) {
    btnSheetLike.addEventListener('click', () => {
      closeDetailSheet()
      triggerSwipe('like')
    })
  }

  // Reproductor simulado de Spotify en Bottom Sheet
  const spotifyCard = document.querySelector('.spotify-card')
  if (spotifyCard) {
    spotifyCard.addEventListener('click', () => {
      soundFX.playLike()
      showToast('Reproduciendo vista previa del himno en Spotify', '🎵')
    })
  }

  // Dynamic Island click
  const dynamicIsland = document.getElementById('dynamicIsland')
  if (dynamicIsland) {
    dynamicIsland.addEventListener('click', () => {
      soundFX.playTap()
      if (!dynamicIsland.classList.contains('boost-active')) {
        showToast('Dynamic Island: Todas las conexiones activas', '🟢')
      }
    })
  }
})

// Listeners globales para arrastre táctil / ratón
document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })

// Atajos de teclado para escritorio
document.addEventListener('keydown', (event) => {
  // No capturar teclas si el usuario está escribiendo en un input
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

  if (event.key === 'ArrowLeft') {
    triggerSwipe('nope')
  } else if (event.key === 'ArrowRight') {
    triggerSwipe('like')
  } else if (event.key === 'ArrowUp') {
    triggerSwipe('super')
  } else if (event.key === 'z' || event.key === 'Z') {
    undoLastSwipe()
  } else if (event.key === ' ') {
    event.preventDefault()
    const topCard = document.querySelector('.cards article:last-of-type')
    if (topCard) changeCardPhoto(topCard, 1)
  } else if (event.key === 'i' || event.key === 'I') {
    const topCard = document.querySelector('.cards article:last-of-type')
    if (topCard && topCard._profileData) {
      openDetailSheet(topCard._profileData)
    }
  } else if (event.key === 'Escape') {
    closeMatchModal()
    closeDetailSheet()
    const profileModal = document.getElementById('profileModal')
    if (profileModal) profileModal.classList.remove('active')
    const messagesDrawer = document.getElementById('messagesDrawer')
    if (messagesDrawer) messagesDrawer.classList.remove('active')
  }
})
