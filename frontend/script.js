document.addEventListener("DOMContentLoaded", () => {

  /* ================================
     BOOKING FORM SUBMIT
  ================================ */
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const bookingData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        from: document.getElementById("from").value,
        to: document.getElementById("to").value,
        service: document.getElementById("service").value,
        date: document.getElementById("date").value
      };

      fetch("/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Network error");
          }
          return res.json();
        })
        .then(data => {
          alert(data.message || "Booking submitted successfully");
          bookingForm.reset();
        })
        .catch(err => {
          console.error("Booking Error:", err);
          alert("Booking failed. Please try again.");
        });
    });
  }

  /* ================================
     SCROLL REVEAL EFFECT
  ================================ */
  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // run once on load

});

/* ================================
   MOBILE SIDEBAR MENU
================================ */
function openMenu() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.style.right = "0";
}

function closeMenu() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.style.right = "-260px";
}
