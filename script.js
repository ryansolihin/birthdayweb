/**
 * Interactive Script for Romantic Birthday Landing Page
 * Features:
 * - Real Web Audio API Romantic Ambient Chords Synthesizer (Works 100% offline & zero broken links)
 * - Interactive Music Player with play/pause, scrub, next/prev, rotating vinyl
 * - Love Coupon Claim system with confetti cannon & sweet modal
 * - Gallery Lightbox modal with next/prev navigation
 * - Story Modal & Mystery Gift Modal
 * - Gentle drifting rose petals background
 */

document.addEventListener('DOMContentLoaded', () => {
  initMusicPlayer();
  initCoupons();
  initGalleryLightbox();
  initModals();
  initPetals();
});

/* ==========================================================================
   1. MUSIC PLAYER WITH WEB AUDIO SYNTHESIZER
   ========================================================================== */
function initMusicPlayer() {
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const vinylRecord = document.getElementById('vinyl-record');
  const songTitleEl = document.getElementById('song-title');
  const artistNameEl = document.getElementById('artist-name');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const progressFill = document.getElementById('progress-fill');
  const progressBar = document.getElementById('progress-bar');
  const floatingSoundBtn = document.getElementById('floating-sound-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  const playlist = [
    {
      title: 'Sampai Jadi Debu',
      artist: 'Banda Neira',
      src: 'assets/sampai_jadi_debu.mp3',
      alternateSrcs: [
        'assets/lagu/sampai_jadi_debu.mp3',
        'assets/lagu/sampai_jadi_debu.mp3.mp3'
      ],
      duration: 225, // 3:45
      notes: [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 349.23, 329.63] // C, E, G, C, A, G, F, E
    },
    // {
    //   title: 'Golden Hour',
    //   artist: 'JVKE',
    //   src: 'assets/golden_hour.mp3',
    //   duration: 209, // 3:29
    //   notes: [293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 329.63, 293.66]
    // },
    // {
    //   title: 'Until I Found You',
    //   artist: 'Stephen Sanchez',
    //   src: 'assets/until_i_found_you.mp3',
    //   duration: 178, // 2:58
    //   notes: [329.63, 392.00, 493.88, 659.25, 493.88, 392.00, 440.00, 392.00]
    // }
  ];

  let currentTrackIndex = 0;
  let currentAltIndex = 0;
  let isPlaying = false;
  let isUsingRealAudio = false;
  let playbackTimer = null;
  let currentSeconds = 0;
  let audioCtx = null;
  let synthInterval = null;

  // Real HTML5 Audio Element for playing local/online MP3
  const audio = new Audio();
  audio.preload = 'metadata';

  function formatTime(secs) {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function loadTrack(index) {
    currentTrackIndex = index;
    currentAltIndex = 0;
    const track = playlist[currentTrackIndex];
    if (songTitleEl) songTitleEl.textContent = track.title;
    if (artistNameEl) artistNameEl.textContent = track.artist;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(track.duration);
    if (currentTimeEl) currentTimeEl.textContent = '00:00';
    if (progressFill) progressFill.style.width = '0%';
    currentSeconds = 0;

    audio.src = track.src;
  }

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
      playlist[currentTrackIndex].duration = Math.floor(audio.duration);
      if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (isPlaying && isUsingRealAudio) {
      const cur = audio.currentTime;
      const dur = audio.duration || playlist[currentTrackIndex].duration;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(cur);
      const percentage = (cur / dur) * 100;
      if (progressFill) progressFill.style.width = `${Math.min(100, percentage)}%`;
    }
  });

  audio.addEventListener('ended', () => {
    nextTrack();
  });

  audio.addEventListener('error', () => {
    const track = playlist[currentTrackIndex];
    // Check if alternate source exists
    if (track.alternateSrcs && currentAltIndex < track.alternateSrcs.length) {
      const altSrc = track.alternateSrcs[currentAltIndex++];
      audio.src = altSrc;
      if (isPlaying) {
        audio.play().catch(() => { });
      }
      return;
    }

    // If all audio sources fail, fallback to acoustic ambient synth
    if (isPlaying && isUsingRealAudio) {
      console.warn('File audio belum ditemukan, memutar instrumen synthesizer bawaan...');
      isUsingRealAudio = false;
      startAcousticSynth();
      startFallbackTimer();
    }
  });

  function updateTrackDisplay() {
    const track = playlist[currentTrackIndex];
    if (songTitleEl) songTitleEl.textContent = track.title;
    if (artistNameEl) artistNameEl.textContent = track.artist;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(track.duration);
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentSeconds);
    const percentage = (currentSeconds / track.duration) * 100;
    if (progressFill) progressFill.style.width = `${Math.min(100, percentage)}%`;
  }

  // Soft Ambient Piano Synth using Web Audio API (fallback)
  function startAcousticSynth() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      let noteIdx = 0;
      const track = playlist[currentTrackIndex];

      const playChord = () => {
        if (!isPlaying || !audioCtx) return;
        const now = audioCtx.currentTime;
        const baseFreq = track.notes[noteIdx % track.notes.length];
        noteIdx++;

        const chordFreqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

        chordFreqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const peakGain = 0.04 / (idx + 1);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(peakGain, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now);
          osc.stop(now + 2.5);
        });
      };

      playChord();
      if (synthInterval) clearInterval(synthInterval);
      synthInterval = setInterval(playChord, 1200);
    } catch (e) {
      console.log('Audio Context notice:', e);
    }
  }

  function stopAcousticSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function startFallbackTimer() {
    if (playbackTimer) clearInterval(playbackTimer);
    playbackTimer = setInterval(() => {
      currentSeconds++;
      const track = playlist[currentTrackIndex];
      if (currentSeconds >= track.duration) {
        nextTrack();
      } else {
        updateTrackDisplay();
      }
    }, 1000);
  }

  function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (vinylRecord) vinylRecord.classList.remove('paused');
      if (floatingSoundBtn) floatingSoundBtn.classList.add('animate-pulse');

      // Attempt to play actual MP3 file
      isUsingRealAudio = true;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Real audio playing successfully!
            isUsingRealAudio = true;
            stopAcousticSynth();
            if (playbackTimer) clearInterval(playbackTimer);
          })
          .catch((err) => {
            // File not found or blocked by browser -> switch to fallback synth
            console.warn('Memutar synthesizer audio bawaan:', err.message);
            isUsingRealAudio = false;
            startAcousticSynth();
            startFallbackTimer();
          });
      }
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (vinylRecord) vinylRecord.classList.add('paused');
      if (floatingSoundBtn) floatingSoundBtn.classList.remove('animate-pulse');

      audio.pause();
      stopAcousticSynth();
      if (playbackTimer) clearInterval(playbackTimer);
    }
  }

  function nextTrack() {
    loadTrack((currentTrackIndex + 1) % playlist.length);
    if (isPlaying) {
      audio.pause();
      stopAcousticSynth();
      if (playbackTimer) clearInterval(playbackTimer);
      togglePlay();
      togglePlay(); // re-trigger play
    }
  }

  function prevTrack() {
    loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
    if (isPlaying) {
      audio.pause();
      stopAcousticSynth();
      if (playbackTimer) clearInterval(playbackTimer);
      togglePlay();
      togglePlay(); // re-trigger play
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (floatingSoundBtn) floatingSoundBtn.addEventListener('click', togglePlay);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const track = playlist[currentTrackIndex];
      const targetSecs = (clickX / width) * (audio.duration || track.duration);

      if (isUsingRealAudio && !isNaN(audio.duration)) {
        audio.currentTime = targetSecs;
      } else {
        currentSeconds = Math.max(0, Math.min(Math.floor(targetSecs), track.duration));
        updateTrackDisplay();
      }
    });
  }

  // Load first track
  loadTrack(0);
}

/* ==========================================================================
   2. LOVE COUPONS REDEEM LOGIC & CONFETTI
   ========================================================================== */
function initCoupons() {
  const couponButtons = document.querySelectorAll('.redeem-coupon-btn');
  const couponModal = document.getElementById('coupon-modal');
  const couponModalTitle = document.getElementById('coupon-modal-title');
  const couponModalDesc = document.getElementById('coupon-modal-desc');
  const closeCouponModal = document.getElementById('close-coupon-modal');

  // Load redeemed status from localStorage
  const redeemedState = JSON.parse(localStorage.getItem('redeemed_coupons') || '{}');

  couponButtons.forEach((btn) => {
    const couponId = btn.dataset.couponId;
    if (redeemedState[couponId]) {
      markButtonAsRedeemed(btn, redeemedState[couponId]);
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.couponTitle;
      const desc = btn.dataset.couponDesc;

      // Confetti burst
      triggerConfetti();

      // Save state
      const now = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      redeemedState[couponId] = now;
      localStorage.setItem('redeemed_coupons', JSON.stringify(redeemedState));
      markButtonAsRedeemed(btn, now);

      // Open Modal
      if (couponModalTitle) couponModalTitle.textContent = title;
      if (couponModalDesc) couponModalDesc.textContent = `"${desc}" telah berhasil diklaim! Simpan bukti ini dan katakan padaku kapan kamu ingin menikmatinya ❤️`;
      if (couponModal) couponModal.classList.remove('hidden');
    });
  });

  if (closeCouponModal && couponModal) {
    closeCouponModal.addEventListener('click', () => {
      couponModal.classList.add('hidden');
    });
    couponModal.addEventListener('click', (e) => {
      if (e.target === couponModal) couponModal.classList.add('hidden');
    });
  }
}

function markButtonAsRedeemed(btn, dateStr) {
  btn.innerHTML = `<span class="inline-flex items-center gap-1 text-emerald-600 font-bold">✓ CLAIMED (${dateStr})</span>`;
  btn.classList.remove('text-[#9B2242]', 'hover:underline');
  btn.classList.add('cursor-default', 'opacity-90');
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9B2242', '#E88599', '#FCE7EC', '#FFD1DC', '#FAF7F5']
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9B2242', '#F7D6DC', '#ffffff']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9B2242', '#F7D6DC', '#ffffff']
      });
    }, 250);
  }
}

/* ==========================================================================
   3. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxLoc = document.getElementById('lightbox-location');
  const closeLightbox = document.getElementById('close-lightbox');
  const prevLightbox = document.getElementById('prev-lightbox');
  const nextLightbox = document.getElementById('next-lightbox');

  if (!lightboxModal) return;

  const galleryData = Array.from(galleryItems).map((card) => ({
    src: card.querySelector('img').src,
    title: card.querySelector('.gallery-title')?.textContent || '',
    location: card.querySelector('.gallery-location')?.textContent || ''
  }));

  let currentGalleryIndex = 0;

  function showLightboxIndex(index) {
    currentGalleryIndex = (index + galleryData.length) % galleryData.length;
    const data = galleryData[currentGalleryIndex];
    if (lightboxImg) lightboxImg.src = data.src;
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxLoc) lightboxLoc.textContent = data.location;
    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxModal() {
    lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((card, index) => {
    card.addEventListener('click', () => {
      showLightboxIndex(index);
    });
  });

  if (closeLightbox) closeLightbox.addEventListener('click', closeLightboxModal);
  if (prevLightbox) {
    prevLightbox.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxIndex(currentGalleryIndex - 1);
    });
  }
  if (nextLightbox) {
    nextLightbox.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxIndex(currentGalleryIndex + 1);
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightboxModal();
  });

  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightboxModal();
    if (e.key === 'ArrowLeft') showLightboxIndex(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') showLightboxIndex(currentGalleryIndex + 1);
  });
}

/* ==========================================================================
   4. MODALS (STORY & GIFT)
   ========================================================================== */
function initModals() {
  // Story Modal
  const storyBtn = document.getElementById('story-btn');
  const storyModal = document.getElementById('story-modal');
  const closeStoryModal = document.getElementById('close-story-modal');

  if (storyBtn && storyModal) {
    storyBtn.addEventListener('click', () => {
      storyModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeStoryModal && storyModal) {
    closeStoryModal.addEventListener('click', () => {
      storyModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        storyModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  // Gift Modal
  const giftBtn = document.getElementById('gift-btn');
  const giftModal = document.getElementById('gift-modal');
  const closeGiftModal = document.getElementById('close-gift-modal');

  if (giftBtn && giftModal) {
    giftBtn.addEventListener('click', () => {
      triggerConfetti();
      giftModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeGiftModal && giftModal) {
    closeGiftModal.addEventListener('click', () => {
      giftModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
    giftModal.addEventListener('click', (e) => {
      if (e.target === giftModal) {
        giftModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   5. DRIFTING ROSE PETALS BACKGROUND CANVAS
   ========================================================================== */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 20;
  const petals = [];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: Math.random() * 0.5 - 0.25,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.4 + 0.2
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    // Romantic rose petal curve
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size * 1.4);
    ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
    ctx.fillStyle = '#F5B0C2';
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.4 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    });

    requestAnimationFrame(animate);
  }

  animate();
}
