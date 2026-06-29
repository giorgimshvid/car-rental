const bcrypt = window.dcodeIO ? window.dcodeIO.bcrypt : "";
// const bcrypt = window.dcodeIO.bcrypt;

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
  validateImageURL,
} from "./validations.js";
import {
  renderCars,
  renderCarTypesFilter,
  renderCarCapacityFilter,
  togglePasswordVisibility,
  renderHeaderCta,
  renderUsers,
  renderModal,
  setupModalEvents,
  renderProducts,
} from "./ui.js";
import areObjectsEqual from "./utils.js";
import { User } from "./User.js";
import { AuthService } from "./AuthService.js";

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

  if (pathName.includes("index") || pathName === "/") {
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
      AuthService.logout();
      renderHeaderCta(ctaWrapper, null);
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

      AuthService.login(existingUser);

      console.log("Login successful", existingUser);
      authForm.reset();

      if (existingUser.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    });
  } else if (pathName.includes("dashboard")) {
    const userFromSessionStorage = await getDataFromSessionStorage("user");

    if (!userFromSessionStorage) {
      console.log("No user found in session storage");
      window.location.href = "index.html";
      return;
    } else if (userFromSessionStorage.role !== "admin") {
      console.log("User is not an admin");
      window.location.href = "index.html";
      return;
    }

    const transactionsContainer = document.getElementById(
      "recent-transactions",
    );

    try {
      const data = await fetchData(CARS_API);

      // Take first 4 items
      const recentCars = data.slice(0, 4);

      transactionsContainer.innerHTML = "";

      // Mock dates based on image to look similar
      const mockDates = ["20 July", "19 July", "18 July", "17 July"];

      recentCars.forEach((car, index) => {
        const dateStr = mockDates[index] || "16 July";
        const typeStr = car.type.charAt(0).toUpperCase() + car.type.slice(1);

        const html = `
            <div class="transaction-item">
              <div class="tx-car">
                <img src="${car.image}" alt="${car.model}" class="tx-img" onerror="this.src='https://placehold.co/132x70?text=Car'">
                <div class="tx-details">
                  <h4>${car.brand} ${car.model}</h4>
                  <p>${typeStr} Car</p>
                </div>
              </div>
              <div class="tx-price-date">
                <p>${dateStr}</p>
                <h4>$${car.pricePerDay.toFixed(2)}</h4>
              </div>
            </div>
          `;
        transactionsContainer.insertAdjacentHTML("beforeend", html);
      });
    } catch (error) {
      transactionsContainer.innerHTML =
        '<div style="color: red;">Error loading data.</div>';
      console.error("Error fetching car data:", error);
    }

    // Sidebar Toggle
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.querySelector(".sidebar");
    if (hamburgerBtn && sidebar) {
      hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("open");
      });

      document.addEventListener("click", (e) => {
        if (
          window.innerWidth <= 992 &&
          !sidebar.contains(e.target) &&
          !hamburgerBtn.contains(e.target)
        ) {
          sidebar.classList.remove("open");
        }
      });
    }

    // Logout

    const ctaWrapper = document.querySelector("header.header .cta-wrapper");

    renderHeaderCta(ctaWrapper, userFromSessionStorage);

    const logoutBtn = ctaWrapper.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      AuthService.logout();
      window.location.reload();
    });

    const dashboardContent = document.querySelector(".dashboard-content");
    let originalDashboardHTML = "";

    const templates = {
      inbox: `
            <div class="card" style="grid-column: 1 / -1; min-height: 400px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--text-light)" style="margin-bottom: 16px;">
                 <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <h2 style="font-size: 24px; color: var(--text-dark); margin-bottom: 8px;">Your Inbox is Empty</h2>
              <p style="color: var(--text-light);">You don't have any new messages at the moment.</p>
            </div>
          `,
      users: `
            <div class="card" style="grid-column: 1 / -1; min-height: 400px;">
              <div class="card-title" style="margin-bottom: 24px;">Manage Users</div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; text-align: left; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border); color: var(--text-light);">
                      <th style="padding: 16px; font-weight: 600;">Name</th>
                      <th style="padding: 16px; font-weight: 600;">Role</th>
                      <th style="padding: 16px; font-weight: 600;">Status</th>
                      <th style="padding: 16px; font-weight: 600;">Action</th>
                    </tr>
                  </thead>
                  <tbody class="users-list">


                  </tbody>
                </table>
              </div>
            </div>
          `,
      products: `
            <div class="card" style="grid-column: 1 / -1; min-height: 400px;">
              <div class="card-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <span>Products</span>
                <button class="add-product" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">+ Add Product</button>
              </div>
              <div class="products-table-wrapper" style="overflow-x: auto;">
                <table style="width: 100%; text-align: left; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border); color: var(--text-light);">
                      <th>Image</th>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Transmission</th>
                      <th>Fuel capacity</th>
                      <th>Seats</th>
                      <th>Available</th>
                      <th>Created at</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody class="products-list">


                  </tbody>
                </table>
              </div>
            </div>
          `,
    };

    const navItems = document.querySelectorAll("#main-menu-nav .nav-item");

    navItems.forEach((item) => {
      item.addEventListener("click", async (e) => {
        e.preventDefault();

        const activeItem = document.querySelector(
          "#main-menu-nav .nav-item.active",
        );
        const activeTab = activeItem
          ? activeItem.getAttribute("data-tab")
          : null;

        if (activeTab === "dashboard") {
          originalDashboardHTML = dashboardContent.innerHTML;
        }

        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");

        const newTab = item.getAttribute("data-tab");

        if (newTab === "dashboard") {
          dashboardContent.innerHTML = originalDashboardHTML;
        } else if (templates[newTab]) {
          dashboardContent.innerHTML = templates[newTab];

          if (newTab === "users") {
            let users = await getDataFromLocalStorage("users");
            const usersWrapper =
              dashboardContent.querySelector("tbody.users-list");
            // Render modal HTML into the DOM (once) and wire open/close events

            renderModal("edit-user");
            const { openModal, closeModal } = setupModalEvents();

            const userEditFormWrapper =
              document.querySelector("#edit-user-form");

            renderUsers(usersWrapper, users);

            usersWrapper.addEventListener("click", (e) => {
              if (e.target.classList.contains("remove")) {
                const userId = e.target
                  .closest(".actions")
                  .getAttribute("data-id");
                users = users.filter((u) => u.id !== userId);
                saveDataToLocalStorage("users", users);
                renderUsers(usersWrapper, users);
              }

              if (e.target.classList.contains("edit")) {
                const userId = e.target
                  .closest(".actions")
                  .getAttribute("data-id");
                const userToEdit = users.find((u) => u.id === userId);
                if (userToEdit) {
                  document.getElementById("edit-user-id").value = userToEdit.id;
                  document.getElementById("edit-firstname").value =
                    userToEdit.firstName;
                  document.getElementById("edit-lastname").value =
                    userToEdit.lastName;
                  document.getElementById("edit-email").value =
                    userToEdit.email;
                  document.getElementById("edit-role").value = userToEdit.role;
                  document.getElementById("edit-image").value =
                    userToEdit.profilePhotoUrl;

                  // Clear previous error states
                  document
                    .querySelectorAll("#edit-user-form .form-group")
                    .forEach((g) => g.classList.remove("has-error"));

                  openModal();
                }
              }
            });

            userEditFormWrapper.addEventListener("submit", async (e) => {
              const userId =
                userEditFormWrapper.querySelector("#edit-user-id").value;
              const oldUser = users.find((user) => user.id === userId);

              const firstName =
                userEditFormWrapper.querySelector("#edit-firstname").value;
              const lastName =
                userEditFormWrapper.querySelector("#edit-lastname").value;
              const email =
                userEditFormWrapper.querySelector("#edit-email").value;
              const password =
                userEditFormWrapper.querySelector("#edit-password").value;
              const image =
                userEditFormWrapper.querySelector("#edit-image").value;
              const role =
                userEditFormWrapper.querySelector("#edit-role").value;

              const firstNameValidation = validateName(firstName.trim());
              if (!firstNameValidation) {
                console.log("error validating firstname");
                return;
              }
              const lastNameValidation = validateName(lastName.trim());
              if (!lastNameValidation) {
                console.log("erorr validating lastname");
                return;
              }

              if (image) {
                const imageValidation = await validateImageURL(image);
                if (!imageValidation) {
                  console.log("Error validating the image URL");
                  return;
                }
              }

              if (email !== oldUser.email) {
                const emailValidation = validateEmail(email.trim());
                if (!emailValidation) {
                  console.log("error validating email");
                  return;
                }

                const userExists = checkExistingUser(
                  email.trim(),
                  (await getDataFromLocalStorage("users")) || [],
                );
                if (userExists) {
                  console.log("User with this email already exists");
                  return;
                }
              }

              let hashedPassword = undefined;
              if (password) {
                const passwordValidation = validatePassword(password);
                if (!passwordValidation) {
                  console.log("error validating password");
                  return;
                }

                hashedPassword = await hashPassword(password);
              }

              const newUser = new User(
                firstName,
                lastName,
                email,
                hashedPassword || oldUser.password,
                role,
                image,
              );
              newUser.id = oldUser.id;
              newUser.createdAt = oldUser.createdAt;

              if (!areObjectsEqual(newUser, oldUser)) {
                users = users.map((user) => {
                  if (user.id === userId) {
                    return newUser;
                  }
                  return user;
                });

                await saveDataToLocalStorage("users", users);
                renderUsers(usersWrapper, users);
                console.log("User data has been updated.");
              } else {
                console.log("New user data is same as old user data.");
              }

              closeModal();
            });
          }

          if (newTab === "products") {
            let products = await getDataFromLocalStorage("cars");
            
            renderModal("edit-car");
            const { openModal, closeModal } = setupModalEvents();

            const carEditFormWrapper =
              document.querySelector("#edit-car-form");
            
            const productsWrapper = dashboardContent.querySelector(
              "tbody.products-list",
            );
            const addProductBtn =
              dashboardContent.querySelector(".add-product");


            renderProducts(productsWrapper, products);

            productsWrapper.addEventListener("click", (e) => {

              if (e.target.classList.contains("remove")) {
                const productId = e.target
                  .closest(".actions")
                  .getAttribute("data-id");
                products = products.filter((p) => p.id !== productId);
                saveDataToLocalStorage("cars", products);
                renderProducts(productsWrapper, products);
              }
              if (e.target.classList.contains("edit")) {
                const carId = e.target
                  .closest(".actions")
                  .getAttribute("data-id");
                const carToEdit = products.find((p) => p.id === carId);
                if (carToEdit) {
                  document.getElementById("edit-car-image").value = carToEdit.image;
                  document.getElementById("edit-car-brand").value = carToEdit.brand;
                  document.getElementById("edit-car-model").value = carToEdit.model;
                  document.getElementById("edit-car-type").value = carToEdit.type;
                  document.getElementById("edit-car-price").value = carToEdit.pricePerDay;
                  document.getElementById("edit-car-transmission").value = carToEdit.transmission;
                  document.getElementById("edit-car-fuel").value = carToEdit.fuelCapacity;
                  document.getElementById("edit-car-seats").value = carToEdit.seats;
                  document.getElementById("edit-car-available").value = carToEdit.available;

                  // Clear previous error states
                  document
                    .querySelectorAll("#edit-car-form .form-group")
                    .forEach((g) => g.classList.remove("has-error"));

                  openModal();
                }

              }
            });

            addProductBtn.addEventListener("click", () => {
              console.log(addProductBtn);
            });
          }
        }
      });
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
