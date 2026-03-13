let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    active: true,
  },
];

export const getAllUsers = (search, sort) => {
  let result = [...users];

  // Apply search filter if provided
  if (search) {
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Apply sorting if provided
  if (sort && (sort === "asc" || sort === "desc")) {
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return result;
};

export const createUser = (data) => {
  const user = {
    id: users.length + 1,
    name: data.name,
    email: data.email,
    active: true,
  };
  // validar email com regex para validar o formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error("Invalid email format");
  }
  // se email já existir, lançar erro
  if (users.some((u) => u.email === user.email)) {
    throw new Error("Email already exists");
  }

  users.push(user);
  return user;
};

export const updateUser = (userId, data) => {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.name = data.name ?? user.name;
  user.email = data.email ?? user.email;
  user.active = data.active ?? user.active;

  return user;
};

export const toggleUserActive = (userId) => {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.active = !user.active;
  return user;
};

export const deleteUser = (userId) => {
  users = users.filter((u) => u.id !== userId);
};

export const getUserStats = () => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const inactiveUsers = totalUsers - activeUsers;
  const activePercentage =
    totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    activePercentage: activePercentage.toFixed(2) + "%",
  };
};
