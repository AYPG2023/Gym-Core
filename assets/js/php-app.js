(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    window.lucide?.createIcons();

    document.querySelector("#mobileMenuButton")?.addEventListener("click", function () {
      document.querySelector("#mobileNav")?.classList.toggle("hidden");
    });

    document.querySelectorAll("[data-confirm]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        if (!confirm(form.dataset.confirm || "Confirmar accion?")) event.preventDefault();
      });
    });

    document.querySelector("[data-open-form]")?.addEventListener("click", function () {
      document.querySelector("#recordForm")?.classList.toggle("hidden");
      document.querySelector("#recordForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.querySelectorAll("[data-table-filter]").forEach(function (input) {
      input.addEventListener("input", function () {
        const query = input.value.toLowerCase();
        input.closest(".panel").querySelectorAll("tbody tr").forEach(function (row) {
          row.hidden = query && !row.textContent.toLowerCase().includes(query);
        });
      });
    });

    const chart = document.querySelector("#dashboardChart");
    if (chart && window.Chart) {
      new Chart(chart, {
        type: "bar",
        data: {
          labels: ["Clientes", "Reservas", "Clases", "Equipos"],
          datasets: [{
            label: "Total",
            data: [chart.dataset.clients, chart.dataset.reservations, chart.dataset.classes, chart.dataset.machines].map(Number),
            backgroundColor: ["#14b8a6", "#a3e635", "#f97316", "#111827"],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: "#e2e8f0" } }, x: { grid: { display: false } } }
        }
      });
    }

    setTimeout(function () {
      document.querySelectorAll(".toast").forEach(function (toast) {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-6px)";
        setTimeout(function () { toast.remove(); }, 220);
      });
    }, 3600);
  });
})();

