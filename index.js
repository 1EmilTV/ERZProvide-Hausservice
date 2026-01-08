const navbar = document.getElementsByTagName("nav")[0];

window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Multi-slider before/after implementation
const sliders = document.querySelectorAll(".imges .wrapper");

sliders.forEach((wrapper) => {
    const scroller = wrapper.querySelector(".scroller");
    const after = wrapper.querySelector(".after");
    let active = false;

    let currentPercent = 20;

    function setPosition(x) {
        const rect = wrapper.getBoundingClientRect();
        const width = rect.width;
        const clamped = Math.max(0, Math.min(x, width));
        const percent = (clamped / width) * 100;
        currentPercent = percent;
        // clip the after layer from the right so left of scroller shows AFTER image
        after.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        const scrollerWidth = scroller.getBoundingClientRect().width;
        scroller.style.left = clamped - scrollerWidth / 2 + "px";
    }

    // recompute positions on resize to keep same percentage
    window.addEventListener("resize", function () {
        const rect = wrapper.getBoundingClientRect();
        setPosition((rect.width * currentPercent) / 100);
    });

    function start(e) {
        active = true;
        scroller.classList.add("scrolling");
        // add move listeners to window to avoid multiple attachments
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
        window.addEventListener("touchmove", move, { passive: false });
        window.addEventListener("touchend", end);
    }

    function end() {
        active = false;
        scroller.classList.remove("scrolling");
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", end);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
    }

    function move(e) {
        if (!active) return;
        if (e.touches && e.touches.length) {
            e.preventDefault();
        }
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const left = wrapper.getBoundingClientRect().left;
        const x = clientX - left;
        setPosition(x);
    }

    // click or touch on wrapper should move handle
    wrapper.addEventListener("mousedown", function (e) {
        start(e);
        move(e);
    });
    scroller.addEventListener("mousedown", start);

    wrapper.addEventListener(
        "touchstart",
        function (e) {
            start(e);
            move(e);
        },
        { passive: false }
    );
    scroller.addEventListener("touchstart", start, { passive: false });

    // initialize to 20% from left
    window.addEventListener("load", function () {
        const rect = wrapper.getBoundingClientRect();
        setPosition(rect.width * 0.2);
    });

    // ensure it also initializes if images are cached (in case load fired earlier)
    const rect = wrapper.getBoundingClientRect();
    if (rect.width) setPosition(rect.width * 0.2);
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".email-form");
    const checkbox = document.getElementById("datenschutz");
    const submitBtn = document.getElementById("submit-btn");

    function updateSubmit() {
        const fieldsValid = form ? form.checkValidity() : false;
        const consent = checkbox ? checkbox.checked : false;
        const enabled = fieldsValid && consent;
        submitBtn.disabled = !enabled;
    }

    // initialize state
    if (submitBtn) submitBtn.disabled = true;
    if (checkbox) checkbox.addEventListener("change", updateSubmit);
    if (form) form.addEventListener("input", updateSubmit);
    updateSubmit();
});

const resetbtn = document.getElementById("resetbtn");
const submitBtn = document.getElementById("submit-btn");
resetbtn.addEventListener("click", function () {
    submitBtn.disabled = true;
});

// Footer: set current year
(function () {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
// Mobile nav toggle
(function () {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Menü schließen");
        // trap focus on first link
        const firstLink = menu.querySelector("a");
        if (firstLink) firstLink.focus();
    }

    function closeMenu() {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Menü öffnen");
        toggle.focus();
    }

    toggle.addEventListener("click", function () {
        if (menu.classList.contains("open")) closeMenu();
        else openMenu();
    });

    // close when clicking a link
    menu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") closeMenu();
    });

    // close on ESC
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
})();
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".email-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Verhindert das direkte Neuladen

        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    form.reset(); // Leert die Felder
                    setTimeout(() => {
                        location.reload(); // Lädt die Seite nach 1 Sekunde neu
                    }, 1000);
                } else {
                    alert("Fehler beim Senden der Nachricht!");
                }
            })
            .catch((error) => console.error("Fehler:", error));
    });
});

// Scroll-in observer for service/about images
(function () {
    // Respect reduced motion preference
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        document
            .querySelectorAll(".imges .wrapper, .about .person img")
            .forEach((el) => el.classList.add("in-view"));
        return;
    }

    const obs = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    // also mark containing service or person so related content can animate
                    const parentService = entry.target.closest(".service");
                    if (parentService) parentService.classList.add("in-view");
                    const parentPerson = entry.target.closest(".person");
                    if (parentPerson) parentPerson.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    document
        .querySelectorAll(".imges .wrapper, .about .person img")
        .forEach((el) => obs.observe(el));
})();
