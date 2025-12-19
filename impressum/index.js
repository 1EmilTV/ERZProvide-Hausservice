// impressum page interactions
(function () {
    // set year
    const y = document.getElementById("imp-year");
    if (y) y.textContent = new Date().getFullYear();

    // print
    const printBtn = document.getElementById("print-btn");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    // copy email
    const copyBtn = document.getElementById("copy-email");
    const copyMsg = document.getElementById("copy-msg");
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(
                    "erzprovide-hausservice@outlook.de"
                );
                if (copyMsg)
                    copyMsg.textContent =
                        "E‑Mail in die Zwischenablage kopiert.";
                setTimeout(() => {
                    if (copyMsg) copyMsg.textContent = "";
                }, 2500);
            } catch (e) {
                if (copyMsg) copyMsg.textContent = "Kopieren nicht möglich.";
            }
        });
    }
})();
