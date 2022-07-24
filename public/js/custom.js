//Scroll to top function
let span = document.querySelector(".up");
window.onscroll = function () {
    // console.log(this.scrollY);
    if (this.scrollY >= 800) {
        span.classList.add("show");
    } else {
        span.classList.remove("show");
    }
}
span.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

//Form Validation function
(function () {
  'use strict'
  const forms = document.querySelectorAll('.requires-validation')
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
})();

//Post Method function
// async function onSubmit(e) {
//   e.preventDefault();
//   const res = await fetch("", {
//   method: "POST",
//   });
//   console.log(res);
// }

//Scroll Reveal library Function
ScrollReveal({
  reset: true,
  distance: '30px',
  duration: 2000,
  delay: 400
});
ScrollReveal().reveal('.home-cover h1', { delay: 100, origin: "top"});
ScrollReveal().reveal('.home .left h5', { delay: 100, origin: "left"});
ScrollReveal().reveal('.home .left .box', { delay: 600, origin: "top"});
ScrollReveal().reveal('.home .right .content', { delay: 100, origin: "right" });
ScrollReveal().reveal('footer .box.one', { delay: 100, origin: "left" });
ScrollReveal().reveal('footer .box.two', { delay: 300, origin: "left" });
ScrollReveal().reveal('footer .box.three', { delay: 500, origin: "left" });
ScrollReveal().reveal('footer .box.four', { delay: 700, origin: "left" });
ScrollReveal().reveal('.test-center h4', { delay: 100, origin: "left" });
ScrollReveal().reveal('.about-content h1, .company-profile h1, .our-customers h1, .gec h2, .cec h2, .bec h2, .ekc h2, .toefl h2, .arabic-courses h2, .other-language h2, .D-Max h2, .photoshop h2, .autocade h2, .mcsa h2, .ccna h2, .icdl-course h2, .icdl-exam h2, .bmc h2, .hrmc h2, .dmm h2, .smc h2, .pmp h2, .scm h2, .hmd h2, .soft-skills h2, .gec h2, .teaching-preschool h2, .teaching-primary h2, .teaching-math-science h2, .tefl h2, .online-course h2, .summer-programe h2, .french-for-kids h2, .toefl-exam h2, .icdl-exam h2, .preschool h2, .cambridge-exams h2, .cambridge-bussiness-exams h2, .cambridge-teaching-exams h2, .head-office h2', { delay: 100, origin: "left" });

//Modern Slider Function
const slides = document.querySelectorAll(".slide");
for (const slide of slides) {
  slide.addEventListener("click", () => {
    removeActiveClass();
    slide.classList.add("active");
  });
}
function removeActiveClass() {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
}

//Input dropdown function
// const selected = document.querySelector(".selected");
// const optionsContainer = document.querySelector(".options-container");
// const optionsList = document.querySelectorAll(".option");
// selected.addEventListener("click", () => {
//   optionsContainer.classList.toggle("active");
// });
// optionsList.forEach(o => {
//   o.addEventListener("click", () => {
//     selected.innerHTML = o.querySelector("label").innerHTML;
//     optionsContainer.classList.remove("active");
//   });
// });