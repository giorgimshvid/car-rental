const bcrypt = window.dcodeIO.bcrypt;
import { fetchData } from "./api.js";
import {
  saveDataToLocalStorage,
  getDataFromLocalStorage,
  getDataFromSessionStorage,
  saveDataToSessionStorage,
  createUsers,
  removeFromSessionStorage,
} from "./storage.js";

import {
  validateName,
  validatePassword,
  validateEmail,
  validatePasswordMatch,
  checkExistingUser,
} from "./validations.js";
import {
  renderCars,
  renderCarTypesFilter,
  renderCarCapacityFilter,
  togglePasswordVisibility,
  renderHeaderCta,
} from "./ui.js";
import { User } from "./User.js";

const CARS_API =
  "https://raw.githubusercontent.com/Gkhundadze/car-rental-car-data/refs/heads/main/carData.json?v=3";

const searchInput = document.querySelector("#search-input");

let carsArray = [];

const filters = {
  types: [],
  capacities: [],
  prices: [],
};

const pathName = window.location.pathname;

document.addEventListener("DOMContentLoaded", async () => {
  const savedData = await getDataFromLocalStorage("cars");

  if (savedData && !savedData.length) {
    carsArray = savedData;
  } else {
    const cars = await fetchData(CARS_API);
    carsArray = cars;
    saveDataToLocalStorage("cars", cars);
  }

  if (pathName.includes("index")) {
    renderCars(document.querySelector(".popular-car .cars-wrapper"), carsArray);
    const dummyUsersData = await createUsers(hashPassword, User);

    const usersFromLocalStorage = await getDataFromLocalStorage("users");

    if (!usersFromLocalStorage) {
      saveDataToLocalStorage("users", dummyUsersData);
    }

    const userFromSessionStorage = await getDataFromSessionStorage("user");
    const ctaWrapper = document.querySelector(".navigation .cta-wrapper");

    renderHeaderCta(ctaWrapper, userFromSessionStorage);

    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn?.addEventListener("click", () => {
      console.log("Logging out...");
      removeFromSessionStorage("user");
    });
  } else if (pathName.includes("filter")) {
    const slider = document.getElementById("slider");

    const filtersWrapper = document.querySelector("aside form");
    const clearFilterBtn = filtersWrapper.querySelector("#clearFilters");

    const priceRange = carsArray.reduce(
      (acc, car) => {
        acc.min = Math.min(acc.min, car.pricePerDay);
        acc.max = Math.max(acc.max, car.pricePerDay);
        return acc;
      },
      {
        min: carsArray[0].pricePerDay,
        max: 0,
      },
    );

    noUiSlider.create(slider, {
      start: [priceRange.min, priceRange.max], // two handles
      connect: true, // highlight selected range
      range: {
        min: priceRange.min,
        max: priceRange.max,
      },
      step: 1,
    });

    const minEl = document.getElementById("min");
    const maxEl = document.getElementById("max");

    slider.noUiSlider.on("update", (values) => {
      const min = Math.round(values[0]);
      const max = Math.round(values[1]);

      minEl.textContent = min;
      maxEl.textContent = max;

      filters.prices = [min, max];
      applyFilters();
    });

    renderCars(
      document.querySelector(".car-categories .cars-wrapper"),
      carsArray,
    );

    // Extract unique car types and quantity and render them
    const carTypes = carsArray.map((car) => car.type);
    const uniqueTypes = [...new Set(carTypes)];
    const uniqueTypesQuantity = carsArray.reduce((acc, car) => {
      acc[car.type] = !acc[car.type] ? 1 : acc[car.type] + 1;

      return acc;
    }, {});

    renderCarTypesFilter(uniqueTypes, uniqueTypesQuantity);

    // Extract unique seats/capacity and quantity and render them
    const carCapacities = carsArray.map((car) => car.seats);
    const uniqueCapacities = [...new Set(carCapacities)].sort((a, b) => a - b);
    const uniqueCapacitiesQuantity = carsArray.reduce((acc, car) => {
      acc[car.seats] = !acc[car.seats] ? 1 : acc[car.seats] + 1;

      return acc;
    }, {});

    renderCarCapacityFilter(uniqueCapacities, uniqueCapacitiesQuantity);

    function applyFilters() {
      const filteredCarsResult = carsArray.filter((car) => {
        const typeMatch =
          filters.types.length === 0 || filters.types.includes(car.type);
        const capacityMatch =
          filters.capacities.length === 0 ||
          filters.capacities.includes("" + car.seats);
        const priceMatch =
          car.pricePerDay >= filters.prices[0] &&
          car.pricePerDay <= filters.prices[1];
        return typeMatch && capacityMatch && priceMatch;
      });

      renderCars(
        document.querySelector(".car-categories .cars-wrapper"),
        filteredCarsResult,
      );
    }

    filtersWrapper.addEventListener("change", (e) => {
      const selectedFilter = e.target.name;
      const targetType = e.target.dataset.type;

      if (!targetType) return;

      if (!e.target.checked) {
        filters[targetType] = filters[targetType].filter(
          (filter) => filter !== selectedFilter,
        );
      } else {
        filters[targetType].push(selectedFilter);
      }

      applyFilters();
    });

    clearFilterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filters.types = [];
      filters.capacities = [];

      filtersWrapper
        .querySelectorAll("input:checked")
        .forEach((input) => (input.checked = false));

      renderCars(
        document.querySelector(".car-categories .cars-wrapper"),
        carsArray,
      );
    });
  } else if (pathName.includes("sign-up")) {
    const authForm = document.querySelector(".auth-wrapper form");

    const firstName = authForm.querySelector("#firstname");

    const lastName = authForm.querySelector("#lastname");

    const email = authForm.querySelector("#email");

    const password = authForm.querySelector("#password");

    const repeatPassword = authForm.querySelector("#repeat_password");

    const role = authForm.querySelector("#role");

    const togglePasswordBtns = authForm.querySelectorAll(
      ".form__toggle-password",
    );

    togglePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        togglePasswordVisibility(btn.closest(".form__input-wrapper"));
      });
    });

    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstNameValidation = validateName(firstName.value.trim());
      if (!firstNameValidation) {
        console.log("error validating firstname");
        return;
      }

      const lastNameValidation = validateName(lastName.value.trim());
      if (!lastNameValidation) {
        console.log("erorr validating lastname");
        return;
      }

      const emailValidation = validateEmail(email.value.trim());
      if (!emailValidation) {
        console.log("error validating email");
        return;
      }

      const userExists = checkExistingUser(
        email.value.trim(),
        (await getDataFromLocalStorage("users")) || [],
      );
      if (userExists) {
        console.log("User with this email already exists");
        return;
      }

      const passwordValidation = validatePassword(password.value);
      if (!passwordValidation) {
        console.log("error validating password");
        return;
      }

      const retypePasswordValidation = validatePasswordMatch(
        password.value,
        repeatPassword.value,
      );
      if (!retypePasswordValidation) {
        console.log("error validating password match");
        return;
      }

      if (role.value !== "user" && role.value !== "admin") {
        console.log("error validating Role");
        return;
      }
      const hashedPassword = await hashPassword(password.value);

      const newUser = new User(
        firstName.value,
        lastName.value,
        email.value,
        hashedPassword,
        role.value,
      );

      const usersFromLocalStorage = await getDataFromLocalStorage("users");
      saveDataToLocalStorage("users", [...usersFromLocalStorage, newUser]);

      console.log(newUser, newUser.getFullName(), newUser.isAdmin());
      saveDataToSessionStorage("user", newUser);
      authForm.reset();
    });
  } else if (pathName.includes("sign-in")) {
    const authForm = document.querySelector(".auth-wrapper form");

    const togglePasswordBtn = authForm.querySelector(".form__toggle-password");

    const email = authForm.querySelector("#email");

    const password = authForm.querySelector("#password");

    togglePasswordBtn.addEventListener("click", function (e) {
      e.preventDefault();
      togglePasswordVisibility(
        togglePasswordBtn.closest(".form__input-wrapper"),
      );
    });

    const usersDataFromLocalStorage = await getDataFromLocalStorage("users");

    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailValidation = validateEmail(email.value.trim());
      if (!emailValidation) {
        console.log("error validating email");
        return;
      }

      const passwordValidation = validatePassword(password.value);
      if (!passwordValidation) {
        console.log("error validating password");
        return;
      }

      const existingUser = usersDataFromLocalStorage.find(
        (user) => user.email === email.value.trim(),
      );

      if (!existingUser) {
        console.log("No user registered with such email");
        return;
      }

      const passwordMatch = await bcrypt.compare(
        password.value,
        existingUser.password,
      );

      if (!passwordMatch) {
        console.log("Incorrect password");
        return;
      }

      saveDataToSessionStorage("user", existingUser);

      console.log("Login successful", existingUser);
      authForm.reset();

      if (existingUser.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    });
  }
});

searchInput?.addEventListener("input", async (e) => {
  const inputValue = searchInput.value;
  if (inputValue.length >= 2) {
    const filteredCars = carsArray.filter(
      (car) =>
        car.brand.toLowerCase().includes(inputValue.toLowerCase()) ||
        car.model.toLowerCase().includes(inputValue.toLowerCase()),
    );
    if (filteredCars.length === 0) {
      document.querySelector(".car-categories .cars-wrapper").textContent =
        "No Matching Cars Found";
      return;
    }
    renderCars(
      document.querySelector(".car-categories .cars-wrapper"),
      filteredCars,
    );
  } else if (inputValue.length <= 1) {
    renderCars(
      document.querySelector(".car-categories .cars-wrapper"),
      carsArray,
    );
  }
});

async function hashPassword(password) {
  const saltRounds = 5;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
    return hash;
  } catch (err) {
    console.error(err);
  }
}
