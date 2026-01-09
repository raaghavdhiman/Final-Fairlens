const API_URL = "http://localhost:3001";

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  role: "PUBLIC" | "CONTRACTOR" | "GOVERNMENT";
}) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json(); // { access_token }
}

export async function login(data: {
  email: string;
  password: string;
}) {
  console.log("LOGIN REQUEST:", data); // 👈 ADD THIS

  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text(); // 👈 ADD
    console.error("LOGIN FAILED:", text);
    throw new Error("Login failed");
  }

  return res.json();
}

