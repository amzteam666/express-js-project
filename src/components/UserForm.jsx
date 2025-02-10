import { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css"; 

const UserForm = () => {
  const [name, setName] = useState(""); // Input for university name
  const [users, setUsers] = useState([]); // Universities list
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Pagination limit

  // 📌 Fetch Universities from Backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📌 Handle University Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("University Name is required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/add-user", { name });
      alert("University added successfully!");
      setName("");
      fetchUsers();
    } catch (error) {
      console.error("Error adding University:", error);
      alert("Failed to add university.");
    }
  };

  // 📌 Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <img src="Online Course.png" alt="Logo" />
        </div>
        <nav>
          <ul>
            <li><i className="fas fa-tachometer-alt"></i> Dashboard</li>
            <li className="active"><i className="fas fa-university"></i> Universities</li>
            <li><i className="fas fa-book"></i> Courses</li>
            <li><i className="fas fa-user-graduate"></i> Students</li>
            <li><i className="fas fa-sign-out-alt"></i> Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <h2 className="main-header">University Management System</h2>
        <h2 className="main-title">Universities</h2>
        <h1 className="title">Please add a new University</h1>

        {/* 📌 University Form */}
        <div className="form-container">
          <label htmlFor="university-name">University Name</label>
          <input
            type="text"
            id="university-name"
            placeholder="Enter University Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="buttons">
            <button className="save" onClick={handleSubmit}>Save</button>
            <button className="cancel">Cancel</button>
          </div>
        </div>

        {/* 📌 Universities Table */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>University Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <i className="fas fa-trash delete"></i>
                  <i className="fas fa-edit edit"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📌 Pagination */}
        <div className="pagination">
          <span>Showing {currentUsers.length} out of {users.length} entries</span>
          <div className="pages">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
              <button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === Math.ceil(users.length / usersPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserForm;
