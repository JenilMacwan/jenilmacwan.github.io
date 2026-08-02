var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var pointerFine = window.matchMedia('(pointer: fine)').matches;

// live clock in phone mockup
function updateClock() {
    var el = document.getElementById('clock');
    if (!el) return;
    var d = new Date();
    var h = d.getHours().toString().padStart(2, '0');
    var m = d.getMinutes().toString().padStart(2, '0');
    el.textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 30000);

// boot sequence
var boot = document.getElementById('boot');
var bootFill = document.getElementById('bootFill');
var heroAnim = document.getElementById('heroAnim');
var phoneShell = document.getElementById('phoneShell');

function startExperience() {
    if (heroAnim) heroAnim.classList.add('show');
    if (phoneShell) phoneShell.classList.add('show');
}

if (prefersReduced) {
    if (boot) boot.classList.add('hide');
    startExperience();
} else {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
        if (bootFill) bootFill.style.width = '100%';
    });
    setTimeout(function () {
        if (boot) boot.classList.add('hide');
        document.body.style.overflow = '';
        startExperience();
    }, 950);
}

// reveal on scroll
var revealEls = document.querySelectorAll('.reveal, .project-card');
var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach(function (el) { io.observe(el); });

// staggered reveal for the skills card grid
var skillsGrid = document.getElementById('skillsGrid');
if (skillsGrid) {
    var skillsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                skillsGrid.classList.add('in-view');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    skillsObserver.observe(skillsGrid);
}

// scroll progress bar
var scrollFill = document.getElementById('scrollFill');
function updateScrollProgress() {
    if (!scrollFill) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    scrollFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// phone tilt on hover (desktop, fine pointer only)
if (phoneShell && pointerFine && !prefersReduced) {
    phoneShell.addEventListener('mousemove', function (e) {
        var rect = phoneShell.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        phoneShell.classList.add('tilting');
        phoneShell.style.transform = 'translateY(0) scale(1) rotateY(' + (x * 12) + 'deg) rotateX(' + (y * -12) + 'deg)';
    });
    phoneShell.addEventListener('mouseleave', function () {
        phoneShell.classList.remove('tilting');
        phoneShell.style.transform = '';
    });
}

// ripple on buttons
document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        if (prefersReduced) return;
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
    });
});

// copy to clipboard + toast
var toast = document.getElementById('toast');
var toastTimer;
function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
}
document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () {
        var val = el.getAttribute('data-copy');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(val).then(function () {
                showToast('Copied ' + val);
            }).catch(function () { });
        }
    });
});

// animated stat counters
var counted = false;
var statEls = document.querySelectorAll('.stat-tile .num');
var phoneObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
            counted = true;
            statEls.forEach(function (el) {
                var target = parseInt(el.getAttribute('data-target'), 10);
                var current = 0;
                var step = Math.max(1, Math.round(target / 30));
                var t = setInterval(function () {
                    current += step;
                    if (current >= target) { current = target; clearInterval(t); }
                    el.textContent = current;
                }, 30);
            });
            phoneObserver.disconnect();
        }
    });
}, { threshold: 0.3 });
if (phoneShell) phoneObserver.observe(phoneShell);

// bottom nav active state via scroll position
var sections = ['home', 'projects', 'skills', 'contact'].map(function (id) { return document.getElementById(id); });
var navItems = document.querySelectorAll('.nav-item');

var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            var id = entry.target.id;
            navItems.forEach(function (item) {
                var willBeActive = item.getAttribute('data-target') === id;
                if (willBeActive && !item.classList.contains('active')) {
                    item.classList.add('bump');
                    setTimeout(function () { item.classList.remove('bump'); }, 400);
                }
                item.classList.toggle('active', willBeActive);
            });
        }
    });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
sections.forEach(function (s) { if (s) sectionObserver.observe(s); });

// nav click -> smooth scroll + wipe transition
var wipe = document.getElementById('wipe');

navItems.forEach(function (item) {
    item.addEventListener('click', function () {
        var target = document.getElementById(item.getAttribute('data-target'));
        if (!target) return;

        if (!prefersReduced) {
            wipe.classList.remove('active');
            void wipe.offsetWidth;
            wipe.classList.add('active');
            setTimeout(function () {
                target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }, 280);
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.querySelectorAll('.topnav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').replace('#', '');
        var target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});