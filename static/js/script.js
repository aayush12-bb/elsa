// Floating Hearts Background generator
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts-bg');
    const heartSymbols = ['❤️', '💖', '💕', '🌸', '✨'];

    // Create new heart every 400ms
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart-shape');
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

        // Randomize size, starting x-position, and animation duration
        const size = Math.random() * 1.5 + 0.5;
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5; // 5 to 10 seconds

        heart.style.fontSize = `${size}rem`;
        heart.style.left = `${left}vw`;
        heart.style.animationDuration = `${duration}s`;

        container.appendChild(heart);

        // Remove heart after it floats up to prevent DOM bloat
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 400);
}

// Countdown Timer Layout
function initCountdown() {
    // Set birthday date (e.g. Next month, or some specific target)
    // For now, let's set it to tomorrow so we can see the countdown working.
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);

    const updateTime = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff < 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    };

    updateTime();
    setInterval(updateTime, 1000);
}

// Scroll Intersection Observer for fade-in elements
function initScrollObserver() {
    const scrollElements = document.querySelectorAll('.scroll-element');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.1)) {
                displayScrollElement(el);
            }
        });
    }

    // Trigger once on load
    handleScrollAnimation();

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// Background Music Toggle
function initMusicPlayer() {
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    if (!musicBtn || !bgMusic) return;

    const icon = musicBtn.querySelector('i');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed, check user interaction.", e));
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    });
}

// Add New Wish functionality
function initWishForm() {
    const addWishBtn = document.getElementById('add-wish-btn');
    const newWishInput = document.getElementById('new-wish');
    const wishesList = document.getElementById('wishes-list');

    if (!addWishBtn || !newWishInput || !wishesList) return;

    addWishBtn.addEventListener('click', () => {
        const text = newWishInput.value.trim();
        if (text) {
            // Send wish to the server
            fetch('/add_wish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wish: text })
            }).then(response => {
                console.log("Wish saved to server");
            }).catch(error => {
                console.error("Error saving wish:", error);
            });

            const card = document.createElement('div');
            card.className = 'wish-card scroll-element visible';
            card.innerHTML = `<p>"${text}"</p>`;
            wishesList.appendChild(card);
            newWishInput.value = '';
        }
    });

    // allow pressing enter
    newWishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWishBtn.click();
        }
    });
}

// Surprise Button functionality with Canvas Confetti
function initSurprise() {
    const surpriseBtn = document.getElementById('surprise-btn');
    const hiddenSurprise = document.getElementById('hidden-surprise');

    if (!surpriseBtn || !hiddenSurprise) return;

    surpriseBtn.addEventListener('click', () => {
        surpriseBtn.classList.add('hidden');
        hiddenSurprise.classList.remove('hidden');

        // Fire confetti
        const end = Date.now() + (3 * 1000);
        const colors = ['#ffb6c1', '#b76e79', '#ffffff'];

        (function frame() {
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }
        }());
    });
}

// Load wishes from backend API
function loadWishes() {
    fetch('/get_wishes')
        .then(response => response.json())
        .then(data => {
            const wishesList = document.getElementById('wishes-list');
            if (data.wishes && wishesList) {
                data.wishes.forEach(text => {
                    const card = document.createElement('div');
                    card.className = 'wish-card scroll-element visible';
                    card.innerHTML = `<p>"${text}"</p>`;
                    wishesList.appendChild(card);
                });
            }
        })
        .catch(err => console.error("Error fetching. Ensure the python app.py server is running!", err));
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    initCountdown();
    initScrollObserver();
    initMusicPlayer();
    initWishForm();
    initSurprise();
    loadWishes();
});
