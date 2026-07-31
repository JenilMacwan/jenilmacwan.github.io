document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Single-Pass Syntax Highlighter (Prevents HTML Tag Attribute Corruption)
    // ==========================================================================
    function highlightSyntax(code) {
        // Escape HTML special characters first
        const escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Single pass matching comments, strings, annotations (@Name), and keywords
        const syntaxRegex = /(\/\/.*)|(".*?")|(@\w+)|\b(fun|val|by|class|import|from|async|def|return)\b/g;

        return escaped.replace(syntaxRegex, (match, comment, string, annotation, keyword) => {
            if (comment) return `<span class="code-comment">${comment}</span>`;
            if (string) return `<span class="code-string">${string}</span>`;
            if (annotation) return `<span class="code-annotation">${annotation}</span>`;
            if (keyword) return `<span class="code-keyword">${keyword}</span>`;
            return match;
        });
    }

    // ==========================================================================
    // Theme Swapper (Light/Dark Mode)
    // ==========================================================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const metaTheme = document.getElementById('metaTheme');

    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateMetaThemeColor(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = htmlElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateMetaThemeColor(newTheme);
        });
    }

    function updateMetaThemeColor(theme) {
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0e0d11' : '#fef7ff');
        }
    }

    // ==========================================================================
    // Navigation & Burger Menu
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navBurger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }
        });
    }

    if (navBurger && mobileMenu) {
        navBurger.addEventListener('click', () => {
            const isExpanded = navBurger.getAttribute('aria-expanded') === 'true';
            navBurger.setAttribute('aria-expanded', !isExpanded);

            if (isExpanded) {
                mobileMenu.setAttribute('hidden', '');
            } else {
                mobileMenu.removeAttribute('hidden');
            }
        });
    }

    const mobileLinks = document.querySelectorAll('.mobile-nav__link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navBurger) navBurger.setAttribute('aria-expanded', 'false');
            if (mobileMenu) mobileMenu.setAttribute('hidden', '');
        });
    });

    // ==========================================================================
    // Android Studio Mockup File Switcher & Simulator Link
    // ==========================================================================
    const fileItems = document.querySelectorAll('.ide__file-item');
    const tabName = document.getElementById('tabName');
    const codePane = document.getElementById('codePane');
    const simScreens = document.querySelectorAll('.sim-screen');
    const ideContainer = document.getElementById('ide');

    const codeTemplates = [
        // Index 0: F1Companion.kt
        `@Composable
fun F1DashboardScreen(
    viewModel: F1ViewModel = hiltViewModel()
) {
    val raceState by viewModel.raceState.collectAsState()
    
    LazyColumn(modifier = Modifier.fillMaxSize()) {
        item {
            NextRaceCard(
                race = raceState.nextRace,
                countdown = raceState.countdown
            )
        }
    }
}`,
        // Index 1: DocShare.kt
        `@Composable
fun DocShareScreen(
    viewModel: DocShareViewModel = hiltViewModel()
) {
    val docSummary by viewModel.documentSummary.collectAsState()
    
    Column(modifier = Modifier.padding(16.dp)) {
        DocumentCard(doc = viewModel.activeDoc)
        
        GeminiSummaryView(
            summary = docSummary.text,
            onGenerateGuide = { viewModel.buildStudyGuide() }
        )
    }
}`,
        // Index 2: F1Backend.py
        `from fastapi import FastAPI, Depends
from .services import F1DataService

app = FastAPI(title="F1 Companion API")

@app.get("/api/v1/f1/standings")
async def get_f1_standings(
    service: F1DataService = Depends()
):
    data = await service.fetch_consolidated_standings()
    return {"status": "success", "data": data}`
    ];

    if (fileItems.length > 0) {
        fileItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabIdx = parseInt(item.getAttribute('data-tab'), 10) || 0;

                // Toggle Active Class in Sidebar
                fileItems.forEach(fi => fi.classList.remove('active'));
                item.classList.add('active');

                // Update Tab Name
                if (tabName) {
                    const fileName = item.textContent.trim().replace(/^[K|Py]\s+/, '');
                    tabName.textContent = fileName;
                }

                // Apply Single-Pass Syntax Highlighting
                if (codePane && codeTemplates[tabIdx] !== undefined) {
                    codePane.innerHTML = highlightSyntax(codeTemplates[tabIdx]);
                }

                // Switch preview screens
                simScreens.forEach(screen => screen.classList.remove('active'));
                const activeScreen = document.querySelector(`.sim-screen[data-sim="${tabIdx}"]`);
                if (activeScreen) {
                    activeScreen.classList.add('active');
                }
            });
        });

        // Auto-switch tabs in code editor mockup every 8s
        let ideInterval = setInterval(autoSlideIde, 8000);

        function autoSlideIde() {
            const activeItem = document.querySelector('.ide__file-item.active') || fileItems[0];
            const currentTab = parseInt(activeItem.getAttribute('data-tab'), 10) || 0;
            let nextIdx = (currentTab + 1) % fileItems.length;
            fileItems[nextIdx].click();
        }

        // Pause / Extend interval if user clicks manually inside IDE
        if (ideContainer) {
            ideContainer.addEventListener('click', () => {
                clearInterval(ideInterval);
                ideInterval = setInterval(autoSlideIde, 12000);
            });
        }

        // Trigger initial click for first tab
        fileItems[0].click();
    }

    // ==========================================================================
    // Statistics Counters Animation
    // ==========================================================================
    function initCounters() {
        const stats = document.querySelectorAll('.stat');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const numberEl = stat.querySelector('.stat__number') || stat;

                    // Support data attributes on parent .stat or child .stat__number
                    const targetAttr = stat.getAttribute('data-target') || numberEl.getAttribute('data-target');
                    const suffix = stat.getAttribute('data-suffix') || numberEl.getAttribute('data-suffix') || '';
                    const decimalsAttr = stat.getAttribute('data-decimals') || numberEl.getAttribute('data-decimals');

                    const target = parseFloat(targetAttr) || 0;
                    const decimals = parseInt(decimalsAttr, 10) || 0;
                    const duration = 1500;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = progress * (2 - progress); // outQuad
                        const currentValue = easeProgress * target;

                        numberEl.textContent = currentValue.toFixed(decimals) + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.3 });

        stats.forEach(stat => observer.observe(stat));
    }

    // ==========================================================================
    // Scroll Reveal Trigger Setup
    // ==========================================================================
    function initScrollReveals() {
        const reveals = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // Initialize observers
    initCounters();
    initScrollReveals();
});