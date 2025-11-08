class PresentationController {
    currentSlide: number = 0;
    totalSlides: number = 9;
    isPlaying: boolean = true;
    autoPlayInterval: number | null = null;
    slideDuration: number = 7000; // 7 seconds per slide

    constructor() {
        this.init();
    }

    init() {
        this.createIndicators();
        this.bindEvents();
        this.startAutoPlay();
        this.updateSlide();
    }

    createIndicators() {
        const container = document.getElementById('indicators');
        if (!container) return;
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            container.appendChild(indicator);
        }
    }

    bindEvents() {
        document.getElementById('prevBtn')?.addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn')?.addEventListener('click', () => this.nextSlide());
        document.getElementById('playPauseBtn')?.addEventListener('click', () => this.toggleAutoPlay());

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Pause autoplay on hover over controls to prevent accidental slide changes
        const controls = document.querySelector('.controls');
        let wasPlayingOnHover = false;
        controls?.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                wasPlayingOnHover = true;
                this.stopAutoPlay();
            }
        });

        controls?.addEventListener('mouseleave', () => {
            if (wasPlayingOnHover) {
                wasPlayingOnHover = false;
                this.startAutoPlay();
            }
        });
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return; // Prevent multiple intervals
        this.isPlaying = true;
        this.updatePlayPauseIcon();
        this.autoPlayInterval = window.setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        this.updatePlayPauseIcon();
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    toggleAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    updatePlayPauseIcon() {
        const icon = document.getElementById('playPauseIcon');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        const button = document.getElementById('playPauseBtn');
        if (button) {
            button.classList.toggle('pause', this.isPlaying);
        }
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
        this.restartAutoPlay();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }

    goToSlide(index: number) {
        this.currentSlide = index;
        this.updateSlide();
        this.restartAutoPlay();
    }

    updateSlide() {
        const wrapper = document.getElementById('slidesWrapper') as HTMLElement;
        if (wrapper) {
            wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        document.querySelectorAll('.indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentSlide);
        });

        if (this.currentSlide === 0) {
            this.animateSlide1();
        }
    }

    animateSlide1() {
        const title = document.querySelector('#slide1 h1') as HTMLElement;
        const subtitle = document.querySelector('#slide1 .subtitle') as HTMLElement;
        const context = document.querySelector('#slide1 .context') as HTMLElement;

        if (!title || !subtitle || !context) return;
        
        // Reset animations to allow re-triggering
        title.style.animation = 'none';
        subtitle.style.animation = 'none';
        context.style.animation = 'none';

        // Re-trigger animation after a short delay
        setTimeout(() => {
            title.style.animation = 'fadeInDown 1s ease 0.5s forwards';
            subtitle.style.animation = 'fadeInUp 1s ease 0.8s forwards';
            context.style.animation = 'fadeInUp 1s ease 1.1s forwards';
        }, 100);
    }

    restartAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }
}

// Initialize the presentation controller
new PresentationController();

// Prevent default browser scroll on arrow key press
window.addEventListener('keydown', (e: KeyboardEvent) => {
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});
