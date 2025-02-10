import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css"; // Ensure your styles are included

const CoursePage = () => {
  const [universities, setUniversities] = useState([]); // Universities list
  const [courses, setCourses] = useState([]); // Courses list
  const [selectedUniversity, setSelectedUniversity] = useState(""); // Selected university ID
  const [courseName, setCourseName] = useState(""); // Course name input
  const [dropdownActive, setDropdownActive] = useState(false); // Dropdown visibility

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // 📌 Fetch Universities from Backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/universities")
      .then((res) => {
        console.log("Fetched Universities:", res.data);
        setUniversities(res.data);
      })
      .catch((err) => console.error("Error fetching universities:", err));
  }, []);

  // 📌 Fetch Courses from Backend
  const fetchCourses = () => {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => {
        console.log("Fetched Courses:", res.data);
        setCourses(res.data);
      })
      .catch((err) => console.error("Error fetching courses:", err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle Form Submission to Add Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !selectedUniversity) {
      alert("Please enter course name and select a university!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/courses", {
        name: courseName,
        userId: selectedUniversity,
      });

      alert("Course added successfully!");
      setCourseName("");
      setSelectedUniversity("");
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course.");
    }
  };

  // Pagination Logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="main-container">
      <aside className="side-nav">
        <div className="logo">
          <img src="Online Course.png" alt="Logo" />
        </div>
        <nav>
          <ul className="nav-list">
            <li><i className="fas fa-tachometer-alt"></i> Dashboard</li>
            <li className="active"><i className="fas fa-university"></i> Universities</li>
            <li><i className="fas fa-book"></i> Courses</li>
            <li><i className="fas fa-user-graduate"></i> Students</li>
            <li><i className="fas fa-sign-out-alt"></i> Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h2 className="main-heading">University Management System</h2>
        <h2 className="page-header">Courses</h2>
        <h1 className="section-title">Please add a new Course</h1>

        {/* Course Form */}
        <div className="form-wrapper">
          <div className="student-form">
            <label htmlFor="course-name">Course Name</label>
            <input
              type="text"
              id="course-name"
              placeholder="Enter Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <div className="action-buttons">
              <button className="btn-save" onClick={handleSubmit}>Save</button>
              <button className="btn-cancel">Cancel</button>
            </div>
          </div>

          {/*  Universities Dropdown */}
          <div className="university-dropdown">
            <b><label htmlFor="university-name">Select University</label></b>
            <div
              className={`custom-dropdown ${dropdownActive ? "active" : ""}`}
              onClick={() => setDropdownActive(!dropdownActive)}
            >
              <span>{selectedUniversity ? universities.find(u => u.id === Number(selectedUniversity))?.name : "Select University"} ▼</span>
              <div className="dropdown-options">
                {universities.map((university) => (
                  <label key={university.id}>
                    {university.name}
                    <input
                      type="radio"
                      name="university"
                      value={university.id}
                      checked={selectedUniversity === university.id.toString()}
                      onChange={(e) => {
                        setSelectedUniversity(e.target.value);
                        setDropdownActive(false);
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>University Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.user?.name || "Unknown"}</td>
                  <td>
                    <i className="fas fa-trash icon-delete"></i>
                    <i className="fas fa-edit icon-edit"></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/*  Pagination Controls */}
        <div className="pagination-wrapper">
          <span>
            Showing {indexOfFirstCourse + 1} - {Math.min(indexOfLastCourse, courses.length)} of {courses.length} entries
          </span>
          <div className="pagination-pages">
            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            {[...Array(totalPages).keys()].map(num => (
              <button
                key={num + 1}
                className={currentPage === num + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(num + 1)}
              >
                {num + 1}
              </button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
