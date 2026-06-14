const bcrypt = require("bcryptjs");
const pool = require("../config/database");

const register = async (req, res) => {
	try {
		const {name, email, password} = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({error: "Name, email, and password are required"});
		}

		const existingUser = await pool.query(`
        SELECT id
        FROM users
        WHERE email = $1;
      `, [email]);

		if (existingUser.rows.length > 0) {
			return res.status(409).json({error: "User already exists"});
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const result = await pool.query(`
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at;
      `, [name, email, passwordHash,]);

		return res.status(201).json({message: "User registered successfully", user: result.rows[0]});
	} catch (error) {
		console.error("Error registering user:", error);

		return res.status(500).json({error: "Failed to register user"});
	}
};

module.exports = {
	register
};
