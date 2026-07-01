export function renderCars(wrapperEl, carsArr) {
  wrapperEl.innerHTML = "";
  try {
    carsArr.forEach((car) => {
      const carContainer = `
      <div class="car-container">
            <header>
              <h2 title="${car.brand + " - " + car.model}">${car.brand + " - " + car.model}</h2>
              <h3>${car.type}</h3>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                  stroke="#90A3BF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </header>
            <div class="img-container">
              <img
                src=${car.image}
                alt="${car.brand + car.model + car.type} image"
                width="235"
                height="235"
              />
            </div>
            <div class="car-description">
              <div class="container">
                <img
                  src="assets/images/icons/gas-station.svg"
                  alt="gas-station"
                />
                <span>${car.fuelCapacity}L</span>
              </div>
              <div class="container">
                <img src="assets/images/icons/Car.svg" alt="car" />
                <span>${car.transmission}</span>
              </div>
              <div class="container">
                <img
                  src="assets/images/icons/profile-user.svg"
                  alt="profile-user"
                />
                <span>${car.seats} People</span>
              </div>
            </div>

            <div class="price-container">
              <div>
                <h2>$${car.pricePerDay.toFixed(2)}/</h2>
                <span>day</span>
              </div>
              <button>Rent Now</button>
            </div>
          </div>`;

      wrapperEl.insertAdjacentHTML("beforeend", carContainer);
    });
  } catch (error) {
    console.error(error);
  }
}
export function renderCarTypesFilter(carTypes, carTypesQuantity) {
  const typesWrapper = document.querySelector(".filters.type-filter");
  carTypes.forEach((type) => {
    const typeContainer = `
      <div class="filter-wrapper">
          <input type="checkbox" name="${type}" id="type-filter-${type}" data-type="types"/>
          <label for="type-filter-${type}">${type}</label>
          <span class="quantity">(${carTypesQuantity[type]})</span>
      </div>`;
    typesWrapper.insertAdjacentHTML("beforeend", typeContainer);
  });
}
export function renderCarCapacityFilter(carCapacity, carCapacityQuantity) {
  const capacityWrapper = document.querySelector(".filters.capacity-filter");
  carCapacity.forEach((seats) => {
    const capacityContainer = `
      <div class="filter-wrapper">
              <input type="checkbox" name="${seats}" id="capacity-filter-${seats}-person" data-type="capacities"/>
              <label for="capacity-filter-${seats}-person">${seats} Person</label>
              <span class="quantity">(${carCapacityQuantity[seats]})</span>
            </div>`;
    capacityWrapper.insertAdjacentHTML("beforeend", capacityContainer);
  });
}
export function togglePasswordVisibility(wrapper) {
  const buttonText = wrapper.querySelector(".form__toggle-icon");
  const passwordElement = wrapper.querySelector(".form__input-password");
  passwordElement.setAttribute(
    "type",
    passwordElement.getAttribute("type") === "password" ? "text" : "password",
  );
  buttonText.textContent = buttonText.textContent === "Show" ? "Hide" : "Show";
}

export function renderHeaderCta(wrapper, user) {
  const ctaContent = `
    ${
      user
        ? `
      <div class="cta-btns">
        <a href="">
          <img
            class="heart-button"
            src="assets/images/icons/heart.svg"
            alt="heart"
            width="24px"
          />
        </a>
        <a class="notification-button">
          <img
            src="assets/images/icons/notification.svg"
            alt="notifications"
            width="24px"
          />
        </a>
        <a href="">
          <img
            class="settings-button"
            src="assets/images/icons/setting.svg"
            alt="settings"
            width="24px"
          />
        </a>
        <div class="profile-image">
          <img
            src="${user.profilePhotoUrl}"
            alt="Profile"
            width="44px"
          />
        </div>
      </div>
    `
        : ""
    }
    ${
      user
        ? `
      <div class="cta-auth-btns">
        <button class="logout-btn">Log out</button>
      </div>
    `
        : `
      <div class="cta-auth-btns">
        <a href="sign-up.html">Sign up</a>
        <a href="sign-in.html">Sign in</a>
      </div>
    `
    }`;

  wrapper.innerHTML = ctaContent;
}

export function renderUsers(wrapper, users) {
  wrapper.innerHTML = "";
  users.forEach((user) => {
    const tr = `
      <tr    >
        <td   class="name">
          <div

          >
             <img src="${user.profilePhotoUrl}" alt=${user.firstName} >
          </div>
          <span
            >${user.firstName + " " + user.lastName}</span
          >
        </td>
        <td  class="role">${user.role}</td>
        <td class="status">
          <span

            >Active</span
          >
        </td>
        <td  class="actions" data-id="${user.id}">
          <button class="edit"
           >
            Edit
          </button>
          <button class="remove"
           >
            Delete
          </button>
        </td>
      </tr>
     `;

    wrapper.insertAdjacentHTML("beforeend", tr);
  });
}

export function renderProducts(wrapper, products) {
  wrapper.innerHTML = "";
  products.forEach((product) => {
    const tr = `
      <tr>
        <td class="image">
          <div>
             <img src="${product.image}" alt=${product.brand + " " + product.model} width="40px" >
          </div>
        </td>
        <td class="brand">
          <div>
          <span>${product.brand}</span>
          </div>
        </td>
        <td class="model">
          <div>
          <span>${product.model}</span>
          </div>
        </td>
        <td class="type">
          <div>
          <span>${product.type}</span>
          </div>
        </td>
        <td class="price">
          <div>
          <span>${product.pricePerDay} $</span>
          </div>
        </td>
        <td class="transmission">
          <div>
          <span>${product.transmission}</span>
          </div>
        </td>
        <td class="fuel">
          <div>
          <span>${product.fuelCapacity} L</span>
          </div>
        </td>
        <td class="seats">
          <div>
          <span>${product.seats}</span>
          </div>
        </td>
        <td class="available">
          <div>
          <span>${product.available ? "Yes" : "No"}</span>
          </div>
        </td>
        <td class="created">
          <div>
          <span>${new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </td>
        <td  class="actions" data-id="${product.id}">
          <button class="edit"
           >
            Edit
          </button>
          <button class="remove"
           >
            Delete
          </button>
        </td>
      </tr>
     `;

    wrapper.insertAdjacentHTML("beforeend", tr);
  });
}

/**
 * Injects the Edit User modal HTML into the DOM (only once).
 * Returns the modal overlay element.
 */
export function renderModal(modalCondition) {
  const existing = document.getElementById("edit-user-modal");
  if (existing) return existing;

  const userModal = `
        <div class="modal-box">
          <div class="modal-header">
            <h3>${modalCondition === "edit-user" ? "Edit" : "Create"} User</h3>
            <button class="modal-close-btn" id="close-modal-btn" aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form class="modal-form" id="${modalCondition === "edit-user" ? "edit" : "create"}-user-form" novalidate>
            <input type="hidden" id="user-id" />
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input type="text" id="firstname" placeholder="Enter first name" required />
              <span class="error-msg" id="error-firstname">First name must be between 2 and 50 letters.</span>
            </div>
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input type="text" id="lastname" placeholder="Enter last name" required />
              <span class="error-msg" id="error-lastname">Last name must be between 2 and 50 letters.</span>
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter email address" required />
              <span class="error-msg" id="error-email">Please enter a valid email address.</span>
              <span class="error-msg" id="error-email-exists">This email is already in use.</span>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="text" id="password" placeholder="Enter password" required />
              <span class="error-msg" id="error-password">Please enter a valid password.</span>
            </div>
            <div class="form-group">
              <label for="image">Image</label>
              <input type="text" id="image" placeholder="Enter image URL" required />
              <span class="error-msg" id="error-image">Please enter a valid image URL.</span>
            </div>
            <div class="form-group">
              <label for="role">Role</label>
              <select id="role" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <span class="error-msg" id="error-role">Please select a valid role.</span>
            </div>
            <div class="modal-footer">
              <button type="button" class="modal-btn modal-btn-cancel" id="cancel-modal-btn">Cancel</button>
              <button type="submit" class="modal-btn modal-btn-save">${modalCondition === "edit-user" ? "Save Changes" : "Create User"}</button>
            </div>
          </form>
        </div>
      `;

  const carModal = `
        <div class="modal-box">
          <div class="modal-header">
            <h3>${modalCondition === "edit-car" ? "Edit" : "Create"} Car</h3>
            <button class="modal-close-btn" id="close-modal-btn" aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form class="modal-form" id="${modalCondition === "edit-car" ? "edit" : "create"}-car-form" novalidate>
            <input type="hidden" id="car-id" />
            <div class="form-group">
              <label for="car-brand">Brand</label>
              <input type="text" id="car-brand" placeholder="Enter brand" required />
              <span class="error-msg" id="error-car-brand">Brand must be between 2 and 50 characters.</span>
            </div>
            <div class="form-group">
              <label for="car-model">Model</label>
              <input type="text" id="car-model" placeholder="Enter model" required />
              <span class="error-msg" id="error-car-model">Model must be between 2 and 100 characters.</span>
            </div>
            <div class="form-group">
              <label for="car-type">Type</label>
              <select id="car-type" required>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="convertible">Convertible</option>
                <option value="pickup">Pickup</option>
                <option value="minivan">Minivan</option>
                <option value="coupe">Coupe</option>
                 <option value="sport">Sport</option>
                <option value="supercar">Supercar</option>


              </select>
              <span class="error-msg" id="error-car-type">Please select a valid car type.</span>
            </div>
            <div class="form-group">
              <label for="car-price">Price Per Day ($)</label>
              <input type="number" id="car-price" placeholder="Enter price per day" min="1" required />
              <span class="error-msg" id="error-car-price">Price must be a positive number.</span>
            </div>
            <div class="form-group">
              <label for="car-image">Image URL</label>
              <input type="text" id="car-image" placeholder="Enter image URL" required />
              <span class="error-msg" id="error-car-image">Please enter a valid image URL.</span>
            </div>
            <div class="form-group">
              <label for="car-transmission">Transmission</label>
              <select id="car-transmission" required>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <span class="error-msg" id="error-car-transmission">Please select a valid transmission type.</span>
            </div>
            <div class="form-group">
              <label for="car-fuel">Fuel Capacity (L)</label>
              <input type="number" id="car-fuel" placeholder="Enter fuel capacity" min="1" required />
              <span class="error-msg" id="error-car-fuel">Fuel capacity must be a positive number.</span>
            </div>
            <div class="form-group">
              <label for="car-seats">Seats</label>
              <input type="number" id="car-seats" placeholder="Enter number of seats" min="1" max="20" required />
              <span class="error-msg" id="error-car-seats">Seats must be between 1 and 20.</span>
            </div>
            <div class="form-group">
              <label for="car-available">Available</label>
              <select id="car-available" required>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span class="error-msg" id="error-car-available">Please select availability.</span>
            </div>
            <div class="modal-footer">
              <button type="button" class="modal-btn modal-btn-cancel" id="cancel-modal-btn">Cancel</button>
              <button type="submit" class="modal-btn modal-btn-save">${modalCondition === "edit-car" ? "Save Changes" : "Create Car"}</button>
            </div>
          </form>
        </div>
      `;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  switch (modalCondition) {
    case "edit-user":
      modal.id = "edit-user-modal";
      modal.innerHTML = userModal;
      break;
    case "edit-car":
      modal.id = "edit-car-modal";
      modal.innerHTML = carModal;
      break;
    case "create-user":
      modal.id = "create-user-modal";
      modal.innerHTML = userModal;
      break;
    case "create-car":
      modal.id = "create-car-modal";
      modal.innerHTML = carModal;
      break;
    default:
  }

  document.body.appendChild(modal);
  return modal;
}

/**
 * Sets up open/close behavior for the Edit User modal.
 * @param {Function} onOpen  - optional callback when modal opens
 * @param {Function} onClose - optional callback when modal closes
 * @returns {{ openModal: Function, closeModal: Function }}
 */
export function setupModalEvents(onOpen, onClose) {
  const modal = document.querySelector(".modal-overlay");
  if (!modal) return {};

  const closeModal = () => {
    document.body.style.overflow = "initial";
    modal.classList.remove("active");
    modal.remove();
    if (typeof onClose === "function") onClose();
  };

  const openModal = () => {
    document.body.style.overflow = "hidden";
    modal.classList.add("active");
    if (typeof onOpen === "function") onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  /*
    


  */

  // Close on X button
  document
    .getElementById("close-modal-btn")
    ?.addEventListener("click", closeModal);

  // Close on Cancel button
  document
    .getElementById("cancel-modal-btn")
    ?.addEventListener("click", closeModal);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  document
    .querySelector(".modal-overlay form")
    .addEventListener("submit", handleSubmit);

  return { openModal, closeModal };
}
