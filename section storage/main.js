const form = document.getElementById("contact-form");

const inputs = form.querySelectorAll("input, textarea");

// ----------------------------
// LOAD SAVED VALUES
// ----------------------------

inputs.forEach(input => {

    const saved =
        sessionStorage.getItem(`form_${input.name}`);

    if (saved) {
        input.value = saved;
    }

    // ----------------------------
    // SAVE AS USER TYPES
    // ----------------------------

    input.addEventListener("input", () => {

        sessionStorage.setItem(
            `form_${input.name}`,
            input.value
        );

    });

});

// ----------------------------
// CLEAR STORAGE ON SUBMIT
// ----------------------------

form.addEventListener("submit", (e) => {

    e.preventDefault();

    alert("Form submitted successfully!");

    inputs.forEach(input => {

        sessionStorage.removeItem(
            `form_${input.name}`
        );

    });

    form.reset();

});