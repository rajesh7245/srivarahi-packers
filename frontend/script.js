document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault(); // stop page refresh

  const bookingData = {
  name: document.getElementById("name").value,
  phone: document.getElementById("phone").value,
  from: document.getElementById("from").value,
  to: document.getElementById("to").value,
  service: document.getElementById("service").value,
  date: document.getElementById("date").value
};


  fetch("http://localhost:5000/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("bookingForm").reset();
  })
  .catch(err => alert("Error: " + err));
});

// ================================
// SCROLL REVEAL EFFECT
// ================================
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
revealOnScroll(); // run once on page load