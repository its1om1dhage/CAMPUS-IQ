const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN FUNCTION
exports.login = (req, res) => {
  const { employee_id, password } = req.body;

  // 1. Check if fields are filled
  if (!employee_id || !password) {
    return res.status(400).json({ message: "Employee ID and password required" });
  }

  // 2. Find user in database
  const sql = "SELECT * FROM users WHERE employee_id = ?";

  db.query(sql, [employee_id], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // 3. If user not found
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // 4. Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5. Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Send response
    res.json({
      message: "Login successful",
      token,
      mustChangePassword: user.must_change_password,
      user: {
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
  });
};
