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
        <td  class="actions">
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
