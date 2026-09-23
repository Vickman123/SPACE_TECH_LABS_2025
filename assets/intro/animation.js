document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading');
    const dialog = document.querySelector('.dialog');
    const audio = document.getElementById('introAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const skipBtn = document.getElementById('skipBtn');

    if (!loadingScreen) return;

    // Bloquear scroll de la página mientras el intro está activo
    document.body.style.overflow = 'hidden';

    // Texto con efecto mecanógrafo (Typewriter)
    const introText = "SPACE TECH LABS";
    let charIndex = 0;
    let isFinished = false;

    function typeWriter() {
        if (charIndex < introText.length) {
            if (dialog) {
                dialog.textContent += introText.charAt(charIndex);
            }
            charIndex++;
            setTimeout(typeWriter, 120);
        }
    }

    // Iniciar mecanografía
    typeWriter();

    // Reproducir audio con manejo de políticas de autoplay del navegador
    if (audio) {
        audio.volume = 0.8;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (playPauseBtn) playPauseBtn.innerHTML = '&#10074;&#10074;'; // Ícono de pausa
            }).catch(() => {
                // Autoplay bloqueado por políticas del navegador
                if (playPauseBtn) playPauseBtn.innerHTML = '&#9658;'; // Ícono de play
            });
        }

        // Finalizar intro automáticamente al terminar el audio
        audio.addEventListener('ended', finishIntro);
    }

    function finishIntro() {
        if (isFinished) return;
        isFinished = true;

        if (audio) {
            audio.pause();
        }

        loadingScreen.classList.add('fadeOutUp');
        document.body.style.overflow = '';

        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }

    // Botón Play / Pausa
    if (playPauseBtn && audio) {
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    playPauseBtn.innerHTML = '&#10074;&#10074;';
                }).catch(err => console.error('Error al reproducir audio:', err));
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '&#9658;';
            }
        });
    }

    // Botón Omitir (Skip)
    if (skipBtn) {
        skipBtn.addEventListener('click', finishIntro);
    }

    // Fallback: finalizar intro automáticamente después de 6 segundos por seguridad
    setTimeout(() => {
        finishIntro();
    }, 6000);
});
