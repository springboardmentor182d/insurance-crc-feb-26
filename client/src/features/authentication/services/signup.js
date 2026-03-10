// Authentication signup service
export const signupUser = async (fullName, email, password) => {
  try {
    const response = await fetch('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, data: data };
    } else {
      return { success: false, error: data.message || 'Signup failed' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to connect to backend' };
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
