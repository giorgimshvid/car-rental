export async function saveDataToLocalStorage(key, data) {
  try {
    if (!key || !data) {
      throw new Error("No key or data provided");
    }

    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

export async function saveDataToSessionStorage(key, data) {
  try {
    if (!key || !data) {
      throw new Error("No key or data provided");
    }

    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

export async function getDataFromLocalStorage(key) {
  try {
    if (!key) {
      throw new Error("No key provided");
    }
    const data = localStorage.getItem(key);
    if (!data) {
      throw new Error("No data found for the provided key");
    }
    if (JSON.parse(data).length === 0) {
      throw new Error("The data array is empty");
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function getDataFromSessionStorage(key) {
  try {
    if (!key) {
      throw new Error("No key provided");
    }
    const data = sessionStorage.getItem(key);
    if (!data) {
      throw new Error("No data found for the provided key");
    }
    if (JSON.parse(data).length === 0) {
      throw new Error("The data array is empty");
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}


export async function createUsers(hashPassword,User) {
  const userData = [
    { firstName: "Alice", lastName: "Johnson", email: "alice@example.com", password: "Admin@1234!", role: "admin" },
    { firstName: "Bob", lastName: "Smith", email: "bob@example.com", password: "Bob$ecure9", role: "user" },
    { firstName: "Carol", lastName: "Williams", email: "carol@example.com", password: "Carol!Pass3", role: "user" },
    { firstName: "David", lastName: "Brown", email: "david@example.com", password: "D@vid2025X", role: "user" },
    { firstName: "Eve", lastName: "Davis", email: "eve@example.com", password: "Eve#Strong7", role: "user" },
  ];

  const users = await Promise.all(
    userData.map(async (u) => {
      const hashed = await hashPassword(u.password);
      return new User(u.firstName, u.lastName, u.email, hashed, u.role);
    })
  );

  return users;
}