import { fetchData } from "./api.js";
import { saveDataToLocalStorage, getDataFromLocalStorage } from "./storage.js";
import {
  renderCars,
  renderCarTypesFilter,
  renderCarCapacityFilter,
} from "./ui.js";

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
  } else if (pathName.includes("filter")) {
    const slider = document.getElementById("slider");

    const filtersWrapper = document.querySelector("aside form");
    const clearFilterBtn = filtersWrapper.querySelector('#clearFilters');
    const priceRangeChangeDetect = filtersWrapper.querySelector('#priceRangeChangeDetect');

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
      // priceRangeChangeDetect.checked = !priceRangeChangeDetect.checked;
      priceRangeChangeDetect.value = min+max;
      
      setTimeout(() => {
        const filteredCarsByPrice = carsArray.filter((car) => {
          if (car.pricePerDay >= min && car.pricePerDay <= max) {
            return car;
          }
        });
      }, 2000);
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

    filtersWrapper.addEventListener("change", (e) => {
      const selectedFilter = e.target.name;
      const targetType = e.target.dataset.type;

      if (!e.target.checked) {
        filters[targetType] = filters[targetType].filter(
          (filter) => filter !== selectedFilter,
        );
      } else {
        filters[targetType].push(selectedFilter);
      }

      const filteredCarsResult = carsArray.filter(car => {
        return (
          filters.types.includes(car.type) ||
          filters.capacities.includes('' + car.seats) ||
          (car.pricePerDay >= filters.prices[0] && car.pricePerDay <= filters.prices[1])
        );
      });  

      renderCars(
        document.querySelector(".car-categories .cars-wrapper"),
        filteredCarsResult,
      );
    });

    clearFilterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filters.types = [];
      filters.capacities = [];

      filtersWrapper.querySelectorAll('input:checked').forEach(input => input.checked = false);

      renderCars(
        document.querySelector(".car-categories .cars-wrapper"),
        carsArray
      );
    })

  }
});

searchInput.addEventListener("input", async (e) => {
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
